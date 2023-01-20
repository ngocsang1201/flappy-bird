const canvas = document.getElementById('game-zone');
const context = canvas.getContext('2d');
const currentScoreShow = document.querySelector('.score--current');
const highScoreShow = document.querySelector('.score--high');

const FLAPPY_BIRD_STORAGE_KEY = 'FlappyBird';

const birdImg = new Image();
const background = new Image();
const chimneyTop = new Image();
const chimneyBot = new Image();

birdImg.src = './assets/img/bird.png';
background.src = './assets/img/background.png';
chimneyTop.src = './assets/img/chimney-top.png';
chimneyBot.src = './assets/img/chimney-bot.png';

let score = 0;
let storageObj = JSON.parse(localStorage.getItem(FLAPPY_BIRD_STORAGE_KEY)) || {};
let highScore = storageObj.highScore === undefined ? 0 : storageObj.highScore;

const speed = 5;
const distance = {
  horizontal: 140,
  vertical: 0,
};
let bird = {
  x: background.width / 5,
  y: background.height / 2,
};
let chimneys = [];
chimneys[0] = {
  x: canvas.width,
  y: 0,
};

const run = () => {
  context.drawImage(background, 0, 0);
  context.drawImage(birdImg, bird.x, bird.y);

  for (let i = 0; i < chimneys.length; i++) {
    distance.vertical = chimneyTop.height + distance.horizontal;
    context.drawImage(chimneyTop, chimneys[i].x, chimneys[i].y);
    context.drawImage(chimneyBot, chimneys[i].x, chimneys[i].y + distance.vertical);

    chimneys[i].x -= speed;

    if (chimneys[i].x === canvas.width / 2) {
      chimneys.push({
        x: canvas.width,
        y: Math.floor(Math.random() * chimneyTop.height) - chimneyTop.height,
      });
    }
    if (chimneys[i].x === 0) {
      chimneys.splice(0, 1);
    }
    if (chimneys[i].x === bird.x) {
      score++;
    }

    if (
      bird.y + birdImg.height === canvas.height ||
      (bird.x + birdImg.width >= chimneys[i].x &&
        bird.x <= chimneys[i].x + chimneyTop.width &&
        (bird.y <= chimneys[i].y + chimneyTop.height ||
          bird.y + birdImg.height >= chimneys[i].y + distance.vertical))
    ) {
      if (score > highScore) {
        setStorage();
      }
      return;
    }
  }

  currentScoreShow.innerText = `Score: ${score}`;
  highScoreShow.innerText = `High score: ${highScore}`;

  bird.y += 3;
  requestAnimationFrame(run);
};

document.addEventListener('keydown', () => {
  bird.y -= 60;
});

const setStorage = () =>
  localStorage.setItem(
    FLAPPY_BIRD_STORAGE_KEY,
    JSON.stringify({
      highScore: score,
    })
  );

run();
