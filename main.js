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

const handleClick = (e) => {
  if (e.target.tagName === 'BUTTON') return;
  bird.y -= 60;
};

document.addEventListener('keydown', handleClick);
document.addEventListener('click', handleClick);

const startGame = () => {
  run();
};

const run = () => {
  context.drawImage(background, 0, 0);
  context.drawImage(birdImg, bird.x, bird.y);

  for (const chimney of chimneys) {
    distance.vertical = chimneyTop.height + distance.horizontal;
    context.drawImage(chimneyTop, chimney.x, chimney.y);
    context.drawImage(chimneyBot, chimney.x, chimney.y + distance.vertical);

    chimney.x -= speed;

    if (chimney.x === canvas.width / 2) {
      chimneys.push({
        x: canvas.width,
        y: Math.floor(Math.random() * chimneyTop.height) - chimneyTop.height,
      });
    }

    if (chimney.x === 0) {
      chimneys.splice(0, 1);
    }

    if (chimney.x === bird.x) {
      score++;
    }

    if (
      bird.y + birdImg.height === canvas.height ||
      (bird.x + birdImg.width >= chimney.x &&
        bird.x <= chimney.x + chimneyTop.width &&
        (bird.y <= chimney.y + chimneyTop.height ||
          bird.y + birdImg.height >= chimney.y + distance.vertical))
    ) {
      if (score > highScore) {
        localStorage.setItem(FLAPPY_BIRD_STORAGE_KEY, JSON.stringify({ highScore: score }));
      }
      return;
    }
  }

  currentScoreShow.innerText = `Score: ${score}`;
  highScoreShow.innerText = `High score: ${highScore}`;

  bird.y += 3;
  requestAnimationFrame(run);
};

document.querySelector('button').addEventListener('click', startGame);
