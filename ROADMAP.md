# 🗺️ WEBBLASTER ROADMAP & FUTURE PLAN

This document outlines the strategic vision for the evolution of **WEBBLASTER**.

---

## Phase 1: Polish & Feedback (Current)
- [x] **Refined Scoring:** Different points for different tags.
- [x] **Structural Destruction:** Shift+Click to delete parents/tables.
- [x] **Boss Mechanics:** Random high-HP targets.
- [x] **Diverse Scenarios:** News, Shop, Chaos, Tables.
- [ ] **Bug Fixes:** Ensure overlay doesn't block essential site navigation when inactive.

## Phase 2: "Juice" & Audio (Next Steps)
The game currently feels good but sounds silent.
- [x] **Sound Effects (SFX):**
    - [x] Blaster shot sound.
    - [x] Background Music (Lo-Fi loop).
    - [ ] Combo multiplier announcements ("DOUBLE KILL", "RAMPAGE").
    - [ ] Boss alarm and explosion sounds.
    - *Tech:* Use `AudioContext` or simple HTML5 Audio.
- **[ ] Advanced Visuals:**
    - [x] CRT Scanline effects.
    - [x] Glitch animations on buttons.
    - [ ] Canvas-based particle explosions (bits of the website flying off).
    - [ ] Screen shake intensity based on element size.

## Phase 3: Progression Systems
Give the player a reason to keep playing.
- **[ ] Persistent Stats:**
    - Total elements destroyed.
    - Career high score.
    - "Most Hated Tag" stats (e.g., "You destroyed 5000 DIVs").
    - *Tech:* `chrome.storage.local`.
- **[ ] Level Up System:**
    - Earn XP to level up your rank (Script Kiddie -> SysAdmin -> NetRunner).
    - Unlockable visual themes (Matrix Green, Vaporwave Pink, Terminal Mono).

## Phase 4: Arsenal Expansion
New tools to destroy the web.
- **[ ] Weapon Selector:**
    - **Laser:** Instant hit, standard points.
    - [ ] **Shotgun:** Area of effect damage (destroy clusters of text).
    - **Grenade:** Thrown projectile that explodes a generic `div` area after 2s.
    - **Nuke:** Clears the entire viewport (10 min cooldown).
- [x] **Smart Targets:**
    - [x] Logic to prevent destroying structural DIVs by accident.
    - [x] "Enemy" class system for simulations.

## Phase 5: Social & Global (Long Term)
- **[ ] Leaderboards:** Global high scores for popular domains (who got the highest score on google.com?).
- **[ ] Challenges:** Daily targets ("Destroy 50 Images today").

---

## 💡 Quick Wins (Can do now)
1.  **[ ] Cursor Customization:** Change the crosshair based on Combo level.
2.  **[ ] Theme Selector:** Simple toggle in the settings for different color schemes.
3.  **[ ] Local High Score:** Show "Personal Best" in the HUD.
4.  [x] **Custom Branding:** Updated Logos and README.
