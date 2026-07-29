/* ==========================================================================
   Learning Bridge — Lesson Engine
   A single reusable "player" for every lesson page: shows ONE step at a time
   (info card, multiple-choice, or fill-blank), tracks progress dots + XP,
   and ends with a small celebration screen.

   HOW TO USE IN A NEW LESSON PAGE (this is the only code a new page needs):

   <link rel="stylesheet" href="../../style.css">
   ... normal <nav> from any existing page ...
   <div id="lessonRoot"></div>
   <script src="../../lesson-engine.js"></script>
   <script>
     LessonEngine.start('lessonRoot', {
       backHref: 'index.html',      // where "Skills" button in topbar goes
       unitTitle: 'Unit 1 · Colors',
       steps: [
         { type:'info', title:'الألوان', body:'شرح قصير هون...',
           table:[['Red','أحمر'], ['Blue','أزرق']] },      // table optional
         { type:'mcq', question:'شو لون التفاحة؟', options:['Red','Blue','Green'], answer:0 },
         { type:'blank', question:'اكتب لون السماء:', answer:'blue' },
         { type:'done', message:'خلصت الوحدة! 🎉' }
       ]
     });
   </script>
   ========================================================================== */

(function(){

  const CSS = `
  .lesson-shell{ max-width:640px; margin:0 auto; padding:150px 20px 80px; min-height:100vh; box-sizing:border-box; }
  .lesson-topbar{ position:fixed; top:68px; right:0; left:0; z-index:45;
    background:color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line); padding:14px 20px; display:flex; align-items:center; gap:14px; }
  .lesson-back{ background:none; border:none; color:var(--ink); font-size:1.2rem; cursor:pointer; flex:0 0 auto; }
  .lesson-dots{ flex:1; display:flex; gap:6px; }
  .lesson-dot{ height:6px; flex:1; border-radius:4px; background:var(--line); transition:background .3s ease; }
  .lesson-dot.done{ background:var(--blue); }
  .lesson-dot.current{ background:var(--gold); }
  .lesson-xp{ flex:0 0 auto; font-weight:800; font-size:.85rem; color:var(--gold); display:flex; align-items:center; gap:4px; }
  .lesson-xp.bump{ animation:xpBump .4s ease; }
  @keyframes xpBump{ 0%{transform:scale(1);} 40%{transform:scale(1.3);} 100%{transform:scale(1);} }

  .lesson-unit-tag{ font-size:.8rem; font-weight:800; color:var(--gold); letter-spacing:.06em; margin-bottom:14px; display:block; }
  .lesson-card{ background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:28px 24px; box-shadow:var(--shadow); animation:cardIn .35s ease; }
  @keyframes cardIn{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }

  .lesson-card h2{ color:var(--ink); font-size:1.25rem; font-weight:900; margin-bottom:12px; }
  .lesson-card .body-text{ color:var(--ink-soft); line-height:1.85; margin-bottom:18px; }
  .lesson-mini-table{ width:100%; border-collapse:collapse; margin-bottom:6px; font-size:.92rem; }
  .lesson-mini-table td{ padding:10px 12px; border-bottom:1px solid var(--line); }
  .lesson-mini-table td:first-child{ font-weight:800; color:var(--ink); font-family:'Poppins',sans-serif; direction:ltr; }
  .lesson-mini-table td:last-child{ color:var(--ink-soft); text-align:left; }
  .lesson-mini-table tr:last-child td{ border-bottom:none; }

  .lesson-q{ font-weight:800; color:var(--ink); font-size:1.1rem; margin-bottom:20px; }
  .lesson-opts{ display:grid; gap:10px; }
  .lesson-opt{ text-align:right; padding:14px 16px; border-radius:12px; border:1px solid var(--line);
    background:var(--bg); color:var(--ink); font-family:inherit; font-size:.98rem; cursor:pointer;
    transition:border-color .2s ease, background .2s ease, transform .15s ease; }
  .lesson-opt:hover{ border-color:var(--blue); }
  .lesson-opt.correct{ border-color:#22c55e; background:rgba(34,197,94,0.14); color:#4ade80; }
  .lesson-opt.wrong{ border-color:#ef4444; background:rgba(239,68,68,0.14); color:#f87171; }
  .lesson-opt:disabled{ cursor:default; }

  .lesson-blank-row{ display:flex; gap:10px; }
  .lesson-blank-row input{ flex:1; background:var(--bg); border:1px solid var(--line); border-radius:12px;
    padding:13px 16px; color:var(--ink); font-family:inherit; font-size:.98rem; }
  .lesson-blank-row input:focus{ outline:none; border-color:var(--blue); }

  .lesson-feedback{ margin-top:14px; font-weight:700; font-size:.92rem; min-height:1.3em; }
  .lesson-feedback.ok{ color:#4ade80; }
  .lesson-feedback.bad{ color:#f87171; }

  .lesson-next{ display:block; width:100%; margin-top:22px; background:linear-gradient(120deg,var(--blue),#2563eb);
    color:#fff; border:none; border-radius:12px; padding:15px; font-weight:800; font-size:1rem;
    cursor:pointer; opacity:0; pointer-events:none; transform:translateY(6px); transition:all .3s ease; }
  .lesson-next.show{ opacity:1; pointer-events:all; transform:translateY(0); }
  .lesson-check{ display:block; width:100%; margin-top:16px; background:var(--blue); color:#fff; border:none;
    border-radius:12px; padding:14px; font-weight:800; font-family:inherit; cursor:pointer; }

  .lesson-done{ text-align:center; padding:20px 0; }
  .lesson-done .emoji{ font-size:3rem; margin-bottom:14px; }
  .lesson-done h2{ color:var(--ink); font-size:1.3rem; font-weight:900; margin-bottom:8px; }
  .lesson-done p{ color:var(--ink-soft); margin-bottom:22px; }
  .lesson-done .xp-final{ color:var(--gold); font-weight:900; font-size:1.4rem; margin-bottom:22px; }
  `;

  function injectCSS(){
    if (document.getElementById('lesson-engine-css')) return;
    const style = document.createElement('style');
    style.id = 'lesson-engine-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ---- tiny generated-tone audio feedback (no external files) ---- */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const actx = AudioCtx ? new AudioCtx() : null;
  function tone(freq, duration, type, peak){
    if (!actx) return;
    if (actx.state === 'suspended') actx.resume();
    const osc = actx.createOscillator(), gain = actx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, actx.currentTime);
    gain.gain.linearRampToValueAtTime(peak, actx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + duration);
    osc.connect(gain).connect(actx.destination);
    osc.start(); osc.stop(actx.currentTime + duration);
  }
  const sfx = {
    click:  () => tone(500, 0.08, 'square', 0.06),
    correct:() => { tone(660,0.14,'sine',0.14); setTimeout(()=>tone(880,0.18,'sine',0.14),100); },
    wrong:  () => tone(160, 0.28, 'sawtooth', 0.12),
    finish: () => { tone(523,0.15,'sine',0.15); setTimeout(()=>tone(659,0.15,'sine',0.15),120); setTimeout(()=>tone(784,0.25,'sine',0.15),240); }
  };

  function start(rootId, opts){
    injectCSS();
    const root = document.getElementById(rootId);
    const steps = opts.steps || [];
    let i = 0;
    let xp = 0;

    root.innerHTML = `
      <div class="lesson-topbar">
        <button class="lesson-back" onclick="location.href='${opts.backHref || 'index.html'}'">←</button>
        <div class="lesson-dots" id="le-dots"></div>
        <div class="lesson-xp" id="le-xp">⭐ <span id="le-xp-count">0</span></div>
      </div>
      <div class="lesson-shell">
        ${opts.unitTitle ? `<span class="lesson-unit-tag latin">${opts.unitTitle}</span>` : ''}
        <div id="le-stage"></div>
      </div>
    `;

    const dotsEl = root.querySelector('#le-dots');
    const xpEl = root.querySelector('#le-xp');
    const xpCountEl = root.querySelector('#le-xp-count');
    const stage = root.querySelector('#le-stage');

    steps.forEach((_, idx) => {
      const d = document.createElement('div');
      d.className = 'lesson-dot';
      d.dataset.idx = idx;
      dotsEl.appendChild(d);
    });

    function updateDots(){
      [...dotsEl.children].forEach((d, idx) => {
        d.classList.toggle('done', idx < i);
        d.classList.toggle('current', idx === i);
      });
    }

    function addXp(n){
      xp += n;
      xpCountEl.textContent = xp;
      xpEl.classList.remove('bump'); void xpEl.offsetWidth; xpEl.classList.add('bump');
    }

    function render(){
      updateDots();
      const step = steps[i];
      if (!step) return;
      if (step.type === 'info') renderInfo(step);
      else if (step.type === 'mcq') renderMcq(step);
      else if (step.type === 'blank') renderBlank(step);
      else if (step.type === 'done') renderDone(step);
    }

    function next(){ i++; render(); }

    function renderInfo(step){
      let tableHtml = '';
      if (step.table){
        tableHtml = '<table class="lesson-mini-table">' +
          step.table.map(row => `<tr><td class="latin">${row[0]}</td><td>${row[1]}</td></tr>`).join('') +
          '</table>';
      }
      stage.innerHTML = `
        <div class="lesson-card">
          <h2>${step.title || ''}</h2>
          <p class="body-text">${step.body || ''}</p>
          ${tableHtml}
          <button class="lesson-next show">متابعة</button>
        </div>`;
      stage.querySelector('.lesson-next').addEventListener('click', () => { sfx.click(); next(); });
    }

    function renderMcq(step){
      stage.innerHTML = `
        <div class="lesson-card">
          <div class="lesson-q">${step.question}</div>
          <div class="lesson-opts">
            ${step.options.map((opt,idx) => `<button class="lesson-opt latin" data-idx="${idx}">${opt}</button>`).join('')}
          </div>
          <div class="lesson-feedback"></div>
          <button class="lesson-next">متابعة</button>
        </div>`;
      const buttons = [...stage.querySelectorAll('.lesson-opt')];
      const feedback = stage.querySelector('.lesson-feedback');
      const nextBtn = stage.querySelector('.lesson-next');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          sfx.click();
          buttons.forEach(b => b.disabled = true);
          const idx = Number(btn.dataset.idx);
          if (idx === step.answer){
            btn.classList.add('correct');
            feedback.textContent = 'صحيح! أحسنت 🎉';
            feedback.className = 'lesson-feedback ok';
            sfx.correct(); addXp(10);
          } else {
            btn.classList.add('wrong');
            buttons[step.answer].classList.add('correct');
            feedback.textContent = 'مش صحيح، بس شايف الإجابة الصح فوق.';
            feedback.className = 'lesson-feedback bad';
            sfx.wrong();
          }
          nextBtn.classList.add('show');
        });
      });
      nextBtn.addEventListener('click', () => { sfx.click(); next(); });
    }

    function renderBlank(step){
      stage.innerHTML = `
        <div class="lesson-card">
          <div class="lesson-q">${step.question}</div>
          <div class="lesson-blank-row">
            <input type="text" placeholder="اكتب هنا...">
          </div>
          <button class="lesson-check">تحقق</button>
          <div class="lesson-feedback"></div>
          <button class="lesson-next">متابعة</button>
        </div>`;
      const input = stage.querySelector('input');
      const checkBtn = stage.querySelector('.lesson-check');
      const nextBtn = stage.querySelector('.lesson-next');
      const feedback = stage.querySelector('.lesson-feedback');
      checkBtn.addEventListener('click', () => {
        sfx.click();
        const val = input.value.trim().toLowerCase();
        const answer = String(step.answer).trim().toLowerCase();
        if (val === answer){
          feedback.textContent = 'صحيح! أحسنت 🎉';
          feedback.className = 'lesson-feedback ok';
          input.style.borderColor = '#22c55e';
          sfx.correct(); addXp(10);
        } else {
          feedback.textContent = `مش صحيح، الإجابة الصح: "${step.answer}"`;
          feedback.className = 'lesson-feedback bad';
          input.style.borderColor = '#ef4444';
          sfx.wrong();
        }
        checkBtn.disabled = true;
        nextBtn.classList.add('show');
      });
      nextBtn.addEventListener('click', () => { sfx.click(); next(); });
    }

    function renderDone(step){
      sfx.finish();
      stage.innerHTML = `
        <div class="lesson-card lesson-done">
          <div class="emoji">🏆</div>
          <h2>${step.message || 'أحسنت! خلصت الوحدة'}</h2>
          <div class="xp-final">+${xp} XP</div>
          <button class="lesson-next show" onclick="location.href='${opts.backHref || 'index.html'}'">رجوع للمهارات</button>
        </div>`;
    }

    render();
  }

  window.LessonEngine = { start };
})();
