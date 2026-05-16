const tg = window.Telegram.WebApp;
tg.expand(); // ሙሉ ስክሪን እንዲሆን

const boardContainer = document.getElementById('bingo-board');
const cardContainer = document.getElementById('player-card');
const lastDrawnEl = document.getElementById('last-drawn');
const ballCountEl = document.getElementById('ball-count');

let drawnNumbers = [];
let playerCardNumbers = [];
let matchedNumbers = [];
let gameInterval;

// 1. የ90 ቁጥሮች ሰሌዳ በስክሪኑ ላይ መፍጠር
for (let i = 1; i <= 90; i++) {
    const cell = document.createElement('div');
    cell.id = `board-${i}`;
    cell.className = 'num-cell';
    cell.innerText = i;
    boardContainer.appendChild(cell);
}

// 2. ለተጫዋቹ 15 የዘፈቀደ የቢንጎ ቁጥሮች መስጠት
while(playerCardNumbers.length < 15){
    let r = Math.floor(Math.random() * 90) + 1;
    if(playerCardNumbers.indexOf(r) === -1) playerCardNumbers.push(r);
}
playerCardNumbers.sort((a, b) => a - b);

// 3. ካርዱን በስክሪን ላይ መሳል
playerCardNumbers.forEach(num => {
    const cell = document.createElement('div');
    cell.className = 'card-cell';
    cell.innerText = num;
    
    // ተጫዋቹ ቁጥር ሲነካ ቼክ ማድረጊያ
    cell.onclick = () => {
        if (drawnNumbers.includes(num) && !matchedNumbers.includes(num)) {
            matchedNumbers.push(num);
            cell.classList.add('matched');
            tg.HapticFeedback.notificationOccurred('success'); // ስልኩ እንዲርገበገብ
        }
    };
    cardContainer.appendChild(cell);
});

// 4. በየ 4 ሰከንዱ ቁጥር ማውጫ ሉፕ (Game Loop)
let allNumbers = Array.from({length: 90}, (_, i) => i + 1);
allNumbers.sort(() => Math.random() - 0.5);

gameInterval = setInterval(() => {
    if (allNumbers.length === 0 || matchedNumbers.length === 15) {
        clearInterval(gameInterval);
        return;
    }
    
    let nextNum = allNumbers.pop();
    drawnNumbers.push(nextNum);
    
    lastDrawnEl.innerText = nextNum;
    ballCountEl.innerText = drawnNumbers.length;
    
    // ሰሌዳው ላይ የወጣውን ቁጥር ቀይ ማድረግ
    document.getElementById(`board-${nextNum}`).classList.add('drawn');
}, 4000);

// ቢንጎ በተን ሲነካ ቼክ ማድረጊያ
document.getElementById('bingo-btn').onclick = () => {
    if (matchedNumbers.length === 15) {
        alert("🎉🎉 ቢንጎ! አሸንፈዋል! 🎉🎉");
        tg.close();
    } else {
        alert("❌ ገና አልጨረሱም! ሁሉንም 15 ቁጥሮች ያግኙ።");
    }
};

document.getElementById('leave-btn').onclick = () => {
    clearInterval(gameInterval);
    tg.close();
};
