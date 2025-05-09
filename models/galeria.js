const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var galeria_schema = schema({
    imagen: {type: String, requiered: true},
    producto: {type: schema.ObjectId, ref: 'producto', requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('galeria',galeria_schema)