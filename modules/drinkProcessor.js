var HX711 = require("hx711");
const sensor = new HX711(5, 6);

var scale = 450;
sensor.tare();
sensor.setScale(scale);

module.exports.prepare = prepare;

function prepare(req) {
    console.log(req)
    console.log(sensor.getUnits());
    console.log(sensor.getOffset());
}