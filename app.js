const express = require('express');
const expresshbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// global variables
app.use((request, response, next) => {
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  next();
});

// define about route
app.get('/about', (request, response) => {
  response.render('about');
});

// define index route
app.get('/', (request, response) => {
  const title = 'Welcome';
  response.render('index', { title: title });
});

// define idea add form
app.get('/ideas/add', (request, response) => {
  response.render('ideas/add');
});

// define idea edit form
app.get('/ideas/edit/:id', (request, response) => {
  Idea.findOne({ _id: request.params.id })
    .then(idea => {
      response.render('ideas/edit', { idea: idea });
    });
});

// idea index page
app.get('/ideas', (request, response) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      response.render('ideas/index', { ideas: ideas });
    });
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
    const newUser = {
      title: request.body.title,
      details: request.body.details
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        response.redirect('/ideas');
      });
  }
});

// edit idea
app.put('/ideas/:id', (request, response) => {
  Idea.findOne({ _id: request.params.id })
    .then(idea => {
      idea.title = request.body.title;
      idea.details = request.body.details;
      idea.save()
        .then(idea => {
          response.redirect('/ideas');
        });
    });
});

// delete idea
app.delete('/ideas/:id', (request, response) => {
  Idea.remove({ _id: request.params.id })
    .then(() => {
      response.redirect('/ideas');
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});