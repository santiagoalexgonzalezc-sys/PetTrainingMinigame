let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;

// UI
const petList = document.getElementById("petList");
const trainingScreen = document.getElementById("trainingScreen");
const petSelectScreen = document.getElementById("petSelectScreen");
const resultScreen = document.getElementById("resultScreen");

const marker = document.getElementById("marker");
const feedback = document.getElementById("feedback");
const timer = document.getElementById("timer");
const resultText = document.getElementById("resultText");

let position = 0;
let direction = 1;
let speed = 2;
let interval;
let timeLeft = 15;

let hits = { miss:0, ok:0, good:0, perfect:0 };

// =======================
// SAVE / LOAD
// =======================
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

// =======================
// PET CREATION
// =======================
function createPet(type) {
  pets.push({
    id: Date.now(),
    type,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    stats: { power: 2, agility: 2, loyalty: 2 },
    rarity: "Common"
  });

  save();
  renderPets();
}

// =======================
// EVOLUTION SYSTEM
// =======================
function getStage(level) {
  if (level >= 15) return 4;
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

function getPetEmoji(pet) {
  const stage = getStage(pet.level);

  const base = {
    Fox: ["🦊", "🦊🔥", "🦊⚡", "🦊👑"],
    Cat: ["🐱", "🐱✨", "🐱⚔️", "🐱💎"],
    Dog: ["🐶", "🐶🔥", "🐶⚡", "🐶👑"]
  };

  return base[pet.type][stage - 1];
}

// stat multiplier per evolution stage
function getStatMultiplier(level) {
  if (level >= 15) return 2.0;
  if (level >= 10) return 1.6;
  if (level >= 5) return 1.3;
  return 1.0;
}

// =======================
// RENDER PET LIST
// =======================
function renderPets() {
  petList.innerHTML = "";

  pets.forEach(pet => {
    const btn = document.createElement("button");

    btn.innerHTML = `
      ${getPetEmoji(pet)} ${pet.type}
      Lv.${pet.level} (${pet.rarity})
    `;

    btn.onclick = () => openPetMenu(pet.id);
    petList.appendChild(btn);
  });
}

// =======================
// PET MENU (TRAIN OR BATTLE)
// =======================
function openPetMenu(id) {
  activePet = pets.find(p => p.id === id);

  const choice = confirm(
    `${activePet.type} Lv.${activePet.level}\n\nOK = Train\nCancel = Battle`
  );

  if (choice) startTraining();
  else startBattle();
}

// =======================
// TRAINING
// =======================
function startTraining() {
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

// timing hit
document.getElementById("trainBtn").onclick = () => {
  const zoneStart = 42;
  const zoneEnd = 58;

  if (position >= zoneStart && position <= zoneEnd) {
    if (Math.abs(position - 50) < 2) {
      hits.perfect++;
      feedback.innerText = "🔥 PERFECT!";
    } else {
      hits.good++;
      feedback.innerText = "👍 GOOD!";
    }
  } else if (position >= 30 && position <= 70) {
    hits.ok++;
    feedback.innerText = "🙂 OK!";
  } else {
    hits.miss++;
    feedback.innerText = "❌ MISS!";
  }

  speed += 0.15;
};

// =======================
// END TRAINING
// =======================
function endTraining() {
  clearInterval(interval);

  const mult = getStatMultiplier(activePet.level);

  const xp =
    (hits.ok * 5 +
     hits.good * 10 +
     hits.perfect * 25) * mult;

  activePet.xp += Math.floor(xp);

  // LEVEL UP
  while (activePet.xp >= activePet.xpToLevel) {
    activePet.xp -= activePet.xpToLevel;
    activePet.level++;

    activePet.xpToLevel = Math.floor(activePet.xpToLevel * 1.25);

    activePet.stats.power += 1;
    activePet.stats.agility += 1;
    activePet.stats.loyalty += 1;
  }

  save();

  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  resultText.innerHTML = `
    🧬 ${getPetEmoji(activePet)} ${activePet.type}<br>
    Level: ${activePet.level}<br>
    XP: ${activePet.xp}/${activePet.xpToLevel}<br>
    Stage: ${getStage(activePet.level)}<br><br>

    ⚔️ Stats:<br>
    Power: ${activePet.stats.power}<br>
    Agility: ${activePet.stats.agility}<br>
    Loyalty: ${activePet.stats.loyalty}
  `;
}

// =======================
// BATTLE SYSTEM
// =======================
function startBattle() {
  const enemy = generateEnemy(activePet.level);

  const playerPower = calcPower(activePet);
  const enemyPower = calcPower(enemy);

  let result;

  if (playerPower > enemyPower) result = "WIN";
  else if (playerPower < enemyPower) result = "LOSE";
  else result = "DRAW";

  let reward = 0;

  if (result === "WIN") {
    reward = 40;
    activePet.xp += reward;
  } else if (result === "LOSE") {
    reward = 10;
    activePet.xp += reward;
  } else {
    reward = 20;
    activePet.xp += reward;
  }

  save();

  alert(
    `⚔️ BATTLE RESULT\n\n` +
    `You: ${activePet.type} (${playerPower})\n` +
    `Enemy: ${enemy.type} (${enemyPower})\n\n` +
    `${result} +${reward} XP`
  );

  renderPets();
}

function generateEnemy(level) {
  const types = ["Fox", "Cat", "Dog"];
  return {
    type: types[Math.floor(Math.random() * types.length)],
    level,
    stats: {
      power: level + Math.random() * 3,
      agility: level + Math.random() * 3,
      loyalty: level + Math.random() * 3
    }
  };
}

function calcPower(pet) {
  return (
    pet.stats.power * 2 +
    pet.stats.agility +
    pet.stats.loyalty * 1.5
  );
}

// =======================
// INIT
// =======================
renderPets();
