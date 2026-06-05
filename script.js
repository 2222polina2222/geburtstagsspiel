const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameUI = document.getElementById("gameUI");
const endScreen = document.getElementById("endScreen");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const finalScore = document.getElementById("finalScore");
const message = document.getElementById("message");
const feedback = document.getElementById("feedback");

const basket = document.getElementById("basket");
const gameArea = document.getElementById("gameArea");

let score = 0;
let timeLeft = 60;
let gameRunning = false;

let basketX = window.innerWidth / 2;

const items = [
    { emoji: "🎁", points: 10, type: "good" },
    { emoji: "🌸", points: 15, type: "good" },
    { emoji: "🧸", points: 20, type: "good" },
    { emoji: "🍫", points: 15, type: "good" },
    { emoji: "⭐", points: 25, type: "good" },

    { emoji: "💣", points: -30, type: "bad" },
    { emoji: "🕷️", points: -20, type: "bad" }
];

startBtn.addEventListener("click", startGame);

function startGame() {

    gameRunning = true;

    startScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");

    const timer = setInterval(() => {

        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);
            gameRunning = false;
            endGame();
        }

    }, 1000);

    setInterval(() => {

        if (gameRunning) {
            createItem();
        }

    }, 450);
}

function showFeedback(text, positive) {

    feedback.textContent = text;

    feedback.className = positive
        ? "positive"
        : "negative";

    setTimeout(() => {

        feedback.textContent = "";
        feedback.className = "";

    }, 1000);
}

function createItem() {

    const itemData =
        items[Math.floor(Math.random() * items.length)];

    const item = document.createElement("div");

    item.classList.add("item");
    item.textContent = itemData.emoji;

    let x =
        Math.random() * (window.innerWidth - 60);

    let y = -60;

    item.style.left = x + "px";
    item.style.top = y + "px";

    gameArea.appendChild(item);

    const speed =
        4 + Math.random() * 4;

    const fall = setInterval(() => {

        if (!gameRunning) {

            clearInterval(fall);
            item.remove();
            return;
        }

        y += speed;
        item.style.top = y + "px";

        const basketRect =
            basket.getBoundingClientRect();

        const itemRect =
            item.getBoundingClientRect();

        if (
            itemRect.bottom > basketRect.top &&
            itemRect.left < basketRect.right &&
            itemRect.right > basketRect.left
        ) {

            score += itemData.points;

            if (score < 0) {
                score = 0;
            }

            scoreText.textContent = score;

            if (itemData.points > 0) {

                showFeedback(
                    "+" + itemData.points,
                    true
                );

            } else {

                showFeedback(
                    itemData.points.toString(),
                    false
                );
            }

            item.remove();
            clearInterval(fall);
        }

        if (y > window.innerHeight) {

            item.remove();
            clearInterval(fall);
        }

    }, 20);
}

document.addEventListener("mousemove", e => {

    basketX = e.clientX;
    basket.style.left = basketX + "px";
});

document.addEventListener("touchmove", e => {

    basketX = e.touches[0].clientX;
    basket.style.left = basketX + "px";
});

function endGame() {

    gameUI.classList.add("hidden");
    endScreen.classList.remove("hidden");

    finalScore.textContent = score;

    if (score >= 800) {

        message.innerHTML =
            "👑 WOW!<br><br>" +
            "Du hast 800 Punkte erreicht!<br><br>" +
            "Du bist einfach unglaublich gut und hast dir eine Krone verdient! 👑";

    } else {

        message.innerHTML =
            "🎁 Super gespielt!<br><br>" +
            "Du hast " + score +
            " Punkte erreicht.<br><br>" +
            "Für die Krone brauchst du 800 Punkte.";
    }
}