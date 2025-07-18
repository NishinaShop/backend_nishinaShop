const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var detalles_venta_schema = schema({
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true},
    subtotal: {type: Number, required: true},
    precio_unidad: {type: Number, required: true},
    precio_factura: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    venta: {type: schema.ObjectId, ref: 'venta', required: true}, 
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true}, 
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    color: {type: schema.ObjectId, ref: 'color', required: true}, 
    talla: {type: schema.ObjectId, ref: 'talla', required: true}, 
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('detalles_venta',detalles_venta_schema)