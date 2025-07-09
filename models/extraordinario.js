const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var extraordinario_schema = schema({
    movimiento: {type: String, required: true},
    registro: {type: String, required: true},
    cantidad: {type: Number, required: false},
    precio: {type: Number, required: false},
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    color: {type: schema.ObjectId, ref: 'color', required: true},
    talla: {type: schema.ObjectId, ref: 'talla', required: true},
    usuario: {type: schema.ObjectId, ref: 'usuario', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('extraordinario',extraordinario_schema)