(() => {
  const quantityInput = document.getElementById('quantity');
  const languageToggle = document.getElementById('languageToggle');
  const copyButton = document.getElementById('copyButton');
  const results = document.getElementById('results');
  const bonusResults = document.getElementById('bonusResults');
  let language = document.documentElement.lang === 'he' ? 'he' : 'en';

  function translate(to) {
    language = to;
    document.documentElement.lang = to;
    document.documentElement.dir = to === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en][data-he]').forEach(el => {
      el.textContent = el.dataset[to];
    });
    languageToggle.innerHTML = to === 'en'
      ? 'עברית <span aria-hidden="true">↗</span>'
      : 'English <span aria-hidden="true">↗</span>';
    if (quantityInput && quantityInput.nextElementSibling) {
      quantityInput.nextElementSibling.textContent = to === 'en' ? 'numbers' : 'מספרים';
    }
  }

  languageToggle.addEventListener('click', () => translate(language === 'en' ? 'he' : 'en'));

  copyButton.addEventListener('click', async () => {
    const mainText = Array.from(results.querySelectorAll('.number-ball'))
      .map(ball => ball.textContent.trim()).join(', ');
    const bonusNumbers = bonusResults
      ? Array.from(bonusResults.querySelectorAll('.number-ball')).map(ball => ball.textContent.trim())
      : [];
    const bonusText = bonusNumbers.length
      ? (language === 'en' ? ' | Bonus: ' : ' | בונוס: ') + bonusNumbers.join(', ')
      : '';
    const text = mainText + bonusText;
    const label = copyButton.querySelectorAll('span')[1];
    const copied = language === 'en' ? 'Copied!' : 'הועתק!';
    try {
      await navigator.clipboard.writeText(text);
      label.textContent = copied;
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      label.textContent = copied;
    }
    setTimeout(() => {
      label.textContent = language === 'en' ? 'Copy results' : 'העתקת תוצאות';
    }, 1600);
  });
})();
