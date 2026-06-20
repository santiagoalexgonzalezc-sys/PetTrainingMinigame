let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;
let battle = null;

/* UI */
const petList = document.getElementById("petList");
const petSelectScreen = document.getElementById("petSelectScreen");
const battleScreen = document.getElementById("battleScreen");
const trainingScreen = document.getElementById("trainingScreen");
const resultScreen = document.getElementById("resultScreen");

const marker = document.getElementById("marker");
const perfectZone = document.getElementById("perfectZone");
const trainBtn = document.getElementById("trainBtn");

const feedback = document.getElementById("feedback");
const resultText = document.getElementById("resultText");
const battleLog = document.getElementById("battleLog");

/* ---------------- SAVE ---------------- */
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

/* ---------------- PET SYSTEM ---------------- */
function createPet(type) {
  if (pets.length >= 5) return alert("Max 5 pets!");

  pets.push({
    id: Date.now(),
    type,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    stats: {
      power: 2,
      agility: 2,
      loyalty: 2,
      hp: 10,
      maxHp: 10
    }
  });

  save();
  renderPets();
}

/* ---------------- EVOLUTION ---------------- */
function stage(level) {
  if (level >= 15) return 4;
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

function ability(p) {
  const s = stage(p.level);

  const map = {
    Fox: ["Quick Bite", "Flame Dash", "Thunder Strike", "Spirit Burst"],
    Cat: ["Shadow Scratch", "Void Leap", "Moon Slash", "Star Fury"],
    Dog: ["Bark", "Bite Rush", "Alpha Slam", "Guardian Roar"]
  };

  return map[p.type][s - 1];
}

/* ---------------- RENDER ---------------- */
function renderPets() {
  petList.innerHTML = "";

  pets.forEach(p => {
    const div = document.createElement("div");
    div.className = "petCard";

    div.innerHTML = `
      <div>
        ${p.type} Lv.${p.level}<br>
        XP: ${p.xp}/${p.xpToLevel}<br>
        🧠 ${ability(p)}
      </div>

      <div>
        <button onclick="selectPet(${p.id})">Use</button>
        <button onclick="deletePet(${p.id})">🗑</button>
      </div>
    `;

    petList.appendChild(div);
  });
}

/* ---------------- DELETE ---------------- */
function deletePet(id) {
  pets = pets.filter(p => p.id !== id);
  save();
  renderPets();
}

/* ---------------- SELECT ---------------- */
function selectPet(id) {
  activePet = pets.find(p => p.id === id);
  startTraining();
}

/* =========================
   🎯 TRAINING SYSTEM (NEW)
========================= */

let trainingInterval;
let markerPos = 0;
let direction = 1;
let isTraining = false;

function startTraining() {
  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  feedback.innerText = "Click TRAIN at the right time!";
  setupBar();
}

function setupBar() {
  perfectZone.style.left = "40%";
  perfectZone.style.width = "20%";
}

trainBtn.onclick = () => {
  if (isTraining) return;

  isTraining = true;
  markerPos = 0;
  direction = 1;

  trainingInterval = setInterval(() => {
    markerPos += 2 * direction;

    if (markerPos >= 100) direction = -1;
    if (markerPos <= 0) direction = 1;

    marker.style.left = markerPos + "%";
  }, 16);

  setTimeout(finishTraining, 2500);
};

function finishTraining() {
  clearInterval(trainingInterval);
  isTraining = false;

  const result = evaluateHit();

  let xpGain = 0;

  if (result === "miss") xpGain = 5;
  if (result === "ok") xpGain = 15;
  if (result === "good") xpGain = 25;
  if (result === "perfect") xpGain = 50;

  activePet.xp += xpGain;

  if (activePet.xp >= activePet.xpToLevel) {
    activePet.level++;
    activePet.xp = 0;
    activePet.xpToLevel += 50;

    activePet.stats.power++;
    activePet.stats.maxHp += 2;
    activePet.stats.hp = activePet.stats.maxHp;
  }

  save();

  resultText.innerText = `${result.toUpperCase()}! +${xpGain} XP`;
  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  renderPets();
}

function evaluateHit() {
  const zoneStart = 40;
  const zoneEnd = 60;

  if (markerPos >= zoneStart && markerPos <= zoneEnd) return "perfect";
  if (markerPos >= 30 && markerPos <= 70) return "good";
  if (markerPos >= 20 && markerPos <= 80) return "ok";
  return "miss";
}

function backToMenu() {
  resultScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
}

/* =========================
   ⚔️ BATTLE SYSTEM (FIXED)
========================= */

function startBattle() {
  const enemy = generateEnemy(activePet.level);

  battle = {
    player: createUnit(activePet),
    enemy: createUnit(enemy)
  };

  petSelectScreen.classList.remove("active");
  battleScreen.classList.add("active");

  updateHP();
  battleLog.innerHTML = "";
  log("Battle started!");
}

function createUnit(p) {
  return {
    name: p.type,
    ability: ability(p),
    stats: { ...p.stats }
  };
}

document.getElementById("nextTurnBtn").onclick = runTurn;

function runTurn() {
  const p = battle.player;
  const e = battle.enemy;

  const pDmg = useAbility(p);
  const eDmg = useAbility(e);

  e.stats.hp -= pDmg;
  p.stats.hp -= eDmg;

  log(`You used ${p.ability} → ${pDmg}`);
  log(`Enemy used ${e.ability} → ${eDmg}`);

  updateHP();

  if (p.stats.hp <= 0 || e.stats.hp <= 0) {
    endBattle();
  }
}

function useAbility(u) {
  let base = u.stats.power;

  if (u.ability.includes("Flame")) base *= 1.4;
  if (u.ability.includes("Thunder")) base *= 1.6;
  if (u.ability.includes("Spirit")) base *= 2;

  return Math.max(1, Math.floor(base + Math.random() * 3));
}

function updateHP() {
  document.getElementById("playerName").innerText = battle.player.name;
  document.getElementById("enemyName").innerText = battle.enemy.name;

  document.getElementById("playerHP").style.width =
    (battle.player.stats.hp / battle.player.stats.maxHp) * 100 + "%";

  document.getElementById("enemyHP").style.width =
    (battle.enemy.stats.hp / battle.enemy.stats.maxHp) * 100 + "%";

  document.getElementById("playerStats").innerText =
    `${battle.player.stats.hp}/${battle.player.stats.maxHp}`;

  document.getElementById("enemyStats").innerText =
    `${battle.enemy.stats.hp}/${battle.enemy.stats.maxHp}`;
}

function endBattle() {
  const winner =
    battle.player.stats.hp > 0 ? "You Win!" : "You Lose!";

  alert(winner);

  battleScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
}

function log(t) {
  const p = document.createElement("p");
  p.innerText = t;
  battleLog.appendChild(p);
}

/* ---------------- ENEMY ---------------- */
function generateEnemy(level) {
  return {
    type: ["Fox", "Cat", "Dog"][Math.floor(Math.random() * 3)],
    level,
    stats: {
      power: level + 2,
      agility: level + 2,
      loyalty: level + 2,
      hp: 10 + level * 2,
      maxHp: 10 + level * 2
    }
  };
}

/* INIT */
renderPets();
