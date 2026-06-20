let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;
let battle = null;

// UI
const petList = document.getElementById("petList");
const petSelectScreen = document.getElementById("petSelectScreen");
const trainingScreen = document.getElementById("trainingScreen");
const resultScreen = document.getElementById("resultScreen");
const battleScreen = document.getElementById("battleScreen");

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

// -------------------- SAVE --------------------
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

// -------------------- CREATE PET --------------------
function createPet(type) {
  pets.push({
    id: Date.now(),
    type,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    stats: { power: 2, agility: 2, loyalty: 2, hp: 10 },
    rarity: "Common"
  });

  save();
  renderPets();
}

// -------------------- EVOLUTION --------------------
function getStage(level) {
  if (level >= 15) return 4;
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

function getEmoji(p) {
  const stage = getStage(p.level);

  const map = {
    Fox: ["🦊","🦊🔥","🦊⚡","🦊👑"],
    Cat: ["🐱","🐱✨","🐱⚔️","🐱💎"],
    Dog: ["🐶","🐶🔥","🐶⚡","🐶👑"]
  };

  return map[p.type][stage - 1];
}

function statMultiplier(level) {
  if (level >= 15) return 2;
  if (level >= 10) return 1.6;
  if (level >= 5) return 1.3;
  return 1;
}

// -------------------- RENDER --------------------
function renderPets() {
  petList.innerHTML = "";

  pets.forEach(p => {
    const btn = document.createElement("button");
    btn.innerHTML = `
      ${getEmoji(p)} ${p.type}
      Lv.${p.level} (${p.rarity})
    `;

    btn.onclick = () => openPet(p.id);
    petList.appendChild(btn);
  });
}

function openPet(id) {
  activePet = pets.find(p => p.id === id);

  const choice = confirm("OK = Train | Cancel = Battle");
  if (choice) startTraining();
  else startBattle();
}

// -------------------- TRAINING --------------------
function startTraining() {
  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  reset();

  interval = setInterval(updateBar, 16);

  let t = setInterval(() => {
    timeLeft--;
    timer.innerText = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(t);
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

// -------------------- END TRAINING --------------------
function endTraining() {
  clearInterval(interval);

  const mult = statMultiplier(activePet.level);

  const xp =
    (hits.ok*5 + hits.good*10 + hits.perfect*25) * mult;

  activePet.xp += Math.floor(xp);

  while (activePet.xp >= activePet.xpToLevel) {
    activePet.xp -= activePet.xpToLevel;
    activePet.level++;

    activePet.xpToLevel = Math.floor(activePet.xpToLevel * 1.25);

    activePet.stats.power++;
    activePet.stats.agility++;
    activePet.stats.loyalty++;
    activePet.stats.hp += 2;
  }

  save();

  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  resultText.innerHTML = `
    ${getEmoji(activePet)} ${activePet.type}<br>
    Level: ${activePet.level}<br>
    XP: ${activePet.xp}/${activePet.xpToLevel}<br>
    Stage: ${getStage(activePet.level)}<br><br>

    Power: ${activePet.stats.power}<br>
    Agility: ${activePet.stats.agility}<br>
    Loyalty: ${activePet.stats.loyalty}<br>
    HP: ${activePet.stats.hp}
  `;
}

// -------------------- BATTLE SYSTEM --------------------
function startBattle() {
  const enemy = generateEnemy(activePet.level);

  battle = {
    player: structuredClone(activePet),
    enemy,
    turn: 0
  };

  battle.player.stats.hp = activePet.stats.hp;
  battle.enemy.stats.hp = enemy.stats.hp;

  petSelectScreen.classList.remove("active");
  battleScreen.classList.add("active");

  log("⚔️ Battle Start!");
  log(`${activePet.type} vs ${enemy.type}`);
}

document.getElementById("nextTurnBtn").onclick = runTurn;

function runTurn() {
  const p = battle.player;
  const e = battle.enemy;

  battle.turn++;

  log(`\nTurn ${battle.turn}`);

  const aiAction = aiChoice(e, p);

  const pDmg = damage(p, e, "ATTACK");
  const eDmg = damage(e, p, aiAction);

  e.stats.hp -= pDmg;
  p.stats.hp -= eDmg;

  log(`You deal ${pDmg}`);
  log(`Enemy uses ${aiAction} → ${eDmg}`);

  log(`HP: You ${p.stats.hp} | Enemy ${e.stats.hp}`);

  if (p.stats.hp <= 0 || e.stats.hp <= 0 || battle.turn >= 10) {
    endBattle();
  }
}

// -------------------- AI --------------------
function aiChoice(ai, player) {
  const hpRatio = ai.stats.hp / 10;

  if (hpRatio < 0.4) return Math.random() < 0.6 ? "DEFEND" : "FOCUS";

  if (player.stats.power > ai.stats.power) return "DEFEND";

  return Math.random() < 0.8 ? "ATTACK" : "FOCUS";
}

// -------------------- DAMAGE --------------------
function damage(a, d, action) {
  let base = a.stats.power;

  if (action === "FOCUS") {
    a.buff = 2;
    return 0;
  }

  if (action === "DEFEND") {
    return Math.max(1, Math.floor(base * 0.3));
  }

  if (a.buff) {
    base *= a.buff;
    a.buff = 0;
  }

  return Math.max(1, Math.floor(base + Math.random()*2 - d.stats.loyalty*0.3));
}

// -------------------- END BATTLE --------------------
function endBattle() {
  const p = battle.player;
  const e = battle.enemy;

  let result =
    p.stats.hp > e.stats.hp ? "WIN" :
    p.stats.hp < e.stats.hp ? "LOSE" : "DRAW";

  let xpGain =
    result === "WIN" ? 50 :
    result === "DRAW" ? 25 : 10;

  activePet.xp += xpGain;
  save();

  log(`\n🏁 ${result} +${xpGain} XP`);
}

// -------------------- ENEMY --------------------
function generateEnemy(level) {
  return {
    type: ["Fox","Cat","Dog"][Math.floor(Math.random()*3)],
    stats: {
      power: level + 2,
      agility: level + 2,
      loyalty: level + 2,
      hp: 10 + level * 2
    }
  };
}

// -------------------- LOG --------------------
function log(t) {
  const div = document.createElement("div");
  div.className = "log";
  div.innerText = t;
  document.getElementById("battleLog").appendChild(div);
}

// -------------------- BACK --------------------
function backToMenu() {
  resultScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
  renderPets();
}

// -------------------- INIT --------------------
renderPets();
