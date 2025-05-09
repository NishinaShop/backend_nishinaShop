const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var cliente_schema = schema({
    nombre : {type: String, requiered: true},
    apellidos : {type: String, requiered: false},
    email : {type: String, requiered: true, unique: true},
    genero : {type: String, requiered: false},
    password : {type: String, requiered: true},
    recovery: {type: String, requiered: false},
    estado : {type: Boolean, default: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('cliente',cliente_schema)