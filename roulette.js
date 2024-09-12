let selectedChip = 10;
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance'), 10) : 10000; // Default to 10000 if not set

updateBalance();

function updateBalance() {
    document.getElementById('balance-display').textContent = "Balance: $" + balance;
}

updateBalance();

let bets = {
    'numbers': {},
    '2to1': {
        '2to1-1': 0,
        '2to1-2': 0,
        '2to1-3': 0
    },
    'dozen': {      // 1st 12, 2nd 12, 3rd 12
        'first-12': 0,
        'second-12': 0,
        'third-12': 0
    },
    'other': {      // 1 to 18, Even, Odd, Red, Black, 19 to 36
        'oneto': 0,
        'even': 0,
        'blackc': 0,
        'redc': 0,
        'odd': 0,
        'nineteento': 0
    }
};

const balanceDisplay = document.getElementById("balance-display");
const resultDisplay = document.getElementById("result");

document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", function () {
        selectedChip = parseInt(this.getAttribute("data-value"));
        resultDisplay.textContent = `Selected chip: $${selectedChip}`;
    });
});

document.querySelectorAll(".roulette-table .cell").forEach(cell => {
    cell.addEventListener("click", function () {
        const number = this.getAttribute("data-number");
        const betType = this.getAttribute("data-bet-type");

        if (number) {
            placeBetOnNumber(number);
            balance -= selectedChip;
            localStorage.setItem('balance', balance);
            balanceDisplay.textContent = "Balance: $" + balance;

        }

        // Placing bets on 2-to-1
        if (betType && betType.startsWith("2to1")) {
            placeBetOn2to1(betType);
            balance -= selectedChip;
            localStorage.setItem('balance', balance);
            balanceDisplay.textContent = "Balance: $" + balance;
        }

        // Placing bets on 1st 12, 2nd 12, 3rd 12
        if (betType && ['first-12', 'second-12', 'third-12'].includes(betType)) {
            placeBetOnDozen(betType);
            balance -= selectedChip;
            localStorage.setItem('balance', balance);
            balanceDisplay.textContent = "Balance: $" + balance;
        }

        // Placing bets on other outside bets
        if (betType && ['oneto', 'even', 'blackc', 'redc', 'odd', 'nineteento'].includes(betType)) {
            placeBetOnOther(betType);
            balance -= selectedChip;
            localStorage.setItem('balance', balance);
            balanceDisplay.textContent = "Balance: $" + balance;
        }
    });
});

function placeBetOnDozen(betType) {
    if (balance < selectedChip) {
        alert("Insufficient balance!");
        return;
    }

    balance -= selectedChip;
    localStorage.setItem('balance', balance);
    balanceDisplay.textContent = "Balance: $" + balance;

    bets['dozen'][betType] += selectedChip;

    const cell = document.querySelector(`.cell[data-bet-type='${betType}']`);
    displayChipOverlay(cell, bets['dozen'][betType]);
}

// Function to place bet on other outside bets (oneto, even, black, red, odd, nineteento)
function placeBetOnOther(betType) {
    if (balance < selectedChip) {
        alert("Insufficient balance!");
        return;
    }

    balance -= selectedChip;
    balanceDisplay.textContent = balance;

    bets['other'][betType] += selectedChip;

    const cell = document.querySelector(`.cell[data-bet-type='${betType}']`);
    displayChipOverlay(cell, bets['other'][betType]);
}

function placeBetOnNumber(number) {
    if (balance < selectedChip) {
        alert("Insufficient balance!");
        return;
    }

    balance -= selectedChip;
    localStorage.setItem('balance', balance);
    balanceDisplay.textContent = "Balance: $" + balance;

    if (!bets.numbers[number]) {
        bets.numbers[number] = 0;
    }
    bets.numbers[number] += selectedChip;

    const cell = document.querySelector(`.cell[data-number='${number}']`);
    displayChipOverlay(cell, bets.numbers[number]);
}


function placeBetOn2to1(betType) {
    if (balance < selectedChip) {
        alert("Insufficient balance!");
        return;
    }

    balance -= selectedChip;
    localStorage.setItem('balance', balance);
    balanceDisplay.textContent = "Balance: $" + balance;

    bets['2to1'][betType] += selectedChip;

    const cell = document.querySelector(`.cell[data-bet-type='${betType}']`);
    displayChipOverlay(cell, bets['2to1'][betType]);
}

function displayChipOverlay(cell, totalBet) {
    let chipOverlay = cell.querySelector(".chip-overlay");
    
    if (!chipOverlay) {
        chipOverlay = document.createElement("div");
        chipOverlay.classList.add("chip-overlay");
        cell.appendChild(chipOverlay);
    }

    chipOverlay.textContent = `$${totalBet}`;
}
function spinRoulette() {
    
    const randomNumber = Math.floor(Math.random() * 37);
    resultDisplay.textContent = `Roulette Result: ${randomNumber}`;

    let totalWinnings = 0;

    if (bets.numbers[randomNumber]) {
        totalWinnings += bets.numbers[randomNumber] * 35;
    }

    if (randomNumber > 0) {
        if (bets['2to1']['2to1-1'] > 0 && [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(randomNumber)) {
            totalWinnings += bets['2to1']['2to1-1'] * 2;
        }
        if (bets['2to1']['2to1-2'] > 0 && [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(randomNumber)) {
            totalWinnings += bets['2to1']['2to1-2'] * 2;
        }
        if (bets['2to1']['2to1-3'] > 0 && [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(randomNumber)) {
            totalWinnings += bets['2to1']['2to1-3'] * 2;
        }
    }

    if (randomNumber >= 1 && randomNumber <= 12 && bets['dozen']['first-12'] > 0) {
        totalWinnings += bets['dozen']['first-12'] * 2;
    }
    if (randomNumber >= 13 && randomNumber <= 24 && bets['dozen']['second-12'] > 0) {
        totalWinnings += bets['dozen']['second-12'] * 2;
    }
    if (randomNumber >= 25 && randomNumber <= 36 && bets['dozen']['third-12'] > 0) {
        totalWinnings += bets['dozen']['third-12'] * 2;
    }

    if (randomNumber >= 1 && randomNumber <= 18 && bets['other']['oneto'] > 0) {
        totalWinnings += bets['other']['oneto'];
    }
    if (randomNumber >= 19 && randomNumber <= 36 && bets['other']['nineteento'] > 0) {
        totalWinnings += bets['other']['nineteento'];
    }
    if (randomNumber % 2 === 0 && bets['other']['even'] > 0) {
        totalWinnings += bets['other']['even'];
    }
    if (randomNumber % 2 !== 0 && bets['other']['odd'] > 0) {
        totalWinnings += bets['other']['odd'];
    }
    if ([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(randomNumber) && bets['other']['blackc'] > 0) {
        totalWinnings += bets['other']['blackc'];
    }
    if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(randomNumber) && bets['other']['redc'] > 0) {
        totalWinnings += bets['other']['redc'];
    }

    if (totalWinnings > 0) {
        balance += totalWinnings;
        localStorage.setItem('balance', balance);
        resultDisplay.textContent += ` You won $${totalWinnings}!`;
    }else {
        resultDisplay.textContent += " No win.";
    }

    balanceDisplay.textContent = balance;

    bets = {
        'numbers': {},
        '2to1': {
            '2to1-1': 0,
            '2to1-2': 0,
            '2to1-3': 0
        },
        'dozen': {
            'first-12': 0,
            'second-12': 0,
            'third-12': 0
        },
        'other': {
            'oneto': 0,
            'even': 0,
            'blackc': 0,
            'redc': 0,
            'odd': 0,
            'nineteento': 0
        }
    };

    document.querySelectorAll(".chip-overlay").forEach(overlay => overlay.remove());
}
