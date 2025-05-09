const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var detalles_venta_schema = schema({
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true},
    subtotal: {type: Number, required: true},
    precio_unidad: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    venta: {type: schema.ObjectId, ref: 'venta', required: true}, 
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true}, 
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    variedad: {type: schema.ObjectId, ref: 'variedad', required: true}, 
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('detalles_venta',detalles_venta_schema)