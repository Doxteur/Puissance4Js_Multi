var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    
    io.emit('join',"Someone Join");
});

http.listen((process.env.PORT || 5000), () => {
    console.log('listening on *:5000');
});