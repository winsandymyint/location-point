var express = require('express');
var path = require('path');
var app = express();
var rootPath = path.normalize(__dirname+'/../');
app.use('/',express.static(rootPath + '/app/'));
app.use('/node_modules', express.static(rootPath + '/node_modules'));
app.use('/next', express.static(rootPath + '/app/index2.html'));
app.listen(4000);
console.log('Listening on port 4000');