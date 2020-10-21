const { userInfo } = require('os');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let numberofPlayer = 0;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});
let userList = [];
io.on('connection', (socket) => {
    
    socket.join('room1');
    numberofPlayer += 1;
    if (numberofPlayer != 0) {

    }
    console.log(numberofPlayer)

    socket.on('username', function(username){
        userList.push(username);
        io.emit('assignAColor',userList);
    });
    socket.on('disconnect', (reason) => {

        numberofPlayer -= 1;

    });

    socket.on('placeAColor', (emplacement) => {

        if (numberofPlayer >= 2) {
            io.emit('placeAColor', emplacement);
        }
    });

    io.emit('numberOfPlayer', numberofPlayer);

    

});


http.listen((process.env.PORT || 5000), () => {
    console.log('listening on localhost:5000');
});