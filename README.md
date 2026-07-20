# 🐾 PetTrainingMinigame

A minigame of skill while training your pets.

## Project Overview

PetTrainingMinigame is a browser-based pet collection and training game inspired by classic monster-taming games. Players choose a starter companion and set out to explore different zones, battle wild pets, catch them, level up, and train their team.

### Main Features

- **Starter Selection** — Pick your first companion from 7 available starters (including Dark and Fairy types).
- **30 Pet Types** across 10 elemental types: Fire, Water, Grass, Electric, Psychic, Ice, Dragon, Dark, Fairy, and Normal.
- **Training Minigame** — A timing-based skill challenge: stop the moving marker in the GOOD or PERFECT zone to earn XP and stat boosts.
- **Exploration** — 9 different zones (Forest, Cave, Lake, Mountain, Desert, Ocean, Volcano, Swamp, Sky), each with common and rare pet encounters.
- **Turn-Based Battle System** — Fight wild pets with type effectiveness (including immunities), critical hits, and speed-based turn order.
- **Catching System** — Use Basic, Great, or Ultra Balls to catch wild pets.
- **Pet Storage** — When your party of 6 is full, caught pets are automatically sent to Pet Storage. Swap pets between your party and storage anytime via the 📦 Pet Storage screen or the Deposit/Withdraw buttons on each pet's detail page.
- **Shop & Inventory** — Spend gold on balls and potions to heal your pets.
- **Progression** — Pets gain XP, level up, evolve (3 stages), and grow their stats.
- **Auto-Save** — Progress is stored locally in the browser via `localStorage`, so you never lose your team.

## Stacks Used

- **HTML5** — Page structure and game screens.
- **CSS3** — Styling, layout (Flexbox/Grid), animations, and theming.
- **JavaScript (Vanilla)** — All game logic (no frameworks or libraries).

No build tools or dependencies required — just open the files in a browser.

## How to Run the Project

1. **Download or clone the repository:**
   ```bash
   git clone https://github.com/santiagoalexgonzalezc-sys/PetTrainingMinigame.git
   ```

2. **Navigate to the project folder:**
   ```bash
   cd PetTrainingMinigame
   ```

3. **Open `index.html` in your browser:**
   - Double-click `index.html`, or
   - Right-click → *Open with* → your preferred browser.

That's it — the game runs entirely client-side, no server or installation needed.

> **Tip:** To reset your account and start over, click the **🔄 Reset Account** button on the main screen.
