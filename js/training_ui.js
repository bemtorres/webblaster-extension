document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('manual-start-btn');
  if (btn) {
    btn.addEventListener('click', toggleSim);
  }
});

function toggleSim() {
  // Ensure the game engine is loaded
  if (typeof window.toggleStandaloneGame !== 'function') {
    console.error("Game engine not loaded");
    return;
  }

  const btn = document.getElementById('manual-start-btn');
  const mode = btn.dataset.mode || 'free';

  // Try to find input first, fallback to dataset
  const inputEl = document.getElementById('sim-time-input');
  let timeLimit = 60;

  if (inputEl) {
    timeLimit = parseInt(inputEl.value) || 60;
  } else {
    timeLimit = parseInt(btn.dataset.timeLimit) || 60;
  }

  const isActive = window.toggleStandaloneGame({ mode, timeLimit });

  if (isActive) {
    btn.innerText = "DISABLE SIMULATION";
    btn.style.background = "#333";
  } else {
    btn.innerText = "ENABLE SIMULATION MODE";
    btn.style.background = "#ff003c";
  }
}
