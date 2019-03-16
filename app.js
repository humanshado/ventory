const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const storeKeeperRouter = require('./routes/storeKeeper');
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

app.use(storeKeeperRouter);
app.use(usersRouter);
app.use(itemsRouter);
app.get('*', (req,res) => {
  res.render('404');
});

app.listen(port, () => console.log(`server listening at port ${port}`));


