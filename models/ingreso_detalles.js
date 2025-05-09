const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var ingreso_detalles_schema = schema({
    cantidad: {type: Number, requiered: true},
    precio_unidad: {type: Number, requiered: true},
    ingreso: {type: schema.ObjectId, ref: 'ingreso', requiered: true},
    usuario: {type: schema.ObjectId, ref: 'usuario', requiered: true},
    variedad: {type: schema.ObjectId, ref: 'variedad', requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('ingreso_detalles',ingreso_detalles_schema)