module.exports.prepare = prepare;
//module.exports.setupOutputs = setupOutputs;

var HX711 = require("hx711");
var gpio = require('rpi-gpio');


const sensor = new HX711(5, 6);
var scale = 450;
sensor.tare();
sensor.setScale(scale);
var glasSize = 200; //ml
var fluids = {
    softs: [],
    alcs: []
}

var sensorValue = 0;

function checkRatio(toCheck) {
    return new Promise(resolve => {
        setInterval(function () {
            updateValue();
            if (sensorValue > toCheck) {
                clearInterval(this);
                resolve();
            }
        }, 1500);
    })
}


async function prepare(req) {
    sensorValue = 0;
    var alcAmount = 200 * (req.ratio / 100);

    //gpio.write(getOutputFromId(req.alc), false);
    gpio.setup(getOutputFromId(req.alc), gpio.DIR_HIGH)
    await checkRatio(alcAmount);
    /*
        gpio.write(getOutputFromId(req.alc), true, function (err) {
            if (err) throw err;
        });
    */
    gpio.destroy();

    sensorValue = 0;

    //    gpio.write(getOutputFromId(req.soft), false)
    gpio.setup(getOutputFromId(req.soft), gpio.DIR_HIGH)
    await checkRatio(glasSize);
    /*
    gpio.write(getOutputFromId(req.soft), true, function (err) {
        if (err) throw err;
    });
    */
    gpio.destroy();
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
/*

function setupOutputs(soft, alc) {
    fluids.softs = soft;
    fluids.alcs = alc;
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
}

*/