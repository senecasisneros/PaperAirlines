'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 8080;

let express = require('express');
let path = require('path');
let http = require('http');
let favicon = require('serve-favicon');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();
let server = http.createServer(app);

server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///// ROUTERS /////

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.render('index', {title: 'Paper Airlines'});
});

///////// MONGO ////////

let MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost/PaperAirlines';

require('mongoose').connect(MONGO_URL, err => {
  console.log(`MongoDB connected to ${MONGO_URL}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});
