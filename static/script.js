(() => {
  const form = document.getElementById('pickerForm');
  const quantityInput = document.getElementById('quantity');
  const minInput = document.getElementById('minimum');
  const maxInput = document.getElementById('maximum');
  const results = document.getElementById('results');
  const validation = document.getElementById('validationMessage');
  const rangeLabel = document.getElementById('resultRange');
  const statusLabel = document.getElementById('resultStatus');
  const copyButton = document.getElementById('copyButton');
  const languageToggle = document.getElementById('languageToggle');
  let currentNumbers = [7, 12, 23, 28, 34, 42];
  let language = 'en';
  const ballClasses = ['ball-blue', 'ball-purple', 'ball-coral', 'ball-gold', 'ball-teal'];

  function translate(to) {
    language = to;
    document.documentElement.lang = to;
    document.documentElement.dir = to === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-he]').forEach(el => {
      el.textContent = el.dataset[to];
    });
    languageToggle.innerHTML = to === 'en' ? 'עברית <span aria-hidden="true">↗</span>' : 'English <span aria-hidden="true">↗</span>';
    quantityInput.nextElementSibling.textContent = to === 'en' ? 'numbers' : 'מספרים';
  }
  languageToggle.addEventListener('click', () => translate(language === 'en' ? 'he' : 'en'));

  function renderNumbers(numbers) {
    results.replaceChildren();
    numbers.forEach((number, index) => {
      const ball = document.createElement('span');
      ball.className = `number-ball ${ballClasses[index % ballClasses.length]}`;
      ball.style.animationDelay = `${index * 45}ms`;
      ball.textContent = number;
      results.appendChild(ball);
    });
    currentNumbers = numbers;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const quantity = Number(quantityInput.value);
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    const message = language === 'en'
      ? 'Enter a valid range and a quantity that fits within it.'
      : 'יש להזין טווח תקין וכמות שמתאימה לטווח.';
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20 ||
        !Number.isInteger(min) || !Number.isInteger(max) || max < min ||
        max - min + 1 < quantity) {
      validation.textContent = message;
      return;
    }
    validation.textContent = '';
    const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picked = pool.slice(0, quantity).sort((a, b) => a - b);
    renderNumbers(picked);
    rangeLabel.textContent = `${min}–${max}`;
    statusLabel.textContent = language === 'en' ? 'Freshly generated' : 'נוצרו עכשיו';
  });

  copyButton.addEventListener('click', async () => {
    const text = currentNumbers.join(', ');
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
