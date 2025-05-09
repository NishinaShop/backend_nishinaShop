const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config(); // Necesario para variables de entorno

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: { origin: '*' }
});

// 1. Configuración de la conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://nishinashopqro:<db_password>@nishinashop.petjuxh.mongodb.net/nishinaShop?retryWrites=true&w=majority&appName=nishinaShop';

// Eventos de Socket.io
io.on("connection", (socket) => {
  socket.on('send_cart', function(data) {
    io.emit('listen_cart', data);
  });
});

const port = process.env.PORT || 3000;

// Rutas
const cliente_router = require('./routes/cliente');
const usuario_router = require('./routes/usuario');
const producto_router = require('./routes/producto');
const public_router = require('./routes/public');
const customers_router = require('./routes/customers');

// Middlewares
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));

// Conexión a la base de datos
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000 
        });
    
    console.log('✅ Conectado a MongoDB Atlas');
    httpServer.listen(port, () => {
      console.log(`🚀 Servidor escuchando en puerto ${port}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  }
}

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});

// Inicialización
connectDB();
app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);
app.use('/api', public_router);
app.use('/api', customers_router);

module.exports = app;