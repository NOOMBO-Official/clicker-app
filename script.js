/* script.js – Core game logic for Clicker App */
'use strict';

(() => {
  // ----- Game State -----
  const state = {
    count: 0,
    clickPower: 1,          // points per manual click
    autoClickRate: 0,       // points per second (auto‑clicker)
    multiplierCost: 10,
    autoClickerCost: 50,
  };

  // ----- DOM Elements -----
  const counterEl = document.getElementById('counter');
  const clickBtn = document.getElementById('clickBtn');
  const buyMultiplierBtn = document.getElementById('buyMultiplier');
  const buyAutoClickerBtn = document.getElementById('buyAutoClicker');
  const multiplierCostEl = document.getElementById('multiplierCost');
  const autoClickerCostEl = document.getElementById('autoclickerCost');

  // ----- Persistence -----
  const STORAGE_KEY = 'clickerAppState';

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      } catch (e) {
        console.warn('Failed to parse saved state:', e);
      }
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // ----- UI Updates -----
  function updateCounter() {
    counterEl.textContent = Math.floor(state.count);
    counterEl.classList.add('counter-updated');
    setTimeout(() => counterEl.classList.remove('counter-updated'), 300);
  }

  function updateUpgradeButtons() {
    // Multiplier
    multiplierCostEl.textContent = `Cost: ${state.multiplierCost}`;
    buyMultiplierBtn.disabled = state.count < state.multiplierCost;

    // Auto‑Clicker
    autoClickerCostEl.textContent = `Cost: ${state.autoClickerCost}`;
    buyAutoClickerBtn.disabled = state.count < state.autoClickerCost;
  }

  function refreshUI() {
    updateCounter();
    updateUpgradeButtons();
  }

  // ----- Game Mechanics -----
  function handleClick() {
    state.count += state.clickPower;
    refreshUI();
    saveState();
  }

  function purchaseMultiplier() {
    if (state.count >= state.multiplierCost) {
      state.count -= state.multiplierCost;
      state.clickPower += 1;
      // Exponential cost scaling
      state.multiplierCost = Math.round(state.multiplierCost * 1.5);
      refreshUI();
      saveState();
    }
  }

  function purchaseAutoClicker() {
    if (state.count >= state.autoClickerCost) {
      state.count -= state.autoClickerCost;
      state.autoClickRate += 1;
      state.autoClickerCost = Math.round(state.autoClickerCost * 1.7);
      refreshUI();
      saveState();
    }
  }

  // Auto‑clicker loop (runs once per second)
  function startAutoClicker() {
    setInterval(() => {
      if (state.autoClickRate > 0) {
        state.count += state.autoClickRate;
        refreshUI();
        saveState();
      }
    }, 1000);
  }

  // ----- Event Listeners -----
  function bindEvents() {
    clickBtn.addEventListener('click', handleClick);
    buyMultiplierBtn.addEventListener('click', purchaseMultiplier);
    buyAutoClickerBtn.addEventListener('click', purchaseAutoClicker);
  }

  // ----- Init -----
  function init() {
    loadState();
    bindEvents();
    startAutoClicker();
    refreshUI();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();