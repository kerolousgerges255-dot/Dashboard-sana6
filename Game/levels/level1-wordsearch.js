/* ============================================================
   Level 1: Word Search (Primary)
   Based on PDF page 7
   ============================================================ */

const WordSearchGame = (() => {
  const WORDS = ['ميخائيل', 'ملك', 'سماء', 'صلاة', 'نور', 'جناح', 'حماية', 'شفاعة'];

  // Arabic letter grid (simplified word search)
  const GRID = [
    ['م', 'ي', 'خ', 'ا', 'ئ', 'ي', 'ل', 'س', 'م', 'ا'],
    ['ء', 'ش', 'ف', 'ا', 'ع', 'ة', 'ح', 'م', 'ا', 'ي'],
    ['ت', 'ر', 'ج', 'و', 'م', 'د', 'ش', 'س', 'ه', 'ج'],
    ['ا', 'ك', 'ت', 'ن', 'ي', 'ح', 'ض', 'ش', 'ع', 'ذ'],
    ['ة', 'ج', 'ا', 'خ', 'و', 'ص', 'ح', 'م', 'ا', 'ي'],
    ['ح', 'ا', 'ص', 'ي', 'ع', 'ذ', 'ل', 'ص', 'س', 'ك'],
    ['ء', 'ل', 'ة', 'ش', 'ء', 'د', 'ج', 'ت', 'ح', 'ي'],
    ['ج', 'د', 'س', 'م', 'ا', 'ء', 'ك', 'ل', 'ة', 'د'],
    ['ر', 'ج', 'و', 'م', 'د', 'ش', 'ف', 'ا', 'ع', 'ة'],
    ['ن', 'و', 'ر', 'ج', 'ن', 'ا', 'ح', 'م', 'ح', 'م']
  ];

  let selectedCells = new Set();
  let foundWords = new Set();
  let score = 0;

  function init() {
    renderGrid();
    renderWordList();
  }

  function renderGrid() {
    const gridEl = document.getElementById('word-search-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${GRID[0].length}, 1fr)`;

    GRID.forEach((row, rowIndex) => {
      row.forEach((letter, colIndex) => {
        const cell = document.createElement('div');
        cell.className = 'ws-cell';
        cell.textContent = letter;
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        cell.addEventListener('click', () => toggleCell(cell));
        gridEl.appendChild(cell);
      });
    });
  }

  function renderWordList() {
    const wordList = document.getElementById('word-list');
    if (!wordList) return;

    wordList.innerHTML = WORDS.map(word => `
      <span class="word-item ${foundWords.has(word) ? 'found' : ''}" data-word="${word}">
        ${word}
      </span>
    `).join('');
  }

  function toggleCell(cell) {
    const key = `${cell.dataset.row}-${cell.dataset.col}`;

    if (selectedCells.has(key)) {
      selectedCells.delete(key);
      cell.classList.remove('selected');
    } else {
      selectedCells.add(key);
      cell.classList.add('selected');
    }

    checkSelection();
  }

  function checkSelection() {
    const selectedWords = getSelectedWord();

    if (selectedWords && !foundWords.has(selectedWords)) {
      foundWords.add(selectedWords);
      score += 10;
      Game.addScore(10);
      renderWordList();
      flashSuccess();

      if (foundWords.size === WORDS.length) {
        setTimeout(() => {
          Game.showModal('⭐', 'أحسنت!', `عثرّت على جميع الكلمات! نتيجتك: ${score} نقطة`);
        }, 500);
      }
    }
  }

  function getSelectedWord() {
    if (selectedCells.size === 0) return null;

    const cells = Array.from(selectedCells).map(k => {
      const [r, c] = k.split('-').map(Number);
      return { r, c, letter: GRID[r][c] };
    });

    // Simple check: see if selected cells form any of our words
    const word = cells.map(c => c.letter).join('');
    const reversedWord = word.split('').reverse().join('');

    return WORDS.find(w => w === word || w === reversedWord) || null;
  }

  function flashSuccess() {
    const cells = Array.from(selectedCells);
    cells.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      const cell = document.querySelector(`.ws-cell[data-row="${r}"][data-col="${c}"]`);
      if (cell) {
        cell.classList.add('success');
        setTimeout(() => cell.classList.remove('success'), 1000);
      }
    });
  }

  function reset() {
    selectedCells.clear();
    foundWords.clear();
    score = 0;
    renderGrid();
    renderWordList();
  }

  return { init, reset, score };
})();

// Initialize when level is shown
const level1Observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.target.id === 'level-0' && mutation.target.classList.contains('active')) {
      WordSearchGame.init();
    }
  }
});

document.querySelectorAll('.screen').forEach(screen => {
  level1Observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});