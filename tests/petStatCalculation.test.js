// Unit Tests for Pet Stat Calculations
// These tests verify the pet stat calculation logic from PetManager

// Mock PetTypes for testing
const PetTypes = {
    emberFox: {
        type: "fire",
        name: "Ember Fox",
        evolution: ["Ember Fox", "Flame Cat", "Inferno Emperor"],
        baseStats: { hp: 45, attack: 52, defense: 43, speed: 65, special: 60 },
        passive: [],
        ability: { name: "Fireball", type: "fire", burn: true, cooldown: 3 }
    },
    aquaTurtle: {
        type: "water",
        name: "Aqua Turtle",
        evolution: ["Aqua Turtle", "Hydro Tortoise", "Tidal Titan"],
        baseStats: { hp: 65, attack: 49, defense: 64, speed: 43, special: 50 },
        passive: [],
        ability: { name: "Water Gun", type: "water", cooldown: 3 }
    },
    leafBunny: {
        type: "grass",
        name: "Leaf Bunny",
        evolution: ["Leaf Bunny", "Forest Hopper", "Nature Guardian"],
        baseStats: { hp: 55, attack: 45, defense: 50, speed: 60, special: 55 },
        passive: [],
        ability: { name: "Vine Whip", type: "grass", cooldown: 3 }
    }
};

// Mock EquipmentSystem for testing
const EquipmentSystem = {
    equipment: {
        basicSword: {
            stats: { hp: 0, attack: 5, defense: 0, speed: 0, special: 0 }
        },
        basicArmor: {
            stats: { hp: 10, attack: 0, defense: 5, speed: 0, special: 0 }
        }
    }
};

// Simplified PetManager stat calculation functions for testing
function calculateTierBonus(tier) {
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
}

function calculateMaxHP(template, level, pet) {
    const base = Math.floor((template.baseStats.hp * 2 * level) / 100) + level + 10;
    const bonus = pet?.bonusStats?.hp || 0;
    const levelBonus = pet?.levelBonusStats?.hp || 0;
    const shinyBonus = pet?.shinyBonus?.hp || 0;
    const tierBonus = pet?.tierBonus || 0;
    
    // Calculate equipment stats from equipmentSlots
    let equipHP = 0;
    if (pet?.equipmentSlots) {
        for (const slot of ['weapon', 'armor', 'ring']) {
            const equipId = pet.equipmentSlots[slot];
            if (equipId && EquipmentSystem.equipment[equipId]?.stats?.hp) {
                equipHP += EquipmentSystem.equipment[equipId].stats.hp;
            }
        }
    }
    
    return base + bonus + levelBonus + shinyBonus + tierBonus + equipHP;
}

function calculateStats(template, level, pet) {
    const stats = {};
    for (const stat in template.baseStats) {
        if (stat === "hp") continue;
        const base = Math.floor((template.baseStats[stat] * 2 * level) / 100) + 5;
        const bonus = pet?.bonusStats?.[stat] || 0;
        const levelBonus = pet?.levelBonusStats?.[stat] || 0;
        const shinyBonus = pet?.shinyBonus?.[stat] || 0;
        const tierBonus = pet?.tierBonus || 0;
        
        // Calculate equipment stats from equipmentSlots
        let equipStat = 0;
        if (pet?.equipmentSlots) {
            for (const slot of ['weapon', 'armor', 'ring']) {
                const equipId = pet.equipmentSlots[slot];
                if (equipId && EquipmentSystem.equipment[equipId]?.stats?.[stat]) {
                    equipStat += EquipmentSystem.equipment[equipId].stats[stat];
                }
            }
        }
        
        stats[stat] = base + bonus + levelBonus + shinyBonus + tierBonus + equipStat;
    }
    return stats;
}

function xpNeeded(level) {
    return level * 100;
}

function gainXP(pet, amount) {
    pet.xp += amount;
    let leveledUp = false;
    const startLevel = pet.level;
    const startMaxHP = calculateMaxHP(PetTypes[pet.typeId], startLevel, pet);

    while (pet.xp >= xpNeeded(pet.level) && pet.level < 1000) {
        pet.xp -= xpNeeded(pet.level);
        pet.level++;
        pet.stats = calculateStats(PetTypes[pet.typeId], pet.level, pet);
        leveledUp = true;
    }

    if (leveledUp) {
        const newMaxHP = calculateMaxHP(PetTypes[pet.typeId], pet.level, pet);
        let newHP = Math.floor((pet.currentHP / startMaxHP) * newMaxHP);
        newHP = Math.min(newHP, newMaxHP);
        pet.currentHP = newHP;
    }

    return leveledUp;
}

// Test Suite
const PetStatCalculationTests = {
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    failures: [],

    assert(condition, testName) {
        this.testsRun++;
        if (condition) {
            this.testsPassed++;
            console.log(`✓ ${testName}`);
        } else {
            this.testsFailed++;
            this.failures.push(testName);
            console.log(`✗ ${testName}`);
        }
    },

    assertEqual(actual, expected, testName) {
        this.assert(actual === expected, testName);
    },

    assertApproxEqual(actual, expected, tolerance, testName) {
        const diff = Math.abs(actual - expected);
        this.assert(diff <= tolerance, testName);
    },

    runAllTests() {
        console.log("=== Pet Stat Calculation Unit Tests ===\n");
        
        this.testBaseStatCalculation();
        this.testMaxHPFormula();
        this.testTierBonusCalculation();
        this.testShinyBonusCalculation();
        this.testPrestigeBonusCalculation();
        this.testEquipmentStatBonus();
        this.testLevelUpStatGrowth();
        this.testEvolutionNames();
        this.testXPRequirement();
        this.testXPGainAndLevelUp();
        
        console.log("\n=== Test Summary ===");
        console.log(`Tests Run: ${this.testsRun}`);
        console.log(`Tests Passed: ${this.testsPassed}`);
        console.log(`Tests Failed: ${this.testsFailed}`);
        
        if (this.failures.length > 0) {
            console.log("\nFailed Tests:");
            this.failures.forEach(f => console.log(`  - ${f}`));
        }
        
        return this.testsFailed === 0;
    },

    testBaseStatCalculation() {
        console.log("\n--- Base Stat Calculation ---");
        
        const template = PetTypes.emberFox;
        const level = 1;
        const pet = {
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            tierBonus: 0
        };
        
        const stats = calculateStats(template, level, pet);
        
        // Formula: (baseStat * 2 * level) / 100 + 5
        // Attack: (52 * 2 * 1) / 100 + 5 = 104 / 100 + 5 = 1.04 + 5 = 6.04 ≈ 6
        const expectedAttack = Math.floor((template.baseStats.attack * 2 * level) / 100) + 5;
        
        this.assertEqual(stats.attack, expectedAttack,
            `Attack stat should be ${expectedAttack} at level 1`);
        
        console.log(`  Level: ${level}`);
        console.log(`  Base Attack: ${template.baseStats.attack}`);
        console.log(`  Calculated Attack: ${stats.attack}`);
        console.log(`  Expected Attack: ${expectedAttack}`);
    },

    testMaxHPFormula() {
        console.log("\n--- Max HP Formula ---");
        
        const template = PetTypes.emberFox;
        const level = 1;
        const pet = {
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            tierBonus: 0
        };
        
        const maxHP = calculateMaxHP(template, level, pet);
        
        // Formula: (baseHP * 2 * level) / 100 + level + 10
        // (45 * 2 * 1) / 100 + 1 + 10 = 90 / 100 + 11 = 0.9 + 11 = 11.9 ≈ 11
        const expectedHP = Math.floor((template.baseStats.hp * 2 * level) / 100) + level + 10;
        
        this.assertEqual(maxHP, expectedHP,
            `Max HP should be ${expectedHP} at level 1`);
        
        console.log(`  Level: ${level}`);
        console.log(`  Base HP: ${template.baseStats.hp}`);
        console.log(`  Calculated Max HP: ${maxHP}`);
        console.log(`  Expected Max HP: ${expectedHP}`);
    },

    testTierBonusCalculation() {
        console.log("\n--- Tier Bonus Calculation ---");
        
        // Test D1 tier
        const d1Bonus = calculateTierBonus("D1");
        this.assertEqual(d1Bonus, 2, "D1 tier bonus should be 2");
        
        // Test D5 tier
        const d5Bonus = calculateTierBonus("D5");
        this.assertEqual(d5Bonus, 10, "D5 tier bonus should be 10");
        
        // Test A1 tier
        const a1Bonus = calculateTierBonus("A1");
        this.assertEqual(a1Bonus, 85, "A1 tier bonus should be 85");
        
        // Test S5 tier
        const s5Bonus = calculateTierBonus("S5");
        this.assertEqual(s5Bonus, 270, "S5 tier bonus should be 270");
        
        console.log(`  D1: ${d1Bonus}, D5: ${d5Bonus}`);
        console.log(`  A1: ${a1Bonus}, S5: ${s5Bonus}`);
    },

    testShinyBonusCalculation() {
        console.log("\n--- Shiny Bonus Calculation ---");
        
        const template = PetTypes.emberFox;
        const level = 1;
        
        // Non-shiny pet
        const normalPet = {
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            tierBonus: 0
        };
        
        // Shiny pet (15% bonus to base stats)
        const shinyPet = {
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: {
                hp: Math.floor(template.baseStats.hp * 0.15),
                attack: Math.floor(template.baseStats.attack * 0.15),
                defense: Math.floor(template.baseStats.defense * 0.15),
                speed: Math.floor(template.baseStats.speed * 0.15),
                special: Math.floor(template.baseStats.special * 0.15)
            },
            tierBonus: 0
        };
        
        const normalStats = calculateStats(template, level, normalPet);
        const shinyStats = calculateStats(template, level, shinyPet);
        
        this.assert(shinyStats.attack > normalStats.attack,
            "Shiny pet should have higher attack than normal pet");
        
        console.log(`  Normal Attack: ${normalStats.attack}`);
        console.log(`  Shiny Attack: ${shinyStats.attack}`);
        console.log(`  Shiny Bonus: ${shinyPet.shinyBonus.attack}`);
    },

    testPrestigeBonusCalculation() {
        console.log("\n--- Prestige Bonus Calculation ---");
        
        const template = PetTypes.emberFox;
        const level = 10;
        
        // Pet with prestige level 5
        const prestigePet = {
            bonusStats: {
                hp: 5 * 5,  // prestigeLevel * 5
                attack: 5 * 5,
                defense: 5 * 5,
                speed: 5 * 5,
                special: 5 * 5
            },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            tierBonus: 0
        };
        
        const stats = calculateStats(template, level, prestigePet);
        
        // Each stat should have +25 bonus from prestige
        this.assertEqual(stats.attack - (Math.floor((template.baseStats.attack * 2 * level) / 100) + 5), 25,
            "Prestige level 5 should add 25 to attack stat");
        
        console.log(`  Prestige Level: 5`);
        console.log(`  Prestige Bonus per stat: 25`);
        console.log(`  Attack with prestige: ${stats.attack}`);
    },

    testEquipmentStatBonus() {
        console.log("\n--- Equipment Stat Bonus ---");
        
        const template = PetTypes.emberFox;
        const level = 1;
        
        // Pet with equipment
        const equippedPet = {
            bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
            tierBonus: 0,
            equipmentSlots: {
                weapon: "basicSword",
                armor: "basicArmor",
                ring: null
            }
        };
        
        const stats = calculateStats(template, level, equippedPet);
        const maxHP = calculateMaxHP(template, level, equippedPet);
        
        // Basic sword adds 5 attack, basic armor adds 10 HP and 5 defense
        const baseAttack = Math.floor((template.baseStats.attack * 2 * level) / 100) + 5;
        const baseHP = Math.floor((template.baseStats.hp * 2 * level) / 100) + level + 10;
        
        this.assertEqual(stats.attack, baseAttack + 5,
            "Basic sword should add 5 to attack");
        this.assertEqual(maxHP, baseHP + 10,
            "Basic armor should add 10 to HP");
        
        console.log(`  Base Attack: ${baseAttack}, With Sword: ${stats.attack}`);
        console.log(`  Base HP: ${baseHP}, With Armor: ${maxHP}`);
    },

    testLevelUpStatGrowth() {
        console.log("\n--- Level Up Stat Growth ---");
        
        const template = PetTypes.emberFox;
        const pet = {
            typeId: "emberFox",
            level: 1,
            xp: 0,
            currentHP: 11,
            stats: calculateStats(template, 1, {
                bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                tierBonus: 0
            })
        };
        
        const level1Stats = { ...pet.stats };
        
        // Gain enough XP to level up to level 2
        gainXP(pet, xpNeeded(1));
        
        this.assertEqual(pet.level, 2, "Pet should be level 2 after gaining XP");
        this.assert(pet.stats.attack > level1Stats.attack,
            "Attack should increase after level up");
        
        console.log(`  Level 1 Attack: ${level1Stats.attack}`);
        console.log(`  Level 2 Attack: ${pet.stats.attack}`);
        console.log(`  Attack Growth: ${pet.stats.attack - level1Stats.attack}`);
    },

    testEvolutionNames() {
        console.log("\n--- Evolution Names ---");
        
        const template = PetTypes.emberFox;
        
        // Level 1 (first evolution)
        const pet1 = { typeId: "emberFox", level: 1 };
        const evo1 = template.evolution[0];
        
        // Level 15 (second evolution)
        const pet15 = { typeId: "emberFox", level: 15 };
        const evo2 = template.evolution[1];
        
        // Level 30 (third evolution)
        const pet30 = { typeId: "emberFox", level: 30 };
        const evo3 = template.evolution[2];
        
        this.assertEqual(evo1, "Ember Fox", "First evolution should be Ember Fox");
        this.assertEqual(evo2, "Flame Cat", "Second evolution should be Flame Cat");
        this.assertEqual(evo3, "Inferno Emperor", "Third evolution should be Inferno Emperor");
        
        console.log(`  Level 1: ${evo1}`);
        console.log(`  Level 15: ${evo2}`);
        console.log(`  Level 30: ${evo3}`);
    },

    testXPRequirement() {
        console.log("\n--- XP Requirement ---");
        
        this.assertEqual(xpNeeded(1), 100, "Level 1 should require 100 XP");
        this.assertEqual(xpNeeded(10), 1000, "Level 10 should require 1000 XP");
        this.assertEqual(xpNeeded(50), 5000, "Level 50 should require 5000 XP");
        
        console.log(`  Level 1: ${xpNeeded(1)} XP`);
        console.log(`  Level 10: ${xpNeeded(10)} XP`);
        console.log(`  Level 50: ${xpNeeded(50)} XP`);
    },

    testXPGainAndLevelUp() {
        console.log("\n--- XP Gain and Level Up ---");
        
        const template = PetTypes.emberFox;
        const pet = {
            typeId: "emberFox",
            level: 1,
            xp: 0,
            currentHP: calculateMaxHP(template, 1, {
                bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                tierBonus: 0
            }),
            stats: calculateStats(template, 1, {
                bonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                levelBonusStats: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                shinyBonus: { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
                tierBonus: 0
            })
        };
        
        const initialLevel = pet.level;
        
        // Gain exactly enough XP to level up once
        const leveledUp = gainXP(pet, xpNeeded(1));
        
        this.assert(leveledUp, "Pet should level up after gaining required XP");
        this.assertEqual(pet.level, initialLevel + 1, "Pet level should increase by 1");
        this.assertEqual(pet.xp, 0, "XP should be reset to 0 after level up");
        
        console.log(`  Initial Level: ${initialLevel}`);
        console.log(`  Final Level: ${pet.level}`);
        console.log(`  Remaining XP: ${pet.xp}`);
    }
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    PetStatCalculationTests.runAllTests();
    process.exit(PetStatCalculationTests.testsFailed === 0 ? 0 : 1);
}

// Export for browser testing
if (typeof window !== 'undefined') {
    window.PetStatCalculationTests = PetStatCalculationTests;
}
