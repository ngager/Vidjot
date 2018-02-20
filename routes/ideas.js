const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// idea index page
router.get('/', (request, response) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      response.render('ideas/index', { ideas: ideas });
    });
});

// add idea form
router.get('/add', (request, response) => {
  response.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', (request, response) => {
  Idea.findOne({ _id: request.params.id })
    .then(idea => {
      response.render('ideas/edit', { idea: idea });
    });
});

// add new idea
router.post('/', (request, response) => {
  let errors = [];

  if (!request.body.title) {
    errors.push({ text: 'Please add a title.' });
  }

  if (!request.body.details) {
    errors.push({ text: 'Please enter some details.' });
  }

  if (errors.length > 0) {
    response.render('ideas/add', {
      errors: errors,
      title: request.body.title,
      details: request.body.details
    });
  } else {
    const newUser = {
      title: request.body.title,
      details: request.body.details
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        request.flash('success_msg', 'Video idea successfully added.');
        response.redirect('/ideas');
      });
  }
});

// edit idea
router.put('/:id', (request, response) => {
  Idea.findOne({ _id: request.params.id })
    .then(idea => {
      idea.title = request.body.title;
      idea.details = request.body.details;
      idea.save()
        .then(idea => {
          request.flash('success_msg', 'Video idea successfully updated.');
          response.redirect('/ideas');
        });
    });
});

// delete idea
router.delete('/:id', (request, response) => {
  Idea.remove({ _id: request.params.id })
    .then(() => {
      request.flash('success_msg', 'Video idea successfully removed.');
      response.redirect('/ideas');
    });
});

module.exports = router;