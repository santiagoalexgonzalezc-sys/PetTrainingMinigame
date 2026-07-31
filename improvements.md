# Pet Training Minigame - Future Improvements

## 🎮 Gameplay Mechanics
- Daily quests — "Defeat 5 grass-type pets", "Craft 3 potions", etc. with small rewards (gold/gems)
- Shiny/hex color variants — Shiny pets already exist but add a visible sparkle animation and a "shiny checker" tooltip
- Pet training mini-games — Instead of just XP, add a quick reflex minigame (click targets) for bonus training points
- Auto-heal toggle — During auto-explore, option to auto-use potions when HP drops below 50%
- Battle replay — Save last few battle logs so you can review them after closing
- Weather effects in battles — Rain boosts water types, sun boosts fire types, etc.
- Combo system — Consecutive successful moves build up combo meter for bonus damage
- Pet personality traits — Random traits that affect stats/behavior (aggressive, defensive, playful)
- Battle arena selection — Choose different arenas with terrain bonuses
- Evolution stones — Special items required for certain pet evolutions

## 📈 Progression Systems
- Season/rebirth system — After reaching max level, reset XP but keep pets/prestige for a permanent bonus multiplier
- Ranked leaderboard — Store top player levels/scores in localStorage and display a local leaderboard
- Pet daycare — Leave 2-3 pets in daycare and earn XP/hour even when offline (based on time played)
- Mastery trees — Skill trees for each pet type with passive bonuses
- Title system — Earn titles (e.g., "Dragon Tamer", "Grass Guardian") for display on profile
- Pet bonding — Increase bond level with pets through battles for stat boosts
- Achievement tiers — Bronze/Silver/Gold/Platinum achievement levels with escalating rewards

## 🛠️ Quality of Life
- Bulk crafting — Craft 5/10 of a recipe at once instead of one-by-one
- Sort/filter inventory — Filter by type (resource, consumable, equipment) in inventory screen
- Quick equip — One-click equip from inventory instead of opening equipment screen per pet
- Battle speed toggle — "Fast mode" skips 500ms delays between auto-battle actions
- Auto-heal on defeat — If pet faints during manual exploration, auto-use lowest-cost healing item
- Save/load presets — Save party configurations and load them instantly
- Keyboard shortcuts — Hotkeys for common actions (1-6 for pets, E for equip, etc.)
- Undo button — Undo accidental sells/releases with a time limit
- Auto-sort storage — Sort pets by tier, level, or type automatically

## 🎨 UI/UX
- Dark/light theme toggle
- Pet sprite animations — Add idle/battle animation CSS keyframes instead of static emoji
- Battle screen HP bar animation — Smooth health bar transitions instead of instant jumps
- Hover tooltips — Show full stat breakdown on pet card hover in storage/party
- Customizable UI layout — Drag and drop to rearrange screen elements
- Mini-map for zones — Visual representation of floor progression
- Notification center — Centralized hub for all game notifications
- Custom themes/skins — Unlockable color schemes and background patterns
- Accessibility options — Color blind mode, larger text, reduced motion

## 🌍 Content Additions
- New zones — "Crystal Caves" (ice/fairy), "Shadow Realm" (dark/ghost), "Volcanic Isle" (fire/dragon)
- New pet evolutions — Add 3-stage evolution lines for existing pets
- Legendary boss fight — A rare zone boss (S-tier) that appears once per hour
- Trading system — Trade pets with another player (even if local)
- Pet breeding — Combine two pets to create offspring with mixed stats/abilities
- Guild/team system — Form a party of 6 pets with a team name, shared resources
- Random events — Encounters during exploration (treasure chests, traveling merchants, wild boss fights)
- Daily dungeons — Special limited-time zones with unique rewards
- Pet forms — Alternate forms for pets with different type/stat distributions
- Mini-games hub — Separate area for various mini-games with prizes

## 📊 Data & Analytics
- Battle stats tracker — Win/loss ratio, most used pet, average damage per battle
- Resource graph — Show resource income over time (how many wood sticks per hour of auto-explore)
- Pet stat calculator — Tool that shows future stats at next level before training
- Performance metrics — Track playtime, battles per hour, efficiency ratings
- Type effectiveness chart — Visual chart showing all type matchups

## 💰 Economy
- Sell interface in shop — Ability to sell excess resources/backyard pets for gold
- Market prices — Shop prices fluctuate daily
- Crafting material bundles — Buy pre-made resource packs in shop
- Premium currency — Earn gems from achievements, use for cosmetic items
- Auction house — Player-to-player trading with bidding system
- Resource conversion — Convert excess resources to other types at a cost
- Tax system — Small fee on high-value trades to prevent inflation

## 🔊 Audio/Visual
- Sound effects — Battle sounds (hit, ability, victory, defeat) using Web Audio API
- Particle effects — Sparkles on shiny pets, fire on fire-types
- Pet portrait portraits — Larger, styled portraits for pets in battle instead of emoji + name
- Music system — Background music with volume control

---

## ✅ Already Implemented
- Battle streak multiplier — Visible and increased to 10x+ cap
- Elemental weaknesses system — Type effectiveness icons on battle screen
- Achievement badges — 17 achievements with profile display
- Pet collection book — Screen showing all pet templates with collected/missing status
- Auto-sell — Auto-sell D1 pets with confirmation
- Toast notifications — Non-blocking toast popups replacing alert()
- Screen transitions — Fade-in/fade-out between screens
- Zone ambient colors — Background color tint during exploration
- Pet search — Search bar in party/storage to filter pets by name or type
- Daily login rewards — Streak bonuses with consecutive day tracking
- Export/import save data — Backup and transfer progress via JSON files
- Pet comparison tool — Side-by-side stat comparison between two pets
- Dynamic backgrounds — Background changes based on current zone/arena
- Screen shake effects — Impact effects during critical hits
- Victory/defeat cinematics — Special animations for battle end
- Weather visuals — Rain, snow, fog effects in appropriate zones
