const prizes = [
    "DEF навсегда",
    "DEF на неделю",
    "DEF на 1 раз",
    "Скидка 25% на все",
    "Скидка 25% на обучение",
    "Обучение ручному OSINT’у",
    "1 бесплатный SWAT",
    "Подписка на ГБ на неделю",
    "Ничего",
    "Ничего",
    "Ничего"
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('wheelResult');
let spinning = false;
let currentAngle = 0;
const radius = canvas.width / 2;
const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах

function drawWheel(angleOffset = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const numSectors = prizes.length;
    const angle = 2 * Math.PI / numSectors;

    for (let i = 0; i < numSectors; i++) {
        const startAngle = i * angle + angleOffset;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, startAngle + angle);
        ctx.fillStyle = i % 2 === 0 ? "#a16be0" : "#6a0dad";
        ctx.fill();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(prizes[i], radius - 10, 5);
        ctx.restore();
    }
}

function canSpin() {
    const lastSpin = localStorage.getItem("lastSpin");
    if (!lastSpin) return true;
    const now = Date.now();
    return now - parseInt(lastSpin) >= cooldown;
}

function spinWheel() {
    if (spinning || !canSpin()) {
        const nextTime = new Date(parseInt(localStorage.getItem("lastSpin")) + cooldown);
        resultText.textContent = "Ты сможешь крутить снова: " + nextTime.toLocaleString();
        return;
    }

    spinning = true;
    resultText.textContent = "";

    const totalSpins = 10 + Math.floor(Math.random() * 5);
    const sectorAngle = 2 * Math.PI / prizes.length;
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const finalAngle = 2 * Math.PI * totalSpins + (prizes.length - winningIndex) * sectorAngle;

    let start = null;
    const duration = 3000;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easeOut = 1 - Math.pow(1 - progress / duration, 3);
        currentAngle = finalAngle * easeOut;
        drawWheel(currentAngle);
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            resultText.textContent = "Выпало: " + prizes[winningIndex];
            localStorage.setItem("lastSpin", Date.now().toString());
        }
    }

    requestAnimationFrame(animate);
}

drawWheel();
