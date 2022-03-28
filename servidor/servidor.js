const express = require('express');
const http = require('http');
//const { disconnect } = require('process');
const app = express();
const servidor = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(servidor,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

//establecemos conexion
io.on('connection', socket =>{
    //cada vez que el cliente se conecte, se ejecutara lo siguiente
    let usuario;
    socket.on('conectado',(dataName)=>{
        usuario = dataName;
        io.emit('mensajes',{ //io-->socket.broadcast
            nombre: usuario, 
            mensaje:`${usuario} ha entrado a la sala del chat`
        });
        console.log('conectado al cliente');
    });

    socket.on('mensaje', (nombre, mensaje)=>{
        io.emit('mensajes',{nombre, mensaje});
    });
    
    socket.on('disconnect', ()=>{
        io.emit('mensajes',{
            servidor: 'servidor', 
            mensaje:`${usuario} ha abandonado la sala`
        });
    });
});
servidor.listen(4000, ()=> console.log('servidor funciona'));