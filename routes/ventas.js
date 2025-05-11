const express = require ('express');
var ventaController = require ('../controllers/ventasControllers')
var authenticate = require ('../middlewares/authenticate')
var api = express.Router();

api.get('/obtener_ventas', authenticate.decodeToken, ventaController.listar_ventas_admin);

module.exports = api;