document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toggleBtn');
  const statusText = document.querySelector('.status-text');
  const container = document.querySelector('.container');

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
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['js/content.js']
      }, () => {
        // After injection (if not already there), send toggle
        chrome.tabs.sendMessage(tabId, { action: "TOGGLE_GAME" }, (response) => {
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
