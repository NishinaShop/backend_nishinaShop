const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var venta_schema = schema({
    transaccion: {type: String, required: true},
    estado_orden: {type: String, default: 'Generada', required: false},
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true},
    serie: {type: Number, required: true},
    total: {type: Number, required: true},
    envio: {type: Number, required: true},
    estado: {type: String, required: true},
    pago_validado: {type: schema.ObjectId, ref: 'usuario', required: false},
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true}, 
    direccion: {type: schema.ObjectId, ref: 'direcciones', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('venta',venta_schema)