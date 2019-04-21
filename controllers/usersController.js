const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//display login form
exports.getLoginForm = (req, res) => res.render('users/login');

//post login user data
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/items',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}

//logout user
exports.getLogOut = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
}

//display signup form
exports.getCreateUserForm = (req, res) => res.render('users/signup');

//create new user and login automatically
exports.postCreateUser = (req, res, next) => {
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
          error.push({ msg: 'Email is already registered' });
          res.render('users/signup', { errors, firstName, lastName, email, password, password2 });
        }else{
          //create new user instance
          const newUser = new User({ firstName, lastName, email, password});
          //hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hashed_password) => {
              if(err) throw err;
              newUser.password = hashed_password;
              //save new user
              newUser.save().then((err, user) => {
                  //login new user automatically
                  passport.authenticate('local', (err, user) => {
                    if (err) { return next(err); }
                    if (!user) { return res.redirect('/login'); }
                    req.login(user, (err) => {
                      if (err) { return next(err); }
                      //return res.redirect('/users/' + user._id);
                      console.log('logged in user', user);
                      user.last_logged_in_at = Date.now();
                      req.flash(
                        'success_msg',
                        `${user.firstName}, You are now registered and logged in`
                      );
                      return res.redirect('/items');
                    });
                  })(req, res, next);
                  })
              })
            })
        }
      }).catch(err => console.log(err));
  }
}