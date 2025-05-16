var producto = require('../models/producto');
var variedad = require('../models/variedades');
var ingreso = require('../models/ingreso');
var ingreso_detalles = require('../models/ingreso_detalles')
var galeria = require ('../models/galeria')
var slugify = require ('slugify')
const cloudinary = require('../config/cloudinary');
var fs = require ('fs');
var path = require('path');

const registro_producto_admin = async function(req, res) {
  if (req.user) {
    const data = req.body;
    const existing = await producto.find({ nombre: data.nombre });

    if (existing.length >= 1) {
      return res.status(200).send({ data: undefined, message: 'El nombre del producto ya existe.' });
    }

    try {
      // Subir portada a Cloudinary
      const img_path = req.files.portada.path;

      const result = await cloudinary.uploader.upload(img_path, {
        folder: 'nishinashop/productos',
        public_id: slugify(data.nombre), // opcional
      });

      data.portada = result.secure_url;
      data.slug = slugify(data.nombre);

      const newProduct = await producto.create(data);

      // Elimina el archivo temporal del servidor
      fs.unlinkSync(img_path);

      res.status(201).send({ data: newProduct });
    } catch (error) {
      console.error(error);
      res.status(400).send({ data: undefined, message: 'No se pudo crear el producto', error: error.message });
    }
  } else {
    res.status(401).send({ data: undefined, message: 'Error en el Token de autorización' });
  }
};
const listar_productos_admin = async function(req,res){
    if(req.user){
        try {
            let filtro = req.params['filtro'] || req.query['filtro'] || null;
            let query = {};
    
            // Si hay filtro, agregamos las condiciones de búsqueda
            if(filtro) {
                query.$or = [
                    {nombre: new RegExp(filtro, 'i')},
                    {clave: new RegExp(filtro, 'i')},
                    {genero: new RegExp(filtro, 'i')},
                    {categoria: new RegExp(filtro, 'i')}
                ];
            }
    
            let products = await producto.find(query).sort({createdAt:-1});
            res.status(200).send(products);
            
        } catch(error) {
            console.error(error);
            res.status(500).send({message: "Error al buscar productos"});
        }
    }else{
        res.status(500).send({data: undefined, message:"ErroToken"});
    }
}
const obtener_portada_producto = async function(req,res){
    let img = req.params['img'] 
    fs.stat('./uploads/productos/'+ img,function(err){
        if(err){
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/productos/'+ img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}
const obtener_producto_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];

        try {
            let product = await producto.findById({_id: id});
            res.status(200).send(product);
        } catch (error) {
            res.status(200).send(undefined);
        }

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}
const actualizar_producto_admin = async function(req, res) {
  try {
    if (!req.user) return res.status(401).send({ message: 'Error de autenticación' });

    const id = req.params.id;
    let data = req.body;

    const productoExistente = await producto.findById(id);
    if (!productoExistente) return res.status(404).send({ message: 'Producto no encontrado' });

    const productoConMismoNombre = await producto.findOne({
      nombre: data.nombre,
      _id: { $ne: id }
    });
    if (productoConMismoNombre) {
      return res.status(400).send({ message: 'Ya existe un producto con este nombre' });
    }

    // Procesar imagen si se proporciona una nueva
    if (req.files?.portada) {
      const result = await cloudinary.uploader.upload(req.files.portada.path, {
        folder: 'productos/portadas'
      });
      fs.unlinkSync(req.files.portada.path);
      data.portada = result.secure_url;
    } else {
      data.portada = productoExistente.portada;
    }

    data.slug = slugify(data.nombre);

    const productoActualizado = await producto.findByIdAndUpdate(id, {
      $set: {
        ...data
      }
    }, { new: true });

    res.status(200).send({ data: productoActualizado });

  } catch (error) {
    console.error('Error en actualizar_producto_admin:', error);
    res.status(500).send({ message: 'Error interno del servidor', error: error.message });
  }
};

  const registro_variedad_producto = async (req,res) => {
    if(req.user){
        let data = req.body
        let variety = await variedad.create(data);
        res.status(201).send({data:variety})
    }else{
      res.status(500).send({data: undefined, message: 'ErrorToken'})
    }
  };
  const obtener_variedades_producto = async function(req,res){
    if(req.user){
      let id = req.params['id'];
      let variety = await variedad.find({producto:id}).sort({stock:-1})
      res.status(201).send(variety)
    }else{
      res.status(500).send({data: undefined, message: 'ErrorToken'})
    }
  }
  const eliminar_variedades_producto = async function(req,res){
    if(req.user){
      let id = req.params['id'];
      let reg = await variedad.findById({_id: id})
      if(reg.stock == 0){
        let variety = await variedad.findOneAndDelete({_id:id})
        res.status(201).send(variety)
      }else{
        res.status(200).send({data: undefined, message: 'No se puede eliminar el registro'})
      }
      
    }else{
      res.status(500).send({data: undefined, message: 'ErrorToken'})
    }
  }

  const listar_productos_activos_admin = async function(req,res){
    if(req.user){
      let products = await producto.find({estado: true}).sort({createdAt:-1});
      res.status(200).send(products);
      
    }else{
        res.status(500).send({data: undefined, message:"ErroToken"});
    }
  }

  const registro_ingresos_admin = async function(req,res){
    if(req.user){
      let data = req.body
      try {
        let reg_ingresos = await ingreso.find().sort({createdAt:-1})
        if(reg_ingresos.length == 0){
          data.serie = 1;
        } else{
          data.serie = reg_ingresos[0].serie + 1;;
        }
        let detalles = JSON.parse(data.detalles);
        var doc_path = req.files.documento.path;
        var str_doc = doc_path.split('/');
        var str_documento = str_doc[2];
        data.documento = str_documento;
        data.usuario = req.user.sub;
        var add_ingreso =  await ingreso.create(data)
        for (var item of detalles){
          item.ingreso = add_ingreso._id
          await ingreso_detalles.create(item)
          await variedad.findByIdAndUpdate(
            item.variedad, 
            { $inc: { stock: parseInt(item.cantidad) } }
          );
          let product = await producto.findById({_id: item.producto});
          await producto.findByIdAndUpdate({_id: item.producto},{
            stock: parseInt(product.stock) + parseInt(item.cantidad)
          })
          const ganancia = Math.ceil((item.precio_unidad * data.ganancia) / 100);
            const precioConGanancia = parseFloat(item.precio_unidad) + parseFloat(ganancia);
          if(product.stock >= 1){
            const subtotalResidual = product.precio * product.stock;
            const subtotalIngresos = precioConGanancia * item.cantidad;
            const nuevoStock = parseInt(product.stock) + parseInt(item.cantidad);
            const subtotalGeneral = parseFloat(subtotalResidual) + parseFloat(subtotalIngresos);
            const nuevoPrecio = Math.ceil(subtotalGeneral / nuevoStock);
            
            await producto.findByIdAndUpdate(
              item.producto,
              {
                $set: {
                  precio: nuevoPrecio,
                }
              }
            );
          }else{
            await producto.findByIdAndUpdate(
              item.producto,
              {
                $set: {
                  precio: precioConGanancia,
                }
              }
            )
        }
      }
        res.status(200).send(add_ingreso);
      } catch (error) {
      res.status(200).send({message: 'No se pudo registrar el ingreso'});
      }
      
    }else{
        res.status(500).send({data: undefined, message:"ErroToken"});
    }
  }
const subir_imagen_producto_admin = async function(req, res) {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

  let data = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.files.imagen.path, {
      folder: 'productos/galeria'
    });

    // Elimina archivo temporal después de subirlo
    fs.unlinkSync(req.files.imagen.path);

    data.imagen = result.secure_url;

    let imagen = await galeria.create(data);
    res.status(200).send(imagen);
  } catch (error) {
    res.status(500).send({ message: 'Error al subir imagen', error: error.message });
  }
};

  const obtener_galeria_producto = async function(req, res) {
  const imagen = req.params['img'];

  // Si estás guardando la URL completa en la base de datos:
  res.status(200).redirect(imagen || 'https://res.cloudinary.com/tu_cloud_name/image/upload/vxx/default.jpg');
};
const obtener_galeria_producto_admin = async function(req,res){
  if(req.user){
    let id = req.params['id'];
    let galery = await galeria.find({producto:id})
    res.status(200).send(galery)
  }else{
    res.status(500).send({data:undefined, message: 'errorToken'})
  }
}
const eliminar_galeria_producto_admin = async function(req,res){
  if(req.user){
    let id = req.params['id'];
    try {
      let reg = await galeria.findById({_id:id})
      let path_img = './uploads/galeria/'+reg.imagen;
      fs.unlinkSync(path_img)


    let galery = await galeria.findByIdAndDelete({_id:id})
    res.status(200).send(galery)
    } catch (error) {
      console.log(error)
    res.status(200).send({data: undefined, message: 'No se pudo eliminar la imagen'})  
    }
    
  }else{
    res.status(500).send({data:undefined, message: 'errorToken'})
  }
}
const obtener_ingresos_admin = async function(req,res){
  if (req.user){
    let desde = req.params['desde'];
    let hasta = req.params['hasta'];
    let ingresos = await ingreso.find({
      createdAt: {
        $gte: new Date(desde+'T00:00:00'),
        $lt: new Date(hasta+'T00:00:00')
      }
    })
    res.status(200).send(ingresos)
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}
module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada_producto,
    obtener_producto_admin,
    actualizar_producto_admin,
    registro_variedad_producto,
    obtener_variedades_producto,
    eliminar_variedades_producto,
    listar_productos_activos_admin,
    registro_ingresos_admin,
    subir_imagen_producto_admin,
    obtener_galeria_producto,
    obtener_galeria_producto_admin,
    eliminar_galeria_producto_admin,
    obtener_ingresos_admin,
}