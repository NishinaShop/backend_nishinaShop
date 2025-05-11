
var ventas= require ('../models/venta')
var detalles_ventas = require ('../models/detalles_venta')

const listar_ventas_admin = async function(req,res){
    if(req.user){
        try {
                    let filtro = req.params['filtro'] || req.query['filtro'] || null;
                    let query = {};
            
                    // Si hay filtro, agregamos las condiciones de búsqueda
                    if(filtro) {
                        query.$or = [
                            {estado: new RegExp(filtro, 'i')},
                            {serie: new RegExp(filtro, 'i')},
                            {transaccion: new RegExp(filtro, 'i')},
                        ];
                    }
            
                    let venta = await ventas.find(query).sort({createdAt:-1});
                    res.status(200).send(detalles_ventas);
                    
                } catch(error) {
                    console.error(error);
                    res.status(500).send({message: "Error al buscar la orden"});
                }
            }else{
                res.status(500).send({data: undefined, message:"ErroToken"});
            }
}
module.exports = {
listar_ventas_admin,
}