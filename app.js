const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routesUser = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '60c9cd29e709511f84709b63',
  };

  next();
});

app.use(routesUser);
app.use(routesCards);

app.listen(PORT);