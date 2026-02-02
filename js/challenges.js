/**
 * Challenge & Progression Manager
 * Handles XP, Leveling, Stats, and Achievement tracking.
 */
const ChallengeManager = {
  stats: {
    total_xp: 0,
    current_level: 1,
    total_destroyed: 0,
    tags: {},
    domains: {}
  },

  // Config
  challenges: [
    { id: 'c_novice', title: 'Novice Breaker', desc: 'Destroy 100 elements', target: 100, type: 'total' },
    { id: 'c_imghater', title: 'Image Hater', desc: 'Destroy 50 Images', target: 50, type: 'tag', tag: 'IMG' },
    { id: 'c_h1hunter', title: 'Headline Hunter', desc: 'Destroy 20 H1 Headers', target: 20, type: 'tag', tag: 'H1' },
    { id: 'c_fb_detox', title: 'Social Detox', desc: 'Destroy 100 elements on Facebook', target: 100, type: 'domain', domain: 'facebook' },
    { id: 'c_yt_killer', title: 'Video Killer', desc: 'Destroy 100 elements on YouTube', target: 100, type: 'domain', domain: 'youtube' },
    { id: 'c_wiki_vandal', title: 'Wiki Vandal', desc: 'Destroy 50 elements on Wikipedia', target: 50, type: 'domain', domain: 'wikipedia' },
    { id: 'c_merca_cons', title: 'Consumerism', desc: 'Destroy 50 elements on MercadoLibre', target: 50, type: 'domain', domain: 'mercadolibre' },
    { id: 'c_inbox_zero', title: 'Inbox Zero', desc: 'Destroy 50 elements on Gmail', target: 50, type: 'domain', domain: 'mail.google' },
    { id: 'c_combo_king', title: 'Combo King', desc: 'Reach a 20x Combo', target: 20, type: 'combo' }
  ],

  unlocked: [], // Stores IDs of completed challenges

  init() {
    this.loadStats();
  },

  loadStats() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['wb_stats', 'wb_unlocked'], (result) => {
        if (result.wb_stats) {
          this.stats = { ...this.stats, ...result.wb_stats };
        }
        if (result.wb_unlocked) {
          this.unlocked = result.wb_unlocked;
        }
        console.log("WebBlaster Stats Loaded:", this.stats);
      });
    }
  },

  save() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        'wb_stats': this.stats,
        'wb_unlocked': this.unlocked
      });
    }
  },

  // --- Core Actions ---

  addXP(amount) {
    this.stats.total_xp += amount;
    this.checkLevelUp();
    this.save();
  },

  recordDestruction(tagName) {
    // 1. Total Count
    this.stats.total_destroyed++;

    // 2. Tag Count
    if (!this.stats.tags[tagName]) this.stats.tags[tagName] = 0;
    this.stats.tags[tagName]++;

    // 3. Domain Count
    const domain = window.location.hostname.replace('www.', '');
    if (!this.stats.domains[domain]) this.stats.domains[domain] = 0;
    this.stats.domains[domain]++;

    this.checkChallenges();
    this.save();
  },

  updateMaxCombo(combo) {
    if (combo > (this.stats.max_combo || 0)) {
      this.stats.max_combo = combo;
      this.checkChallenges();
      this.save();
    }
  },

  // --- Logic ---

  checkLevelUp() {
    // Formula: Level = Sqrt(XP / 1000) + 1
    // 0xp = Lvl 1
    // 1000xp = Lvl 2
    // 4000xp = Lvl 3
    const calculatedLvl = Math.floor(Math.sqrt(this.stats.total_xp / 1000)) + 1;

    if (calculatedLvl > this.stats.current_level) {
      this.stats.current_level = calculatedLvl;
      this.showToast(`LEVEL UP!`, `You are now Rank ${this.getRankName(calculatedLvl)} (Lvl ${calculatedLvl})`);
    }
  },

  getRankName(lvl) {
    if (lvl <= 5) return "SCRIPT KIDDIE";
    if (lvl <= 10) return "GLITCH HUNTER";
    if (lvl <= 20) return "CODE BREAKER";
    if (lvl <= 50) return "NET RUNNER";
    return "WEB GOD";
  },

  checkChallenges() {
    const domain = window.location.hostname.replace('www.', '');

    this.challenges.forEach(chal => {
      if (this.unlocked.includes(chal.id)) return; // Already done

      let completed = false;

      if (chal.type === 'total' && this.stats.total_destroyed >= chal.target) completed = true;
      if (chal.type === 'tag' && (this.stats.tags[chal.tag] || 0) >= chal.target) completed = true;
      if (chal.type === 'domain' && domain.includes(chal.domain) && (this.stats.domains[domain] || 0) >= chal.target) completed = true;
      if (chal.type === 'combo' && (this.stats.max_combo || 0) >= chal.target) completed = true;

      if (completed) {
        this.unlockChallenge(chal);
      }
    });
  },

  unlockChallenge(chal) {
    this.unlocked.push(chal.id);
    this.showToast("CHALLENGE COMPLETE", chal.title);
    // Bonus XP for challenge?
    this.addXP(500);
  },

  // --- Visuals ---

  showToast(title, subtitle) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #f8c51e;
            color: #fff;
            padding: 15px 30px;
            border-radius: 4px;
            z-index: 10000000;
            font-family: 'Courier New', monospace;
            text-align: center;
            box-shadow: 0 0 20px rgba(248, 197, 30, 0.5);
            animation: wb-toast-in 0.5s ease-out;
            pointer-events: none;
        `;

    toast.innerHTML = `
            <div style="color: #f8c51e; font-weight: bold; font-size: 16px; margin-bottom: 5px;">${title}</div>
            <div style="color: #fff; font-size: 12px;">${subtitle}</div>
        `;

    document.body.appendChild(toast);

    // Remove after 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 4000);

    // Add Keyframes if not exists
    if (!document.getElementById('wb-toast-style')) {
      const style = document.createElement('style');
      style.id = 'wb-toast-style';
      style.innerHTML = `
                @keyframes wb-toast-in {
                    from { top: -100px; opacity: 0; }
                    to { top: 20px; opacity: 1; }
                }
            `;
      document.head.appendChild(style);
    }
  }
};

// Auto-init specific for testing or standalone, but usually called by content script
// ChallengeManager.init(); 
