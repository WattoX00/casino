document.addEventListener('DOMContentLoaded', () => {
const symbols = ['🌵', '🤠', '🌅', '🐎', '🐍', '🦂', '🏜️', '🔫', '💥', '💰', '🦅', '🐴', '🍀', '🎲', '🐱‍👤', '❌'];
const grid = document.getElementById('slots');
const betInput = document.getElementById('betAmount');
const resultText = document.getElementById('resultText');
const payoutText = document.getElementById('payoutText');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetBalance');
const balanceDisplay = document.getElementById("balance");


let balance = parseInt(localStorage.getItem("balance")) || 1000;
balanceDisplay.textContent = "Balance: $" + localStorage.getItem('balance');

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getSpinningSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spin() {
    const currentBalance = parseInt(localStorage.getItem('balance'), 10);
    const bet = parseInt(betInput.value);

    if (isNaN(bet) || bet <= 0) {
        resultText.textContent = "Please enter a valid bet.";
        return;
    }
    if (bet > currentBalance) {
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
        return;
    }

    localStorage.setItem('balance', currentBalance - bet);
    balanceDisplay.textContent = "Balance: $" + localStorage.getItem('balance');

    grid.innerHTML = '';
    const slotMatrix = [];
    let spinTimers = [];

    for (let row = 0; row < 3; row++) {
        slotMatrix[row] = [];
        for (let col = 0; col < 5; col++) {
            const slotElement = document.createElement('div');
            slotElement.textContent = getSpinningSymbol();
            slotElement.dataset.row = row;
            slotElement.dataset.col = col;
            slotElement.classList.add('spinning');
            grid.appendChild(slotElement);

            slotMatrix[row][col] = slotElement;
        }
    }

    for (let col = 0; col < 5; col++) {
        spinTimers[col] = setTimeout(() => stopColumn(slotMatrix, col, bet), col * 1000);
    }
}

function stopColumn(slotMatrix, col, bet) {
    for (let row = 0; row < 3; row++) {
        const finalSymbol = getRandomSymbol();
        slotMatrix[row][col].textContent = finalSymbol;
        slotMatrix[row][col].classList.remove('spinning');
        slotMatrix[row][col] = finalSymbol;
    }

    if (col === 4) {
        setTimeout(() => calculatePayout(slotMatrix, bet), 500);
    }
}

function calculatePayout(matrix, bet) {
    let totalPayout = 0;
    let hasMultiplier = false;
    let symbolCount = {};
    let winningTiles = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            const symbol = matrix[row][col];

            if (symbol === '❌') {
                hasMultiplier = true;
            } else {
                if (!symbolCount[symbol]) {
                    symbolCount[symbol] = { count: 0, positions: [] };
                }
                symbolCount[symbol].count++;
                symbolCount[symbol].positions.push({ row, col });
            }
        }
    }

    for (const symbol in symbolCount) {
        const { count, positions } = symbolCount[symbol];

        if (count >= 3) {
            const symbolPayout = (count * 0.2 * bet);
            totalPayout += symbolPayout;
            winningTiles.push(...positions);

            resultText.textContent = `You got ${count} ${symbol}'s!`;
        }
    }

    if (hasMultiplier) {
        const multiplierValue = Math.floor(Math.random() * 2) + 2;
        totalPayout *= multiplierValue;
        resultText.textContent += ` Multiplier applied: ${multiplierValue}x!`;
    }

    highlightWinningTiles(winningTiles);

    payoutText.textContent = `Total Payout: $${totalPayout.toFixed(2)}`;

    const currentBalance = parseInt(localStorage.getItem('balance'), 10);
    localStorage.setItem('balance', currentBalance + totalPayout);
    balanceDisplay.textContent = "Balance: $" + localStorage.getItem('balance');
}

function highlightWinningTiles(winningTiles) {
    const allSlots = document.querySelectorAll('.grid div');
    allSlots.forEach(slot => slot.classList.remove('win-highlight'));

    winningTiles.forEach(tile => {
        const selector = `.grid div:nth-child(${tile.row * 5 + tile.col + 1})`;
        const winningSlot = document.querySelector(selector);
        if (winningSlot) {
            winningSlot.classList.add('win-highlight');
        }
    });
}

spinButton.addEventListener('click', spin);
})