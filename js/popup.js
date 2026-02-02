document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggleBtn');
  const statusText = document.querySelector('.status-text');
  const container = document.querySelector('.container');
  const modeOptions = document.querySelectorAll('.mode-option');
  const timerSettings = document.getElementById('timer-settings');
  const timeMin = document.getElementById('time-min');
  const timeSec = document.getElementById('time-sec');

  let currentMode = 'free';

  // Mode Selection Logic
  modeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentMode = opt.dataset.mode;

      if (currentMode === 'timed') {
        timerSettings.classList.remove('hidden');
      } else {
        timerSettings.classList.add('hidden');
      }
    });
  });

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
