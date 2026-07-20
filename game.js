// ==================== DATA MANAGER ====================
const DataManager = {
    save() {
        const data = {
            pets: PetManager.pets,
            money: Economy.money,
            inventory: Economy.inventory,
            selectedPet: PetManager.selectedPet?.id || null,
            hasStarter: Game.hasStarter,
            explorationCooldowns: Exploration.cooldowns
        };
        localStorage.setItem("petSimulator", JSON.stringify(data));
    },

    load() {
        const data = JSON.parse(localStorage.getItem("petSimulator"));
        if (data) {
            PetManager.pets = data.pets || [];
            Economy.money = data.money || 100;
            Economy.inventory = data.inventory || { basicBall: 5, potion: 3 };
            // Handle both string and numeric IDs for backward compatibility
            PetManager.selectedPet = PetManager.pets.find(p => String(p.id) === String(data.selectedPet)) || null;
            Game.hasStarter = data.hasStarter || false;
            Exploration.cooldowns = data.explorationCooldowns || {};
        }   
    },

    resetAccount() {
        if (confirm("Are you sure you want to reset your account? This will delete all pets, money, and progress!")) {
            localStorage.removeItem("petSimulator");
            location.reload();
        }
    }
};

// ==================== PET DEFINITIONS ====================
const PetTypes = {
    // Fire Types
    emberFox: {
        name: "Ember Fox",
        emoji: "🦊",
        type: "fire",
        baseStats: { hp: 45, attack: 52, defense: 43, speed: 65, special: 60 },
        ability: "Blaze - Low HP increases Fire damage",
        evolution: ["Ember Fox", "Inferno Fox", "Phoenix Lord"]
    },
    flameCat: {
        name: "Flame Cat",
        emoji: "🐱",
        type: "fire",
        baseStats: { hp: 48, attack: 55, defense: 40, speed: 60, special: 55 },
        ability: "Intimidate - Lowers enemy attack on switch",
        evolution: ["Flame Cat", "Blaze Cat", "Magma Tiger"]
    },
    sparkDog: {
        name: "Spark Dog",
        emoji: "🐶",
        type: "fire",
        baseStats: { hp: 50, attack: 50, defense: 45, speed: 55, special: 50 },
        ability: "Flash Fire - Immune to Fire, boosts Fire moves",
        evolution: ["Spark Dog", "Fire Hound", "Inferno Wolf"]
    },
    
    // Water Types
    aquaTurtle: {
        name: "Aqua Turtle",
        emoji: "🐢",
        type: "water",
        baseStats: { hp: 55, attack: 40, defense: 65, speed: 35, special: 50 },
        ability: "Rain Dish - Heals in rain",
        evolution: ["Aqua Turtle", "Hydro Turtle", "Ocean Guardian"]
    },
    mistFrog: {
        name: "Mist Frog",
        emoji: "🐸",
        type: "water",
        baseStats: { hp: 50, attack: 45, defense: 50, speed: 55, special: 55 },
        ability: "Swift Swim - Speed doubles in rain",
        evolution: ["Mist Frog", "Storm Frog", "Tidal King"]
    },
    waveWhale: {
        name: "Wave Whale",
        emoji: "🐋",
        type: "water",
        baseStats: { hp: 60, attack: 45, defense: 55, speed: 40, special: 60 },
        ability: "Water Absorb - Heals from Water moves",
        evolution: ["Wave Whale", "Tsunami Whale", "Leviathan"]
    },
    
    // Grass Types
    leafBunny: {
        name: "Leaf Bunny",
        emoji: "🐰",
        type: "grass",
        baseStats: { hp: 45, attack: 50, defense: 45, speed: 70, special: 45 },
        ability: "Overgrow - Low HP increases Grass damage",
        evolution: ["Leaf Bunny", "Forest Bunny", "Nature Spirit"]
    },
    vineSnake: {
        name: "Vine Snake",
        emoji: "🐍",
        type: "grass",
        baseStats: { hp: 48, attack: 55, defense: 40, speed: 60, special: 50 },
        ability: "Chlorophyll - Speed doubles in sun",
        evolution: ["Vine Snake", "Thorn Snake", "Jungle Serpent"]
    },
    mossBear: {
        name: "Moss Bear",
        emoji: "🐻",
        type: "grass",
        baseStats: { hp: 60, attack: 55, defense: 50, speed: 35, special: 45 },
        ability: "Thick Fat - Reduces Fire/Ice damage",
        evolution: ["Moss Bear", "Forest Bear", "Earth Guardian"]
    },
    
    // Electric Types
    boltMouse: {
        name: "Bolt Mouse",
        emoji: "🐭",
        type: "electric",
        baseStats: { hp: 40, attack: 45, defense: 40, speed: 75, special: 55 },
        ability: "Static - Paralyzes on contact",
        evolution: ["Bolt Mouse", "Volt Mouse", "Thunder Lord"]
    },
    shockEel: {
        name: "Shock Eel",
        emoji: "🐟",
        type: "electric",
        baseStats: { hp: 50, attack: 50, defense: 45, speed: 65, special: 50 },
        ability: "Volt Absorb - Heals from Electric moves",
        evolution: ["Shock Eel", "Storm Eel", "Lightning Serpent"]
    },
    zapBird: {
        name: "Zap Bird",
        emoji: "🐦",
        type: "electric",
        baseStats: { hp: 45, attack: 48, defense: 42, speed: 70, special: 55 },
        ability: "Motor Drive - Speed boosts from Electric moves",
        evolution: ["Zap Bird", "Storm Bird", "Thunder Hawk"]
    },
    
    // Psychic Types
    mindCat: {
        name: "Mind Cat",
        emoji: "😺",
        type: "psychic",
        baseStats: { hp: 45, attack: 40, defense: 45, speed: 60, special: 70 },
        ability: "Synchronize - Shares status conditions",
        evolution: ["Mind Cat", "Psi Cat", "Telepath Master"]
    },
    dreamOwl: {
        name: "Dream Owl",
        emoji: "🦉",
        type: "psychic",
        baseStats: { hp: 50, attack: 42, defense: 48, speed: 55, special: 65 },
        ability: "Insomnia - Cannot fall asleep",
        evolution: ["Dream Owl", "Night Owl", "Vision Sage"]
    },
    cosmicFox: {
        name: "Cosmic Fox",
        emoji: "🦊",
        type: "psychic",
        baseStats: { hp: 48, attack: 45, defense: 42, speed: 65, special: 68 },
        ability: "Magic Guard - Only takes direct damage",
        evolution: ["Cosmic Fox", "Star Fox", "Galaxy Lord"]
    },
    
    // Ice Types
    frostPenguin: {
        name: "Frost Penguin",
        emoji: "🐧",
        type: "ice",
        baseStats: { hp: 52, attack: 48, defense: 50, speed: 45, special: 55 },
        ability: "Snow Cloak - Evasion in snow",
        evolution: ["Frost Penguin", "Glacier Penguin", "Ice Emperor"]
    },
    crystalSeal: {
        name: "Crystal Seal",
        emoji: "🦭",
        type: "ice",
        baseStats: { hp: 55, attack: 45, defense: 55, speed: 40, special: 50 },
        ability: "Ice Body - Heals in hail",
        evolution: ["Crystal Seal", "Diamond Seal", "Frost Guardian"]
    },
    
    // Dragon Types
    scaleLizard: {
        name: "Scale Lizard",
        emoji: "🦎",
        type: "dragon",
        baseStats: { hp: 50, attack: 55, defense: 45, speed: 50, special: 50 },
        ability: "Rough Skin - Damages attackers",
        evolution: ["Scale Lizard", "Dragon Lizard", "Wyvern King"]
    },
    drakeWhelp: {
        name: "Drake Whelp",
        emoji: "🐉",
        type: "dragon",
        baseStats: { hp: 55, attack: 60, defense: 50, speed: 45, special: 55 },
        ability: "Multiscale - Reduces damage at full HP",
        evolution: ["Drake Whelp", "Storm Drake", "Dragon Emperor"]
    },

    // Fire Type
    cinderScorpion: {
        name: "Cinder Scorpion",
        emoji: "🦂",
        type: "fire",
        baseStats: { hp: 48, attack: 60, defense: 52, speed: 55, special: 50 },
        ability: "Flame Body - May burn attackers on contact",
        evolution: ["Spark Tail", "Cinder Scorpion", "Inferno Stinger"]
    },

    // Ice Type
    frostBear: {
        name: "Frost Bear",
        emoji: "🐻‍❄️",
        type: "ice",
        baseStats: { hp: 65, attack: 58, defense: 55, speed: 35, special: 50 },
        ability: "Slush Rush - Speed doubles in hail",
        evolution: ["Ice Cub", "Frost Bear", "Tundra King"]
    },

    // Dragon Types
    crystalWyrm: {
        name: "Crystal Wyrm",
        emoji: "🐉",
        type: "dragon",
        baseStats: { hp: 55, attack: 58, defense: 52, speed: 50, special: 62 },
        ability: "Levitate - Immune to ground moves",
        evolution: ["Shard Hatchling", "Crystal Wyrm", "Geode Leviathan"]
    },
    marshCroc: {
        name: "Marsh Croc",
        emoji: "🐊",
        type: "dragon",
        baseStats: { hp: 60, attack: 64, defense: 55, speed: 42, special: 48 },
        ability: "Strong Jaw - Boosts bite moves",
        evolution: ["Mud Wader", "Marsh Croc", "Bog Tyrant"]
    },

    // Dark Types (NEW)
    shadowWolf: {
        name: "Shadow Wolf",
        emoji: "🐺",
        type: "dark",
        baseStats: { hp: 50, attack: 58, defense: 45, speed: 62, special: 50 },
        ability: "Pack Hunter - Boosts attack when allies are present",
        evolution: ["Shadow Pup", "Umbra Wolf", "Nightfall Alpha"]
    },
    duskBat: {
        name: "Dusk Bat",
        emoji: "🦇",
        type: "dark",
        baseStats: { hp: 45, attack: 45, defense: 42, speed: 72, special: 55 },
        ability: "Vampiric - Heals from a fraction of damage dealt",
        evolution: ["Dusk Bat", "Night Bat", "Eclipse Wing"]
    },

    // Fairy Types (NEW)
    moonPixie: {
        name: "Moon Pixie",
        emoji: "🦄",
        type: "fairy",
        baseStats: { hp: 48, attack: 42, defense: 48, speed: 60, special: 68 },
        ability: "Cute Charm - May infatuate attackers on contact",
        evolution: ["Star Fawn", "Moon Pixie", "Astral Spirit"]
    },
    glimmerMoth: {
        name: "Glimmer Moth",
        emoji: "🦋",
        type: "fairy",
        baseStats: { hp: 42, attack: 40, defense: 45, speed: 72, special: 65 },
        ability: "Shield Dust - Blocks secondary move effects",
        evolution: ["Dust Wisp", "Glimmer Moth", "Prism Sovereign"]
    },

    // Normal Types (NEW)
    cloudSheep: {
        name: "Cloud Sheep",
        emoji: "🐑",
        type: "normal",
        baseStats: { hp: 62, attack: 42, defense: 58, speed: 38, special: 50 },
        ability: "Fluffy - Halves contact damage taken",
        evolution: ["Wool Lamb", "Cloud Sheep", "Sky Shepherd"]
    },
    fieldDeer: {
        name: "Field Deer",
        emoji: "🦌",
        type: "normal",
        baseStats: { hp: 50, attack: 48, defense: 45, speed: 62, special: 50 },
        ability: "Run Away - Guaranteed to flee wild battles",
        evolution: ["Spotted Fawn", "Field Deer", "Forest Monarch"]
    }
};

const Starters = ["emberFox", "aquaTurtle", "leafBunny", "boltMouse", "mindCat"];

// ==================== PET MANAGER ====================
const PetManager = {
    pets: [],
    selectedPet: null,
    maxPartySize: 100,
    petIdCounter: 0,

    createPet(typeId, level = 1) {
        const template = PetTypes[typeId];
        if (!template) return null;

        this.petIdCounter++;
        const pet = {
            id: Date.now() + "_" + this.petIdCounter + "_" + Math.random().toString(36).substr(2, 9),
            typeId: typeId,
            level: level,
            xp: 0,
            currentHP: this.calculateMaxHP(template, level),
            stats: this.calculateStats(template, level),
            lastTraining: null
        };

        return pet;
    },

    calculateMaxHP(template, level) {
        return Math.floor((template.baseStats.hp * 2 * level) / 100) + level + 10;
    },

    calculateStats(template, level) {
        const stats = {};
        for (const stat in template.baseStats) {
            if (stat === "hp") continue;
            stats[stat] = Math.floor((template.baseStats[stat] * 2 * level) / 100) + 5;
        }
        return stats;
    },

    getEvolution(pet) {
        const template = PetTypes[pet.typeId];
        if (pet.level >= 20) return template.evolution[2];
        if (pet.level >= 10) return template.evolution[1];
        return template.evolution[0];
    },

    getTemplate(pet) {
        return PetTypes[pet.typeId];
    },

    xpNeeded(level) {
        return level * 100;
    },

    gainXP(pet, amount) {
        pet.xp += amount;
        let leveledUp = false;

        while (pet.xp >= this.xpNeeded(pet.level)) {
            pet.xp -= this.xpNeeded(pet.level);
            pet.level++;
            pet.currentHP = this.calculateMaxHP(PetTypes[pet.typeId], pet.level);
            pet.stats = this.calculateStats(PetTypes[pet.typeId], pet.level);
            leveledUp = true;
        }

        return leveledUp;
    },

    deletePet(id) {
        this.pets = this.pets.filter(p => String(p.id) !== String(id));
        if (String(this.selectedPet?.id) === String(id)) {
            this.selectedPet = this.pets[0] || null;
        }
    },

    selectPet(id) {
        this.selectedPet = this.pets.find(p => String(p.id) === String(id));
    }
};

// ==================== ECONOMY ====================
const Economy = {
    money: 100,
    inventory: {
        basicBall: 5,
        greatBall: 0,
        ultraBall: 0,
        potion: 3,
        superPotion: 0,
        hyperPotion: 0
    },

    shopItems: {
        basicBall: { name: "Basic Ball", price: 50, type: "catch", power: 1 },
        greatBall: { name: "Great Ball", price: 150, type: "catch", power: 2 },
        ultraBall: { name: "Ultra Ball", price: 400, type: "catch", power: 3 },
        potion: { name: "Potion", price: 30, type: "heal", power: 20 },
        superPotion: { name: "Super Potion", price: 80, type: "heal", power: 50 },
        hyperPotion: { name: "Hyper Potion", price: 200, type: "heal", power: 100 }
    },

    buyItem(itemId) {
        const item = this.shopItems[itemId];
        if (!item || this.money < item.price) return false;

        this.money -= item.price;
        this.inventory[itemId] = (this.inventory[itemId] || 0) + 1;
        return true;
    },

    useItem(itemId, pet) {
        if (!this.inventory[itemId] || this.inventory[itemId] <= 0) return false;

        const item = this.shopItems[itemId];
        this.inventory[itemId]--;

        if (item.type === "heal") {
            const maxHP = PetManager.calculateMaxHP(PetTypes[pet.typeId], pet.level);
            pet.currentHP = Math.min(maxHP, pet.currentHP + item.power);
        }

        return true;
    },

    sellPet(pet) {
        const value = pet.level * 30;
        this.money += value;
        PetManager.deletePet(pet.id);
        return value;
    }
};

// ==================== EXPLORATION ====================
const Exploration = {
    zones: {
        forest: {
            name: "Forest",
            emoji: "🌲",
            commonPets: ["leafBunny", "vineSnake", "mossBear"],
            rarePets: ["mindCat", "dreamOwl"],
            encounterRate: 1
        },
        cave: {
            name: "Cave",
            emoji: "⛰️",
            commonPets: ["scaleLizard", "sparkDog", "crystalSeal"],
            rarePets: ["drakeWhelp", "frostPenguin"],
            encounterRate: 1
        },
        lake: {
            name: "Lake",
            emoji: "💧",
            commonPets: ["aquaTurtle", "mistFrog", "waveWhale"],
            rarePets: ["shockEel", "boltMouse"],
            encounterRate: 1
        },
        mountain: {
            name: "Mountain",
            emoji: "🏔️",
            commonPets: ["flameCat", "zapBird", "scaleLizard"],
            rarePets: ["drakeWhelp", "cosmicFox"],
            encounterRate: 1
        },
        desert: {
            name: "Desert",
            emoji: "🏜️",
            commonPets: ["emberFox", "sparkDog", "scaleLizard"],
            rarePets: ["flameCat", "drakeWhelp"],
            encounterRate: 1
        },
        ocean: {
            name: "Ocean",
            emoji: "🌊",
            commonPets: ["waveWhale", "shockEel", "crystalSeal"],
            rarePets: ["aquaTurtle", "frostPenguin"],
            encounterRate: 1
        },
        volcano: {
            name: "Volcano",
            emoji: "🌋",
            commonPets: ["flameCat", "emberFox", "sparkDog"],
            rarePets: ["drakeWhelp", "scaleLizard"],
            encounterRate: 1
        },
        swamp: {
            name: "Swamp",
            emoji: "🐊",
            commonPets: ["mistFrog", "vineSnake", "mossBear"],
            rarePets: ["waveWhale", "dreamOwl"],
            encounterRate: 1
        },
        sky: {
            name: "Sky",
            emoji: "☁️",
            commonPets: ["zapBird", "boltMouse", "dreamOwl"],
            rarePets: ["cosmicFox", "shockEel"],
            encounterRate: 0.9
        }
    },
    cooldowns: {},
    cooldownTime: 1000, // 1 second

    explore(zoneId) {
        if (this.cooldowns[zoneId] && Date.now() < this.cooldowns[zoneId]) {
            return null;
        }

        this.cooldowns[zoneId] = Date.now() + this.cooldownTime;
        const zone = this.zones[zoneId];

        if (Math.random() > zone.encounterRate) {
            return null; // No encounter
        }

        // Determine pet rarity
        const isRare = Math.random() < 0.25;
        const petPool = isRare ? zone.rarePets : zone.commonPets;
        const petType = petPool[Math.floor(Math.random() * petPool.length)];

        // Generate wild pet level (4-40)

        function getWildPetLevel() {
            if (PetManager.selectedPet.level > 20) {
                return Math.floor(Math.random() * 21) + 20;
            } else if (PetManager.selectedPet.level < 20) {
                return Math.floor(Math.random() * 18) + 2;
            }
        }

        const level = getWildPetLevel();
        const wildPet = PetManager.createPet(petType, level);

        return { pet: wildPet, isRare };
    },

    getCooldownRemaining(zoneId) {
        if (!this.cooldowns[zoneId]) return 0;
        const remaining = this.cooldowns[zoneId] - Date.now();
        return Math.max(0, Math.ceil(remaining / 1000));
    }
};

// ==================== BATTLE SYSTEM ====================
const BattleSystem = {
    petsDefeated: 0,
    active: false,
    playerPet: null,
    enemyPet: null,
    isPlayerTurn: true,
    battleLog: [],

    typeEffectiveness: {
        fire: { grass: 2, water: 0.5, ice: 2, fire: 0.5 },
        water: { fire: 2, grass: 0.5, ground: 2, water: 0.5 },
        grass: { water: 2, fire: 0.5, ground: 2, grass: 0.5 },
        electric: { water: 2, grass: 0.5, flying: 2, electric: 0.5 },
        ice: { grass: 2, fire: 0.5, dragon: 2, ice: 0.5 },
        psychic: { psychic: 0.5, dark: 0.5 },
        dragon: { dragon: 2 },
        fairy: { dragon: 2, dark: 2, fire: 0.5 }
    },

    startBattle(playerPet, enemyPet) {
        this.active = true;
        this.playerPet = { ...playerPet };
        this.enemyPet = { ...enemyPet };
        this.battleLog = [];
        
        // Determine who goes first by speed
        const playerSpeed = this.playerPet.stats.speed;
        const enemySpeed = this.enemyPet.stats.speed;
        this.isPlayerTurn = playerSpeed >= enemySpeed;
        
        this.addLog(`Battle started! ${this.getPetName(this.playerPet)} vs ${this.getPetName(this.enemyPet)}`);
        if (!this.isPlayerTurn) {
            this.addLog("Enemy attacks first!");
        }
        
        UIManager.updateBattleScreen();
        
        // If enemy goes first, execute their attack
        if (!this.isPlayerTurn) {
            setTimeout(() => this.enemyTurn(), 1000);
        }
    },

    getPetName(pet) {
        const template = PetTypes[pet.typeId];
        return template.evolution[0];
    },

    getTypeEffectiveness(attackerType, defenderType) {
        const effectiveness = this.typeEffectiveness[attackerType];
        if (!effectiveness) return 1;
        return effectiveness[defenderType] || 1;
    },

    calculateDamage(attacker, defender) {
        const attackerTemplate = PetTypes[attacker.typeId];
        const defenderTemplate = PetTypes[defender.typeId];
        
        const attack = attacker.stats.attack;
        const defense = defender.stats.defense;
        const special = attacker.stats.special;
        
        // Use higher of attack or special
        const offensiveStat = Math.max(attack, special);
        
        // Prevent division by zero
        const safeDefense = Math.max(1, defense);
        let damage = Math.floor((offensiveStat * 40) / safeDefense);
        
        // Type effectiveness
        const typeMult = this.getTypeEffectiveness(attackerTemplate.type, defenderTemplate.type);
        damage = Math.floor(damage * typeMult);
        
        // Critical hit (10% chance, increased by speed)
        const critChance = 0.1 + (attacker.stats.speed / 500);
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            damage = Math.floor(damage * 1.5);
        }
        
        // Random variance (0.85-1.0)
        damage = Math.floor(damage * (0.85 + Math.random() * 0.15));
        
        // Reduce all damage by 75% for fairer battles
        damage = Math.floor(damage * 0.25);
        
        return { damage, isCrit, typeMult };
    },

    playerTurn() {
        if (!this.active || !this.isPlayerTurn) return;
        
        this.attack(this.playerPet, this.enemyPet, true);
        
        if (this.enemyPet.currentHP <= 0) {
            this.endBattle(true);
            return;
        }
        
        this.isPlayerTurn = false;
        UIManager.updateBattleScreen();
        
        // Enemy attacks after delay
        setTimeout(() => this.enemyTurn(), 1000);
    },
    
    enemyTurn() {
        if (!this.active || this.isPlayerTurn) return;
        
        this.attack(this.enemyPet, this.playerPet, false);
        
        if (this.playerPet.currentHP <= 0) {
            this.endBattle(false);
            return;
        }
        
        this.isPlayerTurn = true;
        UIManager.updateBattleScreen();
    },

    attack(attacker, defender, isPlayerAttacker) {
        const result = this.calculateDamage(attacker, defender);
        defender.currentHP = Math.max(0, defender.currentHP - result.damage);
        
        const attackerName = this.getPetName(attacker);
        const defenderName = this.getPetName(defender);
        
        let logText = `${attackerName} deals ${result.damage} damage to ${defenderName}`;
        if (result.isCrit) logText += " (CRITICAL!)";
        if (result.typeMult > 1) logText += " (Super effective!)";
        if (result.typeMult < 1) logText += " (Not very effective)";
        
        this.addLog(logText);
        UIManager.updateBattleScreen();
    },

    addLog(text) {
        this.battleLog.unshift({ text, time: new Date().toLocaleTimeString() });
        if (this.battleLog.length > 20) this.battleLog.pop();
    },

    endBattle(playerWon) {
        this.active = false;
        
        const xpReward = this.enemyPet.level * 20;
        const moneyReward = this.enemyPet.level * 20;
        
        if (playerWon) {
            this.petsDefeated =  this.petsDefeated + 1
            console.log(this.petsDefeated)
            this.addLog(`🎉 Victory! +${xpReward} XP, +${moneyReward} Gold`);
            
            // Update actual player pet
            const actualPet = PetManager.pets.find(p => String(p.id) === String(this.playerPet.id));
            if (actualPet) {
                const oldMaxHP = PetManager.calculateMaxHP(PetTypes[actualPet.typeId], actualPet.level);
                const hpPercent = this.playerPet.currentHP / oldMaxHP;
                PetManager.gainXP(actualPet, xpReward);
                const newMaxHP = PetManager.calculateMaxHP(PetTypes[actualPet.typeId], actualPet.level);
                actualPet.currentHP = Math.floor(newMaxHP * hpPercent);
            }
            
            Economy.money += moneyReward;
        } else {
            this.addLog(`💀 Defeat! Your pet needs healing...`);
            
            // Update actual player pet
            const actualPet = PetManager.pets.find(p => String(p.id) === String(this.playerPet.id));
            if (actualPet) {
                actualPet.currentHP = Math.floor(actualPet.currentHP / 2);
            }
        }
        
        DataManager.save();
        UIManager.updateBattleScreen();
    },

    tryCatch(wildPet) {
        const catchRate = (1 - (wildPet.currentHP / PetManager.calculateMaxHP(PetTypes[wildPet.typeId], wildPet.level))) * 0.5 + 0.1;
        
        // Check for catch items
        let ballPower = 1;
        if (Economy.inventory.ultraBall > 0) {
            Economy.inventory.ultraBall--;
            ballPower = 2.5;
        } else if (Economy.inventory.greatBall > 0) {
            Economy.inventory.greatBall--;
            ballPower = 1.5;
        } else if (Economy.inventory.basicBall > 0) {
            Economy.inventory.basicBall--;
        } else {
            return { success: false, reason: "No catch balls!" };
        }
        
        const finalChance = Math.min(0.9, catchRate * ballPower);
        const success = Math.random() < finalChance;
        
        if (success && PetManager.pets.length < PetManager.maxPartySize) {
            PetManager.pets.push(wildPet);
            DataManager.save();
            return { success: true, reason: "Caught!" };
        } else if (success) {
            return { success: false, reason: "Party is full!" };
        } else {
            return { success: false, reason: "It broke free!" };
        }
    }
};

// ==================== TRAINING SYSTEM ====================
const TrainingSystem = {
    running: false,
    markerPos: 0,
    direction: 1,
    animId: null,
    sessionXP: 0,
    missCount: 0,
    speed: 0.7,
    maxMisses: 3,
    trainingType: "general", // general, power, defense, speed, special

    startTraining(type = "general") {
        this.trainingType = type;
        this.sessionXP = 0;
        this.missCount = 0;
        this.speed = 0.7;
        this.running = true;
        this.markerPos = 0;
        this.direction = 1;

        UIManager.updateTrainingScreen();
        this.startLoop();
    },

    startLoop() {
        this.running = true;
        const marker = document.getElementById("marker");
        
        const loop = () => {
            if (!this.running) return;
            
            this.markerPos += this.direction * this.speed;
            
            if (this.markerPos >= 100) { this.markerPos = 100; this.direction = -1; }
            if (this.markerPos <= 0) { this.markerPos = 0; this.direction = 1; }
            
            marker.style.left = this.markerPos + "%";
            this.animId = requestAnimationFrame(loop);
        };
        
        loop();
    },

    stop() {
        if (!this.running) return;
        
        this.running = false;
        cancelAnimationFrame(this.animId);
        
        let xp = 0;
        let text = "";
        
        if (this.markerPos >= 47 && this.markerPos <= 53) {
            xp = 50;
            text = "🌟 PERFECT +50";
            this.speed += 0.08;
        } else if (this.markerPos >= 32 && this.markerPos <= 68) {
            xp = 20;
            text = "✅ GOOD +20";
            this.speed += 0.05;
        } else {
            xp = 0;
            this.missCount++;
            text = `❌ MISS (${this.missCount}/${this.maxMisses})`;
            this.speed = Math.max(0.5, this.speed - 0.03);
        }
        
        this.sessionXP += xp;
        
        UIManager.updateTrainingScreen(text);
        
        if (this.missCount >= this.maxMisses) {
            this.completeTraining();
        } else {
            setTimeout(() => this.startLoop(), 200);
        }
    },

    completeTraining() {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        
        let message = "";
        
        // Apply stat boosts based on training type (no XP for stat training)
        switch (this.trainingType) {
            case "power":
                const attackBoost = Math.floor(this.sessionXP / 40);
                pet.stats.attack += attackBoost;
                message = `Power Training Complete!\nAttack +${attackBoost}`;
                break;
            case "defense":
                const defenseBoost = Math.floor(this.sessionXP / 40);
                pet.stats.defense += defenseBoost;
                message = `Defense Training Complete!\nDefense +${defenseBoost}`;
                break;
            case "speed":
                const speedBoost = Math.floor(this.sessionXP / 40);
                pet.stats.speed += speedBoost;
                message = `Speed Training Complete!\nSpeed +${speedBoost}`;
                break;
            case "special":
                const specialBoost = Math.floor(this.sessionXP / 40);
                pet.stats.special += specialBoost;
                message = `Special Training Complete!\nSpecial +${specialBoost}`;
                break;
            default:
                // General training grants XP for leveling
                PetManager.gainXP(pet, this.sessionXP);
                message = `Training Complete!\nXP Earned: ${this.sessionXP}`;
        }
        
        pet.lastTraining = Date.now();
        
        DataManager.save();
        
        setTimeout(() => {
            alert(message);
            UIManager.showScreen("petScreen");
            UIManager.updatePetScreen();
            UIManager.renderPets(); // Refresh main screen to show updated stats/XP
        }, 300);
    },

    canTrain(pet) {
        if (!pet.lastTraining) return true;
        const cooldown = 1 * 60 * 1000; // 1 minute
        return Date.now() - pet.lastTraining > cooldown;
    },

    getCooldownRemaining(pet) {
        if (!pet.lastTraining) return 0;
        const cooldown = 1 * 60 * 1000;
        const remaining = cooldown - (Date.now() - pet.lastTraining);
        return Math.max(0, Math.ceil(remaining / 1000));
    }
};

// ==================== GAME STATE ====================
const Game = {
    hasStarter: false,

    init() {
        DataManager.load();
        UIManager.init();
        UIManager.updateCurrency();
        
        if (!this.hasStarter) {
            UIManager.renderStarterSelection();
            UIManager.showScreen("starterScreen");
        } else {
            UIManager.showScreen("mainScreen");
            UIManager.renderPets();
        }
    },

    selectStarter(typeId) {
        const pet = PetManager.createPet(typeId, 5);
        PetManager.pets.push(pet);
        PetManager.selectedPet = pet;
        this.hasStarter = true;
        DataManager.save();
        
        UIManager.showScreen("mainScreen");
        UIManager.renderPets();
    }
};

// ==================== UI MANAGER ====================
const UIManager = {
    init() {
        // Setup event listeners
        document.getElementById("stopBtn").addEventListener("click", () => TrainingSystem.stop());
    },

    showScreen(screenId) {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById(screenId).classList.add("active");
        
        // Render content when showing specific screens
        if (screenId === "shopScreen") {
            this.renderShop();
        }
        if (screenId === "explorationScreen") {
            this.renderExploration();
        }
        if (screenId === "inventoryScreen") {
            this.renderInventory();
        }
    },

    updateCurrency() {
        document.getElementById("currencyDisplay").innerHTML = `💰 <span>${Economy.money}</span>`;
    },

    // Starter Screen
    renderStarterSelection() {
        const grid = document.getElementById("starterGrid");
        grid.innerHTML = "";
        
        Starters.forEach(typeId => {
            const template = PetTypes[typeId];
            const card = document.createElement("div");
            card.className = "starterCard";
            card.innerHTML = `
                <div style="font-size: 3rem">${template.emoji}</div>
                <h3>${template.name}</h3>
                <span class="typeBadge type-${template.type}">${template.type.toUpperCase()}</span>
                <p style="font-size: 0.85rem; margin-top: 10px">${template.ability}</p>
            `;
            card.onclick = () => Game.selectStarter(typeId);
            grid.appendChild(card);
        });
    },

    // Main Screen
    renderPets() {
        const list = document.getElementById("petList");
        list.innerHTML = "";
        
        document.getElementById("partyCount").innerText = PetManager.pets.length;
        
        PetManager.pets.forEach(pet => {
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const maxHP = PetManager.calculateMaxHP(template, pet.level);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            const xpNeeded = PetManager.xpNeeded(pet.level);
            const xpPercent = (pet.xp / xpNeeded) * 100;
            
            const card = document.createElement("div");
            card.className = "petCard";
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}</h3>
                <span class="typeBadge type-${template.type}">${template.type.toUpperCase()}</span>
                <div class="stat">Level ${pet.level}</div>
                
                <div class="hpBar">
                    <div class="hpFill" style="width: ${hpPercent}%"></div>
                </div>
                <div class="stat">HP ${pet.currentHP}/${maxHP}</div>
                
                <div class="xpBar">
                    <div class="xpFill" style="width: ${xpPercent}%"></div>
                </div>
                <div class="stat">XP ${pet.xp}/${xpNeeded}</div>
                
                <button onclick="UIManager.selectPet('${pet.id}')">Select</button>
                <button onclick="UIManager.sellPet('${pet.id}')">Sell (${pet.level * 25}💰)</button>
            `;
            list.appendChild(card);
        });
    },

    selectPet(id) {
        PetManager.selectPet(id);
        this.updatePetScreen();
        this.showScreen("petScreen");
    },

    sellPet(id) {
        const pet = PetManager.pets.find(p => String(p.id) === String(id));
        if (!pet) return;
        
        if (confirm(`Sell ${PetTypes[pet.typeId].name} for ${pet.level * 25} gold?`)) {
            Economy.sellPet(pet);
            DataManager.save();
            this.renderPets();
            this.updateCurrency();
        }
    },

    // Pet Detail Screen
    updatePetScreen() {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        
        const template = PetTypes[pet.typeId];
        const evolution = PetManager.getEvolution(pet);
        const maxHP = PetManager.calculateMaxHP(template, pet.level);
        const xpNeeded = PetManager.xpNeeded(pet.level);
        
        document.getElementById("petTitle").innerText = template.name;
        document.getElementById("petEvolution").innerText = `${template.emoji} ${evolution}`;
        document.getElementById("petLevel").innerText = `Level ${pet.level}`;
        document.getElementById("petXP").innerText = `XP ${pet.xp}/${xpNeeded}`;
        document.getElementById("petXPFill").style.width = (pet.xp / xpNeeded) * 100 + "%";
        
        document.getElementById("petStats").innerHTML = `
            <span class="typeBadge type-${template.type}">${template.type.toUpperCase()}</span>
            <br><br>
            <div class="stat">HP: ${pet.currentHP}/${maxHP}</div>
            <div class="stat">Attack: ${pet.stats.attack}</div>
            <div class="stat">Defense: ${pet.stats.defense}</div>
            <div class="stat">Speed: ${pet.stats.speed}</div>
            <div class="stat">Special: ${pet.stats.special}</div>
            <br>
            <div class="stat" style="font-size: 0.85rem">Ability: ${template.ability}</div>
        `;
        
        const canTrain = TrainingSystem.canTrain(pet);
        const cooldown = TrainingSystem.getCooldownRemaining(pet);
        const trainBtn = document.getElementById("trainBtn");
        trainBtn.disabled = !canTrain;
        trainBtn.innerText = canTrain ? "🎯 Train" : `⏳ ${cooldown}s`;
    },

    // Training Screen
    openTraining(type = "general") {
        TrainingSystem.startTraining(type);
        this.showScreen("trainingScreen");
    },

    updateTrainingScreen(resultText = "") {
        document.getElementById("sessionXP").innerText = `Session XP: ${TrainingSystem.sessionXP}`;
        document.getElementById("misses").innerText = `Misses: ${TrainingSystem.missCount}/${TrainingSystem.maxMisses}`;
        if (resultText) {
            document.getElementById("trainResult").innerText = resultText;
        }
    },

    // Exploration Screen
    renderExploration() {
        const grid = document.getElementById("zoneGrid");
        grid.innerHTML = "";
        
        for (const [zoneId, zone] of Object.entries(Exploration.zones)) {
            const cooldown = Exploration.getCooldownRemaining(zoneId);
            const card = document.createElement("div");
            card.className = `zoneCard ${cooldown > 0 ? "exploring" : ""}`;
            card.innerHTML = `
                <div style="font-size: 2.5rem">${zone.emoji}</div>
                <h3>${zone.name}</h3>
                <p style="font-size: 0.85rem">Encounter Rate: ${(zone.encounterRate * 100).toFixed(0)}%</p>
                ${cooldown > 0 ? `<p style="color: #ff6b6b">Cooldown: ${cooldown}s</p>` : ""}
            `;
            
            if (cooldown === 0) {
                card.onclick = () => this.exploreZone(zoneId);
            }
            
            grid.appendChild(card);
        }
    },

    exploreZone(zoneId) {
        if (!PetManager.selectedPet) {
            alert("Select a pet first!");
            return;
        }
        
        const result = Exploration.explore(zoneId);
        this.renderExploration();
        
        if (result) {
            // Start battle with wild pet
            BattleSystem.enemyPet = result.pet;
            BattleSystem.playerPet = { ...PetManager.selectedPet };
            BattleSystem.startBattle(BattleSystem.playerPet, BattleSystem.enemyPet);
            this.showScreen("battleScreen");
        } else {
            alert("Nothing found this time...");
        }
    },

    // Battle Screen
    updateBattleScreen() {
        const player = BattleSystem.playerPet;
        const enemy = BattleSystem.enemyPet;
        
        if (!player || !enemy) return;
        
        const playerTemplate = PetTypes[player.typeId];
        const enemyTemplate = PetTypes[enemy.typeId];
        const playerMaxHP = PetManager.calculateMaxHP(playerTemplate, player.level);
        const enemyMaxHP = PetManager.calculateMaxHP(enemyTemplate, enemy.level);
        
        document.getElementById("playerPetSprite").innerText = playerTemplate.emoji;
        document.getElementById("enemyPetSprite").innerText = enemyTemplate.emoji;
        document.getElementById("playerPetName").innerText = PetManager.getEvolution(player);
        document.getElementById("enemyPetName").innerText = PetManager.getEvolution(enemy);
        
        document.getElementById("playerHPFill").style.width = (player.currentHP / playerMaxHP) * 100 + "%";
        document.getElementById("enemyHPFill").style.width = (enemy.currentHP / enemyMaxHP) * 100 + "%";
        document.getElementById("playerHPText").innerText = `${player.currentHP}/${playerMaxHP}`;
        document.getElementById("enemyHPText").innerText = `${enemy.currentHP}/${enemyMaxHP}`;
        
        // Update battle log
        const log = document.getElementById("battleLog");
        log.innerHTML = BattleSystem.battleLog.map(entry => 
            `<div class="battleLogEntry">${entry.text}</div>`
        ).join("");
        
        // Update buttons based on turn
        const attackBtn = document.getElementById("attackBtn");
        const catchBtn = document.getElementById("catchBtn");
        attackBtn.disabled = !BattleSystem.isPlayerTurn;
        attackBtn.style.opacity = BattleSystem.isPlayerTurn ? "1" : "0.5";
        catchBtn.style.display = BattleSystem.active ? "inline-block" : "none";
    },

    playerAttack() {
        if (!BattleSystem.active) return;
        BattleSystem.playerTurn();
    },

    tryCatch() {
        if (!BattleSystem.active || !BattleSystem.isPlayerTurn) {
            alert("Can only catch during your turn!");
            return;
        }
        
        const result = BattleSystem.tryCatch(BattleSystem.enemyPet);
        alert(result.reason);
        
        if (result.success) {
            BattleSystem.active = false;
            this.showScreen("mainScreen");
            this.renderPets();
        }
    },

    fleeBattle() {
        if (!BattleSystem.active) return;
        
        BattleSystem.active = false;
        
        // Update actual pet HP
        const actualPet = PetManager.pets.find(p => String(p.id) === String(BattleSystem.playerPet.id));
        if (actualPet) {
            actualPet.currentHP = BattleSystem.playerPet.currentHP;
        }
        
        DataManager.save();
        this.showScreen("mainScreen");
    },

    // Shop Screen
    renderShop() {
        const grid = document.getElementById("shopGrid");
        grid.innerHTML = "";
        
        for (const [itemId, item] of Object.entries(Economy.shopItems)) {
            const card = document.createElement("div");
            card.className = "shopItem";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p style="font-size: 0.85rem">${item.type === "catch" ? "Catch Item" : "Healing Item"}</p>
                <div class="shopItemPrice">${item.price} 💰</div>
                <div>Owned: ${Economy.inventory[itemId] || 0}</div>
                <button onclick="UIManager.buyItem('${itemId}')">Buy</button>
            `;
            grid.appendChild(card);
        }
    },

    buyItem(itemId) {
        if (Economy.buyItem(itemId)) {
            DataManager.save();
            this.renderShop();
            this.updateCurrency();
        } else {
            alert("Not enough money!");
        }
    },

    // Inventory Screen
    renderInventory() {
        const grid = document.getElementById("inventoryGrid");
        grid.innerHTML = "";
        
        for (const [itemId, count] of Object.entries(Economy.inventory)) {
            if (count <= 0) continue;
            
            const item = Economy.shopItems[itemId];
            if (!item) continue; // Skip invalid items
            
            const card = document.createElement("div");
            card.className = "inventoryItem";
            card.innerHTML = `
                <div class="itemCount">${count}</div>
                <h4>${item.name}</h4>
                ${item.type === "heal" ? `<button onclick="UIManager.useItem('${itemId}')">Use</button>` : ""}
            `;
            grid.appendChild(card);
        }
    },

    useItem(itemId) {
        const pet = PetManager.selectedPet;
        if (!pet) {
            alert("Select a pet first!");
            return;
        }
        
        if (Economy.useItem(itemId, pet)) {
            DataManager.save();
            this.renderInventory();
            this.updatePetScreen();
        }
    }
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => Game.init());
