
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/main.js', function(req,res){
    res.sendFile(__dirname + '/dist/main.js');
});
app.get('/stylesheets/main.css', function(req,res){
    res.sendFile(__dirname + '/src/stylesheets/main.css');
});
io.on('connection', function(socket){
    console.log('A user has connected');
    socket.on('disconnect', function(){
        console.log('A user has disconnected');
        
    });
    socket.on('message', function(msg){
        console.log(msg);
        let newMsg = {username: 'Lol', message: msg, color: '#407fe5', badge: false};
        io.emit('message', newMsg);
    });
});
http.listen(8080, function(){
    console.log('App is listening at port number 8080');
    
});