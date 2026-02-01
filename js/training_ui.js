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

  const isActive = window.toggleStandaloneGame();
  const btn = document.getElementById('manual-start-btn');

  if (isActive) {
    btn.innerText = "DISABLE SIMULATION";
    btn.style.background = "#333";
  } else {
    btn.innerText = "ENABLE SIMULATION MODE";
    btn.style.background = "#ff003c";
  }
}
