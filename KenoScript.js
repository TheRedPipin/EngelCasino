let money = 0;
map = [];
let rows = 7;
let columns = 7;
let amountChosen = 0;
let correctAmount = 0;
let tempMoney = 0;
let multipliers = [];
let startMulti = 5;
window.onload = function() {
    money = parseFloat(localStorage.getItem('money')).toFixed(2);
    for (let i = 0; i < rows; i++){
        map.push([]);
        for (let j = 0; j < columns; j++){
            let button = document.createElement('button');
            button.classList.add('mapSpot');
            button.dataset.row = i;
            button.dataset.column = j;
            button.innerText = j+(i*columns)+1;
            map[i].push(0);
            button.addEventListener('click', function() {
                resetMapColors();
                let row = parseInt(this.dataset.row);
                let column = parseInt(this.dataset.column);
                if (map[row][column] === 0 && amountChosen < 10) {
                    map[row][column] = 1;
                    this.style.borderColor = 'orange';
                    amountChosen++;
                }
                else if (map[row][column] === 1) {
                    map[row][column] = 0;
                    this.style.borderColor = 'black';
                    amountChosen--;
                }
                updateProgressBar();
            });
            document.getElementById('mapShell').appendChild(button);
        }
    }
    setInterval(() => {
        document.getElementById('moneyText').innerText = `💎GEMS: ${money}`;
        document.getElementById("betInput").max = money;
        if (amountChosen === 0 || document.getElementById('betInput').value == 0 || document.getElementById('betInput').value === '') {
            document.getElementById('startBtn').disabled = true;
        }
        else {
            document.getElementById('startBtn').disabled = false;
        }
    }, 10);
}

function resetMapColors() {
    let gameButtons = document.getElementsByClassName('mapSpot');
    for (let button of gameButtons) {
        button.style.backgroundColor = '';
    }
    let progressBarSegments = document.getElementsByClassName('progressBarSegment');
    for (let segment of progressBarSegments) {
        segment.style.backgroundColor = 'white';
    }
    return;
}

function startGame() {
    resetMapColors();
    tempMoney = document.getElementById('betInput').value;
    money -= tempMoney;
    document.getElementById('startBtn').disabled = true;
    let chosenCount = 0;
    let chosenNumbers = new Set();
    let interval = setInterval(() => {
        if (chosenCount >= 10) {
            clearInterval(interval);
            return;
        }
        let row, column;
        do {
            row = Math.floor(Math.random() * rows);
            column = Math.floor(Math.random() * columns);
        } while (chosenNumbers.has(`${row}-${column}`));

        chosenNumbers.add(`${row}-${column}`);
        if (map[row][column] === 1) {
            correctAmount++;
            document.getElementById('progressBar').children[correctAmount-1].style.backgroundColor = 'orange';
            let button = document.querySelector(`button[data-row="${row}"][data-column="${column}"]`);
            button.style.backgroundColor = 'green';
        }
        else {
            let button = document.querySelector(`button[data-row="${row}"][data-column="${column}"]`);
            button.style.backgroundColor = 'red';
        }
        chosenCount++;
    }, 200);
    tempMoney *= multipliers[correctAmount];
    money += tempMoney;
    money = parseFloat(money).toFixed(2);
    money = parseFloat(money);
    console.log(typeof money);
    correctAmount = 0;
}

function updateProgressBar() {
    let progressBar = document.getElementById('progressBar');
    progressBar.innerHTML = '';
    multipliers = [];
    let currentMulti = (startMulti * amountChosen)**1.5;
    for (let i = 0; i < amountChosen; i++) {
        if (currentMulti < 1) {
            currentMulti = 1;
        }
        multipliers.push(currentMulti);
        currentMulti /= 3;
    }
    multipliers.reverse();
    for (let i = 0; i < multipliers.length; i++) {
        let segment = document.createElement('div');
        segment.classList.add('progressBarSegment');
        segment.style.height = `${100 / amountChosen}%`;
        let multiplierText = document.createElement('div');
        multiplierText.classList.add('multiplierText');
        multiplierText.innerText = "x" + multipliers[i].toFixed(2);
        segment.appendChild(multiplierText);
        progressBar.appendChild(segment);
    }
    console.log(multipliers);
}

function validateInputs() {
    let inputs = document.querySelectorAll('input[type="number"]');
    for (let input of inputs) {
        checkValue(input);
    }
    setTimeout(validateInputs, 100);
}
validateInputs();

function checkValue(sender) {
    let min = sender.min;
    let max = sender.max;
    let value = parseFloat(sender.value);
    if (value > max) {
        sender.value = max;
    } else if (value < min) {
        sender.value = min;
    }
    if (sender.value.includes('.')) {
        let decimalPlaces = sender.value.split('.')[1].length;
        if (decimalPlaces > 2) {
            sender.value = parseFloat(sender.value).toFixed(2);
        }
    }
}

function returnToSender() {
    money = parseFloat(money).toFixed(2); // Round to 2 decimal places
    localStorage.setItem('money', money);
    window.location.href = 'MainIndex.html';
}