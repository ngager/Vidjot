const express = require('express');
const expresshbs = require('express-handlebars');
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});