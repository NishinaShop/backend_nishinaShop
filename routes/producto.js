const express = require ('express');
var productoController = require ('../controllers/productoControllers')
var authenticate = require ('../middlewares/authenticate')
var multipart = require ('connect-multiparty')

var api = express.Router();
var path = multipart({uploadDir: './uploads/productos'})
var path_ingreso = multipart({uploadDir: './uploads/facturas_ingreso'})
var path_galeria = multipart({uploadDir: './uploads/galeria'})
/// Producto
api.post('/registro_producto_admin', [authenticate.decodeToken,path], productoController.registro_producto_admin);
api.get('/listar_productos_admin', authenticate.decodeToken, productoController.listar_productos_admin);
api.get('/listar_productos_activos_admin',authenticate.decodeToken, productoController.listar_productos_activos_admin);
api.delete('/eliminar_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_producto_admin)

api.get('/obtener_portada_producto/:img', productoController.obtener_portada_producto);
api.get('/obtener_producto_admin/:id', authenticate.decodeToken, productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', [authenticate.decodeToken,path], productoController.actualizar_producto_admin);
/// Variedades
api.post('/registro_variedad_producto/',authenticate.decodeToken, productoController.registro_variedad_producto);
api.get('/obtener_variedades_producto/:id', authenticate.decodeToken, productoController.obtener_variedades_producto);
api.delete('/eliminar_variedades_producto/:id', authenticate.decodeToken, productoController.eliminar_variedades_producto);
/// Detalles
api.post('/registro_ingresos_admin', [authenticate.decodeToken,path_ingreso], productoController.registro_ingresos_admin)
api.get('/obtener_ingresos_admin/:desde/:hasta',authenticate.decodeToken, productoController.obtener_ingresos_admin)
api.get('/obtener_detalles_ingreso_admin/:id', authenticate.decodeToken, productoController.obtener_detalles_ingreso_admin)
/// Galeria
api.post('/subir_imagen_producto_admin', [authenticate.decodeToken, path_galeria], productoController.subir_imagen_producto_admin) 
api.get('/obtener_galeria_producto/:img', productoController.obtener_galeria_producto)
api.get('/obtener_galeria_producto_admin/:id', authenticate.decodeToken, productoController.obtener_galeria_producto_admin)
api.delete('/eliminar_galeria_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_galeria_producto_admin)
/// Categorias
api.post('/agregar_categoria', authenticate.decodeToken, productoController.agregar_categoria)
api.get('/listar_categorias', authenticate.decodeToken, productoController.listar_categorias)
api.put('/cambiar_estado_categoria/:id', authenticate.decodeToken, productoController.cambiar_estado_categoria)
/// VariedadesNuevo
api.post('/agregar_color', authenticate.decodeToken, productoController.agregar_color)
api.get('/obtener_colores/:id', authenticate.decodeToken, productoController.obtener_colores)

module.exports = api;