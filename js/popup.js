document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggleBtn');
  const statusText = document.querySelector('.status-text');
  const container = document.querySelector('.container');
  const modeOptions = document.querySelectorAll('.mode-option');
  const timerSettings = document.getElementById('timer-settings');
  const timeMin = document.getElementById('time-min');
  const timeSec = document.getElementById('time-sec');

  let currentMode = 'free';

  // Sound FX
  const sfxClick = new Audio('../sounds/fx_digital_click.mp3');
  const sfxHover = new Audio('../sounds/fx_menu_selection.mp3');
  sfxHover.volume = 0.5;

  function playClick() {
    sfxClick.currentTime = 0;
    sfxClick.play().catch(e => { }); // catch helper for fast clicks
  }

  function playHover() {
    sfxHover.currentTime = 0;
    sfxHover.play().catch(e => { });
  }

  // Attach FX to interactive elements
  const interactables = document.querySelectorAll('button, .mode-option, .tab-btn, .cybr-btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', playHover);
    el.addEventListener('click', playClick);
  });

  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.add('hidden'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate target
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      targetContent.classList.remove('hidden');
      targetContent.classList.add('active');

      // Refresh data if opening Profile or Challenges
      if (tab.dataset.tab === 'profile' || tab.dataset.tab === 'challenges') {
        loadProfileData();
      }
    });
  });

  function loadProfileData() {
    chrome.storage.local.get(['wb_stats', 'wb_unlocked'], (res) => {
      const stats = res.wb_stats || {
        total_xp: 0, current_level: 1, total_destroyed: 0,
        max_combo: 0, tags: {}, domains: {}
      };
      const unlocked = res.wb_unlocked || [];

      // Update Profile Tab
      document.getElementById('p-level').innerText = stats.current_level;
      document.getElementById('p-xp').innerText = stats.total_xp.toLocaleString();
      document.getElementById('s-kills').innerText = stats.total_destroyed.toLocaleString();
      document.getElementById('s-combo').innerText = stats.max_combo.toLocaleString();
      document.getElementById('s-img').innerText = (stats.tags['IMG'] || 0).toLocaleString();
      document.getElementById('s-h1').innerText = (stats.tags['H1'] || 0).toLocaleString();

      // Calculate Rank Name
      document.getElementById('p-rank').innerText = getRankName(stats.current_level);

      // XP Bar (Very rough approx for visual juice)
      // Level N requires N*N*1000 xp roughly.
      // Let's just show progress to next level based on simple math
      const currentLvlBase = Math.pow(stats.current_level - 1, 2) * 1000;
      const nextLvlReq = Math.pow(stats.current_level, 2) * 1000;
      const progress = (stats.total_xp - currentLvlBase) / (nextLvlReq - currentLvlBase);
      const pct = Math.min(Math.max(progress * 100, 5), 100);
      document.getElementById('p-xp-fill').style.width = `${pct}%`;

      // Update Challenges Tab
      renderChallenges(stats, unlocked);
    });
  }

  function getRankName(lvl) {
    if (lvl <= 5) return "SCRIPT KIDDIE";
    if (lvl <= 10) return "GLITCH HUNTER";
    if (lvl <= 20) return "CODE BREAKER";
    if (lvl <= 50) return "NET RUNNER";
    return "WEB GOD";
  }

  function renderChallenges(stats, unlocked) {
    const list = document.getElementById('challenges-list');
    list.innerHTML = '';

    // We need the challenge definitions. 
    // Ideally we import them, but we can duplicate the config array here for safety since we can't easily import modules in popup without build system.
    const challenges = [
      { id: 'c_novice', title: 'Novice Breaker', desc: 'Destroy 100 elements', target: 100, type: 'total' },
      { id: 'c_imghater', title: 'Image Hater', desc: 'Destroy 50 Images', target: 50, type: 'tag', tag: 'IMG' },
      { id: 'c_h1hunter', title: 'Headline Hunter', desc: 'Destroy 20 H1 Headers', target: 20, type: 'tag', tag: 'H1' },
      { id: 'c_fb_detox', title: 'Social Detox', desc: 'Destroy 100 elements on Facebook', target: 100, type: 'domain', domain: 'facebook.com' },
      { id: 'c_yt_killer', title: 'Video Killer', desc: 'Destroy 100 elements on YouTube', target: 100, type: 'domain', domain: 'youtube.com' },
      { id: 'c_wiki_vandal', title: 'Wiki Vandal', desc: 'Destroy 50 elements on Wikipedia', target: 50, type: 'domain', domain: 'wikipedia.org' },
      { id: 'c_merca_cons', title: 'Consumerism', desc: 'Destroy 50 elements on MercadoLibre', target: 50, type: 'domain', domain: 'mercadolibre.com' },
      { id: 'c_inbox_zero', title: 'Inbox Zero', desc: 'Destroy 50 elements on Gmail', target: 50, type: 'domain', domain: 'mail.google.com' },
      { id: 'c_combo_king', title: 'Combo King', desc: 'Reach a 20x Combo', target: 20, type: 'combo' },
      { id: 'c_millionaire', title: 'Millionaire', desc: 'Accumulate 1,000,000 XP', target: 1000000, type: 'xp' }
    ];

    challenges.forEach(chal => {
      const isUnlocked = unlocked.includes(chal.id);
      const item = document.createElement('div');
      item.className = `challenge-item ${isUnlocked ? 'unlocked' : ''}`;
      item.style.cssText = `
            background: rgba(255,255,255,0.05);
            border: 1px solid ${isUnlocked ? '#f8c51e' : '#444'};
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            position: relative;
            opacity: ${isUnlocked ? 1 : 0.7};
          `;

      // Calculate current progress
      let current = 0;
      if (chal.type === 'total') current = stats.total_destroyed;
      if (chal.type === 'tag') current = stats.tags[chal.tag] || 0;
      if (chal.type === 'domain') {
        // try to find partial match in stats.domains keys
        Object.keys(stats.domains).forEach(d => {
          if (d.includes(chal.domain)) current += stats.domains[d];
        });
      }
      if (chal.type === 'combo') current = stats.max_combo;
      if (chal.type === 'xp') current = stats.total_xp;

      const pct = Math.min((current / chal.target) * 100, 100);

      item.innerHTML = `
            <div style="font-size:12px; font-weight:bold; color:${isUnlocked ? '#f8c51e' : '#eee'}">
                ${isUnlocked ? '★ ' : ''}${chal.title}
            </div>
            <div style="font-size:10px; color:#aaa; margin:4px 0;">${chal.desc}</div>
            
            ${!isUnlocked ? `
                <div style="background:#222; height:4px; width:100%; border-radius:2px; margin-top:5px;">
                    <div style="background:#f8c51e; width:${pct}%; height:100%;"></div>
                </div>
                <div style="font-size:9px; text-align:right; color:#666; margin-top:2px;">${current} / ${chal.target}</div>
            ` : `<div style="font-size:10px; color:#f8c51e; margin-top:5px;">COMPLETED</div>`}
          `;
      list.appendChild(item);
    });
  }

  // Mode Selection Logic
  modeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentMode = opt.dataset.mode;

      if (currentMode === 'timed') {
        timerSettings.classList.remove('hidden');
        // Restore user defaults or keep as is
        timeMin.disabled = false;
        timeSec.disabled = false;
      } else if (currentMode === 'extreme') {
        timerSettings.classList.remove('hidden'); // Show it so user sees it's fixed
        // Force visual display to 1:00 and disable inputs
        timeMin.value = 1;
        timeSec.value = 0;
        timeMin.disabled = true;
        timeSec.disabled = true;
      } else {
        timerSettings.classList.add('hidden');
      }
    });
  });

  // Reset Stats Logic
  const resetBtn = document.getElementById('reset-stats-btn');
  const modal = document.getElementById('custom-modal');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');

  if (resetBtn && modal) {
    resetBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      playClick();
    });

    modalCancel.addEventListener('click', () => {
      modal.classList.add('hidden');
      playClick();
    });

    modalConfirm.addEventListener('click', () => {
      // Play a "Delete" sound if possible, else click
      playClick();

      chrome.storage.local.set({ wb_stats: null, wb_unlocked: null }, () => {
        loadProfileData(); // Refresh UI
        modal.classList.add('hidden');
      });
    });
  }

  // Query active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    const tabId = tabs[0].id;

    // Check if game is running
    try {
      chrome.tabs.sendMessage(tabId, { action: "GET_STATUS" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Content script not ready");
          return;
        }
        if (response && response.isActive) {
          setUIActive(true);
        }
      });
    } catch (e) {
      console.error(e);
    }

    btn.addEventListener('click', () => {
      // Get settings
      const min = parseInt(timeMin.value) || 0;
      const sec = parseInt(timeSec.value) || 0;
      const totalSeconds = (min * 60) + sec;

      const config = {
        mode: currentMode,
        timeLimit: totalSeconds > 0 ? totalSeconds : 60 // Default 60s if invalid
      };

      if (currentMode === 'extreme') {
        config.timeLimit = 60; // Force 1 minute for extreme
      }

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['js/content.js']
      }, () => {
        // After injection (if not already there), send toggle
        chrome.tabs.sendMessage(tabId, {
          action: "TOGGLE_GAME",
          config: config
        }, (response) => {
          if (response) {
            setUIActive(response.isActive);
          }
        });
      });
    });
  });

  function setUIActive(active) {
    const btnText = btn.childNodes[0]; // first text node
    if (active) {
      container.classList.add('active');
      statusText.innerText = "SYSTEM ACTIVE";
      statusText.style.color = "#0f0";
      btnText.textContent = "STOP GAME";
      document.querySelector('.status-dot').style.backgroundColor = "#0f0";
      document.querySelector('.status-dot').style.boxShadow = "0 0 10px #0f0";
    } else {
      container.classList.remove('active');
      statusText.innerText = "SYSTEM READY";
      statusText.style.color = "#888";
      btnText.textContent = "START GAME";
      document.querySelector('.status-dot').style.backgroundColor = "#333";
      document.querySelector('.status-dot').style.boxShadow = "0 0 5px #333";
    }
  }
});
