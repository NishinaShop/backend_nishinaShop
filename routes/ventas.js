const express = require ('express');
var ventaController = require ('../controllers/ventasControllers')
var authenticate = require ('../middlewares/authenticate')
var api = express.Router();

api.get('/listar_ordenes_admin', authenticate.decodeToken, ventaController.listar_ordenes_admin);
api.get ('/listar_ventas_admin', authenticate.decodeToken,ventaController.listar_ventas_admin);
api.get('/obtener_ordenes_venta_admin/:desde/:hasta', authenticate.decodeToken, ventaController.obtener_ordenes_venta_admin);
api.get('/obtener_detalles_orden_venta_admin/:id', authenticate.decodeToken, ventaController.obtener_detalles_orden_venta_admin)
module.exports = api;