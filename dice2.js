let lastRolls = [];
let lastResultAmount = 0;

document.getElementById('roll-dice').addEventListener('click', rollDice);
document.getElementById('roll-slider').addEventListener('input', updateWinChanceAndPayout);

function updateWinChanceAndPayout() {
    const rollUnder = parseInt(document.getElementById('roll-slider').value);
    const betAmount = parseFloat(document.getElementById('bet-amount').value);

    document.getElementById('win-chance').textContent = `${rollUnder}%`;

    const payoutMultiplier = (100 / rollUnder).toFixed(2);
    document.getElementById('payout-multiplier').textContent = `${payoutMultiplier}x`;

    const estimatedPayout = (payoutMultiplier * betAmount).toFixed(2);
    document.getElementById('estimated-payout').textContent = estimatedPayout;

    updateSliderTrack(rollUnder);
}
if (!localStorage.getItem('balance')) {
    localStorage.setItem('balance', '10000');
}

let balance = parseFloat(localStorage.getItem('balance'));
document.getElementById('balance').textContent = balance.toFixed(2);

function updateBalance(newBalance) {
    balance = newBalance;
    localStorage.setItem('balance', balance.toFixed(2));
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// Roll Dice function modified to use localStorage for balance
function rollDice() {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    const rollUnder = parseInt(document.getElementById('roll-slider').value);
    
    if (betAmount > balance) {
        alert('You don\'t have enough balance!');
        return;
    }

    const diceRoll = Math.floor(Math.random() * 100) + 1;
    const diceResultElement = document.getElementById('dice-number');
    diceResultElement.textContent = diceRoll;

    let payout = 0;
    if (diceRoll < rollUnder) {
        payout = (100 / rollUnder) * betAmount;
        balance += payout;
        updateLastRoll(diceRoll, true);
        lastResultAmount = payout;
    } else {
        balance -= betAmount;
        updateLastRoll(diceRoll, false);
        lastResultAmount = -betAmount;
    }

    // Update balance in localStorage
    updateBalance(balance);

    document.getElementById('last-result-amount').textContent = `${lastResultAmount > 0 ? "+" : ""}${lastResultAmount.toFixed(2)}`;

    moveDiceRoll(diceRoll);
}

function moveDiceRoll(diceRoll) {
    const diceResultElement = document.getElementById('dice-number');
    const slider = document.getElementById('roll-slider');
    
    // Calculate the exact width of the slider
    const sliderWidth = slider.offsetWidth;
    
    // Calculate the position in percentage, ensuring it's within bounds
    const positionPercentage = diceRoll / 100;
    
    // Set the dice position based on the percentage of the slider width
    let leftPosition = positionPercentage * sliderWidth;
    
    // Ensure the dice does not overflow the slider
    if (leftPosition < 0) {
        leftPosition = 0;
    } else if (leftPosition > sliderWidth - diceResultElement.offsetWidth) {
        leftPosition = sliderWidth - diceResultElement.offsetWidth;
    }

    // Update dice position
    diceResultElement.style.left = `${leftPosition}px`;
}

function updateSliderTrack(rollUnder) {
    const winTrack = document.getElementById('win-track');
    winTrack.style.background = `linear-gradient(to right, green ${rollUnder}%, red ${rollUnder}%)`;
}

function updateLastRoll(roll, isWin) {
    if (lastRolls.length >= 5) {
        lastRolls.shift();
    }

    lastRolls.push({ roll, isWin });

    const lastRollsList = document.getElementById('last-rolls-list');
    lastRollsList.innerHTML = '';
    
    lastRolls.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.roll;
        li.className = item.isWin ? 'win' : 'loss';
        lastRollsList.appendChild(li);
    });
}
