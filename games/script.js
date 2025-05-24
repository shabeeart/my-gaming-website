const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");

let player;
let enemies;
let score;
let gameOver;
let animationId;

let keys = {
  left: false,
  right: false
};

// Starry background setup
const stars = [];
for(let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    speed: 0.2 + Math.random() * 0.3
  });
}

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});

function drawBackground() {
  ctx.fillStyle = "#111"; // dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if(star.y > canvas.height) star.y = 0;
  });
}

function init() {
  player = { x: 180, y: 550, width: 40, height: 40, speed: 7 };
  enemies = [];
  score = 0;
  gameOver = false;
  scoreEl.textContent = "Score: 0";
  gameOverEl.style.display = "none";
  createEnemies();
}

function createEnemies() {
  enemies = [];
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 40),
      y: -Math.random() * 600,
      width: 40,
      height: 40,
      speed: 3 + Math.random() * 2
    });
  }
}

function drawPlayer() {
  let gradient = ctx.createRadialGradient(
    player.x + player.width/2,
    player.y + player.height/2,
    5,
    player.x + player.width/2,
    player.y + player.height/2,
    player.width
  );
  gradient.addColorStop(0, "#0f0");
  gradient.addColorStop(1, "rgba(0,255,0,0)");

  ctx.fillStyle = gradient;
  ctx.shadowColor = "#0f0";
  ctx.shadowBlur = 20;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
}

function updateEnemies() {
  enemies.forEach(e => {
    e.y += e.speed;
    if (e.y > canvas.height) {
      e.y = -40;
      e.x = Math.random() * (canvas.width - 40);
      score++;
      scoreEl.textContent = "Score: " + score;
    }

    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      gameOver = true;
      gameOverEl.style.display = "block";
      playAgainBtn.style.display = "inline-block";
      cancelAnimationFrame(animationId);
    }
  });
}

function draw() {
  if (gameOver) return;

  // Player smooth movement
  if (keys.left && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.right && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  drawBackground();
  drawPlayer();
  drawEnemies();
  updateEnemies();

  animationId = requestAnimationFrame(draw);
}

function startGame() {
  startBtn.style.display = "none";
  playAgainBtn.style.display = "none";
  canvas.style.display = "block";
  scoreEl.style.display = "block";
  init();
  draw();
}
