var jwt = require ('jwt-simple');
var moment = require('moment')
var key = 'nishinaShop';
exports.createToken = function(usuario){
    var payLoad = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(1,'day').unix()
    }
    return jwt.encode(payLoad,key)
};
