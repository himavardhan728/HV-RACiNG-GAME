const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");

let road, player, enemy, keys, score, gameOver;

function initGame() {
  road = {
    laneWidth: 100,
    lineHeight: 30,
    gap: 20,
    offset: 0
  };

  player = {
    x: 180,
    y: 500,
    width: 40,
    height: 80,
    color: "lime",
    speed: 5
  };

  enemy = {
    x: Math.random() * 300 + 50,
    y: -100,
    width: 40,
    height: 80,
    color: "red",
    speed: 4
  };

  keys = {};
  score = 0;
  gameOver = false;
  tryAgainBtn.style.display = "none";
  loop();
}

document.addEventListener("keydown", e => {
  keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

leftBtn.addEventListener("mousedown", () => keys["ArrowLeft"] = true);
leftBtn.addEventListener("mouseup", () => keys["ArrowLeft"] = false);
rightBtn.addEventListener("mousedown", () => keys["ArrowRight"] = true);
rightBtn.addEventListener("mouseup", () => keys["ArrowRight"] = false);

leftBtn.addEventListener("touchstart", e => { e.preventDefault(); keys["ArrowLeft"] = true; });
leftBtn.addEventListener("touchend", e => { e.preventDefault(); keys["ArrowLeft"] = false; });
rightBtn.addEventListener("touchstart", e => { e.preventDefault(); keys["ArrowRight"] = true; });
rightBtn.addEventListener("touchend", e => { e.preventDefault(); keys["ArrowRight"] = false; });

tryAgainBtn.addEventListener("click", () => {
  initGame();
});

function drawRoad() {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  for (let i = -road.lineHeight; i < canvas.height; i += road.lineHeight + road.gap) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - road.laneWidth / 2, i + road.offset);
    ctx.lineTo(canvas.width / 2 - road.laneWidth / 2, i + road.lineHeight + road.offset);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + road.laneWidth / 2, i + road.offset);
    ctx.lineTo(canvas.width / 2 + road.laneWidth / 2, i + road.lineHeight + road.offset);
    ctx.stroke();
  }

  road.offset += 5;
  if (road.offset >= road.lineHeight + road.gap) {
    road.offset = 0;
  }
}

function drawCar(car) {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
  ctx.fillStyle = "black";
  ctx.fillRect(car.x + 10, car.y + 10, 20, 20);
  ctx.fillRect(car.x - 5, car.y + 10, 10, 20);
  ctx.fillRect(car.x + car.width - 5, car.y + 10, 10, 20);
  ctx.fillRect(car.x - 5, car.y + car.height - 30, 10, 20);
  ctx.fillRect(car.x + car.width - 5, car.y + car.height - 30, 10, 20);
}

function update() {
  if (keys["ArrowLeft"] && player.x > 10) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width - 10) player.x += player.speed;

  enemy.y += enemy.speed;
  if (enemy.y > canvas.height) {
    enemy.y = -100;
    enemy.x = Math.random() * 300 + 50;
    score++;
  }

  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    gameOver = true;
    tryAgainBtn.style.display = "block";
  }
}

function drawScore() {
  scoreBoard.textContent = `Score: ${score}`;
}

function loop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  update();
  drawCar(player);
  drawCar(enemy);
  drawScore();
  requestAnimationFrame(loop);
}

initGame();
