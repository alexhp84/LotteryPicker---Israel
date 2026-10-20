(() => {
  const form = document.getElementById('pickerForm');
  const quantityInput = document.getElementById('quantity');
  const minInput = document.getElementById('minimum');
  const maxInput = document.getElementById('maximum');
  const bonusCountInput = document.getElementById('bonusCount');
  const results = document.getElementById('results');
  const bonusResults = document.getElementById('bonusResults');
  const bonusResultsSection = document.getElementById('bonusResultsSection');
  const validation = document.getElementById('validationMessage');
  const rangeLabel = document.getElementById('resultRange');
  const statusLabel = document.getElementById('resultStatus');
  const copyButton = document.getElementById('copyButton');
  const languageToggle = document.getElementById('languageToggle');
  let currentNumbers = [7, 12, 23, 28, 34, 42];
  let currentBonusNumbers = [];
  let language = 'en';
  const ballClasses = ['ball-blue', 'ball-purple', 'ball-coral', 'ball-gold', 'ball-teal'];

  function translate(to) {
    language = to;
    document.documentElement.lang = to;
    document.documentElement.dir = to === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-he]').forEach(el => {
      if (el.tagName === 'OPTION') {
        el.textContent = el.dataset[to];
      } else {
        el.textContent = el.dataset[to];
      }
    });
    languageToggle.innerHTML = to === 'en' ? 'עברית <span aria-hidden="true">↗</span>' : 'English <span aria-hidden="true">↗</span>';
    quantityInput.nextElementSibling.textContent = to === 'en' ? 'numbers' : 'מספרים';
  }
  languageToggle.addEventListener('click', () => translate(language === 'en' ? 'he' : 'en'));

  function renderBallGroup(container, numbers, bonus = false) {
    container.replaceChildren();
    numbers.forEach((number, index) => {
      const ball = document.createElement('span');
      ball.className = `number-ball ${ballClasses[index % ballClasses.length]}${bonus ? ' bonus-number-ball' : ''}`;
      ball.style.animationDelay = `${index * 45}ms`;
      ball.textContent = number;
      container.appendChild(ball);
    });
  }

  function renderNumbers(numbers, bonusNumbers) {
    renderBallGroup(results, numbers);
    renderBallGroup(bonusResults, bonusNumbers, true);
    bonusResultsSection.hidden = bonusNumbers.length === 0;
    currentNumbers = numbers;
    currentBonusNumbers = bonusNumbers;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const quantity = Number(quantityInput.value);
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    const bonusCount = Number(bonusCountInput.value);
    const message = language === 'en'
      ? 'Enter a valid range and a quantity that fits within it. Leave enough numbers for your bonus picks.'
      : 'יש להזין טווח תקין וכמות שמתאימה לטווח, ולהשאיר מספיק מספרים לבונוס.';
    const rangeSize = max - min + 1;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20 ||
        !Number.isInteger(bonusCount) || ![0, 1, 2].includes(bonusCount) ||
        !Number.isInteger(min) || !Number.isInteger(max) || max < min ||
        rangeSize < quantity + bonusCount) {
      validation.textContent = message;
      return;
    }

    validation.textContent = '';
    const pool = Array.from({ length: rangeSize }, (_, i) => min + i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picked = pool.slice(0, quantity).sort((a, b) => a - b);
    const bonusPicks = pool.slice(quantity, quantity + bonusCount).sort((a, b) => a - b);
    renderNumbers(picked, bonusPicks);
    rangeLabel.textContent = `${min}–${max}`;
    statusLabel.textContent = language === 'en' ? 'Freshly generated' : 'נוצרו עכשיו';
  });

  copyButton.addEventListener('click', async () => {
    const mainText = currentNumbers.join(', ');
    const bonusText = currentBonusNumbers.length
      ? (language === 'en' ? ' | Bonus: ' : ' | בונוס: ') + currentBonusNumbers.join(', ')
      : '';
    const text = mainText + bonusText;
    const label = copyButton.querySelectorAll('span')[1];
    try {
      await navigator.clipboard.writeText(text);
      label.textContent = language === 'en' ? 'Copied!' : 'הועתק!';
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      label.textContent = language === 'en' ? 'Copied!' : 'הועתק!';
    }
    setTimeout(() => {
      label.textContent = language === 'en' ? 'Copy results' : 'העתקת תוצאות';
    }, 1600);
  });
})();
