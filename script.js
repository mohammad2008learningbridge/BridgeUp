// Learning Bridge — shared interactions
// Kept small and generic on purpose: every page includes this same file,
// so new pages automatically get theme switching + scroll-reveal without
// extra JS. Add page-specific behaviour in a page's own <script> block,
// not here, to keep this file reusable across the whole site.

/* ---------- Theme (dark by default, light optional) ---------- */
(function initTheme(){
  const saved = localStorage.getItem('lb-theme');
  const theme = saved === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lb-theme', next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme){
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateToggleIcon(theme);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.reveal, .skill-card');

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));
});
