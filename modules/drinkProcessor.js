var HX711 = require("hx711");
const sensor = new HX711(5, 6);

module.exports.prepare = prepare;

function prepare(req) {
    console.log(req)
    console.log(sensor.getUnits());
}