const express = require ('express');
var ventaController = require ('../controllers/ventasControllers')
var authenticate = require ('../middlewares/authenticate')
var api = express.Router();

api.get('/listar_ordenes_admin', authenticate.decodeToken, ventaController.listar_ordenes_admin);

module.exports = api;