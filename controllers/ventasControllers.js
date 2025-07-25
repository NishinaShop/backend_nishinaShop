
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
        let venta = await ventas.findById({_id:id}).populate('cliente').populate('direccion').populate('pago_validado').populate('orden_actualizada');
        let detalle =await detalles_ventas.find({venta:id}).populate('producto').populate('color').populate('talla')
        res.status(200).send({venta,detalle})
    }else {
        res.status(500).send({data: undefined, message: 'Token invalido'})
    }
}
const validar_pago =async function (req,res){
  if(req.user){
    let id = req.params['id']
    const userId = req.user.sub;
    let cambioEstado = await ventas.findByIdAndUpdate(id,{
        estado: 'Pagado',
        pago_validado: userId
      },
      { new: true }
    ).populate('pago_validado');
    res.status(200).send({cambioEstado})
  }else{
        res.status(500).send({data: undefined, message: 'Token invalido'})
  }
}
const cambio_estado_orden =async function (req,res){
  if(req.user){
    let id = req.params['id'];
    const userId = req.user.sub;
    let nuevo_estado = req.body.estado
    let orden_actualizada = await ventas.findByIdAndUpdate(id,{
      estado_orden : nuevo_estado,
      orden_actualizada: userId
    },{ new: true }
  )
  res.status(200).send(orden_actualizada)
  }else{
        res.status(500).send({data: undefined, message: 'Token invalido'})
  }
}
const obtener_salidas_admin = async function(req,res){
  if (req.user){
    let desde = req.params['desde'];
    let hasta = req.params['hasta'];
    let ventasFiltro = await detalles_ventas.find({
      createdAt: {
        $gte: new Date(desde+'T00:00:00'),
        $lt: new Date(hasta+'T00:00:00')
      }
    }).populate('producto').populate('color').populate('talla')
    
    res.status(200).send(ventasFiltro)
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}


module.exports = {
listar_ordenes_admin,
listar_ventas_admin,
obtener_ordenes_venta_admin,
obtener_detalles_orden_venta_admin,
validar_pago,
cambio_estado_orden,
obtener_salidas_admin,
}