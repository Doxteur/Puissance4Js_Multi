const { userInfo } = require('os');
let express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let numberofPlayer = 0;
let playerturn = 0;

let whoPlaying = 1;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/MainPage.html');

});

app.use(express.static('public'));


let userList = [];
let userID = [];
var plateau = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

io.on('connection', (socket) => {
    userID.push(socket.id);
   
    numberofPlayer += 1;
    io.emit('numberOfPlayer', numberofPlayer);

    socket.on('replay', function () {
        plateau = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne sinon il est en ligne
        io.emit('reset');

    });

    // Gérer le tableau
    socket.on('updatePlateau', function (emplacement) {

        if (numberofPlayer >= 2) {
            if (socket.id == userID[playerturn]) {
                playerturn += 1;

                plateauRemplie();
                if (emplacement > 8 || emplacement <= 0 && !isNaN(emplacement)) {
                    console.log("Mauvais Numéro");
                    return 0;
                }
                emplacement--; //Permet de de pouvoir mettre 1 en collone et d'avoir la collone 1 et non pas 0.
                for (let i = 5; i >= 0; i--) {
                    if (i == 0 && plateau[i][emplacement] != 0) {
                        /* System a opti si tu veux le faire. Mais en vraie y'en a pas besoins je l'ai fais juste pour avoir le message d'erreur*/
                        console.log("Case Pleine");
                    }
                    if (plateau[i][emplacement] == 0) {
                        plateau[i][emplacement] = whoPlaying; //Place la case a l'emplacement donné donc collone a et ligne "case" i
                        let newi = i;
                        newi = i.toString();
                        let newa = emplacement;
                        newa = newa.toString();
                        let newnewvar = newi.concat(newa);

                        io.emit("whereToChangeColor", newnewvar, whoPlaying, userList);

                        checkWin();

                        if (whoPlaying == 1) {
                            whoPlaying = 2;
                        } else {
                            whoPlaying = 1;
                        }
                        break;

                    }
                }
                function checkWin() {
                    for (let i = 0; i <= 5; i++) {
                        for (let j = 0; j <= 6; j++) {

                            //Premier numéro == ligne deuxieme numéro collone
                            if (plateau[i][j] == whoPlaying && plateau[i][j + 1] == whoPlaying && plateau[i][j + 2] == whoPlaying && plateau[i][j + 3] == whoPlaying) {
                                // Check Horizontale
                                console.log(whoPlaying + " Won")
                                // Fonction Won
                                io.emit('playerWon', whoPlaying);

                                return 1;
                            }
                            if (i >= 3) {
                                if (plateau[i][j] == whoPlaying && plateau[i - 1][j] == whoPlaying && plateau[i - 2][j] == whoPlaying && plateau[i - 3][j] == whoPlaying) {
                                    //Check Vertical
                                    console.log(whoPlaying + " Won")
                                    // Fonction Won
                                    io.emit('playerWon', whoPlaying);
                                    return 1;
                                }
                                if (plateau[i][j] == whoPlaying && plateau[i - 1][j - 1] == whoPlaying && plateau[i - 2][j - 2] == whoPlaying && plateau[i - 3][j - 3] == whoPlaying || plateau[i][j] == whoPlaying && plateau[i - 1][j + 1] == whoPlaying && plateau[i - 2][j + 2] == whoPlaying && plateau[i - 3][j + 3] == whoPlaying) {
                                    //Check Diagonal
                                    console.log(whoPlaying + " Won")
                                    // Fonction Won
                                    io.emit('playerWon', whoPlaying);
                                    return 1;
                                }
                            }
                        }
                    }
                }

                function plateauRemplie() {
                    for (let i = 0; i <= 5; i++) {
                        for (let j = 0; j <= 6; j++) {
                            if (plateau[i][j] == 0) {
                                return 0;
                            }
                        }
                    }
                    // Send Information of plateau Remplie

                }


                if (playerturn > 1) {
                    playerturn = 0;
                }
            } else {
                io.to(socket.id).emit('notYourTurn', 'Not your turn');
            }
        } else {
            io.emit('needMorePlayer', 'Not enougth Player');
        }
    });

    socket.on('username', (username) => {
        if(socket.id == userID[0] || socket.id == userID[1]){
        userList.push(username);
    }
    io.emit('assignAColor', userList, whoPlaying);
    });
    socket.on('getUsername', (username) => {
        io.emit('getUsername', username);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', (reason) => {
      
        numberofPlayer -= 1;
        io.emit('numberOfPlayer', numberofPlayer);
        let whoDisconnected = userID.indexOf(socket.id);
        userID.splice(whoDisconnected, 1);
        userList.splice(whoDisconnected, 1);
        io.emit('assignAColor', userList);
        if (userID == 0) {
            io.emit('replay');

        }
        if(whoDisconnected <= 1)
        io.emit("afficherDéconnexion");


    });

});


http.listen((process.env.PORT || 5000), () => {
    console.log('listening on localhost:5000');
});