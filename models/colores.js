const mongoose = require ('mongoose');
var schema = mongoose.Schema;
var color_schema = schema({
    color: {type: String, required: true},
    codigo_color: {type: String, required: true},
    producto : {type: schema.ObjectId, ref: "producto", requiered: true},
    createdAt : {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('color',color_schema)