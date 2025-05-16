const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var ingreso_schema = schema({
    proveedor: {type: String, required: true},
    ncomprobante: {type: String, required: true, unique: true},
    documento: {type: String, Required: false},
    monto_total: {type: String, required: true},
    monto_resultante : {type: String, required: true},
    serie: {type: Number, requiered: false},
    usuario: {type: schema.ObjectId, ref: 'usuario', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('ingreso',ingreso_schema)