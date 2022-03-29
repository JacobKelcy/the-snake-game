const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

//now that we have collision detection we can now make the snake grow
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;

const snakeParts = [];

let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("glups.wav");

function drawGame() {
  changeSnakePosition(); //before we check if the game is over we need to change the snakes position. thats why we have this function call before checking for our result.
  let result = isGameOver(); //we stop looping and it wil return to what we last saw on the page(the start of the game)
  if (result) {
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  if (score > 2) {
    speed = 10;
  }
  if (score > 20) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  //to tell game has not started
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    context.fillStyle = "white";
    context.font = "50px Verdana";

    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", " magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    context.fillStyle = gradient;

    context.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

function drawScore() {
  context.fillStyle = "white";
  context.font = "20px sans-serif";
  context.fillText("Score " + score, canvas.width - 80, 30); //to increase the score we score++ at checkAppleCollision
}

function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  //   context.fillStyle = "blue"; //we had these both here before we added the SnakePart constructor. If we want the body of the snake to change we'll call both of these after our condition is set for our SnakePart.
  //   context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

  context.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    //1. we loop over all the parts. init we have none. as soon as we move left once it draws then says
    let part = snakeParts[i];
    context.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tileSize,
      tileSize
    );
  }

  snakeParts.push(new SnakePart(headX, headY)); //2. next time you draw add this SnakePart
  while (snakeParts.length > tailLength) {
    //3. once we have the right num of pieces on screen this if statement says "you have one too many items, shift off the last one." This statement allows pieces to move with head of body.
    //put item at end of list next to the head
    snakeParts.shift(); // remove the furthers item from the snake parts if have more than our tail size.  The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.
  }

  context.fillStyle = "orange";
  context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  context.fillStyle = "red";
  context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);
// made AEL for out body to change its content when we keydown

//keyDown func listens for any key presses
//argument event we'll beable to determine which key was just pushed
function keyDown(event) {
  //up has keycode of 38
  if (event.keyCode == 38) {
    if (yVelocity == 1) {
      return;
    }
    yVelocity = -1; //to go up on board we -1 the y idx
    xVelocity = 0; //if snake is moving x then we hit the up arrow we'll want the x velocity to stop so only the yVelocity is active
    //With this we change the x y direction but not the actual snake itself. That being the changing color of the tiles so we make a function changeSnakePosition for that.
  }

  //down
  if (event.keyCode == 40) {
    if (yVelocity == -1) {
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }

  //left
  if (event.keyCode == 37) {
    if (xVelocity == 1) {
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }

  //right
  if (event.keyCode == 39) {
    if (xVelocity == -1) {
      return;
    }
    yVelocity = 0;
    xVelocity = 1;
  }
}

drawGame();
