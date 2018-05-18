var fs = require('fs');
var path = require('path');
var express = require('express');

// Construct Express
var app = express();


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
