const mongoose = require('mongoose');

// load User model
const User = require('../models/userModel');

exports.onlyAuthorized = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if(req.isAuthenticated()){ return next(); }
    req.flash('error_msg', 'Access denied! Please login');
    res.redirect('/login');
}

exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated()){
      User.findOne({ email : req.user.email }).then(user => {
          if(user.isAdmin === true){
             return next();
          }
      }).catch(err => console.log(err));
    }else{
      req.flash('error_msg', 'You are not authorised to view this page. Access Denied!');
      res.redirect('/');
    }
}
