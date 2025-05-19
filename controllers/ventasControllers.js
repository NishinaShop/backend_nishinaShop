
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')
const mongoose = require('mongoose');

const listar_ordenes_admin = async function(req,res){
     if(req.user){
         let ordenes = await ventas.find({cliente:req.user.sub}).sort({createdAt:-1})
         res.status(200).send({ordenes})
     }else{
         res.status(500).send({data: undefined, message: 'Error al validar el token'})
     }
 
 }
const listar_ventas_admin = async function(req,res){
    if(req.user){
        try {
               var venta = await ventas.find().sort({createdAt:-1}).limit(19)
                    res.status(200).send(venta);
                    
                } catch(error) {
                    console.error(error);
                    res.status(500).send({message: "Error al buscar la orden"});
                }
            }else{
                res.status(500).send({data: undefined, message:"ErroToken"});
            }
}
const obtener_ordenes_venta_admin = async function(req,res){
  if (req.user){
    let desde = req.params['desde'];
    let hasta = req.params['hasta'];
    let ventasFiltro = await ventas.find({
      createdAt: {
        $gte: new Date(desde+'T00:00:00'),
        $lt: new Date(hasta+'T00:00:00')
      }
    })
    res.status(200).send(ventasFiltro)
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}
const obtener_detalles_orden_venta_admin = async function(req,res){
    if(req.user){
        let id = req.params['id']
        let venta = await ventas.findById({_id:id}).populate('cliente').populate('direccion').populate('pago_validado')
        let detalle =await detalles_ventas.find({venta:id}).populate('producto').populate('variedad')
        res.status(200).send({venta,detalle})
    }else {
        res.status(500).send({data: undefined, message: 'Token invalido'})
    }
}
const validar_pago =async function (req,res){
  console.log("[DEBUG] Datos del usuario:", req.user); // ← Agrega esto
  if(!req.user) {
    console.log("[DEBUG] No hay usuario en la request"); // ← Y esto
    return res.status(401).send({ message: 'Token inválido' });
  }
  /*if(req.user){
    let id = req.params['id']
    const userId = new mongoose.Types.ObjectId(req.user._id);
    let cambioEstado = await ventas.findByIdAndUpdate(id,{
        estado: 'Pagado',
        pago_validado: userId
      },
      { new: true }
    ).populate('pago_validado');
    res.status(200).send({cambioEstado})
  }else{
        res.status(500).send({data: undefined, message: 'Token invalido'})
  }*/
}
module.exports = {
listar_ordenes_admin,
listar_ventas_admin,
obtener_ordenes_venta_admin,
obtener_detalles_orden_venta_admin,
validar_pago,
}