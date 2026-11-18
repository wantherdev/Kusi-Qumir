(() => {
  'use strict';
  const root = document.documentElement;
  const key = 'kusi-qumir-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try {
    preference = localStorage.getItem(key);
  } catch (_) {}
  if (preference !== 'dark' && preference !== 'light') preference = null;
  let button;
  let selectedTheme;
  let activeTransition;
  let transitionTimer;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const moon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 13A8.8 8.8 0 0 1 11 3.2 8.8 8.8 0 1 0 20.8 13Z"/></svg>';
  const sun =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0b141c' : '#f6f9f9';
    if (button) {
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', 'Modo oscuro');
      button.title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
      button.querySelector('.theme-switch__state').textContent = dark ? 'Oscuro' : 'Claro';
    }
  }
  function changeTheme(theme) {
    selectedTheme = theme;
    activeTransition?.skipTransition();
    if (root.dataset.theme === theme && !activeTransition) return;
    if (reducedMotion.matches) {
      apply(theme);
      return;
    }
    if (typeof document.startViewTransition === 'function') {
      root.classList.add('kq-theme-crossfade');
      const transition = document.startViewTransition(() => {
        if (selectedTheme === theme) apply(theme);
      });
      activeTransition = transition;
      transition.finished
        .catch(() => {})
        .finally(() => {
          if (activeTransition === transition) {
            root.classList.remove('kq-theme-crossfade');
            activeTransition = null;
          }
        });
    } else {
      clearTimeout(transitionTimer);
      root.classList.add('kq-theme-changing');
      void root.offsetWidth;
      apply(theme);
      transitionTimer = setTimeout(() => root.classList.remove('kq-theme-changing'), 650);
    }
  }
  selectedTheme = preference || (system.matches ? 'dark' : 'light');
  apply(selectedTheme);
  function mount() {
    button = document.createElement('button');
    button.id = 'kq-theme-toggle';
    button.type = 'button';
    button.innerHTML =
      '<span class="theme-switch__label">Apariencia<span class="theme-switch__state"></span></span><span class="theme-switch__track" aria-hidden="true"><span class="theme-switch__sun">' +
      sun +
      '</span><span class="theme-switch__moon">' +
      moon +
      '</span><span class="theme-switch__thumb"></span></span>';
    button.addEventListener('click', () => {
      preference = selectedTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(key, preference);
      } catch (_) {}
      changeTheme(preference);
    });
    document.body.append(button);
    apply(root.dataset.theme);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  system.addEventListener('change', () => {
    if (!preference) changeTheme(system.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== key) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    changeTheme(preference || (system.matches ? 'dark' : 'light'));
  });
})();
