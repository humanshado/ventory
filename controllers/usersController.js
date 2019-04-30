const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');

//display login form
router.get('/login', (req, res) => res.render('users/login'));

//post login user data
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//User profile page
router.get('/profile', isloggedIn, (req, res) => {
    console.log('req.user', req.user);
    console.log('req.isAuthenticated', req.isAuthenticated());
    res.render('users/profile', { user: req.user });
});

//logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//display signup form
router.get('/signup', (req, res) => res.render('users/signup'));

//create new user and login automatically
router.post('/signup', (req, res, next) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];


  //validations
  if(!firstName || !lastName || !email || !password || !password2){
      errors.push({ msg: 'Please fill in all fields'});
  }

  if(password !== password2){
    errors.push({ msg: 'Password did not match'});
  }

  if(password.length < 7 || password.length > 25){
    errors.push({ msg: 'Password must be between 7 and 25 characters long'});
  }

  if(errors.length > 0){
    res.render('users/signup', { errors, firstName, lastName, email, password, password2 });
  }else{
    User.findOne({ email: email })
      .then(user => {
        if(user){
          errors.push({ msg: 'Email is already registered' });
          res.render('users/signup', { errors, firstName, lastName, email, password, password2 });
        }else{
          //create new user instance
          let user = new User({ firstName, lastName, email, password});
          //hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hashed_password) => {
              if(err) throw err;
              user.password = hashed_password;
              //save new user
              user.save((err, user) => {
                  console.log('new user', user);

                  //login new user automatically
                  passport.authenticate('local', (err, user) => {
                    if (err) { return next(err); }
                    if (!user) {
                      req.flash('error_msg', 'Registration failed! Try again please');
                      return res.redirect('/signup');
                    }
                    req.logIn(user, (err) => {
                      if (err) { return next(err); }
                      console.log('automatically logged in', user);
                      user.last_logged_in = moment(Date.now()).fromNow();
                      req.flash('success_msg',`${user.firstName}, You are now registered and logged in`);
                      return res.redirect('/profile');
                    });
                  })(req, res, next);
                })
              })
            })
        }
      }).catch(err => console.log(err));
  }
}); //create new user

function isloggedIn (req, res, next) {
    console.log('req.user in isLoggedIn function', req.user);
    console.log('req.isAuthenticated', req.isAuthenticated());

    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Access denied! Please login');
    res.redirect('/login');
}

module.exports = router;
