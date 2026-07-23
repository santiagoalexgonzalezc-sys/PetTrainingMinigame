# PetTrainingMinigame

A browser-based pet collection and training game inspired by classic monster-taming games. Open `index.html` to play — no server or installation needed.

**33 pet types** across 11 elements, **10 exploration zones**, turn-based battles, prestige fusion, a timing-based training mini-game, and auto-save via `localStorage`.

## Pet Types

Every pet has unique base stats, an elemental type, a passive ability, and a 3-stage evolution line (cosmetic only — stats scale from the same base values).

### Fire
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| emberFox | Ember Fox | 🦊 | Blaze | 45 | 52 | 43 | 65 | 60 | Ember Fox → Inferno Fox → Phoenix Lord |
| flameCat | Flame Cat | 🐱 | Intimidate | 48 | 55 | 40 | 60 | 55 | Flame Cat → Blaze Cat → Magma Tiger |
| sparkDog | Spark Dog | 🐶 | Flash Fire | 50 | 50 | 45 | 55 | 50 | Spark Dog → Fire Hound → Inferno Wolf |
| cinderHawk | Cinder Hawk | 🦅 | Blaze | 48 | 58 | 42 | 62 | 58 | Ember Hawk → Cinder Hawk → Solar Phoenix |
| cinderScorpion | Cinder Scorpion | 🦂 | Flame Body | 48 | 60 | 52 | 55 | 50 | Spark Tail → Cinder Scorpion → Inferno Stinger |

### Water
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| aquaTurtle | Aqua Turtle | 🐢 | Rain Dish | 55 | 40 | 65 | 35 | 50 |
| mistFrog | Mist Frog | 🐸 | Swift Swim | 50 | 45 | 50 | 55 | 55 |
| waveWhale | Wave Whale | 🐋 | Water Absorb | 60 | 45 | 55 | 40 | 60 |
| tidalCrab | Tidal Crab | 🦀 | Torrent | 50 | 55 | 60 | 38 | 48 |

### Grass
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| leafBunny | Leaf Bunny | 🐰 | Overgrow | 45 | 50 | 45 | 70 | 45 |
| vineSnake | Vine Snake | 🐍 | Chlorophyll | 48 | 55 | 40 | 60 | 50 |
| mossBear | Moss Bear | 🐻 | Thick Fat | 60 | 55 | 50 | 35 | 45 |
| thornHog | Thorn Hog | 🦔 | Overgrow | 55 | 60 | 48 | 45 | 45 |

### Electric
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| boltMouse | Bolt Mouse | 🐭 | Static | 40 | 45 | 40 | 75 | 55 |
| shockEel | Shock Eel | 🐟 | Volt Absorb | 50 | 50 | 45 | 65 | 50 |
| zapBird | Zap Bird | 🐦 | Motor Drive | 45 | 48 | 42 | 70 | 55 |
| voltageOx | Voltage Ox | 🐂 | Static | 52 | 58 | 50 | 45 | 48 |

### Psychic
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| mindCat | Mind Cat | 😺 | Synchronize | 45 | 40 | 45 | 60 | 70 |
| dreamOwl | Dream Owl | 🦉 | Insomnia | 50 | 42 | 48 | 55 | 65 |
| cosmicFox | Cosmic Fox | 🦊 | Magic Guard | 48 | 45 | 42 | 65 | 68 |
| mindApe | Mind Ape | 🙉 | Magic Guard | 48 | 45 | 45 | 58 | 68 |

### Ice
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| frostPenguin | Frost Penguin | 🐧 | Snow Cloak | 52 | 48 | 50 | 45 | 55 |
| crystalSeal | Crystal Seal | 🦭 | Ice Body | 55 | 45 | 55 | 40 | 50 |
| frostBear | Frost Bear | 🐻‍❄️ | Slush Rush | 65 | 58 | 55 | 35 | 50 |
| glacierFox | Glacier Fox | 🦊 | Snow Cloak | 50 | 48 | 48 | 60 | 55 |

### Dragon
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| scaleLizard | Scale Lizard | 🦎 | Rough Skin | 50 | 55 | 45 | 50 | 50 |
| drakeWhelp | Drake Whelp | 🐉 | Multiscale | 55 | 60 | 50 | 45 | 55 |
| crystalWyrm | Crystal Wyrm | 🐉 | Levitate | 55 | 58 | 52 | 50 | 62 |
| marshCroc | Marsh Croc | 🐊 | Strong Jaw | 60 | 64 | 55 | 42 | 48 |

### Dark
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| shadowWolf | Shadow Wolf | 🐺 | Alpha Hunter | 50 | 58 | 45 | 62 | 50 |
| duskBat | Dusk Bat | 🦇 | Vampiric | 45 | 45 | 42 | 72 | 55 |

### Fairy
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| moonPixie | Moon Pixie | 🦄 | Cute Charm | 48 | 42 | 48 | 60 | 68 |
| glimmerMoth | Glimmer Moth | 🦋 | Shield Dust | 42 | 40 | 45 | 72 | 65 |
| sunstoneBeetle | Sunstone Beetle | 🪲 | Shield Dust | 44 | 42 | 48 | 65 | 62 |

### Normal
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| cloudSheep | Cloud Sheep | 🐑 | Fluffy | 62 | 42 | 58 | 38 | 50 |
| fieldDeer | Field Deer | 🦌 | Run Away | 50 | 48 | 45 | 62 | 50 |
| duneLion | Dune Lion | 🦁 | Intimidate | 55 | 60 | 48 | 55 | 45 |

### Poison
| typeId | Name | Emoji | Ability | HP | Atk | Def | Spd | Spc |
|---|---|---|---|---|---|---|---|---|---|
| venomAsp | Venom Asp | 🐍 | Corrosion | 45 | 52 | 48 | 68 | 60 |
| bogToad | Bog Toad | 🐸 | Corrosion | 58 | 50 | 55 | 40 | 52 |

## Starter Pets

Choose **one** when starting a new account:

- 🔥 **Ember Fox** (Fire)
- 💧 **Aqua Turtle** (Water)
- 🌿 **Leaf Bunny** (Grass)
- ⚡ **Bolt Mouse** (Electric)
- 🔮 **Mind Cat** (Psychic)
- 🌑 **Shadow Wolf** (Dark)
- 🧚 **Moon Pixie** (Fairy)
- 🐍 **Venom Asp** (Poison)

Starters begin at **level 5** with **100 gold**.

## Exploration Zones

10 zones, each with common and rare pet pools. 25% chance of a rare encounter. Wild pet levels scale to your own (brackets of 20; max wild level 1000).

| Zone | Emoji | Common Pets | Rare Pets |
|---|---|---|---|
| Forest | 🌲 | leafBunny, vineSnake, mossBear, glimmerMoth, fieldDeer | mindCat, dreamOwl, moonPixie, thornHog |
| Cave | ⛰️ | scaleLizard, sparkDog, crystalSeal, duskBat | drakeWhelp, frostPenguin, shadowWolf, frostBear, crystalWyrm, mindApe |
| Lake | 💧 | aquaTurtle, mistFrog, waveWhale | shockEel, boltMouse |
| Mountain | 🏔️ | flameCat, zapBird, scaleLizard, frostBear, cloudSheep, glacierFox | drakeWhelp, cosmicFox, crystalWyrm, voltageOx |
| Desert | 🏜️ | emberFox, sparkDog, scaleLizard, cinderScorpion, duneLion | flameCat, drakeWhelp |
| Ocean | 🌊 | waveWhale, shockEel, crystalSeal, tidalCrab | aquaTurtle, frostPenguin |
| Volcano | 🌋 | flameCat, emberFox, sparkDog | drakeWhelp, scaleLizard, cinderScorpion, cinderHawk |
| Swamp | 🐊 | mistFrog, vineSnake, mossBear, glimmerMoth, marshCroc, shadowWolf, sunstoneBeetle | waveWhale, dreamOwl, frostBear |
| Sky | ☁️ | zapBird, boltMouse, dreamOwl, cloudSheep | cosmicFox, shockEel |
| Toxic Marsh | 🧪 | venomAsp, bogToad, mistFrog, vineSnake | shadowWolf, cosmicFox, moonPixie |

## Shop

| Item | Price | Type | Power / Effect |
|---|---|---|---|
| Basic Ball | 50 | Catch | Ball power 1 |
| Great Ball | 150 | Catch | Ball power 1.5 |
| Ultra Ball | 400 | Catch | Ball power 2.5 |
| Potion | 30 | Heal | Restores 20 HP |
| Super Potion | 80 | Heal | Restores 50 HP |
| Hyper Potion | 200 | Heal | Restores 100 HP |
| Tier Stone | 500 | Upgrade | 1 tier stone |
| XP Orb | 200 | XP | +500 XP instantly |
| Precision Guide | 100 | Training | Guarantees next training stop is PERFECT |
| Focus Incense | 150 | Training | Next session allows 5 misses instead of 3 |
| Band of Swiftness | 4,000 | Equipment | +10 Speed |
| Tough Collar | 4,000 | Equipment | +10 Defense |
| Focus Band | 4,000 | Equipment | +10 Special |
| Life Bangle | 4,000 | Equipment | +10 HP |
| Attack Sunglasses | 4,000 | Equipment | +10 Attack |

**Default starting inventory**: 5 Basic Balls, 3 Potions, rest empty.

## Tier System

25 tiers from **D1 → D2 → D3 → D4 → D5 → C1 → ... → S5**.

Each tier adds a flat bonus to **all five stats**:

| Rank | Sub 1 | Sub 2 | Sub 3 | Sub 4 | Sub 5 |
|---|---|---|---|---|---|
| D | +2 | +4 | +6 | +8 | +10 |
| C | +14 | +18 | +22 | +26 | +30 |
| B | +38 | +46 | +54 | +62 | +70 |
| A | +85 | +100 | +115 | +130 | +145 |
| S | +170 | +195 | +220 | +245 | +270 |

**Upgrade costs** (gold to go from current sub-tier → next):

| From | → Sub 2 | → Sub 3 | → Sub 4 | → Sub 5 | → Next Rank |
|---|---|---|---|---|---|
| D | 500 | 1,000 | 2,000 | 4,000 | 8,000 |
| C | 8,000 | 16,000 | 32,000 | 64,000 | 100,000 |
| B | 100,000 | 150,000 | 200,000 | 250,000 | 300,000 |
| A | 300,000 | 400,000 | 500,000 | 600,000 | 700,000 |
| S | 700,000 | 800,000 | 900,000 | 1,000,000 | — (max) |

**Tier stones required**: 1 (D), 2 (C), 3 (B), 4 (A), 5 (S).

Max tier is **S5**. Wild pets roll tiers at catch: 5% A, 20% B, 50% C, 25% D.

## Prestige Fusion

Fuse two same-race pets to grant +1 prestige to the primary. The material pet is permanently consumed.

**Requirements**:
- Both pets must be the **same typeId** (same race)
- Both must be **level 15 or higher** and have **HP > 0**
- Both must be at the **same prestige level**
- Max prestige level: **100**

**Effect**: +5 to **every stat** per prestige level (+500 to all stats at max prestige).

**Sell value**: level × 25 + prestigeLevel × 1,000 + tier value + (5,000 if shiny).

## Training System

Timing mini-game: a marker slides back and forth across a bar. Press **STOP** when it's in the right zone.

| Result | Zone | XP | Speed Effect |
|---|---|---|---|
| PERFECT | 47%–53% | +50 | +0.08 |
| GOOD | 32%–68% | +20 | +0.05 |
| MISS | Outside both | 0 | −0.03 (min 0.5) |

- Max **3 misses** ends a session (5 with Focus Incense).
- Starting marker speed: **0.7**.
- **1-minute cooldown** per pet between sessions.

**Items**:
- Precision Guide (100g): next stop is always PERFECT.
- Focus Incense (150g): next session allows 5 misses.
- XP Orb (200g): +500 XP instantly, no mini-game.

## Battle System

Turn-based. Higher **Speed** goes first; ties go to the player.

### Damage Formula
```
offensive stat = max(attack, special)
base damage = floor((offensiveStat × 40) / effectiveDefense)
damage = base × typeMult × critMult × variance × abilityMult × 0.25
```
- **Defense modifiers**: ±25% per stat stage (range −6 to +6).
- **Corrosion**: Poison-type pets with the Corrosion ability halve the defender's effective defense.
- **Crit chance**: 10% + (speed / 500). Crit deals ×1.5 damage.
- **Variance**: 0.85–1.00 random multiplier.
- **Global reduction**: all damage is multiplied by 0.25.

### Type Effectiveness
| Attacker | Super effective (×2) | Not very effective (×0.5) | Immune (×0) |
|---|---|---|---|
| Fire | Grass, Ice, Fairy | Water, Fire, Dragon | — |
| Water | Fire, Ground | Water, Grass, Dragon | — |
| Grass | Water, Ground | Fire, Grass, Dragon, Poison | — |
| Electric | Water, Flying | Grass, Electric, Dragon | — |
| Ice | Grass, Dragon | Fire, Ice, Fairy | — |
| Psychic | Poison | Psychic, Dark | — |
| Dragon | Dragon | Ice | Fairy |
| Dark | Psychic | Dark, Fairy | — |
| Fairy | Dragon, Dark, Poison | Fire, Ice, Poison | — |
| Poison | Grass, Fairy | Poison, Ground, Rock, Ghost | Steel |
| Normal | — | Rock, Steel | Ghost |

Unlisted matchups default to ×1.

### Catching
```
catchRate = (1 − currentHP/maxHP) × 0.5 + 0.1
chance = min(0.9, catchRate × ballPower)
```
Balls are consumed best-first (Ultra → Great → Basic). Caught pets go to party if < 6, else storage (max 300 total).

### Battle Rewards
- **Win**: XP = enemy.level × 20, Gold = enemy.level × 20. Pet HP preserved as % of old max.
- **Lose**: No rewards. Pet's current HP is halved.
- **Flee**: Always succeeds. HP preserved.

## Functional Passives

Most abilities are flavor text only. These have real code:

| Ability | Pets | Trigger | Effect |
|---|---|---|---|
| **Blaze** | Ember Fox, Cinder Hawk | Always | Damage ×1.05 at ≥70% HP, scaling to ×1.40 at ≤20% HP (linear interpolation). |
| **Overgrow** | Leaf Bunny, Thorn Hog | Always | Same formula as Blaze, applied to Grass damage. |
| **Torrent** | Tidal Crab | Always | Same formula as Blaze, applied to Water damage. |
| **Intimidate** | Flame Cat, Dune Lion | On switch-in | Lowers enemy attack by 1 stat stage (min −6). |
| **Corrosion** | Venom Asp, Bog Toad | On attack | Enemy defense is halved (`Math.floor(defense / 2)`) before damage calc. |

## Equipment

5 slots per pet. Each piece costs **4,000 gold** and grants **+10** to one stat.

| Item | Stat |
|---|---|
| Band of Swiftness | Speed |
| Tough Collar | Defense |
| Focus Band | Special |
| Life Bangle | HP |
| Attack Sunglasses | Attack |

Equipment stats are added into both max HP and the four offensive/defensive stats. Selling a pet returns all equipped items to inventory.

## Party & Storage

- **Party cap**: 6 pets
- **Total cap**: 300 pets (party + storage)
- Cannot deposit your last remaining party member.
- Sell pets: `level × 25 + prestigeLevel × 1000 + shiny bonus (5,000) + tier sell value`.

## Pet Power

```
pet power = maxHP + attack + defense + speed + special + (level × 5)
```
Team power = sum of all pet powers (party + storage).

## Save System

Auto-saves to browser `localStorage` under key `petSimulator` after every meaningful action (battle, training, shop, inventory changes, prestige, tier upgrade, storage changes). Saves pets, storage, money, inventory, selected pet, starter flag, and exploration cooldowns.

## Tech Stack

- **HTML5** — structure and game screens
- **Tailwind CSS** (CDN) — styling
- **Vanilla JavaScript** — all game logic
- No frameworks, no build step, no server required