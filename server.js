var fs = require('fs');
var path = require('path');
var express = require('express');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');

// Construct Express
var app = express();

app.use(compression());
app.use(
  bodyParser.json({
    strict: true,
    type: ['application/json', 'application/vnd.api+json'],
  })
);
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(function(req, res, next) {
  // headers
  var baseURL = req.secure
    ? 'https://' + req.headers.host + '/'
    : 'http://' + req.headers.host + '/';
  var allowedOrigins = [baseURL, 'http://xxx.com'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(require('./api/api'));

app.use(express.static('dist'));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Creating Server
var http = require('http');

var httpServer = http.createServer(app);
httpServer.listen(3000, function() {
  console.log('http is running');
});
