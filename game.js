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
                totalCrafts: PlayerSystem.totalCrafts,
                totalPrestiges: PlayerSystem.totalPrestiges,
                lastDailyBonus: PlayerSystem.lastDailyBonus,
                loginStreak: PlayerSystem.loginStreak,
                lastLoginDate: PlayerSystem.lastLoginDate,
                dailyActivities: Array.from(PlayerSystem.dailyActivities),
                achievements: Array.from(PlayerSystem.achievements),
                partyPresets: PlayerSystem.partyPresets,
                selectedTitle: PlayerSystem.selectedTitle,
                dailyQuests: PlayerSystem.dailyQuests,
                lastQuestReset: PlayerSystem.lastQuestReset
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
            Economy.inventory = data.inventory || { basicBall: 5, potion: 3, tierStone: 0, xpOrb: 0, rareXpOrb: 0, precisionGuide: 0, focusIncense: 0, bandOfSwiftness: 0, toughCollar: 0, focusBand: 0, lifeBangle: 0, attackSunglasses: 0, woodStick: 0, rock: 0, leather: 0, ore: 0, herbs: 0, crystal: 0, darkRock: 0, gem: 0 };
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
                PlayerSystem.unlockedZones = data.player.unlockedZones || ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh", "darkforest"];
                PlayerSystem.totalBattles = data.player.totalBattles || 0;
                PlayerSystem.totalCatches = data.player.totalCatches || 0;
                PlayerSystem.totalTrainings = data.player.totalTrainings || 0;
                PlayerSystem.totalExplores = data.player.totalExplores || 0;
                PlayerSystem.totalCrafts = data.player.totalCrafts || 0;
                PlayerSystem.totalPrestiges = data.player.totalPrestiges || 0;
                PlayerSystem.lastDailyBonus = data.player.lastDailyBonus || null;
                PlayerSystem.loginStreak = data.player.loginStreak || 0;
                PlayerSystem.lastLoginDate = data.player.lastLoginDate || null;
                PlayerSystem.dailyActivities = new Set(Array.isArray(data.player.dailyActivities) ? data.player.dailyActivities : []);
                PlayerSystem.achievements = new Set(Array.isArray(data.player.achievements) ? data.player.achievements : []);
                PlayerSystem.partyPresets = data.player.partyPresets || {};
                PlayerSystem.selectedTitle = data.player.selectedTitle || null;
                PlayerSystem.dailyQuests = data.player.dailyQuests || [];
                PlayerSystem.lastQuestReset = data.player.lastQuestReset || null;
            } else {
                PlayerSystem.level = 1;
                PlayerSystem.xp = 0;
                PlayerSystem.battleStreak = 0;
                PlayerSystem.bestStreak = 0;
                PlayerSystem.unlockedZones = ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh", "darkforest"];
                PlayerSystem.totalBattles = 0;
                PlayerSystem.totalCatches = 0;
                PlayerSystem.totalTrainings = 0;
                PlayerSystem.totalExplores = 0;
                PlayerSystem.totalCrafts = 0;
                PlayerSystem.totalPrestiges = 0;
                PlayerSystem.lastDailyBonus = null;
                PlayerSystem.loginStreak = 0;
                PlayerSystem.lastLoginDate = null;
                PlayerSystem.dailyActivities = new Set();
                PlayerSystem.achievements = new Set();
                PlayerSystem.partyPresets = {};
                PlayerSystem.selectedTitle = null;
                PlayerSystem.dailyQuests = [];
                PlayerSystem.lastQuestReset = null;
            }
            
            // Migration: restore maxPartySize and maxTotalPets from save or defaults
            PetManager.maxPartySize = data.maxPartySize || 6;
            PetManager.maxTotalPets = data.maxTotalPets || 300;

            // Check daily login rewards
            this.checkDailyLogin();

            // Check daily quests reset
            this.checkDailyQuests();
        }
    },

    checkDailyQuests() {
        const today = new Date().toDateString();
        if (PlayerSystem.lastQuestReset !== today) {
            this.generateDailyQuests();
            PlayerSystem.lastQuestReset = today;
            DataManager.save();
        }
    },

    generateDailyQuests() {
        const questTemplates = [
            { type: "defeat", target: "grass", count: 5, reward: 200, description: "Defeat 5 grass-type pets" },
            { type: "defeat", target: "fire", count: 5, reward: 200, description: "Defeat 5 fire-type pets" },
            { type: "defeat", target: "water", count: 5, reward: 200, description: "Defeat 5 water-type pets" },
            { type: "craft", target: "potion", count: 3, reward: 150, description: "Craft 3 potions" },
            { type: "craft", target: "xpOrb", count: 2, reward: 200, description: "Craft 2 XP Orbs" },
            { type: "explore", target: "any", count: 3, reward: 150, description: "Explore 3 times" },
            { type: "train", target: "any", count: 5, reward: 150, description: "Train 5 times" },
            { type: "catch", target: "any", count: 3, reward: 200, description: "Catch 3 pets" }
        ];

        const shuffled = questTemplates.sort(() => Math.random() - 0.5);
        PlayerSystem.dailyQuests = shuffled.slice(0, 3).map((template, index) => ({
            id: `quest_${Date.now()}_${index}`,
            ...template,
            progress: 0,
            completed: false
        }));
    },

    updateQuestProgress(type, target, amount = 1) {
        PlayerSystem.dailyQuests.forEach(quest => {
            if (quest.completed) return;
            if (quest.type === type && (quest.target === target || quest.target === "any")) {
                quest.progress = Math.min(quest.progress + amount, quest.count);
                if (quest.progress >= quest.count && !quest.completed) {
                    quest.completed = true;
                    Economy.money += quest.reward;
                    UIManager.showToast(`🎯 Quest Complete: ${quest.description} (+${quest.reward}💰)`);
                    DataManager.save();
                }
            }
        });
    },

    checkDailyLogin() {
        const today = new Date().toDateString();
        const lastLogin = PlayerSystem.lastLoginDate;

        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                // Consecutive day
                PlayerSystem.loginStreak++;
            } else {
                // Streak broken
                PlayerSystem.loginStreak = 1;
            }

            PlayerSystem.lastLoginDate = today;

            // Calculate reward based on streak
            const baseReward = 100;
            const streakBonus = Math.min(PlayerSystem.loginStreak * 20, 500);
            const totalReward = baseReward + streakBonus;

            Economy.money += totalReward;

            // Show notification
            setTimeout(() => {
                UIManager.showToast(`🎁 Daily Login Bonus! Day ${PlayerSystem.loginStreak}: +${totalReward}💰`);
            }, 500);

            DataManager.save();
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
        evolution: ["Dusk Bat", "Vampire", "Vampire Emperor"]
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
            description: "Deals fairy damage and heals user for 50% of damage dealt.",
            heal: true,
            healPercent: 0.50
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
        if ((Economy.inventory.gem || 0) < 5) return { valid: false, reason: "Need 5 Gems to prestige fuse!" };
        
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
        
        // Deduct 5 gems for prestige fusion
        Economy.inventory.gem = (Economy.inventory.gem || 0) - 5;
        
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
        attackSunglasses: 0,
        woodStick: 0,
        rock: 0,
        leather: 0,
        ore: 0,
        herbs: 0,
        crystal: 0,
        darkRock: 0,
        gem: 0
    },
    shopItems: {
        greatBall: { name: "Great Ball", price: 150, type: "catch", power: 2 },
        ultraBall: { name: "Ultra Ball", price: 400, type: "catch", power: 3 },
        potion: { name: "Potion", price: 30, type: "heal", power: 20 },
        superPotion: { name: "Super Potion", price: 80, type: "heal", power: 50 },
        hyperPotion: { name: "Hyper Potion", price: 200, type: "heal", power: 100 },
        tierStone: { name: "Tier Stone", price: 500, type: "upgrade", power: 1 },
        xpOrb: { name: "XP Orb", price: 250, type: "xp", power: 500 },
        rareXpOrb: { name: "Rare XP Orb", price: 1000, type: "xp", power: 2000 },
        woodStick: { name: "Wood Stick", price: 0, type: "resource", power: 1 },
        rock: { name: "Rock", price: 0, type: "resource", power: 1 },
        leather: { name: "Leather", price: 0, type: "resource", power: 1 },
        ore: { name: "Ore", price: 0, type: "resource", power: 1 },
        herbs: { name: "Herbs", price: 0, type: "resource", power: 1 },
        crystal: { name: "Crystal", price: 0, type: "resource", power: 1 },
        darkRock: { name: "Dark Rock", price: 0, type: "resource", power: 1 },
        gem: { name: "Gem", price: 200, type: "currency", power: 1 },
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
    unlockedZones: ["forest", "cave", "lake", "mountain", "desert", "ocean", "volcano", "swamp", "sky", "toxicMarsh", "darkforest"],
    totalBattles: 0,
    totalCatches: 0,
    totalTrainings: 0,
    totalExplores: 0,
    totalCrafts: 0,
    totalPrestiges: 0,
    lastDailyBonus: null,
    loginStreak: 0,
    lastLoginDate: null,
    dailyActivities: new Set(),
    achievements: new Set(),
    partyPresets: {},
    selectedTitle: null,
    dailyQuests: [],
    lastQuestReset: null
};

// ==================== ACHIEVEMENT SYSTEM ====================
const AchievementSystem = {
    achievements: {
        firstCatch: { id: "firstCatch", name: "First Catch", description: "Catch your first pet", icon: "🎱", reward: 100, tier: "bronze" },
        defeat10: { id: "defeat10", name: "Novice Trainer", description: "Defeat 10 pets in battle", icon: "⚔️", reward: 200, tier: "bronze" },
        defeat50: { id: "defeat50", name: "Skilled Trainer", description: "Defeat 50 pets in battle", icon: "🗡️", reward: 500, tier: "silver" },
        defeat100: { id: "defeat100", name: "Master Trainer", description: "Defeat 100 pets in battle", icon: "🏆", reward: 1000, tier: "gold" },
        catch10: { id: "catch10", name: "Collector", description: "Catch 10 different pets", icon: "📦", reward: 300, tier: "bronze" },
        catch25: { id: "catch25", name: "Hoarder", description: "Catch 25 different pets", icon: "📦", reward: 500, tier: "silver" },
        catch50: { id: "catch50", name: "Archivist", description: "Catch 50 different pets", icon: "📚", reward: 1000, tier: "gold" },
        train10: { id: "train10", name: "Disciplined", description: "Train 10 times", icon: "💪", reward: 300, tier: "bronze" },
        train50: { id: "train50", name: "Dedicated", description: "Train 50 times", icon: "💪", reward: 800, tier: "silver" },
        explore10: { id: "explore10", name: "Explorer", description: "Explore 10 times", icon: "🗺️", reward: 300, tier: "bronze" },
        explore50: { id: "explore50", name: "Adventurer", description: "Explore 50 times", icon: "🗺️", reward: 800, tier: "silver" },
        craft10: { id: "craft10", name: "Craftsman", description: "Craft 10 items", icon: "🔨", reward: 300, tier: "bronze" },
        craft50: { id: "craft50", name: "Artisan", description: "Craft 50 items", icon: "🔨", reward: 800, tier: "silver" },
        streak5: { id: "streak5", name: "On Fire", description: "Achieve 5 battle streak", icon: "🔥", reward: 500, tier: "bronze" },
        streak10: { id: "streak10", name: "Unstoppable", description: "Achieve 10 battle streak", icon: "⚡", reward: 1000, tier: "gold" },
        prestige1: { id: "prestige1", name: "First Fusion", description: "Perform your first prestige fusion", icon: "✨", reward: 1000, tier: "gold" }
    },

    getTierMultiplier(tier) {
        switch (tier) {
            case "platinum": return 4;
            case "gold": return 2;
            case "silver": return 1.5;
            case "bronze": return 1;
            default: return 1;
        }
    },

    checkAchievement(achievementId) {
        if (PlayerSystem.achievements.has(achievementId)) return false;

        const achievement = this.achievements[achievementId];
        if (!achievement) return false;

        let unlocked = false;

        switch (achievementId) {
            case "firstCatch":
                unlocked = PlayerSystem.totalCatches >= 1;
                break;
            case "defeat10":
                unlocked = PlayerSystem.totalBattles >= 10;
                break;
            case "defeat50":
                unlocked = PlayerSystem.totalBattles >= 50;
                break;
            case "defeat100":
                unlocked = PlayerSystem.totalBattles >= 100;
                break;
            case "catch10":
                unlocked = this.getUniquePetCount() >= 10;
                break;
            case "catch25":
                unlocked = this.getUniquePetCount() >= 25;
                break;
            case "shiny":
                unlocked = this.hasShinyPet();
                break;
            case "craft10":
                unlocked = PlayerSystem.totalCrafts >= 10;
                break;
            case "craft50":
                unlocked = PlayerSystem.totalCrafts >= 50;
                break;
            case "level10":
                unlocked = PlayerSystem.level >= 10;
                break;
            case "level25":
                unlocked = PlayerSystem.level >= 25;
                break;
            case "level50":
                unlocked = PlayerSystem.level >= 50;
                break;
            case "streak5":
                unlocked = PlayerSystem.bestStreak >= 5;
                break;
            case "streak10":
                unlocked = PlayerSystem.bestStreak >= 10;
                break;
            case "prestige1":
                unlocked = PlayerSystem.totalPrestiges >= 1;
                break;
            case "explore10":
                unlocked = PlayerSystem.totalExplores >= 10;
                break;
            case "explore50":
                unlocked = PlayerSystem.totalExplores >= 50;
                break;
        }

        if (unlocked) {
            PlayerSystem.achievements.add(achievementId);
            const tierMultiplier = this.getTierMultiplier(achievement.tier || "bronze");
            const finalReward = Math.floor(achievement.reward * tierMultiplier);
            Economy.money += finalReward;
            UIManager.showToast(`🏆 Achievement Unlocked: ${achievement.icon} ${achievement.name} (+${finalReward}💰)`);
            DataManager.save();
            return true;
        }

        return false;
    },

    getUniquePetCount() {
        const uniqueTypes = new Set();
        PetManager.pets.forEach(pet => uniqueTypes.add(pet.typeId));
        PetManager.storage.forEach(pet => uniqueTypes.add(pet.typeId));
        return uniqueTypes.size;
    },

    hasShinyPet() {
        const allPets = [...PetManager.pets, ...PetManager.storage];
        return allPets.some(pet => pet.shiny);
    },

    checkAllAchievements() {
        for (const achievementId of Object.keys(this.achievements)) {
            this.checkAchievement(achievementId);
        }
    }
};

// ==================== TITLE SYSTEM ====================
const TitleSystem = {
    titles: {
        noviceTrainer: { id: "noviceTrainer", name: "Novice Trainer", description: "Defeat 10 pets", requirement: () => PlayerSystem.totalBattles >= 10 },
        skilledTrainer: { id: "skilledTrainer", name: "Skilled Trainer", description: "Defeat 50 pets", requirement: () => PlayerSystem.totalBattles >= 50 },
        masterTrainer: { id: "masterTrainer", name: "Master Trainer", description: "Defeat 100 pets", requirement: () => PlayerSystem.totalBattles >= 100 },
        collector: { id: "collector", name: "Collector", description: "Catch 10 different pets", requirement: () => AchievementSystem.getUniquePetCount() >= 10 },
        hoarder: { id: "hoarder", name: "Hoarder", description: "Catch 25 different pets", requirement: () => AchievementSystem.getUniquePetCount() >= 25 },
        explorer: { id: "explorer", name: "Explorer", description: "Explore 10 times", requirement: () => PlayerSystem.totalExplores >= 10 },
        adventurer: { id: "adventurer", name: "Adventurer", description: "Explore 50 times", requirement: () => PlayerSystem.totalExplores >= 50 },
        craftsman: { id: "craftsman", name: "Craftsman", description: "Craft 10 items", requirement: () => PlayerSystem.totalCrafts >= 10 },
        artisan: { id: "artisan", name: "Artisan", description: "Craft 50 items", requirement: () => PlayerSystem.totalCrafts >= 50 },
        onFire: { id: "onFire", name: "On Fire", description: "Achieve 5 battle streak", requirement: () => PlayerSystem.bestStreak >= 5 },
        unstoppable: { id: "unstoppable", name: "Unstoppable", description: "Achieve 10 battle streak", requirement: () => PlayerSystem.bestStreak >= 10 },
        dragonTamer: { id: "dragonTamer", name: "Dragon Tamer", description: "Own 5 dragon-type pets", requirement: () => this.countPetType("dragon") >= 5 },
        grassGuardian: { id: "grassGuardian", name: "Grass Guardian", description: "Own 5 grass-type pets", requirement: () => this.countPetType("grass") >= 5 },
        waterMaster: { id: "waterMaster", name: "Water Master", description: "Own 5 water-type pets", requirement: () => this.countPetType("water") >= 5 },
        fireLord: { id: "fireLord", name: "Fire Lord", description: "Own 5 fire-type pets", requirement: () => this.countPetType("fire") >= 5 }
    },

    countPetType(type) {
        const allPets = [...PetManager.pets, ...PetManager.storage];
        return allPets.filter(pet => PetTypes[pet.typeId]?.type === type).length;
    },

    getUnlockedTitles() {
        const unlocked = [];
        for (const [id, title] of Object.entries(this.titles)) {
            if (title.requirement()) {
                unlocked.push(title);
            }
        }
        return unlocked;
    },

    selectTitle(titleId) {
        if (titleId && this.titles[titleId] && this.titles[titleId].requirement()) {
            PlayerSystem.selectedTitle = titleId;
            DataManager.save();
            return true;
        } else if (!titleId) {
            PlayerSystem.selectedTitle = null;
            DataManager.save();
            return true;
        }
        return false;
    },

    getSelectedTitle() {
        if (PlayerSystem.selectedTitle && this.titles[PlayerSystem.selectedTitle]) {
            return this.titles[PlayerSystem.selectedTitle];
        }
        return null;
    }
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

    // Check level achievements
    AchievementSystem.checkAchievement("level10");
    AchievementSystem.checkAchievement("level25");
    AchievementSystem.checkAchievement("level50");

    const storageSlotsGained = Math.floor(toLevel / 25) - Math.floor(fromLevel / 25);
    PetManager.maxTotalPets = Math.min(300, PetManager.maxTotalPets + storageSlotsGained);
}

function getPlayerLevelBonus() {
    return PlayerSystem.level;
}

function getExploreExplore() {
    PlayerSystem.totalExplores++;
    // Update quest progress for exploration
    DataManager.updateQuestProgress("explore", "any");
    AchievementSystem.checkAchievement("explore10");
    AchievementSystem.checkAchievement("explore50");
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
            commonPets: ["leafBunny", "vineSnake", "mossBear", "glimmerMoth", "moonPixie"],
            rarePets: ["mindCat", "dreamOwl", "fieldDeer", "thornHog"],
            encounterRate: 1,
            ambientColor: "rgba(34, 139, 34, 0.15)"
        },
        cave: {
            name: "Cave",
            emoji: "⛰️",
            unlockLevel: 1,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["scaleLizard", "sparkDog"],
            rarePets: ["drakeWhelp", "frostPenguin", "crystalSeal", "frostBear", "crystalWyrm", "mindApe"],
            encounterRate: 1,
            ambientColor: "rgba(105, 105, 105, 0.15)"
        },
        lake: {
            name: "Lake",
            emoji: "💧",
            unlockLevel: 1,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["aquaTurtle", "mistFrog", "waveWhale"],
            rarePets: ["shockEel", "boltMouse"],
            encounterRate: 1,
            ambientColor: "rgba(30, 144, 255, 0.15)"
        },
        mountain: {
            name: "Mountain",
            emoji: "🏔️",
            unlockLevel: 5,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["flameCat", "zapBird", "scaleLizard", "frostBear", "cloudSheep", "glacierFox"],
            rarePets: ["drakeWhelp", "cosmicFox", "crystalWyrm", "voltageOx"],
            encounterRate: 1,
            ambientColor: "rgba(139, 137, 112, 0.15)"
        },
        desert: {
            name: "Desert",
            emoji: "🏜️",
            unlockLevel: 10,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["emberFox", "sparkDog", "scaleLizard", "cinderScorpion", "duneLion"],
            rarePets: ["flameCat", "drakeWhelp"],
            encounterRate: 1,
            ambientColor: "rgba(210, 180, 140, 0.15)"
        },
        ocean: {
            name: "Ocean",
            emoji: "🌊",
            unlockLevel: 15,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["waveWhale", "shockEel", "crystalSeal", "tidalCrab"],
            rarePets: ["aquaTurtle", "frostPenguin"],
            encounterRate: 1,
            ambientColor: "rgba(0, 105, 148, 0.15)"
        },
        volcano: {
            name: "Volcano",
            emoji: "🌋",
            unlockLevel: 20,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["flameCat", "emberFox", "sparkDog"],
            rarePets: ["drakeWhelp", "scaleLizard", "cinderScorpion", "cinderHawk"],
            encounterRate: 1,
            ambientColor: "rgba(178, 34, 34, 0.15)"
        },
        swamp: {
            name: "Swamp",
            emoji: "🐊",
            unlockLevel: 25,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["mistFrog", "vineSnake", "mossBear", "glimmerMoth", "marshCroc", "sunstoneBeetle"],
            rarePets: ["waveWhale", "dreamOwl", "frostBear"],
            encounterRate: 1,
            ambientColor: "rgba(85, 107, 47, 0.15)"
        },
        sky: {
            name: "Sky",
            emoji: "☁️",
            unlockLevel: 30,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["zapBird", "boltMouse", "dreamOwl", "cloudSheep"],
            rarePets: ["cosmicFox", "shockEel"],
            encounterRate: 1,
            ambientColor: "rgba(135, 206, 250, 0.15)"
        },
        toxicMarsh: {
            name: "Toxic Marsh",
            emoji: "🧪",
            unlockLevel: 35,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["venomAsp", "bogToad", "mistFrog", "vineSnake"],
            rarePets: ["cosmicFox", "moonPixie"],
            encounterRate: 1,
            ambientColor: "rgba(128, 0, 128, 0.15)"
        },
        darkforest: {
            name: "Dark Forest",
            emoji: "🌑",
            unlockLevel: 20,
            floorSize: 5,
            maxFloor: 200,
            commonPets: ["shadowWolf", "duskBat"],
            rarePets: [],
            encounterRate: 1,
            ambientColor: "rgba(47, 79, 79, 0.15)"
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
        let petType = petPool[Math.floor(Math.random() * petPool.length)];
        if (!petType) {
            const fallbackPool = zone.commonPets;
            if (fallbackPool.length === 0) {
                console.error("No valid pets in zone:", zoneId);
                return null;
            }
            petType = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
        }

         // Generate wild pet level from floor index
         const level = getWildPetLevelForFloor(floorIndex, zone.floorSize);
         const floorMax = floorIndex * zone.floorSize;

         // Shiny roll: 1 in 500
        const isShiny = Math.random() < 0.002;

        // Tier roll based on zone
        const tier = rollTierForZone(zoneId);

const wildPet = PetManager.createPet(petType, level, { shiny: isShiny, tier });

         if (!wildPet || !wildPet.stats) {
             console.error("Failed to create valid wild pet:", petType, level, wildPet);
             return null;
         }

          // C-tier opponent encounter based on player level
 const cTierChance = getCTierChance(PlayerSystem.level);
          if (cTierChance > 0 && Math.random() * 100 < cTierChance) {
              const cTire = rollCTire(PlayerSystem.level);
              const cTierLevelBonus = Math.min((cTire - 1) * 3, floorMax - wildPet.level);
              wildPet.level = wildPet.level + cTierLevelBonus;
              wildPet.tier = cTire >= 4 ? "C" + cTire : wildPet.tier;
              wildPet.tierBonus = PetManager.calculateTierBonus(wildPet.tier);
              wildPet.stats = PetManager.calculateStats(PetTypes[wildPet.typeId], wildPet.level, wildPet);
              wildPet.currentHP = PetManager.calculateMaxHP(PetTypes[wildPet.typeId], wildPet.level, wildPet);
          }

         return { pet: wildPet, isRare, isShiny };
    },

    getCooldownRemaining(zoneId) {
        if (!this.cooldowns[zoneId]) return 0;
        const remaining = this.cooldowns[zoneId] - Date.now();
        return Math.max(0, Math.ceil(remaining / 1000));
    },
    autoExplore: {
        active: false,
        zoneId: null,
        floorIndex: null,
        petId: null,
        floorPage: 0
    }
};

function getCTierChance(level) {
    if (level > 80) return 35;
    if (level > 70) return 30;
    if (level > 60) return 25;
    if (level > 50) return 20;
    if (level > 40) return 10;
    if (level >= 35) return 1;
    return 0;
}

function rollCTire(level) {
    let weights;
    if (level >= 50) {
        weights = [70, 15, 10, 5, 0];
    } else if (level >= 40) {
        weights = [80, 15, 5, 0, 0];
    } else {
        weights = [85, 10, 5, 0, 0];
    }
    const total = weights.reduce((a, b) => a + b, 0);
    const roll = Math.random() * total;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (roll < cumulative) return i + 1;
    }
    return 1;
}

// Tier helpers
function getWildPetLevelForFloor(floorIndex, floorSize) {
    const floorMin = (floorIndex - 1) * floorSize + 1;
    const floorMax = floorIndex * floorSize;
    return Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
}

function rollTierForZone(zoneId) {
    const tierRoll = Math.random();
    let tier;
    if (tierRoll < 0.30) tier = randomTier("C");
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

        if (Exploration.autoExplore.active) {
            const autoPet = PetManager.pets.find(p => String(p.id) === String(Exploration.autoExplore.petId));
            if (!autoPet || autoPet.currentHP <= 0) {
                Exploration.autoExplore.active = false;
                BattleSystem.autoExploreActive = false;
                BattleSystem.autoExplorePetId = null;
                this.showToast("Auto-explore pet not found or fainted!");
                UIManager.showScreen("mainScreen");
                return;
            }
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

        // Set battle background
        UIManager.setZoneBackground("battle");
        this.burnDamage = 0;
        this.confused = null;
        this.burnDuration = { enemy: 0, player: 0 };
        this.shield = { enemy: { turns: 0, percent: 0 }, player: { turns: 0, percent: 0 } };
        this.poisoned = null;
        this.poisonDuration = { enemy: 0, player: 0 };
        this.autoExploreActive = Exploration.autoExplore.active;
        this.autoExplorePetId = Exploration.autoExplore.petId;
        
        // Determine who goes first by speed
        const playerSpeed = this.playerPet.stats.speed;
        const enemySpeed = this.enemyPet.stats.speed;
        this.isPlayerTurn = playerSpeed >= enemySpeed;
        
        this.addLog(`Battle started! ${this.getPetName(this.playerPet)} vs ${this.getPetName(this.enemyPet)}`);
        if (!this.isPlayerTurn) {
            this.addLog("Enemy attacks first!");
        }
        
        UIManager.updateBattleScreen();
        
        // If player goes first and auto-explore is on, play immediately
        if (this.isPlayerTurn && this.autoExploreActive) {
            setTimeout(() => this.autoPlayTurn(), 1000);
        } else if (!this.isPlayerTurn) {
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
            UIManager.triggerScreenShake();
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
             setTimeout(() => {
                 UIManager.updateBattleScreen();
                 if (this.autoExploreActive) {
                     this.autoPlayTurn();
                 }
             }, 500);
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
              setTimeout(() => {
                  UIManager.updateBattleScreen();
                  if (this.autoExploreActive) {
                      this.autoPlayTurn();
                  }
              }, 500);
              return;
          }
          
          this.attack(this.enemyPet, this.playerPet, false);
         
         if (this.playerPet.currentHP <= 0) {
             this.endBattle(false);
             return;
         }
         
         this.isPlayerTurn = true;
         UIManager.updateBattleScreen();
         
         if (this.autoExploreActive) {
             setTimeout(() => this.autoPlayTurn(), 1000);
         }
     },

autoPlayTurn() {
    if (!this.active || !this.isPlayerTurn) return;
    const template = PetTypes[this.playerPet.typeId];
    if (template && template.ability && this.playerAbilityCooldown === 0) {
        this.useAbility();
    } else {
        this.playerTurn();
    }
},

    attack(attacker, defender, isPlayerAttacker) {
         const attackerTemplate = PetTypes[attacker.typeId];
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
            if (attackerTemplate.passive && attackerTemplate.passive.includes("Sanguine Drain") && attackerTemplate.type === "dark") {
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

        // Trigger victory/defeat cinematics
        if (playerWon) {
            UIManager.triggerVictoryCinematic();
        } else {
            UIManager.triggerDefeatCinematic();
        }

        const petXPReward = this.enemyPet.level * 20;
        const moneyReward = this.enemyPet.level * 20;

        if (playerWon) {
            this.petsDefeated = this.petsDefeated + 1;
            PlayerSystem.totalBattles++;
            PlayerSystem.battleStreak++;
            if (PlayerSystem.battleStreak > PlayerSystem.bestStreak) {
                PlayerSystem.bestStreak = PlayerSystem.battleStreak;
            }
            // Update quest progress for defeating pets
            const enemyType = PetTypes[this.enemyPet.typeId]?.type;
            if (enemyType) {
                DataManager.updateQuestProgress("defeat", enemyType);
            }

            // Check achievements
            AchievementSystem.checkAchievement("defeat10");
            AchievementSystem.checkAchievement("defeat50");
            AchievementSystem.checkAchievement("defeat100");
            AchievementSystem.checkAchievement("streak5");
            AchievementSystem.checkAchievement("streak10");

            // Win streak bonus multiplier (player XP only) - increased to 10x+ cap
            const streakMultiplier = 1 + Math.min(PlayerSystem.battleStreak * 0.15, 9.0);

            // Type advantage bonus (player XP only)
            const playerTemplate = PetTypes[this.playerPet.typeId];
            const enemyTemplate = PetTypes[this.enemyPet.typeId];
            const typeMult = this.getTypeEffectiveness(playerTemplate.type, enemyTemplate.type);
            const typeAdvantageMultiplier = typeMult > 1 ? 1.2 : 1;

            // Player XP (per plan: enemy.level * 10, with streak & type bonuses)
            const playerBaseXP = this.enemyPet.level * 10;
            const totalXP = Math.floor(playerBaseXP * streakMultiplier * typeAdvantageMultiplier);
            const playerLevelUp = addXP(totalXP);

            const streakText = PlayerSystem.battleStreak > 0 ? ` [Streak: ${PlayerSystem.battleStreak}x${streakMultiplier.toFixed(1)}]` : "";
            this.addLog(`🎉 Victory! +${totalXP} XP, +${moneyReward} Gold${streakText}`);
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
            
            const enemyElement = PetTypes[this.enemyPet.typeId]?.type;
            const zoneId = Exploration.currentFloor?.zoneId;
            const enemyLevel = this.enemyPet.level;
            
            // 20% chance to drop an XP Orb when defeating a wild pet
            if (Math.random() < 0.30) {
                Economy.inventory.xpOrb = (Economy.inventory.xpOrb || 0) + 1;
                this.addLog("✨ Found an XP Orb!");
            }
            
            const elementToResource = {
                grass: "woodStick", ice: "rock", normal: "leather",
                electric: "ore", poison: "herbs", fairy: "crystal", dark: "darkRock"
            };
            const resourceNames = {
                woodStick: "Wood Stick", rock: "Rock", leather: "Leather",
                ore: "Ore", herbs: "Herbs", crystal: "Crystal", darkRock: "Dark Rock"
            };
            const resourceEmojis = {
                woodStick: "🪵", rock: "🪨", leather: "🥾", ore: "⛏️",
                herbs: "🌿", crystal: "💎", darkRock: "🟣"
            };
            
            // Primary resource drop based on enemy element (25% chance, 1-2 qty)
            if (Math.random() < 0.60) {
                const resource = elementToResource[enemyElement];
                const qty = Math.random() < 0.3 ? 2 : 1;
                if (resource) {
                    Economy.inventory[resource] = (Economy.inventory[resource] || 0) + qty;
                    this.addLog(`${resourceEmojis[resource]} Found ${qty}x ${resourceNames[resource]}!`);
                }
            }
            
            // Zone secondary resource drop (40% chance, 1 qty)
            const zoneSecondary = {
                forest: "herbs", cave: "ore", lake: "leather", mountain: "crystal",
                desert: "leather", ocean: "crystal", volcano: "darkRock", swamp: "herbs",
                sky: "crystal", toxicMarsh: "herbs"
            };
            if (Math.random() < 0.40) {
                const resource = zoneId ? zoneSecondary[zoneId] : null;
                if (resource) {
                    Economy.inventory[resource] = (Economy.inventory[resource] || 0) + 1;
                    this.addLog(`${resourceEmojis[resource]} Found 1x ${resourceNames[resource]}!`);
                }
            }
            
            // 5% chance to drop 2 Gems when defeating a wild pet over level 20
            if (enemyLevel > 20 && Math.random() < 0.30) {
                Economy.inventory.gem = (Economy.inventory.gem || 0) + 2;
                this.addLog("💎 Found 2 Gems!");
            }
            
            // 10% chance to drop a Rare XP Orb when defeating a wild pet over level 30
            if (enemyLevel > 30 && Math.random() < 0.10) {
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
            if (Exploration.autoExplore.active && playerWon) {
                UIManager.showAutoExploreNotification(`Victory! +${petXPReward} pet XP, +${moneyReward} gold`, "success");
                UIManager.startNextAutoExplore();
            } else if (Exploration.autoExplore.active && !playerWon) {
                UIManager.showAutoExploreNotification("Defeat! Auto-explore stopped.", "error");
                Exploration.autoExplore.active = false;
                BattleSystem.autoExploreActive = false;
                BattleSystem.autoExplorePetId = null;
                UIManager.showScreen("mainScreen");
                UIManager.renderPets();
                UIManager.updateCurrency();
                UIManager.updateTeamPower();
                UIManager.updatePlayerLevelDisplay();
            } else {
                UIManager.showScreen("mainScreen");
                UIManager.renderPets();
                UIManager.updateCurrency();
                UIManager.updateTeamPower();
                UIManager.updatePlayerLevelDisplay();
            }
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
            PlayerSystem.totalCatches++;
            // Update quest progress for catching
            DataManager.updateQuestProgress("catch", "any");
            AchievementSystem.checkAchievement("firstCatch");
            AchievementSystem.checkAchievement("catch10");
            AchievementSystem.checkAchievement("catch25");
            if (wildPet.shiny) {
                AchievementSystem.checkAchievement("shiny");
            }
            DataManager.save();
            return { success: true, reason: "Caught!" };
        } else if (success && PetManager.pets.length + PetManager.storage.length < PetManager.maxTotalPets) {
            PetManager.storage.push(wildPet);
            PlayerSystem.totalCatches++;
            // Update quest progress for catching
            DataManager.updateQuestProgress("catch", "any");
            AchievementSystem.checkAchievement("firstCatch");
            AchievementSystem.checkAchievement("catch10");
            AchievementSystem.checkAchievement("catch25");
            if (wildPet.shiny) {
                AchievementSystem.checkAchievement("shiny");
            }
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
        // Update quest progress for training
        DataManager.updateQuestProgress("train", "any");

        DataManager.save();
        
        setTimeout(() => {
            this.showToast(message);
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

// ==================== CRAFTING SYSTEM ====================
const CraftingSystem = {
    recipes: {
        basicBall:    { name: "Basic Ball",    outputQty: 1, cost: { woodStick: 5, rock: 2 } },
        greatBall:    { name: "Great Ball",    outputQty: 1, cost: { woodStick: 8, ore: 4, rock: 3 } },
        ultraBall:    { name: "Ultra Ball",    outputQty: 1, cost: { woodStick: 10, ore: 6, rock: 4 } },
        potion:       { name: "Potion",        outputQty: 1, cost: { herbs: 3, woodStick: 2 } },
        superPotion:  { name: "Super Potion",  outputQty: 1, cost: { herbs: 8, leather: 4, ore: 3 } },
        hyperPotion:  { name: "Hyper Potion",  outputQty: 1, cost: { herbs: 15, leather: 8, crystal: 3 } },
        xpOrb:        { name: "XP Orb",        outputQty: 1, cost: { herbs: 5, crystal: 3 } },
        rareXpOrb:    { name: "Rare XP Orb",   outputQty: 1, cost: { crystal: 8, darkRock: 5 } },
        tierStone:    { name: "Tier Stone",    outputQty: 1, cost: { rock: 3, darkRock: 2 } },
        focusIncense: { name: "Focus Incense", outputQty: 1, cost: { ore: 4, darkRock: 2, crystal: 1 } },
        precisionGuide: { name: "Precision Guide", outputQty: 1, cost: { herbs: 5, crystal: 2 } }
    },

    canCraft(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) return false;
        for (const [itemId, qty] of Object.entries(recipe.cost)) {
            if ((Economy.inventory[itemId] || 0) < qty) return false;
        }
        return true;
    },

    craft(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe || !this.canCraft(recipeId)) return false;
        for (const [itemId, qty] of Object.entries(recipe.cost)) {
            Economy.inventory[itemId] -= qty;
        }
        Economy.inventory[recipeId] = (Economy.inventory[recipeId] || 0) + recipe.outputQty;
        return true;
    }
};

// ==================== UI MANAGER ====================
const UIManager = {
    init() {
        // Setup event listeners
        document.getElementById("stopBtn").addEventListener("click", () => TrainingSystem.stop());
    },

    showScreen(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        // Apply fade-out to current screen if any
        const currentScreen = document.querySelector('.screen:not(.hidden)');
        if (currentScreen) {
            currentScreen.classList.add('screen-transition-out');
            setTimeout(() => {
                currentScreen.classList.add('hidden');
                currentScreen.classList.remove('screen-transition-out');
            }, 200);
        }

        // Apply fade-in to new screen
        setTimeout(() => {
            const newScreen = document.getElementById(screenId);
            if (newScreen) {
                newScreen.classList.remove("hidden");
                newScreen.classList.add("screen-transition");
                setTimeout(() => newScreen.classList.remove("screen-transition"), 300);
            }
        }, 200);

        // Stop auto-explore when leaving battle screen
        if (screenId !== "battleScreen") {
            Exploration.autoExplore.active = false;
            BattleSystem.autoExploreActive = false;
            BattleSystem.autoExplorePetId = null;
            const floatingBtn = document.getElementById("autoExploreFloatingStop");
            if (floatingBtn) floatingBtn.classList.add("hidden");
            const notifContainer = document.getElementById("autoExploreNotifications");
            if (notifContainer) notifContainer.classList.add("hidden");
        }

        // Reset visuals when leaving battle or exploration
        if (screenId !== "battleScreen" && screenId !== "explorationScreen") {
            this.resetBackground();
            this.clearWeather();
        }

        // Render screen-specific content
        if (screenId === "mainScreen") {
            this.renderPets();
        }
        if (screenId === "storageScreen") {
            this.renderStorage();
        }
        if (screenId === "collectionScreen") {
            this.renderCollection();
        }
        if (screenId === "shopScreen") {
            this.renderShop();
        }
        if (screenId === "inventoryScreen") {
            this.renderInventory();
        }
        if (screenId === "craftingScreen") {
            this.renderCrafting();
        }
        this.updatePlayerLevelDisplay();

        const footer = document.getElementById("footerNav");
        if (footer) {
            footer.classList.toggle("hidden", screenId === "battleScreen");
        }
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
        const autoBtn = document.getElementById("autoExploreFooterBtn");
        if (levelDisplay) {
            levelDisplay.innerText = `Lv ${PlayerSystem.level}`;
        }
        if (profileBtn) {
            profileBtn.innerText = PlayerSystem.level;
        }
        if (autoBtn) {
            autoBtn.classList.toggle("hidden", PlayerSystem.level < 50);
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
        const achievementsUnlocked = PlayerSystem.achievements.size;
        const totalAchievements = Object.keys(AchievementSystem.achievements).length;
        const selectedTitle = TitleSystem.getSelectedTitle();

        const stats = [
            { label: "Level", value: PlayerSystem.level, color: "" },
            { label: "XP", value: `${PlayerSystem.xp} / ${xpNeeded(PlayerSystem.level)}`, color: "" },
            { label: "Title", value: selectedTitle ? selectedTitle.name : "None", color: "text-yellow-400" },
            { label: "Party Pets", value: `${partyCount} / ${PetManager.maxPartySize}`, color: "" },
            { label: "Total Pets", value: `${totalCount} / ${PetManager.maxTotalPets}`, color: "" },
            { label: "Total Catches", value: PlayerSystem.totalCatches, color: "" },
            { label: "Total Battles", value: PlayerSystem.totalBattles, color: "" },
            { label: "Best Streak", value: PlayerSystem.bestStreak, color: "" },
            { label: "Total Trainings", value: PlayerSystem.totalTrainings, color: "" },
            { label: "Total Explores", value: PlayerSystem.totalExplores, color: "" },
            { label: "Zones Unlocked", value: `${zonesUnlocked} / ${Object.keys(Exploration.zones).length}`, color: "" },
            { label: "Achievements", value: `${achievementsUnlocked} / ${totalAchievements}`, color: "text-purple-400" },
            { label: "Total Power", value: totalPower, color: "text-yellow-400" },
            { label: "Party Power", value: partyPower, color: "text-blue-400" },
        ];

        container.innerHTML = stats
            .map(s => `<div class="flex justify-between"><span>${s.label}</span><span class="${s.color} font-bold">${s.value}</span></div>`)
            .join("");

        // Render achievements with tier colors
        const achievementsContainer = document.getElementById("profileAchievements");
        if (achievementsContainer) {
            achievementsContainer.innerHTML = "";
            for (const [id, achievement] of Object.entries(AchievementSystem.achievements)) {
                const isUnlocked = PlayerSystem.achievements.has(id);
                const tier = achievement.tier || "bronze";
                const tierColors = {
                    bronze: "border-amber-600 bg-amber-900/30",
                    silver: "border-gray-400 bg-gray-700/30",
                    gold: "border-yellow-400 bg-yellow-600/30",
                    platinum: "border-cyan-400 bg-cyan-700/30"
                };
                const badge = document.createElement("div");
                badge.className = `inline-block m-1 p-2 rounded-lg text-center border-2 ${isUnlocked ? tierColors[tier] : "bg-gray-700/50 border-gray-600 opacity-50"}`;
                badge.title = `${achievement.name} (${tier.charAt(0).toUpperCase() + tier.slice(1)}): ${achievement.description}${isUnlocked ? ` (+${Math.floor(achievement.reward * AchievementSystem.getTierMultiplier(tier))}💰)` : ""}`;
                badge.innerHTML = `<div class="text-2xl">${achievement.icon}</div>`;
                achievementsContainer.appendChild(badge);
            }
        }

        // Render title selector
        const titleContainer = document.getElementById("profileTitles");
        if (titleContainer) {
            const unlockedTitles = TitleSystem.getUnlockedTitles();
            titleContainer.innerHTML = `<h3>🏅 Titles</h3>`;
            const noneBtn = document.createElement("button");
            noneBtn.className = `m-1 p-2 rounded-lg border-2 ${!selectedTitle ? "bg-yellow-600/50 border-yellow-400" : "bg-gray-700/50 border-gray-600"}`;
            noneBtn.innerText = "None";
            noneBtn.onclick = () => {
                TitleSystem.selectTitle(null);
                this.updateProfileStats();
            };
            titleContainer.appendChild(noneBtn);

            unlockedTitles.forEach(title => {
                const btn = document.createElement("button");
                const isSelected = selectedTitle && selectedTitle.id === title.id;
                btn.className = `m-1 p-2 rounded-lg border-2 ${isSelected ? "bg-yellow-600/50 border-yellow-400" : "bg-gray-700/50 border-gray-600"}`;
                btn.title = title.description;
                btn.innerText = title.name;
                btn.onclick = () => {
                    TitleSystem.selectTitle(title.id);
                    this.updateProfileStats();
                };
                titleContainer.appendChild(btn);
            });
        }
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

    // Pet Search/Filter Functions
    filterPets() {
        const searchInput = document.getElementById("petSearchInput");
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase();
        this.renderPets(searchTerm);
    },

    filterStorage() {
        const searchInput = document.getElementById("storageSearchInput");
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase();
        this.renderStorage(searchTerm);
    },

    // Dynamic Backgrounds
    setZoneBackground(zoneId) {
        document.body.className = "";
        if (zoneId) {
            document.body.classList.add(`zone-${zoneId}`);
        }
    },

    resetBackground() {
        document.body.className = "";
    },

    // Screen Shake Effect
    triggerScreenShake() {
        document.body.classList.add("screen-shake");
        setTimeout(() => {
            document.body.classList.remove("screen-shake");
        }, 500);
    },

    // Victory/Defeat Cinematics
    triggerVictoryCinematic() {
        const battleScreen = document.getElementById("battleScreen");
        if (battleScreen) {
            battleScreen.classList.add("victory-cinematic");
            setTimeout(() => {
                battleScreen.classList.remove("victory-cinematic");
            }, 6000);
        }
    },

    triggerDefeatCinematic() {
        const battleScreen = document.getElementById("battleScreen");
        if (battleScreen) {
            battleScreen.classList.add("defeat-cinematic");
            setTimeout(() => {
                battleScreen.classList.remove("defeat-cinematic");
            }, 1500);
        }
    },

    // Weather Effects
    weatherInterval: null,

    setWeather(weatherType) {
        this.clearWeather();
        const container = document.getElementById("weatherContainer");
        if (!container) return;

        container.classList.remove("hidden");

        if (weatherType === "rain") {
            this.createRain(container);
        } else if (weatherType === "snow") {
            this.createSnow(container);
        } else if (weatherType === "fog") {
            this.createFog(container);
        }
    },

    clearWeather() {
        const container = document.getElementById("weatherContainer");
        if (container) {
            container.innerHTML = "";
            container.classList.add("hidden");
        }
        if (this.weatherInterval) {
            clearInterval(this.weatherInterval);
            this.weatherInterval = null;
        }
    },

    createRain(container) {
        const createDrop = () => {
            const drop = document.createElement("div");
            drop.className = "rain-drop";
            drop.style.left = Math.random() * 100 + "%";
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
            container.appendChild(drop);
            setTimeout(() => drop.remove(), 1000);
        };

        this.weatherInterval = setInterval(createDrop, 50);
    },

    createSnow(container) {
        const createFlake = () => {
            const flake = document.createElement("div");
            flake.className = "snow-flake";
            flake.style.left = Math.random() * 100 + "%";
            flake.style.animationDuration = (Math.random() * 3 + 2) + "s";
            flake.style.width = (Math.random() * 6 + 4) + "px";
            flake.style.height = flake.style.width;
            container.appendChild(flake);
            setTimeout(() => flake.remove(), 5000);
        };

        this.weatherInterval = setInterval(createFlake, 200);
    },

    createFog(container) {
        const createLayer = () => {
            const layer = document.createElement("div");
            layer.className = "fog-layer";
            layer.style.top = Math.random() * 100 + "%";
            layer.style.animationDuration = (Math.random() * 10 + 10) + "s";
            container.appendChild(layer);
            setTimeout(() => layer.remove(), 20000);
        };

        for (let i = 0; i < 3; i++) {
            createLayer();
        }
        this.weatherInterval = setInterval(createLayer, 5000);
    },

    // Party Preset System
    openPresetOverlay() {
        this.renderPresets();
        document.getElementById("presetOverlay").classList.remove("hidden");
    },

    closePresetOverlay() {
        document.getElementById("presetOverlay").classList.add("hidden");
    },

    savePreset() {
        const nameInput = document.getElementById("presetNameInput");
        const name = nameInput.value.trim();

        if (!name) {
            this.showToast("Please enter a preset name!");
            return;
        }

        if (PetManager.pets.length === 0) {
            this.showToast("No pets in party to save!");
            return;
        }

        const preset = {
            name: name,
            petIds: PetManager.pets.map(p => p.id),
            timestamp: Date.now()
        };

        PlayerSystem.partyPresets[name] = preset;
        DataManager.save();
        nameInput.value = "";
        this.renderPresets();
        this.showToast(`Preset "${name}" saved!`);
    },

    loadPreset(name) {
        const preset = PlayerSystem.partyPresets[name];
        if (!preset) {
            this.showToast("Preset not found!");
            return;
        }

        // Move current party to storage
        PetManager.pets.forEach(pet => {
            if (PetManager.storage.length < PetManager.maxTotalPets) {
                PetManager.storage.push(pet);
            }
        });

        // Load preset pets from storage
        PetManager.pets = [];
        preset.petIds.forEach(petId => {
            const pet = PetManager.storage.find(p => String(p.id) === String(petId));
            if (pet) {
                PetManager.pets.push(pet);
                PetManager.storage = PetManager.storage.filter(p => String(p.id) !== String(petId));
            }
        });

        DataManager.save();
        this.renderPresets();
        this.renderPets();
        this.updateTeamPower();
        this.showToast(`Preset "${name}" loaded!`);
    },

    deletePreset(name) {
        if (confirm(`Delete preset "${name}"?`)) {
            delete PlayerSystem.partyPresets[name];
            DataManager.save();
            this.renderPresets();
            this.showToast(`Preset "${name}" deleted!`);
        }
    },

    renderPresets() {
        const list = document.getElementById("presetList");
        list.innerHTML = "";

        const presetNames = Object.keys(PlayerSystem.partyPresets);

        if (presetNames.length === 0) {
            list.innerHTML = "<p>No saved presets yet.</p>";
            return;
        }

        presetNames.forEach(name => {
            const preset = PlayerSystem.partyPresets[name];
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center";

            const petCount = preset.petIds.length;
            const date = new Date(preset.timestamp).toLocaleDateString();

            card.innerHTML = `
                <h3>${name}</h3>
                <p class="text-sm opacity-80">${petCount} pets</p>
                <p class="text-xs opacity-60">Saved: ${date}</p>
                <div class="mt-2">
                    <button onclick="UIManager.loadPreset('${name}')" class="border-none rounded-xl px-3 py-1.5 cursor-pointer text-white bg-green-700 text-xs">Load</button>
                    <button onclick="UIManager.deletePreset('${name}')" class="border-none rounded-xl px-3 py-1.5 cursor-pointer text-white bg-red-500 text-xs">Delete</button>
                </div>
            `;
            list.appendChild(card);
        });
    },

    // Daily Quests System
    openQuestOverlay() {
        this.renderQuests();
        document.getElementById("questOverlay").classList.remove("hidden");
    },

    closeQuestOverlay() {
        document.getElementById("questOverlay").classList.add("hidden");
    },

    renderQuests() {
        const list = document.getElementById("questList");
        list.innerHTML = "";

        if (PlayerSystem.dailyQuests.length === 0) {
            list.innerHTML = "<p>No quests available today.</p>";
            return;
        }

        PlayerSystem.dailyQuests.forEach(quest => {
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-4 ${quest.completed ? "opacity-50" : ""}`;

            const progressPercent = (quest.progress / quest.count) * 100;
            const completedText = quest.completed ? '<p class="text-green-400">✓ Complete</p>' : '';

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="${quest.completed ? "line-through" : ""}">${quest.description}</h3>
                        <p class="text-sm opacity-70">Reward: ${quest.reward}💰</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold">${quest.progress}/${quest.count}</p>
                        ${completedText}
                    </div>
                </div>
                <div class="w-full h-2 bg-gray-800 rounded-full mt-2">
                    <div class="h-full bg-green-500 rounded-full transition-all" style="width: ${progressPercent}%"></div>
                </div>
            `;
            list.appendChild(card);
        });
    },

    // Pet Comparison Tool
    comparePet1Id: null,
    comparePet2Id: null,

    openCompareOverlay() {
        this.comparePet1Id = null;
        this.comparePet2Id = null;
        const pet1El = document.getElementById("comparePet1");
        const pet2El = document.getElementById("comparePet2");
        const overlay = document.getElementById("compareOverlay");
        if (pet1El) pet1El.innerHTML = "Click a pet to select";
        if (pet2El) pet2El.innerHTML = "Click a pet to select";
        if (overlay) overlay.classList.remove("hidden");
    },

    closeCompareOverlay() {
        const overlay = document.getElementById("compareOverlay");
        if (overlay) overlay.classList.add("hidden");
    },

    selectComparePet(petId, slot) {
        const allPets = [...PetManager.pets, ...PetManager.storage];
        const pet = allPets.find(p => String(p.id) === String(petId));

        if (!pet) return;

        if (slot === 1) {
            this.comparePet1Id = petId;
        } else {
            this.comparePet2Id = petId;
        }

        this.renderComparePet(pet, slot);

        // If both pets selected, show comparison
        if (this.comparePet1Id && this.comparePet2Id) {
            this.showComparison();
        }
    },

    renderComparePet(pet, slot) {
        const container = document.getElementById(slot === 1 ? "comparePet1" : "comparePet2");
        const template = PetTypes[pet.typeId];
        const evolution = PetManager.getEvolution(pet);
        const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);

        container.innerHTML = `
            <div class="text-4xl mb-2">${template.emoji}</div>
            <h4>${evolution}</h4>
            <p class="text-sm opacity-80">Level ${pet.level} ${pet.tier}</p>
            <p class="text-sm opacity-80">${template.type.toUpperCase()}</p>
            <div class="mt-4 space-y-1 text-sm">
                <div class="flex justify-between"><span>HP:</span><span>${maxHP}</span></div>
                <div class="flex justify-between"><span>ATK:</span><span>${pet.stats.attack}</span></div>
                <div class="flex justify-between"><span>DEF:</span><span>${pet.stats.defense}</span></div>
                <div class="flex justify-between"><span>SPD:</span><span>${pet.stats.speed}</span></div>
                <div class="flex justify-between"><span>SPC:</span><span>${pet.stats.special}</span></div>
            </div>
            <button onclick="UIManager.selectCompareSlot(${slot})" class="mt-4 border-none rounded-xl px-3 py-1.5 cursor-pointer text-white bg-blue-800 text-sm">Change Pet</button>
        `;
    },

    selectCompareSlot(slot) {
        // Show pet selection dialog
        const allPets = [...PetManager.pets, ...PetManager.storage];
        const petNames = allPets.map(p => {
            const template = PetTypes[p.typeId];
            return `${template.emoji} ${PetManager.getEvolution(p)} (Lv ${p.level})`;
        }).join("\n");

        const choice = prompt(`Select pet for slot ${slot}:\n${petNames}\n\nEnter pet number (1-${allPets.length})`);
        const idx = parseInt(choice, 10) - 1;

        if (!isNaN(idx) && idx >= 0 && idx < allPets.length) {
            this.selectComparePet(allPets[idx].id, slot);
        }
    },

    showComparison() {
        const pet1 = [...PetManager.pets, ...PetManager.storage].find(p => String(p.id) === String(this.comparePet1Id));
        const pet2 = [...PetManager.pets, ...PetManager.storage].find(p => String(p.id) === String(this.comparePet2Id));

        if (!pet1 || !pet2) return;

        const template1 = PetTypes[pet1.typeId];
        const template2 = PetTypes[pet2.typeId];
        const maxHP1 = PetManager.calculateMaxHP(template1, pet1.level, pet1);
        const maxHP2 = PetManager.calculateMaxHP(template2, pet2.level, pet2);

        const stats = [
            { name: "HP", val1: maxHP1, val2: maxHP2 },
            { name: "ATK", val1: pet1.stats.attack, val2: pet2.stats.attack },
            { name: "DEF", val1: pet1.stats.defense, val2: pet2.stats.defense },
            { name: "SPD", val1: pet1.stats.speed, val2: pet2.stats.speed },
            { name: "SPC", val1: pet1.stats.special, val2: pet2.stats.special },
        ];

        const comparisonHTML = stats.map(stat => {
            const diff = stat.val2 - stat.val1;
            const diffClass = diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-gray-400";
            const diffText = diff !== 0 ? `(${diff > 0 ? "+" : ""}${diff})` : "";
            return `<div class="flex justify-between items-center text-sm">
                <span>${stat.name}:</span>
                <span>${stat.val1}</span>
                <span class="${diffClass}">${diffText}</span>
                <span>${stat.val2}</span>
            </div>`;
        }).join("");

        // Add comparison section between the two pet displays
        const container = document.getElementById("compareOverlay");
        if (!container) return;
        const comparisonDiv = document.createElement("div");
        comparisonDiv.className = "bg-white/10 rounded-xl p-4 my-4";
        comparisonDiv.innerHTML = `<h3>Stat Comparison</h3>${comparisonHTML}`;

        // Remove existing comparison if any
        const existing = container.querySelector(".comparison-section");
        if (existing) existing.remove();

        comparisonDiv.classList.add("comparison-section");
        const maxWContainer = container.querySelector(".max-w-4xl");
        const grid = container.querySelector(".grid");
        if (maxWContainer && grid && grid.nextSibling) {
            maxWContainer.insertBefore(comparisonDiv, grid.nextSibling);
        }
    },

    // Export/Import Save Data
    exportSave() {
        const saveData = localStorage.getItem("petSimulator");
        if (!saveData) {
            this.showToast("No save data to export!");
            return;
        }

        const blob = new Blob([saveData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pet_simulator_save_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast("Save data exported successfully!");
    },

    importSave() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const saveData = JSON.parse(event.target.result);

                    if (!saveData.pets || !saveData.money) {
                        this.showToast("Invalid save file format!");
                        return;
                    }

                    if (confirm("This will overwrite your current save. Are you sure?")) {
                        localStorage.setItem("petSimulator", JSON.stringify(saveData));
                        location.reload();
                    }
                } catch (error) {
                    this.showToast("Failed to parse save file!");
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        };

        input.click();
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
    renderPets(searchTerm = "") {
        const list = document.getElementById("petList");
        list.innerHTML = "";

        document.getElementById("partyCount").innerText = PetManager.pets.length;
        document.getElementById("maxPartySize").innerText = PetManager.maxPartySize;

        const filteredPets = PetManager.pets.filter(pet => {
            if (!searchTerm) return true;
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const searchLower = searchTerm.toLowerCase();
            return template.name.toLowerCase().includes(searchLower) ||
                   template.type.toLowerCase().includes(searchLower) ||
                   evolution.toLowerCase().includes(searchLower);
        });

        filteredPets.forEach(pet => {
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
            card.className = `w-[280px] bg-white/10 rounded-2xl p-3.5 mx-2 my-2 ${prestigeBorder} ${shinyBorder} ${tierBorder}`;
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
            this.showToast(`✨ Upgraded to ${result.nextTier}!`);
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
            this.showToast("Select a pet first!");
            return;
        }
        
        const zone = Exploration.zones[zoneId];
        if (PlayerSystem.level < zone.unlockLevel) {
            this.showToast(`Reach player level ${zone.unlockLevel} to unlock ${zone.name}!`);
            return;
        }
        
        // Open floor overlay for zone selection
        this.showFloorOverlay(zoneId);
    },

    showFloorOverlay(zoneId) {
        Exploration.selectedZoneId = zoneId;
        Exploration.floorPage = 0;
        this.applyZoneVisuals(zoneId);
        this.renderFloorOverlay();
        document.getElementById("floorOverlay").classList.remove("hidden");
    },

    applyZoneVisuals(zoneId) {
        // Set dynamic background
        UIManager.setZoneBackground(zoneId);

        // Set weather effects based on zone
        const zoneWeather = {
            lake: "rain",
            ocean: "rain",
            swamp: "fog",
            darkforest: "fog",
            sky: "rain",
            cave: "fog",
            mountain: "snow"
        };

        const weather = zoneWeather[zoneId];
        if (weather) {
            UIManager.setWeather(weather);
        } else {
            UIManager.clearWeather();
        }
    },

    removeZoneVisuals() {
        UIManager.resetBackground();
        UIManager.clearWeather();
    },

    closeFloorOverlay() {
        document.getElementById("floorOverlay").classList.add("hidden");
        this.removeZoneVisuals();
    },

    // Collection Book Screen
    collectionFilter: 'all',

    filterCollection(filter) {
        this.collectionFilter = filter;
        this.renderCollection();
    },

    renderCollection() {
        const grid = document.getElementById("collectionGrid");
        grid.innerHTML = "";

        // Get all pet types the player has collected
        const collectedTypes = new Set();
        PetManager.pets.forEach(pet => collectedTypes.add(pet.typeId));
        PetManager.storage.forEach(pet => collectedTypes.add(pet.typeId));

        const totalTypes = Object.keys(PetTypes).length;
        const collectedCount = collectedTypes.size;

        document.getElementById("collectionCount").innerText = collectedCount;
        document.getElementById("totalPetTypes").innerText = totalTypes;

        // Render each pet type
        for (const [typeId, template] of Object.entries(PetTypes)) {
            const isCollected = collectedTypes.has(typeId);

            // Apply filter
            if (this.collectionFilter === 'collected' && !isCollected) continue;
            if (this.collectionFilter === 'missing' && isCollected) continue;

            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-4 text-center ${isCollected ? 'border-2 border-green-400' : 'border-2 border-gray-600 opacity-60'}`;
            
            const bestPet = this.getBestPetOfType(typeId);
            const bestStats = bestPet ? this.getBestPetStats(bestPet, template) : null;

            card.innerHTML = `
                <div class="text-4xl mb-2">${isCollected ? template.emoji : '❓'}</div>
                <h3 class="font-bold">${template.name}</h3>
                <span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTypeColorClass(template.type)}">${template.type.toUpperCase()}</span>
                ${isCollected ? '<div class="text-green-400 text-sm font-bold mt-2">✓ Collected</div>' : '<div class="text-red-400 text-sm font-bold mt-2">✗ Not Found</div>'}
                ${bestStats ? `
                    <div class="mt-2 text-xs opacity-80">
                        <div>Best: Lv ${bestPet.level} ${bestPet.tier}</div>
                        <div>HP: ${bestStats.hp} | ATK: ${bestStats.attack}</div>
                        <div>DEF: ${bestStats.defense} | SPD: ${bestStats.speed}</div>
                        <div>SPC: ${bestStats.special}</div>
                    </div>
                ` : ''}
                <div class="mt-2 text-xs opacity-60">${template.passive}</div>
            `;
            grid.appendChild(card);
        }
    },

    getBestPetOfType(typeId) {
        let bestPet = null;
        let bestPower = 0;

        const allPets = [...PetManager.pets, ...PetManager.storage];
        for (const pet of allPets) {
            if (pet.typeId === typeId) {
                const power = TeamPowerSystem.calculatePetPower(pet);
                if (power > bestPower) {
                    bestPower = power;
                    bestPet = pet;
                }
            }
        }
        return bestPet;
    },

    getBestPetStats(pet, template) {
        return {
            hp: PetManager.calculateMaxHP(template, pet.level, pet),
            attack: pet.stats.attack,
            defense: pet.stats.defense,
            speed: pet.stats.speed,
            special: pet.stats.special
        };
    },

    // Toast Notification System
    showToast(message, duration = 3000) {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "bg-gray-800/95 border border-white/20 rounded-xl px-4 py-3 text-white text-sm shadow-lg transform transition-all duration-300 translate-x-full";
        toast.innerHTML = message;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove("translate-x-full");
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.add("translate-x-full", "opacity-0");
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, duration);
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
            if (Exploration.autoExplore.active && Exploration.autoExplore.petId) {
                const autoPet = PetManager.pets.find(p => String(p.id) === String(Exploration.autoExplore.petId));
                BattleSystem.playerPet = autoPet ? { ...autoPet } : { ...PetManager.selectedPet };
            } else {
                BattleSystem.playerPet = { ...PetManager.selectedPet };
            }
            BattleSystem.startBattle(BattleSystem.playerPet, BattleSystem.enemyPet);
            this.showScreen("battleScreen");
        } else if (Exploration.autoExplore.active) {
            setTimeout(() => this.startNextAutoExplore(), 1000);
        } else {
            this.showToast("Nothing found this time...");
        }
    },

    showAutoExploreNotification(message, type = "info") {
        const container = document.getElementById("autoExploreNotifications");
        if (!container) return;
        const colors = {
            info: "bg-blue-800",
            success: "bg-green-800",
            error: "bg-red-800",
            warning: "bg-yellow-800"
        };
        const div = document.createElement("div");
        div.className = `${colors[type] || colors.info} text-white rounded-xl px-4 py-3 text-sm shadow-lg transition-all duration-300 opacity-0 translate-x-4`;
        div.innerText = message;
        container.appendChild(div);
        requestAnimationFrame(() => {
            div.classList.remove("opacity-0", "translate-x-4");
        });
        setTimeout(() => {
            div.classList.add("opacity-0", "translate-x-4");
            setTimeout(() => div.remove(), 300);
        }, 3000);
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
        
        const playerSprite = document.getElementById("playerPetSprite");
        const enemySprite = document.getElementById("enemyPetSprite");
        const playerName = document.getElementById("playerPetName");
        const enemyName = document.getElementById("enemyPetName");
        const playerTier = document.getElementById("playerTier");
        const enemyTier = document.getElementById("enemyTier");
        const enemyLevel = document.getElementById("enemyPetLevel");
        const playerHPFill = document.getElementById("playerHPFill");
        const enemyHPFill = document.getElementById("enemyHPFill");
        const playerHPText = document.getElementById("playerHPText");
        const enemyHPText = document.getElementById("enemyHPText");
        const log = document.getElementById("battleLog");
        const attackBtn = document.getElementById("attackBtn");
        const abilityBtn = document.getElementById("abilityBtn");
        const switchBtn = document.getElementById("switchBtn");
        const catchBtn = document.getElementById("catchBtn");
        const autoStopBtn = document.getElementById("autoExploreStopBtn");
        
        if (playerSprite) playerSprite.innerText = playerTemplate.emoji;
        if (enemySprite) enemySprite.innerText = enemyTemplate.emoji;
        if (playerName) playerName.innerText = PetManager.getEvolution(player) + (BattleSystem.bleeding === "player" ? " 🩸" : "") + (BattleSystem.burning === "player" ? " 🔥" + (BattleSystem.burnDuration.player > 0 && BattleSystem.burnDuration.player < 9999 ? BattleSystem.burnDuration.player : "") : "") + (BattleSystem.confused === "player" ? " 🧠" : "") + (BattleSystem.shield.player.turns > 0 ? " 🛡️" : "") + (BattleSystem.poisoned === "player" ? " ☠️" : "");
        if (playerTier) playerTier.innerText = `Tier: ${player.tier || "D1"}`;
        if (enemyName) enemyName.innerText = (enemy.shiny ? "✨ " : "") + PetManager.getEvolution(enemy) + (BattleSystem.bleeding === "enemy" ? " 🩸" : "") + (BattleSystem.burning === "enemy" ? " 🔥" + (BattleSystem.burnDuration.enemy > 0 && BattleSystem.burnDuration.enemy < 9999 ? BattleSystem.burnDuration.enemy : "") : "") + (BattleSystem.confused === "enemy" ? " 🧠" : "") + (BattleSystem.shield.enemy.turns > 0 ? " 🛡️" : "") + (BattleSystem.poisoned === "enemy" ? " ☠️" : "");
        if (enemyTier) enemyTier.innerText = `Tier: ${enemy.tier || "D1"}` + (enemy.shiny ? " ✨" : "");
        if (enemyLevel) enemyLevel.innerText = `Level ${enemy.level}`;

        // Update type effectiveness display
        const typeEffectiveness = BattleSystem.getTypeEffectiveness(playerTemplate.type, enemyTemplate.type);
        const typeEffectivenessDisplay = document.getElementById("typeEffectivenessDisplay");
        if (typeEffectivenessDisplay) {
            if (typeEffectiveness > 1) {
                typeEffectivenessDisplay.innerHTML = `<span class="text-green-400">⚡ Super Effective (${typeEffectiveness.toFixed(1)}x)</span>`;
            } else if (typeEffectiveness < 1) {
                typeEffectivenessDisplay.innerHTML = `<span class="text-red-400">🛡️ Not Very Effective (${typeEffectiveness.toFixed(1)}x)</span>`;
            } else {
                typeEffectivenessDisplay.innerHTML = `<span class="text-gray-400">⚔️ Neutral (1.0x)</span>`;
            }
        }
        
        if (enemySprite) {
            if (enemy.shiny) {
                enemySprite.className = "text-6xl my-2.5 animate-pulse";
            } else {
                enemySprite.className = "text-6xl my-2.5";
            }
        }
        
        if (playerHPFill) playerHPFill.style.width = (player.currentHP / playerMaxHP) * 100 + "%";
        if (enemyHPFill) enemyHPFill.style.width = (enemy.currentHP / enemyMaxHP) * 100 + "%";
        if (playerHPText) playerHPText.innerText = `${player.currentHP}/${playerMaxHP}`;
        if (enemyHPText) enemyHPText.innerText = `${enemy.currentHP}/${enemyMaxHP}`;
        
        // Update battle log
        if (log) {
            log.innerHTML = BattleSystem.battleLog.map(entry => 
                `<div class="py-1 border-b border-white/10">${entry.text}</div>`
            ).join("");
        }
        
        // Update buttons based on turn
        if (!Exploration.autoExplore.active) {
            const hasAbility = playerTemplate && playerTemplate.ability;
            const abilityOnCooldown = BattleSystem.playerAbilityCooldown > 0;
            
            if (abilityBtn) {
                if (hasAbility && !abilityOnCooldown) {
                    abilityBtn.style.display = BattleSystem.isPlayerTurn ? "inline-block" : "none";
                    abilityBtn.disabled = !BattleSystem.isPlayerTurn;
                    abilityBtn.innerText = abilityOnCooldown ? `⏳ ${BattleSystem.playerAbilityCooldown}` : `✨ ${playerTemplate.ability.name}`;
                } else {
                    abilityBtn.style.display = "none";
                }
            }
            
            if (attackBtn) {
                attackBtn.disabled = !BattleSystem.isPlayerTurn;
                attackBtn.style.opacity = BattleSystem.isPlayerTurn ? "1" : "0.5";
            }
            if (switchBtn) {
                switchBtn.disabled = !BattleSystem.isPlayerTurn;
                switchBtn.style.opacity = BattleSystem.isPlayerTurn ? "1" : "0.5";
            }
            if (catchBtn) {
                catchBtn.style.display = BattleSystem.active ? "inline-block" : "none";
            }
            if (autoStopBtn) {
                autoStopBtn.classList.add("hidden");
            }
        } else {
            if (attackBtn) {
                attackBtn.disabled = true;
                attackBtn.style.opacity = "0.5";
            }
            if (abilityBtn) {
                abilityBtn.disabled = true;
                abilityBtn.style.display = "none";
            }
            if (switchBtn) {
                switchBtn.disabled = true;
                switchBtn.style.opacity = "0.5";
            }
            if (catchBtn) {
                catchBtn.style.display = "none";
            }
            if (autoStopBtn) {
                autoStopBtn.classList.remove("hidden");
            }
        }
    },

    playerAttack() {
        if (!BattleSystem.active) return;
        BattleSystem.playerTurn();
    },

    openSwitchOverlay() {
        if (!BattleSystem.active || !BattleSystem.isPlayerTurn) {
            this.showToast("Can only switch during your turn!");
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
            this.showToast("Can only catch during your turn!");
            return;
        }
        
        const result = BattleSystem.tryCatch(BattleSystem.enemyPet);
        this.showToast(result.reason);
        
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
            equipment: "Equipment",
            resource: "Resource",
            currency: "Currency"
        };
        
        for (const [itemId, item] of Object.entries(Economy.shopItems)) {
            if (item.type === "resource") continue;
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
            this.showToast("Not enough money!");
        }
    },

    buyItemMax(itemId) {
        const item = Economy.shopItems[itemId];
        if (!item) return;
        
        const maxAffordable = Math.floor(Economy.money / item.price);
        if (maxAffordable <= 0) {
            this.showToast("Not enough money!");
            return;
        }
        
        if (confirm(`Buy max ${maxAffordable} ${item.name} for ${maxAffordable * item.price} gold?`)) {
            if (Economy.buyItem(itemId, maxAffordable)) {
                DataManager.save();
                this.renderShop();
                this.updateCurrency();
                this.updateTeamPower();
            } else {
                this.showToast("Not enough money!");
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
            this.showToast("Select a pet first!");
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
            this.showToast("Select a pet first!");
            return;
        }

        const item = Economy.shopItems[itemId];
        if (!item) {
            this.showToast("Unknown item!");
            return;
        }

        let qty = 1;
        if (item.type === "xp" || item.type === "heal" || item.type === "training") {
            const owned = Economy.inventory[itemId] || 0;
            const input = prompt(`How many ${item.name}(s) to use? (You have ${owned})`, "1");
            if (input === null) return; // Cancelled
            qty = parseInt(input, 10);
            if (isNaN(qty) || qty < 1) {
                this.showToast("Invalid quantity!");
                return;
            }
            if (qty > owned) {
                this.showToast(`You only have ${owned} ${item.name}(s)!`);
                return;
            }
        }

        if (Economy.useItem(itemId, pet, qty)) {
            DataManager.save();
            this.updatePetScreen();
            this.renderInventory();
            this.updateTeamPower();
        } else {
            this.showToast("Can't use that item!");
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
            this.showToast(result.reason);
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
            this.showToast(result.reason);
        }
    },

    openEquipOverlay() {
        const pet = PetManager.selectedPet;
        if (!pet) {
            this.showToast("Select a pet first!");
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
    renderStorage(searchTerm = "") {
        const grid = document.getElementById("storageGrid");
        grid.innerHTML = "";
        document.getElementById("storageCount").innerText = PetManager.storage.length;

        // Count D1 pets in storage
        const d1Pets = PetManager.storage.filter(pet => pet.tier === "D1");
        const d1Count = d1Pets.length;

        // Filter storage pets based on search term
        const filteredStorage = PetManager.storage.filter(pet => {
            if (!searchTerm) return true;
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const searchLower = searchTerm.toLowerCase();
            return template.name.toLowerCase().includes(searchLower) ||
                   template.type.toLowerCase().includes(searchLower) ||
                   evolution.toLowerCase().includes(searchLower);
        });

        if (filteredStorage.length === 0) {
            grid.innerHTML = searchTerm ? "<p>No pets match your search.</p>" : "<p>No pets in storage yet. Catch more to fill it up!</p>";
            return;
        }

        // Add auto-sell button if there are D1 pets (only when not filtering)
        if (d1Count > 0 && !searchTerm) {
            const autoSellBtn = document.createElement("button");
            autoSellBtn.className = "border-none rounded-xl px-4 py-2.5 cursor-pointer text-white bg-red-600 m-1 transition-all duration-150 text-sm hover:-translate-y-0.5";
            autoSellBtn.innerText = `🗑️ Auto-Sell D1 Pets (${d1Count})`;
            autoSellBtn.onclick = () => this.autoSellD1Pets();
            grid.appendChild(autoSellBtn);
        }

        filteredStorage.forEach(pet => {
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
                this.showToast("Withdraw cancelled.");
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
            this.showToast("You can't deposit your last party member!");
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

    autoSellD1Pets() {
        const d1Pets = PetManager.storage.filter(pet => pet.tier === "D1");
        if (d1Pets.length === 0) {
            this.showToast("No D1 pets in storage to sell!");
            return;
        }

        const totalValue = d1Pets.reduce((sum, pet) => {
            return sum + pet.level * 25 + (pet.prestigeLevel || 0) * 1000 + (pet.shiny ? 5000 : 0) + TierSystem.getTierSellValue(pet.tier);
        }, 0);

        const petList = d1Pets.map(pet => {
            const template = PetTypes[pet.typeId];
            return `${template.emoji} ${PetManager.getEvolution(pet)} (Lv ${pet.level}${pet.shiny ? ' ✨' : ''})`;
        }).join('\n');

        if (confirm(`Sell ${d1Pets.length} D1 pets from storage?\n\nTotal Value: ${totalValue} 💰\n\nPets to sell:\n${petList}`)) {
            d1Pets.forEach(pet => {
                Economy.sellPet(pet);
            });
            DataManager.save();
            this.renderStorage();
            this.updateTeamPower();
            this.updateCurrency();
            this.showToast(`Sold ${d1Pets.length} D1 pets for ${totalValue} 💰!`);
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
            this.showToast("Select a pet first!");
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
            this.showToast("Please select both pets!");
            return;
        }

        const validation = PetManager.canPrestige(this.prestigePetId, this.prestigeMaterialId);
        if (!validation.valid) {
            this.showToast(validation.reason);
            return;
        }
        
        const fuseBtn = document.querySelector('#prestigeButtons button');
        if (fuseBtn) fuseBtn.disabled = true;
        
        const result = PetManager.prestigeFuse(this.prestigePetId, this.prestigeMaterialId);
        
        if (fuseBtn) fuseBtn.disabled = false;
        
        if (result.success) {
            const pet = result.pet;
            const template = PetTypes[pet.typeId];
            this.showToast(`✨ Prestige ${pet.prestigeLevel} achieved! ${template.name} gained: +${pet.bonusStats.hp} HP | +${pet.bonusStats.attack} ATK | +${pet.bonusStats.defense} DEF | +${pet.bonusStats.speed} SPD | +${pet.bonusStats.special} SPC`);
            DataManager.save();
            this.closePrestigeOverlay();
            this.showScreen("mainScreen");
            this.renderPets();
            this.updateTeamPower();
        } else {
            this.showToast(result.reason);
        }
    },

    closePrestigeOverlay() {
        document.getElementById("prestigeOverlay").classList.add("hidden");
        this.prestigePetId = null;
        this.prestigeMaterialId = null;
        this.prestigeStep = 1;
    },

    renderCrafting() {
        const resourceGrid = document.getElementById("craftingResources");
        resourceGrid.innerHTML = "";
        const resourceItems = ["woodStick", "rock", "leather", "ore", "herbs", "crystal", "darkRock"];
        const resourceEmojis = {
            woodStick: "🪵", rock: "🪨", leather: "🥾", ore: "⛏️",
            herbs: "🌿", crystal: "💎", darkRock: "🟣"
        };
        resourceItems.forEach(itemId => {
            const item = Economy.shopItems[itemId];
            if (!item) return;
            const count = Economy.inventory[itemId] || 0;
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-2.5 text-center";
            card.innerHTML = `
                <div class="text-2xl">${resourceEmojis[itemId]}</div>
                <div class="text-xs mt-1">${item.name}</div>
                <div class="text-yellow-400 font-bold text-sm">${count}</div>
            `;
            resourceGrid.appendChild(card);
        });

        const recipeGrid = document.getElementById("craftingRecipes");
        recipeGrid.innerHTML = "";
        for (const [recipeId, recipe] of Object.entries(CraftingSystem.recipes)) {
            const canCraft = CraftingSystem.canCraft(recipeId);
            const costText = Object.entries(recipe.cost).map(([itemId, qty]) => {
                const rItem = Economy.shopItems[itemId];
                const owned = Economy.inventory[itemId] || 0;
                const has = owned >= qty;
                const emojis = { woodStick: "🪵", rock: "🪨", leather: "🥾", ore: "⛏️", herbs: "🌿", crystal: "💎", darkRock: "🟣" };
                return `<span class="${has ? "text-green-400" : "text-red-400"}">${emojis[itemId] || ""} ${qty}/${owned}</span>`;
            }).join(" ");

            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center";
            card.innerHTML = `
                <h4>${recipe.name}</h4>
                <div class="text-xs my-2 opacity-80">${costText}</div>
                <button onclick="UIManager.craftItem('${recipeId}')" ${canCraft ? "" : "disabled"} class="border-none rounded-xl px-4 py-2.5 cursor-pointer text-white m-1 transition-all duration-150 text-sm hover:-translate-y-0.5 ${canCraft ? "bg-yellow-800" : "bg-gray-600 opacity-50 cursor-not-allowed"}">Craft</button>
            `;
            recipeGrid.appendChild(card);
        }
    },

    craftItem(recipeId) {
        if (!CraftingSystem.canCraft(recipeId)) {
            this.showToast("Not enough resources!");
            return;
        }
        CraftingSystem.craft(recipeId);
        PlayerSystem.totalCrafts++;
        // Update quest progress for crafting
        DataManager.updateQuestProgress("craft", recipeId);
        AchievementSystem.checkAchievement("craft10");
        AchievementSystem.checkAchievement("craft50");
        DataManager.save();
        this.renderCrafting();
        this.updateCurrency();
    },

    openAutoExploreSetup() {
        if (PlayerSystem.level < 50) {
            this.showToast("Reach player level 50 to unlock Auto Explore!");
            return;
        }
        Exploration.autoExplore.active = false;
        Exploration.autoExplore.zoneId = null;
        Exploration.autoExplore.floorIndex = null;
        Exploration.autoExplore.petId = null;
        document.getElementById("autoExploreOverlay").classList.remove("hidden");
        this.renderAutoExploreZones();
        document.getElementById("autoExploreInfo").innerHTML = "<p class='text-center opacity-80'>Step 1: Select a zone</p>";
    },

    renderAutoExploreZones() {
        const grid = document.getElementById("autoExploreZoneGrid");
        grid.innerHTML = "";
        for (const [zoneId, zone] of Object.entries(Exploration.zones)) {
            const isLocked = PlayerSystem.level < zone.unlockLevel;
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-150 ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-white/12 hover:-translate-y-0.5"}`;
            card.innerHTML = `
                <div class="text-3xl">${zone.emoji}</div>
                <h4>${zone.name}</h4>
                <p class="text-xs opacity-70">Floors 1-${zone.maxFloor}</p>
                ${isLocked ? `<p class="text-red-400 text-xs">🔒 Lv ${zone.unlockLevel}</p>` : ""}
            `;
            if (!isLocked) {
                card.onclick = () => {
                    Exploration.autoExplore.zoneId = zoneId;
                    this.renderAutoExploreFloors(zoneId);
                    document.getElementById("autoExploreInfo").innerHTML = `<p class='text-center opacity-80'>Step 2: Select a floor in ${zone.emoji} ${zone.name}</p>`;
                };
            }
            grid.appendChild(card);
        }
    },

    renderAutoExploreFloors(zoneId) {
        const zone = Exploration.zones[zoneId];
        const grid = document.getElementById("autoExploreFloorGrid");
        grid.innerHTML = "";
        const floorsPerPage = 10;
        const totalPages = Math.ceil(zone.maxFloor / floorsPerPage);
        const page = Exploration.autoExploreFloorPage || 0;
        const startFloor = page * floorsPerPage + 1;
        const endFloor = Math.min(startFloor + floorsPerPage - 1, zone.maxFloor);
        for (let i = startFloor; i <= endFloor; i++) {
            const floorMin = (i - 1) * zone.floorSize + 1;
            const floorMax = i * zone.floorSize;
            const isLocked = PlayerSystem.level < floorMin;
            const isRecommended = PlayerSystem.level >= floorMin && PlayerSystem.level <= floorMax;
            const card = document.createElement("div");
            card.className = `bg-white/10 rounded-xl p-3 text-center cursor-pointer transition-all duration-150 ${isLocked ? "opacity-40 cursor-not-allowed" : "hover:bg-white/12 hover:-translate-y-0.5"} ${isRecommended ? "border-2 border-green-400" : ""}`;
            card.innerHTML = `
                <div class="font-bold">Floor ${i}</div>
                <div class="text-xs opacity-70">Lv ${floorMin}-${floorMax}</div>
                ${isLocked ? `<div class="text-red-400 text-xs">🔒 Lv ${floorMin}</div>` : ""}
                ${isRecommended ? `<div class="text-green-400 text-xs">⭐ Recommended</div>` : ""}
            `;
            if (!isLocked) {
                card.onclick = () => {
                    Exploration.autoExplore.floorIndex = i;
                    this.renderAutoExplorePets();
                    document.getElementById("autoExploreInfo").innerHTML = `<p class='text-center opacity-80'>Step 3: Select a pet for ${zone.emoji} ${zone.name} Floor ${i} (Lv ${floorMin}-${floorMax})</p>`;
                };
            }
            grid.appendChild(card);
        }
        document.getElementById("autoExploreFloorNav").classList.remove("hidden");
        document.getElementById("autoExploreFloorPrev").disabled = page === 0;
        document.getElementById("autoExploreFloorNext").disabled = page >= totalPages - 1;
        document.getElementById("autoExploreFloorInfo").innerText = `Page ${page + 1}/${totalPages}`;
    },

    renderAutoExplorePets() {
        const grid = document.getElementById("autoExplorePetGrid");
        grid.innerHTML = "";
        PetManager.pets.forEach(pet => {
            if (pet.currentHP <= 0) return;
            const template = PetTypes[pet.typeId];
            const evolution = PetManager.getEvolution(pet);
            const maxHP = PetManager.calculateMaxHP(template, pet.level, pet);
            const hpPercent = (pet.currentHP / maxHP) * 100;
            const prestigeSuffix = pet.prestigeLevel > 0 ? (pet.prestigeLevel >= 10 ? ` [P${pet.prestigeLevel}]` : ` ${this.toRoman(pet.prestigeLevel)}`) : "";
            const tierBadge = `<span class="inline-block px-2.5 py-1 rounded-full text-xs m-0.5 ${this.getTierColorClass(pet.tier)}">${pet.tier}</span>`;
            const card = document.createElement("div");
            card.className = "bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all";
            card.innerHTML = `
                <h4>${template.emoji} ${evolution}${prestigeSuffix}</h4>
                ${tierBadge}
                <div class="text-sm">Level ${pet.level}</div>
                <div class="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-red-400 to-red-500" style="width: ${hpPercent}%"></div>
                </div>
                <div class="text-xs opacity-80">HP ${pet.currentHP}/${maxHP}</div>
            `;
            card.onclick = () => {
                Exploration.autoExplore.petId = pet.id;
                document.getElementById("autoExploreStartBtn").disabled = false;
                document.getElementById("autoExplorePetInfo").innerHTML = `<p class='text-center'>Selected: ${template.emoji} ${evolution}${prestigeSuffix} (Lv ${pet.level})</p>`;
            };
            grid.appendChild(card);
        });
    },

    startAutoExplore() {
        if (!Exploration.autoExplore.zoneId || !Exploration.autoExplore.floorIndex || !Exploration.autoExplore.petId) {
            this.showToast("Please select zone, floor, and pet!");
            return;
        }
        const pet = PetManager.pets.find(p => String(p.id) === String(Exploration.autoExplore.petId));
        if (!pet || pet.currentHP <= 0) {
            this.showToast("Selected pet not found or has no HP!");
            return;
        }
        Exploration.autoExplore.active = true;
        document.getElementById("autoExploreOverlay").classList.add("hidden");
        const floatingBtn = document.getElementById("autoExploreFloatingStop");
        if (floatingBtn) floatingBtn.classList.remove("hidden");
        this.doExploreWithFloor(Exploration.autoExplore.zoneId, Exploration.autoExplore.floorIndex);
    },

    startNextAutoExplore() {
        if (!Exploration.autoExplore.active) return;
        const zone = Exploration.zones[Exploration.autoExplore.zoneId];
        if (!zone) {
            this.stopAutoExplore("Zone not found");
            return;
        }
        const nextFloor = Exploration.autoExplore.floorIndex || 1;
        setTimeout(() => {
            this.doExploreWithFloor(Exploration.autoExplore.zoneId, nextFloor);
        }, 1000);
    },

    autoExploreFloorPrev() {
        const zoneId = Exploration.autoExplore.zoneId;
        const zone = Exploration.zones[zoneId];
        if (!zone) return;
        const floorsPerPage = 10;
        const totalPages = Math.ceil(zone.maxFloor / floorsPerPage);
        if (Exploration.autoExploreFloorPage > 0) {
            Exploration.autoExploreFloorPage--;
            this.renderAutoExploreFloors(zoneId);
        }
    },

    autoExploreFloorNext() {
        const zoneId = Exploration.autoExplore.zoneId;
        const zone = Exploration.zones[zoneId];
        if (!zone) return;
        const floorsPerPage = 10;
        const totalPages = Math.ceil(zone.maxFloor / floorsPerPage);
        if (Exploration.autoExploreFloorPage < totalPages - 1) {
            Exploration.autoExploreFloorPage++;
            this.renderAutoExploreFloors(zoneId);
        }
    },

    stopAutoExplore(reason) {
        Exploration.autoExplore.active = false;
        BattleSystem.autoExploreActive = false;
        BattleSystem.autoExplorePetId = null;
        const floatingBtn = document.getElementById("autoExploreFloatingStop");
        if (floatingBtn) floatingBtn.classList.add("hidden");
        const notifContainer = document.getElementById("autoExploreNotifications");
        if (notifContainer) notifContainer.classList.add("hidden");
        this.showScreen("mainScreen");
        if (reason) alert(reason || "Auto-explore stopped.");
    }
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => Game.init());
