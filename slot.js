document.addEventListener('DOMContentLoaded', () => {
const symbols = ["🍒", "🍋", "🍇", "💎"];

const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const spinButton = document.getElementById("spinButton");
const balanceDisplay = document.getElementById("balance");
const betAmountDisplay = document.getElementById("betAmount");
const betButtons = document.querySelectorAll(".bet-btn");

let balance = parseInt(localStorage.getItem("balance")) || 1000;
let betAmount = 10;

balanceDisplay.textContent = balance;

function updateBalance() {
    balanceDisplay.textContent = balance;
    localStorage.setItem("balance", balance);
}

function updateBetAmount(amount) {
    betAmount += amount;
    if (betAmount < 10) betAmount = 10;
    betAmountDisplay.textContent = betAmount;
}

betButtons.forEach(button => {
    button.addEventListener("click", () => {
        const betValue = parseInt(button.getAttribute("data-bet"), 10);
        updateBetAmount(betValue);
    });
});

function spinReels() {

    spinButton.disabled = true;

    startReelSpin(reel1);
    startReelSpin(reel2);
    startReelSpin(reel3);

    const reel1SpinTime = Math.random() * 200 + 100;
    const reel2SpinTime = reel1SpinTime + 200;
    const reel3SpinTime = reel2SpinTime + 200;

    setTimeout(() => stopReel(reel1), reel1SpinTime);
    setTimeout(() => stopReel(reel2), reel2SpinTime);
    setTimeout(() => {
        stopReel(reel3);
        checkWin();
    }, reel3SpinTime);
}

function startReelSpin(reel) {
    const reelContent = document.createElement("div");
    reelContent.classList.add("reel-content");

    reelContent.innerHTML = createRandomizedReelContent();
    reel.innerHTML = '';
    reel.appendChild(reelContent);

    reelContent.style.animation = "spin 1s linear infinite";
}

function createRandomizedReelContent() {
    let shuffledSymbols = shuffleArray(symbols.concat(symbols));
    return shuffledSymbols.map(symbol => `<div>${symbol}</div>`).join('');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function stopReel(reel) {
    const reelContent = reel.querySelector(".reel-content");
    reelContent.style.animation = "none";

    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    reel.innerHTML = `<div class="reel-content"><div>${randomSymbol}</div></div>`;
}

const gameOverMessage = document.getElementById("gameOverMessage");

const winMessage = document.getElementById("winMessage");
const winText = document.getElementById("winText");

function checkWin() {
    const symbol1 = reel1.textContent.trim();
    const symbol2 = reel2.textContent.trim();
    const symbol3 = reel3.textContent.trim();

    balance -= betAmount;

    if (symbol1 === symbol2 && symbol2 === symbol3) {
        const winAmount = betAmount * 10;
        balance += winAmount;

        let winMessageText = `You won ${winAmount}! `;
        if (winAmount >= 5000) {
            winMessageText += "Jackpot! Big Win!";
        } else if (winAmount >= 1000) {
            winMessageText += "Huge Win!";
        } else if (winAmount >= 100) {
            winMessageText += "Nice Win!";
        } else {
            winMessageText += "Good Job!";
        }

        winText.textContent = winMessageText;
        winMessage.style.display = 'block';

        setTimeout(() => {
            winMessage.style.display = 'none';
        }, 3000);

        animateWin();
    }

    updateBalance();

    spinButton.disabled = false;

    if (balance <= 0) {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
        const closeModalButton = document.getElementsByClassName('close')[0];
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
            }
        });
    }
}

function animateWin() {
    reel1.classList.add("win");
    reel2.classList.add("win");
    reel3.classList.add("win");

    setTimeout(() => {
        reel1.classList.remove("win");
        reel2.classList.remove("win");
        reel3.classList.remove("win");
    }, 2000);
}

spinButton.addEventListener("click", spinReels);
})