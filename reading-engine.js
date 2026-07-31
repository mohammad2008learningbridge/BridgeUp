/* ============================================================
   Learning Bridge — Reading Skill Engine
   محرك عام لمهارة القراءة، يُستخدم بكل المستويات.
   يعتمد على متغيّر عالمي READING_DATA (مصفوفة نصوص) و READING_LEVEL
   يتم تعريفهم بملف reading-data.js الخاص بكل مستوى قبل استدعاء هذا الملف.
   ============================================================ */

(function () {
  "use strict";

  if (typeof READING_DATA === "undefined" || !Array.isArray(READING_DATA)) {
    console.error("READING_DATA غير معرّف. تأكد من تحميل ملف reading-data.js قبل reading-engine.js");
    return;
  }

  var LEVEL_KEY = (typeof READING_LEVEL !== "undefined" ? READING_LEVEL : "level");
  var STORAGE_KEY = "lb-reading-progress-" + LEVEL_KEY;

  var state = {
    index: 0,
    rate: 1,
    speaking: false,
    paused: false,
    wordSpans: [], // {start, end, el}
    answers: {}, // questionIndex -> selected option index
    checked: false
  };

  // عناصر DOM
  var els = {};

  function qs(id) { return document.getElementById(id); }

  function init() {
    els.progress = qs("progress-label");
    els.title = qs("reading-title");
    els.text = qs("reading-text");
    els.toggleBtn = qs("btn-toggle");
    els.speed = qs("speed-select");
    els.wordPanel = qs("word-panel");
    els.wordPanelContent = qs("word-panel-content");
    els.wordPanelClose = qs("word-panel-close");
    els.questions = qs("questions-container");
    els.checkBtn = qs("btn-check-answers");
    els.score = qs("score-result");
    els.vocab = qs("vocab-container");
    els.nextBtn = qs("btn-next");

    var saved = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    state.index = isNaN(saved) ? 0 : Math.min(saved, READING_DATA.length - 1);

    els.toggleBtn.addEventListener("click", onToggleAudio);
    els.speed.addEventListener("change", onSpeedChange);
    els.wordPanelClose.addEventListener("click", closeWordPanel);
    els.checkBtn.addEventListener("click", onCheckAnswers);
    els.nextBtn.addEventListener("click", onNext);

    renderCurrent();
  }

  function currentData() {
    return READING_DATA[state.index];
  }

  function lookupWord(key) {
    var data = currentData();
    if (data.words && data.words[key]) return data.words[key];
    if (typeof COMMON_WORDS !== "undefined" && COMMON_WORDS[key]) return COMMON_WORDS[key];
    return null;
  }

  function tokenize(text) {
    var regex = /[A-Za-z']+|[^A-Za-z']+/g;
    var tokens = [];
    var m;
    while ((m = regex.exec(text)) !== null) {
      var val = m[0];
      if (/^[A-Za-z']+$/.test(val)) {
        tokens.push({ type: "word", value: val, key: val.toLowerCase().replace(/[^a-z']/g, "") });
      } else {
        tokens.push({ type: "other", value: val });
      }
    }
    return tokens;
  }

  function renderCurrent() {
    speechSynthesis.cancel();
    state.speaking = false;
    state.paused = false;
    state.answers = {};
    state.checked = false;
    updateToggleBtn();
    els.score.textContent = "";
    els.score.className = "score-result";

    var data = currentData();
    els.progress.textContent = "نص " + (state.index + 1) + " من " + READING_DATA.length;
    els.title.textContent = data.title;

    // بناء النص القابل للنقر
    var tokens = tokenize(data.text);
    els.text.innerHTML = "";
    state.wordSpans = [];
    var offset = 0;
    tokens.forEach(function (tok) {
      if (tok.type === "word") {
        var span = document.createElement("span");
        span.className = "word";
        span.textContent = tok.value;
        span.setAttribute("data-key", tok.key);
        span.addEventListener("click", function () { onWordClick(tok.key, tok.value, span); });
        els.text.appendChild(span);
        state.wordSpans.push({ start: offset, end: offset + tok.value.length, el: span });
      } else {
        els.text.appendChild(document.createTextNode(tok.value));
      }
      offset += tok.value.length;
    });

    renderQuestions(data.questions || []);
    renderVocabulary(data.vocabulary || []);

    // زر التالي
    if (state.index >= READING_DATA.length - 1) {
      els.nextBtn.textContent = "أنهيت نصوص هذا المستوى 🎉 (عودة لقائمة المهارات)";
      els.nextBtn.setAttribute("data-last", "true");
    } else {
      els.nextBtn.textContent = "التالي ←";
      els.nextBtn.removeAttribute("data-last");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- الصوت ---------------- */

  function speakFull() {
    var data = currentData();
    var utter = new SpeechSynthesisUtterance(data.text);
    utter.lang = "en-US";
    utter.rate = state.rate;

    utter.onboundary = function (e) {
      if (e.name !== "word") return;
      highlightAtCharIndex(e.charIndex);
    };
    utter.onend = function () {
      state.speaking = false;
      state.paused = false;
      clearHighlight();
      updateToggleBtn();
    };
    utter.onerror = function () {
      state.speaking = false;
      state.paused = false;
      updateToggleBtn();
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
    state.speaking = true;
    state.paused = false;
    updateToggleBtn();
  }

  function highlightAtCharIndex(idx) {
    clearHighlight();
    for (var i = 0; i < state.wordSpans.length; i++) {
      var w = state.wordSpans[i];
      if (idx >= w.start && idx < w.end) {
        w.el.classList.add("word-active");
        break;
      }
    }
  }

  function clearHighlight() {
    state.wordSpans.forEach(function (w) { w.el.classList.remove("word-active"); });
  }

  function onToggleAudio() {
    if (!state.speaking) {
      speakFull();
    } else if (state.paused) {
      speechSynthesis.resume();
      state.paused = false;
      updateToggleBtn();
    } else {
      speechSynthesis.pause();
      state.paused = true;
      updateToggleBtn();
    }
  }

  function updateToggleBtn() {
    if (!state.speaking) {
      els.toggleBtn.textContent = "🔊 استماع للنص";
    } else if (state.paused) {
      els.toggleBtn.textContent = "▶️ استكمال";
    } else {
      els.toggleBtn.textContent = "⏸️ إيقاف مؤقت";
    }
  }

  function onSpeedChange() {
    state.rate = parseFloat(els.speed.value);
    if (state.speaking) speakFull(); // إعادة التشغيل من البداية بالسرعة الجديدة
  }

  /* ---------------- نقر الكلمة ---------------- */

  function onWordClick(key, original, el) {
    var info = lookupWord(key);
    els.wordPanelContent.innerHTML = "";

    var h = document.createElement("div");
    h.className = "wp-word";
    h.textContent = original;
    els.wordPanelContent.appendChild(h);

    if (info) {
      var ph = document.createElement("div");
      ph.className = "wp-phonetic";
      ph.textContent = info.ph || "";
      els.wordPanelContent.appendChild(ph);

      var pos = document.createElement("span");
      pos.className = "wp-pos";
      pos.textContent = info.pos || "";
      els.wordPanelContent.appendChild(pos);

      var ar = document.createElement("div");
      ar.className = "wp-ar";
      ar.textContent = info.ar || "";
      els.wordPanelContent.appendChild(ar);
    } else {
      var none = document.createElement("div");
      none.className = "wp-ar";
      none.textContent = "لا تتوفر ترجمة لهذه الكلمة بعد";
      els.wordPanelContent.appendChild(none);
    }

    var listenBtn = document.createElement("button");
    listenBtn.className = "wp-listen";
    listenBtn.textContent = "🔊 سماع الكلمة";
    listenBtn.addEventListener("click", function () {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(original);
      u.lang = "en-US";
      u.rate = 0.9;
      speechSynthesis.speak(u);
    });
    els.wordPanelContent.appendChild(listenBtn);

    els.wordPanel.classList.add("open");
  }

  function closeWordPanel() {
    els.wordPanel.classList.remove("open");
  }

  /* ---------------- أسئلة الفهم ---------------- */

  function renderQuestions(questions) {
    els.questions.innerHTML = "";
    if (!questions.length) return;

    questions.forEach(function (q, qi) {
      var card = document.createElement("div");
      card.className = "q-card";

      var label = document.createElement("div");
      label.className = "q-label";
      label.textContent = (qi + 1) + ". " + q.q;
      card.appendChild(label);

      var opts = document.createElement("div");
      opts.className = "q-options";
      q.options.forEach(function (opt, oi) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "q-opt";
        btn.textContent = opt;
        btn.setAttribute("data-qi", qi);
        btn.setAttribute("data-oi", oi);
        btn.addEventListener("click", function () {
          state.answers[qi] = oi;
          var siblings = opts.querySelectorAll(".q-opt");
          siblings.forEach(function (s) { s.classList.remove("selected"); });
          btn.classList.add("selected");
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);
      els.questions.appendChild(card);
    });
  }

  function onCheckAnswers() {
    var data = currentData();
    var questions = data.questions || [];
    if (!questions.length) return;

    var correctCount = 0;
    var allAnswered = true;

    questions.forEach(function (q, qi) {
      var card = els.questions.children[qi];
      var opts = card.querySelectorAll(".q-opt");
      var selected = state.answers[qi];
      if (selected === undefined) allAnswered = false;

      opts.forEach(function (btn, oi) {
        btn.classList.remove("correct", "wrong");
        if (oi === q.correct) btn.classList.add("correct");
        else if (oi === selected) btn.classList.add("wrong");
      });

      if (selected === q.correct) correctCount++;
    });

    if (!allAnswered) {
      els.score.textContent = "جاوب على كل الأسئلة أول ما تتحقق ✋";
      els.score.className = "score-result warn";
      return;
    }

    els.score.textContent = "نتيجتك: " + correctCount + " من " + questions.length;
    els.score.className = "score-result " + (correctCount === questions.length ? "good" : "mid");
    state.checked = true;
  }

  /* ---------------- المفردات المهمة ---------------- */

  function renderVocabulary(vocab) {
    els.vocab.innerHTML = "";
    if (!vocab.length) return;

    vocab.forEach(function (v) {
      var card = document.createElement("div");
      card.className = "v-card";

      var top = document.createElement("div");
      top.className = "v-top";

      var w = document.createElement("span");
      w.className = "v-word";
      w.textContent = v.word;
      top.appendChild(w);

      var listenBtn = document.createElement("button");
      listenBtn.className = "v-listen";
      listenBtn.textContent = "🔊";
      listenBtn.addEventListener("click", function () {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(v.word);
        u.lang = "en-US";
        u.rate = 0.9;
        speechSynthesis.speak(u);
      });
      top.appendChild(listenBtn);
      card.appendChild(top);

      var ph = document.createElement("div");
      ph.className = "v-ph";
      ph.textContent = v.ph || "";
      card.appendChild(ph);

      var ar = document.createElement("div");
      ar.className = "v-ar";
      ar.textContent = v.ar || "";
      card.appendChild(ar);

      var ex = document.createElement("div");
      ex.className = "v-ex";
      ex.textContent = v.example || "";
      card.appendChild(ex);

      els.vocab.appendChild(card);
    });
  }

  /* ---------------- التنقل ---------------- */

  function onNext() {
    if (state.index >= READING_DATA.length - 1) {
      window.location.href = "index.html";
      return;
    }
    state.index++;
    localStorage.setItem(STORAGE_KEY, String(state.index));
    renderCurrent();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
