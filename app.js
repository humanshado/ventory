const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

//initialze app
const app = express();

// Passport Config
require('./config/passport.config.js')(passport);

//connect to database
mongoose.connect('mongodb://localhost/ventorydb', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.log('Failed to connect to DB', err));

//importing routes
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');


const port = process.env.PORT || 5000;
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: 'secret elephant',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routing
app.get('/', (req, res) => {
  res.render('landingPage');
});
app.use(itemsRouter);
app.use(usersRouter);
app.get('*', (req,res) => {
  res.render('404');
});


app.listen(port, () => console.log(`server listening at port ${port}`));


