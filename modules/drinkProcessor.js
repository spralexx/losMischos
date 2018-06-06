module.exports.prepare = prepare;
module.exports.setupOutputs = setupOutputs;

var HX711 = require("hx711");
var gpio = require('rpi-gpio');


const sensor = new HX711(5, 6);
var scale = 450;
sensor.tare();
sensor.setScale(scale);
//setInterval(updateValue,1500);
var glasSize = 150; //ml
var fluids = {
    softs: [],
    alcs: []
}

var sensorValue = 0;

function fillGlas(pin, toCheck) {
    return new Promise(resolve => {
        sensorValue = 0;
        console.log("settingup and filling on pin: " + pin);
        gpio.setup(pin, gpio.DIR_OUT, function (err) {
            if (err) throw err;
            gpio.write(pin, false, function (err) {
                if (err) throw err;
            });
        });
        setInterval(function () {
            updateValue();
            if (sensorValue > toCheck) {
                clearInterval(this);
                gpio.destroy();
                resolve();
            }
        }, 1500);
    })
}


async function prepare(req) {
    var alcAmount = glasSize * (req.ratio / 100);
    getOutputFromId(req.alc);
    await fillGlas(getOutputFromId(req.alc), alcAmount);
    await fillGlas(getOutputFromId(req.soft), glasSize);
}

function getOutputFromId(idToFind) {
    console.log("searching for: " + idToFind)
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
    console.log("sensorValue is: " + sensorValue);
}


function setupOutputs(soft, alc) {
    fluids.softs = soft;
    fluids.alcs = alc;
    /*
        for (var i in fluids.softs) {
            console.log("setting up: " + fluids.softs[i].output);
            gpio.setup(fluids.softs[i].output, gpio.DIR_OUT, function(err) {
                if(err) throw err;
                gpio.write(fluids.softs[i].output, true, function (err) {
                    if (err) throw err;
                });
            });
        }
        for (var i in fluids.alcs) {
            console.log("setting up: " + fluids.alcs[i].output);
            gpio.setup(fluids.alcs[i].output, gpio.DIR_OUT, function (err) {
                if (err) throw err;
                gpio.write(fluids.alcs[i].output, true, function (err) {
                    if (err) throw err;
                });
            });
    
        }
        */
}
