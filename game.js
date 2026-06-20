let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;
let battle = null;

/* ================= UI ================= */
const petList = document.getElementById("petList");
const petSelectScreen = document.getElementById("petSelectScreen");
const trainingScreen = document.getElementById("trainingScreen");
const resultScreen = document.getElementById("resultScreen");
const battleScreen = document.getElementById("battleScreen");

const marker = document.getElementById("marker");
const feedback = document.getElementById("feedback");
const timer = document.getElementById("timer");
const resultText = document.getElementById("resultText");

/* ================= TRAINING STATE ================= */
let position = 0;
let direction = 1;
let speed = 2;
let interval;
let timeLeft = 15;
let hits = { miss:0, ok:0, good:0, perfect:0 };

/* ================= SAVE ================= */
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

/* ================= CREATE PET ================= */
function createPet(type) {
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
    },
    rarity: "Common"
  });

  save();
  renderPets();
}

/* ================= EVOLUTION ================= */
function stage(level) {
  if (level >= 15) return 4;
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

function emoji(p) {
  const map = {
    Fox: ["🦊","🦊🔥","🦊⚡","🦊👑"],
    Cat: ["🐱","🐱✨","🐱⚔️","🐱💎"],
    Dog: ["🐶","🐶🔥","🐶⚡","🐶👑"]
  };
  return map[p.type][stage(p.level)-1];
}

function xpMultiplier(level) {
  if (level >= 15) return 2;
  if (level >= 10) return 1.6;
  if (level >= 5) return 1.3;
  return 1;
}

/* ================= RENDER PETS ================= */
function renderPets() {
  petList.innerHTML = "";

  pets.forEach(p => {
    const btn = document.createElement("button");

    btn.innerHTML = `
      ${emoji(p)} ${p.type}<br>
      Lv.${p.level}
    `;

    btn.onclick = () => openPet(p.id);
    petList.appendChild(btn);
  });
}

function openPet(id) {
  activePet = pets.find(p => p.id === id);

  const choice = confirm("OK = Train | Cancel = Battle");
  choice ? startTraining() : startBattle();
}

/* ================= TRAINING ================= */
function startTraining() {
  petSelectScreen.classList.remove("active");
  trainingScreen.classList.add("active");

  resetTraining();

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

function resetTraining() {
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
  const start = 42;
  const end = 58;

  if (position >= start && position <= end) {
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

/* ================= END TRAINING ================= */
function endTraining() {
  clearInterval(interval);

  const xp =
    (hits.ok*5 + hits.good*10 + hits.perfect*25) *
    xpMultiplier(activePet.level);

  activePet.xp += Math.floor(xp);

  while (activePet.xp >= activePet.xpToLevel) {
    activePet.xp -= activePet.xpToLevel;
    activePet.level++;

    activePet.xpToLevel = Math.floor(activePet.xpToLevel * 1.25);

    activePet.stats.power++;
    activePet.stats.agility++;
    activePet.stats.loyalty++;

    activePet.stats.maxHp += 2;
    activePet.stats.hp = activePet.stats.maxHp;
  }

  save();

  trainingScreen.classList.remove("active");
  resultScreen.classList.add("active");

  resultText.innerHTML = `
    ${emoji(activePet)} ${activePet.type}<br>
    Level: ${activePet.level}<br>
    XP: ${activePet.xp}/${activePet.xpToLevel}<br>
    HP: ${activePet.stats.hp}/${activePet.stats.maxHp}
  `;
}

/* ================= BATTLE (FIXED CORE) ================= */
function startBattle() {
  const enemy = generateEnemy(activePet.level);

  battle = {
    player: createBattlePet(activePet),
    enemy: createBattleEnemy(enemy),
    turn: 0
  };

  petSelectScreen.classList.remove("active");
  battleScreen.classList.add("active");

  clearLog();
  log("⚔️ Battle Started!");

  updateHP();
}

/* SAFE BATTLE OBJECTS (NO BUGS) */
function createBattlePet(p) {
  return {
    name: p.type,
    stats: {
      power: p.stats.power,
      agility: p.stats.agility,
      loyalty: p.stats.loyalty,
      hp: p.stats.maxHp,
      maxHp: p.stats.maxHp
    }
  };
}

function createBattleEnemy(e) {
  return {
    name: e.type,
    stats: {
      power: e.stats.power,
      agility: e.stats.agility,
      loyalty: e.stats.loyalty,
      hp: e.stats.maxHp,
      maxHp: e.stats.maxHp
    }
  };
}

/* ================= TURN ================= */
document.getElementById("nextTurnBtn").onclick = runTurn;

function runTurn() {
  const p = battle.player;
  const e = battle.enemy;

  battle.turn++;

  const ai = aiChoice(e, p);

  const pDmg = damage(p, e, "ATTACK");
  const eDmg = damage(e, p, ai);

  e.stats.hp -= pDmg;
  p.stats.hp -= eDmg;

  log(`Turn ${battle.turn}`);
  log(`You: -${pDmg} | Enemy: -${eDmg}`);

  showDamage(pDmg, "enemy");
  showDamage(eDmg, "player");

  updateHP();

  if (p.stats.hp <= 0 || e.stats.hp <= 0) {
    endBattle();
  }
}

/* ================= AI ================= */
function aiChoice(ai, player) {
  if (ai.stats.hp < ai.stats.maxHp * 0.4) return "DEFEND";
  if (player.stats.power > ai.stats.power) return "DEFEND";
  return Math.random() < 0.8 ? "ATTACK" : "FOCUS";
}

/* ================= DAMAGE ================= */
function damage(a, d, act) {
  let base = a.stats.power;

  if (act === "FOCUS") return 0;

  if (act === "DEFEND") return Math.max(1, Math.floor(base * 0.3));

  return Math.max(
    1,
    Math.floor(base + Math.random()*2 - d.stats.loyalty*0.3)
  );
}

/* ================= HP UI (FIXED) ================= */
function updateHP() {
  const p = battle.player;
  const e = battle.enemy;

  document.getElementById("playerName").innerText = p.name;
  document.getElementById("enemyName").innerText = e.name;

  document.getElementById("playerHP").style.width =
    Math.max(0, (p.stats.hp / p.stats.maxHp) * 100) + "%";

  document.getElementById("enemyHP").style.width =
    Math.max(0, (e.stats.hp / e.stats.maxHp) * 100) + "%";

  document.getElementById("playerStats").innerText =
    `${p.stats.hp}/${p.stats.maxHp}`;

  document.getElementById("enemyStats").innerText =
    `${e.stats.hp}/${e.stats.maxHp}`;
}

/* ================= ENEMY ================= */
function generateEnemy(level) {
  const hp = 10 + level * 2;

  return {
    type: ["Fox","Cat","Dog"][Math.floor(Math.random()*3)],
    stats: {
      power: level + 2,
      agility: level + 2,
      loyalty: level + 2,
      hp: hp,
      maxHp: hp
    }
  };
}

/* ================= DAMAGE POPUP ================= */
function showDamage(amount, side) {
  const d = document.createElement("div");
  d.className = "damage";
  d.innerText = "-" + amount;

  document.body.appendChild(d);

  d.style.left = side === "enemy" ? "70%" : "25%";
  d.style.top = "40%";

  setTimeout(() => d.remove(), 800);
}

/* ================= LOG ================= */
function log(t) {
  const el = document.createElement("div");
  el.className = "log";
  el.innerText = t;
  document.getElementById("battleLog").appendChild(el);
}

function clearLog() {
  document.getElementById("battleLog").innerHTML = "";
}

/* ================= END BATTLE ================= */
function endBattle() {
  const p = battle.player;
  const e = battle.enemy;

  const result =
    p.stats.hp > e.stats.hp ? "WIN" :
    p.stats.hp < e.stats.hp ? "LOSE" : "DRAW";

  const xpGain =
    result === "WIN" ? 50 :
    result === "DRAW" ? 25 : 10;

  activePet.xp += xpGain;
  save();

  log(`🏁 ${result} +${xpGain} XP`);

  setTimeout(() => {
    battleScreen.classList.remove("active");
    petSelectScreen.classList.add("active");
    renderPets();
  }, 1200);
}

/* ================= BACK ================= */
function backToMenu() {
  resultScreen.classList.remove("active");
  petSelectScreen.classList.add("active");
  renderPets();
}

/* INIT */
renderPets();
