const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("difficulty");
let numRows, numCols, mines, index, divHighScore;
let board = [];
const gameBoard = document.getElementById("gameBoard");
switch (level) {
  case "beginner":
    numRows = 8;
    numCols = 8;
    mines = 10;
    index = 0;
    divHighScore = document.getElementById("level0");
    break;
  case "intermediate":
    numRows = 10;
    numCols = 10;
    mines = 20;
    index = 1;
    divHighScore = document.getElementById("level1");
    break;
  case "expert":
    numRows = 16;
    numCols = 16;
    mines = 40;
    index = 2;
    divHighScore = document.getElementById("level2");
    break;
  default:
    numRows = 8;
    numCols = 8;
    mines = 10;
    index = 1;
    divHighScore = document.getElementById("level1");
    break;
}
let users = JSON.parse(localStorage.getItem("allUsers")) || [];
let currentUserEmail = localStorage.getItem("currentUserEmail");
let userIndex = users.findIndex((u) => u.email === currentUserEmail);
let priviesBest;
if (userIndex != -1) {
  priviesBest = users[userIndex].bestScore[index];
  priviesBest = parseInt(priviesBest);
} else {
  priviesBest = 999;
  console.log("User not found in storage. Score won't be saved.");
}

const topRow = document.createElement("div");
topRow.classList.add("topRow");
const flags = document.createElement("div");
flags.id = "flags";
let flagsUsed = 0;
let gameOver = false;
flags.innerText = `🪐 ${mines}`;
document.body.prepend(topRow);
topRow.appendChild(flags);
let sizeMatrix = numCols * numRows;
let startGame = 0;
let openCells = 0;
let win = false;
let timer = document.createElement("div");
topRow.appendChild(timer);
timer.id = "timer";
let totalSeconds = 0;
let timerInterval;
let minutes;
let seconds;
const openningSound = new Audio("../audio/snapchat-tone.mp3");
const clapClap = new Audio("../audio/congrats.mp3");
let song = new Audio("../audio/explosion.mp3");
let putFlagSound = new Audio("../audio/putFlag.mp3");
let removeFlagSound = new Audio("../audio/removeFlag.mp3");
const level0Div = document.getElementById("level0");
const level1Div = document.getElementById("level1");
const level2Div = document.getElementById("level2");
putFlagSound.volume = 0.2;
removeFlagSound.volume = 0.2;
function startTimer() {
  totalSeconds = 0;
  timer.innerText = displayClock(0, 0);
  timerInterval = setInterval(() => {
    totalSeconds++;
    minutes = parseInt(totalSeconds / 60);
    seconds = parseInt(totalSeconds % 60);
    timer.innerHTML = `⏱️ ${displayClock(parseInt(minutes), parseInt(seconds))}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function displayClock(minutes, seconds) {
  if (parseInt(minutes) < 10 && parseInt(seconds) < 10)
    return `0${parseInt(minutes)} : 0${parseInt(seconds)}`;
  else if (parseInt(minutes) < 10 && parseInt(seconds) >= 10)
    return `0${parseInt(minutes)} : ${parseInt(seconds)}`;
  else if (parseInt(minutes) >= 10 && parseInt(seconds) < 10)
    return `${parseInt(minutes)} : 0${parseInt(seconds)}`;
  else return `${parseInt(minutes)} : ${parseInt(seconds)}`;
}

function setGridStyles() {
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateColumns = `repeat(${numCols}, 40px)`;
  gameBoard.style.gap = "5px";
  gameBoard.style.width = "fit-content";
  gameBoard.style.height = "auto";
  topRow.style.width = "40%";
  topRow.style.boxSizing = "border-box";
}

gameBoard.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

function useFlags(cell) {
  if (!cell.flagged) {
    if (flagsUsed == mines) return;
    putFlagSound.play();
    cell.innerHTML = "🪐";
    cell.flagged = true;
    flagsUsed++;
    flags.innerHTML = `🪐 ${mines - flagsUsed}`;
  } else {
    removeFlagSound.play();
    cell.innerHTML = " ";
    cell.flagged = false;
    flagsUsed--;
    flags.innerHTML = `🪐 ${mines - flagsUsed}`;
  }
}

function winGame() {
  stopTimer();
  const winningAlert = document.getElementById("winningAlert");
  winningAlert.style.display = "block";
  let youWon = document.getElementById("youWon");
  youWon.innerText = `congratulations! 
  you won the game in:  ${displayClock(minutes, seconds)} minutes`;
  clapClap.play();
  if (totalSeconds < priviesBest) {
    users[userIndex].bestScore[index] = totalSeconds;
    localStorage.setItem(`allUsers`, JSON.stringify(users));
    minutes = parseInt(minutes);
    seconds = parseInt(seconds);
    divHighScore.innerHTML = displayClock(parseInt(minutes), parseInt(seconds));
  }
}

function openZiro(i, j) {
  const cell = document.getElementById(`${i}-${j}`);
  if (!cell.revealed) {
    cell.classList.add("open");
    cell.revealed = true;
    openCells++;
    openningSound.play();
  }
  if (openCells == sizeMatrix - mines) {
    winGame();
  }
  board[i][j].revealed = 1;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      let ni = i + dx;
      let nj = j + dy;
      if (
        nj >= 0 &&
        nj < numCols &&
        ni >= 0 &&
        ni < numRows &&
        !board[ni][nj].revealed
      ) {
        const neighbor = document.getElementById(`${ni}-${nj}`);
        if (board[ni][nj].count != 0) {
          neighbor.innerHTML = `${board[ni][nj].count}`;
          board[ni][nj].revealed = 1;
          if (!neighbor.revealed) {
            neighbor.classList.add("open");
            neighbor.revealed = true;
            openCells++;
            openningSound.play();
          }
        } else if (board[ni][nj].count == 0) {
          openZiro(ni, nj);
        }
      }
    }
  }
}

function blowEverythingUp() {
  for (let x = 0; x < numRows; x++) {
    for (let y = 0; y < numCols; y++) {
      if (board[x][y].isMine) {
        setTimeout(
          () => {
            const mineCell = document.getElementById(`${x}-${y}`);
            mineCell.innerHTML = "👽";
            gameBoard.classList.add("shake-board");
            setTimeout(function () {
              gameBoard.classList.remove("shake-board");
            }, 500);
          },
          (x * numCols + y) * 20,
        );
      }
    }
  }
}

function revealCells(i, j, cell) {
  if (gameOver || board[i][j].revealed) return;
  if (board[i][j].isMine) {
    cell.innerHTML = "👽";
    gameOver = true;
    stopTimer();
    setTimeout(() => {
      song.play();
      gameBoard.classList.add("shake-board");
      setTimeout(function () {
        gameBoard.classList.remove("shake-board");
      }, 500);
      blowEverythingUp();
    }, 10);
    setTimeout(
      () => {
        const losingAlert = document.getElementById("loosingAlert");
        losingAlert.style.display = "block";
      },
      numRows * numCols * 20,
    );
  } else {
    board[i][j].revealed = true;
    cell.classList.add("open");
    cell.revealed = true;
    openCells++;
    openningSound.play();
    if (board[i][j].count != 0) {
      cell.innerHTML = `${board[i][j].count}`;
    } else {
      openZiro(i, j);
    }
    if (openCells == sizeMatrix - mines) {
      winGame();
    }
  }
}

function printMinesToConsole() {
  let arr = [];
  for (let a = 0; a < numRows; a++) {
    arr[a] = [];
    for (let b = 0; b < numCols; b++) {
      if (board[a][b].isMine) {
        arr[a][b] = "@ ";
      } else {
        arr[a][b] = `- `;
      }
    }
  }
  console.log(arr);
}

function countNeighbors(i, j) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = i + "-" + j;
  gameBoard.appendChild(cell);
  let count = 0;
  if (!board[i][j].isMine) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let ni = i + dx;
        let nj = j + dy;
        if (
          ni >= 0 &&
          ni < numRows &&
          nj >= 0 &&
          nj < numCols &&
          board[ni][nj].isMine
        )
          count++;
      }
    }
  }
  board[i][j].count = count;
  cell.addEventListener("mousedown", function (event) {
    event.preventDefault();
    if (event.button === 0) {
      if (!cell.flagged) {
        startGame++;
        if (startGame == 1) {
          startTimer();
        }
        revealCells(i, j, cell);
        if (openCells == sizeMatrix - mines) {
          winGame();
        }
      }
    } else if (event.button === 2) {
      if (!cell.revealed) {
        startGame++;
        if (startGame == 1) {
          startTimer();
        }
        useFlags(cell);
      }
    }
  });
}

function locateMines() {
  let minesUsed = 0;
  while (minesUsed < mines) {
    let randomRow = Math.floor(Math.random() * numRows);
    let randomCol = Math.floor(Math.random() * numCols);
    if (!board[randomRow][randomCol].isMine) {
      board[randomRow][randomCol].isMine = true;
      minesUsed++;
    }
  }
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      countNeighbors(i, j);
    }
  }
}

function createMatrix() {
  for (let i = 0; i < numRows; i++) {
    board[i] = [];
    for (let j = 0; j < numCols; j++) {
      board[i][j] = {
        isMine: false,
        count: 0,
        revealed: false,
        flagged: false,
      };
    }
  }
  locateMines();
  printMinesToConsole();
}

window.onload = function () {
  let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  let currentUserEmail = localStorage.getItem("currentUserEmail");
  let userIndex = users.findIndex((u) => u.email === currentUserEmail);
  let priviesBest;
  if (userIndex != -1) {
    priviesBest = users[userIndex].bestScore[index];
    priviesBest = parseInt(priviesBest);
  } else {
    priviesBest = 999;
    console.log("User not found in storage. Score won't be saved.");
  }
  timer.innerText = `⏱️ ${displayClock(0, 0)}`;
  let currentUserName = users[userIndex].name;
  const welcomeUser = document.getElementById("userName");
  welcomeUser.innerText = `captain ${currentUserName} is on board!`;
  createMatrix();
  if (userIndex !== -1) {
    let sco = parseInt(users[userIndex].bestScore[0]);
    level0Div.innerText = displayClock(sco / 60, sco % 60);
    sco = parseInt(users[userIndex].bestScore[1]);
    level1Div.innerText = displayClock(sco / 60, sco % 60);
    sco = parseInt(users[userIndex].bestScore[2]);
    level2Div.innerText = displayClock(sco / 60, sco % 60);
  } else {
    level0Div.innerText = "no best score yet";
    level1Div.innerText = "no best score yet";
    level2Div.innerText = "no best score yet";
  }
  setGridStyles();
};
