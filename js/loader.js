// =========================================================================
// محرك التحميل الكسول للمناهج والرسوم التوضيحية وبنوك الاختبارات (Lazy Loader)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

window.CurriculumLoader = (() => {
  const loadedScripts = new Set();
  const inFlight = new Map();
  let activeLoads = 0;

  const MODE_TO_CURR_ID = {
    en: 3,
    english: 3,
    ar: 4,
    arabic: 4,
    arabic_p1: 4,
    arabic_p2: 5,
    is: 6,
    islamic: 6,
    phy: 7,
    physics: 7,
    math: 8,
    soc: 9,
    social: 9,
    chem: 10,
    chemistry: 10,
    bio: 11,
    biology: 11
  };

  const DIAGRAM_SPECS = {
    physics: { currId: 7, script: 'curriculum_diagrams_physics.js', globalKey: 'PHYSICS_DIAGRAMS', label: 'رسوم الفيزياء التوضيحية' },
    chemistry: { currId: 10, script: 'curriculum_diagrams_chemistry.js', globalKey: 'CHEMISTRY_DIAGRAMS', label: 'رسوم الكيمياء التوضيحية' },
    biology: { currId: 11, script: 'curriculum_diagrams_biology.js', globalKey: 'BIOLOGY_DIAGRAMS', label: 'رسوم علم الأحياء التوضيحية' }
  };

  function resolveCurrId(currOrMode) {
    if (typeof currOrMode === 'number' && !Number.isNaN(currOrMode)) return currOrMode;
    const raw = String(currOrMode || '').trim().toLowerCase();
    if (/^\d+$/.test(raw)) return Number(raw);
    return MODE_TO_CURR_ID[raw] || 3;
  }

  function getMetaById(currId) {
    return (typeof BUILTIN_CURRICULA_META !== 'undefined' ? BUILTIN_CURRICULA_META : []).find(m => m.id === Number(currId)) || null;
  }

  function showToast(label) {
    activeLoads++;
    const toast = document.getElementById('lazyLoadToast');
    if (toast) {
      toast.innerHTML = `<span class="lazy-spinner"></span><span>جارٍ تحميل ${escapeHtml(label || 'بيانات المادة')}...</span>`;
      toast.classList.remove('hidden');
    }
  }

  function hideToast() {
    activeLoads = Math.max(0, activeLoads - 1);
    if (activeLoads === 0) {
      const toast = document.getElementById('lazyLoadToast');
      if (toast) toast.classList.add('hidden');
    }
  }

  function loadScript(src, globalCheckKey) {
    if (globalCheckKey && window[globalCheckKey]) {
      loadedScripts.add(src);
      return Promise.resolve(true);
    }
    if (loadedScripts.has(src)) {
      return Promise.resolve(true);
    }
    if (inFlight.has(src)) {
      return inFlight.get(src);
    }

    const promise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        loadedScripts.add(src);
        inFlight.delete(src);
        resolve(true);
      };
      script.onerror = () => {
        inFlight.delete(src);
        if (script.parentNode) script.parentNode.removeChild(script);
        console.warn('[CurriculumLoader] Failed to load script:', src);
        resolve(false);
      };
      document.head.appendChild(script);
    });

    inFlight.set(src, promise);
    return promise;
  }

  function isCurriculumLoaded(currOrMode) {
    const id = resolveCurrId(currOrMode);
    if (!BUILTIN_CURRICULUM_IDS.has(id)) return true;
    const meta = getMetaById(id);
    if (!meta) return true;
    const dataReady = Boolean(window[meta.globalKey]);
    const diagReady = !meta.diagramsGlobalKey || Boolean(window[meta.diagramsGlobalKey]);
    return dataReady && diagReady;
  }

  function isDiagramsLoaded(subjectKey) {
    const spec = DIAGRAM_SPECS[String(subjectKey || '').toLowerCase()];
    if (!spec) return true;
    return Boolean(window[spec.globalKey]);
  }

  function isQuizzesLoaded() {
    return Boolean(window.CHAPTER_QUIZZES);
  }

  async function ensureCurriculumLoaded(currOrMode, options = {}) {
    const { includeDiagrams = true, silent = false } = options;
    const id = resolveCurrId(currOrMode);
    if (!BUILTIN_CURRICULUM_IDS.has(id)) return true;

    const meta = getMetaById(id);
    if (!meta) return true;

    const tasks = [];
    if (!window[meta.globalKey]) {
      for (const s of (meta.scripts || [])) {
        tasks.push(loadScript(s, meta.globalKey));
      }
    }
    if (includeDiagrams && meta.diagramsScript && !window[meta.diagramsGlobalKey]) {
      tasks.push(loadScript(meta.diagramsScript, meta.diagramsGlobalKey));
    }

    if (tasks.length === 0) {
      if (typeof hydrateCurriculumChapters === 'function') hydrateCurriculumChapters(id);
      return true;
    }

    if (!silent) showToast(meta.subject || meta.name);
    try {
      const results = await Promise.all(tasks);
      const ok = results.every(Boolean);
      if (ok && typeof hydrateCurriculumChapters === 'function') {
        hydrateCurriculumChapters(id);
      }
      return ok;
    } finally {
      if (!silent) hideToast();
    }
  }

  async function ensureDiagramsLoaded(subjectKey, options = {}) {
    const { silent = false } = options;
    const spec = DIAGRAM_SPECS[String(subjectKey || '').toLowerCase()];
    if (!spec) return false;
    if (window[spec.globalKey]) return true;

    if (!silent) showToast(spec.label);
    try {
      return await loadScript(spec.script, spec.globalKey);
    } finally {
      if (!silent) hideToast();
    }
  }

  async function ensureQuizzesLoaded(options = {}) {
    const { silent = false } = options;
    if (window.CHAPTER_QUIZZES) return true;

    if (!silent) showToast('بنك الاختبارات التفاعلية (640 سؤالاً)');
    try {
      return await loadScript('curriculum_chapter_quizzes.js', 'CHAPTER_QUIZZES');
    } finally {
      if (!silent) hideToast();
    }
  }

  async function ensureAllSearchAssets(options = {}) {
    const { includeQuizzes = true, includeDiagrams = true, onProgress = null } = options;
    const assetMap = new Map();

    (typeof BUILTIN_CURRICULA_META !== 'undefined' ? BUILTIN_CURRICULA_META : []).forEach(meta => {
      (meta.scripts || []).forEach(src => {
        if (!assetMap.has(src)) {
          const isArabicShared = src === 'curriculum_data_arabic.js';
          assetMap.set(src, {
            src,
            globalKey: meta.globalKey,
            label: isArabicShared ? 'اللغة العربية (الجزءان 1 و 2)' : (meta.subject || meta.name)
          });
        }
      });
    });

    if (includeDiagrams) {
      Object.values(DIAGRAM_SPECS).forEach(spec => {
        if (!assetMap.has(spec.script)) {
          assetMap.set(spec.script, {
            src: spec.script,
            globalKey: spec.globalKey,
            label: spec.label
          });
        }
      });
    }

    if (includeQuizzes && !assetMap.has('curriculum_chapter_quizzes.js')) {
      assetMap.set('curriculum_chapter_quizzes.js', {
        src: 'curriculum_chapter_quizzes.js',
        globalKey: 'CHAPTER_QUIZZES',
        label: 'بنك الاختبارات التفاعلية (640 سؤالاً)'
      });
    }

    const allAssets = Array.from(assetMap.values());
    const total = allAssets.length;
    let done = 0;
    const pending = [];

    for (const item of allAssets) {
      if ((item.globalKey && window[item.globalKey]) || loadedScripts.has(item.src)) {
        done++;
      } else {
        pending.push(item);
      }
    }

    if (typeof onProgress === 'function') {
      try { onProgress(done, total, pending[0] ? pending[0].label : ''); } catch {}
    }

    if (pending.length === 0) {
      if (typeof hydrateCurriculumChapters === 'function') {
        [3, 4, 6, 7, 8, 9, 10, 11].forEach(id => hydrateCurriculumChapters(id));
      }
      return true;
    }

    const results = await Promise.all(pending.map(async (item) => {
      const ok = await loadScript(item.src, item.globalKey);
      done++;
      if (typeof onProgress === 'function') {
        try { onProgress(done, total, item.label); } catch {}
      }
      return ok;
    }));

    if (typeof hydrateCurriculumChapters === 'function') {
      [3, 4, 6, 7, 8, 9, 10, 11].forEach(id => hydrateCurriculumChapters(id));
    }
    return results.every(Boolean);
  }

  function renderLoadingHTML(label) {
    return `
      <div class="lazy-loading-card">
        <div class="lazy-spinner" aria-hidden="true"></div>
        <div style="font-weight: 800; font-size: 0.95rem; color: var(--slate-800);">جارٍ تحميل ${escapeHtml(label || 'بيانات المنهج')}...</div>
        <div style="font-size: 0.78rem; color: var(--slate-500);">يُحمَّل كل منهج عند الطلب لتسريع الإقلاع وتوفير الذاكرة</div>
      </div>
    `;
  }

  function renderErrorHTML(label, retryOnClick) {
    const retryBtn = retryOnClick
      ? `<button type="button" class="btn btn-primary btn-sm" onclick="${retryOnClick}">🔄 إعادة المحاولة</button>`
      : '';
    return `
      <div class="lazy-loading-card" style="border-color: #fca5a5; background: #fef2f2;">
        <div style="font-size: 1.6rem;">⚠️</div>
        <div style="font-weight: 800; font-size: 0.95rem; color: #991b1b;">تعذر تحميل ${escapeHtml(label || 'بيانات المادة')}</div>
        <div style="font-size: 0.78rem; color: #b91c1c;">تحقق من اتصالك أو من توفر الملف ثم أعد المحاولة.</div>
        ${retryBtn}
      </div>
    `;
  }

  return {
    resolveCurrId,
    loadScript,
    isCurriculumLoaded,
    isDiagramsLoaded,
    isQuizzesLoaded,
    ensureCurriculumLoaded,
    ensureDiagramsLoaded,
    ensureQuizzesLoaded,
    ensureAllSearchAssets,
    renderLoadingHTML,
    renderErrorHTML
  };
})();
