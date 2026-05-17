// ============ Jordle - The J-Word Wordle ============

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentRow = 0;
let currentCol = 0;
let currentGuess = '';
let gameOver = false;
let answer = '';
let todayKey = '';
let guesses = [];
let keyStates = {}; // letter -> 'correct'|'present'|'absent'

// ---- Date key for daily word ----
function getTodayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// ---- LocalStorage helpers ----
function loadState() {
  todayKey = getTodayKey();
  const stored = JSON.parse(localStorage.getItem('jordle_state') || '{}');

  // If same day, resume
  if (stored.dateKey === todayKey) {
    return stored;
  }

  // New day - check if yesterday was won to maintain streak
  const stats = loadStats();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.getFullYear() + '-' + String(yesterday.getMonth()+1).padStart(2,'0') + '-' + String(yesterday.getDate()).padStart(2,'0');

  if (stored.dateKey === yKey && stored.gameStatus === 'won') {
    // streak continues naturally
  } else if (stored.dateKey !== yKey && stored.gameStatus !== 'won') {
    // missed a day - streak will be reset when we start new game
  }

  // Return fresh state for new day
  return { dateKey: todayKey, guesses: [], gameStatus: 'playing' };
}

function saveState(state) {
  localStorage.setItem('jordle_state', JSON.stringify(state));
}

function loadStats() {
  return JSON.parse(localStorage.getItem('jordle_stats') || '{"played":0,"wins":0,"streak":0,"maxStreak":0}');
}

function saveStats(stats) {
  localStorage.setItem('jordle_stats', JSON.stringify(stats));
}

// ---- Initialize ----
function init() {
  // Check if the Action-generated override matches today
  if (typeof DAILY_WORD_OVERRIDE !== 'undefined' && typeof DAILY_WORD_DATE !== 'undefined' && DAILY_WORD_DATE === getTodayKey()) {
    answer = DAILY_WORD_OVERRIDE;
  } else {
    answer = getDailyWord(getTodayKey());
  }
  const state = loadState();
  todayKey = getTodayKey();

  if (state.guesses && state.guesses.length > 0) {
    // Replay saved guesses
    guesses = state.guesses;
    guesses.forEach((guess, i) => {
      currentRow = i;
      currentGuess = guess;
      currentCol = WORD_LENGTH;
      fillRow(i, guess);
      revealRow(i, guess, false);
    });
    currentRow = guesses.length;
    currentCol = 0;
    currentGuess = '';
    gameOver = state.gameStatus !== 'playing';
  }

  updateStatsBar();

  // Keyboard input
  document.addEventListener('keydown', handleKeydown);

  // On-screen keyboard
  document.querySelectorAll('#keyboard button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleInput(key);
    });
  });

  // Help button
  document.getElementById('help-btn').addEventListener('click', () => {
    document.getElementById('help-overlay').classList.remove('hidden');
  });
  document.getElementById('help-close-btn').addEventListener('click', () => {
    document.getElementById('help-overlay').classList.add('hidden');
  });

  // Modal buttons
  document.getElementById('close-btn').addEventListener('click', closeModal);
  document.getElementById('share-btn').addEventListener('click', shareResult);

  // Show help on first visit
  if (!localStorage.getItem('jordle_visited')) {
    document.getElementById('help-overlay').classList.remove('hidden');
    localStorage.setItem('jordle_visited', '1');
  }
}

// ---- Input handling ----
function handleKeydown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Enter') handleInput('ENTER');
  else if (e.key === 'Backspace') handleInput('BACK');
  else if (/^[a-zA-Z]$/.test(e.key)) handleInput(e.key.toUpperCase());
}

function handleInput(key) {
  if (gameOver) return;

  if (key === 'ENTER') {
    submitGuess();
  } else if (key === 'BACK') {
    deleteLetter();
  } else if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  }
}

function addLetter(letter) {
  if (currentCol >= WORD_LENGTH) return;
  const row = document.querySelector(`.row[data-row="${currentRow}"]`);
  const tile = row.querySelector(`.tile[data-col="${currentCol}"]`);
  tile.textContent = letter;
  tile.classList.add('filled');
  currentGuess += letter;
  currentCol++;
}

function deleteLetter() {
  if (currentCol <= 0) return;
  currentCol--;
  const row = document.querySelector(`.row[data-row="${currentRow}"]`);
  const tile = row.querySelector(`.tile[data-col="${currentCol}"]`);
  tile.textContent = '';
  tile.classList.remove('filled');
  currentGuess = currentGuess.slice(0, -1);
}

// ---- Submit guess ----
function submitGuess() {
  if (currentCol < WORD_LENGTH) {
    showToast('Not enough letters');
    shakeRow(currentRow);
    return;
  }

  const guess = currentGuess.toUpperCase();

  // Must start with J
  if (guess[0] !== 'J') {
    showToast('Word must start with J!');
    shakeRow(currentRow);
    return;
  }

  // Must be in valid word list
  if (!GUESS_POOL.includes(guess)) {
    showToast('Not in word list');
    shakeRow(currentRow);
    return;
  }

  // Evaluate
  revealRow(currentRow, guess, true);
  guesses.push(guess);
  currentGuess = '';
  currentCol = 0;

  const won = guess === answer;
  const lost = !won && guesses.length >= MAX_GUESSES;

  // Save state
  const state = {
    dateKey: todayKey,
    guesses: guesses,
    gameStatus: won ? 'won' : (lost ? 'lost' : 'playing')
  };
  saveState(state);

  if (won || lost) {
    gameOver = true;
    const stats = loadStats();
    stats.played++;
    if (won) {
      stats.wins++;
      stats.streak++;
      if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
    } else {
      stats.streak = 0;
    }
    saveStats(stats);
    updateStatsBar();

    setTimeout(() => {
      showModal(won, guess);
      if (won) bounceRow(currentRow - 1);
    }, 1800);
  } else {
    currentRow++;
  }
}

// ---- Reveal row with flip animation ----
function revealRow(rowIdx, guess, animate) {
  const row = document.querySelector(`.row[data-row="${rowIdx}"]`);
  const tiles = row.querySelectorAll('.tile');
  const evaluation = evaluateGuess(guess);

  tiles.forEach((tile, i) => {
    const delay = animate ? i * 300 : 0;

    if (animate) {
      tile.classList.add('flip');
      setTimeout(() => {
        tile.classList.add(evaluation[i]);
        tile.classList.remove('flip');
      }, delay + 250);
    } else {
      tile.classList.add(evaluation[i]);
    }

    // Update keyboard state
    const letter = guess[i];
    const state = evaluation[i];
    if (!keyStates[letter] || state === 'correct' ||
        (state === 'present' && keyStates[letter] !== 'correct') ||
        (state === 'absent' && !keyStates[letter])) {
      keyStates[letter] = state;
    }
  });

  // Update keyboard colors after all tiles revealed
  if (animate) {
    setTimeout(updateKeyboard, WORD_LENGTH * 300 + 300);
  } else {
    updateKeyboard();
  }
}

// ---- Evaluate guess against answer ----
function evaluateGuess(guess) {
  const result = Array(WORD_LENGTH).fill('absent');
  const ansArr = answer.split('');
  const gArr = guess.split('');

  // First pass: correct (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (gArr[i] === ansArr[i]) {
      result[i] = 'correct';
      ansArr[i] = null;
      gArr[i] = null;
    }
  }

  // Second pass: present (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (gArr[i] === null) continue;
    const idx = ansArr.indexOf(gArr[i]);
    if (idx !== -1) {
      result[i] = 'present';
      ansArr[idx] = null;
    }
  }

  return result;
}

// ---- Fill row (for replaying saved state) ----
function fillRow(rowIdx, guess) {
  const row = document.querySelector(`.row[data-row="${rowIdx}"]`);
  const tiles = row.querySelectorAll('.tile');
  tiles.forEach((tile, i) => {
    tile.textContent = guess[i];
    tile.classList.add('filled');
  });
}

// ---- Update keyboard colors ----
function updateKeyboard() {
  document.querySelectorAll('#keyboard button[data-key]').forEach(btn => {
    const key = btn.getAttribute('data-key');
    if (keyStates[key]) {
      btn.classList.remove('correct', 'present', 'absent');
      btn.classList.add(keyStates[key]);
    }
  });
}

// ---- Animations ----
function shakeRow(rowIdx) {
  const row = document.querySelector(`.row[data-row="${rowIdx}"]`);
  row.classList.add('shake');
  setTimeout(() => row.classList.remove('shake'), 600);
}

function bounceRow(rowIdx) {
  const row = document.querySelector(`.row[data-row="${rowIdx}"]`);
  const tiles = row.querySelectorAll('.tile');
  tiles.forEach((tile, i) => {
    setTimeout(() => tile.classList.add('bounce'), i * 100);
  });
}

// ---- Toast ----
function showToast(msg, duration) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration || 1500);
}

// ---- Modal ----
function showModal(won) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = won ? 'Brilliant!' : 'Better luck next time!';
  document.getElementById('modal-word').textContent = 'The word was ' + answer;

  const stats = loadStats();
  document.getElementById('stat-played').textContent = stats.played;
  document.getElementById('stat-win').textContent = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  document.getElementById('stat-streak').textContent = stats.streak;
  document.getElementById('stat-max').textContent = stats.maxStreak;

  overlay.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ---- Stats bar ----
function updateStatsBar() {
  const stats = loadStats();
  document.getElementById('streak-display').textContent = 'Streak: ' + stats.streak;
  document.getElementById('max-streak-display').textContent = 'Max: ' + stats.maxStreak;
}

// ---- Share ----
function shareResult() {
  const emojiGrid = guesses.map(guess => {
    const eval_ = evaluateGuess(guess);
    return eval_.map(s => s === 'correct' ? '\ud83d\udfe9' : s === 'present' ? '\ud83d\udfe8' : '\u2b1b\ufe0f').join('');
  }).join('\n');

  const dayNum = Math.floor((new Date() - new Date('2025-01-01')) / (1000 * 60 * 60 * 24));
  const text = `Jordle #${dayNum} ${guesses.length}/${MAX_GUESSES}\n\n${emojiGrid}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    });
  } else {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard!');
  }
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', init);
