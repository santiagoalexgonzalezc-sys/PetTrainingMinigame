# PetTrainingMinigame

A browser-based pet collection and training game inspired by classic monster-taming games. Open `index.html` to play — no server or installation needed.

**40 pet types** across 11 elements, **11 exploration zones** (each with 200 floors), turn-based battles with active abilities, prestige fusion, a crafting system, daily quests, daily login rewards, achievements and titles, a timing-based training mini-game, auto-explore, auto-save via `localStorage`, and a player leveling system with XP rewards, streak bonuses, and a profile overlay.

## Pet Types

Every pet has unique base stats, an elemental type, a passive ability, and a 3-stage evolution line (cosmetic only — stats scale from the same base values). Evolutions display at level 15 (stage 2) and level 30 (stage 3). A pet's in-battle name is the first entry of its evolution line, which may differ from its roster name.

### Fire
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| emberFox | Ember Fox | 🦊 | Blaze | 65 | 52 | 43 | 65 | 60 | Ember Fox → Inferno Fox → Phoenix Lord |
| flameCat | Flame Cat | 🐱 | Intimidate | 68 | 55 | 40 | 60 | 55 | Flame Cat → Blaze Cat → Magma Tiger |
| sparkDog | Spark Dog | 🐶 | Kindling Core | 70 | 50 | 45 | 55 | 50 | Spark Dog → Fire Hound → Inferno Wolf |
| cinderHawk | Cinder Hawk | 🦅 | Meltdown | 68 | 58 | 42 | 62 | 58 | Ember Hawk → Cinder Hawk → Solar Phoenix |
| cinderCrab | Cinder Crab | 🦀 | Molten Shell | 65 | 60 | 52 | 40 | 50 | Ash Claw → Cinder Crab → Magma Guardian |
| cinderScorpion | Cinder Scorpion | 🦂 | Scorpion Sting | 68 | 60 | 52 | 55 | 50 | Spark Tail → Cinder Scorpion → Inferno Stinger |

### Water
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| aquaTurtle | Aqua Turtle | 🐢 | Tide Pools | 75 | 40 | 65 | 35 | 50 | Aqua Turtle → Hydro Turtle → Ocean Guardian |
| mistFrog | Mist Frog | 🐸 | Misty Agility | 70 | 45 | 50 | 55 | 55 | Mist Frog → Storm Frog → Tidal King |
| waveWhale | Wave Whale | 🐋 | Aqua Vein | 80 | 45 | 55 | 40 | 60 | Wave Whale → Tsunami Whale → Leviathan |
| tidalCrab | Tidal Crab | 🦀 | Riptide | 70 | 55 | 60 | 38 | 48 | Tide Crab → Tidal Crab → Abyssal Crustacean |

### Grass
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| leafBunny | Leaf Bunny | 🐰 | Bloom Burst | 65 | 50 | 45 | 70 | 45 | Leaf Bunny → Forest Bunny → Nature Spirit |
| vineSnake | Vine Snake | 🐍 | Photosynthetic Surge | 68 | 55 | 40 | 60 | 50 | Vine Snake → Thorn Snake → Jungle Serpent |
| mossBear | Moss Bear | 🐻 | Dense Fur | 80 | 55 | 50 | 35 | 45 | Moss Bear → Forest Bear → Earth Guardian |
| thornHog | Thorn Hog | 🦔 | Overgrow | 75 | 60 | 48 | 45 | 45 | Bramble Pig → Thorn Hog → Verdant Behemoth |

### Electric
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| boltMouse | Bolt Mouse | 🐭 | Fast feet | 60 | 45 | 40 | 80 | 55 | Bolt Mouse → Volt Mouse → Thunder Lord |
| shockEel | Shock Eel | 🐟 | Volt Absorb | 70 | 50 | 45 | 65 | 50 | Shock Eel → Storm Eel → Lightning Serpent |
| zapBird | Zap Bird | 🐦 | Motor Drive | 65 | 48 | 42 | 70 | 55 | Zap Bird → Storm Bird → Thunder Hawk |
| voltageOx | Voltage Ox | 🐂 | Static | 72 | 58 | 50 | 45 | 48 | Spark Calf → Voltage Ox → Thunder Beast |

### Psychic
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| mindCat | Mind Cat | 😺 | Synchronize | 65 | 40 | 45 | 60 | 70 | Mind Cat → Psi Cat → Telepath Master |
| dreamOwl | Dream Owl | 🦉 | Lucid Mind | 70 | 42 | 48 | 55 | 65 | Dream Owl → Night Owl → Vision Sage |
| cosmicFox | Cosmic Fox | 🦊 | Magic Guard | 68 | 45 | 42 | 65 | 68 | Cosmic Fox → Star Fox → Galaxy Lord |
| mindApe | Mind Ape | 🙉 | Magic Guard | 68 | 45 | 45 | 58 | 68 | Thought Chimp → Mind Ape → Enlightened Sage |

### Ice
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| frostPenguin | Frost Penguin | 🐧 | Snow Cloak | 72 | 48 | 50 | 45 | 55 | Frost Penguin → Glacier Penguin → Ice Emperor |
| crystalSeal | Crystal Seal | 🦭 | Ice Body | 75 | 45 | 55 | 40 | 50 | Crystal Seal → Diamond Seal → Frost Guardian |
| frostBear | Frost Bear | 🐻‍❄️ | Slush Rush | 85 | 58 | 55 | 35 | 50 | Ice Cub → Frost Bear → Tundra King |
| glacierFox | Glacier Fox | 🦊 | Snow Cloak | 70 | 48 | 48 | 60 | 55 | Frost Kit → Glacier Fox → Permafrost Spirit |

### Dragon
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| scaleLizard | Scale Lizard | 🦎 | Rough Skin | 70 | 55 | 45 | 50 | 50 | Scale Lizard → Dragon Lizard → Wyvern King |
| drakeWhelp | Drake Whelp | 🐉 | Multiscale | 75 | 60 | 50 | 45 | 55 | Drake Whelp → Storm Drake → Dragon Emperor |
| crystalWyrm | Crystal Wyrm | 🐉 | Levitate | 75 | 58 | 52 | 50 | 62 | Shard Hatchling → Crystal Wyrm → Geode Leviathan |
| marshCroc | Marsh Croc | 🐊 | Strong Jaw | 80 | 64 | 55 | 42 | 48 | Mud Wader → Marsh Croc → Bog Tyrant |

### Dark
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| shadowWolf | Shadow Wolf | 🐺 | Alpha Hunter | 70 | 55 | 45 | 62 | 60 | Shadow Pup → Alpha Wolf → Solo hunter |
| duskBat | Dusk Bat | 🦇 | Sanguine Drain | 65 | 55 | 42 | 72 | 55 | Dusk Bat → Vampire → Vampire Emperor |

### Fairy
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| moonPixie | Moon Pixie | 🦄 | Magic Guard | 68 | 42 | 48 | 60 | 75 | Star Fawn → Moon Pixie → Astral Spirit |
| glimmerMoth | Glimmer Moth | 🦋 | Shield Dust | 62 | 40 | 45 | 72 | 65 | Dust Wisp → Glimmer Moth → Prism Sovereign |
| sunstoneBeetle | Sunstone Beetle | 🪲 | Shield Dust | 64 | 42 | 48 | 65 | 62 | Glow Grub → Sunstone Beetle → Aurora Scarab |

### Normal
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| cloudSheep | Cloud Sheep | 🐑 | Cotton Cloud | 82 | 42 | 58 | 38 | 50 | Wool Lamb → Cloud Sheep → Sky Shepherd |
| fieldDeer | Field Deer | 🦌 | Run Away | 70 | 48 | 45 | 62 | 50 | Spotted Fawn → Field Deer → Forest Monarch |
| duneLion | Dune Lion | 🦁 | Intimidate | 75 | 60 | 48 | 55 | 45 | Sand Cub → Dune Lion → Savanna King |

### Poison
| typeId | Name | Emoji | Passive | HP | Atk | Def | Spd | Spc | Evolution Line |
|---|---|---|---|---|---|---|---|---|---|
| venomAsp | Venom Asp | 🐍 | Acidic Blood | 65 | 52 | 48 | 68 | 60 | Venom Asp → Toxic Serpent → Plague Sovereign |
| bogToad | Bog Toad | 🐸 | Corrosion | 78 | 50 | 55 | 40 | 52 | Muck Tadpole → Bog Toad → Blight Matriarch |

## Active Abilities

Some pets carry a usable active ability, triggered with the **Ability** button in battle (or automatically during auto-explore). Each has a per-cast cooldown measured in turns.

| Pet | Ability | Type | CD | Effect |
|---|---|---|---|---|
| Ember Fox | Fireball | Fire | 2 | Damage from (Special + 5). Burns the enemy for the **rest of the battle** (25% of the hit's damage per turn). |
| Flame Cat | Ember Surge | Fire | 3 | Special hit from (fire power + 3). Burns the enemy for **3 turns** (25% per turn). |
| Vine Snake | Vine Lash | Grass | 2 | Special hit from (Special + 2). Lowers enemy Speed by 1 stage. |
| Bolt Mouse | Electric Ball | Electric | 2 | Special damage, then paralyzes the enemy (they skip their next turn). |
| Mind Cat | Psychic Burst | Psychic | 2 | Special damage. 30% chance to confuse the enemy (skip next turn). |
| Dream Owl | Hypnosis | Psychic | 3 | Special damage. 50% chance to put the enemy to sleep (skip next turn). |
| Crystal Seal | Aurora Guard | Ice | 2 | Special damage and shields the user for 2 turns (blocks 30% of incoming damage). |
| Drake Whelp | Dragon Rampage | Dragon | 3 | Special damage, then 50% chance ×2 damage / 50% chance ×0.5 damage. |
| Shadow Wolf | Bleeding Claw | Normal | 3 | Special damage. Enemy bleeds for the **rest of the battle** (25% per turn). |
| Dusk Bat | Life Drain | Dark | 2 | Special damage; heals the user for 50% of the damage dealt. |
| Moon Pixie | Moonbeam Heal | Fairy | 2 | Special damage; heals the user for 50% of the damage dealt. |
| Cloud Sheep | Fluffy Guard | Normal | 2 | Special damage and shields the user for 1 turn (blocks 50% of incoming damage). |
| Venom Asp | Corrosive Bolt | Poison | 3 | Special damage; poisons the enemy for 3 turns (10% of enemy max HP per turn). |

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

Starters begin at **level 1** with **100 gold**. Default starting inventory: **5 Basic Balls, 3 Potions**, everything else empty.

## Exploration Zones

11 zones, each locked behind a minimum **player level** and containing **200 floors** (each covering a 5-level range, e.g., Floor 1 = Lv 1–5, Floor 200 = Lv 996–1000). 25% chance of a rare encounter, and a 1-in-500 chance the wild pet is shiny (+15% base stats). Wild pet levels are determined by the selected floor, not by player level.

| Zone | Emoji | Unlock | Common Pets | Rare Pets |
|---|---|---|---|---|
| Forest | 🌲 | 1 | leafBunny, vineSnake, mossBear, glimmerMoth, moonPixie | mindCat, dreamOwl, fieldDeer, thornHog |
| Cave | ⛰️ | 1 | scaleLizard, sparkDog | drakeWhelp, frostPenguin, crystalSeal, frostBear, crystalWyrm, mindApe |
| Lake | 💧 | 1 | aquaTurtle, mistFrog, waveWhale | shockEel, boltMouse |
| Mountain | 🏔️ | 5 | flameCat, zapBird, scaleLizard, frostBear, cloudSheep, glacierFox | drakeWhelp, cosmicFox, crystalWyrm, voltageOx |
| Desert | 🏜️ | 10 | emberFox, sparkDog, scaleLizard, cinderScorpion, duneLion | flameCat, drakeWhelp |
| Ocean | 🌊 | 15 | waveWhale, shockEel, crystalSeal, tidalCrab | aquaTurtle, frostPenguin |
| Volcano | 🌋 | 20 | flameCat, emberFox, sparkDog | drakeWhelp, scaleLizard, cinderScorpion, cinderHawk |
| Dark Forest | 🌑 | 20 | shadowWolf, duskBat | *(none — rares fall back to commons)* |
| Swamp | 🐊 | 25 | mistFrog, vineSnake, mossBear, glimmerMoth, marshCroc, sunstoneBeetle | waveWhale, dreamOwl, frostBear |
| Sky | ☁️ | 30 | zapBird, boltMouse, dreamOwl, cloudSheep | cosmicFox, shockEel |
| Toxic Marsh | 🧪 | 35 | venomAsp, bogToad, mistFrog, vineSnake | cosmicFox, moonPixie |

### Zone Floor Selection

Clicking an unlocked zone opens a **floor overlay** with pagination (10 floors per page). Each floor card shows the floor number, level range, and lock status. A floor is locked until your player level reaches the floor's minimum level; a green "Recommended" highlight marks the floor matching your current level range.

### Elite (C-tier) Encounters

Beyond the normal tier roll, high-level players occasionally face an **elite** wild pet whose level and tier are boosted. The chance scales with player level: 1% at Lv 35, 10% above Lv 40, 20% above Lv 50, 25% above Lv 60, 30% above Lv 70, and 35% above Lv 80. Elites roll an elite grade (weighted toward the lowest grade) that raises the pet's level (up to the floor cap) and can push its tier into the C rank.

### Auto-Explore

Unlocked at **player level 50**. Pick a pet, zone, and floor and the game auto-battles floor after floor until the pet faints or you leave the battle screen.

## Shop

Basic Balls are **not sold** — craft them (see Crafting) or find them; the shop stocks everything below.

| Item | Price | Type | Effect |
|---|---|---|---|
| Great Ball | 150 | Catch | Catch item (ball power 1.5) |
| Ultra Ball | 400 | Catch | Catch item (ball power 2.5) |
| Potion | 30 | Heal | Restores 20 HP |
| Super Potion | 80 | Heal | Restores 50 HP |
| Hyper Potion | 200 | Heal | Restores 100 HP |
| Tier Stone | 500 | Upgrade | 1 tier stone |
| XP Orb | 250 | XP | +500 XP instantly |
| Rare XP Orb | 1,000 | XP | +2,000 XP instantly |
| Gem | 200 | Currency | Prestige-fusion currency |
| Precision Guide | 100 | Training | Guarantees next training stop is PERFECT |
| Focus Incense | 150 | Training | Next session allows 5 misses instead of 3 |
| Band of Swiftness | 4,000 | Equipment | +10 Speed |
| Tough Collar | 4,000 | Equipment | +10 Defense |
| Focus Band | 4,000 | Equipment | +10 Special |
| Life Bangle | 4,000 | Equipment | +10 HP |
| Attack Sunglasses | 4,000 | Equipment | +10 Attack |

Both **Buy** (custom quantity) and **Buy Max** (spend all affordable gold) are available per item.

## Crafting

Winning battles drops elemental **resources** (Wood Stick 🪵, Rock 🪨, Leather 🥾, Ore ⛏️, Herbs 🌿, Crystal 💎, Dark Rock 🟣). Spend them on the Crafting screen to build items — no gold required.

| Item | Cost |
|---|---|
| Basic Ball | 5 Wood Stick, 2 Rock |
| Great Ball | 8 Wood Stick, 4 Ore, 3 Rock |
| Ultra Ball | 10 Wood Stick, 6 Ore, 4 Rock |
| Potion | 3 Herbs, 2 Wood Stick |
| Super Potion | 8 Herbs, 4 Leather, 3 Ore |
| Hyper Potion | 15 Herbs, 8 Leather, 3 Crystal |
| XP Orb | 5 Herbs, 3 Crystal |
| Rare XP Orb | 8 Crystal, 5 Dark Rock |
| Tier Stone | 3 Rock, 2 Dark Rock |
| Focus Incense | 4 Ore, 2 Dark Rock, 1 Crystal |
| Precision Guide | 5 Herbs, 2 Crystal |

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

**Tier stones required per upgrade**: 1 (D), 2 (C), 3 (B), 4 (A), 5 (S).

Max tier is **S5**. Wild pets roll a tier at catch: **30% C-rank, 70% D-rank**. Within a rank, sub-tiers roll 50% / 20% / 15% / 10% / 5% for sub-1 through sub-5. (Elite encounters can override this to a C-rank tier — see Exploration.)

## Prestige Fusion

Fuse two same-race pets to grant +1 prestige to the primary. The material pet is permanently consumed.

**Requirements**:
- Both pets must be the **same typeId** (same race)
- Both must be at the **same prestige level**
- The primary must have **HP > 0**
- Max prestige level: **100**
- Costs **5 Gems** per fusion

**Effect**: +5 to **every stat** per prestige level (+500 to all stats at max prestige). Any equipment on the consumed pet is returned to your inventory, and the fusion awards **+10 player XP**.

**Sell value**: `level × 25 + prestigeLevel × 1,000 + tier sell value + (5,000 if shiny)`.

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
- The pet gains the full session XP; the player also gains XP equal to **half** the session XP.

**Items**:
- Precision Guide (100g): next stop is always PERFECT.
- Focus Incense (150g): next session allows 5 misses.
- XP Orb (250g): +500 XP instantly, no mini-game. Rare XP Orb (1,000g): +2,000 XP.

## Battle System

Turn-based. Higher **Speed** goes first; ties go to the player.

### Damage Formula
```
base damage = floor((offensiveStat × 40) / effectiveDefense)
damage = base × typeMult × critMult × variance × abilityMult × 0.25
```
- **Offensive stat**: a basic attack uses **Attack**; an active ability uses **Special**.
- **Stat stages**: attack/defense modifiers scale the stat by `1.25^stage` (range roughly −6 to +6).
- **Corrosion**: a Poison pet with the Corrosion passive halves the defender's effective defense.
- **Crit chance**: `0.1 + (speed / 500)`. Crit deals ×1.5 damage.
- **Variance**: 0.85–1.00 random multiplier.
- **Global reduction**: all damage is multiplied by 0.25.
- **Shields**: an active shield reduces incoming damage by its percentage for its duration.

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
| Dark | Psychic, Ghost | Dark, Fairy | — |
| Fairy | Dragon, Dark | Fire, Ice, Poison | — |
| Poison | Grass, Fairy | Poison, Ground, Rock, Ghost | Steel |
| Normal | — | Rock, Steel | Ghost |

Unlisted matchups default to ×1.

### Catching
```
catchRate = (1 − currentHP/maxHP) × 0.5 + 0.1
chance = min(0.9, catchRate × ballPower)
```
Ball powers: Basic 1, Great 1.5, Ultra 2.5. Balls are consumed best-first (Ultra → Great → Basic). Caught pets go to party if < 6, else storage (max 300 total).

### Battle Rewards

- **Win**: pet XP = enemy.level × 20; gold = enemy.level × 20; player XP = enemy.level × 10 (scaled by streak and type-advantage bonuses).
- **Streak bonus**: `1 + min(streak × 0.15, 9.0)` multiplier on player XP.
- **Type advantage**: +20% player XP when your pet's type is super-effective against the enemy.
- **Loot drops on win**:
  - 30% chance to find an XP Orb.
  - 60% chance for an element-based resource (1–2), mapped by enemy element: grass→Wood Stick, ice→Rock, normal→Leather, electric→Ore, poison→Herbs, fairy→Crystal, dark→Dark Rock.
  - 40% chance for a zone secondary resource (forest/swamp/toxicMarsh→Herbs, cave→Ore, lake/desert→Leather, mountain/ocean/sky→Crystal, volcano→Dark Rock).
  - Enemy over Lv 20: 30% chance to drop 2 Gems.
  - Enemy over Lv 30: 10% chance to drop a Rare XP Orb.
- **Lose**: No XP or gold. Pet's current HP is halved.
- **Flee**: Always succeeds. HP preserved.

## Functional Passives

Most abilities are flavor text only. These have real code:

| Passive | Pets | Trigger | Effect |
|---|---|---|---|
| **Blaze** | Ember Fox | Always | Fire damage ×1.05 at ≥70% HP, scaling to ×1.40 at ≤20% HP (linear interpolation). |
| **Overgrow** | Thorn Hog | Always | Same HP-scaling formula, applied to Grass damage. |
| **Intimidate** | Flame Cat, Dune Lion | On switch-in | Lowers enemy attack by 1 stat stage. |
| **Corrosion** | Bog Toad | On attack | Enemy defense is halved (`Math.floor(defense / 2)`) before damage calc. |
| **Fast feet** | Bolt Mouse | On defense | 10% chance to dodge an incoming attack entirely. |
| **Sanguine Drain** | Dusk Bat | On attack | Heals 15% of damage dealt back as HP. |

> Note: the code also contains HP-scaling logic for a **Torrent** water passive (no pet currently carries it) and low-HP damage amplification for **Alpha Hunter** (Shadow Wolf) and **Sanguine Drain**; those multipliers check a non-existent `pet.type` field and never fire, so only the effects listed above are active.

## Equipment

5 slots per pet. Each piece costs **4,000 gold** and grants **+10** to one stat.

| Item | Stat |
|---|---|
| Band of Swiftness | Speed |
| Tough Collar | Defense |
| Focus Band | Special |
| Life Bangle | HP |
| Attack Sunglasses | Attack |

Equipment stats are added into both max HP and the four offensive/defensive stats. Selling a pet or consuming it in a prestige fusion returns all equipped items to inventory.

## Party & Storage

- **Party cap**: 6 pets (increases by 1 every 5 player levels, max 12)
- **Total cap**: 300 pets (increases by 1 every 25 player levels, capped at 300)
- Cannot deposit your last remaining party member.
- **Party presets**: save and load named party layouts from storage.
- Sell pets: `level × 25 + prestigeLevel × 1000 + tier sell value + (5,000 if shiny)`.

## Pet Power

```
pet power = maxHP + attack + defense + speed + special + (level × 5)
```
Team power = sum of all pet powers (party + storage).

## Save System

Auto-saves to browser `localStorage` under key `petSimulator` after every meaningful action (battle, training, shop, crafting, inventory changes, prestige, tier upgrade, storage changes, quests, and exploration). Saved fields: pets, storage, money, inventory, selected pet, starter flag, exploration cooldowns, max party/total caps, and player data (level, XP, streaks, best streak, unlocked zones, activity counters, daily-login streak/date, daily activities, achievements, party presets, selected title, daily quests, and last quest reset).

## Player Profile

A **level button** in the top-right corner opens a profile overlay with comprehensive player statistics:

| Stat | Description |
|---|---|
| Level | Current player level (XP-based progression; XP needed = level × 150) |
| XP | Current XP / XP needed for next level |
| Title | Currently equipped title (or None) |
| Party Pets | Current party count / max party size |
| Total Pets | Total pets (party + storage) / max total |
| Total Catches | Lifetime pets caught |
| Total Battles | Lifetime battles fought |
| Best Streak | Longest consecutive battle win streak |
| Total Trainings | Lifetime training sessions completed |
| Total Explores | Lifetime exploration attempts |
| Zones Unlocked | Unlocked exploration zones / total zones |
| Achievements | Achievements unlocked / total |
| Total Power | Sum of all pet powers (party + storage) |
| Party Power | Sum of party pet powers only |

The overlay also shows an achievement badge grid and a title selector.

### Unlockable Rewards (per level)
- Every level: +1 to all stats on every owned pet
- Every 5 levels: +1 team slot (max 12)
- Every 25 levels: +1 storage slot (capped at 300)
- Level 50: Auto-Explore unlocked

## Achievements & Titles

**Achievements** grant one-time gold rewards, scaled by tier (bronze ×1, silver ×1.5, gold ×2, platinum ×4). Categories include first catch, battle-win milestones (10/50/100), unique-pet collection (10/25), training (10/50), exploration (10/50), crafting (10/50), win streaks (5/10), and first prestige fusion.

**Titles** are cosmetic labels unlocked by meeting requirements (e.g. defeat counts, unique catches, explore/craft counts, streaks, or owning 5 pets of an element). Equip one from the profile overlay.

## Daily Systems

- **Daily login bonus**: awards 100 gold + 20 gold per consecutive login day (streak bonus capped at 500), resetting the streak if a day is missed.
- **Daily quests**: 3 random quests refresh each day (e.g. defeat 5 pets of an element, craft items, explore, train, or catch pets), each paying out gold on completion.

## Tech Stack

- **HTML5** — structure and game screens
- **Tailwind CSS** (CDN) — styling
- **Vanilla JavaScript** — all game logic
- No frameworks, no build step, no server required
</content>
</invoke>
