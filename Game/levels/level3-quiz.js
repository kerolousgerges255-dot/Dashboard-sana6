/* ============================================================
   Level 3: Bible Quiz (Middle School)
   Based on PDF page 3
   Questions about Michael's actions in Scripture
   ============================================================ */

const BibleQuizGame = (() => {
  const QUESTIONS = [
    {
      id: 1,
      question: 'ما الذي فعله الملاك ميخائيل في دانيال 12:1؟',
      options: ['حارب التنين', 'وقف لحماية شعب الله', 'كتب الوصايا العشر', 'بنى الهيكل'],
      correct: 1,
      explanation: 'ميخائيل هو الأمير العظيم الذي يقوم من أجل أبناء شعبك (دانيال 12:1)'
    },
    {
      id: 2,
      question: 'ماذا قال ميخائيل للشيطان في يهوذا 9؟',
      options: ['اذهب يا شيطان!', 'ليحكم الرب عليك', 'أنت عدو الله', 'توبة فوراً'],
      correct: 1,
      explanation: 'يقول: لِيَحْكُمِ الرَّبُّ عَلَيْكَ (يهوذا 1:9)'
    },
    {
      id: 3,
      question: 'ماذا حدث في رؤيا 12:7؟',
      options: ['حارب ميخائيل والتنين معاً', 'حارب ميخائيل والتنين وملائكته', 'تفرق الملائكة', 'نزل النور'],
      correct: 1,
      explanation: 'وقعت حرب في السماء: ميخائيل وحملته حاربوا التنين (رؤيا 12:7)'
    },
    {
      id: 4,
      question: 'ما معنى اسم ميخائيل؟',
      options: ['قوة الله', 'من مثل الله', 'نور السماء', 'حامي العالم'],
      correct: 1,
      explanation: 'ميخائيل معناها "مَنْ مِثْلُ اللهِ؟" أو "من مثل الله"'
    },
    {
      id: 5,
      question: 'في أي يوم تحتفل الكنيسة القبطية بتذكار ميخائيل؟',
      options: ['7 من كل شهر', '12 من كل شهر', '29 من كل شهر', '1 من كل شهر'],
      correct: 1,
      explanation: 'الكنيسة القبطية تحتفل بتذكار الملاك ميخائيل في 12 من كل شهر قبطي'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answers = [];

  function init() {
    renderQuestion();
  }

  function renderQuestion() {
    if (currentQuestion >= QUESTIONS.length) {
      showResults();
      return;
    }

    const q = QUESTIONS[currentQuestion];
    const container = document.getElementById('quiz-container');

    container.innerHTML = `
      <div class="question-header">
        <span class="question-number">السؤال ${currentQuestion + 1} من ${QUESTIONS.length}</span>
        <div class="progress-bar"><div class="progress-fill" style="width: ${(currentQuestion / QUESTIONS.length) * 100}%"></div></div>
      </div>
      <h3 class="question-text">${q.question}</h3>
      <div class="options-grid">
        ${q.options.map((opt, idx) => `
          <button class="option-btn" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(1611 + idx)}</span>
            <span class="option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="explanation-box" class="hidden"></div>
    `;

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });
  }

  function handleAnswer(selectedIndex) {
    const q = QUESTIONS[currentQuestion];
    const isCorrect = selectedIndex === q.correct;

    answers.push({
      question: q.question,
      selected: q.options[selectedIndex],
      correct: q.options[q.correct],
      isCorrect: isCorrect
    });

    if (isCorrect) {
      score += 15;
      Game.addScore(15);
    }

    // Show feedback
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const explanationBox = document.getElementById('explanation-box');
    explanationBox.innerHTML = `
      <div class="explanation ${isCorrect ? 'correct' : 'wrong'}">
        ${isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة'}
        <p>${q.explanation}</p>
      </div>
    `;
    explanationBox.classList.remove('hidden');

    // Move to next question after delay
    setTimeout(() => {
      currentQuestion++;
      renderQuestion();
    }, 2500);
  }

  function showResults() {
    const container = document.getElementById('quiz-container');
    const percentage = Math.round((score / (QUESTIONS.length * 15)) * 100);

    container.innerHTML = `
      <div class="results-card">
        <div class="results-icon">${percentage >= 80 ? '🌟' : percentage >= 60 ? '⭐' : '📖'}</div>
        <h3>النتيجة النهائية</h3>
        <div class="results-score">${score} / ${QUESTIONS.length * 15}</div>
        <div class="results-percentage">${percentage}%</div>
        <p class="results-message">${getMotivationalMessage(percentage)}</p>
        <div class="answers-review">
          <h4>مراجعة الإجابات:</h4>
          ${answers.map((a, i) => `
            <div class="answer-item ${a.isCorrect ? 'correct' : 'wrong'}">
              <span>${i + 1}. ${a.question}</span>
              <span>${a.isCorrect ? '✓' : '✗'}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary btn-next-level mt-16">
        <span class="btn-icon">➡️</span>
        المرحلة التالية
      </button>
    `;
  }

  function getMotivationalMessage(percentage) {
    if (percentage === 100) return 'مثالي! أنت مثال للملاك ميخائيل 💪';
    if (percentage >= 80) return 'أحسنت! معرفتك بالكتاب المقدس ممتازة!';
    if (percentage >= 60) return 'جيد جداً! واصل دراسة كلمة الله.';
    return 'جربت! اقرأ المزيد عن الملاك ميخائيل في الكتاب المقدس 📖';
  }

  function reset() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    renderQuestion();
  }

  return { init, reset, score };
})();

// Initialize when level is shown
const level3Observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.target.id === 'level-2' && mutation.target.classList.contains('active')) {
      BibleQuizGame.init();
    }
  }
});

document.querySelectorAll('.screen').forEach(screen => {
  level3Observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});