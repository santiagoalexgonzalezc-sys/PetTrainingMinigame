// ==================== DATA MANAGER ====================
const DataManager = {
    save() {
        const data = {
            pets: PetManager.pets,
            storage: PetManager.storage,
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
            PetManager.storage = data.storage || [];
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
        ability: "Alpha Hunter - Boosts attack when facing an stronger foe",
        evolution: ["Shadow Pup", "Umbra Wolf", "Nightfall Alpha"]
    },
    duskBat: {
        name: "Dusk Bat",
        emoji: "🦇",
        type: "dark",
        baseStats: { hp: 45, attack: 45, defense: 42, speed: 72, special: 55 },
        ability: "Vampiric - Heals from a fraction of damage dealt",
        evolution: ["Dusk Bat", "Night Bat", "Vampire Emperor"]
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

const Starters = ["emberFox", "aquaTurtle", "leafBunny", "boltMouse", "mindCat", "shadowWolf", "moonPixie"];

// ==================== PET MANAGER ====================
const PetManager = {
    pets: [],
    storage: [],
    selectedPet: null,
    maxPartySize: 6,
    maxTotalPets: 300,
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
        if (pet.level >= 30) return template.evolution[2];
        if (pet.level >= 15) return template.evolution[1];
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
        this.storage = this.storage.filter(p => String(p.id) !== String(id));
        if (String(this.selectedPet?.id) === String(id)) {
            this.selectedPet = this.pets[0] || null;
        }
    },

    depositPet(id) {
        const pet = this.pets.find(p => String(p.id) === String(id));
        if (!pet) return false;
        this.pets = this.pets.filter(p => String(p.id) !== String(id));
        this.storage.push(pet);
        if (String(this.selectedPet?.id) === String(id)) {
            this.selectedPet = this.pets[0] || null;
        }
        return true;
    },

    withdrawPet(storageId, partyPetIdToSwap = null) {
        const pet = this.storage.find(p => String(p.id) === String(storageId));
        if (!pet) return false;
        if (this.pets.length >= this.maxPartySize) {
            if (!partyPetIdToSwap) return false;
            const swapPet = this.pets.find(p => String(p.id) === String(partyPetIdToSwap));
            if (!swapPet) return false;
            this.pets = this.pets.filter(p => String(p.id) !== String(partyPetIdToSwap));
            this.storage.push(swapPet);
        }
        if (this.pets.length + this.storage.length >= this.maxTotalPets) {
            return false;
        }
        this.storage = this.storage.filter(p => String(p.id) !== String(storageId));
        this.pets.push(pet);
        return true;
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
            commonPets: ["leafBunny", "vineSnake", "mossBear", "glimmerMoth", "fieldDeer"],
            rarePets: ["mindCat", "dreamOwl", "moonPixie"],
            encounterRate: 1
        },
        cave: {
            name: "Cave",
            emoji: "⛰️",
            commonPets: ["scaleLizard", "sparkDog", "crystalSeal", "duskBat"],
            rarePets: ["drakeWhelp", "frostPenguin", "shadowWolf", "frostBear", "crystalWyrm"],
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
            commonPets: ["flameCat", "zapBird", "scaleLizard", "frostBear", "cloudSheep"],
            rarePets: ["drakeWhelp", "cosmicFox", "crystalWyrm"],
            encounterRate: 1
        },
        desert: {
            name: "Desert",
            emoji: "🏜️",
            commonPets: ["emberFox", "sparkDog", "scaleLizard", "cinderScorpion"],
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
            rarePets: ["drakeWhelp", "scaleLizard", "cinderScorpion"],
            encounterRate: 1
        },
        swamp: {
            name: "Swamp",
            emoji: "🐊",
            commonPets: ["mistFrog", "vineSnake", "mossBear", "glimmerMoth", "marshCroc", "shadowWolf"],
            rarePets: ["waveWhale", "dreamOwl", "frostBear"],
            encounterRate: 1
        },
        sky: {
            name: "Sky",
            emoji: "☁️",
            commonPets: ["zapBird", "boltMouse", "dreamOwl", "cloudSheep"],
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
            if (PetManager.selectPet.level < 20) {
                return Math.floor(Math.random() * 17) + 3;
            } else if (PetManager.selectedPet.level > 20) {
                return Math.floor(Math.random() * 21) + 20;
            } else {
                return Math.floor(Math.random() * 17) + 3;
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

// ==================== ABILITY SYSTEM ====================
const AbilitySystem = {
    getPassiveAbilityMultiplier(attacker) {
        const template = PetTypes[attacker.typeId];
        if (!template || !template.ability) return 1;
        
        const ability = template.ability;
        const maxHP = PetManager.calculateMaxHP(template, attacker.level);
        const hpPercent = (attacker.currentHP / maxHP) * 100;
        
        // Blaze - Fire type, HP-based damage boost
        if (ability.includes("Blaze") && template.type === "fire") {
            if (hpPercent >= 70) return 1.05;
            if (hpPercent <= 20) return 1.40;
            // Linear interpolation between 70% and 20%
            const range = 70 - 20;
            const currentRange = hpPercent - 20;
            const progress = 1 - (currentRange / range);
            const boostRange = 0.40 - 0.05;
            return 1.05 + (progress * boostRange);
        }
        
        // Overgrow - Grass type, HP-based damage boost
        if (ability.includes("Overgrow") && template.type === "grass") {
            if (hpPercent >= 70) return 1.05;
            if (hpPercent <= 20) return 1.40;
            const range = 70 - 20;
            const currentRange = hpPercent - 20;
            const progress = 1 - (currentRange / range);
            const boostRange = 0.40 - 0.05;
            return 1.05 + (progress * boostRange);
        }
        
        // Torrent - Water type, HP-based damage boost
        if (ability.includes("Torrent") && template.type === "water") {
            if (hpPercent >= 70) return 1.05;
            if (hpPercent <= 20) return 1.40;
            const range = 70 - 20;
            const currentRange = hpPercent - 20;
            const progress = 1 - (currentRange / range);
            const boostRange = 0.40 - 0.05;
            return 1.05 + (progress * boostRange);
        }
        
        return 1;
    },
    
    triggerSwitchAbility(switchingPet, enemyPet, battleSystem) {
        const template = PetTypes[switchingPet.typeId];
        if (!template || !template.ability) return;
        
        const ability = template.ability;
        
        // Intimidate - Lowers enemy attack by 1 stage
        if (ability.includes("Intimidate")) {
            battleSystem.enemyStatMods.attack = Math.min(6, battleSystem.enemyStatMods.attack - 1);
            battleSystem.addLog(`${template.name}'s Intimidate lowered enemy's attack!`);
        }
        
        // Flash Fire - Immune to Fire, boosts Fire damage when hit by Fire
        // (This would be triggered when hit by Fire, not on switch)
        
        // Water Absorb - Heals from Water moves
        // (This would be triggered when hit by Water, not on switch)
        
        // Volt Absorb - Heals from Electric moves
        // (This would be triggered when hit by Electric, not on switch)
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
        fire: { grass: 2, water: 0.5, ice: 2, fire: 0.5, dragon: 0.5, fairy: 2, dark: 1, normal: 1 },
        water: { fire: 2, grass: 0.5, ground: 2, water: 0.5, dragon: 0.5, normal: 1 },
        grass: { water: 2, fire: 0.5, ground: 2, grass: 0.5, dragon: 0.5, dark: 1, normal: 1 },
        electric: { water: 2, grass: 0.5, flying: 2, electric: 0.5, dragon: 0.5, normal: 1 },
        ice: { grass: 2, fire: 0.5, dragon: 2, ice: 0.5, fairy: 2, dark: 1, normal: 1 },
        psychic: { psychic: 0.5, dark: 0.5, fairy: 1, normal: 1 },
        dragon: { dragon: 2, fairy: 0, ice: 0.5, normal: 1 },
        dark: { psychic: 2, dark: 0.5, fairy: 0.5, ghost: 2, normal: 1 },
        fairy: { dragon: 2, dark: 2, fire: 0.5, ice: 0.5, normal: 1 },
        normal: { rock: 0.5, ghost: 0, steel: 0.5, dark: 1, fairy: 1 }
    },

    startBattle(playerPet, enemyPet) {
        this.active = true;
        this.playerPet = { ...playerPet };
        this.enemyPet = { ...enemyPet };
        this.battleLog = [];
        this.playerStatMods = { attack: 0, defense: 0, speed: 0, special: 0 };
        this.enemyStatMods = { attack: 0, defense: 0, speed: 0, special: 0 };
        
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

    switchPet(newPet) {
        // Save current pet HP
        const actualCurrentPet = PetManager.pets.find(p => String(p.id) === String(this.playerPet.id));
        if (actualCurrentPet) {
            actualCurrentPet.currentHP = this.playerPet.currentHP;
        }
        
        // Switch to new pet
        this.playerPet = { ...newPet };
        this.addLog(`${this.getPetName(this.playerPet)} was sent out!`);
        
        // Trigger switch abilities
        AbilitySystem.triggerSwitchAbility(this.playerPet, this.enemyPet, this);
        
        UIManager.updateBattleScreen();
        
        // Enemy gets their turn after switch
        this.isPlayerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    },

    getPetName(pet) {
        const template = PetTypes[pet.typeId];
        return template.evolution[0];
    },

    getTypeEffectiveness(attackerType, defenderType) {
        const effectiveness = this.typeEffectiveness[attackerType];
        if (!effectiveness) return 1;
        return effectiveness[defenderType] ?? 1;
    },

    calculateDamage(attacker, defender) {
        const attackerTemplate = PetTypes[attacker.typeId];
        const defenderTemplate = PetTypes[defender.typeId];
        
        // Apply stat modifiers
        const attackerMods = attacker === this.playerPet ? this.playerStatMods : this.enemyStatMods;
        const defenderMods = defender === this.playerPet ? this.playerStatMods : this.enemyStatMods;
        
        const attackMod = Math.pow(1.25, attackerMods.attack);
        const defenseMod = Math.pow(1.25, defenderMods.defense);
        
        const attack = Math.floor(attacker.stats.attack * attackMod);
        const defense = Math.floor(defender.stats.defense * defenseMod);
        const special = Math.floor(attacker.stats.special * Math.pow(1.25, attackerMods.special));
        
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
        
        // Apply passive ability multiplier
        const abilityMultiplier = AbilitySystem.getPassiveAbilityMultiplier(attacker);
        damage = Math.floor(damage * abilityMultiplier);
        
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
        if (result.typeMult === 0) logText = `${attackerName}'s attack had no effect on ${defenderName}!`;
        else if (result.typeMult > 1) logText += " (Super effective!)";
        else if (result.typeMult < 1) logText += " (Not very effective)";
        
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
        
        setTimeout(() => {
            UIManager.showScreen("mainScreen");
            UIManager.renderPets();
            UIManager.updateCurrency();
        }, 100);
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
        } else if (success && PetManager.pets.length + PetManager.storage.length < PetManager.maxTotalPets) {
            PetManager.storage.push(wildPet);
            DataManager.save();
            return { success: true, reason: "Caught! Sent to Pet Storage 📦." };
        } else if (success) {
            return { success: false, reason: "Storage full! (Max 300 total pets)" };
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

    startTraining() {
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
        
        const message = `Training Complete!\nXP Earned: ${this.sessionXP}`;
        
        PetManager.gainXP(pet, this.sessionXP);
        pet.lastTraining = Date.now();
        
        DataManager.save();
        
        setTimeout(() => {
            alert(message);
            UIManager.showScreen("petScreen");
            UIManager.updatePetScreen();
            UIManager.renderPets();
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
        document.querySelectorAll("[id$=Screen]").forEach(s => s.classList.add("hidden"));
        document.getElementById(screenId).classList.remove("hidden");
        
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
        if (screenId === "storageScreen") {
            this.renderStorage();
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
            card.className = "bg-white/10 rounded-2xl p-5 cursor-pointer transition-all duration-200 border-2 border-transparent hover:bg-white/12 hover:-translate-y-1";
            card.innerHTML = `
                <div class="text-5xl">${template.emoji}</div>
                <h3>${template.name}</h3>
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <p class="text-xs mt-2.5">${template.ability}</p>
            `;
            card.onclick = () => Game.selectStarter(typeId);
            grid.appendChild(card);
        });
    },

    getTypeColorClass(type) {
        const colors = {
            fire: "bg-red-400",
            water: "bg-blue-400",
            grass: "bg-green-400",
            electric: "bg-yellow-400 text-gray-900",
            psychic: "bg-purple-400",
            ice: "bg-sky-400",
            dragon: "bg-violet-400",
            dark: "bg-gray-600",
            fairy: "bg-pink-400",
            normal: "bg-gray-400 text-gray-900"
        };
        return colors[type] || "bg-gray-400 text-gray-900";
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
            card.className = "w-full max-w-md mx-auto bg-white/10 rounded-2xl p-3.5 my-2.5";
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}</h3>
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent}%"></div>
                </div>
                <div class="opacity-90 text-sm">HP ${pet.currentHP}/${maxHP}</div>
                
                <div class="w-full h-4.5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300" style="width: ${xpPercent}%"></div>
                </div>
                <div class="opacity-90 text-sm">XP ${pet.xp}/${xpNeeded}</div>
                
                <button onclick="UIManager.selectPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Select</button>
                <button onclick="UIManager.sellPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Sell (${pet.level * 25}💰)</button>
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
        const pet = PetManager.pets.find(p => String(p.id) === String(id)) ||
                    PetManager.storage.find(p => String(p.id) === String(id));
        if (!pet) return;
        
        if (confirm(`Sell ${PetTypes[pet.typeId].name} for ${pet.level * 25} gold?`)) {
            Economy.sellPet(pet);
            DataManager.save();
            this.renderPets();
            this.renderStorage();
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
            <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
            <br><br>
            <div class="opacity-90 text-sm">HP: ${pet.currentHP}/${maxHP}</div>
            <div class="opacity-90 text-sm">Attack: ${pet.stats.attack}</div>
            <div class="opacity-90 text-sm">Defense: ${pet.stats.defense}</div>
            <div class="opacity-90 text-sm">Speed: ${pet.stats.speed}</div>
            <div class="opacity-90 text-sm">Special: ${pet.stats.special}</div>
            <br>
            <div class="opacity-90 text-xs">Ability: ${template.ability}</div>
        `;
        
        const canTrain = TrainingSystem.canTrain(pet);
        const cooldown = TrainingSystem.getCooldownRemaining(pet);
        const trainBtn = document.getElementById("trainBtn");
        trainBtn.disabled = !canTrain;
        trainBtn.innerText = canTrain ? "🎯 Train" : `⏳ ${cooldown}s`;
    },

    // Training Screen
    openTraining() {
        TrainingSystem.startTraining();
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
            card.className = `bg-white/10 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/12 hover:-translate-y-1"}`;
            card.innerHTML = `
                <div class="text-5xl">${zone.emoji}</div>
                <h3>${zone.name}</h3>
                <p class="text-xs">Encounter Rate: ${(zone.encounterRate * 100).toFixed(0)}%</p>
                ${cooldown > 0 ? `<p class="text-red-400">Cooldown: ${cooldown}s</p>` : ""}
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
        document.getElementById("enemyPetLevel").innerText = `Level ${enemy.level}`;
        
        document.getElementById("playerHPFill").style.width = (player.currentHP / playerMaxHP) * 100 + "%";
        document.getElementById("enemyHPFill").style.width = (enemy.currentHP / enemyMaxHP) * 100 + "%";
        document.getElementById("playerHPText").innerText = `${player.currentHP}/${playerMaxHP}`;
        document.getElementById("enemyHPText").innerText = `${enemy.currentHP}/${enemyMaxHP}`;
        
        // Update battle log
        const log = document.getElementById("battleLog");
        log.innerHTML = BattleSystem.battleLog.map(entry => 
            `<div class="py-1 border-b border-white/10">${entry.text}</div>`
        ).join("");
        
        // Update buttons based on turn
        const attackBtn = document.getElementById("attackBtn");
        const switchBtn = document.getElementById("switchBtn");
        const catchBtn = document.getElementById("catchBtn");
        attackBtn.disabled = !BattleSystem.isPlayerTurn;
        attackBtn.style.opacity = BattleSystem.isPlayerTurn ? "1" : "0.5";
        switchBtn.disabled = !BattleSystem.isPlayerTurn;
        switchBtn.style.opacity = BattleSystem.isPlayerTurn ? "1" : "0.5";
        catchBtn.style.display = BattleSystem.active ? "inline-block" : "none";
    },

    playerAttack() {
        if (!BattleSystem.active) return;
        BattleSystem.playerTurn();
    },

    openSwitchOverlay() {
        if (!BattleSystem.active || !BattleSystem.isPlayerTurn) {
            alert("Can only switch during your turn!");
            return;
        }
        
        const grid = document.getElementById("switchGrid");
        grid.innerHTML = "";
        
        PetManager.pets.forEach(pet => {
            if (String(pet.id) === String(BattleSystem.playerPet.id)) return; // Don't show current pet
            if (pet.currentHP <= 0) return; // Don't show fainted pets
            
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const maxHP = PetManager.calculateMaxHP(template, pet.level);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all";
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}</h3>
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent}%"></div>
                </div>
                <div class="opacity-90 text-sm">HP ${pet.currentHP}/${maxHP}</div>
            `;
            card.onclick = () => {
                BattleSystem.switchPet(pet);
                this.closeSwitchOverlay();
            };
            grid.appendChild(card);
        });
        
        document.getElementById("switchOverlay").classList.remove("hidden");
    },

    closeSwitchOverlay() {
        document.getElementById("switchOverlay").classList.add("hidden");
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
            card.className = "bg-white/10 rounded-xl p-4 text-center";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p class="text-xs">${item.type === "catch" ? "Catch Item" : "Healing Item"}</p>
                <div class="text-yellow-400 font-bold my-2.5">${item.price} 💰</div>
                <div>Owned: ${Economy.inventory[itemId] || 0}</div>
                <button onclick="UIManager.buyItem('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Buy</button>
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
            card.className = "bg-white/10 rounded-xl p-4 text-center relative";
            card.innerHTML = `
                <div class="absolute top-1 right-1 bg-red-400 rounded-full w-6 h-6 text-xs leading-6">${count}</div>
                <h4>${item.name}</h4>
                ${item.type === "heal" ? `<button onclick="UIManager.useItem('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Use</button>` : ""}
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
    },

    // Pet Storage Screen
    renderStorage() {
        const grid = document.getElementById("storageGrid");
        grid.innerHTML = "";
        document.getElementById("storageCount").innerText = PetManager.storage.length;

        if (PetManager.storage.length === 0) {
            grid.innerHTML = "<p>No pets in storage yet. Catch more to fill it up!</p>";
            return;
        }

        PetManager.storage.forEach(pet => {
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const maxHP = PetManager.calculateMaxHP(template, pet.level);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            const xpNeeded = PetManager.xpNeeded(pet.level);
            const xpPercent = (pet.xp / xpNeeded) * 100;

            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center";
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}</h3>
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent}%"></div></div>
                <div class="opacity-90 text-sm">HP ${pet.currentHP}/${maxHP}</div>
                <div class="w-full h-4.5 bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300" style="width: ${xpPercent}%"></div></div>
                <div class="opacity-90 text-sm">XP ${pet.xp}/${xpNeeded}</div>
                <button onclick="UIManager.withdrawPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">↩ Withdraw</button>
                <button onclick="UIManager.sellPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Sell (${pet.level * 25}💰)</button>
            `;
            grid.appendChild(card);
        });
    },

    withdrawPet(id) {
        if (PetManager.pets.length >= PetManager.maxPartySize) {
            const names = PetManager.pets.map(p => {
                const t = PetTypes[p.typeId];
                return `${t.emoji} ${PetManager.getEvolution(p)} (Lv ${p.level})`;
            });
            const choice = prompt(
                "Your party is full! Choose a pet to swap out (enter its number):\n" +
                PetManager.pets.map((p, i) => `${i + 1}. ${names[i]}`).join("\n")
            );
            const idx = parseInt(choice, 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= PetManager.pets.length) {
                alert("Withdraw cancelled.");
                return;
            }
            const swapId = PetManager.pets[idx].id;
            PetManager.withdrawPet(id, swapId);
        } else {
            PetManager.withdrawPet(id);
        }
        DataManager.save();
        this.renderStorage();
        this.renderPets();
    },

    depositSelectedPet() {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        if (PetManager.pets.length <= 1) {
            alert("You can't deposit your last party member!");
            return;
        }
        if (confirm(`Deposit ${PetTypes[pet.typeId].name} to storage?`)) {
            PetManager.depositPet(pet.id);
            DataManager.save();
            this.showScreen("mainScreen");
            this.renderPets();
        }
    }
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => Game.init());
