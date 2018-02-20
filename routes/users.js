const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;

// user login
router.get('/login', (request, response) => {
  response.send('LOGIN');
});

// user registration
router.get('/register', (request, response) => {
  response.send('REGISTER');
});