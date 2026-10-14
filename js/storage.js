/**
 * TypeSprint - Local Storage Manager
 * Stores personal bests, historical test results, and user settings.
 */

class StorageManager {
  constructor() {
    this.KEYS = {
      BEST_WPM: 'typesprint_best_wpm',
      HISTORY: 'typesprint_history',
      THEME: 'typesprint_theme',
      DIFFICULTY: 'typesprint_difficulty',
      DURATION: 'typesprint_duration',
      CASE_MODE: 'typesprint_case_mode',
      STATS: 'typesprint_cumulative_stats'
    };
  }

  getBestWpm() {
    try {
      const best = localStorage.getItem(this.KEYS.BEST_WPM);
      return best ? parseInt(best, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  saveBestWpm(wpm) {
    try {
      const currentBest = this.getBestWpm();
      if (wpm > currentBest) {
        localStorage.setItem(this.KEYS.BEST_WPM, wpm.toString());
        return true; // New record!
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  getHistory() {
    try {
      const raw = localStorage.getItem(this.KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveResult(result) {
    try {
      const history = this.getHistory();
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        wpm: result.wpm,
        accuracy: result.accuracy,
        duration: result.duration,
        difficulty: result.difficulty,
        correctChars: result.correctChars,
        incorrectChars: result.incorrectChars,
        totalChars: result.totalChars
      };

      // Keep up to 30 most recent entries
      history.unshift(entry);
      if (history.length > 30) {
        history.pop();
      }
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));

      // Update best WPM
      const isNewBest = this.saveBestWpm(result.wpm);

      // Update cumulative stats
      this.updateCumulativeStats(result);

      return { entry, isNewBest };
    } catch (e) {
      console.warn('Could not save result to history:', e);
      return { entry: result, isNewBest: false };
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(this.KEYS.HISTORY);
      localStorage.removeItem(this.KEYS.BEST_WPM);
      localStorage.removeItem(this.KEYS.STATS);
      return true;
    } catch (e) {
      return false;
    }
  }

  getCumulativeStats() {
    try {
      const raw = localStorage.getItem(this.KEYS.STATS);
      return raw ? JSON.parse(raw) : { testsCompleted: 0, totalCharsTyped: 0, totalSeconds: 0 };
    } catch (e) {
      return { testsCompleted: 0, totalCharsTyped: 0, totalSeconds: 0 };
    }
  }

  updateCumulativeStats(result) {
    try {
      const stats = this.getCumulativeStats();
      stats.testsCompleted = (stats.testsCompleted || 0) + 1;
      stats.totalCharsTyped = (stats.totalCharsTyped || 0) + (result.totalChars || 0);
      stats.totalSeconds = (stats.totalSeconds || 0) + (result.duration || 0);
      localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to update stats:', e);
    }
  }

  getTheme() {
    try {
      return localStorage.getItem(this.KEYS.THEME) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  setTheme(theme) {
    try {
      localStorage.setItem(this.KEYS.THEME, theme);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  }

  getPreferences() {
    try {
      return {
        difficulty: localStorage.getItem(this.KEYS.DIFFICULTY) || 'intermediate',
        duration: parseInt(localStorage.getItem(this.KEYS.DURATION) || '60', 10),
        caseMode: localStorage.getItem(this.KEYS.CASE_MODE) || 'exact'
      };
    } catch (e) {
      return { difficulty: 'intermediate', duration: 60, caseMode: 'exact' };
    }
  }

  savePreferences(prefs) {
    try {
      if (prefs.difficulty) localStorage.setItem(this.KEYS.DIFFICULTY, prefs.difficulty);
      if (prefs.duration) localStorage.setItem(this.KEYS.DURATION, prefs.duration.toString());
      if (prefs.caseMode) localStorage.setItem(this.KEYS.CASE_MODE, prefs.caseMode);
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }
}

window.storageManager = new StorageManager();
