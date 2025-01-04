if (localStorage.getItem('money') === null) {
    localStorage.setItem('money', 100);
}

window.onload = function() {
    money = parseFloat(parseFloat(localStorage.getItem('money')).toFixed(2));
    document.getElementById('moneyText').innerText = `💎Gems: ${money.toFixed(2)}`;
    createFallingCards();
    checkGemButtonCooldown();
    setInterval(() => {
        if (parseFloat(document.getElementById('moneyText').innerText.replace('💎Gems: ', '')) != money) {
            document.getElementById('moneyText').innerText = `💎Gems: ${money.toFixed(2)}`;
        }
    }, 1000);
}

function createFallingCards() {
    const cardImages = [];
    for (let i = 0; i < 52; i++) {
        cardImages.push(`docs/assets/Cards/Card${i}.png`);
    }
    for (let i = 1; i < 9; i++) {
        cardImages.push(`docs/assets/Cards/chips${i}.png`);
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
    const images = cardImages;
    const card = document.createElement('img');
    card.src = images[Math.floor(Math.random() * images.length)];
    card.classList.add('falling-card');
    card.style.left = `${Math.random() * 100}vw`;
    card.style.animationDuration = `${Math.random() * 5 + 5}s`;
    document.body.appendChild(card);
    setTimeout(() => {
        card.remove();
    }, parseFloat(card.style.animationDuration) * 1000);
}

function resetMoney() {
    localStorage.setItem('money', 0);
    money = 0;
    document.getElementById('moneyText').innerText = `💎Gems: ${money.toFixed(2)}`;
}

function addGem() {
    if (Date.now() - localStorage.getItem('gemBtnCooldown') < 10000) {
        return;
    }
    money = parseFloat(localStorage.getItem('money')) + 1;
    localStorage.setItem('money', money);
    document.getElementById('moneyText').innerText = `💎Gems: ${money.toFixed(2)}`;
    disableGemButton();
}

function disableGemButton() {
    const gemBtn = document.getElementById('gemBtn');
    localStorage.setItem('gemBtnCooldown', Date.now());
    gemBtn.disabled = true;
    let remainingTime = 10;
    gemBtn.innerText = `Get 1 Gem (${remainingTime}s)`;
    const interval = setInterval(() => {
        remainingTime -= 1;
        gemBtn.innerText = `Get 1 Gem (${remainingTime}s)`;
        if (remainingTime <= 0) {
            clearInterval(interval);
            gemBtn.disabled = false;
            gemBtn.innerText = 'Get 1 Gem';
        }
    }, 1000);
}

function checkGemButtonCooldown() {
    const gemBtn = document.getElementById('gemBtn');
    const cooldownTime = localStorage.getItem('gemBtnCooldown');
    if (cooldownTime) {
        const elapsed = Date.now() - cooldownTime;
        if (elapsed < 10000) {
            gemBtn.disabled = true;
            let remainingTime = Math.ceil((10000 - elapsed) / 1000);
            gemBtn.innerText = `Get 1 Gem (${remainingTime}s)`;
            const interval = setInterval(() => {
                remainingTime -= 1;
                gemBtn.innerText = `Get 1 Gem (${remainingTime}s)`;
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    gemBtn.disabled = false;
                    gemBtn.innerText = 'Get 1 Gem';
                }
            }, 1000);
        }
    }
}