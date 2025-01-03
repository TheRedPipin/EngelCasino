if (localStorage.getItem('money') === null) {
    localStorage.setItem('money', 100);
}

window.onload = function() {
    animateMoneyText(parseFloat(localStorage.getItem('money')));
    createFallingCards();
}

function animateMoneyText(targetMoney) {
    const moneyText = document.getElementById('moneyText');
    let currentMoney = parseFloat(moneyText.innerText.replace('Gems: ', '')) || 0;
    const increment = (targetMoney - currentMoney) / 50;

    const interval = setInterval(() => {
        currentMoney += increment;
        moneyText.innerText = `Gems: ${currentMoney.toFixed(2)}`;
        if ((increment > 0 && currentMoney >= targetMoney) || (increment < 0 && currentMoney <= targetMoney)) {
            clearInterval(interval);
            moneyText.innerText = `Gems: ${targetMoney.toFixed(2)}`;
        }
    }, 10);
}

function createFallingCards() {
    const cardImages = [];
    for (let i = 0; i < 52; i++) {
        cardImages.push(`cards/Card${i}.png`);
    }

    for (let i = 0; i < 5; i++) {
        createCard(cardImages);
    }

    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createCard(cardImages);
            }, Math.random() * 300);
        }
    }, 300);
}

function createCard(cardImages) {
    const card = document.createElement('img');
    card.src = cardImages[Math.floor(Math.random() * cardImages.length)];
    card.classList.add('falling-card');
    card.style.left = `${Math.random() * 100}vw`;
    card.style.animationDuration = `${Math.random() * 5 + 5}s`;
    document.body.appendChild(card);
    setTimeout(() => {
        card.remove();
    }, parseFloat(card.style.animationDuration) * 1000);
}