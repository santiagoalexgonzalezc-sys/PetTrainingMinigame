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
            explorationCooldowns: Exploration.cooldowns,
            player: {
                level: PlayerSystem.level,
                xp: PlayerSystem.xp,
                battleStreak: PlayerSystem.battleStreak,
                bestStreak: PlayerSystem.bestStreak,
                unlockedZones: PlayerSystem.unlockedZones,
                totalBattles: PlayerSystem.totalBattles,
                totalCatches: PlayerSystem.totalCatches,
                totalTrainings: PlayerSystem.totalTrainings,
                totalExplores: PlayerSystem.totalExplores,
lastDailyBonus: PlayerSystem.lastDailyBonus,
                 dailyActivities: Array.from(PlayerSystem.dailyActivities)
             },
             maxPartySize: PetManager.maxPartySize,
            maxTotalPets: PetManager.maxTotalPets
        };
        localStorage.setItem("petSimulator", JSON.stringify(data));
    },

    load() {
        const data = JSON.parse(localStorage.getItem("petSimulator"));
        if (data) {
            PetManager.pets = data.pets || [];
            PetManager.storage = data.storage || [];
            Economy.money = data.money || 100;
            Economy.inventory = data.inventory || { basicBall: 5, potion: 3, tierStone: 0, xpOrb: 0, rareXpOrb: 0, precisionGuide: 0, focusIncense: 0, bandOfSwiftness: 0, toughCollar: 0, focusBand: 0, lifeBangle: 0, attackSunglasses: 0 };
            PetManager.pets.forEach(p => {
                if (p.prestigeLevel === undefined) p.prestigeLevel = 0;
                if (p.bonusStats === undefined) p.bonusStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (p.levelBonusStats === undefined) p.levelBonusStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (p.shiny === undefined) p.shiny = false;
                if (p.shinyBonus === undefined) p.shinyBonus = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (!Array.isArray(p.equipment)) {
                    if (p.equipment && typeof p.equipment === "string") {
                        p.equipment = [p.equipment];
                    } else {
                        p.equipment = [];
                    }
                }
                
                // Fix malformed tiers from old upgrade bug
                if (!p.tier || typeof p.tier !== "string" || p.tier.length < 2) {
                    if (p.tier && ["D","C","B","A","S"].includes(p.tier)) {
                        p.tier = p.tier + "1";
                    } else {
                        p.tier = "D1";
                    }
                }
                p.tierBonus = PetManager.calculateTierBonus(p.tier);
                const template = PetTypes[p.typeId];
                if (template) {
                    p.stats = PetManager.calculateStats(template, p.level, p);
                    const newMaxHP = PetManager.calculateMaxHP(template, p.level, p);
                    p.currentHP = Math.min(p.currentHP, newMaxHP);
                }
            });
            PetManager.storage.forEach(p => {
                if (p.prestigeLevel === undefined) p.prestigeLevel = 0;
                if (p.bonusStats === undefined) p.bonusStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (p.levelBonusStats === undefined) p.levelBonusStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (p.shiny === undefined) p.shiny = false;
                if (p.shinyBonus === undefined) p.shinyBonus = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
                if (!Array.isArray(p.equipment)) {
                    if (p.equipment && typeof p.equipment === "string") {
                        p.equipment = [p.equipment];
                    } else {
                        p.equipment = [];
                    }
                }
                
                // Fix malformed tiers from old upgrade bug
                if (!p.tier || typeof p.tier !== "string" || p.tier.length < 2) {
                    if (p.tier && ["D","C","B","A","S"].includes(p.tier)) {
                        p.tier = p.tier + "1";
                    } else {
                        p.tier = "D1";
                    }
                }
                p.tierBonus = PetManager.calculateTierBonus(p.tier);
                const template = PetTypes[p.typeId];
                if (template) {
                    p.stats = PetManager.calculateStats(template, p.level, p);
                    const newMaxHP = PetManager.calculateMaxHP(template, p.level, p);
                    p.currentHP = Math.min(p.currentHP, newMaxHP);
                }
            });
            PetManager.selectedPet = PetManager.pets.find(p => String(p.id) === String(data.selectedPet)) || null;
            Game.hasStarter = data.hasStarter || false;
            Exploration.cooldowns = data.explorationCooldowns || {};
            
            // Migration: initialize PlayerSystem if missing
            if (data.player) {
                PlayerSystem.level = data.player.level || 1;
                PlayerSystem.xp = data.player.xp || 0;
                PlayerSystem.battleStreak = data.player.battleStreak || 0;
                PlayerSystem.bestStreak = data.player.bestStreak || 0;
                PlayerSystem.unlockedZones = data.player.unlockedZones || ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh"];
                PlayerSystem.totalBattles = data.player.totalBattles || 0;
                PlayerSystem.totalCatches = data.player.totalCatches || 0;
                PlayerSystem.totalTrainings = data.player.totalTrainings || 0;
                PlayerSystem.totalExplores = data.player.totalExplores || 0;
                PlayerSystem.lastDailyBonus = data.player.lastDailyBonus || null;
                PlayerSystem.dailyActivities = new Set(Array.isArray(data.player.dailyActivities) ? data.player.dailyActivities : []);
            } else {
                PlayerSystem.level = 1;
                PlayerSystem.xp = 0;
                PlayerSystem.battleStreak = 0;
                PlayerSystem.bestStreak = 0;
                PlayerSystem.unlockedZones = ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh"];
                PlayerSystem.totalBattles = 0;
                PlayerSystem.totalCatches = 0;
                PlayerSystem.totalTrainings = 0;
                PlayerSystem.totalExplores = 0;
                PlayerSystem.lastDailyBonus = null;
                PlayerSystem.dailyActivities = new Set();
            }
            
            // Migration: restore maxPartySize and maxTotalPets from save or defaults
            PetManager.maxPartySize = data.maxPartySize || 6;
            PetManager.maxTotalPets = data.maxTotalPets || 300;
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
        baseStats: { hp: 65, attack: 52, defense: 43, speed: 65, special: 60 },
        passive: "Blaze - Low HP increases Fire damage",
        ability: {
            name: "Fireball",
            type: "fire",
            cooldown: 2,
            description: "Deals based on special + 5 flat. Leaves the opponent burning for the rest of the battle (25% of initial damage per turn).",
            burn: true
        },
        evolution: ["Ember Fox", "Inferno Fox", "Phoenix Lord"]
    },
    flameCat: {
        name: "Flame Cat",
        emoji: "🐱",
        type: "fire",
        baseStats: { hp: 68, attack: 55, defense: 40, speed: 60, special: 55 },
        passive: "Intimidate - Lowers enemy attack by 1 stage on switch in",
        ability: {
            name: "Ember Surge",
            type: "fire",
            cooldown: 3,
            description: "Hits with fire power + 3 flat. Burns the enemy (25% of initial dmg/turn for 3 turns).",
            burn: true,
            burnDuration: 3
        },
        evolution: ["Flame Cat", "Blaze Cat", "Magma Tiger"]
    },
    sparkDog: {
        name: "Spark Dog",
        emoji: "🐶",
        type: "fire",
        baseStats: { hp: 70, attack: 50, defense: 45, speed: 55, special: 50 },
        passive: "Kindling Core - Immune to Fire; absorbs Fire moves for a 1.15x Fire power boost",
        evolution: ["Spark Dog", "Fire Hound", "Inferno Wolf"]
    },
    cinderHawk: {
        name: "Cinder Hawk",
        emoji: "🦅",
        type: "fire",
        baseStats: { hp: 68, attack: 58, defense: 42, speed: 62, special: 58 },
        passive: "Meltdown - Fire damage increases by 1.25x when HP drops below 25%",
        evolution: ["Ember Hawk", "Cinder Hawk", "Solar Phoenix"]
    },

    // Water Types
    aquaTurtle: {
        name: "Aqua Turtle",
        emoji: "🐢",
        type: "water",
        baseStats: { hp: 75, attack: 40, defense: 65, speed: 35, special: 50 },
        passive: "Tide Pools - Heals 3% max HP each turn; healing doubles in rain",
        evolution: ["Aqua Turtle", "Hydro Turtle", "Ocean Guardian"]
    },
    mistFrog: {
        name: "Mist Frog",
        emoji: "🐸",
        type: "water",
        baseStats: { hp: 70, attack: 45, defense: 50, speed: 55, special: 55 },
        passive: "Misty Agility - Speed doubles in rain; Water moves gain 10% accuracy",
        evolution: ["Mist Frog", "Storm Frog", "Tidal King"]
    },
    waveWhale: {
        name: "Wave Whale",
        emoji: "🐋",
        type: "water",
        baseStats: { hp: 80, attack: 45, defense: 55, speed: 40, special: 60 },
        passive: "Aqua Vein - Absorbs Water moves; converts 50% of absorbed damage into HP",
        evolution: ["Wave Whale", "Tsunami Whale", "Leviathan"]
    },
    tidalCrab: {
        name: "Tidal Crab",
        emoji: "🦀",
        type: "water",
        baseStats: { hp: 70, attack: 55, defense: 60, speed: 38, special: 48 },
        passive: "Riptide - Water damage increases by 50% when HP is below 25%",
        evolution: ["Tide Crab", "Tidal Crab", "Abyssal Crustacean"]
    },

    // Fire Type
    cinderCrab: {
        name: "Cinder Crab",
        emoji: "🦀",
        type: "fire",
        baseStats: { hp: 65, attack: 60, defense: 52, speed: 40, special: 50 },
        passive: "Molten Shell - Contact attackers take Fire damage equal to 8% of their max HP",
        evolution: ["Ash Claw", "Cinder Crab", "Magma Guardian"]
    },
    // Grass Types
    leafBunny: {
        name: "Leaf Bunny",
        emoji: "🐰",
        type: "grass",
        baseStats: { hp: 65, attack: 50, defense: 45, speed: 70, special: 45 },
        passive: "Bloom Burst - Grass damage increases by 40% when HP is below 25%",
        evolution: ["Leaf Bunny", "Forest Bunny", "Nature Spirit"]
    },
    vineSnake: {
        name: "Vine Snake",
        emoji: "🐍",
        type: "grass",
        baseStats: { hp: 68, attack: 55, defense: 40, speed: 60, special: 50 },
        passive: "Photosynthetic Surge - Speed doubles in sunlight; vine lashes slow the enemy",
        ability: {
            name: "Vine Lash",
            type: "grass",
            cooldown: 2,
            description: "Deals grass-based special damage and reduces the enemy's speed by 1 stage.",
            speedDrop: true
        },
        evolution: ["Vine Snake", "Thorn Snake", "Jungle Serpent"]
    },
    mossBear: {
        name: "Moss Bear",
        emoji: "🐻",
        type: "grass",
        baseStats: { hp: 80, attack: 55, defense: 50, speed: 35, special: 45 },
        passive: "Dense Fur - Reduces Fire and Ice damage by 30%",
        evolution: ["Moss Bear", "Forest Bear", "Earth Guardian"]
    },
    thornHog: {
        name: "Thorn Hog",
        emoji: "🦔",
        type: "grass",
        baseStats: { hp: 75, attack: 60, defense: 48, speed: 45, special: 45 },
        passive: "Overgrow - Low HP increases Grass damage",
        evolution: ["Bramble Pig", "Thorn Hog", "Verdant Behemoth"]
    },

    // Electric Types
    boltMouse: {
        name: "Bolt Mouse",
        emoji: "🐭",
        type: "electric",
        baseStats: { hp: 60, attack: 45, defense: 40, speed: 80, special: 55 },
        passive: "Fast feet - 10% of  dodging an attack",
        ability: {
            name: "Electric Ball",
            type: "electric",
            cooldown: 2,
            description: "Paralizes enemy, making them lose their turn"
        },
        evolution: ["Bolt Mouse", "Volt Mouse", "Thunder Lord"]
    },
    shockEel: {
        name: "Shock Eel",
        emoji: "🐟",
        type: "electric",
        baseStats: { hp: 70, attack: 50, defense: 45, speed: 65, special: 50 },
        passive: "Volt Absorb - Heals from Electric moves",
        evolution: ["Shock Eel", "Storm Eel", "Lightning Serpent"]
    },
    zapBird: {
        name: "Zap Bird",
        emoji: "🐦",
        type: "electric",
        baseStats: { hp: 65, attack: 48, defense: 42, speed: 70, special: 55 },
        passive: "Motor Drive - Speed boosts from Electric moves",
        evolution: ["Zap Bird", "Storm Bird", "Thunder Hawk"]
    },
    voltageOx: {
        name: "Voltage Ox",
        emoji: "🐂",
        type: "electric",
        baseStats: { hp: 72, attack: 58, defense: 50, speed: 45, special: 48 },
        passive: "Static - Paralyzes on contact",
        evolution: ["Spark Calf", "Voltage Ox", "Thunder Beast"]
    },

    // Psychic Types
    mindCat: {
        name: "Mind Cat",
        emoji: "😺",
        type: "psychic",
        baseStats: { hp: 65, attack: 40, defense: 45, speed: 60, special: 70 },
        passive: "Synchronize - Shares burn/burning/bleeding status with attacker on contact",
        ability: {
            name: "Psychic Burst",
            type: "psychic",
            cooldown: 2,
            description: "Deals special-based damage. 30% chance to confuse the enemy (skip their next turn).",
            confuse: true,
            confuseChance: 0.30
        },
        evolution: ["Mind Cat", "Psi Cat", "Telepath Master"]
    },
    dreamOwl: {
        name: "Dream Owl",
        emoji: "🦉",
        type: "psychic",
        baseStats: { hp: 70, attack: 42, defense: 48, speed: 55, special: 65 },
        passive: "Lucid Mind - Cannot be put to sleep or confused; Nightmare causes enemies to skip turns",
        ability: {
            name: "Hypnosis",
            type: "psychic",
            cooldown: 3,
            description: "Deals psychic special damage. 50% chance to put the enemy to sleep (skip their next turn).",
            confuse: true,
            confuseChance: 0.50
        },
        evolution: ["Dream Owl", "Night Owl", "Vision Sage"]
    },
    cosmicFox: {
        name: "Cosmic Fox",
        emoji: "🦊",
        type: "psychic",
        baseStats: { hp: 68, attack: 45, defense: 42, speed: 65, special: 68 },
        passive: "Magic Guard - Only takes direct damage",
        evolution: ["Cosmic Fox", "Star Fox", "Galaxy Lord"]
    },
    mindApe: {
        name: "Mind Ape",
        emoji: "🙉",
        type: "psychic",
        baseStats: { hp: 68, attack: 45, defense: 45, speed: 58, special: 68 },
        passive: "Magic Guard - Only takes direct damage",
        evolution: ["Thought Chimp", "Mind Ape", "Enlightened Sage"]
    },

    // Ice Types
    frostPenguin: {
        name: "Frost Penguin",
        emoji: "🐧",
        type: "ice",
        baseStats: { hp: 72, attack: 48, defense: 50, speed: 45, special: 55 },
        passive: "Snow Cloak - Evasion in snow",
        evolution: ["Frost Penguin", "Glacier Penguin", "Ice Emperor"]
    },
    crystalSeal: {
        name: "Crystal Seal",
        emoji: "🦭",
        type: "ice",
        baseStats: { hp: 75, attack: 45, defense: 55, speed: 40, special: 50 },
        passive: "Ice Body - Heals 5% max HP each turn",
        ability: {
            name: "Aurora Guard",
            type: "ice",
            cooldown: 2,
            description: "Deals ice damage and shields the user for 2 turns (blocks 30% of incoming damage).",
            shield: true,
            shieldDuration: 2,
            shieldPercent: 0.30
        },
        evolution: ["Crystal Seal", "Diamond Seal", "Frost Guardian"]
    },
    
    // Dragon Types
    scaleLizard: {
        name: "Scale Lizard",
        emoji: "🦎",
        type: "dragon",
        baseStats: { hp: 70, attack: 55, defense: 45, speed: 50, special: 50 },
        passive: "Rough Skin - Damages attackers",
        evolution: ["Scale Lizard", "Dragon Lizard", "Wyvern King"]
    },
    drakeWhelp: {
        name: "Drake Whelp",
        emoji: "🐉",
        type: "dragon",
        baseStats: { hp: 75, attack: 60, defense: 50, speed: 45, special: 55 },
        passive: "Multiscale - Reduces damage taken by 25% when at full HP",
        ability: {
            name: "Dragon Rampage",
            type: "dragon",
            cooldown: 3,
            description: "High-risk/high-reward attack. Deals 2x damage at 50% chance, or 0.5x damage at 50% chance.",
            rampage: true,
            critChance: 0.5
        },
        evolution: ["Drake Whelp", "Storm Drake", "Dragon Emperor"]
    },

    // Fire Type
    cinderScorpion: {
        name: "Cinder Scorpion",
        emoji: "🦂",
        type: "fire",
        baseStats: { hp: 68, attack: 60, defense: 52, speed: 55, special: 50 },
        passive: "Scorpion Sting - Contact attacks have a 25% chance to inflict burn",
        evolution: ["Spark Tail", "Cinder Scorpion", "Inferno Stinger"]
    },

    // Ice Type
    frostBear: {
        name: "Frost Bear",
        emoji: "🐻‍❄️",
        type: "ice",
        baseStats: { hp: 85, attack: 58, defense: 55, speed: 35, special: 50 },
        passive: "Slush Rush - Speed doubles in hail",
        evolution: ["Ice Cub", "Frost Bear", "Tundra King"]
    },
    glacierFox: {
        name: "Glacier Fox",
        emoji: "🦊",
        type: "ice",
        baseStats: { hp: 70, attack: 48, defense: 48, speed: 60, special: 55 },
        passive: "Snow Cloak - Evasion in snow",
        evolution: ["Frost Kit", "Glacier Fox", "Permafrost Spirit"]
    },

    // Dragon Types
    crystalWyrm: {
        name: "Crystal Wyrm",
        emoji: "🐉",
        type: "dragon",
        baseStats: { hp: 75, attack: 58, defense: 52, speed: 50, special: 62 },
        passive: "Levitate - Immune to ground moves",
        evolution: ["Shard Hatchling", "Crystal Wyrm", "Geode Leviathan"]
    },
    marshCroc: {
        name: "Marsh Croc",
        emoji: "🐊",
        type: "dragon",
        baseStats: { hp: 80, attack: 64, defense: 55, speed: 42, special: 48 },
        passive: "Strong Jaw - Boosts bite moves",
        evolution: ["Mud Wader", "Marsh Croc", "Bog Tyrant"]
    },

    // Dark Types (NEW)
    shadowWolf: {
        name: "Shadow Wolf",
        emoji: "🐺",
        type: "dark",
        baseStats: { hp: 70, attack: 55, defense: 45, speed: 62, special: 60 },
        passive: "Alpha Hunter - Boosts attack when facing an stronger foe. Deals 1.5x damage if foe has higher total power. Bleeding Claw (Ability) - Leaves the enemy bleeding for the rest of the battle.",
        ability: {
            name: "Bleeding Claw",
            type: "normal",
            cooldown: 3,
            description: "Deals based on special stat. Leaves the opponent bleeding for the rest of the battle (25% of initial damage per turn).",
            bleed: true
        },
        evolution: ["Shadow Pup", "Alpha Wolf", "Solo hunter"]
    },
    duskBat: {
        name: "Dusk Bat",
        emoji: "🦇",
        type: "dark",
        baseStats: { hp: 65, attack: 55, defense: 42, speed: 72, special: 55 },
        passive: "Sanguine Drain - Heals a portion of damage dealt back as HP; Dark moves amplify at low HP",
        ability: {
            name: "Life Drain",
            type: "dark",
            cooldown: 2,
            description: "Deals dark-based special damage and heals the user for 25% of the damage dealt.",
            heal: true,
            healPercent: 0.50
        },
        evolution: ["Dusk Bat", "Night Bat", "Vampire Emperor"]
    },

    // Fairy Types (NEW)
    moonPixie: {
        name: "Moon Pixie",
        emoji: "🦄",
        type: "fairy",
        baseStats: { hp: 68, attack: 42, defense: 48, speed: 60, special: 75 },
        passive: "Magic Guard - Only takes direct damage, ignores burn/bleed debuffs",
        ability: {
            name: "Moonbeam Heal",
            type: "fairy",
            cooldown: 2,
            description: "Deals fairy damage and heals user for 30% of damage dealt.",
            heal: true,
            healPercent: 0.30
        },
        evolution: ["Star Fawn", "Moon Pixie", "Astral Spirit"]
    },
    glimmerMoth: {
        name: "Glimmer Moth",
        emoji: "🦋",
        type: "fairy",
        baseStats: { hp: 62, attack: 40, defense: 45, speed: 72, special: 65 },
        passive: "Shield Dust - Blocks secondary move effects",
        evolution: ["Dust Wisp", "Glimmer Moth", "Prism Sovereign"]
    },
    sunstoneBeetle: {
        name: "Sunstone Beetle",
        emoji: "🪲",
        type: "fairy",
        baseStats: { hp: 64, attack: 42, defense: 48, speed: 65, special: 62 },
        passive: "Shield Dust - Blocks secondary move effects",
        evolution: ["Glow Grub", "Sunstone Beetle", "Aurora Scarab"]
    },

    // Normal Types (NEW)
    cloudSheep: {
        name: "Cloud Sheep",
        emoji: "🐑",
        type: "normal",
        baseStats: { hp: 82, attack: 42, defense: 58, speed: 38, special: 50 },
        passive: "Cotton Cloud - Contact damage halved; special damage reduced by 25%",
        ability: {
            name: "Fluffy Guard",
            type: "normal",
            cooldown: 2,
            description: "Deals normal special damage and shields the user for 1 turn (blocks 50% of incoming damage).",
            shield: true,
            shieldDuration: 1,
            shieldPercent: 0.50
        },
        evolution: ["Wool Lamb", "Cloud Sheep", "Sky Shepherd"]
    },
    fieldDeer: {
        name: "Field Deer",
        emoji: "🦌",
        type: "normal",
        baseStats: { hp: 70, attack: 48, defense: 45, speed: 62, special: 50 },
        passive: "Run Away - Guaranteed to flee wild battles",
        evolution: ["Spotted Fawn", "Field Deer", "Forest Monarch"]
    },
    duneLion: {
        name: "Dune Lion",
        emoji: "🦁",
        type: "normal",
        baseStats: { hp: 75, attack: 60, defense: 48, speed: 55, special: 45 },
        passive: "Intimidate - Lowers enemy attack on switch",
        evolution: ["Sand Cub", "Dune Lion", "Savanna King"]
    },

    // Poison Types (NEW)
    venomAsp: {
        name: "Venom Asp",
        emoji: "🐍",
        type: "poison",
        baseStats: { hp: 65, attack: 52, defense: 48, speed: 68, special: 60 },
        passive: "Acidic Blood - Melts through enemy defenses; Corrosive Bolt poisons the enemy",
        ability: {
            name: "Corrosive Bolt",
            type: "poison",
            cooldown: 3,
            description: "Deals poison-based special damage and poisons the enemy (10% max HP damage per turn for 3 turns).",
            poison: true,
            poisonDuration: 3
        },
        evolution: ["Venom Asp", "Toxic Serpent", "Plague Sovereign"]
    },
    bogToad: {
        name: "Bog Toad",
        emoji: "🐸",
        type: "poison",
        baseStats: { hp: 78, attack: 50, defense: 55, speed: 40, special: 52 },
        passive: "Corrosion - Acidic strikes ignore half defense",
        evolution: ["Muck Tadpole", "Bog Toad", "Blight Matriarch"]
    }
};
    

const Starters = ["emberFox", "aquaTurtle", "leafBunny", "boltMouse", "mindCat", "shadowWolf", "moonPixie", "venomAsp"];

// ==================== PET MANAGER ====================
const PetManager = {
    pets: [],
    storage: [],
    selectedPet: null,
    maxPartySize: 6,
    maxTotalPets: 300,
    petIdCounter: 0,

    createPet(typeId, level = 1, options = {}) {
        const template = PetTypes[typeId];
        if (!template) return null;

        this.petIdCounter++;
        const shiny = options.shiny || false;
        const tier = options.tier || "D1";
        
        let shinyBonus = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
        if (shiny) {
            for (const stat in template.baseStats) {
                shinyBonus[stat] = Math.floor(template.baseStats[stat] * 0.15);
            }
        }
        
        const pet = {
            id: Date.now() + "_" + this.petIdCounter + "_" + Math.random().toString(36).substr(2, 9),
            typeId: typeId,
            level: level,
            xp: 0,
            lastTraining: null,
            prestigeLevel: 0,
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shiny: shiny,
            shinyBonus: shinyBonus,
            tier: tier,
            tierBonus: this.calculateTierBonus(tier),
            equipment: []
        };
        
        pet.currentHP = this.calculateMaxHP(template, level, pet);
        pet.stats = this.calculateStats(template, level, pet);

        return pet;
    },

    calculateTierBonus(tier) {
        const rank = tier.charAt(0);
        const sub = parseInt(tier.slice(1));
        const bonuses = {
            D: [2, 4, 6, 8, 10],
            C: [14, 18, 22, 26, 30],
            B: [38, 46, 54, 62, 70],
            A: [85, 100, 115, 130, 145],
            S: [170, 195, 220, 245, 270]
        };
        const rankBonuses = bonuses[rank];
        if (!rankBonuses || sub < 1 || sub > rankBonuses.length) return 0;
        return rankBonuses[sub - 1];
    },

    calculateMaxHP(template, level, pet) {
        const base = Math.floor((template.baseStats.hp * 2 * level) / 100) + level + 10;
        const bonus = pet?.bonusStats?.hp || 0;
        const levelBonus = pet?.levelBonusStats?.hp || 0;
        const shinyBonus = pet?.shinyBonus?.hp || 0;
        const tierBonus = pet?.tierBonus || 0;
        const equipStats = EquipmentSystem.getStats(pet) || { hp: 0 };
        return base + bonus + levelBonus + shinyBonus + tierBonus + (equipStats.hp || 0);
    },

    calculateStats(template, level, pet) {
        const stats = {};
        for (const stat in template.baseStats) {
            if (stat === "hp") continue;
            const base = Math.floor((template.baseStats[stat] * 2 * level) / 100) + 5;
            const bonus = pet?.bonusStats?.[stat] || 0;
            const levelBonus = pet?.levelBonusStats?.[stat] || 0;
            const shinyBonus = pet?.shinyBonus?.[stat] || 0;
            const tierBonus = pet?.tierBonus || 0;
            const equipStats = EquipmentSystem.getStats(pet) || {};
            stats[stat] = base + bonus + levelBonus + shinyBonus + tierBonus + (equipStats[stat] || 0);
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
        const startLevel = pet.level;
        const startMaxHP = this.calculateMaxHP(PetTypes[pet.typeId], startLevel, pet);

        while (pet.xp >= this.xpNeeded(pet.level) && pet.level < 1000) {
            pet.xp -= this.xpNeeded(pet.level);
            pet.level++;
            pet.stats = this.calculateStats(PetTypes[pet.typeId], pet.level, pet);
            leveledUp = true;
        }

        if (leveledUp) {
            const newMaxHP = this.calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
            let newHP = Math.floor((pet.currentHP / startMaxHP) * newMaxHP);
            newHP = Math.min(newHP, newMaxHP);
            pet.currentHP = newHP;
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
    },

    canPrestige(pet1Id, pet2Id) {
        const pet1 = this.pets.find(p => String(p.id) === String(pet1Id)) || 
                     this.storage.find(p => String(p.id) === String(pet1Id));
        const pet2 = this.pets.find(p => String(p.id) === String(pet2Id)) || 
                     this.storage.find(p => String(p.id) === String(pet2Id));
        
        if (!pet1 || !pet2) return { valid: false, reason: "Pet not found!" };
        if (String(pet1.id) === String(pet2.id)) return { valid: false, reason: "Cannot fuse a pet with itself!" };
        if (pet1.typeId !== pet2.typeId) return { valid: false, reason: "Pets must be the same race!" };
        if (pet1.prestigeLevel !== pet2.prestigeLevel) return { valid: false, reason: "Prestige levels must match!" };
        if (pet1.prestigeLevel >= 100) return { valid: false, reason: "Max prestige level reached!" };
        if (pet1.currentHP <= 0) return { valid: false, reason: "Primary pet must have HP above 0!" };
        
        return { valid: true };
    },

    prestigeFuse(pet1Id, pet2Id) {
        const validation = this.canPrestige(pet1Id, pet2Id);
        if (!validation.valid) return { success: false, reason: validation.reason };
        
        const pet1 = this.pets.find(p => String(p.id) === String(pet1Id)) || 
                     this.storage.find(p => String(p.id) === String(pet1Id));
        const pet2 = this.pets.find(p => String(p.id) === String(pet2Id)) || 
                     this.storage.find(p => String(p.id) === String(pet2Id));
        
        if (!pet1 || !pet2) return { success: false, reason: "Pet not found!" };
        
        if (Array.isArray(pet2.equipment)) {
            pet2.equipment.forEach(itemId => {
                Economy.inventory[itemId] = (Economy.inventory[itemId] || 0) + 1;
            });
        }
        
        const template = PetTypes[pet1.typeId];
        pet1.prestigeLevel++;
        pet1.bonusStats = {
            hp: pet1.prestigeLevel * 5,
            attack: pet1.prestigeLevel * 5,
            defense: pet1.prestigeLevel * 5,
            speed: pet1.prestigeLevel * 5,
            special: pet1.prestigeLevel * 5
        };
        pet1.levelBonusStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };

        pet1.stats = PetManager.calculateStats(template, pet1.level, pet1);
        const newMaxHP = PetManager.calculateMaxHP(template, pet1.level, pet1);
        pet1.currentHP = Math.min(pet1.currentHP, newMaxHP);
        
        this.pets = this.pets.filter(p => String(p.id) !== String(pet2.id));
        this.storage = this.storage.filter(p => String(p.id) !== String(pet2.id));
        
        // Award player XP for prestige fusion
        addXP(10);
        
        if (String(this.selectedPet?.id) === String(pet2.id)) {
            this.selectedPet = this.pets[0] || null;
        }
        
        return { success: true, pet: pet1 };
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
        hyperPotion: 0,
        tierStone: 0,
        xpOrb: 0,
        precisionGuide: 0,
        focusIncense: 0,
        bandOfSwiftness: 0,
        toughCollar: 0,
        focusBand: 0,
        lifeBangle: 0,
        attackSunglasses: 0
    },

    shopItems: {
        basicBall: { name: "Basic Ball", price: 50, type: "catch", power: 1 },
        greatBall: { name: "Great Ball", price: 150, type: "catch", power: 2 },
        ultraBall: { name: "Ultra Ball", price: 400, type: "catch", power: 3 },
        potion: { name: "Potion", price: 30, type: "heal", power: 20 },
        superPotion: { name: "Super Potion", price: 80, type: "heal", power: 50 },
        hyperPotion: { name: "Hyper Potion", price: 200, type: "heal", power: 100 },
        tierStone: { name: "Tier Stone", price: 500, type: "upgrade", power: 1 },
        xpOrb: { name: "XP Orb", price: 250, type: "xp", power: 500 },
    rareXpOrb: { name: "Rare XP Orb", price: 1000, type: "xp", power: 2000 },
        precisionGuide: { name: "Precision Guide", price: 100, type: "training", power: 1 },
        focusIncense: { name: "Focus Incense", price: 150, type: "training", power: 5 },
        bandOfSwiftness: { name: "Band of Swiftness", price: 4000, type: "equipment", power: 10, stats: { speed: 10 } },
        toughCollar: { name: "Tough Collar", price: 4000, type: "equipment", power: 10, stats: { defense: 10 } },
        focusBand: { name: "Focus Band", price: 4000, type: "equipment", power: 10, stats: { special: 10 } },
        lifeBangle: { name: "Life Bangle", price: 4000, type: "equipment", power: 10, stats: { hp: 10 } },
        attackSunglasses: { name: "Attack Sunglasses", price: 4000, type: "equipment", power: 10, stats: { attack: 10 } }
    },

    buyItem(itemId, quantity = 1) {
        const item = this.shopItems[itemId];
        if (!item || this.money < item.price * quantity) return false;

        this.money -= item.price * quantity;
        this.inventory[itemId] = (this.inventory[itemId] || 0) + quantity;
        return true;
    },

    useItem(itemId, pet, qty = 1) {
        if (!this.inventory[itemId] || this.inventory[itemId] <= 0) return false;
        if (qty > this.inventory[itemId]) qty = this.inventory[itemId];

        const item = this.shopItems[itemId];
        this.inventory[itemId] -= qty;

        const totalPower = item.power * qty;

        if (item.type === "heal") {
            const maxHP = PetManager.calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
            pet.currentHP = Math.min(maxHP, pet.currentHP + totalPower);
        } else if (item.type === "xp") {
            PetManager.gainXP(pet, totalPower);
        } else if (item.type === "training") {
            if (itemId === "precisionGuide") {
                TrainingSystem.guaranteedPerfectNextStop = true;
            } else if (itemId === "focusIncense") {
                TrainingSystem.extraMissesNextSession = true;
            }
        }

        return true;
    },

    sellPet(pet) {
        if (Array.isArray(pet.equipment)) {
            pet.equipment.forEach(itemId => {
                Economy.inventory[itemId] = (Economy.inventory[itemId] || 0) + 1;
            });
        }
        const value = pet.level * 25 + (pet.prestigeLevel || 0) * 1000 + (pet.shiny ? 5000 : 0) + TierSystem.getTierSellValue(pet.tier);
        this.money += value;
        PetManager.deletePet(pet.id);
        return value;
    }
};

// ==================== PLAYER SYSTEM ====================
const PlayerSystem = {
    level: 1,
    xp: 0,
    battleStreak: 0,
    bestStreak: 0,
    unlockedZones: ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh"],
    totalBattles: 0,
    totalCatches: 0,
    totalTrainings: 0,
    totalExplores: 0,
    lastDailyBonus: null,
    dailyActivities: new Set()
};

function xpNeeded(level) {
    return level * 150;
}

function addXP(amount) {
    const oldLevel = PlayerSystem.level;
    PlayerSystem.xp += amount;
    let leveledUp = false;
    while (PlayerSystem.xp >= xpNeeded(PlayerSystem.level) && PlayerSystem.level < 1000) {
        PlayerSystem.xp -= xpNeeded(PlayerSystem.level);
        PlayerSystem.level++;
        leveledUp = true;
    }
    if (leveledUp && PlayerSystem.level > oldLevel) {
        applyLevelUpRewards(oldLevel, PlayerSystem.level);
    }
    return leveledUp;
}

function applyLevelUpRewards(fromLevel, toLevel) {
    const levelsGained = toLevel - fromLevel;
    PetManager.pets.forEach(pet => {
        for (const stat in pet.levelBonusStats) {
            pet.levelBonusStats[stat] += levelsGained;
        }
        const template = PetTypes[pet.typeId];
        if (template) {
            pet.stats = PetManager.calculateStats(template, pet.level, pet);
            const newMaxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            pet.currentHP = Math.min(pet.currentHP, newMaxHP);
        }
    });

    const teamSlotsGained = Math.floor(toLevel / 5) - Math.floor(fromLevel / 5);
    PetManager.maxPartySize = Math.min(12, PetManager.maxPartySize + teamSlotsGained);

    const storageSlotsGained = Math.floor(toLevel / 25) - Math.floor(fromLevel / 25);
    PetManager.maxTotalPets = Math.min(300, PetManager.maxTotalPets + storageSlotsGained);
}

function getPlayerLevelBonus() {
    return PlayerSystem.level;
}

function getExploreExplore() {
    PlayerSystem.totalExplores++;
}

// ==================== EXPLORATION ====================
const Exploration = {
    zones: {
        forest: {
            name: "Forest",
            emoji: "🌲",
            unlockLevel: 1,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["leafBunny", "vineSnake", "mossBear", "glimmerMoth", "fieldDeer"],
            rarePets: ["mindCat", "dreamOwl", "moonPixie", "thornHog"],
            encounterRate: 1
        },
        cave: {
            name: "Cave",
            emoji: "⛰️",
            unlockLevel: 1,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["scaleLizard", "sparkDog", "shadowWolf", "duskBat"],
            rarePets: ["drakeWhelp", "frostPenguin", "crystalSeal", "frostBear", "crystalWyrm", "mindApe"],
            encounterRate: 1
        },
        lake: {
            name: "Lake",
            emoji: "💧",
            unlockLevel: 1,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["aquaTurtle", "mistFrog", "waveWhale"],
            rarePets: ["shockEel", "boltMouse"],
            encounterRate: 1
        },
        mountain: {
            name: "Mountain",
            emoji: "🏔️",
            unlockLevel: 5,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["flameCat", "zapBird", "scaleLizard", "frostBear", "cloudSheep", "glacierFox"],
            rarePets: ["drakeWhelp", "cosmicFox", "crystalWyrm", "voltageOx"],
            encounterRate: 1
        },
        desert: {
            name: "Desert",
            emoji: "🏜️",
            unlockLevel: 10,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["emberFox", "sparkDog", "scaleLizard", "cinderScorpion", "duneLion"],
            rarePets: ["flameCat", "drakeWhelp"],
            encounterRate: 1
        },
        ocean: {
            name: "Ocean",
            emoji: "🌊",
            unlockLevel: 15,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["waveWhale", "shockEel", "crystalSeal", "tidalCrab"],
            rarePets: ["aquaTurtle", "frostPenguin"],
            encounterRate: 1
        },
        volcano: {
            name: "Volcano",
            emoji: "🌋",
            unlockLevel: 20,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["flameCat", "emberFox", "sparkDog"],
            rarePets: ["drakeWhelp", "scaleLizard", "cinderScorpion", "cinderHawk"],
            encounterRate: 1
        },
        swamp: {
            name: "Swamp",
            emoji: "🐊",
            unlockLevel: 25,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["mistFrog", "vineSnake", "mossBear", "glimmerMoth", "marshCroc", "shadowWolf", "sunstoneBeetle"],
            rarePets: ["waveWhale", "dreamOwl", "frostBear"],
            encounterRate: 1
        },
        sky: {
            name: "Sky",
            emoji: "☁️",
            unlockLevel: 30,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["zapBird", "boltMouse", "dreamOwl", "cloudSheep"],
            rarePets: ["cosmicFox", "shockEel"],
            encounterRate: 1
        },
        toxicMarsh: {
            name: "Toxic Marsh",
            emoji: "🧪",
            unlockLevel: 35,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["venomAsp", "bogToad", "mistFrog", "vineSnake"],
            rarePets: ["shadowWolf", "cosmicFox", "moonPixie"],
            encounterRate: 1
        }
    },
    cooldowns: {},
    cooldownTime: 1000,
    currentFloor: null,
    selectedZoneId: null,
    floorPage: 0,

    explore(zoneId, floorIndex) {
        const now = Date.now();
        if (this.cooldowns[zoneId] && now < this.cooldowns[zoneId]) {
            return null;
        }

        this.cooldowns[zoneId] = now + this.cooldownTime;
        this.currentFloor = { zoneId, floorIndex };
        const zone = this.zones[zoneId];

        if (Math.random() > zone.encounterRate) {
            return null;
        }

        // Determine pet rarity
        const isRare = Math.random() < 0.25;
        const petPool = isRare ? zone.rarePets : zone.commonPets;
        const petType = petPool[Math.floor(Math.random() * petPool.length)];

        // Generate wild pet level from floor index
        const level = getWildPetLevelForFloor(floorIndex, zone.floorSize);

        // Shiny roll: 1 in 500
        const isShiny = Math.random() < 0.002;

        // Tier roll based on zone
        const tier = rollTierForZone(zoneId);

        const wildPet = PetManager.createPet(petType, level, { shiny: isShiny, tier });

        if (!wildPet || !wildPet.stats) {
            console.error("Failed to create valid wild pet:", petType, level, wildPet);
            return null;
        }

        return { pet: wildPet, isRare, isShiny };
    },

    getCooldownRemaining(zoneId) {
        if (!this.cooldowns[zoneId]) return 0;
        const remaining = this.cooldowns[zoneId] - Date.now();
        return Math.max(0, Math.ceil(remaining / 1000));
    }
};

// Tier helpers
function getWildPetLevelForFloor(floorIndex, floorSize) {
    const floorMin = (floorIndex - 1) * floorSize + 1;
    const floorMax = floorIndex * floorSize;
    return Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
}

function rollTierForZone(zoneId) {
    const tierRoll = Math.random();
    let tier;
    if (PlayerSystem.level < 50) {
        tier = randomTier("D");
    } else if (tierRoll < 0.05) tier = randomTier("A");
    else if (tierRoll < 0.10) tier = randomTier("B");
    else if (tierRoll < 0.50) tier = randomTier("C");
    else tier = randomTier("D");
    return tier;
}

function randomTier(rank) {
    const roll = Math.random();
    if (roll < 0.50) return `${rank}1`;
    if (roll < 0.70) return `${rank}2`;
    if (roll < 0.85) return `${rank}3`;
    if (roll < 0.95) return `${rank}4`;
    return `${rank}5`;
}

// Tier System
const TierSystem = {
    getNextTier(tier) {
        const rank = tier.charAt(0);
        const sub = parseInt(tier.slice(1));
        if (sub >= 5) {
            const nextRank = { D: "C", C: "B", B: "A", A: "S", S: "S" }[rank];
            if (!nextRank) return tier;
            return nextRank + "1";
        }
        return `${rank}${sub + 1}`;
    },
    
    getTierIndex(tier) {
        const rank = tier.charAt(0);
        const sub = parseInt(tier.slice(1));
        const rankIndex = { D: 0, C: 1, B: 2, A: 3, S: 4 }[rank] || 0;
        return rankIndex * 5 + (sub - 1);
    },
    
    getTierSellValue(tier) {
        const tierIndex = this.getTierIndex(tier);
        const baseTierBonus = tierIndex * 100;
        const rankIncrements = { D: 0, C: 0, B: 200, A: 500, S: 1000 };
        const rankIncrement = (rankIncrements[tier.charAt(0)] || 0) * tierIndex;
        return baseTierBonus + rankIncrement;
    },

    getUpgradeCost(tier) {
        const rank = tier.charAt(0);
        const sub = parseInt(tier.slice(1));
        const costs = {
            D: [500, 1000, 2000, 4000],
            C: [8000, 16000, 32000, 64000],
            B: [100000, 150000, 200000, 250000],
            A: [300000, 400000, 500000, 600000],
            S: [700000, 800000, 900000, 1000000]
        };
        
        if (sub >= 5) {
            const nextRank = { D: "C", C: "B", B: "A", A: "S" }[rank];
            if (!nextRank || !costs[nextRank]) return Infinity;
            return costs[nextRank][0];
        }
        
        const rankCosts = costs[rank];
        if (!rankCosts || sub > rankCosts.length) return Infinity;
        return rankCosts[sub - 1];
    },

    getUpgradeStones(tier) {
        const rank = tier.charAt(0);
        const sub = parseInt(tier.slice(1));
        const stoneMap = { D: 1, C: 2, B: 3, A: 4, S: 5 };
        
        if (sub >= 5) {
            const nextRank = { D: "C", C: "B", B: "A", A: "S" }[rank];
            return stoneMap[nextRank] || 1;
        }
        
        return stoneMap[rank] || 1;
    },

    canUpgradeTier(petId) {
        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        if (!pet) return { valid: false, reason: "Pet not found!" };
        if (pet.tier === "S5") return { valid: false, reason: "Max tier reached!" };

        const nextTier = this.getNextTier(pet.tier);
        const cost = this.getUpgradeCost(pet.tier);
        const stones = this.getUpgradeStones(pet.tier);

        if (Economy.money < cost) return { valid: false, reason: `Need ${cost} gold!` };
        if ((Economy.inventory.tierStone || 0) < stones) return { valid: false, reason: `Need ${stones} Tier Stones!` };

        return { valid: true, nextTier, cost, stones };
    },

    upgradeTier(petId) {
        const validation = this.canUpgradeTier(petId);
        if (!validation.valid) return { success: false, reason: validation.reason };

        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        if (!pet) return { success: false, reason: "Pet not found!" };

        const nextTier = this.getNextTier(pet.tier);
        const cost = this.getUpgradeCost(pet.tier);
        const stones = this.getUpgradeStones(pet.tier);

        Economy.money -= cost;
        Economy.inventory.tierStone = (Economy.inventory.tierStone || 0) - stones;
        pet.tier = nextTier;
        pet.tierBonus = PetManager.calculateTierBonus(nextTier);
        pet.stats = PetManager.calculateStats(PetTypes[pet.typeId], pet.level, pet);
        const newMaxHP = PetManager.calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
        pet.currentHP = Math.min(pet.currentHP, newMaxHP);

        return { success: true, pet, nextTier };
    }
};

// ==================== EQUIPMENT SYSTEM ====================
const EquipmentSystem = {
    getStats(pet) {
        if (!pet.equipment || !Array.isArray(pet.equipment) || pet.equipment.length === 0) return { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
        let totalStats = { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 };
        for (const itemId of pet.equipment) {
            const item = Economy.shopItems[itemId];
            if (item && item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    totalStats[stat] = (totalStats[stat] || 0) + value;
                }
            }
        }
        return totalStats;
    },
    
    canEquip(petId) {
        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        if (!pet) return { valid: false, reason: "Pet not found!" };
        if (!Array.isArray(pet.equipment) || pet.equipment.length >= 5) return { valid: false, reason: "Max 5 equipment slots!" };
        return { valid: true };
    },
    
    equip(petId, itemId) {
        const validation = this.canEquip(petId);
        if (!validation.valid) return { success: false, reason: validation.reason };
        
        if (!Economy.inventory[itemId] || Economy.inventory[itemId] <= 0) {
            return { success: false, reason: "No item in inventory!" };
        }
        
        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        
        Economy.inventory[itemId]--;
        if (!Array.isArray(pet.equipment)) pet.equipment = [];
        pet.equipment.push(itemId);
        pet.stats = PetManager.calculateStats(PetTypes[pet.typeId], pet.level, pet);
        const newMaxHP = PetManager.calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
        pet.currentHP = Math.min(pet.currentHP, newMaxHP);
        
        return { success: true, pet };
    },
    
    unequip(petId, itemId) {
        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        if (!pet || !Array.isArray(pet.equipment) || pet.equipment.length === 0) return { success: false, reason: "No equipment to unequip!" };
        
        const index = pet.equipment.indexOf(itemId);
        if (index === -1) return { success: false, reason: "Item not found!" };
        
        pet.equipment.splice(index, 1);
        Economy.inventory[itemId] = (Economy.inventory[itemId] || 0) + 1;
        pet.stats = PetManager.calculateStats(PetTypes[pet.typeId], pet.level, pet);
        const newMaxHP = PetManager.calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
        pet.currentHP = Math.min(pet.currentHP, newMaxHP);
        
        return { success: true, pet };
    }
};

// ==================== passive SYSTEM ====================
const PassiveSystem = {
    getPassiveMultiplier(attacker, defender) {
        const template = PetTypes[attacker.typeId];
        if (!template || !template.passive) return 1;
        
        const passive = template.passive;
        const hpPercent = attacker.currentHP / PetManager.calculateMaxHP(template, attacker.level, attacker) * 100;
        
        // Alpha Hunter - Dark type, deals 1.5x damage if defender has higher total power
        if (attacker.type === "dark" && passive.includes("Alpha Hunter")) {
            if (defender) {
                const attackerPower = TeamPowerSystem.calculatePetPower(attacker);
                const defenderPower = TeamPowerSystem.calculatePetPower(defender);
                if (defenderPower > attackerPower) {
                    return 1.5;
                }
            }
        }
        
        // Sanguine Drain - Dark type, heals 5% of damage dealt; Dark moves amplified at low HP
        if (passive.includes("Sanguine Drain") && attacker.type === "dark") {
            // Damage amplification at low HP (below 30%)
            if (hpPercent <= 30) return 1.30;
            if (hpPercent <= 60) return 1.15;
            return 1.0;
        }
        
        // Blaze - Fire type, HP-based damage boost
        if (passive.includes("Blaze") && template.type === "fire") {
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
        if (passive.includes("Overgrow") && template.type === "grass") {
            if (hpPercent >= 70) return 1.05;
            if (hpPercent <= 20) return 1.40;
            const range = 70 - 20;
            const currentRange = hpPercent - 20;
            const progress = 1 - (currentRange / range);
            const boostRange = 0.40 - 0.05;
            return 1.05 + (progress * boostRange);
        }
        
        // Torrent - Water type, HP-based damage boost
        if (passive.includes("Torrent") && template.type === "water") {
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
    
    triggerSwitchPassive(switchingPet, enemyPet, battleSystem) {
        const template = PetTypes[switchingPet.typeId];
        if (!template || !template.passive) return;
        
        const passive = template.passive;
        
        // Intimidate - Lowers enemy attack by 1 stage
        if (passive.includes("Intimidate")) {
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
    turnCount: 0,
    playerAbilityCooldown: 0,
    paralyzed: null,
    bleeding: null,
    bleedDamage: 0,
    burning: null,
    burnDamage: 0,
    confused: null,
    burnDuration: { enemy: 0, player: 0 },
    shield: { enemy: { turns: 0, percent: 0 }, player: { turns: 0, percent: 0 } },
    poisoned: null,
    poisonDuration: { enemy: 0, player: 0 },

    typeEffectiveness: {
        fire: { grass: 2, water: 0.5, ice: 2, fire: 0.5, dragon: 0.5, fairy: 2, dark: 1, normal: 1 },
        water: { fire: 2, grass: 0.5, ground: 2, water: 0.5, dragon: 0.5, normal: 1 },
        grass: { water: 2, fire: 0.5, ground: 2, grass: 0.5, dragon: 0.5, dark: 1, poison: 0.5, normal: 1 },
        electric: { water: 2, grass: 0.5, flying: 2, electric: 0.5, dragon: 0.5, normal: 1 },
        ice: { grass: 2, fire: 0.5, dragon: 2, ice: 0.5, fairy: 2, dark: 1, normal: 1 },
        psychic: { psychic: 0.5, dark: 0.5, fairy: 1, poison: 2, normal: 1 },
        dragon: { dragon: 2, fairy: 0, ice: 0.5, normal: 1 },
        dark: { psychic: 2, dark: 0.5, fairy: 0.5, ghost: 2, normal: 1 },
        fairy: { dragon: 2, dark: 2, fire: 0.5, ice: 0.5, poison: 0.5, normal: 1 },
        poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, normal: 1 },
        normal: { rock: 0.5, ghost: 0, steel: 0.5, dark: 1, fairy: 1 }
    },

    startBattle(playerPet, enemyPet) {
        if (!playerPet || !enemyPet || !playerPet.stats || !enemyPet.stats) {
            console.error("Invalid battle state - missing pet or stats:", playerPet, enemyPet);
            return;
        }
        
        this.active = true;
        this.playerPet = { ...playerPet };
        this.enemyPet = { ...enemyPet };
        this.battleLog = [];
        this.playerStatMods = { attack: 0, defense: 0, speed: 0, special: 0 };
        this.enemyStatMods = { attack: 0, defense: 0, speed: 0, special: 0 };
        this.turnCount = 0;
        this.playerAbilityCooldown = 0;
        this.paralyzed = null;
        this.bleeding = null;
        this.bleedDamage = 0;
        this.burning = null;
        this.burnDamage = 0;
        this.confused = null;
        this.burnDuration = { enemy: 0, player: 0 };
        this.shield = { enemy: { turns: 0, percent: 0 }, player: { turns: 0, percent: 0 } };
        this.poisoned = null;
        this.poisonDuration = { enemy: 0, player: 0 };
        
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
        PassiveSystem.triggerSwitchPassive(this.playerPet, this.enemyPet, this);
        
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
        
        const offensiveStat = attack;

        // Corrosion - Poison pets ignore half of the enemy's defense
        let effectiveDefense = defense;
        if (attackerTemplate.type === "poison" && attackerTemplate.passive && attackerTemplate.passive.includes("Corrosion")) {
            effectiveDefense = Math.floor(defense / 2);
        }

        // Prevent division by zero
        const safeDefense = Math.max(1, effectiveDefense);
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
        
        // Apply passive multiplier
        const passiveMultiplier = PassiveSystem.getPassiveMultiplier(attacker, defender);
        damage = Math.floor(damage * passiveMultiplier);
        
        // Reduce all damage by 75% for fairer battles
        damage = Math.floor(damage * 0.25);
        
        // Apply shield reduction if defender has active shield
        const defenderIsPlayer = defender === this.playerPet;
        const defenderShield = defenderIsPlayer ? this.shield.player : this.shield.enemy;
        if (defenderShield.turns > 0) {
            damage = Math.floor(damage * (1 - defenderShield.percent));
        }
        
        return { damage, isCrit, typeMult };
    },

playerTurn() {
         if (!this.active || !this.isPlayerTurn) return;
         
         this.turnCount++;
         if (this.playerAbilityCooldown > 0) {
             this.playerAbilityCooldown--;
         }
         
         // Check if player is confused
         if (this.confused === "player") {
             this.addLog(`${this.getPetName(this.playerPet)} is confused and can't move!`);
             this.confused = null;
             this.isPlayerTurn = false;
             UIManager.updateBattleScreen();
             setTimeout(() => this.enemyTurn(), 1000);
             return;
         }
         
         this.attack(this.playerPet, this.enemyPet, true);
        
        if (this.enemyPet.currentHP <= 0) {
            this.endBattle(true);
            return;
        }
        
        this.isPlayerTurn = false;
        UIManager.updateBattleScreen();
        
        // Check if enemy is paralyzed
        if (this.paralyzed) {
            this.addLog(`${this.getPetName(this.enemyPet)} is paralyzed! It can't move!`);
            this.paralyzed = false;
            UIManager.updateBattleScreen();
            
            // Player gets another turn
            this.isPlayerTurn = true;
            setTimeout(() => UIManager.updateBattleScreen(), 500);
            return;
        }
        
        // Enemy attacks after delay
        setTimeout(() => this.enemyTurn(), 1000);
    },
    
enemyTurn() {
         if (!this.active || this.isPlayerTurn) return;
         
         // Check if enemy is confused
         if (this.confused === "enemy") {
             this.addLog(`${this.getPetName(this.enemyPet)} is confused and can't move!`);
             this.confused = null;
             this.isPlayerTurn = true;
             UIManager.updateBattleScreen();
             setTimeout(() => UIManager.updateBattleScreen(), 500);
             return;
         }
         
         this.attack(this.enemyPet, this.playerPet, false);
        
        if (this.playerPet.currentHP <= 0) {
            this.endBattle(false);
            return;
        }
        
        this.isPlayerTurn = true;
        UIManager.updateBattleScreen();
    },

    attack(attacker, defender, isPlayerAttacker) {
        const defenderTemplate = PetTypes[defender.typeId];
        if (defenderTemplate.passive && defenderTemplate.passive.includes("Fast feet")) {
            if (Math.random() < 0.10) {
                const defenderName = this.getPetName(defender);
                this.addLog(`${defenderName} dodged the attack!`);
                UIManager.updateBattleScreen();
                return;
            }
        }
        
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
          
          // Apply bleed damage after each attack
          this.applyBleedDamage();
          
// Apply burn damage after each attack
           this.applyBurnDamage();
           
           // Sanguine Drain - heals a portion of damage dealt as HP (dark type passive)
           if (attackerTemplate.passive && attackerTemplate.passive.includes("Sanguine Drain") && attacker.type === "dark") {
               const healAmount = Math.floor(result.damage * 0.15);
               if (healAmount > 0) {
                   attacker.currentHP = Math.min(PetManager.calculateMaxHP(attackerTemplate, attacker.level, attacker), attacker.currentHP + healAmount);
                   this.addLog(`🩸 ${this.getPetName(attacker)} heals ${healAmount} HP from Sanguine Drain!`);
               }
           }
           
           // Decrement shield durations after each attack
          if (this.shield.player.turns > 0) {
              this.shield.player.turns--;
              if (this.shield.player.turns <= 0) {
                  this.shield.player = { turns: 0, percent: 0 };
              }
          }
          if (this.shield.enemy.turns > 0) {
              this.shield.enemy.turns--;
              if (this.shield.enemy.turns <= 0) {
                  this.shield.enemy = { turns: 0, percent: 0 };
              }
          }
          
          // Apply poison damage after each attack
          this.applyPoisonDamage();
      },
  
      applyBleedDamage() {
         if (this.bleeding && this.bleedDamage > 0 && this.active) {
             const bleedDmg = Math.max(1, Math.floor(this.bleedDamage * 0.25));
             const target = this.bleeding === "enemy" ? this.enemyPet : this.playerPet;
             const targetName = this.bleeding === "enemy" ? this.getPetName(this.enemyPet) : this.getPetName(this.playerPet);
             target.currentHP = Math.max(0, target.currentHP - bleedDmg);
             this.addLog(`🩸 Bleeding deals ${bleedDmg} damage to ${targetName}!`);
             UIManager.updateBattleScreen();
             if (target.currentHP <= 0) {
                 if (this.bleeding === "enemy") {
                     this.endBattle(true);
                 } else {
                     this.endBattle(false);
                 }
             }
         }
     },

applyBurnDamage() {
          if (this.burning && this.burnDamage > 0 && this.active) {
              const target = this.burning === "enemy" ? this.enemyPet : this.playerPet;
              const targetName = this.burning === "enemy" ? this.getPetName(this.enemyPet) : this.getPetName(this.playerPet);
              const side = this.burning === "enemy" ? "enemy" : "player";
              if (this.burnDuration[side] > 0) {
                  const burnDmg = Math.max(1, Math.floor(this.burnDamage * 0.25));
                  target.currentHP = Math.max(0, target.currentHP - burnDmg);
                  this.addLog(`🔥 Burning deals ${burnDmg} damage to ${targetName}!`);
                  this.burnDuration[side]--;
                  if (this.burnDuration[side] <= 0) {
                      this.burning = null;
                      this.burnDamage = 0;
                  }
                  UIManager.updateBattleScreen();
                  if (target.currentHP <= 0) {
                      if (this.burning === "enemy") {
                          this.endBattle(true);
                      } else {
                          this.endBattle(false);
                      }
                  }
          } else {
              this.burning = null;
              this.burnDamage = 0;
          }
      }
      },

      applyPoisonDamage() {
          if (this.poisoned && this.active) {
              const side = this.poisoned === "enemy" ? "enemy" : "player";
              const target = this.poisoned === "enemy" ? this.enemyPet : this.playerPet;
              const targetName = this.poisoned === "enemy" ? this.getPetName(this.enemyPet) : this.getPetName(this.playerPet);
              if (this.poisonDuration[side] > 0) {
                  const maxHP = PetManager.calculateMaxHP(PetTypes[target.typeId], target.level, target);
                  const poisonDmg = Math.max(1, Math.floor(maxHP * 0.10));
                  target.currentHP = Math.max(0, target.currentHP - poisonDmg);
                  this.addLog(`☠️ Poison deals ${poisonDmg} damage to ${targetName}!`);
                  this.poisonDuration[side]--;
                  if (this.poisonDuration[side] <= 0) {
                      this.poisoned = null;
                  }
                  UIManager.updateBattleScreen();
                  if (target.currentHP <= 0) {
                      if (this.poisoned === "enemy") {
                          this.endBattle(true);
                      } else {
                          this.endBattle(false);
                      }
                  }
              } else {
                  this.poisoned = null;
              }
          }
      },

    calculateSpecialDamage(attacker, defender, abilityType) {
        const attackerTemplate = PetTypes[attacker.typeId];
        const defenderTemplate = PetTypes[defender.typeId];
        
        if (defenderTemplate.passive && defenderTemplate.passive.includes("Fast feet")) {
            if (Math.random() < 0.10) {
                const defenderName = this.getPetName(defender);
                return { damage: 0, isCrit: false, typeMult: 1, dodged: true, dodgerName: defenderName };
            }
        }
        
        const attackerMods = attacker === this.playerPet ? this.playerStatMods : this.enemyStatMods;
        const defenderMods = defender === this.playerPet ? this.playerStatMods : this.enemyStatMods;
        
        const specialMod = Math.pow(1.25, attackerMods.special);
        const defenseMod = Math.pow(1.25, defenderMods.defense);
        
        const special = Math.floor(attacker.stats.special * specialMod);
        const defense = Math.floor(defender.stats.defense * defenseMod);
        
        let effectiveDefense = defense;
        if (attackerTemplate.type === "poison" && attackerTemplate.passive && attackerTemplate.passive.includes("Corrosion")) {
            effectiveDefense = Math.floor(defense / 2);
        }
        
        const safeDefense = Math.max(1, effectiveDefense);
        let damage = Math.floor((special * 40) / safeDefense);
        
        const typeMult = this.getTypeEffectiveness(abilityType, defenderTemplate.type);
        damage = Math.floor(damage * typeMult);
        
        const critChance = 0.1 + (attacker.stats.speed / 500);
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            damage = Math.floor(damage * 1.5);
        }
        
        damage = Math.floor(damage * (0.85 + Math.random() * 0.15));
        const passiveMultiplier = PassiveSystem.getPassiveMultiplier(attacker, defender);
        damage = Math.floor(damage * passiveMultiplier);
        damage = Math.floor(damage * 0.25);
        
        // Apply shield reduction if defender has active shield
        const defenderIsPlayer = defender === this.playerPet;
        const defenderShield = defenderIsPlayer ? this.shield.player : this.shield.enemy;
        if (defenderShield.turns > 0) {
            damage = Math.floor(damage * (1 - defenderShield.percent));
        }
        
        return { damage, isCrit, typeMult };
    },

    useAbility() {
        if (!this.active || !this.isPlayerTurn) return;
        
        const template = PetTypes[this.playerPet.typeId];
        if (!template || !template.ability) return;
        
        const ability = template.ability;
        if (this.playerAbilityCooldown > 0) return;
        
        // Electric Ball implementation
        if (ability.name === "Electric Ball") {
            const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
            
            if (result.dodged) {
                this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
            } else {
                this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                
                const attackerName = this.getPetName(this.playerPet);
                const defenderName = this.getPetName(this.enemyPet);
                
                let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                if (result.isCrit) logText += " (CRITICAL!)";
                if (result.typeMult > 1) logText += " (Super effective!)";
                else if (result.typeMult < 1) logText += " (Not very effective)";
                
                this.addLog(logText);
                this.paralyzed = true;
                
                if (this.enemyPet.currentHP <= 0) {
                    UIManager.updateBattleScreen();
                    this.endBattle(true);
                    return;
                }
            }
            
            this.playerAbilityCooldown = ability.cooldown;
            this.isPlayerTurn = false;
            UIManager.updateBattleScreen();
            
            // Check if enemy is paralyzed
            if (this.paralyzed) {
                this.addLog(`${this.getPetName(this.enemyPet)} is paralyzed! It can't move!`);
                this.paralyzed = false;
                UIManager.updateBattleScreen();
                
                // Player gets another turn
                this.isPlayerTurn = true;
                setTimeout(() => UIManager.updateBattleScreen(), 500);
                return;
            }
            
setTimeout(() => this.enemyTurn(), 1000);
         }
         
         // Bleeding Claw implementation
         if (ability.name === "Bleeding Claw" && ability.bleed) {
             if (this.playerAbilityCooldown > 0) return;
             
             const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
             
             if (result.dodged) {
                 this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
             } else {
                 this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                 
                 // Set bleeding state
                 this.bleeding = "enemy";
                 this.bleedDamage = result.damage;
                 
                 const attackerName = this.getPetName(this.playerPet);
                 const defenderName = this.getPetName(this.enemyPet);
                 
                 let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                 if (result.isCrit) logText += " (CRITICAL!)";
                 if (result.typeMult > 1) logText += " (Super effective!)";
                 else if (result.typeMult < 1) logText += " (Not very effective)";
                 
                 this.addLog(logText);
                 this.addLog(`🩸 ${defenderName} is now bleeding!`);
                 
                 if (this.enemyPet.currentHP <= 0) {
                     UIManager.updateBattleScreen();
                     this.endBattle(true);
                     return;
                 }
             }
             
             this.playerAbilityCooldown = ability.cooldown;
             this.isPlayerTurn = false;
             UIManager.updateBattleScreen();
             
             setTimeout(() => this.enemyTurn(), 1000);
         }
         
// Fireball implementation (Ember Fox ability)
          if (ability.name === "Fireball" && ability.burn) {
              if (this.playerAbilityCooldown > 0) return;
              
              // Fireball damage: special stat + 5 flat
              const specialStat = this.playerPet.stats.special;
              const baseDamage = specialStat + 5;
              
              const defenderTemplate = PetTypes[this.enemyPet.typeId];
              const typeMult = this.getTypeEffectiveness("fire", defenderTemplate.type);
              
              let rawDmg = Math.floor((baseDamage * 40) / Math.max(1, defenderTemplate.stats.defense));
              rawDmg = Math.floor(rawDmg * typeMult);
              rawDmg = Math.floor(rawDmg * 0.25); // Global damage reduction
              
              this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - rawDmg);
              
              // Set burning state (permanent burn for Ember Fox)
              this.burning = "enemy";
              this.burnDamage = rawDmg;
              this.burnDuration.enemy = 9999;
              
              const attackerName = this.getPetName(this.playerPet);
              const defenderName = this.getPetName(this.enemyPet);
              
              let logText = `${attackerName} used ${ability.name}! Deals ${rawDmg} damage to ${defenderName}`;
              if (typeMult > 1) logText += " (Super effective!)";
              else if (typeMult < 1) logText += " (Not very effective)";
              
              this.addLog(logText);
              this.addLog(`🔥 ${defenderName} is now burning!`);
              
              if (this.enemyPet.currentHP <= 0) {
                  UIManager.updateBattleScreen();
                  this.endBattle(true);
                  return;
              }
              
              this.playerAbilityCooldown = ability.cooldown;
              this.isPlayerTurn = false;
              UIManager.updateBattleScreen();
              
              setTimeout(() => this.enemyTurn(), 1000);
          }
          
          // Ember Surge implementation (flameCat ability)
          if (ability.name === "Ember Surge" && ability.burn) {
              if (this.playerAbilityCooldown > 0) return;
              
              const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
              
              if (result.dodged) {
                  this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
              } else {
                  this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                  
                  // Set burning state for 3 turns
                  this.burning = "enemy";
                  this.burnDamage = result.damage;
                  this.burnDuration.enemy = 3;
                  
                  const attackerName = this.getPetName(this.playerPet);
                  const defenderName = this.getPetName(this.enemyPet);
                  
                  let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                  if (result.isCrit) logText += " (CRITICAL!)";
                  if (result.typeMult > 1) logText += " (Super effective!)";
                  else if (result.typeMult < 1) logText += " (Not very effective)";
                  
                  this.addLog(logText);
                  this.addLog(`🔥 ${defenderName} is now burning for 3 turns!`);
                  
                  if (this.enemyPet.currentHP <= 0) {
                      UIManager.updateBattleScreen();
                      this.endBattle(true);
                      return;
                  }
              }
              
              this.playerAbilityCooldown = ability.cooldown;
              this.isPlayerTurn = false;
              UIManager.updateBattleScreen();
              
              setTimeout(() => this.enemyTurn(), 1000);
          }
          
          // Psychic Burst implementation (mindCat ability)
          if (ability.name === "Psychic Burst" && ability.confuse) {
              if (this.playerAbilityCooldown > 0) return;
              
              const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
              
              if (result.dodged) {
                  this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
              } else {
                  this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                  
                  const attackerName = this.getPetName(this.playerPet);
                  const defenderName = this.getPetName(this.enemyPet);
                  
                  // 30% chance to confuse
                  if (Math.random() < ability.confuseChance) {
                      this.confused = "enemy";
                      this.addLog(`🧠 ${defenderName} is now confused and may skip their next turn!`);
                  }
                  
                  let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                  if (result.isCrit) logText += " (CRITICAL!)";
                  if (result.typeMult > 1) logText += " (Super effective!)";
                  else if (result.typeMult < 1) logText += " (Not very effective)";
                  
                  this.addLog(logText);
                  
                  if (this.enemyPet.currentHP <= 0) {
                      UIManager.updateBattleScreen();
                      this.endBattle(true);
                      return;
                  }
              }
              
              this.playerAbilityCooldown = ability.cooldown;
              this.isPlayerTurn = false;
              UIManager.updateBattleScreen();
              
              setTimeout(() => this.enemyTurn(), 1000);
          }
          
          // Moonbeam Heal implementation (moonPixie ability)
          if (ability.name === "Moonbeam Heal" && ability.heal) {
              if (this.playerAbilityCooldown > 0) return;
              
              const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
              
              if (result.dodged) {
                  this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
              } else {
                  this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                  
                  // Heal user for 30% of damage dealt
                  const healAmount = Math.floor(result.damage * ability.healPercent);
                  const maxHP = PetManager.calculateMaxHP(PetTypes[this.playerPet.typeId], this.playerPet.level, this.playerPet);
                  this.playerPet.currentHP = Math.min(maxHP, this.playerPet.currentHP + healAmount);
                  
                  const attackerName = this.getPetName(this.playerPet);
                  const defenderName = this.getPetName(this.enemyPet);
                  
                  let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                  if (result.isCrit) logText += " (CRITICAL!)";
                  if (result.typeMult > 1) logText += " (Super effective!)";
                  else if (result.typeMult < 1) logText += " (Not very effective)";
                  
                  this.addLog(logText);
                  if (healAmount > 0) {
                      this.addLog(`💚 ${attackerName} heals for ${healAmount} HP!`);
                  }
                  
                  if (this.enemyPet.currentHP <= 0) {
                      UIManager.updateBattleScreen();
                      this.endBattle(true);
                      return;
                  }
              }
              
              this.playerAbilityCooldown = ability.cooldown;
              this.isPlayerTurn = false;
              UIManager.updateBattleScreen();
              
              setTimeout(() => this.enemyTurn(), 1000);
          }
          
          // Dragon Rampage implementation (drakeWhelp ability)
          if (ability.name === "Dragon Rampage" && ability.rampage) {
              if (this.playerAbilityCooldown > 0) return;
              
              const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
              
              if (result.dodged) {
                  this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
              } else {
                  // 50% chance double damage, 50% chance half damage
                  const rampageRoll = Math.random();
                  let finalDmg = result.damage;
                  if (rampageRoll < ability.critChance) {
                      finalDmg = Math.floor(result.damage * 2);
                      this.addLog(`${this.getPetName(this.playerPet)} used ${ability.name}! It's a critical hit!`);
                  } else {
                      finalDmg = Math.floor(result.damage * 0.5);
                      this.addLog(`${this.getPetName(this.playerPet)} used ${ability.name}! It's not very effective...`);
                  }
                  
                  this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - finalDmg);
                  
                  const attackerName = this.getPetName(this.playerPet);
                  const defenderName = this.getPetName(this.enemyPet);
                  
                  let logText = `${attackerName} used ${ability.name}! Deals ${finalDmg} damage to ${defenderName}`;
                  if (result.isCrit) logText += " (CRITICAL!)";
                  if (result.typeMult > 1) logText += " (Super effective!)";
                  else if (result.typeMult < 1) logText += " (Not very effective)";
                  
                  this.addLog(logText);
                  
                  if (this.enemyPet.currentHP <= 0) {
                      UIManager.updateBattleScreen();
                      this.endBattle(true);
                      return;
                  }
              }
              
              this.playerAbilityCooldown = ability.cooldown;
              this.isPlayerTurn = false;
              UIManager.updateBattleScreen();
              
              setTimeout(() => this.enemyTurn(), 1000);
          }
          
          // Aurora Guard implementation (crystalSeal ability)
          if (ability.name === "Aurora Guard" && ability.shield) {
              if (this.playerAbilityCooldown > 0) return;
              
              const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
              
              if (result.dodged) {
                  this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
              } else {
                  this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                  
                  // Apply shield to player
                  this.shield.player = { turns: ability.shieldDuration, percent: ability.shieldPercent };
                  
                  const attackerName = this.getPetName(this.playerPet);
                  const defenderName = this.getPetName(this.enemyPet);
                  
                  let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                  if (result.isCrit) logText += " (CRITICAL!)";
                  if (result.typeMult > 1) logText += " (Super effective!)";
                  else if (result.typeMult < 1) logText += " (Not very effective)";
                  
                  this.addLog(logText);
                  this.addLog(`🛡️ ${attackerName} is now shielded for ${ability.shieldDuration} turns (blocks ${Math.floor(ability.shieldPercent * 100)}% damage)!`);
                  
                  if (this.enemyPet.currentHP <= 0) {
                      UIManager.updateBattleScreen();
                      this.endBattle(true);
                      return;
                  }
              }
              
this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
           
           // Vine Lash implementation (vineSnake ability)
           if (ability.name === "Vine Lash" && ability.speedDrop) {
               if (this.playerAbilityCooldown > 0) return;
               
               const specialStat = this.playerPet.stats.special;
               const baseDamage = specialStat + 2;
               const defenderTemplate = PetTypes[this.enemyPet.typeId];
               const typeMult = this.getTypeEffectiveness("grass", defenderTemplate.type);
               let rawDmg = Math.floor((baseDamage * 40) / Math.max(1, defenderTemplate.stats.defense));
               rawDmg = Math.floor(rawDmg * typeMult);
               rawDmg = Math.floor(rawDmg * 0.25);
               
               this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - rawDmg);
               this.enemyStatMods.speed = Math.max(-6, this.enemyStatMods.speed - 1);
               
               const attackerName = this.getPetName(this.playerPet);
               const defenderName = this.getPetName(this.enemyPet);
               
               let logText = `${attackerName} used ${ability.name}! Deals ${rawDmg} damage to ${defenderName}`;
               if (typeMult > 1) logText += " (Super effective!)";
               else if (typeMult < 1) logText += " (Not very effective)";
               
               this.addLog(logText);
               this.addLog(`${defenderName}'s speed was lowered by 1 stage!`);
               
               if (this.enemyPet.currentHP <= 0) {
                   UIManager.updateBattleScreen();
                   this.endBattle(true);
                   return;
               }
               
               this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
           
           // Hypnosis implementation (dreamOwl ability)
           if (ability.name === "Hypnosis" && ability.confuse) {
               if (this.playerAbilityCooldown > 0) return;
               
               const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
               
               if (result.dodged) {
                   this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
               } else {
                   this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                   
                   const attackerName = this.getPetName(this.playerPet);
                   const defenderName = this.getPetName(this.enemyPet);
                   
                   if (Math.random() < ability.confuseChance) {
                       this.confused = "enemy";
                       this.addLog(`🧠 ${defenderName} is now confused and may skip their next turn!`);
                   }
                   
                   let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                   if (result.isCrit) logText += " (CRITICAL!)";
                   if (result.typeMult > 1) logText += " (Super effective!)";
                   else if (result.typeMult < 1) logText += " (Not very effective)";
                   
                   this.addLog(logText);
                   
                   if (this.enemyPet.currentHP <= 0) {
                       UIManager.updateBattleScreen();
                       this.endBattle(true);
                       return;
                   }
               }
               
               this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
           
           // Life Drain implementation (duskBat ability)
           if (ability.name === "Life Drain" && ability.heal) {
               if (this.playerAbilityCooldown > 0) return;
               
               const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
               
               if (result.dodged) {
                   this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
               } else {
                   this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                   
                   const healAmount = Math.floor(result.damage * ability.healPercent);
                   const playerMaxHP = PetManager.calculateMaxHP(PetTypes[this.playerPet.typeId], this.playerPet.level, this.playerPet);
                   this.playerPet.currentHP = Math.min(playerMaxHP, this.playerPet.currentHP + healAmount);
                   
                   const attackerName = this.getPetName(this.playerPet);
                   const defenderName = this.getPetName(this.enemyPet);
                   
                   let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                   if (result.isCrit) logText += " (CRITICAL!)";
                   if (result.typeMult > 1) logText += " (Super effective!)";
                   else if (result.typeMult < 1) logText += " (Not very effective)";
                   
                   this.addLog(logText);
                   if (healAmount > 0) {
                       this.addLog(`💚 ${attackerName} drains ${healAmount} HP!`);
                   }
                   
                   if (this.enemyPet.currentHP <= 0) {
                       UIManager.updateBattleScreen();
                       this.endBattle(true);
                       return;
                   }
               }
               
               this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
           
           // Fluffy Guard implementation (cloudSheep ability)
           if (ability.name === "Fluffy Guard" && ability.shield) {
               if (this.playerAbilityCooldown > 0) return;
               
               const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
               
               if (result.dodged) {
                   this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
               } else {
                   this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                   
                   this.shield.player = { turns: ability.shieldDuration, percent: ability.shieldPercent };
                   
                   const attackerName = this.getPetName(this.playerPet);
                   const defenderName = this.getPetName(this.enemyPet);
                   
                   let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                   if (result.isCrit) logText += " (CRITICAL!)";
                   if (result.typeMult > 1) logText += " (Super effective!)";
                   else if (result.typeMult < 1) logText += " (Not very effective)";
                   
                   this.addLog(logText);
                   this.addLog(`🛡️ ${attackerName} is now shielded for ${ability.shieldDuration} turn(s) (blocks ${Math.floor(ability.shieldPercent * 100)}% damage)!`);
                   
                   if (this.enemyPet.currentHP <= 0) {
                       UIManager.updateBattleScreen();
                       this.endBattle(true);
                       return;
                   }
               }
               
               this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
           
           // Corrosive Bolt implementation (venomAsp ability)
           if (ability.name === "Corrosive Bolt" && ability.poison) {
               if (this.playerAbilityCooldown > 0) return;
               
               const result = this.calculateSpecialDamage(this.playerPet, this.enemyPet, ability.type);
               
               if (result.dodged) {
                   this.addLog(`${result.dodgerName} dodged ${ability.name}!`);
               } else {
                   this.enemyPet.currentHP = Math.max(0, this.enemyPet.currentHP - result.damage);
                   
                   this.poisoned = "enemy";
                   this.poisonDuration.enemy = ability.poisonDuration;
                   
                   const attackerName = this.getPetName(this.playerPet);
                   const defenderName = this.getPetName(this.enemyPet);
                   
                   let logText = `${attackerName} used ${ability.name}! Deals ${result.damage} damage to ${defenderName}`;
                   if (result.isCrit) logText += " (CRITICAL!)";
                   if (result.typeMult > 1) logText += " (Super effective!)";
                   else if (result.typeMult < 1) logText += " (Not very effective)";
                   
                   this.addLog(logText);
                   this.addLog(`☠️ ${defenderName} is now poisoned for ${ability.poisonDuration} turns!`);
                   
                   if (this.enemyPet.currentHP <= 0) {
                       UIManager.updateBattleScreen();
                       this.endBattle(true);
                       return;
                   }
               }
               
               this.playerAbilityCooldown = ability.cooldown;
               this.isPlayerTurn = false;
               UIManager.updateBattleScreen();
               
               setTimeout(() => this.enemyTurn(), 1000);
           }
       },
  
      addLog(text) {
        this.battleLog.unshift({ text, time: new Date().toLocaleTimeString() });
        if (this.battleLog.length > 20) this.battleLog.pop();
    },

    endBattle(playerWon) {
        this.active = false;
        
        const petXPReward = this.enemyPet.level * 20;
        const moneyReward = this.enemyPet.level * 20;
        
        if (playerWon) {
            this.petsDefeated = this.petsDefeated + 1;
            PlayerSystem.totalBattles++;
            PlayerSystem.battleStreak++;
            if (PlayerSystem.battleStreak > PlayerSystem.bestStreak) {
                PlayerSystem.bestStreak = PlayerSystem.battleStreak;
            }
            
            // Win streak bonus multiplier (player XP only)
            const streakMultiplier = 1 + Math.min(PlayerSystem.battleStreak * 0.1, 1.0);
            
            // Type advantage bonus (player XP only)
            const playerTemplate = PetTypes[this.playerPet.typeId];
            const enemyTemplate = PetTypes[this.enemyPet.typeId];
            const typeMult = this.getTypeEffectiveness(playerTemplate.type, enemyTemplate.type);
            const typeAdvantageMultiplier = typeMult > 1 ? 1.2 : 1;
            
            // Player XP (per plan: enemy.level * 10, with streak & type bonuses)
            const playerBaseXP = this.enemyPet.level * 10;
            const totalXP = Math.floor(playerBaseXP * streakMultiplier * typeAdvantageMultiplier);
            const playerLevelUp = addXP(totalXP);
            
            this.addLog(`🎉 Victory! +${totalXP} XP, +${moneyReward} Gold`);
            if (playerLevelUp) {
                this.addLog(`⬆ Player Level Up! Now level ${PlayerSystem.level}`);
            }
            
            // Update actual player pet with full XP
            const actualPet = PetManager.pets.find(p => String(p.id) === String(this.playerPet.id));
            if (actualPet) {
                const oldMaxHP = PetManager.calculateMaxHP(PetTypes[actualPet.typeId], actualPet.level, actualPet);
                const hpPercent = this.playerPet.currentHP / oldMaxHP;
                PetManager.gainXP(actualPet, petXPReward);
                const newMaxHP = PetManager.calculateMaxHP(PetTypes[actualPet.typeId], actualPet.level, actualPet);
                actualPet.currentHP = Math.floor(newMaxHP * hpPercent);
            }
            
            Economy.money += moneyReward;
            
            // 10% chance to drop an XP Orb when defeating a wild pet
            if (Math.random() < 0.10) {
                Economy.inventory.xpOrb = (Economy.inventory.xpOrb || 0) + 1;
                this.addLog("✨ Found an XP Orb!");
            }
            
            // 5% chance to drop a Rare XP Orb when defeating a wild pet over level 30
            if (this.enemyPet.level > 30 && Math.random() < 0.05) {
                Economy.inventory.rareXpOrb = (Economy.inventory.rareXpOrb || 0) + 1;
                this.addLog("✨ Found a Rare XP Orb!");
            }
        } else {
            PlayerSystem.battleStreak = 0;
            PlayerSystem.totalBattles++;
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
            UIManager.updateTeamPower();
            UIManager.updatePlayerLevelDisplay();
        }, 500);
    },

    tryCatch(wildPet) {
        const catchRate = (1 - (wildPet.currentHP / PetManager.calculateMaxHP(PetTypes[wildPet.typeId], wildPet.level, wildPet))) * 0.5 + 0.1;
        
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
    guaranteedPerfectNextStop: false,
    extraMissesNextSession: false,

    startTraining() {
        this.sessionXP = 0;
        this.missCount = 0;
        this.speed = 0.7;
        this.running = true;
        this.markerPos = 0;
        this.direction = 1;
        this.maxMisses = this.extraMissesNextSession ? 5 : 3;
        this.extraMissesNextSession = false;

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
        
        if (this.guaranteedPerfectNextStop || (this.markerPos >= 47 && this.markerPos <= 53)) {
            if (this.guaranteedPerfectNextStop) {
                this.guaranteedPerfectNextStop = false;
                text = "🌟 PERFECT +50 (Guaranteed!)";
            } else {
                text = "🌟 PERFECT +50";
            }
            xp = 50;
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
        
        // Award player XP (half of training session XP)
        const playerXP = Math.floor(this.sessionXP * 0.5);
        if (playerXP > 0) {
            addXP(playerXP);
        }
        
        PlayerSystem.totalTrainings++;
        
        DataManager.save();
        
        setTimeout(() => {
            alert(message);
            UIManager.showScreen("petScreen");
            UIManager.updatePetScreen();
            UIManager.renderPets();
            UIManager.updatePlayerLevelDisplay();
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
        UIManager.updateTeamPower();
        
        if (!this.hasStarter) {
            UIManager.renderStarterSelection();
            UIManager.showScreen("starterScreen");
        } else {
            UIManager.showScreen("mainScreen");
            UIManager.renderPets();
            UIManager.updateTeamPower();
        }
    },

    selectStarter(typeId) {
        const pet = PetManager.createPet(typeId, 1);
        PetManager.pets.push(pet);
        PetManager.selectedPet = pet;
        this.hasStarter = true;
        DataManager.save();
        
        UIManager.showScreen("mainScreen");
        UIManager.renderPets();
        UIManager.updateTeamPower();
    }
};

// ==================== TEAM POWER ====================
const TeamPowerSystem = {
    calculatePetPower(pet) {
        const template = PetTypes[pet.typeId];
        if (!template || !pet.stats) return 0;
        const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
        return maxHP + pet.stats.attack + pet.stats.defense + pet.stats.speed + pet.stats.special + (pet.level * 5);
    },

    getTotalPower() {
        let total = 0;
        PetManager.pets.forEach(pet => total += this.calculatePetPower(pet));
        PetManager.storage.forEach(pet => total += this.calculatePetPower(pet));
        return total;
    },

    getPartyPower() {
        let total = 0;
        PetManager.pets.forEach(pet => total += this.calculatePetPower(pet));
        return total;
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
        this.updatePlayerLevelDisplay();
    },

    updateCurrency() {
        document.getElementById("currencyDisplay").innerHTML = `💰 <span>${Economy.money}</span>`;
    },

    updateTeamPower() {
        const total = TeamPowerSystem.getTotalPower();
        const party = TeamPowerSystem.getPartyPower();
        document.getElementById("teamPowerDisplay").innerHTML = `⚔️ Total: <span>${total}</span>`;
        document.getElementById("partyPowerDisplay").innerHTML = `🛡️ Party: <span>${party}</span>`;
    },

    updatePlayerLevelDisplay() {
        const levelDisplay = document.getElementById("playerLevelDisplay");
        const xpBarDisplay = document.getElementById("playerXpBar");
        const xpTextDisplay = document.getElementById("playerXpText");
        const profileBtn = document.getElementById("profileBtn");
        if (levelDisplay) {
            levelDisplay.innerText = `Lv ${PlayerSystem.level}`;
        }
        if (profileBtn) {
            profileBtn.innerText = PlayerSystem.level;
        }
        if (xpBarDisplay) {
            const needed = xpNeeded(PlayerSystem.level);
            const xpPercent = (PlayerSystem.xp / needed) * 100;
            xpBarDisplay.style.width = xpPercent + "%";
            if (xpTextDisplay) {
                xpTextDisplay.innerText = `${PlayerSystem.xp}/${needed}`;
            }
        }
    },

    toggleProfile() {
        const overlay = document.getElementById("profileOverlay");
        if (!overlay) return;
        const isHidden = overlay.classList.contains("hidden");
        if (isHidden) {
            this.updateProfileStats();
            overlay.classList.remove("hidden");
        } else {
            overlay.classList.add("hidden");
        }
    },

    updateProfileStats() {
        const container = document.getElementById("profileStats");
        if (!container) return;

        const partyCount = PetManager.pets.length;
        const totalCount = PetManager.pets.length + PetManager.storage.length;
        const totalPower = TeamPowerSystem.getTotalPower();
        const partyPower = TeamPowerSystem.getPartyPower();
        const zonesUnlocked = PlayerSystem.unlockedZones.length;

        const stats = [
            { label: "Level", value: PlayerSystem.level, color: "" },
            { label: "XP", value: `${PlayerSystem.xp} / ${xpNeeded(PlayerSystem.level)}`, color: "" },
            { label: "Party Pets", value: `${partyCount} / ${PetManager.maxPartySize}`, color: "" },
            { label: "Total Pets", value: `${totalCount} / ${PetManager.maxTotalPets}`, color: "" },
            { label: "Total Catches", value: PlayerSystem.totalCatches, color: "" },
            { label: "Total Battles", value: PlayerSystem.totalBattles, color: "" },
            { label: "Best Streak", value: PlayerSystem.bestStreak, color: "" },
            { label: "Total Trainings", value: PlayerSystem.totalTrainings, color: "" },
            { label: "Total Explores", value: PlayerSystem.totalExplores, color: "" },
            { label: "Zones Unlocked", value: `${zonesUnlocked} / ${Object.keys(Exploration.zones).length}`, color: "" },
            { label: "Total Power", value: totalPower, color: "text-yellow-400" },
            { label: "Party Power", value: partyPower, color: "text-blue-400" },
        ];

        container.innerHTML = stats
            .map(s => `<div class="flex justify-between"><span>${s.label}</span><span class="${s.color} font-bold">${s.value}</span></div>`)
            .join("");
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
                <p class="text-xs mt-2.5">${template.passive}</p>
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
            poison: "bg-fuchsia-700",
            normal: "bg-gray-400 text-gray-900"
        };
        return colors[type] || "bg-gray-400 text-gray-900";
    },

    getTierColorClass(tier) {
        const rank = tier.charAt(0);
        const colors = {
            D: "bg-gray-500",
            C: "bg-green-500",
            B: "bg-blue-500",
            A: "bg-purple-500",
            S: "bg-yellow-400 text-gray-900"
        };
        return colors[rank] || "bg-gray-500";
    },

    toRoman(num) {
        const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
            "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
        return roman[num] || `[${num}]`;
    },

    // Main Screen
    renderPets() {
        const list = document.getElementById("petList");
        list.innerHTML = "";
        
        document.getElementById("partyCount").innerText = PetManager.pets.length;
        
        PetManager.pets.forEach(pet => {
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            const xpNeeded = PetManager.xpNeeded(pet.level);
            const xpPercent = (pet.xp / xpNeeded) * 100;
            
            const prestigeSuffix = pet.prestigeLevel > 0 ? (pet.prestigeLevel >= 10 ? ` [P${pet.prestigeLevel}]` : ` ${this.toRoman(pet.prestigeLevel)}`) : "";
            const prestigeBorder = pet.prestigeLevel > 0 ? (pet.prestigeLevel === 1 ? "border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]") : "";
            const shinySuffix = pet.shiny ? " ✨" : "";
            const shinyBorder = pet.shiny ? "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]" : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>`;
            const tierBorder = pet.tier.startsWith("S") ? "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]" :
                               pet.tier.startsWith("A") ? "border-2 border-purple-400" :
                               pet.tier.startsWith("B") ? "border-2 border-blue-400" :
                               pet.tier.startsWith("C") ? "border-2 border-green-400" :
                               "border-2 border-gray-500";
            
            const card = document.createElement("div");
            card.className = `w-full max-w-md mx-auto bg-white/10 rounded-2xl p-3.5 my-2.5 ${prestigeBorder} ${shinyBorder} ${tierBorder}`;
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}${shinySuffix}${prestigeSuffix}</h3>
                ${tierBadge}
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                ${pet.prestigeLevel > 0 ? `<div class="text-purple-300 text-sm font-bold">⭐ Prestige ${pet.prestigeLevel}</div>` : ""}
                ${pet.shiny ? `<div class="text-yellow-300 text-sm font-bold">✨ Shiny</div>` : ""}
                ${Array.isArray(pet.equipment) && pet.equipment.length > 0 ? pet.equipment.map(itemId => `<div class="text-green-300 text-sm font-bold">🎒 ${Economy.shopItems[itemId]?.name || ""}</div>`).join("") : ""}
                <div class="opacity-90 text-sm">Tier: ${pet.tier} (+${pet.tierBonus} all stats)</div>
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
                <button onclick="UIManager.sellPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Sell (${pet.level * 25 + (pet.prestigeLevel || 0) * 1000 + (pet.shiny ? 5000 : 0) + TierSystem.getTierSellValue(pet.tier)}💰)</button>
            `;
            list.appendChild(card);
        });
        this.updateTeamPower();
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
        const sellValue = pet.level * 25 + (pet.prestigeLevel || 0) * 1000 + (pet.shiny ? 5000 : 0) + TierSystem.getTierSellValue(pet.tier);
        if (confirm(`Sell ${PetTypes[pet.typeId].name} for ${sellValue} gold?`)) {
            Economy.sellPet(pet);
            DataManager.save();
            this.renderPets();
            this.renderStorage();
            this.updateCurrency();
            this.updateTeamPower();
        }
    },

    // Pet Detail Screen
    updatePetScreen() {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        
        const template = PetTypes[pet.typeId];
        const evolution = PetManager.getEvolution(pet);
        const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
        const xpNeeded = PetManager.xpNeeded(pet.level);
        
        document.getElementById("petTitle").innerText = template.name;
        document.getElementById("petEvolution").innerText = `${template.emoji} ${evolution}${pet.prestigeLevel > 0 ? ` ${this.toRoman(pet.prestigeLevel)}` : ""}${pet.shiny ? " ✨" : ""}`;
        document.getElementById("petLevel").innerText = `Level ${pet.level}`;
        document.getElementById("petXP").innerText = `XP ${pet.xp}/${xpNeeded}`;
        document.getElementById("petXPFill").style.width = (pet.xp / xpNeeded) * 100 + "%";
        
        document.getElementById("petStats").innerHTML = `
            <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
            <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>
            <br><br>
            ${pet.prestigeLevel > 0 ? `<div class="text-purple-300 font-bold">⭐ Prestige ${pet.prestigeLevel}</div><div class="text-purple-300 text-xs">+${pet.bonusStats.hp} HP | +${pet.bonusStats.attack} ATK | +${pet.bonusStats.defense} DEF | +${pet.bonusStats.speed} SPD | +${pet.bonusStats.special} SPC</div><br>` : ""}
            ${pet.shiny ? `<div class="text-yellow-300 font-bold">✨ Shiny</div><div class="text-yellow-300 text-xs">+${pet.shinyBonus.hp} HP | +${pet.shinyBonus.attack} ATK | +${pet.shinyBonus.defense} DEF | +${pet.shinyBonus.speed} SPD | +${pet.shinyBonus.special} SPC</div><br>` : ""}
            <div class="opacity-90 text-sm">Tier Bonus: +${pet.tierBonus || 0}%</div>
            ${Array.isArray(pet.equipment) && pet.equipment.length > 0 ? `<div class="opacity-90 text-sm">Equipment:</div>` : ""}
            ${Array.isArray(pet.equipment) ? pet.equipment.map((itemId, idx) => {
                const item = Economy.shopItems[itemId];
                if (!item) return "";
                const statsText = item.stats ? Object.entries(item.stats).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(" | ") : "";
                return `<div class="opacity-90 text-sm">${item.name} <span class="text-xs">(${statsText})</span> <button onclick="UIManager.unequipPet('${itemId}')" class="text-red-400 text-xs ml-2">[Unequip]</button></div>`;
            }).join("") : ""}
            <div class="opacity-90 text-sm">HP: ${pet.currentHP}/${maxHP}</div>
            <div class="opacity-90 text-sm">Attack: ${pet.stats.attack}</div>
            <div class="opacity-90 text-sm">Defense: ${pet.stats.defense}</div>
            <div class="opacity-90 text-sm">Speed: ${pet.stats.speed}</div>
            <div class="opacity-90 text-sm">Special: ${pet.stats.special}</div>
            <br>
            <div class="opacity-90 text-xs">passive: ${template.passive}</div>
        `;
        
        const hasSameRaceAlive = PetManager.pets.some(p => String(p.id) !== String(pet.id) && p.typeId === pet.typeId && p.currentHP > 0) ||
                                 PetManager.storage.some(p => p.typeId === pet.typeId && p.currentHP > 0);
        const prestigeBtn = document.getElementById("prestigeBtn");
        if (prestigeBtn) {
            prestigeBtn.style.display = (hasSameRaceAlive) ? "inline-block" : "none";
        }
        
        const upgradeBtn = document.getElementById("upgradeTierBtn");
        if (upgradeBtn) {
            const nextTier = TierSystem.getNextTier(pet.tier);
            const cost = TierSystem.getUpgradeCost(pet.tier);
            const stones = TierSystem.getUpgradeStones(pet.tier);
            upgradeBtn.style.display = (pet.tier !== "S5") ? "inline-block" : "none";
            upgradeBtn.innerText = pet.tier !== "S5" ? `⬆ Upgrade Tier (${cost}💰 + ${stones} stones)` : "Max Tier";
            upgradeBtn.onclick = () => this.upgradeTier(pet.id);
        }
        
        const equipBtn = document.getElementById("equipBtn");
        if (equipBtn) {
            const hasEquipmentInInventory = Economy.inventory.bandOfSwiftness > 0 || Economy.inventory.toughCollar > 0 || Economy.inventory.focusBand > 0 || Economy.inventory.lifeBangle > 0 || Economy.inventory.attackSunglasses > 0;
            const hasFreeSlot = !Array.isArray(pet.equipment) || pet.equipment.length < 6;
            equipBtn.style.display = (hasFreeSlot && hasEquipmentInInventory) ? "inline-block" : "none";
        }
        const unequipBtn = document.getElementById("unequipBtn");
        if (unequipBtn) {
            unequipBtn.style.display = (Array.isArray(pet.equipment) && pet.equipment.length > 0) ? "inline-block" : "none";
        }
        
        const canTrain = TrainingSystem.canTrain(pet);
        const cooldown = TrainingSystem.getCooldownRemaining(pet);
        const trainBtn = document.getElementById("trainBtn");
        trainBtn.disabled = !canTrain;
        trainBtn.innerText = canTrain ? "🎯 Train" : `⏳ ${cooldown}s`;
        
const useXPOrb = document.getElementById("useXPOrb");
if (useXPOrb) {
useXPOrb.style.display = (Economy.inventory.xpOrb > 0) ? "inline-block" : "none";
}
const useRareXpOrb = document.getElementById("useRareXpOrb");
if (useRareXpOrb) {
useRareXpOrb.style.display = (Economy.inventory.rareXpOrb > 0) ? "inline-block" : "none";
}
        const usePrecision = document.getElementById("usePrecision");
        if (usePrecision) {
            usePrecision.style.display = (Economy.inventory.precisionGuide > 0) ? "inline-block" : "none";
        }
        const useFocusIncense = document.getElementById("useFocusIncense");
        if (useFocusIncense) {
            useFocusIncense.style.display = (Economy.inventory.focusIncense > 0) ? "inline-block" : "none";
        }
        
        this.updateTeamPower();
    },
    
    upgradeTier(petId) {
        const validation = TierSystem.canUpgradeTier(petId);
        if (!validation.valid) {
            alert(validation.reason);
            return;
        }
        
        if (!confirm(`Upgrade to ${validation.nextTier}?\nCost: ${validation.cost} gold + ${validation.stones} Tier Stones`)) {
            return;
        }
        
        const result = TierSystem.upgradeTier(petId);
        if (result.success) {
            DataManager.save();
            this.updatePetScreen();
            this.renderPets();
            this.updateTeamPower();
            alert(`✨ Upgraded to ${result.nextTier}!`);
        }
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
        Exploration.cooldowns = {};
        const grid = document.getElementById("zoneGrid");
        grid.innerHTML = "";
        
        for (const [zoneId, zone] of Object.entries(Exploration.zones)) {
            const cooldown = Exploration.getCooldownRemaining(zoneId);
            const isLocked = PlayerSystem.level < zone.unlockLevel;
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${cooldown > 0 || isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-white/12 hover:-translate-y-1"}`;
            card.innerHTML = `
                <div class="text-5xl">${zone.emoji}</div>
                <h3>${zone.name}</h3>
                <p class="text-xs">Encounter Rate: ${(zone.encounterRate * 100).toFixed(0)}%</p>
                ${cooldown > 0 ? `<p class="text-red-400">Cooldown: ${cooldown}s</p>` : ""}
                ${isLocked ? `<p class="text-red-400 text-xs mt-1">🔒 Unlock at Lv ${zone.unlockLevel}</p>` : ""}
                ${!isLocked && cooldown === 0 ? `<p class="text-green-400 text-xs mt-1">Tap to select floor</p>` : ""}
            `;
            
            if (cooldown === 0 && !isLocked) {
                card.onclick = () => this.showFloorOverlay(zoneId);
            }
            
            grid.appendChild(card);
        }
    },

    exploreZone(zoneId) {
        if (!PetManager.selectedPet) {
            alert("Select a pet first!");
            return;
        }
        
        const zone = Exploration.zones[zoneId];
        if (PlayerSystem.level < zone.unlockLevel) {
            alert(`Reach player level ${zone.unlockLevel} to unlock ${zone.name}!`);
            return;
        }
        
        // Open floor overlay for zone selection
        this.showFloorOverlay(zoneId);
    },

    showFloorOverlay(zoneId) {
        Exploration.selectedZoneId = zoneId;
        Exploration.floorPage = 0;
        this.renderFloorOverlay();
        document.getElementById("floorOverlay").classList.remove("hidden");
    },

    renderFloorOverlay() {
        const zoneId = Exploration.selectedZoneId;
        const zone = Exploration.zones[zoneId];
        const grid = document.getElementById("floorGrid");
        grid.innerHTML = "";
        
        const floorsPerPage = 10;
        const totalPages = Math.ceil(zone.maxFloor / floorsPerPage);
        const startFloor = Exploration.floorPage * floorsPerPage + 1;
        const endFloor = Math.min(startFloor + floorsPerPage - 1, zone.maxFloor);
        
        for (let i = startFloor; i <= endFloor; i++) {
            const floorMin = (i - 1) * zone.floorSize + 1;
            const floorMax = i * zone.floorSize;
            const isLocked = PlayerSystem.level < floorMin;
            const isRecommended = PlayerSystem.level >= floorMin && PlayerSystem.level <= floorMax;
            
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-3 text-center cursor-pointer transition-all duration-150 ${isLocked ? "opacity-40 cursor-not-allowed" : "hover:bg-white/12 hover:-translate-y-0.5"} ${isRecommended ? "border-2 border-green-400" : ""}`;
            card.innerHTML = `
                <div class="text-lg font-bold">Floor ${i}</div>
                <div class="text-xs opacity-70">Levels ${floorMin}-${floorMax}</div>
                ${isLocked ? `<div class="text-red-400 text-xs mt-1">🔒 Requires Lv ${floorMin}</div>` : ""}
                ${isRecommended ? `<div class="text-green-400 text-xs mt-1">⭐ Recommended</div>` : ""}
            `;
            
            if (!isLocked) {
                card.onclick = () => {
                    document.getElementById("floorOverlay").classList.add("hidden");
                    this.doExploreWithFloor(zoneId, i);
                };
            }
            
            grid.appendChild(card);
        }
        
        // Update page info
        document.getElementById("floorPageInfo").innerText = `Page ${Exploration.floorPage + 1}/${totalPages}`;
        document.getElementById("floorPrevBtn").disabled = Exploration.floorPage === 0;
        document.getElementById("floorNextBtn").disabled = Exploration.floorPage >= totalPages - 1;
        document.getElementById("floorZoneName").innerText = `Floors — ${zone.emoji} ${zone.name}`;
    },

    floorPrevPage() {
        if (Exploration.floorPage > 0) {
            Exploration.floorPage--;
            this.renderFloorOverlay();
        }
    },

    floorNextPage() {
        const zone = Exploration.zones[Exploration.selectedZoneId];
        if (zone) {
            const totalPages = Math.ceil(zone.maxFloor / 10);
            if (Exploration.floorPage < totalPages - 1) {
                Exploration.floorPage++;
                this.renderFloorOverlay();
            }
        }
    },

    doExploreWithFloor(zoneId, floorIndex) {
        const result = Exploration.explore(zoneId, floorIndex);
        this.renderExploration();
        
        if (result && result.pet && result.pet.stats) {
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
        const playerMaxHP = PetManager.calculateMaxHP(playerTemplate, player.level, player);
        const enemyMaxHP = PetManager.calculateMaxHP(enemyTemplate, enemy.level, enemy);
        
        document.getElementById("playerPetSprite").innerText = playerTemplate.emoji;
        document.getElementById("enemyPetSprite").innerText = enemyTemplate.emoji;
        document.getElementById("playerPetName").innerText = PetManager.getEvolution(player) + (BattleSystem.bleeding === "player" ? " 🩸" : "") + (BattleSystem.burning === "player" ? " 🔥" + (BattleSystem.burnDuration.player > 0 && BattleSystem.burnDuration.player < 9999 ? BattleSystem.burnDuration.player : "") : "") + (BattleSystem.confused === "player" ? " 🧠" : "") + (BattleSystem.shield.player.turns > 0 ? " 🛡️" : "") + (BattleSystem.poisoned === "player" ? " ☠️" : "");
        document.getElementById("playerTier").innerText = `Tier: ${player.tier || "D1"}`;
        document.getElementById("enemyPetName").innerText = (enemy.shiny ? "✨ " : "") + PetManager.getEvolution(enemy) + (BattleSystem.bleeding === "enemy" ? " 🩸" : "") + (BattleSystem.burning === "enemy" ? " 🔥" + (BattleSystem.burnDuration.enemy > 0 && BattleSystem.burnDuration.enemy < 9999 ? BattleSystem.burnDuration.enemy : "") : "") + (BattleSystem.confused === "enemy" ? " 🧠" : "") + (BattleSystem.shield.enemy.turns > 0 ? " 🛡️" : "") + (BattleSystem.poisoned === "enemy" ? " ☠️" : "");
        document.getElementById("enemyTier").innerText = `Tier: ${enemy.tier || "D1"}` + (enemy.shiny ? " ✨" : "");
        document.getElementById("enemyPetLevel").innerText = `Level ${enemy.level}`;
        
        if (enemy.shiny) {
            document.getElementById("enemyPetSprite").className = "text-6xl my-2.5 animate-pulse";
        } else {
            document.getElementById("enemyPetSprite").className = "text-6xl my-2.5";
        }
        
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
        const abilityBtn = document.getElementById("abilityBtn");
        const switchBtn = document.getElementById("switchBtn");
        const catchBtn = document.getElementById("catchBtn");
        
        const hasAbility = playerTemplate && playerTemplate.ability;
        const abilityOnCooldown = BattleSystem.playerAbilityCooldown > 0;
        
        if (hasAbility && !abilityOnCooldown) {
            abilityBtn.style.display = BattleSystem.isPlayerTurn ? "inline-block" : "none";
            abilityBtn.disabled = !BattleSystem.isPlayerTurn;
            abilityBtn.innerText = abilityOnCooldown ? `⏳ ${BattleSystem.playerAbilityCooldown}` : `✨ ${playerTemplate.ability.name}`;
        } else {
            abilityBtn.style.display = "none";
        }
        
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
            const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            
            const prestigeSuffix = pet.prestigeLevel > 0 ? (pet.prestigeLevel >= 10 ? ` [P${pet.prestigeLevel}]` : ` ${this.toRoman(pet.prestigeLevel)}`) : "";
            const prestigeBorder = pet.prestigeLevel > 0 ? (pet.prestigeLevel === 1 ? "border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]") : "";
            const shinySuffix = pet.shiny ? " ✨" : "";
            const shinyBorder = pet.shiny ? "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]" : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>`;
            
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all ${prestigeBorder} ${shinyBorder}`;
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}${shinySuffix}${prestigeSuffix}</h3>
                ${tierBadge}
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                ${pet.prestigeLevel > 0 ? `<div class="text-purple-300 text-sm font-bold">⭐ Prestige ${pet.prestigeLevel}</div>` : ""}
                ${pet.shiny ? `<div class="text-yellow-300 text-sm font-bold">✨ Shiny</div>` : ""}
                ${Array.isArray(pet.equipment) && pet.equipment.length > 0 ? pet.equipment.map(itemId => `<div class="text-green-300 text-sm font-bold">🎒 ${Economy.shopItems[itemId]?.name || ""}</div>`).join("") : ""}
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
            this.updateTeamPower();
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
        this.updateTeamPower();
    },

    // Shop Screen
    renderShop() {
        const grid = document.getElementById("shopGrid");
        grid.innerHTML = "";
        
        const typeLabels = {
            catch: "Catch Item",
            heal: "Healing Item",
            upgrade: "Upgrade Item",
            xp: "Training Item",
            training: "Training Item",
            equipment: "Equipment"
        };
        
        for (const [itemId, item] of Object.entries(Economy.shopItems)) {
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center";
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p class="text-xs">${typeLabels[item.type] || item.type}</p>
                <div class="text-yellow-400 font-bold my-2.5">${item.price} 💰</div>
                <div>Owned: ${Economy.inventory[itemId] || 0}</div>
                <input type="number" id="qty-${itemId}" value="1" min="1" class="w-16 text-center rounded px-1 py-1 mb-2 text-black">
                <button onclick="UIManager.buyItem('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Buy</button>
                <button onclick="UIManager.buyItemMax('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-green-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Buy Max</button>
            `;
            grid.appendChild(card);
        }
    },

    buyItem(itemId) {
        const qtyInput = document.getElementById(`qty-${itemId}`);
        const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        if (qty <= 0) return;
        
        if (Economy.buyItem(itemId, qty)) {
            DataManager.save();
            this.renderShop();
            this.updateCurrency();
            this.updateTeamPower();
        } else {
            alert("Not enough money!");
        }
    },

    buyItemMax(itemId) {
        const item = Economy.shopItems[itemId];
        if (!item) return;
        
        const maxAffordable = Math.floor(Economy.money / item.price);
        if (maxAffordable <= 0) {
            alert("Not enough money!");
            return;
        }
        
        if (confirm(`Buy max ${maxAffordable} ${item.name} for ${maxAffordable * item.price} gold?`)) {
            if (Economy.buyItem(itemId, maxAffordable)) {
                DataManager.save();
                this.renderShop();
                this.updateCurrency();
                this.updateTeamPower();
            } else {
                alert("Not enough money!");
            }
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
                ${item.type === "heal" || item.type === "xp" || item.type === "training" ? `<button onclick="UIManager.useItemForPet('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Use</button>` : ""}
                ${item.type === "equipment" ? `<button onclick="UIManager.equipPet('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-green-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Equip</button>` : ""}
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

    useItemForPet(itemId) {
        const pet = PetManager.selectedPet;
        if (!pet) {
            alert("Select a pet first!");
            return;
        }

        const item = Economy.shopItems[itemId];
        if (!item) {
            alert("Unknown item!");
            return;
        }

        let qty = 1;
        if (item.type === "xp" || item.type === "heal" || item.type === "training") {
            const owned = Economy.inventory[itemId] || 0;
            const input = prompt(`How many ${item.name}(s) to use? (You have ${owned})`, "1");
            if (input === null) return; // Cancelled
            qty = parseInt(input, 10);
            if (isNaN(qty) || qty < 1) {
                alert("Invalid quantity!");
                return;
            }
            if (qty > owned) {
                alert(`You only have ${owned} ${item.name}(s)!`);
                return;
            }
        }

        if (Economy.useItem(itemId, pet, qty)) {
            DataManager.save();
            this.updatePetScreen();
            this.renderInventory();
            this.updateTeamPower();
        } else {
            alert("Can't use that item!");
        }
    },

    equipPet(itemId) {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        const result = EquipmentSystem.equip(pet.id, itemId);
        if (result.success) {
            DataManager.save();
            this.updatePetScreen();
            this.renderPets();
            this.updateTeamPower();
        } else {
            alert(result.reason);
        }
    },

    unequipPet(itemId) {
        const pet = PetManager.selectedPet;
        if (!pet) return;
        const result = EquipmentSystem.unequip(pet.id, itemId);
        if (result.success) {
            DataManager.save();
            this.updatePetScreen();
            this.renderPets();
            this.updateTeamPower();
        } else {
            alert(result.reason);
        }
    },

    openEquipOverlay() {
        const pet = PetManager.selectedPet;
        if (!pet) {
            alert("Select a pet first!");
            return;
        }
        
        this.equipPetId = pet.id;
        document.getElementById("equipPetInfo").innerText = `Equip accessory on ${PetTypes[pet.typeId].emoji} ${PetManager.getEvolution(pet)}`;
        
        const grid = document.getElementById("equipGrid");
        grid.innerHTML = "";
        
        for (const [itemId, count] of Object.entries(Economy.inventory)) {
            if (count <= 0) continue;
            const item = Economy.shopItems[itemId];
            if (!item || item.type !== "equipment") continue;
            
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all";
            const statsText = item.stats ? Object.entries(item.stats).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(" | ") : "";
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p class="text-xs">${statsText}</p>
                <button onclick="UIManager.equipPet('${itemId}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-green-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Equip</button>
            `;
            card.onclick = (e) => {
                if (e.target.tagName !== "BUTTON") {
                    UIManager.equipPet(itemId);
                }
            };
            grid.appendChild(card);
        }
        
        document.getElementById("equipOverlay").classList.remove("hidden");
    },

    closeEquipOverlay() {
        document.getElementById("equipOverlay").classList.add("hidden");
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
            const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            const xpNeeded = PetManager.xpNeeded(pet.level);
            const xpPercent = (pet.xp / xpNeeded) * 100;
            
            const prestigeSuffix = pet.prestigeLevel > 0 ? (pet.prestigeLevel >= 10 ? ` [P${pet.prestigeLevel}]` : ` ${this.toRoman(pet.prestigeLevel)}`) : "";
            const prestigeBorder = pet.prestigeLevel > 0 ? (pet.prestigeLevel === 1 ? "border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]") : "";
            const shinySuffix = pet.shiny ? " ✨" : "";
            const shinyBorder = pet.shiny ? "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]" : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>`;
            const tierBorder = pet.tier.startsWith("S") ? "border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.7)]" :
                               pet.tier.startsWith("A") ? "border-2 border-purple-400" :
                               pet.tier.startsWith("B") ? "border-2 border-blue-400" :
                               pet.tier.startsWith("C") ? "border-2 border-green-400" :
                               "border-2 border-gray-500";
            
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-4 text-center ${prestigeBorder} ${shinyBorder} ${tierBorder}`;
            card.innerHTML = `
                <h3>${template.emoji} ${evolution}${shinySuffix}${prestigeSuffix}</h3>
                ${tierBadge}
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                ${pet.prestigeLevel > 0 ? `<div class="text-purple-300 text-sm font-bold">⭐ Prestige ${pet.prestigeLevel}</div>` : ""}
                ${pet.shiny ? `<div class="text-yellow-300 text-sm font-bold">✨ Shiny</div>` : ""}
                ${Array.isArray(pet.equipment) && pet.equipment.length > 0 ? pet.equipment.map(itemId => `<div class="text-green-300 text-sm font-bold">🎒 ${Economy.shopItems[itemId]?.name || ""}</div>`).join("") : ""}
                <div class="opacity-90 text-sm">Tier: ${pet.tier} (+${pet.tierBonus} all stats)</div>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent}%"></div></div>
                <div class="opacity-90 text-sm">HP ${pet.currentHP}/${maxHP}</div>
                <div class="w-full h-4.5 bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300" style="width: ${xpPercent}%"></div></div>
                <div class="opacity-90 text-sm">XP ${pet.xp}/${xpNeeded}</div>
                <button onclick="UIManager.withdrawPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">↩ Withdraw</button>
                <button onclick="UIManager.sellPet('${pet.id}')" class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-blue-800 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5">Sell (${pet.level * 25 + (pet.prestigeLevel || 0) * 1000 + (pet.shiny ? 5000 : 0) + TierSystem.getTierSellValue(pet.tier)}💰)</button>
            `;
            grid.appendChild(card);
        });
        this.updateTeamPower();
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
        this.updateTeamPower();
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
            this.updateTeamPower();
        }
    },

    // Prestige Fusion
    openPrestige() {
        this.prestigePetId = null;
        this.prestigeStep = 1;
        document.getElementById("prestigeGrid").innerHTML = "";
        document.getElementById("prestigeInfo").classList.add("hidden");
        document.getElementById("prestigeButtons").classList.add("hidden");
        document.getElementById("prestigeStep").innerText = "Step 1: Select the pet to prestige";
        const fuseBtn = document.querySelector('#prestigeButtons button');
        if (fuseBtn) fuseBtn.disabled = false;
        document.getElementById("prestigeOverlay").classList.remove("hidden");
        this.renderPrestigeStep1();
    },

    openPrestigeForSelectedPet() {
        const pet = PetManager.selectedPet;
        if (!pet) {
            alert("Select a pet first!");
            return;
        }
        this.openPrestige();
        this.selectPrestigePet(pet.id);
    },

    openPrestigeForPet(petId) {
        this.openPrestige();
        this.selectPrestigePet(petId);
    },

    renderPrestigeStep1() {
        const grid = document.getElementById("prestigeGrid");
        grid.innerHTML = "";
        
        PetManager.pets.forEach(pet => {
            if (pet.currentHP <= 0) return;
            
            const template = PetTypes[pet.typeId];
            const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            
            const shinySuffix = pet.shiny ? " ✨" : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>`;
            
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all";
            card.innerHTML = `
                <h3>${template.emoji} ${PetManager.getEvolution(pet)}${shinySuffix}</h3>
                ${tierBadge}
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet.level}</div>
                ${pet.prestigeLevel > 0 ? `<div class="text-purple-300 font-bold">Prestige ${pet.prestigeLevel}</div>` : ""}
                ${pet.shiny ? `<div class="text-yellow-300 font-bold">✨ Shiny</div>` : ""}
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent}%"></div>
                </div>
                <div class="opacity-90 text-sm">HP ${pet.currentHP}/${maxHP}</div>
            `;
            card.onclick = () => this.selectPrestigePet(pet.id);
            grid.appendChild(card);
        });
    },

    selectPrestigePet(petId) {
        this.prestigePetId = petId;
        this.prestigeStep = 2;
        const pet = PetManager.pets.find(p => String(p.id) === String(petId)) || 
                    PetManager.storage.find(p => String(p.id) === String(petId));
        if (!pet) return;
        
        const template = PetTypes[pet.typeId];
        document.getElementById("prestigeStep").innerText = "Step 2: Select the material pet to consume (same race, same prestige level)";
        document.getElementById("prestigeInfo").innerHTML = `
            <h3>${template.emoji} ${PetManager.getEvolution(pet)}${pet.prestigeLevel > 0 ? ` ${this.toRoman(pet.prestigeLevel)}` : ""}</h3>
            <p>Level ${pet.level} | ${template.type.toUpperCase()}</p>
            ${pet.prestigeLevel > 0 ? `<p class="text-purple-300">Prestige ${pet.prestigeLevel}</p>` : "<p>No prestige yet</p>"}
        `;
        document.getElementById("prestigeInfo").classList.remove("hidden");
        document.getElementById("prestigeButtons").classList.remove("hidden");
        this.renderPrestigeStep2();
    },

    renderPrestigeStep2() {
        const grid = document.getElementById("prestigeGrid");
        grid.innerHTML = "";
        
        const pet1 = PetManager.pets.find(p => String(p.id) === String(this.prestigePetId)) || 
                     PetManager.storage.find(p => String(p.id) === String(this.prestigePetId));
        if (!pet1) return;
        
        const candidateIds = new Set();
        PetManager.pets.forEach(p => candidateIds.add(p.id));
        PetManager.storage.forEach(p => candidateIds.add(p.id));
        candidateIds.delete(this.prestigePetId);
        
        const template1 = PetTypes[pet1.typeId];
        const maxHP1 = PetManager.calculateMaxHP(template1, pet1.level, pet1);
        const hpPercent1 = (pet1.currentHP / maxHP1) * 100;
        
        Array.from(candidateIds).forEach(id => {
            const pet2 = PetManager.pets.find(p => String(p.id) === String(id)) || 
                         PetManager.storage.find(p => String(p.id) === String(id));
            if (!pet2 || pet2.typeId !== pet1.typeId) return;
            if (pet2.prestigeLevel !== pet1.prestigeLevel) return;
            if (pet2.currentHP <= 0) return;
            
            const template2 = PetTypes[pet2.typeId];
            const maxHP2 = PetManager.calculateMaxHP(template2, pet2.level, pet2);
            const hpPercent2 = (pet2.currentHP / maxHP2) * 100;
            
            const shinySuffix = pet2.shiny ? " ✨" : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet2.tier)}">${pet2.tier}</span>`;
            
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all";
            card.innerHTML = `
                <h3>${template2.emoji} ${PetManager.getEvolution(pet2)}${shinySuffix} ${pet2.prestigeLevel > 0 ? this.toRoman(pet2.prestigeLevel) : ""}</h3>
                ${tierBadge}
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template2.type)}">${template2.type.toUpperCase()}</span>
                <div class="opacity-90 text-sm">Level ${pet2.level}</div>
                ${pet2.prestigeLevel > 0 ? `<div class="text-purple-300 font-bold">Prestige ${pet2.prestigeLevel}</div>` : ""}
                ${pet2.shiny ? `<div class="text-yellow-300 font-bold">✨ Shiny</div>` : ""}
                <div class="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300" style="width: ${hpPercent2}%"></div>
                </div>
                <div class="opacity-90 text-sm">HP ${pet2.currentHP}/${maxHP2}</div>
                <p class="text-xs text-red-300 mt-2">Will be consumed</p>
            `;
            card.onclick = () => this.selectMaterialPet(pet2.id);
            grid.appendChild(card);
        });
    },

    selectMaterialPet(petId) {
        this.prestigeMaterialId = petId;
        document.getElementById("prestigeStep").innerText = "Ready to fuse!";
        document.getElementById("prestigeInfo").classList.add("hidden");
        document.getElementById("prestigeGrid").innerHTML = "";
    },

    confirmPrestige() {
        if (!this.prestigePetId || !this.prestigeMaterialId) {
            alert("Please select both pets!");
            return;
        }
        
        const validation = PetManager.canPrestige(this.prestigePetId, this.prestigeMaterialId);
        if (!validation.valid) {
            alert(validation.reason);
            return;
        }
        
        const fuseBtn = document.querySelector('#prestigeButtons button');
        if (fuseBtn) fuseBtn.disabled = true;
        
        const result = PetManager.prestigeFuse(this.prestigePetId, this.prestigeMaterialId);
        
        if (fuseBtn) fuseBtn.disabled = false;
        
        if (result.success) {
            const pet = result.pet;
            const template = PetTypes[pet.typeId];
            alert(`✨ Prestige ${pet.prestigeLevel} achieved! ${template.name} gained:\n+${pet.bonusStats.hp} HP | +${pet.bonusStats.attack} ATK | +${pet.bonusStats.defense} DEF | +${pet.bonusStats.speed} SPD | +${pet.bonusStats.special} SPC`);
            DataManager.save();
            this.closePrestigeOverlay();
            this.showScreen("mainScreen");
            this.renderPets();
            this.updateTeamPower();
        } else {
            alert(result.reason);
        }
    },

    closePrestigeOverlay() {
        document.getElementById("prestigeOverlay").classList.add("hidden");
        this.prestigePetId = null;
        this.prestigeMaterialId = null;
        this.prestigeStep = 1;
    }
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => Game.init());



