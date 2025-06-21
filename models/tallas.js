const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var talla_schema = schema({
    talla: {type: String, required: true},
    sku: {type: String, required: true},
    stock: {type: Number, default: 0,required: true},
    color : {type: schema.ObjectId, ref: "color", requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('talla',talla_schema)