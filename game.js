let pets = JSON.parse(localStorage.getItem("pets")) || [];
let activePet = null;
let battle = null;

/* UI */
const petList = document.getElementById("petList");
const petSelectScreen = document.getElementById("petSelectScreen");
const battleScreen = document.getElementById("battleScreen");

/* ---------------- SAVE ---------------- */
function save() {
  localStorage.setItem("pets", JSON.stringify(pets));
}

/* ---------------- LIMIT 5 PETS ---------------- */
function createPet(type) {
  if (pets.length >= 5) {
    alert("You can only have 5 pets!");
    return;
  }

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

/* ---------------- EVOLUTION + ABILITIES ---------------- */
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

/* ---------------- DELETE PET ---------------- */
function deletePet(id) {
  pets = pets.filter(p => p.id !== id);
  save();
  renderPets();
}

/* ---------------- SELECT PET ---------------- */
function selectPet(id) {
  activePet = pets.find(p => p.id === id);
  startBattle();
}

/* ---------------- BATTLE ---------------- */
function startBattle() {
  const enemy = generateEnemy(activePet.level);

  battle = {
    player: createUnit(activePet),
    enemy: createUnit(enemy),
    turn: 0
  };

  petSelectScreen.classList.remove("active");
  battleScreen.classList.add("active");

  updateHP();
  clearLog();

  log("⚔️ Battle Started!");
}

/* SAFE UNIT */
function createUnit(p) {
  return {
    name: p.type,
    level: p.level,
    ability: ability(p),
    stats: {
      power: p.stats.power,
      agility: p.stats.agility,
      loyalty: p.stats.loyalty,
      hp: p.stats.maxHp,
      maxHp: p.stats.maxHp
    }
  };
}

/* ---------------- TURN ---------------- */
document.getElementById("nextTurnBtn").onclick = runTurn;

function runTurn() {
  const p = battle.player;
  const e = battle.enemy;

  battle.turn++;

  const pDmg = useAbility(p, e);
  const eDmg = useAbility(e, p);

  animateAttack("enemy");
  animateAttack("player");

  setTimeout(() => {
    e.stats.hp -= pDmg;
    p.stats.hp -= eDmg;

    log(`You used ${p.ability} → ${pDmg}`);
    log(`Enemy used ${e.ability} → ${eDmg}`);

    showDamage(pDmg, "enemy");
    showDamage(eDmg, "player");

    updateHP();

    if (p.stats.hp <= 0 || e.stats.hp <= 0) {
      endBattle();
    }
  }, 300);
}

/* ---------------- ABILITIES DAMAGE ---------------- */
function useAbility(u, target) {
  let base = u.stats.power;

  if (u.ability.includes("Flame")) base *= 1.4;
  if (u.ability.includes("Thunder")) base *= 1.6;
  if (u.ability.includes("Spirit")) base *= 2;

  return Math.max(1, Math.floor(base + Math.random()*2));
}

/* ---------------- ANIMATION ---------------- */
function animateAttack(side) {
  const el = document.getElementById(side === "enemy" ? "enemyName" : "playerName");

  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 250);
}

/* ---------------- HP ---------------- */
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

/* ---------------- DAMAGE POPUP ---------------- */
function showDamage(amount, side) {
  const d = document.createElement("div");
  d.className = "damage";
  d.innerText = "-" + amount;

  document.body.appendChild(d);

  d.style.left = side === "enemy" ? "70%" : "25%";
  d.style.top = "40%";

  setTimeout(() => d.remove(), 800);
}

/* ---------------- LOG ---------------- */
function log(t) {
  console.log(t);
}

/* ---------------- ENEMY ---------------- */
function generateEnemy(level) {
  return {
    type: ["Fox","Cat","Dog"][Math.floor(Math.random()*3)],
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
