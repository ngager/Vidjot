const express = require('express');
const expresshbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');


const app = express();
const port = process.env.PORT || 5000;

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport configuration
require('./config/passport')(passport);

// db config
const db = require('./config/database');
console.log(db.mongoURI);
// connect to mongoose
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// handlebars middleware
app.engine('handlebars', expresshbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// global variables
app.use((request, response, next) => {
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null;
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

app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});