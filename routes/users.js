const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

// user login
router.get('/login', (request, response) => {
  response.render('users/login');
});

// user logout
router.get('/logout', (request, response) => {
  request.logout();
  request.flash('success_msg', 'You are logged out');
  response.redirect('/users/login');
});

// user registration route
router.get('/register', (request, response) => {
  response.render('users/register');
});

// login form POST
router.post('/login', (request, response, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(request, response, next);
});

// user registration form POST
router.post('/register', (request, response) => {
  let errors = [];

  if (request.body.password != request.body.passwordConfirmation) {
    errors.push({ text: 'Passwords do not match.' });
  }

  if (request.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters.' });
  }

  if (errors.length > 0) {
    response.render('users/register', {
      errors: errors,
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      passwordConfirmation: request.body.passwordConfirmation
    });
  } else {
    User.findOne({ email: request.body.email })
      .then(user => {
        console.log(user);

        if (user) {
          console.log('email registered');
          request.flash('error_msg', 'Email already registered.');
          response.redirect('/users/register');
        } else {
          let newUser = new User({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
          });

          // hash the password
          bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
              if (error) {
                throw error;
              }

              newUser.password = hash;
              newUser.save()
                .then(newUser => {
                  request.flash('success_msg', 'You are now registered and can login.');
                  response.redirect('/users/login');
                })
                .catch(error => {
                  request.flash('error_msg', 'An error has occurred. Please try again.');
                  response.redirect('/users/register');                });
            });
          });
        }
      }
    );
  }
});

module.exports = router;
