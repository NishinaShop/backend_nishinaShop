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
const crear_venta_spei_cliente = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Error de autenticación' });

    const session = await mongoose.startSession(); // Inicia sesión
    session.startTransaction(); // Inicia transacción

    try {
        // 1. Prepara datos
        let data = req.body;
        data.estado = 'Pendiente';
        data.date = new Date();

        // 2. Genera número de serie (dentro de la transacción)
        const lastVenta = await ventas.findOne().sort({ createdAt: -1 }).session(session);
        data.serie = lastVenta ? lastVenta.serie + 1 : 1;

        // 3. Crea venta (¡con session!)
        const [venta] = await ventas.create([data], { session });

        // 4. Procesa detalles y stocks
        for (const item of data.detalles) {
            item.venta = venta._id;

            // 4.1 Valida stock ANTES de modificar
            const product = await producto.findById(item.producto).session(session);
            const variant = await variedad.findById(item.variedad).session(session);
            
            if (!product || product.stock < item.cantidad) throw new Error(`Stock insuficiente para ${item.producto}`);
            if (!variant || variant.stock < item.cantidad) throw new Error(`Stock insuficiente en variedad ${item.variedad}`);

            // 4.2 Crea detalle y actualiza stock (en transacción)
            await detalles_ventas.create([{ ...item }], { session });
            await producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } }, { session });
            await variedad.findByIdAndUpdate(item.variedad, { $inc: { stock: -item.cantidad } }, { session });
        }

        // 5. Borra carrito (¡si todo lo anterior funcionó!)
        await carrito.deleteMany({ cliente: data.cliente }).session(session);

        // 6. Confirma transacción
        await session.commitTransaction();
        res.status(200).send({ venta });

    } catch (error) {
        // 7. Revierte TODOS los cambios si hay error
        await session.abortTransaction(); 
        
        console.error('Error transaccional:', error);
        res.status(500).send({
            success: false,
            message: 'Error completo al generar la orden',
            error: error.message
        });
    } finally {
        // 8. Libera recursos
        session.endSession();
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