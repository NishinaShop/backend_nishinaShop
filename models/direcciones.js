const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var direcciones_schema = schema({
    nombre: {type: String, requiered: true},
    calle: {type: String, requiered: true},
    colonia: {type: String, requiered: true},
    ciudad: {type: String, requiered: true},
    codigo_postal: {type: String, requiered: true},
    estado: {type: String, requiered: true},
    email: {type: String, requiered: true},
    n_contacto: {type: String, requiered: true},
    cliente: {type: schema.ObjectId, ref: 'cliente', requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('direcciones',direcciones_schema)