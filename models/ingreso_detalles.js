const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var ingreso_detalles_schema = schema({
    cantidad: {type: Number, requiered: true},
    precio_unidad: {type: Number, requiered: true},
    ingreso: {type: schema.ObjectId, ref: 'ingreso', required: true},
    usuario: {type: schema.ObjectId, ref: 'usuario', required: true},
    color: {type: schema.ObjectId, ref: 'color', required: true},
    talla: {type: schema.ObjectId, ref: 'talla', required: true},
    producto: {type: schema.ObjectId, ref: 'producto',required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('ingreso_detalles',ingreso_detalles_schema)