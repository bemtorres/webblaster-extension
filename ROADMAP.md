# 🗺️ WEBBLASTER ROADMAP & FUTURE PLAN

This document outlines the strategic vision for the evolution of **WEBBLASTER**.

---

## ✅ Phase 1: Foundation & "Juice" (COMPLETED)
- [x] **Core Mechanics:** Click to destroy, Shift+Click for structural damage.
- [x] **Scoring System:** Dynamic points based on HTML tags.
- [x] **Combo System:** Multipliers for rapid destruction + Visual Combo Bar.
- [x] **Audio Experience:** 
    - Retro SFX for shots and interactions.
    - Dynamic BGM changes (PixelSkyway vs FinalCoreMeltdown).
    - Pitch variation for Boss hits and Explosions.
- [x] **Game Modes:** 
    - **Free Mode:** Infinite destruction.
    - **Timed Mode:** Countdown challenge with visual alerts.
- [x] **Visual Polish:** CRT effects, Glitch animations, Canvas-based particle explosions.
- [x] **Scenarios:** Dedicated training environments (News, Shop, Countdown, Extension Test).
- [x] **Compliance:** Privacy Policy and Google Web Store ready structure.

---

## 🚀 Phase 2: Progression & Persistence (NEXT PRIORITY)
Give the player a reason to keep returning.
- **[ ] Persistent Career Stats:**
    - Track "Total Elements Deleted" across all sessions.
    - Track "Total Playtime".
    - Save "Highest Score" per domain (e.g., your best run on google.com).
    - *Tech:* `chrome.storage.local`.
- **[ ] Rank System:**
    - XP Bar in the popup.
    - Titles: *Script Kiddie* -> *Code Breaker* -> *NetRunner* -> *Web God*.
- **[ ] Unlockables:**
    - Reaching Rank 5 unlocks new Crosshair styles.
    - Reaching Rank 10 unlocks new UI Color Themes (Matrix Green, Vaporwave Pink).

## ⚔️ Phase 3: Arsenal & Gameplay Depth
Move beyond simple clicking.
- **[ ] Weapon Selector (loadout):**
    - **Shotgun:** Area of effect (AoE) damage that hits multiple small elements.
    - **Machine Gun:** Hold click used for rapid destruction of containers.
    - **Railgun:** Piercing shot that destroys elements stacked on top of each other (Z-Index killer).
- **[ ] Advanced Enemies:**
    - **Armored Elements:** Requires 3 clicks to break (css border turns red -> orange -> broken).
    - **Moving Targets:** Elements that try to dodge your cursor using CSS transforms.
- **[ ] Power-ups:**
    - Occasionally spawn a "Power-up" icon on the page.
    - *Effects:* Freeze Timer, Double Points, Nuke (Clear Viewport).

## 🌐 Phase 4: Social & Competitive
- **[ ] Local Leaderboard:** Simple table in the popup showing your top 10 runs.
- **[ ] Daily Challenges:** Generates a random task daily (e.g., "Destroy 50 Images", "Score 10k on Wikipedia").
- **[ ] Shareable Cards:** Generate a cool image of your "Mission Report" to share on social media.

---

## 💡 Quick Wins / Polish Tasks
1.  **[ ] Dynamic Crosshair:** Crosshair expands/contracts when shooting.
2.  **[ ] Screen Shake:** Subtle camera shake for heavy destructions (Images/Videos).
3.  **[ ] Settings Menu:** ability to adjust volume separate for SFX and Music.
4.  **[ ] Introduction Tutorial:** First-time install walkthrough overlay.
