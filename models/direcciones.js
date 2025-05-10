const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var direcciones_schema = schema({
    nombre: {type: String, required: true},
    calle: {type: String, required: true},
    colonia: {type: String, required: true},
    ciudad: {type: String, required: true},
    codigo_postal: {type: String, required: true},
    estado: {type: String, required: true},
    email: {type: String, required: true},
    n_contacto: {type: String, required: true},
    cliente: {type: schema.ObjectId, ref: 'cliente', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('direcciones',direcciones_schema)