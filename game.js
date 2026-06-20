let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;

// BAR SYSTEM
let position = 0;
let direction = 1;
let speed = 2;
let interval;
let timeLeft = 15;

// UI
const petList = document.getElementById("petList");
const trainingScreen = document.getElementById("trainingScreen");
const petSelectScreen = document.getElementById("petSelectScreen");
const resultScreen = document.getElementById("resultScreen");

const marker = document.getElementById("marker");
const feedback = document.getElementById("feedback");
const timer = document.getElementById("timer");
const resultText = document.getElementById("resultText");
const statsUI = document.getElementById("petStats");

let hits = { miss:0, ok:0, good:0, perfect:0 };

function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

function createPet(type) {
  const pet = {
    id: Date.now(),
    type,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    stats: {
      power: 1,
      agility: 1,
      loyalty: 1
    },
    rarity: "Common"
  };

  pets.push(pet);
  save();
  renderPets();
}

function renderPets() {
  petList.innerHTML = "";

  pets.forEach(pet => {
    const btn = document.createElement("button");
    btn.innerHTML = `
      ${getEmoji(pet.type)} ${pet.type}
      Lv.${pet.level} (${pet.rarity})
    `;

    btn.onclick = () => startTraining(pet.id);
    petList.appendChild(btn);
  });
}

function getEmoji(type) {
  return type === "Fox" ? "🦊" :
         type === "Cat" ? "🐱" : "🐶";
}

function startTraining(id) {
  activePet = pets.find(p => p.id === id);

  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  reset();
  interval = setInterval(updateBar, 16);

  let countdown = setInterval(() => {
    timeLeft--;
    timer.innerText = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      endTraining();
    }
  }, 1000);

  document.getElementById("trainingTitle").innerText =
    `Training ${activePet.type}`;
}

function reset() {
  position = 0;
  direction = 1;
  speed = 2;
  timeLeft = 15;

  hits = { miss:0, ok:0, good:0, perfect:0 };
}

function updateBar() {
  position += direction * speed;

  if (position >= 100) direction = -1;
  if (position <= 0) direction = 1;

  marker.style.left = position + "%";
}

document.getElementById("trainBtn").addEventListener("click", () => {
  const zoneStart = 42;
  const zoneEnd = 58;

  let result;

  if (position >= zoneStart && position <= zoneEnd) {
    if (Math.abs(position - 50) < 2) {
      hits.perfect++;
      result = "PERFECT";
      feedback.innerText = "🔥 PERFECT!";
    } else {
      hits.good++;
      result = "GOOD";
      feedback.innerText = "👍 GOOD!";
    }
  } else if (position >= 30 && position <= 70) {
    hits.ok++;
    result = "OK";
    feedback.innerText = "🙂 OK!";
  } else {
    hits.miss++;
    result = "MISS";
    feedback.innerText = "❌ MISS!";
  }

  speed += 0.15;
});

function endTraining() {
  clearInterval(interval);

  const xp =
    hits.ok * 5 +
    hits.good * 10 +
    hits.perfect * 25;

  activePet.xp += xp;

  // LEVEL UP SYSTEM
  while (activePet.xp >= activePet.xpToLevel) {
    activePet.xp -= activePet.xpToLevel;
    activePet.level++;

    activePet.xpToLevel = Math.floor(activePet.xpToLevel * 1.25);

    // STAT GROWTH
    activePet.stats.power += 1;
    activePet.stats.agility += 1;
    activePet.stats.loyalty += 1;

    // RARITY EVOLUTION
    if (activePet.level >= 15) activePet.rarity = "Epic";
    else if (activePet.level >= 8) activePet.rarity = "Rare";
    else if (activePet.level >= 3) activePet.rarity = "Uncommon";
  }

  save();

  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  resultText.innerHTML = `
    🐾 ${activePet.type}<br>
    Level: ${activePet.level}<br>
    XP: ${activePet.xp}/${activePet.xpToLevel}<br><br>

    Stats:<br>
    Power: ${activePet.stats.power}<br>
    Agility: ${activePet.stats.agility}<br>
    Loyalty: ${activePet.stats.loyalty}<br><br>

    Hits:<br>
    Perfect: ${hits.perfect}<br>
    Good: ${hits.good}<br>
    OK: ${hits.ok}<br>
    Miss: ${hits.miss}
  `;
}

function backToMenu() {
  resultScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
  renderPets();
}

// INIT
renderPets();
