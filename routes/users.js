const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;

// user login
router.get('/login', (request, response) => {
  response.render('users/login');
});

// user registration
router.get('/register', (request, response) => {
  response.render('users/register');
});