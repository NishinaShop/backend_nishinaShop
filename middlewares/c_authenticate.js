var jwt = require ('jwt-simple');
var moment = require('moment')
var key = 'nishinaShop';
exports.decodeToken = function(req,res,next){
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'NoHeadersError'})       
    }
var token = req.headers.authorization;
var segment = token.split('.');
    if (segment.length != 3){
        return res.status(403).send({message: 'InvalidToken'}) 
    } else{
        try {
            var payLoad = jwt.decode(token,key)
        } catch (error) {
            return res.status(403).send({message: 'ErrorToken'}) 
        }
    }
    req.user = payLoad;
    next();
}