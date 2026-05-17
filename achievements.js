// ============ Jordle Achievements System ============

const ACHIEVEMENTS = [
  // -- Win/Loss Milestones --
  {
    id: 'first_j',
    emoji: '\u2728',
    name: 'First J',
    desc: 'Win your first game',
    check: (ctx) => ctx.justWon && ctx.stats.wins === 1
  },
  {
    id: 'tenacious_j',
    emoji: '\ud83d\udcaa',
    name: 'Tenacious J',
    desc: 'Win 10 games',
    check: (ctx) => ctx.justWon && ctx.stats.wins >= 10
  },
  {
    id: 'j_master',
    emoji: '\ud83c\udfc6',
    name: 'J Master',
    desc: 'Win 25 games',
    check: (ctx) => ctx.justWon && ctx.stats.wins >= 25
  },
  {
    id: 'j_legend',
    emoji: '\ud83e\udddb',
    name: 'J Legend',
    desc: 'Win 50 games',
    check: (ctx) => ctx.justWon && ctx.stats.wins >= 50
  },
  {
    id: 'first_loss',
    emoji: '\ud83d\ude22',
    name: 'Not Every J',
    desc: 'Lose your first game',
    check: (ctx) => ctx.justLost && ctx.stats.played >= 1
  },

  // -- Speed --
  {
    id: 'jackpot',
    emoji: '\ud83c\udfb0',
    name: 'Jackpot!',
    desc: 'Guess correctly on try 1',
    check: (ctx) => ctx.justWon && ctx.guessCount === 1
  },
  {
    id: 'double_j',
    emoji: '\u270c\ufe0f',
    name: 'Double J',
    desc: 'Guess correctly on try 2',
    check: (ctx) => ctx.justWon && ctx.guessCount === 2
  },
  {
    id: 'hat_trick',
    emoji: '\ud83c\udfa9',
    name: 'Hat Trick',
    desc: 'Guess correctly on try 3',
    check: (ctx) => ctx.justWon && ctx.guessCount === 3
  },

  // -- Streak --
  {
    id: 'j_streak_3',
    emoji: '\ud83d\udd25',
    name: 'On Fire',
    desc: 'Reach a 3-game streak',
    check: (ctx) => ctx.justWon && ctx.stats.streak >= 3
  },
  {
    id: 'j_streak_7',
    emoji: '\ud83d\udcab',
    name: 'Lucky Seven',
    desc: 'Reach a 7-game streak',
    check: (ctx) => ctx.justWon && ctx.stats.streak >= 7
  },
  {
    id: 'j_streak_14',
    emoji: '\u26a1',
    name: 'Fortnight Force',
    desc: 'Reach a 14-game streak',
    check: (ctx) => ctx.justWon && ctx.stats.streak >= 14
  },
  {
    id: 'j_streak_30',
    emoji: '\ud83d\udc51',
    name: 'J Royalty',
    desc: 'Reach a 30-game streak',
    check: (ctx) => ctx.justWon && ctx.stats.streak >= 30
  },

  // -- Special --
  {
    id: 'last_chance',
    emoji: '\ud83d\udcb8',
    name: 'Last Chance J',
    desc: 'Win on your final guess',
    check: (ctx) => ctx.justWon && ctx.guessCount === 6
  },
  {
    id: 'jesus_guessed_that',
    emoji: '\ud83d\ude31',
    name: 'Jesus Guessed That',
    desc: 'Win with 3+ absent guesses in the winning row',
    check: (ctx) => ctx.justWon && ctx.absentInWin >= 3
  },
  {
    id: 'j_completionist',
    emoji: '\ud83c\udf1f',
    name: 'J Completionist',
    desc: 'Unlock all other achievements',
    check: (ctx) => {
      const unlocked = getUnlockedIds();
      const allOthers = ACHIEVEMENTS.filter(a => a.id !== 'j_completionist').map(a => a.id);
      return allOthers.every(id => unlocked.includes(id));
    }
  }
];

// ---- LocalStorage ----
function getUnlockedIds() {
  return JSON.parse(localStorage.getItem('jordle_achievements') || '[]');
}

function saveUnlockedIds(ids) {
  localStorage.setItem('jordle_achievements', JSON.stringify(ids));
}

function unlockAchievement(id) {
  const ids = getUnlockedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveUnlockedIds(ids);
    return true; // newly unlocked
  }
  return false; // already had it
}

// ---- Check all achievements after a game ends ----
function checkAchievements(ctx) {
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(ach => {
    if (getUnlockedIds().includes(ach.id)) return; // already unlocked
    try {
      if (ach.check(ctx)) {
        const isNew = unlockAchievement(ach.id);
        if (isNew) newlyUnlocked.push(ach);
      }
    } catch (e) {
      // safety: don't let a broken check break the game
    }
  });

  // Show pop-ups with staggered timing
  newlyUnlocked.forEach((ach, i) => {
    setTimeout(() => showAchievementPopup(ach), i * 3200);
  });

  // Pulse the trophy button if there are new ones
  if (newlyUnlocked.length > 0) {
    document.getElementById('trophy-btn').classList.add('has-new');
  }
}

// ---- Show a pop-up for an unlocked achievement ----
function showAchievementPopup(ach) {
  const container = document.getElementById('achievement-popups');
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `<span class="popup-emoji">${ach.emoji}</span> ${ach.name}`;
  container.appendChild(popup);

  // Remove after animation completes
  setTimeout(() => {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 3200);
}

// ---- Render achievements modal ----
function renderAchievementsModal() {
  const unlocked = getUnlockedIds();
  const grid = document.getElementById('achievements-grid');
  const countEl = document.getElementById('achievements-count');

  grid.innerHTML = '';
  countEl.textContent = `${unlocked.length} / ${ACHIEVEMENTS.length}`;

  ACHIEVEMENTS.forEach(ach => {
    const isUnlocked = unlocked.includes(ach.id);
    const card = document.createElement('div');
    card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
    card.innerHTML = `
      <span class="achievement-emoji">${isUnlocked ? ach.emoji : '\ud83d\udd12'}</span>
      <div class="achievement-name">${ach.name}</div>
      <div class="achievement-desc">${ach.desc}</div>
    `;
    grid.appendChild(card);
  });
}

// ---- Trophy button & modal wiring ----
function initAchievements() {
  // Trophy button opens achievements modal
  document.getElementById('trophy-btn').addEventListener('click', () => {
    document.getElementById('trophy-btn').classList.remove('has-new');
    renderAchievementsModal();
    document.getElementById('achievements-overlay').classList.remove('hidden');
  });

  // Close achievements modal
  document.getElementById('achievements-close-btn').addEventListener('click', () => {
    document.getElementById('achievements-overlay').classList.add('hidden');
  });

  // Click outside to close
  document.getElementById('achievements-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'achievements-overlay') {
      document.getElementById('achievements-overlay').classList.add('hidden');
    }
  });

  // Show trophy pulse if there are any unlocked achievements
  // (so returning users see the trophy is active)
  const unlocked = getUnlockedIds();
  if (unlocked.length > 0) {
    document.getElementById('trophy-btn').classList.add('has-new');
    // Stop pulsing after a few seconds - it's just a welcome indicator
    setTimeout(() => {
      document.getElementById('trophy-btn').classList.remove('has-new');
    }, 4000);
  }
}
