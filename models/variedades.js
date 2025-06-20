const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var variedad_schema = schema({
    color: {type: String, required: true},
    talla: {type: String, required: true},
    sku: {type: String, required: true},
    stock: {type: Number, default: 0,required: true},
    producto : {type: schema.ObjectId, ref: "producto", requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('variedad',variedad_schema)