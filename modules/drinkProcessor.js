var hx711 = require("HX711");
const sensor = new hx711(5, 6);

module.exports.prepare = prepare;

function prepare(req) {
    console.log(req)
    console.log(sensor.read());
}