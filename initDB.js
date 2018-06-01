var mongoose = require('mongoose');
var config = require("./config.json");

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


Softs.insertMany(config.softs,function(err,docs){
    Alcs.insertMany(config.alcs, function (err, docs) {
        dbconn.close();
     })
});
