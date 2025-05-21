const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config()
const cors = require('cors');

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
const ventas_router = require('./routes/ventas');
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
app.use(cors({
  origin: [
    'https://panel.nishinashop.com',
    'https://www.nishinashop.com',
    'https://nishinashop.com',
    'http://localhost:8080',
    'http://localhost:8081/' 
   ], // o '*' para permitir todo en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



// Inicialización
connectDB();
app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);
app.use('/api', public_router);
app.use('/api', customers_router);
app.use('/api', ventas_router);


module.exports = app;