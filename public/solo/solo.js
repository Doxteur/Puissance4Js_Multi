    generate_table();

    let isAiActive = false;
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

    function placeAColor(a) { //Permet de placer un nombre dans une collone a 
        score();
        plateauRemplie();
        if (canPlay == true) {
            if (a > 8 || a <= 0) {
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
                    console.log(newnewvar);
                    checkWin();

                    if (whoPlaying == 1) {
                        whoPlaying = 2;
                    } else {
                        whoPlaying = 1;
                    }
                    document.getElementById("playerTurn").innerHTML = "Player " + whoPlaying + " Turn"; //Change le text par rapport au tour du joueur
                    if (whoPlaying == 1) {
                        document.getElementById("playerTurn").style.color = "Red";
                        document.getElementById(newnewvar).style.backgroundColor = "Yellow";

                    } else {
                        document.getElementById("playerTurn").style.color = "Yellow";
                        document.getElementById(newnewvar).style.backgroundColor = "Red";

                    }
                    break;
                }
            }
            console.log(plateau.join("\n") + "\n\n"); //Permet de mettre le tableau en colonne sinon il est en ligne
        }
        IA();

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

    function Won() {

        console.log("You won !!");
        canPlay = false;
        let wontext = document.getElementById("wonText");
        wontext.innerHTML += "Player " + whoPlaying + " Won";
        if (whoPlaying == 2) {
            wontext.style.color = "Yellow";
        }
        wontext.style.border = "solid yellow 15px";
        document.getElementById("table").style.display = "none"
        document.getElementById("playerTurn").style.display = "none"


    }

    function replay() {
        document.location.reload(true);
    }

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
        canPlay = false;
        let theDiv = document.getElementById("wonText");
        theDiv.innerHTML += "Tableau Complet";
        document.getElementById("table").style.display = "none"
        document.getElementById("playerTurn").style.display = "none"


    }

    function evaluation(situation, whoPlaying) {}

    function minimax(situation, whoPlaying) {

    }
    // Score Table
    function score() {
        // Score Horizontale
        let score = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {

                for (let result of plateau) {
                    console.log(result);
                    const countResult = result.filter(i => i === 2).length;
                    const zerocountResult = result.filter(i => i === 0).length;
                    console.log(zerocountResult)
                    if (countResult >= 4) {
                        score += 100
                    }
                    if (countResult > 3 && zerocountResult == 1) {
                        score += 10
                    }
                    console.log(score)
                }
                return score
            }
        }

    }


    // Minimax Alogrithm 
    function initialiseIA() {
        isAiActive = true;
    }



    function generate_table() {

        var body = document.getElementsByTagName("body")[0];

        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");

        for (var i = 0; i < 6; i++) {

            var row = document.createElement("tr");
            row.setAttribute("id", i + 1);

            for (var j = 0; j < 7; j++) {
                var cell = document.createElement("td");
                let btn = document.createElement("BUTTON");

                //Permet de donner un id a chaque td comme ca il sont accessible. 
                let tempi = i.toString();
                let tempJ = j.toString();
                let newvar = tempi.concat(tempJ)
                cell.setAttribute("id", newvar);

                var cellText = document.createTextNode(" ");
                let emplacementBouton = newvar % 10 + 1;

                // Quand le bouton est cliquer il envoie au serveur l'emplacement de la case qui doit changer
                btn.onclick = function() {

                    placeAColor(emplacementBouton);
                };
                cell.appendChild(cellText);
                cell.appendChild(btn)
                row.appendChild(cell);
            }

            tblBody.appendChild(row);
        }

        tbl.appendChild(tblBody);
        body.appendChild(tbl);
        tbl.setAttribute("border", "2");
    }