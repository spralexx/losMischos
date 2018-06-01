var HX711 = require("hx711");
const sensor = new HX711(5, 6);

console.log("hello world");

module.exports.prepare = prepare;

function prepare(req, sensor) {
    console.log(req)
    console.log(sensor.getUnits());
}