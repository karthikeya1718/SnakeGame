//define html elements
const board = document.querySelector("#gameboard");
const instructiontext = document.querySelector("#instructiontext");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highscoretext = document.querySelector("#highscore");

//define game variables
const gridsize = 20;
let snake = [{ x: 10, y: 10 }]; // snake starting point on board
let food = generatefood();
let highscore = 0;
let direction = "right";
let gameinterval;
let gamespeeddelay = 200;
let gamestarted = false;

//Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawsnake();
  drawfood();
  updatescore();
}

//draw snake
function drawsnake() {
  snake.forEach((segment) => {
    const snakeelement = creategameelement("div", "snake");
    setposition(snakeelement, segment);
    board.appendChild(snakeelement);
  });
}

//Create a snake or foodcube/div
function creategameelement(tag, classname) {
  const element = document.createElement(tag);
  element.className = classname;
  return element;
}

// set the position of the snake or the food
function setposition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testing the draw function
// draw();

//draw food function
function drawfood() {
  if (gamestarted) {
    const foodelement = creategameelement("div", "food");
    setposition(foodelement, food);
    board.appendChild(foodelement);
  }
}

//generate food
function generatefood() {
  const x = Math.floor(Math.random() * gridsize) + 1;
  const y = Math.floor(Math.random() * gridsize) + 1;
  return { x, y };
}

//Moving the snake
function movesnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
  }
  snake.unshift(head);
  //   snake.pop();
  if (head.x === food.x && head.y === food.y) {
    food = generatefood();
    increasespeed();
    clearInterval(gameinterval); //clear past interval
    gameinterval = setInterval(() => {
      movesnake();
      checkcollision();
      draw();
    }, gamespeeddelay);
  } else {
    snake.pop();
  }
}

//Test moving the snake
// setInterval(() => {
//   movesnake();
//   draw();
// }, 200);

//start game function
function startgame() {
  gamestarted = true;
  instructiontext.style.display = "none";
  logo.style.display = "none";
  gameinterval = setInterval(() => {
    movesnake();
    checkcollision();
    draw();
  }, gamespeeddelay);
}

//create a keypress listener

function handlekeypress(event) {
  if (
      (!gamestarted && event.code === "Space") ||
      (!gamestarted && event.key === " ")
  ) {
      startgame();
  } else {
      switch (event.key) {
          case "ArrowUp":
          case "W":
          case "w":
              if (snake.length < 3 || direction !== "down") {
                  direction = "up";
              }
              break;
          case "ArrowDown":
          case "S":
          case "s":
              if (snake.length < 3 || direction !== "up") {
                  direction = "down";
              }
              break;
          case "ArrowLeft":
          case "A":
          case "a":
              if (snake.length < 3 || direction !== "right") {
                  direction = "left";
              }
              break;
          case "ArrowRight":
          case "D":
          case "d":
              if (snake.length < 3 || direction !== "left") {
                  direction = "right";
              }
              break;
      }
  }
}

document.addEventListener("keydown", handlekeypress);

function increasespeed() {
  //   console.log(gamespeeddelay);
  if (gamespeeddelay > 150) {
    gamespeeddelay -= 5;
  } else if (gamespeeddelay > 100) {
    gamespeeddelay -= 3;
  } else if (gamespeeddelay > 50) {
    gamespeeddelay -= 2;
  } else if (gamespeeddelay > 25) {
    gamespeeddelay -= 1;
  }
}

//checking collision

function checkcollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridsize || head.y < 1 || head.y > gridsize) {
    resetgame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetgame();
    }
  }
}

function resetgame() {
  updatehighscore();
  stopgame();
  snake = [{ x: 10, y: 10 }];
  food = generatefood();
  direction = "right";
  gamespeeddelay = 200;
  updatescore();
}

function updatescore() {
  const currentscore = snake.length - 1;
  score.textContent = currentscore.toString().padStart(3, "0");
}

function updatehighscore() {
  const currentscore = snake.length - 1;
  if (currentscore > highscore) {
    highscore = currentscore;
    highscoretext.textContent = highscore.toString().padStart(3, "0");
  }
  highscoretext.style.display = "block";
}
function stopgame() {
  clearInterval(gameinterval);
  gamestarted = false;
  instructiontext.style.display = "block";
  logo.style.display = "block";
}
