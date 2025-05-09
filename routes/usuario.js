const express = require ('express');
var usuarioController = require ('../controllers/usuarioControllers')
var authenticate = require ('../middlewares/authenticate')
var api = express.Router();
api.post ('/registro_usuario_admin', usuarioController.registro_usuario_admin); 
api.post ('/login_usuario',usuarioController.login_usuario);
api.get ('/listar_usuarios_admin', authenticate.decodeToken, usuarioController.listar_usuarios_admin);
api.get ('/obtener_usuario_admin/:id', authenticate.decodeToken, usuarioController.obtener_usuario_admin);
api.put ('/actualizar_usuario_admin/:id', authenticate.decodeToken, usuarioController.actualizar_usuario_admin);
api.put ('/cambiar_estado_usuario_admin/:id', authenticate.decodeToken, usuarioController.cambiar_estado_usuario_admin);
module.exports = api;