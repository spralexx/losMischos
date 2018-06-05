module.exports.prepare = prepare;
module.exports.setupOutputs = setupOutputs;

var HX711 = require("hx711");
var gpio = require('rpi-gpio');


const sensor = new HX711(5, 6);
var scale = 450;
sensor.tare();
sensor.setScale(scale);
var reader = setInterval(updateValue, 1500);
var glasSize = 200; //ml
var fluids = {
    softs: [],
    alcs: []
}

var sensorValue = 0;


function prepare(req) {
    sensorValue = 0;
    var alcAmount = 200 * (req.ratio / 100);

    gpio.write(getOutputFromId(req.alc), true, function (err) {
        console.log("writing: " + getOutputFromId(req.alc));
        if (err) throw err;
        while (sensorValue < alcAmount) { }
        gpio.write(getOutputFromId(req.alc), false, function (err) {
            if (err) throw err;
        });
    });


    gpio.write(getOutputFromId(req.soft), true, function (err) {
        console.log("writing: " + getOutputFromId(req.soft));
        if (err) throw err;
        while (sensorValue < glasSize) { }
        gpio.write(getOutputFromId(req.soft), false, function (err) {
            if (err) throw err;
        });
    });

    while (sensorValue < glasSize) {

    }
}

function getOutputFromId(idToFind) {
    console.log("searching for: "+idToFind)
    for (var i in fluids.softs) {
        if (fluids.softs[i].id == idToFind) {
            console.log("found: " + fluids.softs[i].output);
            return fluids.softs[i].output;
        }
    }

    for (var i in fluids.alcs) {
        if (fluids.alcs[i].id == idToFind) {
            console.log("found: " + fluids.alcs[i].output);
            return fluids.alcs[i].output;
        }
    }
}

function updateValue() {
    var newValue = sensor.getUnits();

    if (sensorValue === 0 && newValue >= 0) {
        sensorValue = newValue
    } else {
        sensorValue = (sensorValue + newValue) / 2;
    }
}


function setupOutputs(soft, alc) {
    fluids.softs = soft;
    fluids.alcs = alc;
    for (var i in fluids.softs) {
        gpio.setup(fluids.softs[i].output, gpio.DIR_OUT);

    }
    for (var i in fluids.alcs) {
        gpio.setup(fluids.alcs[i].output, gpio.DIR_OUT);

    }
}