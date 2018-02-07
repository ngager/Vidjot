const express = require('express');
const expresshbs = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine('handlebars', expresshbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// define index route
app.get('/', (request, response) => {
  const title = 'Welcome';
  response.render('index', { title: title });
});

// define about route
app.get('/about', (request, response) => {
  response.render('about');
});

// define idea form
app.get('/ideas/add', (request, response) => {
  response.render('ideas/add');
});

// define idea processing
app.post('/ideas', (request, response) => {
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
    response.send('Success: No Form Errors');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});