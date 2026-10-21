/* ============================================================
   Level 2: Verse Memory (Nursery/Primary)
   Based on PDF pages 1-2
   Verse: Psalm 34:7
   ============================================================ */

const VerseMemoryGame = (() => {
  const VERSE = {
    text: 'الرب يقاتل عنكم وأنتم تصمتون',
    ref: 'خروج 14 : 14',
    fullVerse: 'إِنَّ مَلَك الرَّبّ يَحُوطُ حَوْلَ الْمُخَافِينَ إيَّاهُ وَيُنَجِّيهِمْ'
  };

  const WORD_BANK = ['الرب', 'يقاتل', 'عنكم', 'وأنتم', 'تصمتون'];
  const BLANK_POSITIONS = [1, 2]; // Words that are blanked out

  let score = 0;
  let correctAnswers = 0;

  function init() {
    renderVerse();
    renderWordBank();
    setupDragDrop();
  }

  function renderVerse() {
    const verseContainer = document.getElementById('verse-container');
    if (!verseContainer) return;

    verseContainer.innerHTML = WORD_BANK.map((word, idx) => {
      if (BLANK_POSITIONS.includes(idx)) {
        return `<span class="blank-slot" data-index="${idx}" data-word="${word}">___</span>`;
      }
      return `<span class="verse-word">${word}</span>`;
    }).join(' ') + `<p class="verse-ref">${VERSE.ref}</p>`;
  }

  function renderWordBank() {
    const bank = document.getElementById('word-bank');
    if (!bank) return;

    const shuffledWords = [...WORD_BANK].sort(() => Math.random() - 0.5);
    bank.innerHTML = shuffledWords.map(word => `
      <button class="word-chip" data-word="${word}" draggable="true">
        ${word}
      </button>
    `).join('');

    setupChipDraggables();
  }

  function setupDragDrop() {
    let draggedWord = null;

    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        draggedWord = chip.dataset.word;
        chip.classList.add('dragging');
        e.dataTransfer.setData('text/plain', draggedWord);
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });
    });

    document.querySelectorAll('.blank-slot').forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('over');
      });
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('over');
      });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('over');
        const word = e.dataTransfer.getData('text/plain');
        placeWord(slot, word);
      });
      // Also allow click for mobile
      slot.addEventListener('click', () => {
        slot.classList.toggle('selected');
      });
    });
  }

  function setupChipDraggables() {
    // For mobile touch support
    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const parent = chip.parentElement;
        const emptySlots = document.querySelectorAll('.blank-slot:not(.filled)');

        if (emptySlots.length > 0) {
          const targetSlot = emptySlots[0];
          placeWord(targetSlot, chip.dataset.word);
          chip.style.display = 'none';
        }
      });
    });
  }

  function placeWord(slot, word) {
    if (slot.classList.contains('filled')) return;

    slot.textContent = word;
    slot.dataset.answer = word;
    slot.classList.add('filled');

    // Check if correct
    if (word === slot.dataset.word) {
      slot.classList.add('correct');
      correctAnswers++;
      score += 10;
      Game.addScore(10);

      if (correctAnswers >= BLANK_POSITIONS.length) {
        setTimeout(() => {
          Game.showModal('⭐', 'ممتاز!', `أكملت الآية المقدسة! نتيجتك: ${score} نقطة`);
        }, 500);
      }
    } else {
      slot.classList.add('wrong');
      setTimeout(() => {
        slot.textContent = '___';
        slot.classList.remove('wrong', 'filled');
      }, 1000);
    }
  }

  function reset() {
    score = 0;
    correctAnswers = 0;
    renderVerse();
    renderWordBank();
  }

  return { init, reset, score };
})();

// Initialize when level is shown
const level2Observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.target.id === 'level-1' && mutation.target.classList.contains('active')) {
      VerseMemoryGame.init();
    }
  }
});

document.querySelectorAll('.screen').forEach(screen => {
  level2Observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});