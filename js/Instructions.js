document.getElementById("startBtn").addEventListener("click", function () {
  const difficulty = document.getElementById("difficulty").value;
  window.location.href = `game.html?difficulty=${difficulty}`;
});