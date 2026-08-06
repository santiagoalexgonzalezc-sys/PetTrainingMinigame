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
    isBossBattle: false,
    currentBoss: null,
    bossAbilityUsed: false,
    regrowthUsed: false,

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
        this.bossAbilityUsed = false;
        this.regrowthUsed = false;

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
        return PetManager.getEvolution(pet);
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

        // Boss passive abilities
        if (this.isBossBattle && defender === this.enemyPet && this.currentBoss) {
            const bossTemplate = PetTypes[this.currentBoss.typeId];
            if (bossTemplate) {
                // Magma Shield - 15% damage reflection
                if (bossTemplate.passive && bossTemplate.passive.includes("Magma Shield")) {
                    const reflectedDamage = Math.floor(damage * 0.15);
                    if (reflectedDamage > 0 && attacker === this.playerPet) {
                        attacker.currentHP = Math.max(0, attacker.currentHP - reflectedDamage);
                        this.addLog(`${this.currentBoss.name}'s Magma Shield reflected ${reflectedDamage} damage!`);
                    }
                }

                // Thorn Armor - 10% damage to attacker on hit
                if (bossTemplate.passive && bossTemplate.passive.includes("Thorn Armor")) {
                    const thornDamage = Math.floor(damage * 0.10);
                    if (thornDamage > 0 && attacker === this.playerPet) {
                        attacker.currentHP = Math.max(0, attacker.currentHP - thornDamage);
                        this.addLog(`${this.currentBoss.name}'s Thorn Armor dealt ${thornDamage} damage!`);
                    }
                }

                // Prism Beam - +25% damage, ignores 25% defense
                if (bossTemplate.ability && bossTemplate.ability.name === "Prism Beam" && attacker === this.enemyPet) {
                    damage = Math.floor(damage * 1.25);
                    this.addLog(`${this.currentBoss.name}'s Prism Beam boosted damage!`);
                }

                // Inferno Rage - +50% damage when HP below 50%
                if (bossTemplate.ability && bossTemplate.ability.name === "Inferno Rage" && attacker === this.enemyPet) {
                    const maxHP = PetManager.calculateMaxHP(bossTemplate, this.enemyPet.level, this.enemyPet);
                    if (this.enemyPet.currentHP / maxHP < 0.5) {
                        damage = Math.floor(damage * 1.5);
                        this.addLog(`${this.currentBoss.name}'s Inferno Rage activated!`);
                    }
                }
            }
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

          // Boss abilities at start of enemy turn
          if (this.isBossBattle && this.currentBoss) {
              const bossTemplate = PetTypes[this.currentBoss.typeId];
              if (bossTemplate) {
                  // Tidal Wave - Heals 10% HP each turn
                  if (bossTemplate.passive && bossTemplate.passive.includes("Tidal Wave")) {
                      const maxHP = PetManager.calculateMaxHP(bossTemplate, this.enemyPet.level, this.enemyPet);
                      const healAmount = Math.floor(maxHP * 0.10);
                      this.enemyPet.currentHP = Math.min(maxHP, this.enemyPet.currentHP + healAmount);
                      this.addLog(`${this.currentBoss.name}'s Tidal Wave healed ${healAmount} HP!`);
                  }

                  // Toxic Cloud - 5% max HP damage per turn
                  if (bossTemplate.passive && bossTemplate.passive.includes("Toxic Cloud")) {
                      const maxHP = PetManager.calculateMaxHP(PetTypes[this.playerPet.typeId], this.playerPet.level, this.playerPet);
                      const toxicDamage = Math.floor(maxHP * 0.05);
                      this.playerPet.currentHP = Math.max(0, this.playerPet.currentHP - toxicDamage);
                      this.addLog(`${this.currentBoss.name}'s Toxic Cloud dealt ${toxicDamage} damage!`);
                  }

                  // Pressure - Reduces enemy speed by 25%
                  if (bossTemplate.ability && bossTemplate.ability.name === "Pressure") {
                      this.playerStatMods.speed = Math.min(6, this.playerStatMods.speed - 1);
                      this.addLog(`${this.currentBoss.name}'s Pressure reduced your speed!`);
                  }

                  // Soul Drain - Reduces enemy attack by 10%
                  if (bossTemplate.ability && bossTemplate.ability.name === "Soul Drain") {
                      this.playerStatMods.attack = Math.min(6, this.playerStatMods.attack - 1);
                      this.addLog(`${this.currentBoss.name}'s Soul Drain reduced your attack!`);
                  }

                  // Ancient Power - +15% to all stats (one-time use)
                  if (bossTemplate.ability && bossTemplate.ability.name === "Ancient Power" && !this.bossAbilityUsed) {
                      this.enemyStatMods.attack = Math.min(6, this.enemyStatMods.attack + 1);
                      this.enemyStatMods.defense = Math.min(6, this.enemyStatMods.defense + 1);
                      this.enemyStatMods.speed = Math.min(6, this.enemyStatMods.speed + 1);
                      this.enemyStatMods.special = Math.min(6, this.enemyStatMods.special + 1);
                      this.bossAbilityUsed = true;
                      this.addLog(`${this.currentBoss.name}'s Ancient Power boosted all stats!`);
                  }

                  // Chain Lightning - 20% chance to attack twice
                  if (bossTemplate.passive && bossTemplate.passive.includes("Chain Lightning") && Math.random() < 0.20) {
                      this.addLog(`${this.currentBoss.name}'s Chain Lightning triggered!`);
                      this.attack(this.enemyPet, this.playerPet, false);
                      if (this.playerPet.currentHP <= 0) {
                          this.endBattle(false);
                          return;
                      }
                  }

                  // Shadow Clone - 15% chance to create attacking copy
                  if (bossTemplate.passive && bossTemplate.passive.includes("Shadow Clone") && Math.random() < 0.15) {
                      this.addLog(`${this.currentBoss.name}'s Shadow Clone appeared!`);
                      this.attack(this.enemyPet, this.playerPet, false);
                      if (this.playerPet.currentHP <= 0) {
                          this.endBattle(false);
                          return;
                      }
                  }

                  // Crystal Prison - 15% freeze chance for 1 turn
                  if (bossTemplate.passive && bossTemplate.passive.includes("Crystal Prison") && Math.random() < 0.15) {
                      this.confused = "player";
                      this.addLog(`${this.currentBoss.name}'s Crystal Prison froze you!`);
                  }

                  // Static Field - 20% chance to paralyze for 1 turn
                  if (bossTemplate.ability && bossTemplate.ability.name === "Static Field" && Math.random() < 0.20) {
                      this.confused = "player";
                      this.addLog(`${this.currentBoss.name}'s Static Field paralyzed you!`);
                  }

                  // Regrowth - Revives once at 25% HP
                  if (bossTemplate.ability && bossTemplate.ability.name === "Regrowth" && !this.regrowthUsed) {
                      const maxHP = PetManager.calculateMaxHP(bossTemplate, this.enemyPet.level, this.enemyPet);
                      if (this.enemyPet.currentHP <= 0) {
                          this.enemyPet.currentHP = Math.floor(maxHP * 0.25);
                          this.regrowthUsed = true;
                          this.addLog(`${this.currentBoss.name}'s Regrowth revived it at 25% HP!`);
                      }
                  }
              }
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

            // 5% chance to drop a Boss Key when defeating a wild pet
            BossSystem.dropBossKey();

            // Give boss rewards if this was a boss battle
            if (this.isBossBattle && this.currentBoss) {
                BossSystem.giveBossRewards(this.currentBoss);
                this.isBossBattle = false;
                this.currentBoss = null;
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
