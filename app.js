const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

//initialze app
const app = express();

//connect to database
mongoose.connect('mongodb://localhost/ventorydb', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => console.log('Failed to connect to DB', err));

//importing routes
const users = require('./controllers/usersController');
const items = require('./controllers/itemsController');


const port = process.env.PORT || 5000;
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//initiaizations
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret elephant is very hard to maintain',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'vdb-sessions'
    }),
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport Config
require('./config/passport')();

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
app.use(items);
app.use(users);
app.get('*', (req,res) => {
  res.render('404');
});


app.listen(port, () => console.log(`server listening at port ${port}`));


