module.exports.prepare = prepare;

var HX711 = require("hx711");
const sensor = new HX711(5, 6);
var scale = 450;
sensor.tare();
sensor.setScale(scale);
var reader = setInterval(updateValue, 2000);

var sensorValue = 0;


function prepare(req) {
    console.log(sensorValue);
}

function updateValue() {
    var newValue = sensor.getUnits();

    if (sensorValue === 0) {
        sensorValue = newValue
    } else {
        sensorValue=(sensorValue+newValue)/2;
    }
}