const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var producto_schema = schema({
    color: {type: String, requiered: true},
    talla: {type: String, requiered: true},
    sku: {type: String, requiered: true},
    stock: {type: Number, default: 0,requiered: true},
    producto : {type: schema.ObjectId, ref: "producto", requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('variedad',producto_schema)