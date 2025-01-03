let money = 0;
let bet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerSplitHand = [];
let isSplit = false;

window.onload = function() {
    money = parseFloat(localStorage.getItem('money')) || 0;
    document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
    document.getElementById('betInput').max = money;
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
        document.getElementById('splitBtn').disabled = false;
        startGame();
    }
}

async function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerHand.push(await drawCard(document.getElementById('playerHand')));
    dealerHand.push(await drawCard(document.getElementById('dealerHand')));
    playerHand.push(await drawCard(document.getElementById('playerHand')));
    dealerHand.push(await drawCard(document.getElementById('dealerHand')));
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

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard(target) {
    const card = deck.pop();
    const cardImg = document.createElement('img');
    cardImg.src = `docs/assets/Cards/Card${card}.png`;
    cardImg.classList.add('drawn-card');
    document.getElementById('deck').appendChild(cardImg);
    return new Promise(resolve => {
        setTimeout(() => {
            cardImg.remove();
            const cardElement = document.createElement('img');
            cardElement.src = `docs/assets/Cards/Card${card}.png`;
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

    playerHand.forEach(card => {
        const cardImg = document.createElement('img');
        cardImg.src = `docs/assets/Cards/Card${card}.png`;
        playerHandDiv.appendChild(cardImg);
    });

    dealerHand.forEach((card, index) => {
        const cardImg = document.createElement('img');
        if (type === 0) {
            cardImg.src = index === 0 ? 'docs/assets/Cards/Card52.png' : `docs/assets/Cards/Card${card}.png`;
        } else {
            cardImg.src = `docs/assets/Cards/Card${card}.png`;
        }
        dealerHandDiv.appendChild(cardImg);
    });

    playerValueDiv.innerText = `Player: ${calculateHandValue(playerHand)}`;
    dealerValueDiv.innerText = `Dealer: ${type === 0 ? '???' : calculateHandValue(dealerHand)}`;
}

async function hit() {
    playerHand.push(await drawCard(document.getElementById('playerHand')));
    updateHands(0);
    if (calculateHandValue(playerHand) > 21) {
        endGame('lose');
    }
}

async function stand() {
    const dealerHandDiv = document.getElementById('dealerHand');
    const hiddenCard = dealerHandDiv.children[0];
    hiddenCard.classList.add('reveal-card');
    hiddenCard.src = `docs/assets/Cards/Card${dealerHand[0]}.png`;

    const drawDealerCard = async () => {
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(await drawCard(dealerHandDiv));
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

function split() {
    if (playerHand.length === 2 && playerHand[0] === playerHand[1] && money >= bet) {
        money -= bet;
        playerSplitHand = [playerHand.pop()];
        playerHand.push(drawCard());
        playerSplitHand.push(drawCard());
        isSplit = true;
        document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
        updateHands(0);
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
    document.getElementById('splitBtn').disabled = true;
    if (result === 'win') {
        money += bet * 2;
    } else if (result === 'draw') {
        money += bet;
    }
    document.getElementById('moneyText').innerText = `💎GEMS: ${money.toFixed(2)}`;
    document.getElementById('betBtn').disabled = false;
    playerHand = [];
    dealerHand = [];
}
