// Learning Bridge — shared interactions
// Kept small and generic on purpose: every page includes this same file,
// so new pages automatically get scroll-reveal + skill-card animation
// without extra JS. Add page-specific behaviour in a page's own <script>
// block, not here, to keep this file reusable across the whole site.

document.addEventListener('DOMContentLoaded', () => {
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
