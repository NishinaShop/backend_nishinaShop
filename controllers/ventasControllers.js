
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')

const listar_ventas_admin = async function(req,res){
    if(req.user){
        let venta = await ventas.find();
        res.status(200).send(venta)
    }else{
        res.status(500).send({data: undefined, message:"ErroToken"});
    }
}
module.exports = {
listar_ventas_admin,
}