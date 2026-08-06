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
    },

    getEvolution(pet) {
        const template = pet ? PetTypes[pet.typeId] : null;
        if (!template) return pet?.typeId || "Unknown";
        const evolution = template.evolution;
        if (!Array.isArray(evolution) || evolution.length === 0) return template.name;
        const stage = pet.level >= 30 ? 2 : pet.level >= 15 ? 1 : 0;
        return evolution[Math.min(stage, evolution.length - 1)];
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
