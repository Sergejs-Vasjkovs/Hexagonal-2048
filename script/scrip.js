let mainHexes = [];
let divsOnPage = [];

let radius = 2;

const gameStatusEl = document.getElementById("game-status");

const gameScoreEl = document.getElementById("game-score");
let gameScore = 0;

const hexFieldEl = document.getElementById("hex-field");
const fieldWidth = hexFieldEl.offsetWidth;
const fieldHeight = hexFieldEl.offsetHeight;

const hexElement = document.getElementsByClassName("hex-field_item");

class Hexagon {
    constructor(q, s, r, value) {
        this.q = q;
        this.s = s;
        this.r = r;
        this.value = value;
    }

    getID(Hexagon) {
        let id = "";
        id += Hexagon.q;
        id += Hexagon.s;
        id += Hexagon.r;
        return id;
    }

    generateCoordinates(fieldRadius, mainHexes) {
        this.fieldRadius = fieldRadius--;
        this.mainHexes = mainHexes;

        for (var q = -fieldRadius; q <= fieldRadius; q++) {
            for (var s = -fieldRadius; s <= fieldRadius; s++) {
                for (var r = -fieldRadius; r <= fieldRadius; r++) {
                    if (q + s + r == 0) {
                        this.mainHexes.push(new Hexagon(q, s, r, 0));
                    }
                }
            }
        }
    }

    hexToDiv(mainHexes) {
        for (let i = 0; i < mainHexes.length; i++) {
            let hex = document.createElement("div");
            hex.setAttribute("class", "hex-field_item");
            const id = mainHexes[i].getID(mainHexes[i]);
            hex.setAttribute("id", `${id}`);
            hex.dataset.x = mainHexes[i].r;
            hex.dataset.y = mainHexes[i].s;
            hex.dataset.z = mainHexes[i].q;
            hex.dataset.value = 0;

            let hexSpanNum = document.createElement("span");
            hexSpanNum.setAttribute("class", "hex-field_item_number");
            hexSpanNum.innerHTML = "";

            hex.appendChild(hexSpanNum);
            hexFieldEl.appendChild(hex);
            divsOnPage.push(hex); // сохраняем DIVы в массив
        }
    }

    setPositionToDiv(mainHexes) {
        const hexEl = document.querySelector(".hex-field_item");

        const hexWidth = hexEl.offsetWidth;
        const hexHeight = hexEl.offsetHeight;

        const fieldWidthCenter = (fieldWidth - hexWidth) / 2;
        const FieldHeightCenter = (fieldHeight - hexHeight) / 2;

        for (let i = 0; i < mainHexes.length; i++) {
            let size = hexWidth / 2 - 1; // 1 - hexagon border;
            let x = size * Math.sqrt(3) * (mainHexes[i].q + mainHexes[i].r / 2);
            let y = size * 3 / 2 * mainHexes[i].r;
            divsOnPage[i].style.left = y + fieldWidthCenter + "px";
            divsOnPage[i].style.top = x + FieldHeightCenter + "px";
        }
    }
}

function generateNumber() {
    checkGameOver();
    let randomNumber = Math.floor(Math.random() * divsOnPage.length);
    let number = divsOnPage[randomNumber].children;
    if (number[0].innerHTML == "") {
        number[0].innerHTML = 2;
        mainHexes[randomNumber].value = 2;
        divsOnPage[randomNumber].dataset.value = 2;
    } else {
        generateNumber();
    }
}

function checkGameOver() {
    let zeros = 0;
    for (var i = 0; i < mainHexes.length; i++) {
        if (mainHexes[i].value == 0) {
            zeros++;
        }
    }
    if (zeros == 0) {
        gameIsOver();
    }
}


function swipe(coordinates, swipeUpOrDown) {
    let rowIndex = -(radius - 1);
    let hexsRows = radius * 2 - 1;
    let sortedArray = [];

    for (let i = 0; i < hexsRows; i++) {
        for (let i = 0; i < mainHexes.length; i++) {
            if (mainHexes[i][coordinates] == rowIndex) {
                sortedArray.push(mainHexes[i]);
            }
        }
        rowIndex++;

        let valuesArray = [];
        for (let i = 0; i < sortedArray.length; i++) {
            valuesArray.push(sortedArray[i].value);
        }

        let newRow = swipeUpOrDown(valuesArray);
        for (let i = 0; i < newRow.length; i++) {
            if (newRow[i] === newRow[i + 1]) {
                let combinedTotal = newRow[i] + newRow[i + 1];
                newRow[i] = combinedTotal;
                newRow[i + 1] = 0;
                gameScore += combinedTotal;
                gameScoreEl.innerHTML = gameScore;
            }
        }

        let newRowAfterSum = swipeUpOrDown(newRow);
        for (let i = 0; i < sortedArray.length; i++) {
            sortedArray[i].value = newRowAfterSum[i];
        }

        for (let i = 0; i < sortedArray.length; i++) {
            let hex = new Hexagon();
            const id = hex.getID(sortedArray[i]);

            let hexEl = document.getElementById(`${id}`);

            const value = sortedArray[i].value;
            hexEl.dataset.value = value;
            let a = document.getElementById(`${id}`).childNodes;

            if (value == 0) {
                a[0].innerHTML = "";
            } else {
                a[0].innerHTML = value;
            }
        }
        sortedArray = [];
    }
}

function ShiftNumbersDown(array) {
    let valuesNotZero = array.filter(num => num);
    let missing = array.length - valuesNotZero.length;
    let zeros = Array(missing).fill(0);
    let newRow = zeros.concat(valuesNotZero);
    return newRow;
}

function ShiftNumbersUp(array) {
    let valuesNotZero = array.filter(num => num);
    let missing = array.length - valuesNotZero.length;
    let zeros = Array(missing).fill(0);
    let newRow = valuesNotZero.concat(zeros);
    return newRow;
}

function startTheGame() {
    startGameEl.style.display = "none";
    document.getElementById("hex-field-score").style.visibility = "visible";

    let main = new Hexagon();
    main.generateCoordinates(radius, mainHexes);
    main.hexToDiv(mainHexes);
    main.setPositionToDiv(mainHexes);

    for (let i = 0; i < radius; i++) {
        generateNumber();
    }
}

function gameIsOver() {
    gameStatusEl.dataset.status = "game-over";
    gameStatusEl.innerHTML = "GAME OVER!";

    document.getElementById("hex-field-restart").style.visibility = "visible";
    endGameScoreEl.innerHTML = gameScore;
    document.removeEventListener("keyup", control);
}

function restartTheGame() {
    document.querySelectorAll('.hex-field_item').forEach(element => element.remove());
    document.getElementById("hex-field-restart").style.visibility = "hidden";
    document.getElementById("hex-field-score").style.visibility = "hidden";

    mainHexes = [];
    divsOnPage = [];

    gameScoreEl.innerHTML = 0;
    gameScore = 0;
    endGameScoreEl.innerHTML = 0;
    gameStatusEl.dataset.status = "playing";
    gameStatusEl.innerHTML = "playing";
    startGameEl.style.display = "block";

    document.addEventListener("keyup", control);
}

function control(event) {
    if (event.keyCode === 87) {
        swipe("r", ShiftNumbersUp);
    } else if (event.keyCode === 69) {
        swipe("s", ShiftNumbersUp);
    } else if (event.keyCode === 81) {
        swipe("q", ShiftNumbersDown);
    } else if (event.keyCode === 83) {
        swipe("r", ShiftNumbersDown);
    } else if (event.keyCode === 68) {
        swipe("q", ShiftNumbersUp);
    } else if (event.keyCode === 65) {
        swipe("s", ShiftNumbersDown);
    }
    generateNumber();
}

const gameLevelRangeEl = document.getElementById("game-level");
const gameLevelEl = document.getElementById("show-game-level");
let fieldRadiusLevel = gameLevelRangeEl.value;

gameLevelRangeEl.addEventListener('change', (event) => {
    fieldRadiusLevel = event.target.value;
    gameLevelEl.innerHTML = fieldRadiusLevel;
    radius = fieldRadiusLevel;
});

const startButtonEl = document.getElementById("start-game-btn");
const startGameEl = document.getElementById("start-game");
const restartButtonEl = document.getElementById("restart-game-btn");
let endGameScoreEl = document.getElementById("end-game-score");

startButtonEl.addEventListener("click", () => {
    startTheGame();
});

restartButtonEl.addEventListener("click", () => {
    restartTheGame();
});

document.addEventListener("keyup", control);