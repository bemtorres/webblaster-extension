# WEBBLASTER 🕹️💥

![WEBBLASTER Gameplay](images/webblaster_800.gif)

**WEBBLASTER** is a Chrome Extension that turns the entire internet into your personal arcade shooting gallery. Gamify your browsing experience by destroying web elements, building combos, and fighting boss battles generated from the page content.

> **Status:** Playable Prototype / Beta
> **Version:** 1.0 "Arcade Edition"

---

## 🚀 Features

*   **Arcade Scoring System:** Earn points for destroying HTML elements. Videos and headings are worth more!
*   **Combo Mechanic:** Destroy elements in quick succession to build up your multiplier (up to x50).
*   **Structural Destruction (SHIFT + CLICK):** Hold `Shift` to target entire container blocks (Sections, Articles, Tables, Divs). Clean up big chunks of the page instantly.
*   **Boss Battles:** Randomly spawns "Golden Bosses" from existing page elements. Click repeatedly to deplete their HP and earn massive XP.
*   **Simulation Mode:** specialized "Scenarios" to train your aim without installing the extension (News Portal, Cyber Mall, Chaos Chamber).
*   **Retro UI:** A cyberpunk/arcade-inspired HUD with timers, health bars, and floating score texts.

---

## 🎮 Controls

*   **CLICK**: Destroy target element.
*   **SHIFT + CLICK**: Structural Attack. Destroys the parent container or structural block (Table, Section, etc.).
*   **Boss Fight**: When a component turns **GOLD**, click it repeatedly until its HP hits 0.

---

## 📂 Project Structure

*   **manifest.json**: Configuration for the Chrome Extension (Manifest V3).
*   **content.js**: The game engine. Injected into web pages to handle interactions, scoring, and visual effects.
*   **background.js**: Service worker handling installation events.
*   **popup.html / popup.js**: The extension's control panel.
*   **game.css**: All styles for the HUD, animations, and highlighting.
*   **standalone_game.js**: A version of the engine that runs on the simulation pages (for development/testing).
*   **Scenarios (HTML):**
    *   `index.html`: Main Hub.
    *   `training.html`: Basic target practice.
    *   `scenario_news.html`: Text density and layout training.
    *   `scenario_shop.html`: Grid and button training.
    *   `scenario_chaos.html`: Moving targets training.
    *   `scenario_tables.html`: Structural destruction training.

---

## 🛠️ Installation (Developer Mode)

1.  Open Chrome and navigate to `chrome://extensions/`
2.  Enable **"Developer mode"** in the top right corner.
3.  Click **"Load unpacked"**.
4.  Select the folder containing this project (`WebBlaster`).
5.  Pin the extension icon to your browser toolbar.
6.  Visit any website and click "START GAME" in the popup!

---

## 🧪 Simulation / Testing

You don't need to install the extension to test the game mechanics.
Simply open `index.html` in your browser. This will launch the **Mission Hub** where you can play all trained scenarios using the standalone engine.

---

## 📝 Credits

Developed by **Antigravity** & **Benjamin**.
*Style*: Cyberpunk Arcade / Retro Future.
