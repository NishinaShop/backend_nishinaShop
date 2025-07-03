var producto = require('../models/producto');
var variedad = require('../models/variedades');
var ingreso = require('../models/ingreso');
var ingreso_detalles = require('../models/ingreso_detalles')
var galeria = require ('../models/galeria')
var usuario = require ('../models/usuario') 
var categoria = require ('../models/categorias')
var color = require ('../models/colores')
var talla = require ('../models/tallas')
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
    }var ingreso = require('../models/ingreso');
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
    if (req.user.rol != 'Administrador'){
      res.status(200).send({ message: 'No tienes permiso' })
    }else{
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

  
    }
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
const eliminar_producto_admin = async function(req,res){
    if(req.user){
      if(req.user.rol == 'Administrador'){
        let id = req.params['id'];
      let reg = await producto.findById({_id: id})
      if(reg.stock == 0){
        let product = await producto.findOneAndDelete({_id:id})
        res.status(201).send(product)
      }else{
        res.status(200).send({data: undefined, message: 'No se puede eliminar el registro'})
      }
      
      }else{
        res.status(200).send({data: undefined, message: 'No cuentas con permiso para esa accion'})
      }
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
    if (req.user) {
    let data = req.body;
    
    try {
        // 1. Validar si el ncomprobante ya existe
        const comprobanteExistente = await ingreso.findOne({ ncomprobante: data.ncomprobante });
        if (comprobanteExistente) {
            // Eliminar archivo temporal si se subió (pero no se usará)
            if (req.files?.documento?.path) fs.unlinkSync(req.files.documento.path);
            return res.status(200).send({ message: 'El número de factura ya está registrado' });
        }

        // 2. Generar serie (lógica original)
        let reg_ingresos = await ingreso.find().sort({ createdAt: -1 });
        data.serie = reg_ingresos.length == 0 ? 1 : reg_ingresos[0].serie + 1;

        // 3. Subir PDF a Cloudinary (solo si no existe duplicado)
        if (req.files && req.files.documento) {
                const nombreArchivo = data.ncomprobante.replace(/[^a-zA-Z0-9]/g, '-');
                const result = await cloudinary.uploader.upload(req.files.documento.path, {
                    folder: 'facturas',
                    resource_type: 'raw',
                    public_id: nombreArchivo,
                    format: 'pdf'
                });
                
                // Guarda ambos: nombre y URL pública
                data.documento = result.secure_url;
                 // ¡Nuevo campo para la URL!
                
                fs.unlinkSync(req.files.documento.path);
            } else {
                return res.status(200).send({ message: 'No se subió ningún documento PDF' }); 
        }

        // 4. Procesar registro y detalles (lógica original)
        data.usuario = req.user.sub;
        let detalles = JSON.parse(data.detalles);
        let add_ingreso = await ingreso.create(data);
        console.log(detalles);
        
        for (var item of detalles) {
            item.ingreso = add_ingreso._id;
            await ingreso_detalles.create(item);
            await talla.findByIdAndUpdate(
                item.talla,
                { $inc: { stock: parseInt(item.cantidad) } }
            );
            let product = await producto.findById({ _id: item.producto });
            await producto.findByIdAndUpdate(
                { _id: item.producto },
                { 
                    stock: parseInt(product.stock) + parseInt(item.cantidad),
                    precio: parseInt(item.precio_unidad)
                }
            );
        }

        res.status(200).send(add_ingreso);

    } catch (error) {
    // Eliminar archivo temporal en caso de error, sin romper el catch
    if (req.files?.documento?.path) {
        const filePath = req.files.documento.path;
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fsError) {
            console.error("Error al eliminar el archivo temporal:", fsError);
        }
    }

    console.error("Error en registro_ingresos_admin:", error);
    res.status(200).send({ message: 'No se pudo registrar el ingreso', error: error.message });
}
  } else {
      res.status(500).send({ data: undefined, message: "ErrorToken" });
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
const subir_factura_admin = async function(req, res) {
  if (!req.user) return res.status(401).send({ message: 'ErrorToken' });

  let data = req.body;

  try {
    // Validar que se subió un archivo y es PDF
    if (!req.files || !req.files.factura) {
      return res.status(400).send({ message: 'No se subió ningún archivo PDF' });
    }

    const file = req.files.factura;
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (fileExt !== 'pdf') {
      fs.unlinkSync(file.path); // Elimina el archivo temporal
      return res.status(400).send({ message: 'Solo se permiten archivos PDF' });
    }

    // Subir a Cloudinary (¡usa resource_type: 'raw'!)
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'facturas',
      resource_type: 'raw', // Clave para archivos no-imagen
      format: 'pdf'
    });

    // Elimina archivo temporal después de subirlo
    fs.unlinkSync(file.path);

    // Guarda la URL en tu base de datos (ajusta según tu modelo)
    data.factura_url = result.secure_url;
    data.public_id = result.public_id;

    let factura = await FacturaModel.create(data); // Reemplaza con tu modelo
    res.status(200).send(factura);

  } catch (error) {
    // Elimina el archivo temporal en caso de error
    if (req.files?.factura?.path) fs.unlinkSync(req.files.factura.path);
    res.status(500).send({ message: 'Error al subir factura', error: error.message });
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
    let galery = await galeria.find({producto:id}).populate('color')
    var galeriaPorColor =  {}
    galery.forEach(item => {
      let colorID = item.color._id;

      if(!galeriaPorColor[colorID]){
        galeriaPorColor[colorID] = {
          color : item.color,
          imagenes: []
        }
      }
      galeriaPorColor[colorID].imagenes.push({
        imagen: item.imagen,
        id: item._id
      })
    })
    res.status(200).send(galeriaPorColor)
  }else{
    res.status(500).send({data:undefined, message: 'errorToken'})
  }
}
const eliminar_galeria_producto_admin = async function(req,res){
  if(req.user){
    let id = req.params['id'];
    try {
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
const obtener_detalles_ingreso_admin = async function(req,res){
  if (req.user){
    let id = req.params['id']
    let Ingreso = await ingreso.findById({_id:id})
    let detalles = await ingreso_detalles.find({ingreso:id}).populate('producto').populate('color')
    let colors = await color.find({producto:id})
      var variedades = []
      for(var item of colors){
        var tallas = await talla.find({color:item._id})
        variedades.push({
          colores: item,
          tallas: tallas 
        })
      }
    let colaborador = await usuario.findById({_id:Ingreso.usuario})
    res.status(200).send({Ingreso,detalles,colaborador})
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}

const agregar_categoria = async function(req,res){
  if (req.user){
    let data = req.body
    var reg = await categoria.find({titulo:data.titulo})
    if(reg.length == 0){
      data.slug = slugify(data.titulo).toLowerCase()
      var category = await categoria.create(data);
    res.status(200).send(category)
    }else{
      res.status(200).send({data: undefined, message: 'Categoria existente'})
    }
    
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}

const listar_categorias = async function(req,res){
  if (req.user){
    var regs = await categoria.find().sort({titulo: 1});
    var categorias = []
    for(item of regs){
  var productos = await producto.find({categoria: item.titulo})
  categorias.push({
    categoria: item,
    n_productos: productos.length
  })
    }
    res.status(200).send(categorias)  
  }else{
    res.status(500).send({data: undefined, message: 'Error en el token'})
  }
}

const cambiar_estado_categoria = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;
        let nuevoEstado = false;
        if (data.estado){
            nuevoEstado = false;
        } else {
            nuevoEstado = true;
        }
        let categoty = await categoria.findByIdAndUpdate({_id: id},{
            estado: nuevoEstado,
        });
        res.status(200).send(categoty)
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}
const agregar_color =  async function (req,res){
  if(req.user){
    let data = req.body
    let colors = await color.create(data);
    res.status(201).send(colors)
  }else{
    res.status(500).send({data: undefined, message: 'Error de token'})
  }
}

const obtener_colores =  async function (req,res){
    if(req.user){
      let id = req.params['id'];
      let colors = await color.find({producto:id})
      var variedades = []
      for(var item of colors){
        var tallas = await talla.find({color:item._id})
        variedades.push({
          colores: item,
          tallas: tallas 
        })
      }
      res.status(201).send(variedades)
    }else{
      res.status(500).send({data: undefined, message: 'Error de token'})
    }
  }

const agregar_talla =  async function (req,res){
  if(req.user){
    let data = req.body
    try {
    let reg = await talla.findOne({ talla: data.talla, color: data._id });
    if (!reg) {
      let nuevaTalla = await talla.create(data);
      res.status(201).send(nuevaTalla);
    } else {
      res.status(200).send({ data: undefined, message: 'La talla ya existe para ese color' });
    }

  } catch (error) {
    console.log('ERROR al registrar la talla:', error); 
    res.status(500).send({ data: undefined, message: 'Error al registrar la talla', error });
  }
  }else{
    res.status(500).send({data: undefined, message: 'Error de token'})
  }
}

const eliminar_talla =  async function (req,res){
  if(req.user){
    let id = req.params['id']
    let tallas = await talla.findById({_id:id})
    if(tallas.stock == 0){
      let Tallas = await talla.findOneAndDelete({_id:id})
      res.status(200).send(Tallas)
    }else{
        res.status(200).send({data: undefined, message: 'No se puede eliminar el registro'})
      }
  }else{
    res.status(500).send({data: undefined, message: 'Error de token'})
  }
}

const eliminar_color =  async function (req,res){
  if(req.user){
    let id = req.params['id']    
    try {
      let tallasEnlazadas = await talla.find({ color: id });
      if (tallasEnlazadas.length === 0) {
        let colorEliminado = await color.findByIdAndDelete(id);
        res.status(201).send(colorEliminado);
      } else {
        res.status(200).send({
          data: undefined,
          message: 'No se puede eliminar el color porque tiene tallas asociadas'
        });
      }
    } catch (error) {
      res.status(500).send({ data: undefined, message: 'Error en la operación', error });
    }

  }else{
    res.status(500).send({data: undefined, message: 'Error de token'})
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
    eliminar_producto_admin,
    eliminar_variedades_producto,
    listar_productos_activos_admin,
    registro_ingresos_admin,
    subir_imagen_producto_admin,
    obtener_galeria_producto,
    obtener_galeria_producto_admin,
    eliminar_galeria_producto_admin,
    obtener_ingresos_admin,
    subir_factura_admin,
    obtener_detalles_ingreso_admin,
    agregar_categoria,
    listar_categorias,
    cambiar_estado_categoria,
    agregar_color,
    agregar_talla,
    obtener_colores,
    eliminar_color,
    eliminar_talla,
}