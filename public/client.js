
let username = prompt("Votre nom :");

let firstPlayer;
let secondPlayer;

let whoPlaying = 1;
let canPlay = true;
var plateau = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne dans la console.

var body = document.getElementsByTagName("body")[0];

var tbl = document.createElement("table");
var tblBody = document.createElement("tbody");

for (var i = 0; i < 6; i++) {

    var row = document.createElement("tr");
    row.setAttribute("id", i + 1);

    for (var j = 0; j < 7; j++) {
        var cell = document.createElement("td");
        //Permet de donner un id a chaque td comme ca il sont accessible. 
        let tempi = i.toString();
        let tempJ = j.toString();
        let newvar = tempi.concat(tempJ)
        cell.setAttribute("id", newvar);

        var cellText = document.createTextNode(" ");
        cell.appendChild(cellText);
        row.appendChild(cell);
    }

    tblBody.appendChild(row);
}

tbl.appendChild(tblBody);
body.appendChild(tbl);
tbl.setAttribute("border", "2");

function placeAColor(a) { //Permet de placer un nombre dans une collone a 

    plateauRemplie();
    if (canPlay == true) {
        if (a > 8 || a <= 0 && !isNaN(a)) {
            console.log("Mauvais Numéro");
            return 0;
        }
        console.clear();
        a--; //Permet de de pouvoir mettre 1 en collone et d'avoir la collone 1 pas 0.
        for (let i = 5; i >= 0; i--) {
            if (i == 0 && plateau[i][a] != 0) {
                /* System a opti si tu veux le faire. Mais en vraie y'en a pas besoins je l'ai fais juste pour avoir le message d'erreur*/
                console.log("Case Pleine");
            }
            if (plateau[i][a] == 0) {
                plateau[i][a] = whoPlaying; //Place la case a l'emplacement donné donc collone a et ligne "case" i

                let newi = i;
                newi = i.toString();
                let newa = a;
                newa = newa.toString();
                let newnewvar = newi.concat(newa);
                checkWin();

                if (whoPlaying == 1) {
                    document.getElementById("playerTurn").style.color = "Yellow";
                    whoPlaying = 2;
                    document.getElementById("playerTurn").innerHTML = "Player " + secondPlayer + " Turn"; //Change le text par rapport au tour du joueur
                    document.getElementById(newnewvar).style.backgroundColor = "Red";
                } else {
                    document.getElementById("playerTurn").style.color = "Red";
                    document.getElementById("playerTurn").innerHTML = "Player " + firstPlayer + " Turn"; //Change le text par rapport au tour du joueur
                    document.getElementById(newnewvar).style.backgroundColor = "Yellow";
                    whoPlaying = 1;
                }
                break;
            }
        }
        console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne sinon il est en ligne
    }
}
function checkWin() { // A toi de le faire Fin du coup je l'ai fais sauf diago
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 6; j++) {

            //Premier numéro == ligne deusieme numéro collone
            if (plateau[i][j] == whoPlaying && plateau[i][j + 1] == whoPlaying && plateau[i][j + 2] == whoPlaying && plateau[i][j + 3] == whoPlaying) {
                Won();
                return 1;
            }
            if (i >= 3) {
                if (plateau[i][j] == whoPlaying && plateau[i - 1][j] == whoPlaying && plateau[i - 2][j] == whoPlaying && plateau[i - 3][j] == whoPlaying) {
                    //Check Vertical
                    Won();
                    return 1;
                }
                if (plateau[i][j] == whoPlaying && plateau[i - 1][j - 1] == whoPlaying && plateau[i - 2][j - 2] == whoPlaying && plateau[i - 3][j - 3] == whoPlaying || plateau[i][j] == whoPlaying && plateau[i - 1][j + 1] == whoPlaying && plateau[i - 2][j + 2] == whoPlaying && plateau[i - 3][j + 3] == whoPlaying) {
                    Won();
                    return 1;
                }
                //Check Diagonal
            }
        }
    }
}

// Gestion de la requete du form

$(function () {
    var socket = io();
    socket.emit('username', username);

    $('#placeColor').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        if (!isNaN($('#m').val()) && $('#m').val() < 8 && $('#m').val() >= 0) {
            socket.emit('placeAColor', $('#m').val());
            socket.emit('numberOfPlayer', 2);
            $('#m').val('');
            return false;
        }
    });

    $('#messageForm').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('getUsername', username);
        socket.emit('chat message', $('#message').val());

        $('#message').val('');
        return false;

    });

    socket.on('getUsername', function (chatUsername) {
            $('#messageList').append($('<h5>').text(chatUsername + ' : '));
    });

    socket.on('chat message', function (msg) {
        $('#messageList').append($('<li>').text(msg));
        let objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    socket.on('assignAColor', function (userList) {
        firstPlayer = userList[0];
        secondPlayer = userList[1];
        document.getElementById("playerTurn").innerHTML = "Player " + firstPlayer + " Turn"; //Change le text par rapport au tour du joueur
    });

    socket.on('placeAColor', function (emplacement) {
        placeAColor(emplacement);
        document.getElementById('needMorePlayer').style.display = 'none';
        document.getElementById('notYourTurn').style.visibility = 'hidden';

    });

    socket.on('needMorePlayer', function () {
        document.getElementById('needMorePlayer').innerHTML = "You need 2 Players";
    });
    socket.on('notYourTurn', function () {
        document.getElementById('notYourTurn').style.visibility = 'visible';
        document.getElementById('notYourTurn').innerHTML = "Not Your Turn";

    });

    socket.on('numberOfPlayer', function (numberOfPlayer) {
        document.getElementById('nombreDeJoueur').innerHTML = numberOfPlayer;
    });

});
function plateauRemplie() {
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 6; j++) {
            if (plateau[i][j] == 0) {
                return 0;
            }
        }
    }
    plateauRemplieChangeDesign();

}

function plateauRemplieChangeDesign() {

    console.log("Tableau Remplie");
    canPlay = false;
    document.getElementById("disapear").style.display = "none";
    document.getElementById("replayButton").style.position = "absolute";
    document.getElementById("replayButton").style.left = "47.5%";
    document.getElementById("replayButton").style.marginTop = "40px";


    let theDiv = document.getElementById("wonText");
    theDiv.innerHTML += "Tableau Complet";
    theDiv.style.border = "solid yellow 15px"

}

function replay() {
    document.location.reload(true);
}

function Won() {

    console.log("You won !!");
    canPlay = false;
    document.getElementById("disapear").style.display = "none";
    let theDiv = document.getElementById("wonText");
    if (whoPlaying == 1) {
        theDiv.innerHTML += "Player " + firstPlayer + " Won";
    } else {
        theDiv.innerHTML += "Player " + secondPlayer + " Won";
    }
    theDiv.style.border = "solid yellow 15px";

}

