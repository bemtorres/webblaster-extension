# WEBBLASTER 🕹️💥

![WEBBLASTER Gameplay](images/webblaster_800.gif)

**WEBBLASTER** is a Chrome Extension that turns the entire internet into your personal arcade shooting gallery. Gamify your browsing experience by destroying web elements, building combos, leveling up, and fighting boss battles generated from the page content.

> **Status:** Playable Prototype / Beta
> **Version:** 1.0 "Extreme Chaos Edition"

---

## 🚀 Features

*   **Arcade Scoring System:** Earn points for destroying HTML elements. Videos and headings are worth more!
*   **XP & Leveling:** Gain experience for every destruction. Rank up from "Script Kiddie" to "Web God".
*   **Challenges:** Complete achievements like "Social Detox" (Destroy Facebook elements) or "Image Hater".
*   **3 Game Modes:**
    *   **Free Mode:** Destroy at your own pace.
    *   **Timed Mode:** Race against the clock.
    *   **☠️ EXTREME MODE:** 60 seconds of pure chaos. Elements **clone themselves** and text **shakes violently**. Can you survive the glitch?
*   **Structural Destruction (SHIFT + CLICK):** Hold `Shift` to delete entire sections instantly.
*   **Boss Battles:** Spawns random "Golden Bosses". Deplete their HP for massive XP!
*   **Retro UI:** A cyberpunk HUD with real-time stats, combos, and animated menus.

---

## 🎮 Controls

*   **CLICK**: Destroy target element.
*   **SHIFT + CLICK**: Structural Attack (Delete parent container).
*   **Boss Fight**: Click Golden elements repeatedly to destroy them.

---

## 📂 Project Structure

*   **manifest.json**: Chrome Extension Config (Manifest V3).
*   **content.js**: Main game engine.
*   **challenges.js**: RPG logic (XP, Levels, Achievements).
*   **popup/**: Extension menu (Mode selection, Profile, Rankings).
*   **scenarios/**: HTML test labs for development.
*   **sounds/**: SFX assets.

---

## 🛠️ Installation (Developer Mode)

1.  Open Chrome and navigate to `chrome://extensions/`
2.  Enable **"Developer mode"** in the top right corner.
3.  Click **"Load unpacked"**.
4.  Select the folder containing this project.
5.  Pin the extension icon to your browser toolbar.
6.  Visit any website and click the joystick icon!

---

## 🧪 Simulation / Testing

Open `index.html` to access the **Mission Hub**, where you can test mechanics in isolated environments (`scenario_extreme_test.html`, `scenario_shop.html`, etc.) without installing the extension.

---

## ⚠️ Privacy & Safety

*   **Local Data Only:** All progress (XP, Challenges) is stored locally in your browser. Nothing is sent to the cloud.
*   **Epilepsy Warning:** Extreme Mode contains flashing lights and rapid shaking effects.

---

## 📝 Credits

**DEV:** [@bemtorres](https://github.com/bemtorres)
*Style*: Cyberpunk Arcade / Retro Future.
