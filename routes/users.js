const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;

// user login
router.get('/login', (request, response) => {
  response.render('users/login');
});

// user registration route
router.get('/register', (request, response) => {
  response.render('users/register');
});

// user registration form POST
router.post('/register', (request, response) => {
  let errors = [];

  if (request.body.password != request.body.passwordConfirmation) {
    errors.push({ text: 'Passwords do not match.'});
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
    response.send('PASS');
  }

});