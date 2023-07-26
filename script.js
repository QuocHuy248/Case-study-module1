const playBoard = document.getElementById("playonboard");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
var difficultystandar = document.getElementById("difficulty");
var startmenu = document.getElementById("welcomemenuList");
var continuemenu = document.getElementById("divcontinue");
var choosemenu = document.getElementById("choosemenuList");
var playagainmenu = document.getElementById("divplayagain");
var menu = document.getElementById("divmenu");
var number = 100;

function play(number) {
  restart();

  let highScore = localStorage.getItem("high-score") || 0;
  highScoreElement.innerText = `High Score: ${highScore}`;

  const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
  };
  const changeBlockPosition = () => {
    blockX = Math.floor(Math.random() * 22 - 1 + 1) + 1;
    blockY = Math.floor(Math.random() * 22 - 3 + 1) + 3;
    console.log("BlockX", blockX);
    block = [
      [blockX, blockY],
      [blockX + 1, blockY],
      [blockX + 2, blockY],
      [blockX + 3, blockY],
      [blockX + 4, blockY],
      [blockX + 5, blockY],
      [blockX + 6, blockY],
      [blockX + 7, blockY],
    ];
  };
  const updateFood2Position = () => {
    food2X = Math.floor(Math.random() * 30) + 1;
    food2Y = Math.floor(Math.random() * 30) + 1;
  };

  const handleGameOver = () => {
    clearInterval(setIntervalId);
    menu.style.display = "block";
    playagainmenu.style.display = "block";

    // location.reload();
  };

  const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
      velocityX = 0;
      velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
      velocityX = 0;
      velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
      velocityX = -1;
      velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
      velocityX = 1;
      velocityY = 0;
    }
  };

  const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    for (let i = 0; i < block.length; i++) {
      html += `<div class="block" style="grid-area:${block[i][1]}/${block[i][0]}"></div>`;
    }
    // Kiêm tra con rắn khi đụng food
    if (snakeX === foodX && snakeY === foodY) {
      changeBlockPosition();
      updateFoodPosition();
      snakeBody.push([foodY, foodX]); //chuyển vị trí của food vào bodysnake
      score++; // tăng điểm lên 1
      highScore = score >= highScore ? score : highScore;
      localStorage.setItem("high-score", highScore);
      scoreElement.innerText = `Score: ${score}`;
      highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Cập nhật vị trí của con rắn
    snakeX += velocityX;
    snakeY += velocityY;

    //hiện food 2 khi điểm chia hết cho 4
    if (score != 0 && score % 4 == 0) {
      html += `<div class="food2" style ="grid-area:${food2Y}/${food2X}"></div>`;
    }
    if (snakeX === food2X && snakeY === food2Y) {
      updateFood2Position();
      changeBlockPosition();
      snakeBody.push([food2X, food2Y]); // Pushing food position to snake body array
      score += 3; // tăng điểm lên 3
      highScore = score >= highScore ? score : highScore;
      localStorage.setItem("high-score", highScore);
      scoreElement.innerText = `Score: ${score}`;
      highScoreElement.innerText = `High Score: ${highScore}`;
    }
    for (let i = 0; i < block.length; i++) {
      if (snakeX === block[i][0] && snakeY === block[i][1]) {
        gameOver = true;
      }
    }

    // Đẩy phần thân của con rắn lên 1
    for (let i = snakeBody.length - 1; i > 0; i--) {
      snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; //Để phần thân đầu tiên của con rắn là vị trí hiện tại của con rắn

    // Kiểm tra khi con rắn ra khỏi vị trí của playboard
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
      return (gameOver = true);
    }

    for (let i = 0; i < snakeBody.length; i++) {
      // thêm phần thân cho con rắn
      html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
      // Kiểm tra khi con rắn đụng thân
      if (
        i !== 0 &&
        snakeBody[0][1] === snakeBody[i][1] &&
        snakeBody[0][0] === snakeBody[i][0]
      ) {
        gameOver = true;
      }
    }
    playBoard.innerHTML = html;
  };

  updateFoodPosition();
  updateFood2Position();
  changeBlockPosition();
  setIntervalId = setInterval(initGame, number);
  document.addEventListener("keyup", changeDirection);
}
//play again
document.getElementById("playagain").addEventListener("click", function () {
  scoreElement.innerText = "Score: 0";

  restart();
  number = 0;

  playBoard.innerHTML = "";

  playagainmenu.style.display = "none";
  menu.style.display = "none";
  if (difficultystandar.innerHTML == "Easy") {
    number = 100;
    play(number);
  }
  if (difficultystandar.innerHTML == "Medium") {
    number = 80;
    play(number);
  }
  if (difficultystandar.innerHTML == "Hard") {
    number = 50;
    play(number);
  }
});

//backtomenu
let btnbacktomenu = document.getElementById("btnback");
btnbacktomenu.addEventListener("click", function () {
  location.reload();
});

document
  .getElementById("btnPlay")
  .addEventListener("click", function playgame() {
    startmenu.style.display = "none";
    choosemenu.style.display = "block";
  });

// chọn mức độ khó
document.getElementById("easybtn").addEventListener("click", function () {
  difficultystandar.innerHTML = "Easy";
  choosemenu.style.display = "none";

  menu.style.display = "none";

  play(number);
});

document.getElementById("mediumbtn").addEventListener("click", function () {
  difficultystandar.innerHTML = "Medium";
  choosemenu.style.display = "none";
  menu.style.display = "none";
  var number = 80;
  play(number);
});
document.getElementById("hardbtn").addEventListener("click", function () {
  difficultystandar.innerHTML = "Hard";
  choosemenu.style.display = "none";
  menu.style.display = "none";

  var number = 50;
  play(number);
});
function restart() {
  gameOver = false;
  foodX = undefined;
  foodY = undefined;
  food2X = 2;
  food2Y = 3;
  blockX = 12;
  blockY = 15;
  snakeX = 5;
  snakeY = 5;
  block = [
    [blockX, blockY],
    [blockX + 1, blockY],
    [blockX + 2, blockY],
    [blockX + 3, blockY],
    [blockX + 4, blockY],
    [blockX + 5, blockY],
    [blockX + 6, blockY],
    [blockX + 7, blockY],
  ];
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  score = 0;
  playBoard.innerHTML = "";
}
