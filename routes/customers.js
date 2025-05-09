const express = require ('express');
var customersController = require ('../controllers/customerController')
var c_authenticate = require ('../middlewares/c_authenticate')

var api = express.Router();

api.post('/agregar_al_carrito', c_authenticate.decodeToken, customersController.agregar_al_carrito),
api.get('/obtener_carrito', c_authenticate.decodeToken, customersController.obtener_carrito),
api.delete('/eliminar_producto_carrito/:id', c_authenticate.decodeToken, customersController.eliminar_producto_carrito),
api.post('/agregar_direccion_cliente', c_authenticate.decodeToken, customersController.agregar_direccion_cliente),
api.get('/obtener_direccion_cliente', c_authenticate.decodeToken, customersController.obtener_direccion_cliente),
api.delete('/eliminar_direccion_cliente/:id', c_authenticate.decodeToken, customersController.eliminar_direccion_cliente),
api.get('/validar_payment_id_venta/:payment_id', c_authenticate.decodeToken, customersController.validar_payment_id_venta),
api.post('/crear_venta_cliente', c_authenticate.decodeToken, customersController.crear_venta_cliente),
api.get ('/obtener_venta/:id', c_authenticate.decodeToken, customersController.obtener_venta),
module.exports = api;