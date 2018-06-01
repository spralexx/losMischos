var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var drinkProcessor=require("./modules/drinkProcessor");

var port = 8080; //port to listen on
var app = express();

var softiesSchema = new mongoose.Schema({
  name: String,
  output: Number
});

var alcSchema = new mongoose.Schema({
  name: String,
  output: Number
});

const mongoUri = process.env.MONGODB || 'mongodb://127.0.0.1/losMischos';

var dbconn = mongoose.createConnection(mongoUri),
  Softs = dbconn.model('softies', softiesSchema, 'softies'),
  Alcs = dbconn.model('alc', alcSchema, 'alc');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  Softs.find({}, function (err, softs) {
    Alcs.find({}, function (err, alcs) {

      res.render('default', { softs, alcs });
    })
  })
}
);
app.post("/drinkorder", function (req, res) {
  //  console.log(req.body)
  drinkProcessor.prepare(req.body);
  var msg="Your drink is beeing prepared";
  res.render("accepted",{msg});



})

app.listen(port, function () {
  console.log('Listening on Port: ' + port);
});