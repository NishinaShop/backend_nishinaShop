const express = require ('express');
var publicController = require ('../controllers/publicoController')

var api = express.Router();

api.get('/obtener_ultimos_productos',publicController.obtener_ultimos_productos)
api.get('/obtener_img_ultimos_productos/:img', publicController.obtener_img_ultimos_productos)
api.get('/obtener_catalogo_publicos', publicController.obtener_catalogo_publicos)
api.get('/obtener_slug_producto/:slug',publicController.obtener_slug_producto)


module.exports = api;