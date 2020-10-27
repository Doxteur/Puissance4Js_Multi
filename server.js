const { userInfo } = require('os');

let express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let numberofPlayer = 0;
let playerturn = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/MainPage.html');

});

app.use(express.static('public'));

let userList = [];
let userID = [];
io.on('connection', (socket) => {

    socket.join('room1');
    numberofPlayer += 1;
    socket.on('username', (username) => {
     
        userList.push(username);
        userID.push(socket.id);
        io.emit('assignAColor', userList);

    });
    socket.on('getUsername' , (username) => {
        io.emit('getUsername', username);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message',msg);
    });

    socket.on('disconnect', (reason) => {
        numberofPlayer -= 1;
        io.emit('numberOfPlayer', numberofPlayer);
        userList.length = 0;
        userID.length = 0;
        io.emit('assignAColor', userList);
    });

    socket.on('placeAColor', (emplacement) => {
        if (numberofPlayer >= 2) {
            if (socket.id == userID[playerturn]) {
                io.emit('placeAColor', emplacement);
                playerturn += 1;
                if (playerturn > 1) {
                    playerturn = 0;
                }
            } else{
                io.to(socket.id).emit('notYourTurn', 'Not your turn');
            }
        } else {
            io.emit('needMorePlayer', 'Not enougth Player');
        }
    });

    io.emit('numberOfPlayer', numberofPlayer);


});


http.listen((process.env.PORT || 5000), () => {
    console.log('listening on localhost:5000');
});