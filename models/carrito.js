const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var carrito_schema = schema({
    variedad: {type: schema.ObjectId, ref: 'variedad', requiered: true},
    cantidad: {type: Number, requiered: true},
    producto: {type: schema.ObjectId, ref: 'producto', requiered: true},
    cliente: {type: schema.ObjectId, ref: 'cliente', requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('carrito',carrito_schema)