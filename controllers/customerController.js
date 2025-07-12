var carrito = require ('../models/carrito')
var variedad = require ('../models/variedades')
var direcciones = require ('../models/direcciones')
var clientes = require ('../models/cliente')
var producto = require('../models/producto')
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')
var color = require ('../models/colores')
var talla = require ('../models/tallas')
const axios = require('axios');
const tallas = require('../models/tallas')
require('dotenv').config(); 


const agregar_al_carrito = async function(req,res){
    if(req.user){
        let data = req.body
        let tallas = await talla.findById({_id: data.talla}).populate('color')
        let colors = await color.findById({_id: data.color}).populate('producto')

        if(data.cantidad <= tallas.stock){
            if(colors.producto.precio){
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
        let cart = await carrito.find({cliente: req.user.sub}).populate('producto').populate('color').populate('talla').sort({createdAt:-1}).limit(4)
        let cart_general = await carrito.find({cliente: req.user.sub}).populate('producto').populate('color').populate('talla').sort({createdAt:-1})
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
    if (!req.user) {
        return res.status(401).send({ message: 'Error al validar el token' });
    }

    try {
        let data = req.body;
        
        // 1. Agregar campos requeridos por tu esquema
        const fecha = new Date();
        data.year = fecha.getFullYear();
        data.month = fecha.getMonth(); // 0-11
        data.day = fecha.getDate();
        data.estado = 'Pagado';

        // 2. Generar número de serie
        const ultimaVenta = await ventas.findOne().sort({ createdAt: -1 });
        data.serie = ultimaVenta ? ultimaVenta.serie + 1 : 1;

        // 3. Validar stock
        for (const item of data.detalles) {
            const productoDB = await producto.findById(item.producto);
            const variedadDB = await talla.findById(item.talla);

            if (!productoDB || productoDB.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${item.producto}`);
            }
            if (!variedadDB || variedadDB.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para la variedad ${item.talla}`);
            }
        }

        // 4. Crear venta
        const venta = await ventas.create(data);

        // 5. Procesar detalles y actualizar stocks
        for (const item of data.detalles) {
            item.venta = venta._id;
            item.year = data.year; // Opcional: si detalles también requieren estos campos
            item.month = data.month;
            item.day = data.day;

            await detalles_ventas.create(item);
            await producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
            await talla.findByIdAndUpdate(item.talla, { $inc: { stock: -item.cantidad } });
        }

        // 6. Limpiar carrito
        await carrito.deleteMany({ cliente: data.cliente });

        res.status(200).send({ venta });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ 
            success: false,
            message: 'Error al generar la orden',
            error: error.message 
        });
    }
}
const obtener_venta= async function(req,res){
    if(req.user){
        let id = req.params['id']
        let venta = await ventas.findById({_id:id}).populate('cliente').populate('direccion')
        let detalles = await detalles_ventas.find({venta:id}).populate('producto').populate('color').populate('talla')
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
const crear_venta_spei_cliente = async function(req, res) {
    if (!req.user) {
        return res.status(401).send({ message: 'Error al validar el token' });
    }

    try {
        let data = req.body;
        
        // 1. Agregar campos requeridos por tu esquema
        const fecha = new Date();
        data.year = fecha.getFullYear();
        data.month = fecha.getMonth(); // 0-11
        data.day = fecha.getDate();
        data.estado = 'Pendiente';

        // 2. Generar número de serie
        const ultimaVenta = await ventas.findOne().sort({ createdAt: -1 });
        data.serie = ultimaVenta ? ultimaVenta.serie + 1 : 1;

        // 3. Validar stock
        for (const item of data.detalles) {
            const productoDB = await producto.findById(item.producto);
            const variedadDB = await talla.findById(item.talla);

            if (!productoDB || productoDB.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${item.producto}`);
            }
            if (!variedadDB || variedadDB.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para la variedad ${item.talla}`);
            }
        }

        // 4. Crear venta
        const venta = await ventas.create(data);

        // 5. Procesar detalles y actualizar stocks
        for (const item of data.detalles) {
            item.venta = venta._id;
            item.year = data.year; // Opcional: si detalles también requieren estos campos
            item.month = data.month;
            item.day = data.day;

            await detalles_ventas.create(item);
            await producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
            await talla.findByIdAndUpdate(item.talla, { $inc: { stock: -item.cantidad } });
        }

        // 6. Limpiar carrito
        await carrito.deleteMany({ cliente: data.cliente });

        res.status(200).send({ venta });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ 
            success: false,
            message: 'Error al generar la orden',
            error: error.message 
        });
    }
};
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