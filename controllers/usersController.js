const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
const auth = require('../config/auth');

//display login form
router.get('/login', (req, res) => res.render('users/login'));

//post login user data
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: req.session.returnTo || '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
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
                      //console.log('automatically logged in', user);
                      user.last_logged_in = moment(Date.now()).fromNow();
                      //req.flash('success_msg',`${user.firstName}, You are now registered and logged in`);
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

//User profile page
router.get('/profile', auth.onlyAuthorized, (req, res) => {
    res.render('users/profile', { currentUser: req.user ? req.user.firstName : null });
});

//admin Dashboard
router.get('/dashboard', auth.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
      if(err){ console.log(err)};
      console.log('All users: ', users);
      res.render('users/dashboard', {
          currentUser : req.user.firstName,
          adminId: req.user.id,
          users : users
      });
    });
});

module.exports = router;
