
var jwt = require ('jwt-simple');
var moment = require('moment')
var key = 'nishinaShop';
exports.createToken = function(cliente){
    var payLoad = {
        sub: cliente._id,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        email: cliente.email,
        genero: cliente.genero,
        iat: moment().unix(),
        exp: moment().add(1,'day').unix()
    }
    return jwt.encode(payLoad,key)
};
