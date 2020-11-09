let username = prompt("Votre nom :");

let firstPlayer;
let secondPlayer;

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

 



// Gestion de la requete du form

$(function () {
    
    socket.on('reset',function(){
        var tdElement = document.getElementsByTagName('td');

        for (var i = 0; i < tdElement.length; i++) {
            tdElement[i].style.background = 'none';
        }        console.log("Communique")

    });
    socket.on('whereToChangeColor',function(newnewvar , whoPlaying,userList){
        document.getElementById('notYourTurn').style.visibility = 'hidden';
        document.getElementById('needMorePlayer').style.visibility = 'hidden';

        firstPlayer = userList[0];
        secondPlayer = userList[1];
        if(whoPlaying == 1){
            
        document.getElementById(newnewvar).style.backgroundColor = "Red";
        document.getElementById("playerTurn").innerHTML = "Player " + secondPlayer + " Turn"; //Change le text par rapport au tour du joueur
        document.getElementById("playerTurn").style.color = "Yellow";

        
    }else if(whoPlaying == 2){
        document.getElementById("playerTurn").innerHTML = "Player " + firstPlayer + " Turn"; //Change le text par rapport au tour du joueur
        document.getElementById("playerTurn").style.color = "Red";

        document.getElementById(newnewvar).style.backgroundColor = "Blue";

    }
    });
    socket.on('playerWon',function(whoPlaying){        

    document.getElementById("disapear").style.display = "none";
    let theDiv = document.getElementById("wonText");
    if (whoPlaying == 1) {
        theDiv.innerHTML += "Player " + firstPlayer + " Won";
    } else {
        theDiv.innerHTML += "Player " + secondPlayer + " Won";
    }
    theDiv.style.border = "solid yellow 15px";
    });


    socket.emit('username', username);

    $('#placeColor').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        if (!isNaN($('#m').val()) && $('#m').val() < 8 && $('#m').val() > 0 ) {
            socket.emit('placeAColor', $('#m').val());
            socket.emit('updatePlateau',$('#m').val())

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

   
    socket.on('afficherDéconnexion',function(){
        document.getElementById('notYourTurn').style.visibility = 'visible';
        document.getElementById('notYourTurn').innerHTML = "L'adversaire à quitté";
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

var socket = io();
    
function replay(){
    socket.emit('replay');
    console.log('Replay')
}
