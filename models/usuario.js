const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var usuario_schema = schema({
    nombre : {type: String, requiered: true},
    apellidos : {type: String, requiered: true},
    email : {type: String, requiered: true, unique: true},
    rol : {type: String, requiered: true},
    password : {type: String, requiered: true},
    estado : {type: Boolean, default: true, requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('usuario',usuario_schema)