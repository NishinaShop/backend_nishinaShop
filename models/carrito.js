const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var carrito_schema = schema({
    talla: {type: schema.ObjectId, ref: 'talla', required: true},
    color: {type: schema.ObjectId, ref: 'color', required: true},
    cantidad: {type: Number, requiered: true},
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('carrito',carrito_schema)