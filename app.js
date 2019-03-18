const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

mongoose.connect('mongodb://localhost/ventorydb', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.log('Failed to connect to DB', err));

const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');

const app = express();
const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(itemsRouter);
app.use(usersRouter);
app.get('*', (req,res) => {
  res.render('404');
});

app.listen(port, () => console.log(`server listening at port ${port}`));


