const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var producto_schema = schema({
    slug: {type: String, required: true},
    portada:{type: String, required: true},
    nombre : {type: String, required: true},
    clave : {type: String, required: true, unique: true},
    genero : {type: String, required: true},
    categoria : {type: String, required: true},
    precio : {type: Number, default: 0, required: false},
    descripcion : {type: String, required: true},
    stock: {type: Number, default: 0,required: true},
    stock_fisico: {type: Number, default: 0,required: true},
    estado : {type: Boolean, required: true},
    descuento : {type: Boolean, required: true},
    desc_porcentaje : {type: Number, required: false},
    updatedAt : {type: Date, requiered: false},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('producto',producto_schema)