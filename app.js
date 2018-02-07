const express = require('express');
const expresshbs = require('express-handlebars');

const app = express();
const port = 5000;


app.engine('handlebars', expresshbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// define the index route
app.get('/', (request, response) => {
  const title = 'Welcome';
  response.render('index', {title: title});
});

app.get('/about', (request, response) => {
  response.render('about');
});

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});