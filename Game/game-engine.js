/* ============================================================
   Game Engine - State Management & Navigation
   ============================================================ */

const Game = (() => {
  // Game state
  const state = {
    currentLevel: 0,
    totalLevels: 5,
    playerName: '',
    playerClass: '',
    score: 0,
    answers: [],
    levelResults: []
  };

  // LocalStorage keys
  const STORAGE_KEY = 'michaelGame';

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    loadState();
    setupEventListeners();
    showScreen('intro-screen');
    updateProgress();
    setupParallax();
  }

  // ============================================================
  // State Management
  // ============================================================
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
    } catch (e) {
      console.warn('Could not load saved state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }

  function resetState() {
    state.currentLevel = 0;
    state.playerName = '';
    state.playerClass = '';
    state.score = 0;
    state.answers = [];
    state.levelResults = [];
    saveState();
  }

  // ============================================================
  // Screen Navigation
  // ============================================================
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }
  }

  function nextLevel() {
    if (state.currentLevel < state.totalLevels - 1) {
      state.currentLevel++;
      state.answers.push({
        level: state.currentLevel,
        score: getLevelScore()
      });
      saveState();
      updateProgress();
      showScreen(`level-${state.currentLevel}`);
    } else {
      showVictory();
    }
  }

  function goToLevel(levelIndex) {
    state.currentLevel = levelIndex;
    saveState();
    updateProgress();
    showScreen(`level-${levelIndex}`);
  }

  function setPlayerName(name) {
    state.playerName = name.trim();
  }

  function setPlayerClass(cls) {
    state.playerClass = cls.trim();
  }

  // ============================================================
  // Score Tracking
  // ============================================================
  function getLevelScore() {
    return state.levelResults[state.currentLevel] || 0;
  }

  function addScore(points) {
    state.score += points;
    const current = state.levelResults[state.currentLevel] || 0;
    state.levelResults[state.currentLevel] = current + points;
    saveState();
    updateProgress();
  }

  function updateProgress() {
    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
      const pct = ((state.currentLevel + 1) / state.totalLevels) * 100;
      progressBar.style.width = `${pct}%`;
    }
    const levelDots = document.querySelectorAll('.level-dot');
    levelDots.forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i === state.currentLevel) {
        dot.classList.add('active');
      } else if (i < state.currentLevel) {
        dot.classList.add('completed');
      }
    });
  }

  // ============================================================
  // Leaderboard
  // ============================================================
  async function submitToLeaderboard() {
    if (!state.playerName) {
      showModal('⚠️', 'اسمك مفقود', 'من فضلك أدخل اسمك عشان تتسجل في لوحة الشرف');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإرسال...';

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby_d6jgohIuj71p9Py-h4xckn2I58JKbnMADoyysmXc8pdaW-B80L_YBTh2RyIXK0L7/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.playerName,
          class: state.playerClass,
          date: new Date().toLocaleDateString('ar-EG'),
          score: state.score,
          levelsCompleted: state.totalLevels,
          game: 'michael'
        })
      });

      showModal(
        '🎉',
        'مبروك! تم تسجيلك',
        `شكراً ${state.playerName}! سجلنا نتيجتك (${state.score} نقطة). ربنا يقويك ويبارك لك في دراستك وخدمتك. 🙏`
      );
    } catch (error) {
      // Fallback to localStorage
      try {
        const scores = JSON.parse(localStorage.getItem('michaelLeaderboard') || '[]');
        scores.push({
          name: state.playerName,
          class: state.playerClass,
          date: new Date().toLocaleDateString('ar-EG'),
          score: state.score,
          timestamp: Date.now()
        });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('michaelLeaderboard', JSON.stringify(scores.slice(0, 50)));

        showModal(
          '🎉',
          'مبروك! تم تسجيلك',
          `شكراً ${state.playerName}! سجلنا نتيجتك (${state.score} نقطة). ربنا يقويك ويبارك لك في دراستك وخدمتك. 🙏`
        );
      } catch (e) {
        showModal(
          '✅',
          'انتهى اللعب!',
          `أنهيت جميع المراحل بنجاح! نتيجتك: ${state.score} نقطة. سيتم حفظ نتيجتك محلياُ.`
        );
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'تسجيل النتيجة';
    }
  }

  // ============================================================
  // UI Helpers
  // ============================================================
  function showModal(icon, title, message, showClose = true) {
    const modal = document.getElementById('modal-overlay');
    if (!modal) return;

    modal.querySelector('.modal-icon').textContent = icon;
    modal.querySelector('h3').textContent = title;
    modal.querySelector('p').textContent = message;

    const closeBtn = modal.querySelector('button');
    if (showClose) {
      closeBtn.style.display = 'inline-flex';
    } else {
      closeBtn.style.display = 'none';
    }

    modal.classList.add('open');
  }

  function hideModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ============================================================
  // Event Listeners
  // ============================================================
  function setupEventListeners() {
    // Modal close
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', hideModal);
    }
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) hideModal();
      });
    }

    // Player info forms
    const nameForm = document.getElementById('player-name-form');
    if (nameForm) {
      nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('player-name');
        const classInput = document.getElementById('player-class');
        if (nameInput && nameInput.value.trim()) {
          setPlayerName(nameInput.value);
          setPlayerClass(classInput ? classInput.value : '');
          saveState();
          showScreen('level-0');
        }
      });
    }

    // Level navigation buttons
    document.querySelectorAll('.btn-next-level').forEach(btn => {
      btn.addEventListener('click', () => nextLevel());
    });

    // Submit to leaderboard
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', submitToLeaderboard);
    }

    // Review answers button
    const reviewBtn = document.getElementById('review-answers');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => {
        showScreen('review-screen');
      });
    }
  }

  // ============================================================
  // Parallax Effect
  // ============================================================
  function setupParallax() {
    const sky = document.querySelector('.scroll-sky');
    if (!sky) return;

    let ticking = false;
    const updateSky = () => {
      const y = Math.min(window.scrollY || 0, 1400);
      sky.style.setProperty('--sky-y', `${-y * 0.075}px`);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateSky);
        ticking = true;
      }
    }, { passive: true });

    updateSky();
  }

  // ============================================================
  // Public API
  // ============================================================
  return {
    init,
    state,
    showScreen,
    nextLevel,
    goToLevel,
    setPlayerName,
    setPlayerClass,
    addScore,
    submitToLeaderboard,
    showModal,
    hideModal,
    escapeHtml
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Game.init);