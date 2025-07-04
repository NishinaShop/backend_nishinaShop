const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var galeria_schema = schema({
    imagen: {type: String, required: true},
    producto: {type: schema.ObjectId, ref: 'producto', required: true},
    color: {type: schema.ObjectId, ref: 'color', required: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('galeria',galeria_schema)