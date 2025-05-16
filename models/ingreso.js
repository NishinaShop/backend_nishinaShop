const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var ingreso_schema = schema({
    proveedor: {type: String, requiered: true},
    ncomprobante: {type: String, requiered: true, unique: true},
    documento: {type: String, Requiered: false},
    monto_total: {type: String, requiered: true},
    monto_resultante : {type: String, requiered: true},
    serie: {type: Number, requiered: false},
    usuario: {type: schema.ObjectId, ref: 'usuario', requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('ingreso',ingreso_schema)