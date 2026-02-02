/* Standalone Game Logic for Demo Page (No Extension Required) */
(function () {
  console.log("Standalone Game Engine Loaded");

  // Inject game CSS automatically
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/game.css';
  document.head.appendChild(link);

  const state = {
    active: false,
    score: 0,
    combo: 0,
    comboTimer: 0,
    maxComboTime: 3000,
    startTime: 0,
    elapsedSeconds: 0,
    clicks: 0,
    hits: 0,
    soundEnabled: true,
    mode: 'free',
    timeLimit: 0,
    isPaused: false
  };

  let hud, scoreEl, clickEl, comboBar, comboText, timerEl, gameLoopRequest, bossInterval;
  let lastTime = 0;
  let hoverTarget = null;
  let bgMusic = null;
  let canvas = null;
  let ctx = null;
  let particles = [];

  const SCORING = {
    'H1': 1000, 'H2': 800, 'H3': 600, 'H4': 500,
    'IMG': 1500, 'VIDEO': 2000, 'SVG': 1200,
    'TABLE': 2500, 'TR': 500, 'TD': 200,
    'A': 300, 'BUTTON': 300, 'P': 100, 'LI': 100,
    'SPAN': 50, 'DIV': 150, 'SECTION': 500, 'ARTICLE': 500,
    'NAV': 500, 'HEADER': 500, 'FOOTER': 500, 'ASIDE': 500,
    'DEFAULT': 50,
    'BOSS': 5000
  };

  const STRUCTURAL_TAGS = ['SECTION', 'ARTICLE', 'NAV', 'HEADER', 'FOOTER', 'ASIDE', 'MAIN', 'TABLE'];
  const ALLOWED_TARGETS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SMALL', 'BUTTON', 'A', 'IMG', 'VIDEO', 'SVG', 'LI', 'SPAN', 'STRONG', 'EM', 'TH', 'TD'];

  function isAllowedTarget(el) {
    if (el.classList.contains('wb-enemy')) return true;
    return ALLOWED_TARGETS.includes(el.tagName);
  }

  window.toggleStandaloneGame = function (config) {
    if (state.active) disableGame();
    else enableGame(config);
    return state.active;
  };

  function enableGame(config) {
    state.active = true;
    state.score = 0;
    state.combo = 0;
    state.comboTimer = 0;
    state.clicks = 0;
    state.hits = 0;

    state.mode = config?.mode || 'free';
    state.timeLimit = config?.timeLimit || 60;

    state.isPaused = true;

    document.body.classList.add('wb-game-active');
    createHUD();
    createCanvasOverlay();

    startCountdown(() => {
      if (!state.active) return;
      state.isPaused = false;
      state.startTime = Date.now();
      state.elapsedSeconds = 0;
      addListeners();
      startGameLoop();
      startBossSpawner();
      playMusic();
      document.body.style.cursor = "crosshair";
    });
  }

  function disableGame() {
    // Stat Summary
    if (state.active) {
      showSummaryModal();
    }

    state.active = false;
    document.body.classList.remove('wb-game-active');
    if (gameLoopRequest) cancelAnimationFrame(gameLoopRequest);
    stopBossSpawner();
    stopMusic();
    removeHUD();
    removeCanvasOverlay();
    removeListeners();
    document.body.style.cursor = "default";

    document.querySelectorAll('.wb-target-hover').forEach(el => el.classList.remove('wb-target-hover'));
    document.querySelectorAll('.wb-parent-hover').forEach(el => el.classList.remove('wb-parent-hover'));
    document.querySelectorAll('.wb-boss').forEach(el => {
      el.classList.remove('wb-boss');
      el.removeAttribute('data-wb-health');
    });
  }

  function showSummaryModal() {
    const oldModal = document.getElementById('wb-summary-modal');
    if (oldModal) oldModal.remove();

    const accuracy = state.clicks > 0 ? Math.round((state.hits / state.clicks) * 100) : 0;

    // In Timed Mode, show the total time limit instead of the countdown remaining
    let timeDisplay = '00:00';
    if (state.mode === 'timed') {
      const minutes = Math.floor(state.timeLimit / 60).toString().padStart(2, '0');
      const seconds = (state.timeLimit % 60).toString().padStart(2, '0');
      timeDisplay = `${minutes}:${seconds}`;
    } else {
      timeDisplay = timerEl ? timerEl.innerText : '00:00';
    }

    const modal = document.createElement('div');
    modal.id = 'wb-summary-modal';
    modal.innerHTML = `
        <div class="wb-modal-content">
            <h2>MISSION REPORT</h2>
            <div class="wb-stat-grid">
                <div class="wb-stat-item">
                    <span class="wb-stat-label">SCORE</span>
                    <span class="wb-stat-value">${state.score.toLocaleString()}</span>
                </div>
                <div class="wb-stat-item">
                    <span class="wb-stat-label">TIME</span>
                    <span class="wb-stat-value">${timeDisplay}</span>
                </div>
                <div class="wb-stat-item">
                    <span class="wb-stat-label">ACCURACY</span>
                    <span class="wb-stat-value">${accuracy}%</span>
                </div>
                <div class="wb-stat-item">
                    <span class="wb-stat-label">HITS/CLICKS</span>
                    <span class="wb-stat-value" style="font-size:14px">${state.hits} / ${state.clicks}</span>
                </div>
            </div>
            <button id="wb-close-modal">CLOSE REPORT</button>
        </div>
        <style>
            #wb-summary-modal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.85); z-index: 10000001;
                display: flex; justify-content: center; align-items: center;
                backdrop-filter: blur(5px);
            }
            .wb-modal-content {
                background: rgba(20, 20, 20, 0.95);
                border: 2px solid #f8c51e;
                padding: 30px;
                width: 300px;
                text-align: center;
                font-family: 'Press Start 2P', monospace;
                color: #fff;
                box-shadow: 0 0 30px rgba(248, 197, 30, 0.3);
                animation: wb-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .wb-modal-content h2 {
                color: #f8c51e;
                font-size: 18px;
                margin-bottom: 30px;
                text-shadow: 2px 2px #ff003c;
                line-height: 1.5;
            }
            .wb-stat-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .wb-stat-item {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .wb-stat-label {
                font-size: 8px;
                color: #888;
                font-family: sans-serif;
                letter-spacing: 1px;
            }
            .wb-stat-value {
                font-size: 18px;
                color: #fff;
            }
            #wb-close-modal {
                background: #ff003c;
                border: none;
                color: #fff;
                padding: 15px 30px;
                font-family: 'Press Start 2P', monospace;
                font-size: 12px;
                cursor: pointer;
                transition: transform 0.1s;
                width: 100%;
            }
            #wb-close-modal:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 0, 60, 0.5);
            }
            @keyframes wb-pop-in {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
    `;
    document.body.appendChild(modal);

    document.getElementById('wb-close-modal').addEventListener('click', () => {
      modal.remove();
    });
  }

  function createHUD() {
    if (document.getElementById('web-blaster-hud')) return;
    const hudDiv = document.createElement('div');
    hudDiv.id = 'web-blaster-hud';
    hudDiv.innerHTML = `
            <div class="wb-hud-left">
                <button class="wb-icon-btn" title="Settings">⚙</button>
                <div class="wb-timer-box">
                    <div class="wb-label">TIME</div>
                    <div class="wb-timer">00:00</div>
                </div>
                <div class="wb-clicks-box" style="margin-left: 10px; text-align: center;">
                    <div class="wb-label">ACCURACY</div>
                    <div class="wb-clicks-val" style="font-family: 'Press Start 2P'; font-size: 10px; color: #fff;">0 / 0</div>
                </div>
            </div>

            <div class="wb-hud-center">
                <div class="wb-combo-text">COMBO ACTIVE!</div>
                <div class="wb-combo-bar-bg">
                    <div class="wb-combo-fill"></div>
                </div>
            </div>

            <div class="wb-hud-right">
                <div class="wb-score-box">
                    <div class="wb-label">SCORE</div>
                    <div class="wb-score-val">0</div>
                </div>
                <button id="wb-stop-sim-btn" class="wb-btn-stop">STOP SIM</button>
            </div>

            <div id="wb-hint-bar" style="position:absolute; bottom:-25px; left:0; width:100%; text-align:center; font-size:10px; color:#aaa; font-family:sans-serif;">
                [SHIFT] + CLICK: Destroy Parent | GOLD TARGETS: Hit multiple times!
            </div>
        `;
    document.body.appendChild(hudDiv);

    hud = hudDiv;
    scoreEl = hud.querySelector('.wb-score-val');
    clickEl = hud.querySelector('.wb-clicks-val');
    comboBar = hud.querySelector('.wb-combo-fill');
    comboText = hud.querySelector('.wb-combo-text');
    timerEl = hud.querySelector('.wb-timer');

    document.getElementById('wb-stop-sim-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = document.getElementById('manual-start-btn');
      if (btn) {
        btn.innerText = "ENABLE SIMULATION MODE";
        btn.style.background = "#ff003c";
      }
      disableGame();
    });

    hud.querySelector('.wb-icon-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      state.soundEnabled = !state.soundEnabled;
      if (bgMusic) bgMusic.muted = !state.soundEnabled;
      const btn = e.target;
      btn.textContent = state.soundEnabled ? '🔊' : '🔇';
      btn.title = state.soundEnabled ? "Sound ON" : "Sound OFF";
    });

    // Initial state check
    const settingsBtn = hud.querySelector('.wb-icon-btn');
    settingsBtn.textContent = state.soundEnabled ? '🔊' : '🔇';

    // Add github link
    const credit = document.createElement('div');
    credit.style.cssText = "position:absolute; bottom:-40px; right:0; font-size:10px; color:#aaa; font-family:sans-serif;";
    credit.innerHTML = 'Dev: <a href="https://github.com/bemtorres" target="_blank" style="color:#fff; text-decoration:none;">bemtorres</a>';
    hud.appendChild(credit);
  }

  function createCanvasOverlay() {
    if (document.getElementById('wb-particles-canvas')) return;
    canvas = document.createElement('canvas');
    canvas.id = 'wb-particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function removeCanvasOverlay() {
    if (canvas) {
      canvas.remove();
      canvas = null;
      ctx = null;
      particles = [];
      window.removeEventListener('resize', resizeCanvas);
    }
  }

  function removeHUD() {
    if (hud) hud.remove();
    hud = null;
  }

  function addListeners() {
    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onHoverOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyChange, true);
    document.addEventListener('keyup', onKeyChange, true);
  }

  function removeListeners() {
    document.removeEventListener('mouseover', onHover, true);
    document.removeEventListener('mouseout', onHoverOut, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKeyChange, true);
    document.removeEventListener('keyup', onKeyChange, true);
  }

  function onHover(e) {
    if (!state.active) return;
    if (isProtected(e.target)) return;
    hoverTarget = e.target;
    updateHoverVisuals(e);
  }

  function onHoverOut(e) {
    if (!state.active) return;
    e.target.classList.remove('wb-target-hover');
    if (e.target.parentNode && e.target.parentNode.classList) {
      e.target.parentNode.classList.remove('wb-parent-hover');
    }
    hoverTarget = null;
  }

  function onKeyChange(e) {
    if (!state.active || !hoverTarget) return;
    if (e.key === 'Shift') {
      updateHoverVisuals({ target: hoverTarget, shiftKey: e.shiftKey });
    }
  }

  function updateHoverVisuals(e) {
    document.querySelectorAll('.wb-target-hover').forEach(el => el.classList.remove('wb-target-hover'));
    document.querySelectorAll('.wb-parent-hover').forEach(el => el.classList.remove('wb-parent-hover'));

    if (!e.target || isProtected(e.target)) return;

    let target = e.target;
    // Check allowlist for direct hover (shift is for structural)
    if (!e.shiftKey && !isAllowedTarget(target)) return;

    let parent = null;

    if (e.shiftKey) {
      let curr = target.parentElement;
      while (curr && curr.tagName !== 'BODY' && curr.tagName !== 'HTML') {
        if (STRUCTURAL_TAGS.includes(curr.tagName)) {
          parent = curr;
          break;
        }
        curr = curr.parentElement;
      }
      if (!parent && target.parentNode && target.tagName !== 'BODY') {
        parent = target.parentNode;
      }
    }

    if (parent) {
      parent.classList.add('wb-parent-hover');
      target.classList.add('wb-target-hover');
    } else {
      target.classList.add('wb-target-hover');
    }
  }

  function onClick(e) {
    if (!state.active) return;
    if (isProtected(e.target)) return;

    e.preventDefault();
    e.stopPropagation();

    let target = e.target;

    state.clicks++;
    updateHUD();

    // Check for Boss logic
    if (target.classList.contains('wb-boss')) {
      hitBoss(target);
      return;
    }

    if (!e.shiftKey && !isAllowedTarget(target)) return;

    if (e.shiftKey) {
      let curr = target.parentElement;
      let parent = null;
      while (curr && curr.tagName !== 'BODY' && curr.tagName !== 'HTML') {
        if (STRUCTURAL_TAGS.includes(curr.tagName)) {
          parent = curr;
          break;
        }
        curr = curr.parentElement;
      }
      if (!parent && target.parentNode && target.tagName !== 'BODY') {
        parent = target.parentNode;
      }

      if (parent) {
        target = parent;
        if (target.classList.contains('wb-boss')) {
          hitBoss(target);
          return;
        }
      }
    }

    destroyElement(target);
  }

  function isProtected(el) {
    if (el.id === 'web-blaster-hud' || el.closest('#web-blaster-hud')) return true;
    if (el.id === 'manual-start-btn') return true;
    return false;
  }

  // --- Boss Logic ---

  function startBossSpawner() {
    bossInterval = setInterval(spawnBoss, 4000); // Shorter interval for demo
  }

  function stopBossSpawner() {
    clearInterval(bossInterval);
  }

  function spawnBoss() {
    if (!state.active) return;

    const candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, video, .wb-enemy');
    const visibleCandidates = Array.from(candidates).filter(el => {
      // If it's a DIV, it must have wb-enemy OR be explicitly wb-boss
      if (el.tagName === 'DIV' && !el.classList.contains('wb-enemy') && !el.classList.contains('wb-boss')) return false;

      if (el.classList.contains('wb-boss') || el.classList.contains('wb-destroyed')) return false;
      if (isProtected(el)) return false;

      // Ensure no parent is already a boss
      if (el.closest('.wb-boss')) return false;

      const rect = el.getBoundingClientRect();
      return (
        rect.width > 100 && rect.height > 50 &&
        rect.top >= 0 && rect.bottom <= window.innerHeight
      );
    });

    if (visibleCandidates.length === 0) return;

    const randomEl = visibleCandidates[Math.floor(Math.random() * visibleCandidates.length)];

    const health = Math.floor(Math.random() * 20) + 10;
    randomEl.classList.add('wb-boss');
    randomEl.dataset.wbHealth = health;
    randomEl.dataset.wbMaxHealth = health;

    spawnFloatingText(randomEl, "⚠️ BOSS SPAWNED!", false);
  }

  function hitBoss(el) {
    let health = parseInt(el.dataset.wbHealth);
    let maxHealth = parseInt(el.dataset.wbMaxHealth);
    health--;
    el.dataset.wbHealth = health;

    state.hits++;

    // Sound depending on health
    // Full health -> High pitch (2.0)
    // Low health -> Low pitch (0.5)
    // ratio goes from 1 (full) to 0 (dead)
    const ratio = health / maxHealth;
    const pitch = 0.5 + (ratio * 1.5);

    playBossHitSound(pitch);

    el.classList.add('wb-boss-hit');
    setTimeout(() => el.classList.remove('wb-boss-hit'), 100);

    spawnFloatingText(el, "-1", false);

    if (health <= 0) {
      destroyBoss(el);
    }
  }

  function destroyBoss(el) {
    el.classList.remove('wb-boss');

    state.score += SCORING.BOSS;
    state.combo += 5;
    state.comboTimer = state.maxComboTime;

    updateHUD();
    spawnFloatingText(el, "BOSS DOWN! +5000 XP", true);

    playBossExplosionSound();

    el.classList.add('wb-boss-exploded');
    setTimeout(() => el.remove(), 800);
  }

  function playMusic() {
    // If music exists but it is the wrong track, stop it
    if (bgMusic) {
      const currentSrc = bgMusic.src;
      const desiredTrack = state.mode === 'timed' ? 'FinalCoreMeltdown.mp3' : 'PixelSkyway.mp3';

      // Check if we need to switch tracks
      // Note: src might be absolute URL, so check if it includes the filename
      if (!currentSrc.includes(desiredTrack)) {
        stopMusic();
        bgMusic = null;
      }
    }

    if (!bgMusic) {
      const track = state.mode === 'timed' ? '../sounds/FinalCoreMeltdown.mp3' : '../sounds/PixelSkyway.mp3';
      bgMusic = new Audio(track);
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
    }
    bgMusic.muted = !state.soundEnabled;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Music autoplay prevented:", error);
      });
    }
  }

  function stopMusic() {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }

  function playShootSound() {
    if (!state.soundEnabled) return;
    try {
      const audio = new Audio('../sounds/shot_fx.mp3');
      audio.volume = 0.5;
      // Random pitch variation (0.8 to 1.5)
      audio.playbackRate = 0.8 + Math.random() * 0.7;
      if (audio.preservesPitch !== undefined) {
        audio.preservesPitch = false;
      } else if (audio.mozPreservesPitch !== undefined) {
        audio.mozPreservesPitch = false;
      } else if (audio.webkitPreservesPitch !== undefined) {
        audio.webkitPreservesPitch = false;
      }
      audio.play();
    } catch (e) {
      console.log("Sound error:", e);
    }
  }

  function playBossHitSound(pitch) {
    if (!state.soundEnabled) return;
    try {
      const audio = new Audio('../sounds/fx_boos.mp3');
      audio.volume = 0.6;
      audio.playbackRate = pitch;

      if (audio.preservesPitch !== undefined) {
        audio.preservesPitch = false;
      } else if (audio.mozPreservesPitch !== undefined) {
        audio.mozPreservesPitch = false;
      } else if (audio.webkitPreservesPitch !== undefined) {
        audio.webkitPreservesPitch = false;
      }

      audio.play();
    } catch (e) {
      console.log("Boss sound error:", e);
    }
  }

  function playBossExplosionSound() {
    if (!state.soundEnabled) return;
    try {
      const audio = new Audio('../sounds/fx_explosion.mp3');
      audio.volume = 0.8;
      audio.play();
    } catch (e) {
      console.log("Boss explosion sound error:", e);
    }
  }

  // --- Standard Logic ---

  function destroyElement(el) {
    const tag = el.tagName;
    let points = SCORING[tag] || SCORING.DEFAULT;
    if (tag === 'TABLE' || tag === 'TBODY' || tag === 'TR') points *= 2;

    state.combo++;
    state.comboTimer = state.maxComboTime;
    const multiplier = Math.min(state.combo, 50);

    state.hits++;

    // Particle FX
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const color = style.backgroundColor !== 'rgba(0, 0, 0, 0)'
      ? style.backgroundColor
      : style.color;

    spawnParticles(rect, color);

    state.score += points * multiplier;

    playShootSound();

    updateHUD();
    spawnFloatingText(el, `+${points}`, false);
    if (state.combo > 1) spawnFloatingText(el, `x${state.combo} COMBO!`, true);

    el.classList.remove('wb-target-hover');
    el.classList.remove('wb-parent-hover');
    el.classList.add('wb-destroyed');
    setTimeout(() => el.style.visibility = 'hidden', 300);
  }

  function updateHUD() {
    if (!scoreEl) return;
    scoreEl.innerText = state.score.toLocaleString();
    if (clickEl) clickEl.innerText = `${state.hits} / ${state.clicks}`;
    if (state.combo > 1) {
      comboText.innerText = `COMBO x${state.combo}`;
      comboText.classList.add('active');
    } else {
      comboText.classList.remove('active');
    }
  }

  function startCountdown(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.8); z-index: 1000000;
        display: flex; justify-content: center; align-items: center;
        font-family: 'Press Start 2P', sans-serif; color: #fff;
        font-size: 80px; letter-spacing: 10px; pointer-events: none;
    `;
    document.body.appendChild(overlay);

    const playSound = (file) => {
      if (!state.soundEnabled) return;
      try { new Audio(file).play(); } catch (e) { } // Adjusted relative path
    };

    let count = 3;
    const update = () => {
      if (!state.active) {
        overlay.remove();
        return;
      }

      if (count > 0) {
        overlay.innerText = count;

        if (count === 3) playSound('../sounds/fx_3_three.mp3');
        if (count === 2) playSound('../sounds/fx_2_two.mp3');
        if (count === 1) playSound('../sounds/fx_1_one.mp3');

        overlay.style.transform = "scale(1.5)";
        overlay.style.opacity = "0";
        overlay.animate([
          { transform: 'scale(1.5)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.5)', opacity: 0 }
        ], { duration: 900, fill: 'forwards' });

        count--;
        setTimeout(update, 1000);
      } else {
        overlay.innerText = "GO!";
        overlay.style.color = "#f8c51e";
        playSound('../sounds/fx_4_go.mp3');

        overlay.animate([
          { transform: 'scale(0.5)', opacity: 0 },
          { transform: 'scale(1.2)', opacity: 1 },
          { transform: 'scale(2)', opacity: 0 }
        ], { duration: 800, fill: 'forwards' });

        setTimeout(() => {
          overlay.remove();
          callback();
        }, 800);
      }
    };

    update();
  }

  function updateTimer() {
    if (!state.active || !timerEl || state.isPaused) return;

    const now = Date.now();
    let displaySeconds = 0;

    if (state.mode === 'timed') {
      const elapsed = Math.floor((now - state.startTime) / 1000);
      const remaining = state.timeLimit - elapsed;

      if (remaining <= 0) {
        displaySeconds = 0;
        spawnFloatingText(timerEl, "TIME'S UP!", false);
        disableGame();
      } else {
        displaySeconds = remaining;
      }
    } else {
      // Free mode
      displaySeconds = Math.floor((now - state.startTime) / 1000);
    }

    // Only update DOM if changed
    if (state.lastDisplaySeconds !== displaySeconds) {
      state.lastDisplaySeconds = displaySeconds;
      const minutes = Math.floor(displaySeconds / 60).toString().padStart(2, '0');
      const seconds = (displaySeconds % 60).toString().padStart(2, '0');
      timerEl.innerText = `${minutes}:${seconds}`;

      // Warn last 10 seconds in timed mode
      if (state.mode === 'timed' && displaySeconds <= 10) {
        timerEl.style.color = (displaySeconds % 2 === 0) ? '#ff003c' : '#fff';
      } else {
        timerEl.style.color = '#fff';
      }
    }
  }

  function spawnFloatingText(targetEl, text, isCombo) {
    const rect = targetEl.getBoundingClientRect();
    const floatEl = document.createElement('div');
    floatEl.classList.add('wb-float-text');
    if (isCombo) floatEl.classList.add('wb-float-combo');
    floatEl.innerText = text;
    const randomX = (Math.random() - 0.5) * 50;
    floatEl.style.left = `${rect.left + rect.width / 2 + randomX}px`;
    floatEl.style.top = `${rect.top}px`;
    document.body.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1000);
  }

  function spawnParticles(rect, color) {
    if (!ctx) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = Math.min(30, Math.max(5, Math.floor(rect.width * rect.height / 200)));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: centerX + (Math.random() - 0.5) * rect.width,
        y: centerY + (Math.random() - 0.5) * rect.height,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        size: Math.random() * 5 + 2,
        life: 1.0,
        color: color || '#fff'
      });
    }
  }

  function updateAndDrawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // Gravity
      p.life -= 0.02;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;
  }

  function startGameLoop() {
    lastTime = performance.now();
    gameLoopRequest = requestAnimationFrame(gameLoop);
  }

  function gameLoop(time) {
    if (!state.active) return;
    const delta = time - lastTime;
    lastTime = time;
    updateTimer();
    updateAndDrawParticles();

    if (state.combo > 0) {
      state.comboTimer -= delta;
      if (comboBar) {
        const pct = Math.max(0, (state.comboTimer / state.maxComboTime) * 100);
        comboBar.style.width = `${pct}%`;
      }
      if (state.comboTimer <= 0) {
        state.combo = 0;
        updateHUD();
      }
    } else {
      if (comboBar) comboBar.style.width = '0%';
    }
    gameLoopRequest = requestAnimationFrame(gameLoop);
  }
})();
