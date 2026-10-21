/* ============================================================
   Level 4: Strength Challenge (High School)
   Based on PDF page 4 and 9
   Scenario-based choices about strength without insult
   ============================================================ */

const StrengthChallengeGame = (() => {
  const SCENARIOS = [
    {
      id: 1,
      scenario: 'زميل في المدرسة يسخر منك أمام الأصدقاء',
      michaelExample: 'ميخائيل لم يرد بإهانة على إبليس بل قال: "ليحكم الرب عليك"',
      options: [
        { id: 'a', text: 'أسخر منه أمام الجميع', correct: false, feedback: 'هذا رد بإهانة - ليس القوة الحقيقية' },
        { id: 'b', text: 'أصلي: "يا رب، أنت تدبر الأمر"', correct: true, feedback: '✅ هذا ما فعله ميخائيل! القوة الحقيقية هي الصبر على الله' },
        { id: 'c', text: 'أتجاهله وأمشي', correct: false, feedback: 'التجاهل قد يكون سلبياً - الأفضل هو الصلاة' }
      ]
    },
    {
      id: 2,
      scenario: 'شخص يكتب تعليقات سيئة عنك على وسائل التواصل',
      michaelExample: 'ميخائيل وقف للدفاع عن الحق لكنه لم يشتم',
      options: [
        { id: 'a', text: 'أكتب له رد عنيف في التعليقات', correct: false, feedback: 'الرد بالعنف ليس من طريق ميخائيل' },
        { id: 'b', text: 'أتجاهل وأصلي عنه', correct: true, feedback: '✅ "الرب لينتهرك" - نترك الحكم لله' },
        { id: 'c', text: 'أحذف حسابه وأغلق حسابي', correct: false, feedback: 'الهروب ليس حلاً دائماً' }
      ]
    },
    {
      id: 3,
      scenario: 'صديقك يخون ثقتك ويكذب عليك',
      michaelExample: 'ميخائيل صابر حتى عندما أهانه إبليس',
      options: [
        { id: 'a', text: 'أقطع علاقتي به للأبد', correct: false, feedback: 'قد يكون حلاً مؤقتاً لكن ليس الحل المسيحي' },
        { id: 'b', text: 'أتكلم معه بهدوء وأصلي له', correct: true, feedback: '✅ القوة الحقيقية في الغفران والصلاة' },
        { id: 'c', text: 'أعاقبه بنفس الطريقة', correct: false, feedback: 'الانتقام ليس من طريق الرب' }
      ]
    },
    {
      id: 4,
      scenario: 'شخص يسأل: هل "الرب لينتهرك" يعني عدم الدفاع عن الحق؟',
      michaelExample: 'ميخائيل حارب التنين لكنه لم يشتم',
      options: [
        { id: 'a', text: 'نعم، يعني أننا نستسلم', correct: false, feedback: 'لا، ميخائيل لم يستسلم بل ترك الحكم لله' },
        { id: 'b', text: 'لا، يمكنني الدفاع عن الحق بدون إهانة', correct: true, feedback: '✅ ميخائيل قاوم التنين لكنه قال "ليحكم الرب عليك"' },
        { id: 'c', text: 'يعني يجب أن أتصرف بسلامية', correct: false, feedback: 'السلامية ليست بالضرورة weakness' }
      ]
    }
  ];

  let currentScenario = 0;
  let score = 0;
  let weeklyChallenge = {
    days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    checks: [false, false, false, false, false, false, false]
  };

  function init() {
    renderScenario();
  }

  function renderScenario() {
    if (currentScenario >= SCENARIOS.length) {
      showResults();
      return;
    }

    const s = SCENARIOS[currentScenario];
    const container = document.getElementById('challenge-container');

    container.innerHTML = `
      <div class="scenario-header">
        <span class="scenario-number">السيناريو ${currentScenario + 1} من ${SCENARIOS.length}</span>
        <div class="progress-bar"><div class="progress-fill" style="width: ${(currentScenario / SCENARIOS.length) * 100}%"></div></div>
      </div>
      <div class="scenario-card">
        <div class="michael-icon">👼</div>
        <h3>${s.scenario}</h3>
        <div class="michael-example">
          <strong>💡 مثال من الملاك ميخائيل:</strong>
          <p>${s.michaelExample}</p>
        </div>
        <div class="options-grid">
          ${s.options.map(opt => `
            <button class="option-btn scenario-option" data-id="${opt.id}" data-correct="${opt.correct}">
              <span class="option-letter">${opt.id.toUpperCase()}</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
        <div id="feedback-box" class="hidden"></div>
      </div>
    `;

    document.querySelectorAll('.scenario-option').forEach(btn => {
      btn.addEventListener('click', (e) => handleChoice(e.currentTarget));
    });
  }

  function handleChoice(button) {
    const isCorrect = button.dataset.correct === 'true';
    const feedbackBox = document.getElementById('feedback-box');
    const scenario = SCENARIOS[currentScenario];
    const selectedOption = scenario.options.find(o => o.id === button.dataset.id);

    // Disable all buttons
    document.querySelectorAll('.scenario-option').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.correct === 'true') {
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      score += 20;
      Game.addScore(20);
      button.classList.add('selected');
    } else {
      button.classList.add('wrong');
    }

    // Show feedback
    feedbackBox.innerHTML = `
      <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
        ${isCorrect ? '✅ رائع! هذا هو طريق ميخائيل' : '❌ ليست هذه الطريقة المثالية'}
        <p>${selectedOption.feedback}</p>
      </div>
    `;
    feedbackBox.classList.remove('hidden');

    // Move to next scenario
    setTimeout(() => {
      currentScenario++;
      renderScenario();
    }, 3000);
  }

  function showResults() {
    const container = document.getElementById('challenge-container');
    const percentage = Math.round((score / (SCENARIOS.length * 20)) * 100);

    container.innerHTML = `
      <div class="results-card">
        <div class="results-icon">${percentage >= 80 ? '👼' : percentage >= 60 ? '💪' : '📖'}</div>
        <h3>أنت الآن مثل ميخائيل!</h3>
        <div class="results-score">${score} / ${SCENARIOS.length * 20}</div>
        <div class="results-percentage">${percentage}%</div>
        <p class="results-message">${getMotivationalMessage(percentage)}</p>
      </div>

      <div class="weekly-challenge">
        <h3>💪 تحدي الأسبوع</h3>
        <p>كل يوم تتضايق من أحد، صل: "يا رب، أنت تدبر الأمر" وارفع علامة ✅</p>
        <div class="week-tracker">
          ${weeklyChallenge.days.map((day, idx) => `
            <div class="day-box ${weeklyChallenge.checks[idx] ? 'checked' : ''}" data-day="${idx}">
              <div class="day-name">${day}</div>
              <div class="day-check">
                ${weeklyChallenge.checks[idx] ? '✅' : '⬜'}
              </div>
            </div>
          `).join('')}
        </div>
        <p class="challenge-note">📝 ابدأ التحدي من اليوم - صل كل يوم وتذكر كلام ميخائيل!</p>
      </div>

      <button class="btn btn-primary btn-next-level mt-16">
        <span class="btn-icon">➡️</span>
        اكتملت المراحل!
      </button>
    `;
  }

  function getMotivationalMessage(percentage) {
    if (percentage === 100) return 'مبروك! أنت قوي مثل ميخائيل 👼';
    if (percentage >= 80) return 'أحسنت! تفكيرك like الملاك ميخائيل!';
    if (percentage >= 60) return 'جيد! واصل التعلم عن القوة الروحية.';
    return 'جربت! تذكر: القوة الحقيقية هي الصبر على الله 💪';
  }

  function reset() {
    currentScenario = 0;
    score = 0;
    renderScenario();
  }

  return { init, reset, score };
})();

// Initialize when level is shown
const level4Observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.target.id === 'level-3' && mutation.target.classList.contains('active')) {
      StrengthChallengeGame.init();
    }
  }
});

document.querySelectorAll('.screen').forEach(screen => {
  level4Observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});