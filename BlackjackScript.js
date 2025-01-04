let money = 0;
let bet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerHandIndices = [];
let dealerHandIndices = [];

window.onload = function() {
    money = parseFloat(localStorage.getItem('money')) || 0;
    document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
    setInterval(() => {
        document.getElementById('betInput').max = money;
    }, 10);
}

function returnToSender() {
    localStorage.setItem('money', money);
    window.location.href = 'MainIndex.html';
}

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

function placeBet() {
    bet = parseFloat(document.getElementById('betInput').value);
    if (bet > 0 && bet <= money) {
        money -= bet;
        document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
        document.getElementById('betBtn').disabled = true;
        document.getElementById('hitBtn').disabled = false;
        document.getElementById('standBtn').disabled = false;
        document.getElementById('doubleBtn').disabled = false;
        startGame();
    }
}

async function startGame() {
    document.getElementById('playerHand').innerHTML = '';
    document.getElementById('dealerHand').innerHTML = '';
    deck = createDeck();
    playerHand.push(await drawCard(document.getElementById('playerHand'), playerHandIndices));
    dealerHand.push(await drawCard(document.getElementById('dealerHand'), dealerHandIndices, true));
    playerHand.push(await drawCard(document.getElementById('playerHand'), playerHandIndices));
    dealerHand.push(await drawCard(document.getElementById('dealerHand'), dealerHandIndices));
    updateHands(0);
}

function createDeck() {
    let deck = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 13; j++) {
            deck.push(j);
        }
    }
    return deck;
}

function drawCard(target, handIndices, isHidden = false) {
    const index = Math.floor(Math.random() * deck.length);
    const card = deck[index];
    handIndices.push(index);
    const cardImg = document.createElement('img');
    cardImg.src = isHidden ? 'docs/assets/Cards/Card52.png' : `docs/assets/Cards/Card${index}.png`;
    cardImg.classList.add('drawn-card');
    document.getElementById('deck').appendChild(cardImg);
    return new Promise(resolve => {
        setTimeout(() => {
            cardImg.remove();
            const cardElement = document.createElement('img');
            cardElement.src = isHidden ? 'docs/assets/Cards/Card52.png' : `docs/assets/Cards/Card${index}.png`;
            target.appendChild(cardElement);
            resolve(card);
        }, 500);
    });
}

function updateHands(type) {
    const playerHandDiv = document.getElementById('playerHand');
    const dealerHandDiv = document.getElementById('dealerHand');
    const playerValueDiv = document.getElementById('playerValue');
    const dealerValueDiv = document.getElementById('dealerValue');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';

    playerHandIndices.forEach(index => {
        const cardImg = document.createElement('img');
        cardImg.src = `docs/assets/Cards/Card${index}.png`;
        playerHandDiv.appendChild(cardImg);
    });

    dealerHandIndices.forEach((index, i) => {
        const cardImg = document.createElement('img');
        if (type === 0) {
            cardImg.src = i === 0 ? 'docs/assets/Cards/Card52.png' : `docs/assets/Cards/Card${index}.png`;
        } else {
            cardImg.src = `docs/assets/Cards/Card${index}.png`;
        }
        dealerHandDiv.appendChild(cardImg);
    });

    playerValueDiv.innerText = `Player: ${calculateHandValue(playerHand)}`;
    dealerValueDiv.innerText = `Dealer: ${type === 0 ? '???' : calculateHandValue(dealerHand)}`;
}

async function hit() {
    playerHand.push(await drawCard(document.getElementById('playerHand'), playerHandIndices));
    updateHands(0);
    if (calculateHandValue(playerHand) > 21) {
        endGame('lose');
    }
}

async function stand() {
    const dealerHandDiv = document.getElementById('dealerHand');
    const hiddenCard = dealerHandDiv.children[0];
    hiddenCard.classList.add('reveal-card');
    hiddenCard.src = `docs/assets/Cards/Card${dealerHandIndices[0]}.png`;

    const drawDealerCard = async () => {
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(await drawCard(dealerHandDiv, dealerHandIndices));
            updateHands(1);
        }
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        if (dealerValue > 21 || playerValue > dealerValue) {
            endGame('win');
        } else if (playerValue < dealerValue) {
            endGame('lose');
        } else {
            endGame('draw');
        }
    };

    await drawDealerCard();
}

function double() {
    if (money >= bet) {
        money -= bet;
        bet *= 2;
        document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
        hit();
        if (calculateHandValue(playerHand) <= 21) {
            stand();
        }
    }
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
        if (card >= 10) {
            value += 10;
        } else if (card === 0) {
            aces += 1;
            value += 11;
        } else {
            value += card + 1;
        }
    });
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }
    return value;
}

function endGame(result) {
    document.getElementById('hitBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
    document.getElementById('doubleBtn').disabled = true;
    if (result === 'win') {
        money += bet * 2;
    } else if (result === 'draw') {
        money += bet;
    }
    document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
    document.getElementById('betBtn').disabled = false;
    playerHand = [];
    dealerHand = [];
    playerHandIndices = [];
    dealerHandIndices = [];
}
