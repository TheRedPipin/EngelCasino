let money = 0;
let deck = [];
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
        deck.push(j);
    }
}
let tempMoney = 0;
let oldMoney = 0;
let currentMulti = 0.0;
let currentCard = 0;
let currentIndex = 0;
let higherPercentage = 0;
let lowerPercentage = 0;
window.onload = function() {
    money = parseFloat(parseFloat(localStorage.getItem('money')).toFixed(2));
    animateMoneyText(money);
    setInterval(() => {
        document.getElementById('betInput').max = money;
        document.getElementById('resetBtn').innerText = `Cash Out \n💎${(tempMoney*currentMulti).toFixed(2)}`;
        document.getElementById('multiText').innerHTML = `x${currentMulti}`;
        document.getElementById('currentCardImg').src = `cards/Card${currentCard}.png`;
        if (oldMoney != money) {
            animateMoneyText(money);
        }
        higherPercentage = ((12 - currentCard) / 13) * 100;
        document.getElementById('higherPercentage').innerHTML = `${higherPercentage.toFixed(2)}%`;
        lowerPercentage = (currentCard / 13) * 100;
        document.getElementById('lowerPercentage').innerHTML = `${lowerPercentage.toFixed(2)}%`;
        oldMoney = money;
    }, 10);
    setInterval(() => {
        if (parseFloat(moneyText.innerText.replace('💎GEMS: ', '')) != money) {
            document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
        }
    },1000);
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

function startGame() {
    if (document.getElementById('betInput').value == 0 || document.getElementById('betInput').value == '') {
        return;
    }
    tempMoney = document.getElementById('betInput').value;
    money -= tempMoney;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('resetBtn').disabled = false;
    let gameButtons = document.getElementsByClassName('gameButtons');
    for (let button of gameButtons) {
        button.disabled = false;
    }
    currentIndex = Math.floor(Math.random() * deck.length)
    currentCard = deck[currentIndex];
}

function resetGame(type) {
    oldMoney = money;
    if (type == 1) {
        money += tempMoney * currentMulti;
    }
    money = parseFloat(money.toFixed(2));
    tempMoney = 0;
    currentMulti = 0;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('nextCardImg').src = `cards/Card52.png`;
    let gameButtons = document.getElementsByClassName('gameButtons');
    for (let button of gameButtons) {
        button.disabled = true;
    }
}

function guess(type) {
    let nextCardIndex = Math.floor(Math.random() * deck.length);
    let nextCard = deck[nextCardIndex];
    const nextCardImg = document.getElementById('nextCardImg');
    nextCardImg.classList.add('card-reveal');
    nextCardImg.src = `cards/Card${nextCard}.png`;

    setTimeout(() => {
        nextCardImg.classList.remove('card-reveal');
        if (type == 0 && currentCard <= nextCard) {
            currentMulti += 1.0 + (1.0 - parseFloat((higherPercentage / 100).toFixed(2)));
        } else if (type == 1 && currentCard >= nextCard) {
            currentMulti += 1.0 + (1.0 - parseFloat((lowerPercentage / 100).toFixed(2)));
        } else if (type == 2) {
            currentMulti *= 0.9;
        } else {
            resetGame(0);
            return;
        }
        currentMulti = parseFloat(currentMulti.toFixed(2));
        currentCard = nextCard;
        document.getElementById('currentCardImg').src = `cards/Card${currentCard}.png`;
        nextCardImg.src = `cards/Card52.png`;
    }, 500);
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