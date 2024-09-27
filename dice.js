document.addEventListener('DOMContentLoaded', () => {
const rollButton = document.getElementById("rollButton");
const dice = document.getElementById("dice");
const result = document.getElementById("result");
const balanceElement = document.getElementById("balance");
const betAmountInput = document.getElementById("betAmount");
const betTypeSelect = document.getElementById("betType");
const winMessage = document.getElementById("winMessage");
const winText = document.getElementById("winText");
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance'), 10) : 100;
updateBalance();

rollButton.addEventListener("click", () => {
    const betAmount = parseInt(betAmountInput.value);
    const betType = betTypeSelect.value;

    if (betAmount > balance) {
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

    balance -= betAmount;
    updateBalance();

    rollButton.disabled = true;

    dice.style.transform = "rotate(360deg)";

    setTimeout(() => {
        const randomRoll = Math.floor(Math.random() * 6) + 1;

        dice.src = getCustomDiceFace(randomRoll);

        const didWin = checkWin(randomRoll, betType);

        if (didWin) {
            const winnings = calculateWinnings(betAmount, betType);
            balance += winnings;
            result.textContent = `You won $${winnings}! Rolled a ${randomRoll}.`;
        
            winText.textContent = `Congratulations! You won $${winnings}!`;
            winMessage.classList.remove('hidden');
            setTimeout(() => {
                winMessage.classList.add('hidden');
            }, 3000);
        } else {
            result.textContent = `You lost! Rolled a ${randomRoll}.`;
        }

        updateBalance();

        dice.style.transform = "rotate(0deg)";
        rollButton.disabled = false;
    }, 1000);
});

function getCustomDiceFace(roll) {
    return `dice${roll}.svg`;
}

function checkWin(roll, betType) {
    if (betType === "even" && roll % 2 === 0) {
        return true;
    }
    if (betType === "odd" && roll % 2 !== 0) {
        return true;
    }
    if (parseInt(betType) === roll) {
        return true;
    }
    return false;
}

function calculateWinnings(betAmount, betType) {
    if (betType === "even" || betType === "odd") {
        return betAmount * 2; 
    } else {
        return betAmount * 5;
    }
}

function updateBalance() {
    balanceElement.textContent = balance;
    localStorage.setItem('balance', balance);
}
})