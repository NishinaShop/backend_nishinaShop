var cliente = require ('../models/cliente')
var bcrypt = require ('bcrypt-nodejs')
var jwt = require ('../helpers/client_jwt')

const registro_cliente = async function (req,res) {
    let data = req.body;
    let reg= await cliente.find({email:data.email})
    if(reg.length >= 1){
        res.status(200).send({message: 'El correo electronico ya existe'})
    }else{
        bcrypt.hash(data.password,null,null,async function(err,hash){
            if(err){
                res.status(200).send({message: 'Problema durante la encriptación'})
            }else{
                data.password = hash; 
                let client = await cliente.create(data);
                res.status(200).send(client) 
            }
        })
        
    }
}
const login_cliente = async function (req,res){
    var data = req.body;
    var client = await cliente.find({email: data.email}) 
    if (client.length >= 1) {
        if(client[0].estado){ 
        bcrypt.compare(data.password, client[0].password, async function(err,check){
        if (check) {
            res.status(200).send({token:jwt.createToken(client[0]),
                cliente: client[0]
            })
        } else {
            res.status(200).send({data: undefined, message: 'La contraseña es incorrecta'})
        }
            })
        }else{
            res.status(200).send({data: undefined, message: 'Su cuenta esta desactivada'})
        }
    }else {
        res.status(200).send({data: undefined, message: 'El correo electonico no existe'});
    }
}
module.exports ={
    registro_cliente,
    login_cliente,

}