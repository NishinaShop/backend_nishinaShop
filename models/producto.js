const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var producto_schema = schema({
    slug: {type: String, requiered: true},
    portada:{type: String, requiered: true},
    nombre : {type: String, requiered: true},
    clave : {type: String, requiered: true, unique: true},
    genero : {type: String, requiered: true},
    categoria : {type: String, requiered: true},
    precio : {type: Number, default: 0, requiered: false},
    descripcion : {type: String, requiered: true},
    stock: {type: Number, default: 0,requiered: true},
    stock_fisico: {type: Number, default: 0,requiered: true},
    estado : {type: Boolean, requiered: true},
    descuento : {type: Boolean, requiered: true},
    updatedAt : {type: Date, requiered: false},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('producto',producto_schema)