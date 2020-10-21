var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let numberofPlayer = 0;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});

io.on('connection', (socket) => {

    socket.join('chambre');
    numberofPlayer += 1;
    console.log(numberofPlayer)


    socket.on('disconnect', (reason) => {

        numberofPlayer -= 1;
        console.log(numberofPlayer)

    });

    socket.on('placeAColor', (emplacement) => {
        console.log(numberofPlayer)

        if (numberofPlayer >= 2) {
            io.emit('placeAColor', emplacement);
        }
    });
        io.emit('numberOfPlayer', numberofPlayer);



});

http.listen((process.env.PORT || 5000), () => {
    console.log('listening on localhost:5000');
});