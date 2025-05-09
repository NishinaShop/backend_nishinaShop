var producto = require ('../models/producto')
var variedad = require ('../models/variedades')
var galeria = require ('../models/galeria')


const obtener_ultimos_productos = async  function(req,res){
    var productos = await producto.find({estado: true}).sort({createdAt:-1}).limit(4)
    res.status(200).send(productos)
}
const obtener_img_ultimos_productos = async function(req,res){
    let img = req.params['img'] 
    fs.stat('./uploads/productos/'+ img,function(err){
        if(err){
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/prodcutos/'+ img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}
const obtener_catalogo_publicos = async  function(req,res){
    var productos = await producto.find({estado: true}).sort({createdAt:-1})
    res.status(200).send(productos)
}
const obtener_slug_producto = async  function(req,res){
    var slug = req.params['slug']
    var product = await producto.findOne({slug:slug})
    var variety = await variedad.find({producto:product._id})
    var galery = await galeria.find({producto:product._id})
    res.status(200).send({product, variety, galery})
}


module.exports = {
    obtener_ultimos_productos,
    obtener_img_ultimos_productos,
    obtener_catalogo_publicos,
    obtener_slug_producto,
}