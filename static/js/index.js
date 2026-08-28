/* ------------------------------------------------------------------
   Agentic Intelligence project page.

   Every number below is transcribed from the paper (00.main.tex):
   Tables tab:libero_pro, tab:metaworld, tab:liberox,
   tab:ablation_selector and tab:realtime.
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   Copy BibTeX to clipboard
   ------------------------------------------------------------------ */
function copyBibTeX() {
  var bibtexElement = document.getElementById('bibtex-code');
  var button = document.querySelector('.copy-bibtex-btn');
  if (!bibtexElement || !button) return;

  var copyText = button.querySelector('.copy-text');

  function markCopied() {
    button.classList.add('copied');
    if (copyText) copyText.textContent = 'Copied!';
    setTimeout(function () {
      button.classList.remove('copied');
      if (copyText) copyText.textContent = 'Copy';
    }, 2000);
  }

  function fallbackCopy() {
    var textArea = document.createElement('textarea');
    textArea.value = bibtexElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (e) { /* nothing else to try */ }
    document.body.removeChild(textArea);
    markCopied();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(bibtexElement.textContent).then(markCopied).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

/* ------------------------------------------------------------------
   Scroll to top
   ------------------------------------------------------------------ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------------------------------------------------------
   Run a callback the first time an element scrolls into view
   ------------------------------------------------------------------ */
function onFirstView(element, callback, threshold) {
  if (!('IntersectionObserver' in window)) { callback(); return; }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      callback();
      observer.unobserve(entry.target);
    });
  }, { threshold: threshold || 0.3 });
  observer.observe(element);
}

/* ------------------------------------------------------------------
   Sticky nav: scroll spy, reading progress, mobile toggle
   ------------------------------------------------------------------ */
function setupNav() {
  var nav = document.getElementById('ai-nav');
  var progress = document.getElementById('ai-progress');
  var toggle = document.getElementById('ai-nav-toggle');
  var links = document.getElementById('ai-nav-links');
  if (!nav) return;

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var anchors = links ? Array.prototype.slice.call(links.querySelectorAll('a')) : [];
  var sections = anchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    if (progress) {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (height > 0 ? (window.pageYOffset / height) * 100 : 0) + '%';
    }

    var scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
      scrollButton.classList.toggle('visible', window.pageYOffset > 300);
    }

    // Highlight the section whose top has most recently passed the nav bar.
    var current = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= nav.offsetHeight + 20) current = i;
    }
    anchors.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  onScroll();
}

/* ------------------------------------------------------------------
   Animated stat counters
   ------------------------------------------------------------------ */
function setupCounters() {
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(el, value) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = (el.dataset.prefix || '') + value.toFixed(decimals) + (el.dataset.suffix || '');
  }

  counters.forEach(function (el) {
    var target = parseFloat(el.dataset.countTo);
    if (reduce) { render(el, target); return; }

    onFirstView(el, function () {
      var duration = 1200;
      var start = null;
      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        render(el, target * eased);
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }, 0.4);
  });
}

/* ------------------------------------------------------------------
   Generic tab groups (method section)
   ------------------------------------------------------------------ */
function setupTabs() {
  var tabs = document.querySelectorAll('.ai-tab[data-tab]');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.dataset.tab;
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.ai-tab-panel').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.dataset.panel === name);
      });
    });
  });
}

/* ------------------------------------------------------------------
   Figure lightbox
   ------------------------------------------------------------------ */
function setupLightbox() {
  var lightbox = document.getElementById('ai-lightbox');
  var image = document.getElementById('ai-lightbox-img');
  var caption = document.getElementById('ai-lightbox-caption');
  var closeBtn = document.getElementById('ai-lightbox-close');
  if (!lightbox || !image) return;

  function open(source) {
    image.src = source.src;
    image.alt = source.alt;
    var figcaption = source.closest('figure') ? source.closest('figure').querySelector('figcaption') : null;
    if (caption) caption.textContent = figcaption ? figcaption.textContent.trim() : source.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    image.src = '';
  }

  document.querySelectorAll('.ai-zoomable').forEach(function (img) {
    img.addEventListener('click', function () { open(img); });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

/* ------------------------------------------------------------------
   Closed-loop walkthrough: Propose, Imagine, Verify, Execute
   ------------------------------------------------------------------ */
var LOOP_STAGES = {
  propose: {
    eyebrow: 'Stage 1 of 4',
    title: 'Propose',
    lead: 'A frozen vision-language agent writes candidate programs.',
    body: 'One request returns an ordered list of K raw source strings under fixed decoding settings. ' +
      'Each string is parsed by an AST interpreter before it reaches any learned module; the interpreter ' +
      'whitelists the nine primitives, accepts literal arguments only, and never calls exec(). Invalid ' +
      'candidates are discarded without repair, and a round with no valid candidate executes no motor command.',
    spec: [
      ['Candidates K', '3'],
      ['Backend', 'Gemini 3.1 Pro Preview'],
      ['Valid-candidate rate', '0.96'],
      ['Zero-valid rounds', '1.8%']
    ]
  },
  imagine: {
    eyebrow: 'Stage 2 of 4',
    title: 'Imagine',
    lead: 'Each valid program is rolled forward in latent space, never in pixels.',
    body: 'A V-JEPA-style ViT-B/14 encoder pools the last four observations into a 768-d latent. The ' +
      'Code-to-Token Bridge maps each program to a 512-d embedding, and a program-conditioned transformer ' +
      'decodes H latent states per candidate. Horizon-indexed AdaLN-Zero conditioning makes the program ' +
      'modulation depend on the prediction step, not on the program embedding alone. There is no pixel decoder.',
    spec: [
      ['Latent dim', '768'],
      ['Program embedding', '512'],
      ['Planning horizon H', '8'],
      ['Supervised T_p', '3']
    ]
  },
  verify: {
    eyebrow: 'Stage 3 of 4',
    title: 'Verify',
    lead: 'A learned verifier ranks imagined futures before the arm moves.',
    body: 'The verifier scores each imagined trajectory against a frozen MiniLM task embedding using two ' +
      'sigmoid heads: a horizon head for success-by-step h and a terminal head for end-of-trajectory success. ' +
      'The planning score averages the terminal head with the horizon mean, and ties break by original ' +
      'proposer order. The verifier never reads program text, so separating candidates is the dynamics ' +
      'model’s job.',
    spec: [
      ['Top-1 success', '0.63'],
      ['Selector efficiency η', '0.40'],
      ['95% CI', '0.22–0.58'],
      ['Exact McNemar', 'p < 0.001']
    ]
  },
  execute: {
    eyebrow: 'Stage 4 of 4',
    title: 'Execute',
    lead: 'Only the first few primitive calls of the winner are committed.',
    body: 'An iterative Cartesian tracker on delta end-effector control follows move_to targets to 2 cm ' +
      'tolerance. The executor commits κ primitive calls, then the loop re-observes and replans, up to N ' +
      'rounds inside a hard 600-step ceiling. Program length and environment-step cost are decoupled: one ' +
      'primitive expands into many low-level actions.',
    spec: [
      ['Commit length κ', '2 primitives'],
      ['Mean planning rounds', '3.1'],
      ['Mean env. steps', '410'],
      ['Step ceiling T_max', '600']
    ]
  }
};

function setupLoop() {
  var buttons = document.querySelectorAll('.ai-stage');
  var detail = document.getElementById('ai-loop-detail');
  if (!buttons.length || !detail) return;

  var el = {
    eyebrow: detail.querySelector('.ai-loop-eyebrow'),
    title: detail.querySelector('h3'),
    lead: detail.querySelector('.ai-loop-lead'),
    body: detail.querySelector('.ai-loop-body'),
    spec: detail.querySelector('.ai-loop-spec')
  };

  function show(key, button) {
    var stage = LOOP_STAGES[key];
    if (!stage) return;

    buttons.forEach(function (b) {
      var active = b === button;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    detail.style.setProperty('--stage-c', 'var(--stage-' + key + ')');
    el.eyebrow.textContent = stage.eyebrow;
    el.title.textContent = stage.title;
    el.lead.textContent = stage.lead;
    el.body.textContent = stage.body;
    el.spec.innerHTML = stage.spec.map(function (pair) {
      return '<div><span class="ai-spec-label">' + pair[0] +
        '</span><span class="ai-spec-val">' + pair[1] + '</span></div>';
    }).join('');
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { show(button.dataset.stage, button); });
  });

  show('propose', buttons[0]);
}

/* ------------------------------------------------------------------
   LIBERO-PRO matrix (paper Table II)
   Normalized success in [0, 1]; null is an unavailable cell (a dash in
   the paper). Avg. SR is the row average over its own reported cells.
   ------------------------------------------------------------------ */
var PRO_AXES = ['obj', 'pos', 'sem', 'task', 'env'];

var PRO_SUITES = [
  { key: 'goal', label: 'LIBERO Goal' },
  { key: 'spatial', label: 'LIBERO Spatial' },
  { key: 'libero10', label: 'LIBERO 10' },
  { key: 'object', label: 'LIBERO Object' }
];

var PRO_METHODS = [
  {
    name: 'OpenVLA', avg: 0.52,
    goal: [0.96, 0.00, 0.98, 0.00, 0.98],
    spatial: [0.97, 0.00, 0.97, 0.00, 0.89],
    libero10: [0.81, 0.00, 0.96, 0.00, 0.85],
    object: [0.98, 0.00, 0.98, 0.00, 0.00]
  },
  {
    name: '&pi;<sub>0</sub>', avg: 0.44,
    goal: [0.94, 0.00, 0.93, 0.00, 0.39],
    spatial: [0.95, 0.00, 0.97, 0.00, 0.60],
    libero10: [0.79, 0.00, 0.82, 0.00, 0.27],
    object: [0.94, 0.00, 0.90, 0.00, 0.29]
  },
  {
    name: '&pi;<sub>0.5</sub>', avg: 0.53,
    goal: [0.97, 0.38, 0.97, 0.00, 0.46],
    spatial: [0.97, 0.20, 0.97, 0.01, 0.46],
    libero10: [0.92, 0.08, 0.93, 0.01, 0.46],
    object: [0.98, 0.17, 0.96, 0.01, 0.73]
  },
  {
    // Program-emitting comparator; unreported axes stay as dashes.
    name: 'Code as Policy', avg: 0.39,
    goal: [0.80, 0.26, null, 0.17, 0.76],
    spatial: [null, 0.12, null, 0.14, null],
    libero10: [null, null, null, null, null],
    object: [0.82, 0.22, null, 0.18, null]
  },
  {
    name: 'UniVLA', avg: 0.03,
    goal: [null, 0.10, null, 0.00, null],
    spatial: [null, 0.10, null, 0.00, null],
    libero10: [null, 0.00, null, 0.00, null],
    object: [null, 0.00, null, 0.00, null]
  },
  {
    name: 'AtomVLA', avg: 0.48,
    goal: [0.81, 0.02, 0.98, 0.11, null],
    spatial: [0.95, 0.16, 0.95, 0.01, null],
    libero10: [0.55, 0.01, 0.95, 0.09, null],
    object: [0.93, 0.10, 0.99, 0.00, null]
  },
  {
    name: 'MolmoAct', avg: 0.41,
    goal: [0.68, 0.00, 0.85, 0.00, null],
    spatial: [0.90, 0.00, 0.88, 0.00, null],
    libero10: [0.54, 0.00, 0.74, 0.06, null],
    object: [0.92, 0.06, 0.96, 0.00, null]
  },
  {
    name: 'NORA', avg: 0.39,
    goal: [0.58, 0.00, 0.88, 0.00, null],
    spatial: [0.92, 0.00, 0.91, 0.00, null],
    libero10: [0.46, 0.00, 0.74, 0.00, null],
    object: [0.86, 0.00, 0.92, 0.00, null]
  },
  {
    name: 'X-VLA', avg: 0.46,
    goal: [0.68, 0.01, 0.98, 0.09, null],
    spatial: [0.97, 0.00, 0.96, 0.00, null],
    libero10: [0.62, 0.00, 0.95, 0.10, null],
    object: [0.89, 0.02, 0.98, 0.08, null]
  },
  {
    name: 'Agentic Intelligence', ours: true, avg: 0.64,
    goal: [0.89, 0.43, 0.91, 0.27, 0.84],
    spatial: [0.92, 0.50, 0.73, 0.49, 0.55],
    libero10: [0.94, 0.29, 0.88, 0.16, 0.89],
    object: [0.76, 0.35, 0.92, 0.19, 0.94]
  }
];

function setupProTable() {
  var table = document.getElementById('ai-pro-table');
  var picker = document.getElementById('ai-suite-picker');
  if (!table || !picker) return;

  var tbody = table.tBodies[0];
  var headers = Array.prototype.slice.call(table.querySelectorAll('th.ai-sortable'));
  var state = { suite: 'spatial', index: -1, ascending: false };

  function cell(value, isAvg) {
    if (value === null || value === undefined) {
      return '<td class="ai-na"' + (isAvg ? ' data-v="-1"' : ' data-v="-1"') + '>&ndash;</td>';
    }
    // Shade by value so the Position and Task columns read at a glance.
    var heat = (0.08 + 0.62 * value).toFixed(3);
    return '<td class="ai-heat' + (isAvg ? ' ai-col-avg' : '') + '" data-v="' + value +
      '" style="--heat:' + heat + '"><span class="ai-v">' + value.toFixed(2) + '</span></td>';
  }

  function render() {
    tbody.innerHTML = PRO_METHODS.map(function (m) {
      var values = m[state.suite];
      return '<tr' + (m.ours ? ' class="ai-ours"' : '') + '>' +
        '<th scope="row">' + m.name +
        (m.ours ? ' <span class="ai-ours-tag">Ours</span>' : '') + '</th>' +
        values.map(function (v) { return cell(v, false); }).join('') +
        cell(m.avg, true) +
      '</tr>';
    }).join('');

    if (state.index >= 0) applySort();
  }

  function applySort() {
    var rows = Array.prototype.slice.call(tbody.rows);
    rows.sort(function (a, b) {
      var result;
      if (state.index === 0) {
        result = a.cells[0].textContent.trim().localeCompare(b.cells[0].textContent.trim());
      } else {
        result = parseFloat(a.cells[state.index].dataset.v) - parseFloat(b.cells[state.index].dataset.v);
      }
      return state.ascending ? result : -result;
    });
    rows.forEach(function (row) { tbody.appendChild(row); });
  }

  headers.forEach(function (header, index) {
    header.addEventListener('click', function () {
      // Same column toggles direction; a new column starts high-to-low for
      // numbers and A-to-Z for the method name.
      if (state.index === index) {
        state.ascending = !state.ascending;
      } else {
        state.index = index;
        state.ascending = index === 0;
      }

      applySort();

      headers.forEach(function (h, i) {
        h.classList.toggle('is-sorted', i === index);
        var icon = h.querySelector('i');
        if (!icon) return;
        icon.className = i !== index ? 'fas fa-sort' : (state.ascending ? 'fas fa-sort-up' : 'fas fa-sort-down');
      });
    });
  });

  picker.querySelectorAll('.ai-tab').forEach(function (button) {
    button.addEventListener('click', function () {
      picker.querySelectorAll('.ai-tab').forEach(function (b) {
        var active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      state.suite = button.dataset.suite;
      render();
    });
  });

  render();
}

/* ------------------------------------------------------------------
   Decision-rule comparison (paper Table IV, panel a)
   ------------------------------------------------------------------ */
var RULES = {
  ranker: {
    name: 'Latent ranker',
    detail: 'K = 3 candidates, imagined and scored; the highest-scoring program wins.',
    pos: 0.50, task: 0.49, delta: null, rounds: '3.1', commit: '2', steps: '410', invalid: '1.8%'
  },
  first: {
    name: 'First valid',
    detail: 'K = 3 candidates, but the first one that parses is executed. No imagination, no scoring.',
    pos: 0.45, task: 0.44, delta: -0.050, rounds: '3.3', commit: '2', steps: '438', invalid: '1.8%'
  },
  random: {
    name: 'Uniform random',
    detail: 'K = 3 candidates, one picked uniformly at random from the valid set.',
    pos: 0.44, task: 0.43, delta: -0.060, rounds: '3.4', commit: '2', steps: '447', invalid: '1.8%'
  },
  oneshot: {
    name: 'One-shot program',
    detail: 'K = 1, N = 1, no verifier and no replanning. Measures the program interface alone.',
    pos: 0.38, task: 0.37, delta: -0.120, rounds: '1.0', commit: '|p|', steps: '330', invalid: '4.0%'
  }
};

function setupRuleBuilder() {
  var buttons = document.querySelectorAll('.ai-rule');
  if (!buttons.length) return;

  var el = {
    name: document.getElementById('ai-rule-name'),
    detail: document.getElementById('ai-rule-detail'),
    pos: document.getElementById('ai-m-pos'),
    task: document.getElementById('ai-m-task'),
    barPos: document.getElementById('ai-b-pos'),
    barTask: document.getElementById('ai-b-task'),
    rounds: document.getElementById('ai-m-rounds'),
    commit: document.getElementById('ai-m-commit'),
    steps: document.getElementById('ai-m-steps'),
    invalid: document.getElementById('ai-m-invalid'),
    delta: document.getElementById('ai-delta')
  };

  function show(key, button) {
    var rule = RULES[key];
    if (!rule) return;

    buttons.forEach(function (b) {
      var active = b === button;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    el.name.textContent = rule.name;
    el.detail.textContent = rule.detail;
    el.pos.textContent = rule.pos.toFixed(2);
    el.task.textContent = rule.task.toFixed(2);
    el.barPos.style.width = (rule.pos * 100) + '%';
    el.barTask.style.width = (rule.task * 100) + '%';
    el.rounds.textContent = rule.rounds;
    el.commit.textContent = rule.commit;
    el.steps.textContent = rule.steps;
    el.invalid.textContent = rule.invalid;

    if (rule.delta === null) {
      el.delta.textContent = 'Reference row: the full closed loop. Switch rules to see what each ' +
        'component of the loop is worth.';
    } else {
      el.delta.textContent = rule.delta.toFixed(3) + ' average success against the full loop, at ' +
        rule.steps + ' mean environment steps.';
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { show(button.dataset.rule, button); });
  });

  show('ranker', buttons[0]);
}

/* ------------------------------------------------------------------
   Grow-on-scroll bars: selector ladder and grouped charts
   ------------------------------------------------------------------ */
function setupGrowables() {
  document.querySelectorAll('.ai-ladder').forEach(function (ladder) {
    onFirstView(ladder, function () {
      ladder.querySelectorAll('.ai-rung').forEach(function (rung, i) {
        setTimeout(function () { rung.classList.add('is-grown'); }, i * 70);
      });
    });
  });

  document.querySelectorAll('.ai-chart').forEach(function (chart) {
    onFirstView(chart, function () {
      chart.querySelectorAll('.ai-col').forEach(function (col) { col.classList.add('is-grown'); });
    });
  });
}

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupCounters();
  setupTabs();
  setupLightbox();
  setupLoop();
  setupProTable();
  setupRuleBuilder();
  setupGrowables();
});
