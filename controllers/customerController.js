var carrito = require ('../models/carrito')
var variedad = require ('../models/variedades')
var direcciones = require ('../models/direcciones')
var clientes = require ('../models/cliente')
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')
const axios = require('axios');
require('dotenv').config(); 


const agregar_al_carrito = async function(req,res){
    if(req.user){
        let data = req.body
        let variety = await variedad.findById({_id:data.variedad}).populate('producto')

        if(data.cantidad <= variety.stock){
            if(variety.producto.precio){
                let cart = await carrito.create(data)
                res.status(200).send(cart)
            }else{
                res.status(200).send({data: undefined, message: 'El precio del producto es 0'})
            }
        }else{
            res.status(200).send({data: undefined, message: 'Sin Stock'})
        }
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const obtener_carrito = async function(req,res){
    if(req.user){
        let cart = await carrito.find({cliente: req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1}).limit(4)
        let cart_general = await carrito.find({cliente: req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1})
        res.status(200).send({cart,cart_general})
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const eliminar_producto_carrito = async function(req,res){
    if(req.user){
        let id = req.params['id']
        let reg = await carrito.findByIdAndDelete({_id:id})
        res.status(200).send({reg})
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const agregar_direccion_cliente = async function(req,res){
    if(req.user){
        let data = req.body
        data.cliente = req.user.sub;
        let direccion = await direcciones.create(data)
        res.status(200).send({direccion})
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const obtener_direccion_cliente = async function(req,res){
    if(req.user){
        
        let direccion = await direcciones.find({cliente:req.user.sub})
        res.status(200).send({direccion})
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const eliminar_direccion_cliente = async function(req,res){
    if(req.user){
        let id = req.params['id']
        let reg = await direcciones.findByIdAndDelete({_id:id})
        res.status(200).send(reg)
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}

const validar_payment_id_venta = async function(req, res) {
  if (req.user) {
    const payment_id = req.params['payment_id'];
    try{
        const result = await axios.get(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` // usa variable de entorno
      }
    });
    const pago = result.data;

    if (pago.status === 'approved'){
        let venta = await ventas.find({transaccion:payment_id})
        res.status(200).send(venta)
        }else{
        res.status(200).send({message:'El pago no fue aprovado'})
        }
    }catch (error) {
      console.error('Error al validar payment_id:', error.response?.data || error.message);
      return res.status(500).send({
        message: 'Error al validar el payment_id',
        error: error.response?.data || error.message
      });
    }
}else {
    return res.status(401).send({ data: undefined, message: 'Error al validar el token' });
  }
}
const crear_venta_cliente = async function(req,res){
    if(req.user){
        let data = req.body
        data.year = new Date().getFullYear();
        data.month = new Date().getMonth();
        data.day = new Date().getDate();
        data.estado = 'Pagado'
        let Venta = await ventas.find().sort({ createdAt: -1 });

        if (Venta.length === 0) {
            data.serie = 1;
        } else {
            data.serie = Venta[0].serie + 1;
        }
        
        let venta = await ventas.create(data)
        
        for(var item of data.detalles){
            item.year = new Date().getFullYear();
            item.month = new Date().getMonth();
            item.day = new Date().getDate();
            item.venta = venta._id
            
            // Crear el detalle de venta
            await detalles_ventas.create(item)
            
            // Actualizar stock del producto principal
            await producto.findByIdAndUpdate(item.producto, {
                $inc: {stock: -item.cantidad},
                updatedAt: new Date()
            });
            
            // Actualizar stock de la variedad
            await variedad.findByIdAndUpdate(item.variedad, {
                $inc: {stock: -item.cantidad}
            });
        }
        
        await carrito.deleteMany({cliente:data.cliente})
        res.status(200).send({venta})
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }
}
const obtener_venta= async function(req,res){
    if(req.user){
        let id = req.params['id']
        let venta = await ventas.findById({_id:id}).populate('cliente').populate('direccion')
        let detalles = await detalles_ventas.find({venta:id}).populate('producto').populate('variedad')
        if(req.user.sub == venta.cliente._id){
            res.status(200).send({venta,detalles})
        }else{
            res.status(200).send({data: undefined, message: 'No tienes autorizacion para esta orden'})
        }
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }

}
const eliminar_carrito = async function (req, res) {
    if(req.user){
        let cart = await ventas.deleteMany({cliente:req.user.sub})
        res.status(200).send(cart)
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }
}
const crear_venta_spei_cliente = async function(req,res){
    if(req.user){
        try {
            let data = req.body
        data.year = new Date().getFullYear();
        data.month = new Date().getMonth();
        data.day = new Date().getDate();
        data.estado = 'Pendiente'
        let Venta = await ventas.find().sort({ createdAt: -1 });

        if (Venta.length === 0) {
            data.serie = 1;
        } else {
        data.serie = Venta[0].serie + 1;
        }
        let venta = await ventas.create(data)
        for(var item of data.detalles){
            item.year = new Date().getFullYear();
            item.month = new Date().getMonth();
            item.day = new Date().getDate();
            item.venta= venta._id
         // Crear el detalle de venta
            await detalles_ventas.create(item)
            
            // Actualizar stock del producto principal
            await producto.findByIdAndUpdate(item.producto, {
                $inc: {stock: -item.cantidad},
                updatedAt: new Date()
            });
            
            // Actualizar stock de la variedad
            await variedad.findByIdAndUpdate(item.variedad, {
                $inc: {stock: -item.cantidad}
            });
        }
        
        await carrito.deleteMany({cliente:data.cliente})
        res.status(200).send({venta})
        } catch (error) {
            res.status(200).send({data: undefined, message: 'No se pudo generar la orden', errorDetails: {
      message: error.message, // Mensaje básico del error
      name: error.name, // Tipo de error
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Stack solo en desarrollo
    }})
        }
    }else{
        res.status(500).send({data: undefined, message: 'Error al validar el token'})
    }
}
module.exports ={
    agregar_al_carrito,
    obtener_carrito,
    eliminar_producto_carrito,
    agregar_direccion_cliente,
    obtener_direccion_cliente,
    eliminar_direccion_cliente,
    validar_payment_id_venta,
    crear_venta_cliente,
    obtener_venta,
    eliminar_carrito,
    crear_venta_spei_cliente

}