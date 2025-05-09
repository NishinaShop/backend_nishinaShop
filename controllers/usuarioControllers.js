const usuario = require('../models/usuario');
var bcryptjs = require ('bcrypt-nodejs');
var jwt = require ('../helpers/jwt')
const registro_usuario_admin = async function (req,res) {
   let data = req.body;
           let usuarios = await usuario.find({email: data.email})
           if (usuarios.length >= 1) {
               res.status(200).send({data: undefined, message: 'El correo electonico ya existe'});
           } else {
               bcryptjs.hash('123456',null,null, async function(err, hash){
                   if(err){
                       res.status(200).send({data: undefined, message: 'No se pudo encriptar contraseña'});
                   }else{
                       data.password = hash;
                       let user = await usuario.create(data);
                       res.status(200).send({data: user})
                   }
               }
           );
           }
}
const login_usuario = async function (req,res){
    var data = req.body;
    var user = await usuario.find({email: data.email}) 
    if (user.length >= 1) {
        if(user[0].estado){ 
        bcryptjs.compare(data.password, user[0].password, async function(err,check){
        if (check) {
            res.status(200).send({token:jwt.createToken(user[0]),
                usuario: user[0]
            })
        } else {
            res.status(200).send({data: undefined, message: 'La contraseña es incorrecta'})
        }
            })
        }else{
            res.status(200).send({data: undefined, message: 'Usuario sin acceso al panel'})
        }
    }else {
        res.status(200).send({data: undefined, message: 'El correo electonico no existe'});
    }
}
const listar_usuarios_admin = async function(req,res){
    if(req.user){
        let user = await usuario.find();
        res.status(200).send(user)
    }else{
        res.status(500).send({data: undefined, message:"ErroToken"});
    }
}
const obtener_usuario_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];

        try {
            let user = await usuario.findById({_id: id});
            res.status(200).send(user);
        } catch (error) {
            res.status(200).send(undefined);
        }

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}
const actualizar_usuario_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];
        let data = req.body;
        let user = await usuario.findByIdAndUpdate({_id: id},{
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email,
            rol: data.rol,
        });
        res.status(200).send(user)
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}
const cambiar_estado_usuario_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];
        let data = req.body;
        let nuevoEstado = false;
        if (data.estado){
            nuevoEstado = false;
        } else {
            nuevoEstado = true;
        }
        let user = await usuario.findByIdAndUpdate({_id: id},{
            estado: nuevoEstado,
        });
        res.status(200).send(user)
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


module.exports = {
registro_usuario_admin,
login_usuario,
listar_usuarios_admin,
obtener_usuario_admin,
actualizar_usuario_admin,
cambiar_estado_usuario_admin,
}