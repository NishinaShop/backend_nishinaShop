const mongoose = require ('mongoose');
var schema = mongoose.Schema;

var categorias_schema = schema({
    titulo: {type: String, required: true},
    slug: {type: String, required: true},
    estado: {type: Boolean, default: true, required: true},
    createdAt : {type: Date, default: Date.now}
});
module.exports = mongoose.model('categorias',categorias_schema)