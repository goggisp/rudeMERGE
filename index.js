const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('public'));


app.post('/', function(req, res) {
  getInfo(req.body.name, function(requestedId) {
    res.json({requestedId: requestedId});
  });
});


app.listen(1337, function() {
  console.log('listening on port 1337');
});

function getInfo(name, callback) {
  request('https://www.novasoftware.se/webviewer/(S(30gpycqpe4gvwj453yaxiwzi))/MZDesign1.aspx?schoolid=93700&code=969640&type=3', function (error, response, body){
    console.log(name);
    var requestedId = body.substring(body.indexOf(name) - 45, body.indexOf(name)-7);
    console.log(requestedId);
    callback(requestedId);
  });
};
