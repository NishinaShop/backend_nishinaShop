
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')

const listar_ordenes_admin = async function(req,res){
     if(req.user){
         let ordenes = await ventas.find({cliente:req.user.sub}).sort({createdAt:-1})
         res.status(200).send({ordenes})
     }else{
         res.status(500).send({data: undefined, message: 'Error al validar el token'})
     }
 
 }
module.exports = {
listar_ordenes_admin,
}