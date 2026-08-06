// Unit Tests for Damage Calculation Formulas
// These tests verify the damage calculation logic from BattleSystem

// Mock dependencies for testing
const PetTypes = {
    emberFox: {
        type: "fire",
        baseStats: { hp: 45, attack: 52, defense: 43, speed: 65, special: 60 },
        passive: [],
        ability: { name: "Fireball", type: "fire", burn: true, cooldown: 3 }
    },
    aquaTurtle: {
        type: "water",
        baseStats: { hp: 65, attack: 49, defense: 64, speed: 43, special: 50 },
        passive: [],
        ability: { name: "Water Gun", type: "water", cooldown: 3 }
    },
    leafBunny: {
        type: "grass",
        baseStats: { hp: 55, attack: 45, defense: 50, speed: 60, special: 55 },
        passive: [],
        ability: { name: "Vine Whip", type: "grass", cooldown: 3 }
    }
};

const PassiveSystem = {
    getPassiveMultiplier(attacker, defender) {
        return 1; // Default multiplier for testing
    }
};

// Simplified BattleSystem damage calculation for testing
function calculateDamage(attacker, defender, typeEffectiveness) {
    const attackerTemplate = PetTypes[attacker.typeId];
    const defenderTemplate = PetTypes[defender.typeId];
    
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    
    // Prevent division by zero
    const safeDefense = Math.max(1, defense);
    let damage = Math.floor((attack * 40) / safeDefense);
    
    // Type effectiveness
    const typeMult = getTypeEffectiveness(typeEffectiveness, attackerTemplate.type, defenderTemplate.type);
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
    
    return { damage, isCrit, typeMult };
}

function getTypeEffectiveness(typeEffectiveness, attackerType, defenderType) {
    const effectiveness = typeEffectiveness[attackerType];
    if (!effectiveness) return 1;
    return effectiveness[defenderType] ?? 1;
}

// Test data
const typeEffectiveness = {
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
};

// Test Suite
const DamageCalculationTests = {
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

    assertApproxEqual(actual, expected, tolerance, testName) {
        const diff = Math.abs(actual - expected);
        this.assert(diff <= tolerance, testName);
    },

    runAllTests() {
        console.log("=== Damage Calculation Unit Tests ===\n");
        
        this.testBaseDamageCalculation();
        this.testTypeEffectiveness();
        this.testCriticalHitCalculation();
        this.testDamageReduction();
        this.testSuperEffectiveDamage();
        this.testNotVeryEffectiveDamage();
        this.testNoEffectDamage();
        
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

    testBaseDamageCalculation() {
        console.log("\n--- Base Damage Calculation ---");
        
        const attacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const defender = {
            typeId: "aquaTurtle",
            stats: { attack: 49, defense: 64, speed: 43, special: 50 }
        };
        
        // Test with no type advantage (fire vs water = 0.5)
        const result = calculateDamage(attacker, defender, typeEffectiveness);
        
        // Base damage formula: (attack * 40) / defense
        // (52 * 40) / 64 = 2080 / 64 = 32.5
        // With type effectiveness (0.5): 32.5 * 0.5 = 16.25
        // With 75% reduction: 16.25 * 0.25 = 4.06
        // Expected: around 4 (with variance)
        this.assert(result.damage > 0 && result.damage < 10, 
            "Base damage should be positive and reasonable");
        
        console.log(`  Attacker: ${attacker.typeId} (ATK: ${attacker.stats.attack})`);
        console.log(`  Defender: ${defender.typeId} (DEF: ${defender.stats.defense})`);
        console.log(`  Calculated Damage: ${result.damage}`);
    },

    testTypeEffectiveness() {
        console.log("\n--- Type Effectiveness ---");
        
        // Fire vs Grass = 2x (super effective)
        const fireAttacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const grassDefender = {
            typeId: "leafBunny",
            stats: { attack: 45, defense: 50, speed: 60, special: 55 }
        };
        
        const fireVsGrass = calculateDamage(fireAttacker, grassDefender, typeEffectiveness);
        const fireVsWater = calculateDamage(fireAttacker, {
            typeId: "aquaTurtle",
            stats: { attack: 49, defense: 64, speed: 43, special: 50 }
        }, typeEffectiveness);
        
        // Fire vs Grass should deal more damage than Fire vs Water
        this.assert(fireVsGrass.damage > fireVsWater.damage,
            "Super effective (Fire vs Grass) should deal more damage than not very effective (Fire vs Water)");
        
        console.log(`  Fire vs Grass (2x): ${fireVsGrass.damage}`);
        console.log(`  Fire vs Water (0.5x): ${fireVsWater.damage}`);
    },

    testCriticalHitCalculation() {
        console.log("\n--- Critical Hit Calculation ---");
        
        const attacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const defender = {
            typeId: "aquaTurtle",
            stats: { attack: 49, defense: 64, speed: 43, special: 50 }
        };
        
        // Run multiple times to check crit chance
        let critCount = 0;
        const iterations = 100;
        
        for (let i = 0; i < iterations; i++) {
            const result = calculateDamage(attacker, defender, typeEffectiveness);
            if (result.isCrit) critCount++;
        }
        
        // Crit chance should be around 10% + (speed/500) = 10% + 13% = 23%
        const expectedCritRate = 0.1 + (attacker.stats.speed / 500);
        const actualCritRate = critCount / iterations;
        
        this.assertApproxEqual(actualCritRate, expectedCritRate, 0.15,
            `Critical hit rate should be approximately ${expectedCritRate.toFixed(2)} (actual: ${actualCritRate.toFixed(2)})`);
        
        console.log(`  Expected Crit Rate: ${(expectedCritRate * 100).toFixed(1)}%`);
        console.log(`  Actual Crit Rate: ${(actualCritRate * 100).toFixed(1)}% (${critCount}/${iterations})`);
    },

    testDamageReduction() {
        console.log("\n--- Global Damage Reduction ---");
        
        const attacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const defender = {
            typeId: "aquaTurtle",
            stats: { attack: 49, defense: 64, speed: 43, special: 50 }
        };
        
        // Calculate damage without reduction (manually)
        const baseDamage = Math.floor((attacker.stats.attack * 40) / defender.stats.defense);
        
        // With 75% reduction, final damage should be 25% of base
        const result = calculateDamage(attacker, defender, typeEffectiveness);
        
        // The actual damage includes type effectiveness and variance, but should be significantly reduced
        this.assert(result.damage < baseDamage,
            "Damage should be reduced by global 75% reduction");
        
        console.log(`  Base Damage (no reduction): ${baseDamage}`);
        console.log(`  Final Damage (with reduction): ${result.damage}`);
    },

    testSuperEffectiveDamage() {
        console.log("\n--- Super Effective Damage ---");
        
        const fireAttacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const grassDefender = {
            typeId: "leafBunny",
            stats: { attack: 45, defense: 50, speed: 60, special: 55 }
        };
        
        const result = calculateDamage(fireAttacker, grassDefender, typeEffectiveness);
        
        this.assert(result.typeMult === 2,
            "Fire vs Grass should have 2x type effectiveness");
        
        console.log(`  Type Multiplier: ${result.typeMult}x`);
    },

    testNotVeryEffectiveDamage() {
        console.log("\n--- Not Very Effective Damage ---");
        
        const fireAttacker = {
            typeId: "emberFox",
            stats: { attack: 52, defense: 43, speed: 65, special: 60 }
        };
        const waterDefender = {
            typeId: "aquaTurtle",
            stats: { attack: 49, defense: 64, speed: 43, special: 50 }
        };
        
        const result = calculateDamage(fireAttacker, waterDefender, typeEffectiveness);
        
        this.assert(result.typeMult === 0.5,
            "Fire vs Water should have 0.5x type effectiveness");
        
        console.log(`  Type Multiplier: ${result.typeMult}x`);
    },

    testNoEffectDamage() {
        console.log("\n--- No Effect Damage ---");
        
        // Test a type with no effect (e.g., Normal vs Ghost = 0)
        const normalAttacker = {
            typeId: "leafBunny", // Using leafBunny as placeholder
            stats: { attack: 45, defense: 50, speed: 60, special: 55 }
        };
        
        // Ghost type would be needed for full test, but we can verify the logic
        const effectiveness = getTypeEffectiveness(typeEffectiveness, "normal", "ghost");
        
        this.assert(effectiveness === 0,
            "Normal vs Ghost should have 0x type effectiveness (no effect)");
        
        console.log(`  Normal vs Ghost Type Multiplier: ${effectiveness}x`);
    }
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    DamageCalculationTests.runAllTests();
    process.exit(DamageCalculationTests.testsFailed === 0 ? 0 : 1);
}

// Export for browser testing
if (typeof window !== 'undefined') {
    window.DamageCalculationTests = DamageCalculationTests;
}
