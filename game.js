const petSelectScreen = document.getElementById("petSelectScreen");
const trainingScreen = document.getElementById("trainingScreen");
const resultScreen = document.getElementById("resultScreen");

const marker = document.getElementById("marker");
const feedback = document.getElementById("feedback");
const timerText = document.getElementById("timer");
const resultText = document.getElementById("resultText");
const trainBtn = document.getElementById("trainBtn");

let selectedPet = null;

let position = 0;
let direction = 1;
let speed = 2;

let interval;
let trainingTime = 15;
let timeLeft = trainingTime;

let hits = {
  miss: 0,
  ok: 0,
  good: 0,
  perfect: 0
};

document.querySelectorAll(".pet-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedPet = btn.dataset.pet;
    startTraining();
  });
});

function startTraining() {
  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  resetGame();

  interval = setInterval(updateBar, 16);

  let timer = setInterval(() => {
    timeLeft--;
    timerText.innerText = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endTraining();
    }
  }, 1000);
}

function resetGame() {
  position = 0;
  direction = 1;
  speed = 2;
  timeLeft = trainingTime;

  hits = { miss: 0, ok: 0, good: 0, perfect: 0 };
  feedback.innerText = "";
}

function updateBar() {
  position += direction * speed;

  if (position >= 100) direction = -1;
  if (position <= 0) direction = 1;

  marker.style.left = position + "%";
}

trainBtn.addEventListener("click", () => {
  const zoneStart = 40;
  const zoneEnd = 60;

  let result;

  if (position >= zoneStart && position <= zoneEnd) {
    let distanceFromCenter = Math.abs(50 - position);

    if (distanceFromCenter < 3) {
      result = "PERFECT";
      hits.perfect++;
      feedback.innerText = "🔥 PERFECT!";
    } else {
      result = "GOOD";
      hits.good++;
      feedback.innerText = "👍 GOOD!";
    }
  } else if (position >= 30 && position <= 70) {
    result = "OK";
    hits.ok++;
    feedback.innerText = "🙂 OK!";
  } else {
    result = "MISS";
    hits.miss++;
    feedback.innerText = "❌ MISS!";
  }

  // small speed increase over time
  speed += 0.1;
});

function endTraining() {
  clearInterval(interval);
  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  const xp =
    hits.ok * 5 +
    hits.good * 10 +
    hits.perfect * 20;

  const statBoostChance = hits.perfect * 15;

  resultText.innerHTML = `
    Pet: <b>${selectedPet}</b><br><br>
    OK Hits: ${hits.ok}<br>
    Good Hits: ${hits.good}<br>
    Perfect Hits: ${hits.perfect}<br>
    Misses: ${hits.miss}<br><br>

    🧪 XP Earned: <b>${xp}</b><br>
    📈 Stat Boost Chance: <b>${statBoostChance}%</b>
  `;
}
