const label = document.querySelector('#dark-mode-toggle');

label.onchange = (event) => {
  event.stopPropagation();
  const isDark = event.target.checked;

  const toggleEvent = new CustomEvent('darkmode:toggle', {
    bubbles: true,
    detail: { dark: isDark }
  });

  label.dispatchEvent(toggleEvent);
};

document.body.addEventListener('darkmode:toggle', (event) => {
  const { dark } = event.detail;
  if (dark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
