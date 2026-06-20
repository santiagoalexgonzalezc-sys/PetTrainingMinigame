let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;
let battle = null;

/* UI */
const petList = document.getElementById("petList");
const petSelectScreen = document.getElementById("petSelectScreen");
const trainingScreen = document.getElementById("trainingScreen");
const battleScreen = document.getElementById("battleScreen");
const resultScreen = document.getElementById("resultScreen");

const marker = document.getElementById("marker");
const trainBtn = document.getElementById("trainBtn");
const feedback = document.getElementById("feedback");
const resultText = document.getElementById("resultText");
const battleLog = document.getElementById("battleLog");

/* SAVE */
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

/* PETS */
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
      hp: 10,
      maxHp: 10
    }
  });

  save();
  renderPets();
}

/* RENDER */
function renderPets() {
  petList.innerHTML = "";

  pets.forEach(p => {
    const div = document.createElement("div");
    div.className = "petCard";

    div.innerHTML = `
      <div>
        ${p.type} Lv.${p.level}<br>
        XP ${p.xp}/${p.xpToLevel}
      </div>

      <div>
        <button onclick="selectPet(${p.id})">Use</button>
        <button onclick="deletePet(${p.id})">🗑</button>
      </div>
    `;

    petList.appendChild(div);
  });
}

function deletePet(id) {
  pets = pets.filter(p => p.id !== id);
  save();
  renderPets();
}

/* SELECT MODE */
function selectPet(id) {
  activePet = pets.find(p => p.id === id);

  const mode = confirm("OK = Battle | Cancel = Training");

  if (mode) startBattle();
  else startTraining();
}

/* ---------------- TRAINING ---------------- */

let pos = 0;
let dir = 1;
let interval;
let running = false;

function startTraining() {
  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  feedback.innerText = "Hit TRAIN at the right moment!";
  setupBar();
}

function setupBar() {
  document.getElementById("perfectZone").style.left = "40%";
  document.getElementById("perfectZone").style.width = "20%";
  marker.style.left = "0%";
}

trainBtn.onclick = () => {
  if (running) return;

  running = true;
  pos = 0;
  dir = 1;

  interval = setInterval(() => {
    pos += 2 * dir;

    if (pos >= 100) dir = -1;
    if (pos <= 0) dir = 1;

    marker.style.left = pos + "%";
  }, 16);

  setTimeout(endTraining, 2000);
};

function endTraining() {
  clearInterval(interval);
  running = false;

  const result = getResult();

  let xp = 0;
  if (result === "perfect") xp = 50;
  else if (result === "good") xp = 25;
  else if (result === "ok") xp = 10;
  else xp = 3;

  activePet.xp += xp;

  if (activePet.xp >= activePet.xpToLevel) {
    activePet.level++;
    activePet.xp = 0;
    activePet.xpToLevel += 50;

    activePet.stats.power++;
    activePet.stats.maxHp += 2;
    activePet.stats.hp = activePet.stats.maxHp;
  }

  save();

  resultText.innerText = `${result.toUpperCase()} +${xp} XP`;

  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  renderPets();
}

function getResult() {
  if (pos >= 40 && pos <= 60) return "perfect";
  if (pos >= 30 && pos <= 70) return "good";
  if (pos >= 20 && pos <= 80) return "ok";
  return "miss";
}

function backToMenu() {
  resultScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
}

/* ---------------- BATTLE ---------------- */

function startBattle() {
  const enemy = generateEnemy(activePet.level);

  battle = {
    player: createUnit(activePet),
    enemy: createUnit(enemy)
  };

  battle.player.stats.hp = battle.player.stats.maxHp;
  battle.enemy.stats.hp = battle.enemy.stats.maxHp;

  petSelectScreen.classList.remove("active");
  battleScreen.classList.add("active");

  battleLog.innerHTML = "";
  updateHP();
  log("Battle started!");
}

function createUnit(p) {
  return {
    name: p.type,
    stats: { ...p.stats }
  };
}

document.getElementById("nextTurnBtn").onclick = runTurn;

function runTurn() {
  const p = battle.player;
  const e = battle.enemy;

  const pDmg = damage(p);
  const eDmg = damage(e);

  p.stats.hp -= eDmg;
  e.stats.hp -= pDmg;

  log(`You deal ${pDmg}`);
  log(`Enemy deals ${eDmg}`);

  updateHP();

  if (p.stats.hp <= 0 || e.stats.hp <= 0) {
    endBattle();
  }
}

function damage(u) {
  return Math.max(1, Math.floor(u.stats.power + Math.random() * 3));
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
  alert(battle.player.stats.hp > 0 ? "You Win!" : "You Lose!");

  battleScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
}

function log(t) {
  const p = document.createElement("p");
  p.innerText = t;
  battleLog.appendChild(p);
}

/* ENEMY */
function generateEnemy(level) {
  return {
    type: ["Fox", "Cat", "Dog"][Math.floor(Math.random() * 3)],
    level,
    stats: {
      power: level + 2,
      hp: 10 + level * 2,
      maxHp: 10 + level * 2
    }
  };
}

renderPets();
