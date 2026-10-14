/**
 * TypeSprint - Main Application Engine
 * Handles typing logic, character highlighting, real-time WPM/Accuracy calculations,
 * timer countdown, pause/resume, event listeners, and UI updates.
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    // Test parameters
    duration: 60,            // 15, 30, 60, 120
    difficulty: 'intermediate', // beginner, intermediate, advanced
    caseMode: 'exact',       // 'exact' | 'ignore'

    // Current text data
    currentTextObj: null,
    textCharacters: [],      // Array of individual chars in passage
    charElements: [],        // DOM span elements for each char

    // Typing progression
    typedText: '',
    cursorIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    totalTypedCount: 0,

    // Test timing & status
    status: 'idle',          // 'idle' | 'running' | 'paused' | 'finished'
    timerInterval: null,
    remainingSeconds: 60,
    elapsedSeconds: 0,
    startTime: null,

    // Performance tracking per second (for chart/graph)
    wpmHistory: [],

    // Sound and Theme
    theme: 'dark'
  };

  // --- DOM ELEMENT REFERENCES ---
  const DOM = {
    // Dashboard Stats
    statWpm: document.getElementById('stat-wpm'),
    statAccuracy: document.getElementById('stat-accuracy'),
    statTimer: document.getElementById('stat-timer'),
    statCorrect: document.getElementById('stat-correct'),
    statBestWpm: document.getElementById('stat-best-wpm'),
    progressBar: document.getElementById('typing-progress-bar'),

    // Typing Area
    practiceContainer: document.getElementById('practice-container'),
    textDisplay: document.getElementById('text-display'),
    hiddenInput: document.getElementById('hidden-typing-input'),
    focusOverlay: document.getElementById('focus-overlay'),
    topicBadge: document.getElementById('topic-badge'),
    difficultyBadge: document.getElementById('difficulty-badge'),
    activeCaret: document.getElementById('active-caret'),

    // Control Buttons
    btnStart: document.getElementById('btn-start-test'),
    btnRestart: document.getElementById('btn-restart-test'),
    btnNewText: document.getElementById('btn-new-text'),
    btnPause: document.getElementById('btn-pause-test'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    soundStatusText: document.getElementById('sound-status-text'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    btnHelp: document.getElementById('btn-instructions'),
    btnHistory: document.getElementById('btn-view-history'),

    // Duration, Difficulty & Case Mode Buttons
    durationButtons: document.querySelectorAll('.duration-pill'),
    difficultyButtons: document.querySelectorAll('.difficulty-pill'),
    caseButtons: document.querySelectorAll('.case-pill'),
    shiftKeyHint: document.getElementById('shift-key-hint'),
    capsLockWarning: document.getElementById('caps-lock-warning'),

    // Pause Overlay
    pauseOverlay: document.getElementById('pause-overlay'),
    btnResume: document.getElementById('btn-resume-test'),

    // Results Modal
    resultsModal: document.getElementById('results-modal'),
    modalWpm: document.getElementById('result-final-wpm'),
    modalAccuracy: document.getElementById('result-final-accuracy'),
    modalTotalChars: document.getElementById('result-total-chars'),
    modalCorrectChars: document.getElementById('result-correct-chars'),
    modalIncorrectChars: document.getElementById('result-incorrect-chars'),
    modalDuration: document.getElementById('result-duration'),
    modalTierBadge: document.getElementById('result-tier-badge'),
    modalMessage: document.getElementById('result-motivational-msg'),
    modalNewBestTag: document.getElementById('result-new-best-tag'),
    chartContainer: document.getElementById('wpm-sparkline-container'),
    btnTryAgain: document.getElementById('btn-try-again'),
    btnNextTest: document.getElementById('btn-next-test'),
    btnShareResult: document.getElementById('btn-share-result'),
    btnCloseResult: document.getElementById('btn-close-result'),

    // Instructions Modal
    instructionsModal: document.getElementById('instructions-modal'),
    btnCloseInstructions: document.getElementById('btn-close-instructions'),

    // History Modal
    historyModal: document.getElementById('history-modal'),
    historyList: document.getElementById('history-table-body'),
    historyEmptyState: document.getElementById('history-empty-state'),
    btnClearHistory: document.getElementById('btn-clear-history'),
    btnCloseHistory: document.getElementById('btn-close-history'),

    // Toast Notification
    toastNotification: document.getElementById('toast-notification')
  };

  // --- INITIALIZATION ---
  function init() {
    loadSavedSettings();
    setupEventListeners();
    updateBestWpmDisplay();
    loadNewText();
    resetTestState();
  }

  function loadSavedSettings() {
    // Theme
    const savedTheme = window.storageManager.getTheme();
    applyTheme(savedTheme);

    // Duration and Difficulty preferences
    const prefs = window.storageManager.getPreferences();
    state.difficulty = prefs.difficulty || 'intermediate';
    state.duration = prefs.duration || 60;
    state.caseMode = prefs.caseMode || 'exact';
    state.remainingSeconds = state.duration;

    // Sync button UI with loaded preferences
    updatePillsUi();

    // Sound toggle state
    updateSoundButtonUi();
  }

  function updatePillsUi() {
    DOM.durationButtons.forEach(btn => {
      const dur = parseInt(btn.dataset.duration, 10);
      btn.classList.toggle('active', dur === state.duration);
    });

    DOM.difficultyButtons.forEach(btn => {
      const diff = btn.dataset.difficulty;
      btn.classList.toggle('active', diff === state.difficulty);
    });

    DOM.caseButtons.forEach(btn => {
      const mode = btn.dataset.case;
      btn.classList.toggle('active', mode === state.caseMode);
    });
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    window.storageManager.setTheme(theme);
    if (DOM.themeIcon) {
      DOM.themeIcon.innerHTML = theme === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  function updateSoundButtonUi() {
    const isEnabled = window.soundController.soundEnabled;
    if (DOM.soundStatusText) {
      DOM.soundStatusText.textContent = isEnabled ? 'Sound: On' : 'Sound: Off';
    }
    if (DOM.soundIcon) {
      DOM.soundIcon.innerHTML = isEnabled
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    }
    DOM.btnSoundToggle.classList.toggle('muted', !isEnabled);
  }

  function updateBestWpmDisplay() {
    const bestWpm = window.storageManager.getBestWpm();
    if (DOM.statBestWpm) {
      DOM.statBestWpm.textContent = `${bestWpm} WPM`;
    }
  }

  // --- TEXT LOADING & RENDERING ---
  function loadNewText() {
    const excludeId = state.currentTextObj ? state.currentTextObj.id : null;
    const textData = window.getRandomPracticeText(state.difficulty, excludeId);

    if (!textData) return;

    state.currentTextObj = textData;
    state.textCharacters = textData.text.split('');

    // Update badges
    if (DOM.topicBadge) {
      DOM.topicBadge.textContent = textData.topic;
    }
    if (DOM.difficultyBadge) {
      DOM.difficultyBadge.textContent = state.difficulty.toUpperCase();
      DOM.difficultyBadge.className = `badge difficulty-tag diff-${state.difficulty}`;
    }

    renderTextCharacters();
  }

  function renderTextCharacters() {
    DOM.textDisplay.innerHTML = '';
    state.charElements = [];

    const fragment = document.createDocumentFragment();

    state.textCharacters.forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'char untyped';
      span.dataset.index = index;

      if (char === ' ') {
        span.textContent = ' ';
        span.classList.add('char-space');
      } else {
        span.textContent = char;
      }

      state.charElements.push(span);
      fragment.appendChild(span);
    });

    DOM.textDisplay.appendChild(fragment);

    // Position cursor at first char and highlight it
    if (state.charElements.length > 0) {
      state.charElements[0].classList.add('current');
    }
    updateCaretPosition(0);
    updateShiftHint(0);
  }

  function updateShiftHint(charIndex) {
    if (!DOM.shiftKeyHint) return;

    if (charIndex >= 0 && charIndex < state.textCharacters.length) {
      const nextChar = state.textCharacters[charIndex];
      const isLetter = /^[a-zA-Z]$/.test(nextChar);
      const isUpper = isLetter && nextChar === nextChar.toUpperCase();

      if (isUpper && state.caseMode === 'exact') {
        DOM.shiftKeyHint.textContent = `⇧ Shift + ${nextChar}`;
        DOM.shiftKeyHint.style.display = 'inline-flex';
      } else {
        DOM.shiftKeyHint.style.display = 'none';
      }
    } else {
      DOM.shiftKeyHint.style.display = 'none';
    }
  }

  function updateCaretPosition(charIndex) {
    if (!DOM.activeCaret) return;

    if (charIndex >= 0 && charIndex < state.charElements.length) {
      const targetChar = state.charElements[charIndex];
      const containerRect = DOM.practiceContainer.getBoundingClientRect();
      const charRect = targetChar.getBoundingClientRect();

      const left = charRect.left - containerRect.left;
      const top = charRect.top - containerRect.top;
      const height = charRect.height;

      DOM.activeCaret.style.display = 'block';
      DOM.activeCaret.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      DOM.activeCaret.style.height = `${height}px`;

      // Keep active line scrolled into view smoothly
      const scrollOffset = targetChar.offsetTop - DOM.practiceContainer.offsetHeight / 2 + height / 2;
      DOM.practiceContainer.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'smooth'
      });
    } else if (charIndex >= state.charElements.length && state.charElements.length > 0) {
      // Reached the end of text
      const lastChar = state.charElements[state.charElements.length - 1];
      const containerRect = DOM.practiceContainer.getBoundingClientRect();
      const charRect = lastChar.getBoundingClientRect();

      const left = charRect.right - containerRect.left;
      const top = charRect.top - containerRect.top;

      DOM.activeCaret.style.display = 'block';
      DOM.activeCaret.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    } else {
      DOM.activeCaret.style.display = 'none';
    }
  }

  // --- STATS CALCULATION ---
  /**
   * Calculates WPM and Accuracy based on prompt formulas:
   * WPM = (Correct Characters ÷ 5) ÷ Elapsed Time in Minutes
   * Accuracy = (Correct Characters ÷ Total Typed Characters) × 100
   */
  function calculateStats() {
    const elapsedSeconds = state.elapsedSeconds;
    const elapsedMinutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0;

    let wpm = 0;
    if (elapsedMinutes > 0) {
      wpm = Math.round((state.correctCount / 5) / elapsedMinutes);
    }

    let accuracy = 100;
    if (state.totalTypedCount > 0) {
      accuracy = Math.round((state.correctCount / state.totalTypedCount) * 100);
      accuracy = Math.max(0, Math.min(100, accuracy));
    }

    return {
      wpm: Math.max(0, wpm),
      accuracy: accuracy,
      correctChars: state.correctCount,
      incorrectChars: state.incorrectCount,
      totalChars: state.totalTypedCount,
      remainingTime: state.remainingSeconds,
      duration: state.duration
    };
  }

  function updateDashboardUI() {
    const stats = calculateStats();

    // WPM
    DOM.statWpm.textContent = stats.wpm;

    // Accuracy
    DOM.statAccuracy.textContent = `${stats.accuracy}%`;

    // Timer format mm:ss
    const mins = Math.floor(state.remainingSeconds / 60);
    const secs = state.remainingSeconds % 60;
    DOM.statTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Timer danger color when 10 seconds or less
    if (state.remainingSeconds <= 10 && state.status === 'running') {
      DOM.statTimer.parentElement.classList.add('stat-warning');
    } else {
      DOM.statTimer.parentElement.classList.remove('stat-warning');
    }

    // Correct Characters counter
    DOM.statCorrect.textContent = `${stats.correctChars} / ${state.textCharacters.length}`;

    // Progress Bar
    const progressPercent = state.textCharacters.length > 0
      ? Math.min(100, Math.round((state.cursorIndex / state.textCharacters.length) * 100))
      : 0;
    DOM.progressBar.style.width = `${progressPercent}%`;
  }

  // --- TEST LIFECYCLE & TIMER ---
  function startTest() {
    if (state.status === 'running') return; // Prevent double start

    state.status = 'running';
    state.startTime = Date.now();
    state.wpmHistory = [0];

    updateDashboardUI();
    updateControlsUi();

    // Clear any leftover interval before creating a new one
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }

    state.timerInterval = setInterval(() => {
      if (state.status !== 'running') return;

      state.elapsedSeconds += 1;
      state.remainingSeconds = Math.max(0, state.duration - state.elapsedSeconds);

      // Record WPM sample for graph
      const currentStats = calculateStats();
      state.wpmHistory.push(currentStats.wpm);

      updateDashboardUI();

      // Check if timer expired
      if (state.remainingSeconds <= 0) {
        finishTest('time_up');
      }
    }, 1000);
  }

  function pauseTest() {
    if (state.status !== 'running') return;

    state.status = 'paused';
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    DOM.pauseOverlay.classList.add('active');
    updateControlsUi();
  }

  function resumeTest() {
    if (state.status !== 'paused') return;

    DOM.pauseOverlay.classList.remove('active');
    state.status = 'running';
    updateControlsUi();

    state.timerInterval = setInterval(() => {
      if (state.status !== 'running') return;

      state.elapsedSeconds += 1;
      state.remainingSeconds = Math.max(0, state.duration - state.elapsedSeconds);

      const currentStats = calculateStats();
      state.wpmHistory.push(currentStats.wpm);

      updateDashboardUI();

      if (state.remainingSeconds <= 0) {
        finishTest('time_up');
      }
    }, 1000);

    focusInput();
  }

  function finishTest(reason = 'completed') {
    state.status = 'finished';

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    // Play completion chime
    window.soundController.playCompletionSound();

    const finalStats = calculateStats();
    // In case user completed entire text in fewer seconds than duration
    finalStats.actualTime = Math.max(1, state.elapsedSeconds);
    finalStats.difficulty = state.difficulty;
    finalStats.duration = state.duration;

    // Save to storage
    const { isNewBest } = window.storageManager.saveResult(finalStats);

    // Update Best WPM tag
    updateBestWpmDisplay();

    // Show Results Modal
    showResultsModal(finalStats, isNewBest);
    updateControlsUi();
  }

  function resetTestState(keepText = false) {
    // Clear timer
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    state.status = 'idle';
    state.typedText = '';
    state.cursorIndex = 0;
    state.correctCount = 0;
    state.incorrectCount = 0;
    state.totalTypedCount = 0;
    state.elapsedSeconds = 0;
    state.remainingSeconds = state.duration;
    state.startTime = null;
    state.wpmHistory = [];

    // Reset UI
    DOM.hiddenInput.value = '';
    DOM.pauseOverlay.classList.remove('active');
    closeResultsModal();

    if (!keepText) {
      loadNewText();
    } else {
      // Reset character element classes
      state.charElements.forEach((span, idx) => {
        span.className = 'char untyped' + (span.textContent === ' ' ? ' char-space' : '');
        if (idx === 0) span.classList.add('current');
      });
      updateCaretPosition(0);
      updateShiftHint(0);
    }

    updateDashboardUI();
    updateControlsUi();
  }

  function updateControlsUi() {
    if (DOM.btnPause) {
      if (state.status === 'running') {
        DOM.btnPause.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
        DOM.btnPause.disabled = false;
      } else if (state.status === 'paused') {
        DOM.btnPause.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume';
        DOM.btnPause.disabled = false;
      } else {
        DOM.btnPause.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
        DOM.btnPause.disabled = true;
      }
    }

    if (DOM.btnStart) {
      DOM.btnStart.textContent = state.status === 'running' ? 'Typing...' : 'Start Test';
      DOM.btnStart.disabled = state.status === 'running';
    }
  }

  // --- TYPING INTERACTION & CARET ---
  function handleInput(event) {
    if (state.status === 'finished' || state.status === 'paused') {
      return;
    }

    const value = DOM.hiddenInput.value;

    // Auto-start on first keystroke
    if (state.status === 'idle' && value.length > 0) {
      startTest();
    }

    processTyping(value);
  }

  function processTyping(inputVal) {
    const inputChars = inputVal.split('');
    const targetChars = state.textCharacters;
    const len = inputChars.length;

    // Reset metrics to recount cleanly from input
    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < targetChars.length; i++) {
      const span = state.charElements[i];
      if (!span) continue;

      const isSpace = targetChars[i] === ' ';
      const spaceClass = isSpace ? ' char-space' : '';

      if (i < len) {
        const isMatch = state.caseMode === 'ignore'
          ? inputChars[i].toLowerCase() === targetChars[i].toLowerCase()
          : inputChars[i] === targetChars[i];

        if (isMatch) {
          span.className = `char correct${spaceClass}`;
          correct++;
        } else {
          span.className = `char incorrect${spaceClass}`;
          incorrect++;
        }
      } else if (i === len) {
        // Highlight the next character the user needs to type!
        span.className = `char untyped current${spaceClass}`;
      } else {
        span.className = `char untyped${spaceClass}`;
      }
    }

    // Play sound feedback for the newly typed or deleted key
    const prevLen = state.typedText.length;
    if (len > prevLen) {
      // Key added
      const lastTyped = inputChars[len - 1];
      const expectedChar = targetChars[len - 1];

      state.totalTypedCount += 1;

      const isMatch = state.caseMode === 'ignore'
        ? lastTyped.toLowerCase() === expectedChar.toLowerCase()
        : lastTyped === expectedChar;

      if (isMatch) {
        if (lastTyped === ' ') {
          window.soundController.playKeySound('space');
        } else {
          window.soundController.playKeySound('key');
        }
      } else {
        window.soundController.playErrorSound();

        // Helpful tip if error is solely due to capital/lowercase mismatch
        if (state.caseMode === 'exact' && lastTyped.toLowerCase() === expectedChar.toLowerCase()) {
          const isUpper = expectedChar === expectedChar.toUpperCase() && expectedChar !== expectedChar.toLowerCase();
          if (isUpper) {
            showToast(`💡 Notice: Capital '${expectedChar}' requires holding Shift! (Or switch to 'Ignore' case above)`);
          } else {
            showToast(`💡 Notice: Lowercase '${expectedChar}' expected.`);
          }
        }
      }
    } else if (len < prevLen) {
      // Backspace used
      window.soundController.playKeySound('backspace');
    }

    state.typedText = inputVal;
    state.cursorIndex = len;
    state.correctCount = correct;
    state.incorrectCount = incorrect;

    // Update caret position & shift hint for next character
    updateCaretPosition(state.cursorIndex);
    updateShiftHint(state.cursorIndex);

    // Update real-time stats
    updateDashboardUI();

    // Check if user completed the entire text
    if (len >= targetChars.length) {
      finishTest('completed');
    }
  }

  function focusInput() {
    DOM.hiddenInput.focus();
    if (DOM.focusOverlay) {
      DOM.focusOverlay.classList.add('hidden');
    }
    DOM.practiceContainer.classList.add('focused');
  }

  function blurInput() {
    if (state.status !== 'running') {
      if (DOM.focusOverlay) {
        DOM.focusOverlay.classList.remove('hidden');
      }
    }
    DOM.practiceContainer.classList.remove('focused');
  }

  // --- RESULTS SCREEN MODAL ---
  function getTierAndMessage(wpm, accuracy) {
    let tier = { title: 'Typing Novice', badge: '🌱 Novice', color: '#94a3b8' };
    let msg = 'Keep practicing daily! Speed comes naturally once accuracy becomes second nature.';

    if (wpm >= 110) {
      tier = { title: 'Typing Legend', badge: '🏆 Legend', color: '#eab308' };
      msg = 'Sensational mastery! Your speed rivals professional stenographers and top-tier esports typists.';
    } else if (wpm >= 85) {
      tier = { title: 'Rocket Typist', badge: '🚀 Rocket', color: '#8b5cf6' };
      msg = 'Incredible velocity! Your fingers glide effortlessly across the keyboard with blazing fluidity.';
    } else if (wpm >= 65) {
      tier = { title: 'Speed Demon', badge: '⚡ Pro Sprinter', color: '#3b82f6' };
      msg = 'Excellent rhythm! You are significantly faster than the global average typist (40 WPM).';
    } else if (wpm >= 45) {
      tier = { title: 'Swift Typist', badge: '🏃 Swift', color: '#10b981' };
      msg = 'Solid performance! Fine-tune your accuracy and you will break through the 60+ WPM barrier in no time.';
    } else if (wpm >= 25) {
      tier = { title: 'Steady Walker', badge: '🚶 Steady', color: '#06b6d4' };
      msg = 'Great effort! Focus on keeping your eyes on the screen and trusting your home row finger muscle memory.';
    }

    if (accuracy < 85 && wpm > 30) {
      msg = 'Impressive raw speed! Slow down slightly to push accuracy above 95% for maximum efficiency.';
    }

    return { tier, msg };
  }

  function showResultsModal(stats, isNewBest) {
    const { tier, msg } = getTierAndMessage(stats.wpm, stats.accuracy);

    DOM.modalWpm.textContent = stats.wpm;
    DOM.modalAccuracy.textContent = `${stats.accuracy}%`;
    DOM.modalTotalChars.textContent = stats.totalChars;
    DOM.modalCorrectChars.textContent = stats.correctChars;
    DOM.modalIncorrectChars.textContent = stats.incorrectChars;
    DOM.modalDuration.textContent = `${stats.actualTime || stats.duration}s`;

    DOM.modalTierBadge.textContent = tier.badge;
    DOM.modalTierBadge.style.borderColor = tier.color;
    DOM.modalTierBadge.style.color = tier.color;

    DOM.modalMessage.textContent = msg;

    if (DOM.modalNewBestTag) {
      DOM.modalNewBestTag.style.display = isNewBest ? 'inline-flex' : 'none';
    }

    // Render WPM progression sparkline chart
    renderWpmChart(state.wpmHistory, stats.wpm);

    DOM.resultsModal.classList.add('active');
    DOM.resultsModal.setAttribute('aria-hidden', 'false');
  }

  function closeResultsModal() {
    DOM.resultsModal.classList.remove('active');
    DOM.resultsModal.setAttribute('aria-hidden', 'true');
  }

  function renderWpmChart(dataPoints, finalWpm) {
    if (!DOM.chartContainer) return;

    if (!dataPoints || dataPoints.length < 2) {
      DOM.chartContainer.innerHTML = '<div class="chart-placeholder">Speed maintained steadily throughout test.</div>';
      return;
    }

    const width = 480;
    const height = 120;
    const padding = 20;

    const maxVal = Math.max(finalWpm + 10, ...dataPoints, 20);
    const minVal = 0;

    const points = dataPoints.map((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
      return { x, y, val };
    });

    const pathD = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    // Area fill
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" class="wpm-svg-chart">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-blue)" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="var(--accent-blue)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Horizontal guide lines -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-subtle)" stroke-width="1"/>
        <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="3,3"/>
        
        <!-- Area -->
        <path d="${areaD}" fill="url(#chartGradient)"/>
        <!-- Line -->
        <path d="${pathD}" fill="none" stroke="var(--accent-blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Peak point dot -->
        <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="4" fill="var(--accent-purple)" stroke="#fff" stroke-width="1.5"/>
      </svg>
    `;

    DOM.chartContainer.innerHTML = svg;
  }

  // --- SHARE RESULT ---
  function shareResult() {
    const stats = calculateStats();
    const shareText = `⚡ TypeSprint Practice Result:\n🚀 Speed: ${stats.wpm} WPM\n🎯 Accuracy: ${stats.accuracy}%\n⏱️ Duration: ${stats.duration}s (${state.difficulty})\n👉 Test your typing speed with TypeSprint!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => showToast('Score copied to clipboard! 📋'))
        .catch(() => showToast('Failed to copy. Please try again!'));
    } else {
      showToast('Score: ' + stats.wpm + ' WPM | ' + stats.accuracy + '% Accuracy');
    }
  }

  function showToast(message) {
    if (!DOM.toastNotification) return;
    DOM.toastNotification.textContent = message;
    DOM.toastNotification.classList.add('visible');
    setTimeout(() => {
      DOM.toastNotification.classList.remove('visible');
    }, 3200);
  }

  // --- INSTRUCTIONS & HISTORY MODALS ---
  function openInstructionsModal() {
    DOM.instructionsModal.classList.add('active');
    DOM.instructionsModal.setAttribute('aria-hidden', 'false');
  }

  function closeInstructionsModal() {
    DOM.instructionsModal.classList.remove('active');
    DOM.instructionsModal.setAttribute('aria-hidden', 'true');
  }

  function openHistoryModal() {
    renderHistoryTable();
    DOM.historyModal.classList.add('active');
    DOM.historyModal.setAttribute('aria-hidden', 'false');
  }

  function closeHistoryModal() {
    DOM.historyModal.classList.remove('active');
    DOM.historyModal.setAttribute('aria-hidden', 'true');
  }

  function renderHistoryTable() {
    const history = window.storageManager.getHistory();
    if (!DOM.historyList) return;

    if (!history || history.length === 0) {
      DOM.historyList.innerHTML = '';
      if (DOM.historyEmptyState) DOM.historyEmptyState.style.display = 'block';
      return;
    }

    if (DOM.historyEmptyState) DOM.historyEmptyState.style.display = 'none';

    DOM.historyList.innerHTML = history.map(item => `
      <tr>
        <td>${item.date}</td>
        <td><strong>${item.wpm}</strong> WPM</td>
        <td>${item.accuracy}%</td>
        <td><span class="badge badge-diff diff-${item.difficulty}">${item.difficulty}</span></td>
        <td>${item.duration}s</td>
      </tr>
    `).join('');
  }

  function clearHistoryData() {
    if (confirm('Are you sure you want to clear your typing test history and best WPM?')) {
      window.storageManager.clearHistory();
      renderHistoryTable();
      updateBestWpmDisplay();
      showToast('Test history cleared!');
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // 1. Practice area click & input focus
    DOM.practiceContainer.addEventListener('click', () => {
      focusInput();
    });

    if (DOM.focusOverlay) {
      DOM.focusOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        focusInput();
      });
    }

    DOM.hiddenInput.addEventListener('input', handleInput);
    DOM.hiddenInput.addEventListener('focus', focusInput);
    DOM.hiddenInput.addEventListener('blur', blurInput);

    // Prevent pasting to ensure authentic typing practice
    DOM.hiddenInput.addEventListener('paste', (e) => {
      e.preventDefault();
      showToast('⚠️ Pasting is disabled for honest practice! 😉');
      window.soundController.playErrorSound();
    });

    // 2. Global Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't intercept if an interactive modal button is being navigated with tab/enter
      if (DOM.resultsModal.classList.contains('active')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          resetTestState(false);
          focusInput();
        } else if (e.key === 'Escape') {
          closeResultsModal();
        }
        return;
      }

      if (DOM.instructionsModal.classList.contains('active') || DOM.historyModal.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeInstructionsModal();
          closeHistoryModal();
        }
        return;
      }

      // Quick restart shortcut: Escape or Alt+R or Tab (when not in a form element)
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTestState(false);
        focusInput();
        showToast('Test restarted! 🔄');
        return;
      }

      // Quick Pause / Resume with Alt + P or Pause key
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (state.status === 'running') {
          pauseTest();
        } else if (state.status === 'paused') {
          resumeTest();
        }
        return;
      }

      // Space to resume when paused
      if (state.status === 'paused' && e.code === 'Space') {
        e.preventDefault();
        resumeTest();
        return;
      }

      // If user presses any standard typing key while not focused on input, autofocus
      if (
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        e.key.length === 1 &&
        document.activeElement !== DOM.hiddenInput
      ) {
        focusInput();
      }
    });

    // 3. Primary Buttons
    DOM.btnStart.addEventListener('click', () => {
      if (state.status === 'idle') {
        focusInput();
        startTest();
      }
    });

    DOM.btnRestart.addEventListener('click', () => {
      resetTestState(true);
      focusInput();
    });

    DOM.btnNewText.addEventListener('click', () => {
      resetTestState(false);
      focusInput();
    });

    DOM.btnPause.addEventListener('click', () => {
      if (state.status === 'running') {
        pauseTest();
      } else if (state.status === 'paused') {
        resumeTest();
      }
    });

    DOM.btnResume.addEventListener('click', () => {
      resumeTest();
    });

    // 4. Duration Pill Buttons
    DOM.durationButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const dur = parseInt(btn.dataset.duration, 10);
        state.duration = dur;
        state.remainingSeconds = dur;
        window.storageManager.savePreferences({ duration: dur });
        updatePillsUi();
        resetTestState(true);
        focusInput();
      });
    });

    // 5. Difficulty Pill Buttons
    DOM.difficultyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = btn.dataset.difficulty;
        state.difficulty = diff;
        window.storageManager.savePreferences({ difficulty: diff });
        updatePillsUi();
        resetTestState(false);
        focusInput();
      });
    });

    // 6. Case Mode Pill Buttons (Exact vs Ignore)
    DOM.caseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.case;
        state.caseMode = mode;
        window.storageManager.savePreferences({ caseMode: mode });
        updatePillsUi();
        updateShiftHint(state.cursorIndex);
        if (state.status === 'idle') {
          resetTestState(true);
        } else {
          // Live re-process currently typed characters with updated casing rule
          processTyping(DOM.hiddenInput.value);
        }
        focusInput();
        showToast(mode === 'ignore' ? '🔤 Case-insensitive mode: p and P both accepted!' : '🔤 Exact Case mode: Shift required for capital letters.');
      });
    });

    // Caps Lock indicator listener
    function handleCapsLock(e) {
      if (e && e.getModifierState && DOM.capsLockWarning) {
        const capsOn = e.getModifierState('CapsLock');
        DOM.capsLockWarning.style.display = capsOn ? 'inline-flex' : 'none';
      }
    }
    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    // 7. Sound & Theme Toggles
    DOM.btnSoundToggle.addEventListener('click', () => {
      window.soundController.toggleSound();
      updateSoundButtonUi();
      showToast(window.soundController.soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted');
    });

    DOM.btnThemeToggle.addEventListener('click', () => {
      toggleTheme();
    });

    // 7. Modals
    DOM.btnHelp.addEventListener('click', openInstructionsModal);
    DOM.btnCloseInstructions.addEventListener('click', closeInstructionsModal);

    DOM.btnHistory.addEventListener('click', openHistoryModal);
    DOM.btnCloseHistory.addEventListener('click', closeHistoryModal);
    DOM.btnClearHistory.addEventListener('click', clearHistoryData);

    // Modal background click closes
    [DOM.resultsModal, DOM.instructionsModal, DOM.historyModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal === DOM.resultsModal) closeResultsModal();
          if (modal === DOM.instructionsModal) closeInstructionsModal();
          if (modal === DOM.historyModal) closeHistoryModal();
        }
      });
    });

    // Results Actions
    DOM.btnTryAgain.addEventListener('click', () => {
      resetTestState(true);
      focusInput();
    });

    DOM.btnNextTest.addEventListener('click', () => {
      resetTestState(false);
      focusInput();
    });

    DOM.btnShareResult.addEventListener('click', shareResult);
    DOM.btnCloseResult.addEventListener('click', closeResultsModal);

    // Handle window resize for caret repositioning
    window.addEventListener('resize', () => {
      updateCaretPosition(state.cursorIndex);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
