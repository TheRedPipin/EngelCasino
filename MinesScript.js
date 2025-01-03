let map = []
let rows = 5;
let columns = 5;
let tempMoney = 0;
let currentMulti = 1.0;
let money = 0;
let oldMoney = 0;
let nextMulti = 1.0;
let start = false;
let startingMulti = [
    1.10, 1.15, 1.20, 1.25, 1.30, 1.35, 1.40, 1.45, 1.50, 1.55,
    1.60, 1.65, 1.70, 1.75, 1.80, 1.85, 1.90, 1.95, 2.00, 2.05
];

window.onload = function() {
    money = localStorage.getItem('money');
    console.log(money);
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            let button = document.createElement('button');
            button.classList.add('mapSpot');
            button.disabled = true;
            button.dataset.row = i;
            button.dataset.column = j;
            button.addEventListener('click', function() {
                let row = parseInt(this.dataset.row);
                let column = parseInt(this.dataset.column);
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                    setTimeout(() => {
                        if (map[row][column] === 1) {
                            this.style.backgroundColor = 'red';
                            this.innerText = '💣';
                            setTimeout(function() {
                                alert('You lost!');
                                resetGame(0);
                            }, 100);
                        } else {
                            this.style.backgroundColor = 'green';
                            this.innerText = '💎';
                            map[row][column] = 2;
                            let remainingSquares = 0;
                            let remainingBombs = 0;
                            for (let i = 0; i < rows; i++) {
                                for (let j = 0; j < columns; j++) {
                                    if (map[i][j] === 0) {
                                        remainingSquares++;
                                    } else if (map[i][j] === 1) {
                                        remainingBombs++;
                                    }
                                }
                            }
                            if (remainingSquares > 0) {
                                currentMulti = nextMulti;
                                nextMulti *= Math.pow(1 + (remainingBombs / remainingSquares), 1.25);
                            }
                            nextMulti = parseFloat(nextMulti.toFixed(2));
                            let allFound = true;
                            for (let i = 0; i < rows; i++){
                                for (let j = 0; j < columns; j++){
                                    if (map[i][j] === 0) {
                                        allFound = false;
                                    }
                                }
                            }
                            if (allFound) {
                                setTimeout(function() {
                                    alert('You won!');
                                    resetGame(1);
                                }, 100);
                            }
                        }
                        this.disabled = true;
                    }, 250);
                }, 500);
            });
            document.getElementById('mapShell').appendChild(button);
        }
    }
    document.getElementById('betInput').max = money;
    setInterval(function() {
        document.getElementById('resetBtn').innerText = `Cash Out \n💎${tempMoney*currentMulti}`;
        document.getElementById('multiText').innerHTML = `x${currentMulti}`;
        if (start == false){
            document.getElementById('betInput').max = money;
        }
    }, 100);

    setInterval(function() {
        if ((document.getElementsByClassName('shake').length != 0)){
            document.getElementById('resetBtn').disabled = true;
            console.log('disabled');
        }
        else if (start == true){
            document.getElementById('resetBtn').disabled = false;
            console.log(document.getElementsByClassName('shake').length);
            console.log(start);
        }
        if (oldMoney != money) {
            animateMoneyText(money);
        }
        oldMoney = money;
    }, 10);
}

function startGame() {
    start = true;
    map = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let button = document.querySelector(`button[data-row='${i}'][data-column='${j}']`);
            button.style.backgroundColor = '';
            button.innerText = '';
        }
    }
    let betValue = document.getElementById('betInput').value;
    if (!betValue || betValue == 0) {
        return;
    }
    let bombInput = document.getElementById('bombInput').value;
    if (!bombInput || bombInput == 0) {
        document.getElementById('bombInput').value = 1;
    }
    for (let i = 0; i < rows; i++){
        map.push([]);
        for (let j = 0; j < columns; j++){
            map[i].push(0);
        }
    }
    document.getElementById('startBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('bombInput').disabled = true;
    document.getElementById('betInput').disabled = true;
    let buttons = document.getElementsByClassName('mapSpot');
    for (let button of buttons) {
        button.disabled = false;
    }
    tempMoney = document.getElementById('betInput').value;
    money -= tempMoney;
    let bombCount = document.getElementById('bombInput').value;
    for (let i = 0; i < bombCount; i++) {
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * columns);
        while (map[randomRow][randomCol] === 1) {
            randomRow = Math.floor(Math.random() * rows);
            randomCol = Math.floor(Math.random() * columns);
        }
        map[randomRow][randomCol] = 1;
    }
    nextMulti = startingMulti[bombCount - 1];
    console.log(map);
}

function resetGame(type) {
    start = false;
    let buttons = document.getElementsByClassName('mapSpot');
    for (let button of buttons) {
        let row = parseInt(button.dataset.row);
        let column = parseInt(button.dataset.column);
        button.disabled = true;
        if (map[row][column] === 1) {
            button.style.backgroundColor = 'red';
            button.innerText = '💣';
        } else {
            button.style.backgroundColor = 'green';
            button.innerText = '💎';
        }
    }
    document.getElementById('startBtn').disabled = false;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('bombInput').disabled = false;
    document.getElementById('betInput').disabled = false;
    for (let button of buttons) {
        button.disabled = true;
    }
    if (type === 1) {
        money += tempMoney * currentMulti;
    }
    money = parseFloat(money.toFixed(2));
    currentMulti = 1.0;
    nextMulti = 1.0;
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
    localStorage.setItem('money', money);
    window.location.href = 'MainIndex.html';
}

function animateMoneyText(targetMoney) {
    const moneyText = document.getElementById('moneyText');
    let currentMoney = parseFloat(moneyText.innerText.replace('💎GEMS: ', '')) || 0;
    const increment = (targetMoney - currentMoney) / 50;
    const interval = setInterval(() => {
        currentMoney += increment;
        moneyText.innerText = `💎GEMS: ${currentMoney.toFixed(2)}`;
        if ((increment > 0 && currentMoney >= targetMoney) || (increment < 0 && currentMoney <= targetMoney)) {
            clearInterval(interval);
            moneyText.innerText = `💎GEMS: ${targetMoney.toFixed(2)}`;
        }
    }, 10);
}