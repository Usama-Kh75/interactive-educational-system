// =========================================================================
// محرك البحث الشامل الموحّد عبر المناهج التسعة والبنوك المعرفية (Global Search)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

window.GlobalSearch = (() => {
  const RECENT_SEARCHES_KEY = 'recent_searches';
  const MAX_RECENT_SEARCHES = 6;
  const MAX_RESULTS = 40;

  const SUBJECT_META = {
    3: { label: 'الإنجليزية', icon: '📘', color: '#4338ca', bg: '#eef2ff' },
    4: { label: 'العربية ج1', icon: '📙', color: '#059669', bg: '#ecfdf5' },
    5: { label: 'العربية ج2', icon: '📗', color: '#047857', bg: '#f0fdf4' },
    6: { label: 'الإسلامية', icon: '🕌', color: '#0d9488', bg: '#f0fdfa' },
    7: { label: 'الفيزياء', icon: '⚛️', color: '#0284c7', bg: '#f0f9ff' },
    8: { label: 'الرياضيات', icon: '📐', color: '#7e22ce', bg: '#faf5ff' },
    9: { label: 'الاجتماعيات', icon: '🌍', color: '#b45309', bg: '#fffbeb' },
    10: { label: 'الكيمياء', icon: '🧪', color: '#059669', bg: '#ecfdf5' },
    11: { label: 'علم الأحياء', icon: '🧬', color: '#16a34a', bg: '#f0fdf4' }
  };

  const TYPE_META = {
    lesson: { label: 'درس ومقطع', icon: '📖', cls: 'type-lesson' },
    rule: { label: 'قاعدة ومفهوم', icon: '💡', cls: 'type-rule' },
    diagram: { label: 'رسم توضيحي', icon: '🔬', cls: 'type-diagram' },
    quiz: { label: 'سؤال اختبار', icon: '🎯', cls: 'type-quiz' },
    page: { label: 'صفحة كتاب', icon: '📄', cls: 'type-page' }
  };

  const QUICK_SUGGESTIONS = [
    'قوانين نيوتن',
    'الميزان الصرفي',
    'المد العارض',
    'فيثاغورس',
    'الرابطة التساهمية',
    'الطليعيات',
    'Passive Voice',
    'وثيقة المدينة'
  ];

  const indexedSources = new Set();
  const entries = [];
  let customEntries = [];

  let currentQuery = '';
  let currentSubjectFilter = 'all';
  let currentTypeFilter = 'all';
  let currentResults = [];
  let selectedResultIndex = -1;
  let searchDebounceTimer = null;
  let isBatchLoading = false;
  let initialized = false;

  function stripHtml(str) {
    return String(str || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function buildArabicTokenRegexPattern(normToken) {
    if (!normToken) return '';
    const diacritics = '[\\u064B-\\u065F\\u0670\\u0640]*';
    let pattern = '';
    for (const ch of normToken) {
      if (ch === 'ا') pattern += `[إأآٱا]${diacritics}`;
      else if (ch === 'ه') pattern += `[ةه]${diacritics}`;
      else if (ch === 'ي') pattern += `[ىئي]${diacritics}`;
      else if (ch === 'و') pattern += `[ؤو]${diacritics}`;
      else pattern += `${escapeRegExp(ch)}${diacritics}`;
    }
    return pattern;
  }

  function highlightMatches(rawText, query) {
    const text = stripHtml(rawText);
    if (!text) return '';
    const normQ = normalizeArabicSearchText(query);
    if (!normQ) return escapeHtml(text);

    const tokens = [...new Set(normQ.split(' ').filter(t => t.length >= 1))].sort((a, b) => b.length - a.length);
    const patterns = tokens.map(buildArabicTokenRegexPattern).filter(Boolean);
    if (patterns.length === 0) return escapeHtml(text);

    let regex;
    try {
      regex = new RegExp(`(${patterns.join('|')})`, 'gi');
    } catch {
      return escapeHtml(text);
    }

    let out = '';
    let lastIdx = 0;
    let matchCount = 0;
    for (const m of text.matchAll(regex)) {
      if (matchCount >= 18) break;
      const start = m.index || 0;
      const val = m[0];
      if (!val) continue;
      out += escapeHtml(text.slice(lastIdx, start));
      out += `<mark class="search-hit">${escapeHtml(val)}</mark>`;
      lastIdx = start + val.length;
      matchCount++;
    }
    out += escapeHtml(text.slice(lastIdx));
    return out;
  }

  function buildSnippet(fullText, query, maxLen = 155) {
    const clean = stripHtml(fullText);
    if (!clean) return '';
    if (clean.length <= maxLen) return clean;

    const normQ = normalizeArabicSearchText(query);
    const firstTok = normQ.split(' ').filter(Boolean)[0] || '';
    if (!firstTok) return clean.slice(0, maxLen) + '...';

    let matchPos = -1;
    try {
      const re = new RegExp(buildArabicTokenRegexPattern(firstTok), 'i');
      const m = clean.match(re);
      if (m && typeof m.index === 'number') matchPos = m.index;
    } catch {}

    if (matchPos === -1 || matchPos < 50) {
      return clean.slice(0, maxLen) + '...';
    }
    const start = Math.max(0, matchPos - 45);
    const slice = clean.slice(start, start + maxLen);
    return (start > 0 ? '...' : '') + slice + (start + maxLen < clean.length ? '...' : '');
  }

  function extractChunkPlainText(ch) {
    const parts = [];
    if (ch.heading) parts.push(ch.heading);
    if (ch.text || ch.content_text) parts.push(ch.text || ch.content_text);
    if (Array.isArray(ch.exercises)) {
      ch.exercises.forEach(ex => {
        if (ex.num) parts.push(ex.num);
        if (ex.title) parts.push(ex.title);
        if (ex.title_ar) parts.push(ex.title_ar);
        if (Array.isArray(ex.words_box) && ex.words_box.length > 0) {
          parts.push(ex.words_box.join(' '));
        }
        if (Array.isArray(ex.questions)) {
          ex.questions.forEach(qObj => {
            if (qObj.q) parts.push(qObj.q);
            if (qObj.q_ar) parts.push(qObj.q_ar);
            if (Array.isArray(qObj.options)) parts.push(qObj.options.join(' '));
            if (qObj.a) parts.push(qObj.a);
          });
        }
      });
    }
    return stripHtml(parts.join(' • '));
  }

  function createLessonEntry(currId, chap, les, ch, chunkIdx) {
    const title = les.title || chap.title || 'درس';
    const subtitleParts = [chap.title || ''];
    if (ch && ch.heading && ch.heading !== title) subtitleParts.push(ch.heading);
    const page = ch ? (ch.page || ch.page_number || '') : '';
    if (page) subtitleParts.push(`ص ${page}`);
    const subtitle = subtitleParts.filter(Boolean).join(' • ');
    const body = ch ? extractChunkPlainText(ch) : stripHtml(les.summary || '');

    return {
      type: 'lesson',
      currId: Number(currId),
      chapterId: chap.id,
      lessonId: les.id,
      chunkIdx: Number.isInteger(chunkIdx) ? chunkIdx : 0,
      page: page || null,
      title,
      subtitle,
      body,
      normTitle: normalizeArabicSearchText(title),
      normSub: normalizeArabicSearchText(`${subtitle} ${les.summary || ''}`),
      normAll: normalizeArabicSearchText(`${title} ${subtitle} ${les.summary || ''} ${body}`)
    };
  }

  function indexCurriculumArray(currId, chapters) {
    if (!Array.isArray(chapters)) return [];
    const list = [];
    chapters.forEach(chap => {
      (chap.lessons || []).forEach(les => {
        const chunks = Array.isArray(les.chunks) ? les.chunks : [];
        if (chunks.length === 0) {
          list.push(createLessonEntry(currId, chap, les, null, 0));
        } else {
          chunks.forEach((ch, idx) => {
            list.push(createLessonEntry(currId, chap, les, ch, idx));
          });
        }
      });
    });
    return list;
  }

  function indexRulesList(sourceKey, rulesArr, currIdResolver, grammarMode) {
    if (!Array.isArray(rulesArr) || indexedSources.has(sourceKey)) return;
    indexedSources.add(sourceKey);
    rulesArr.forEach((r, idx) => {
      const currId = typeof currIdResolver === 'function' ? currIdResolver(r) : currIdResolver;
      const title = r.title || `قاعدة ${idx + 1}`;
      const category = r.category || (r.unit ? `الوحدة ${r.unit}` : '');
      const pageTxt = r.page ? `ص ${r.page}` : '';
      const subtitle = [category, pageTxt].filter(Boolean).join(' • ');
      const examplesTxt = Array.isArray(r.examples)
        ? r.examples.map(ex => `${ex.en || ''} ${ex.ar || ''}`).join(' ')
        : '';
      const body = stripHtml([r.summary, r.explanation, r.details, r.formula, r.rule, examplesTxt].filter(Boolean).join(' • '));

      entries.push({
        type: 'rule',
        currId: Number(currId),
        grammarMode,
        ruleTitle: title,
        title,
        subtitle,
        body,
        normTitle: normalizeArabicSearchText(title),
        normSub: normalizeArabicSearchText(subtitle),
        normAll: normalizeArabicSearchText(`${title} ${subtitle} ${body}`)
      });
    });
  }

  function indexDiagramsList(sourceKey, diagArr, currId, diagramSubject) {
    if (!Array.isArray(diagArr) || indexedSources.has(sourceKey)) return;
    indexedSources.add(sourceKey);
    diagArr.forEach(d => {
      const title = d.title || 'رسم توضيحي';
      const subtitle = d.category || 'لوحة علمية متجهية';
      const kp = Array.isArray(d.keyPoints) ? d.keyPoints.join(' • ') : '';
      const body = stripHtml([d.summary, d.formula, kp].filter(Boolean).join(' • '));

      entries.push({
        type: 'diagram',
        currId: Number(currId),
        diagramSubject,
        diagramId: d.id,
        title,
        subtitle,
        body,
        normTitle: normalizeArabicSearchText(title),
        normSub: normalizeArabicSearchText(subtitle),
        normAll: normalizeArabicSearchText(`${title} ${subtitle} ${body}`)
      });
    });
  }

  function indexAllLoadedSources() {
    const builtinMap = [
      [3, 'CURRICULUM_DATA'],
      [4, 'ARABIC_CURRICULUM_P1'],
      [5, 'ARABIC_CURRICULUM_P2'],
      [6, 'ISLAMIC_CURRICULUM'],
      [7, 'PHYSICS_CURRICULUM'],
      [8, 'MATH_CURRICULUM'],
      [9, 'SOCIAL_CURRICULUM'],
      [10, 'CHEMISTRY_CURRICULUM'],
      [11, 'BIOLOGY_CURRICULUM']
    ];

    builtinMap.forEach(([currId, key]) => {
      const srcKey = `curr_${currId}`;
      if (!indexedSources.has(srcKey) && Array.isArray(window[key])) {
        indexedSources.add(srcKey);
        entries.push(...indexCurriculumArray(currId, window[key]));
      }
    });

    // فهرسة المناهج المخصصة المضافة من المستخدم (إن وجدت)
    customEntries = [];
    if (typeof appData !== 'undefined' && appData && Array.isArray(appData.curriculums)) {
      appData.curriculums.forEach(c => {
        if (c && !BUILTIN_CURRICULUM_IDS.has(Number(c.id)) && Array.isArray(c.chapters)) {
          customEntries.push(...indexCurriculumArray(c.id, c.chapters));
        }
      });
    }

    indexRulesList('rules_3', window.GRAMMAR_RULES, 3, 'en');
    indexRulesList('rules_ar', window.ARABIC_GRAMMAR_RULES, (r) => (r.category && r.category.includes('الجزء الثاني') ? 5 : 4), 'ar');
    indexRulesList('rules_6', window.ISLAMIC_RULES, 6, 'is');
    indexRulesList('rules_7', window.PHYSICS_RULES, 7, 'phy');
    indexRulesList('rules_8', window.MATH_RULES, 8, 'math');
    indexRulesList('rules_9', window.SOCIAL_TERMS_BANK, 9, 'social');
    indexRulesList('rules_10', window.CHEMISTRY_RULES, 10, 'chem');
    indexRulesList('rules_11', window.BIOLOGY_RULES, 11, 'bio');

    indexDiagramsList('diag_7', window.PHYSICS_DIAGRAMS, 7, 'physics');
    indexDiagramsList('diag_10', window.CHEMISTRY_DIAGRAMS, 10, 'chemistry');
    indexDiagramsList('diag_11', window.BIOLOGY_DIAGRAMS, 11, 'biology');

    if (!indexedSources.has('quizzes') && window.CHAPTER_QUIZZES) {
      indexedSources.add('quizzes');
      Object.entries(window.CHAPTER_QUIZZES).forEach(([cIdStr, chaptersMap]) => {
        const currId = Number(cIdStr);
        Object.entries(chaptersMap || {}).forEach(([chIdStr, quizObj]) => {
          const chapId = Number(chIdStr);
          const chapTitle = (quizObj && quizObj.title) || `الفصل ${chapId}`;
          (quizObj && quizObj.questions ? quizObj.questions : []).forEach((q, qIdx) => {
            const qText = stripHtml(q.question || '');
            const expText = stripHtml(q.explanation || '');
            const optsText = Array.isArray(q.options) ? q.options.join(' • ') : '';
            entries.push({
              type: 'quiz',
              currId,
              chapterId: chapId,
              questionId: q.id,
              title: qText || `سؤال ${qIdx + 1} - ${chapTitle}`,
              subtitle: `اختبار ${chapTitle}`,
              body: `${optsText}${expText ? ' • ' + expText : ''}`,
              normTitle: normalizeArabicSearchText(qText),
              normSub: normalizeArabicSearchText(chapTitle),
              normAll: normalizeArabicSearchText(`${qText} ${chapTitle} ${optsText} ${expText}`)
            });
          });
        });
      });
    }
  }

  function isEverythingIndexed() {
    const allBuiltinsLoaded = [3, 4, 5, 6, 7, 8, 9, 10, 11].every(id => CurriculumLoader.isCurriculumLoaded(id));
    return allBuiltinsLoaded && CurriculumLoader.isQuizzesLoaded();
  }

  function getRecentSearches() {
    try {
      const raw = lsGet(RECENT_SEARCHES_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(x => typeof x === 'string' && x.trim()) : [];
    } catch {
      return [];
    }
  }

  function saveRecentSearch(q) {
    const clean = String(q || '').trim();
    if (clean.length < 2) return;
    const prev = getRecentSearches().filter(item => item !== clean);
    const next = [clean, ...prev].slice(0, MAX_RECENT_SEARCHES);
    try {
      lsSet(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {}
  }

  function clearRecentSearches() {
    try {
      lsSet(RECENT_SEARCHES_KEY, '[]');
    } catch {}
    renderSearchUI();
  }

  function updateProgressBar(done, total, label) {
    const wrap = document.getElementById('globalSearchProgressWrap');
    const bar = document.getElementById('globalSearchProgressBar');
    const txt = document.getElementById('globalSearchProgressText');
    if (!wrap) return;
    if (done >= total) {
      wrap.classList.add('hidden');
      return;
    }
    wrap.classList.remove('hidden');
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = `${pct}%`;
    if (txt) {
      txt.innerText = label
        ? `جارٍ فهرسة المناهج وبنك الأسئلة (${done}/${total}): ${label}...`
        : `جارٍ تحميل الفهرس الشامل (${done}/${total})...`;
    }
  }

  async function ensureScopeLoaded(forceAll = false) {
    if (isBatchLoading) return;
    const scopeVal = forceAll ? 'all' : currentSubjectFilter;

    if (scopeVal !== 'all') {
      const currId = Number(scopeVal);
      const tasks = [];
      if (BUILTIN_CURRICULUM_IDS.has(currId) && !CurriculumLoader.isCurriculumLoaded(currId)) {
        tasks.push(CurriculumLoader.ensureCurriculumLoaded(currId, { silent: true }));
      }
      if ((currentTypeFilter === 'all' || currentTypeFilter === 'quiz') && !CurriculumLoader.isQuizzesLoaded()) {
        tasks.push(CurriculumLoader.ensureQuizzesLoaded({ silent: true }));
      }
      if (tasks.length === 0) return;
      isBatchLoading = true;
      updateProgressBar(0, tasks.length, 'بيانات المادة المختارة');
      try {
        await Promise.all(tasks);
      } finally {
        isBatchLoading = false;
        updateProgressBar(1, 1, '');
        indexAllLoadedSources();
        runSearch();
      }
      return;
    }

    if (isEverythingIndexed()) return;
    isBatchLoading = true;
    try {
      await CurriculumLoader.ensureAllSearchAssets({
        includeQuizzes: true,
        includeDiagrams: true,
        onProgress: (done, total, label) => updateProgressBar(done, total, label)
      });
    } finally {
      isBatchLoading = false;
      updateProgressBar(1, 1, '');
      indexAllLoadedSources();
      runSearch();
    }
  }

  function detectPageJumpEntry(query) {
    const trimmed = String(query || '').trim();
    const m = trimmed.match(/^(?:ص|صفح[ةه]|page|p\.?)\s*(\d+)$/i);
    if (!m) return null;
    const pageNum = parseInt(m[1], 10);
    const targetCurrId = currentSubjectFilter !== 'all'
      ? Number(currentSubjectFilter)
      : (Number(appData && appData.currentCurriculumId) || 3);
    const maxPages = typeof getCurriculumMaxPages === 'function' ? getCurriculumMaxPages(targetCurrId, 'student') : 140;
    if (pageNum < 1 || pageNum > maxPages) return null;

    const meta = SUBJECT_META[targetCurrId] || { label: 'الكتاب الحالي', icon: '📖' };
    return {
      type: 'page',
      currId: targetCurrId,
      pageNum,
      title: `الانتقال المباشر إلى صفحة (${pageNum}) في ${meta.label}`,
      subtitle: `المكتبة الرقمية وتصفح الصفحات الأصلية (1 - ${maxPages})`,
      body: `افتح صفحة ${pageNum} في عارض الكتاب المدرسي للمادة المختارة.`,
      score: 999
    };
  }

  function scoreAndFilter(query) {
    const normQ = normalizeArabicSearchText(query);
    if (!normQ) {
      return { items: [], counts: { all: 0, lesson: 0, rule: 0, diagram: 0, quiz: 0 } };
    }
    const tokens = normQ.split(' ').filter(Boolean);
    const activeCurrId = Number((typeof appData !== 'undefined' && appData && appData.currentCurriculumId) || 3);
    const subjFilter = currentSubjectFilter === 'all' ? null : Number(currentSubjectFilter);
    const pool = entries.concat(customEntries);

    const matchedBySubject = [];
    const counts = { all: 0, lesson: 0, rule: 0, diagram: 0, quiz: 0 };

    for (let i = 0; i < pool.length; i++) {
      const item = pool[i];
      if (subjFilter !== null) {
        if (subjFilter === 4 || subjFilter === 5) {
          if (item.currId !== subjFilter && !(item.type === 'rule' && item.grammarMode === 'ar')) continue;
        } else if (item.currId !== subjFilter) {
          continue;
        }
      }

      let allTokensMatch = true;
      for (let t = 0; t < tokens.length; t++) {
        if (!item.normAll.includes(tokens[t])) {
          allTokensMatch = false;
          break;
        }
      }
      if (!allTokensMatch) continue;

      let score = 10;
      if (item.normTitle === normQ) score += 100;
      else if (item.normTitle.includes(normQ)) score += 60;
      else if (tokens.every(tok => item.normTitle.includes(tok))) score += 40;
      if (item.normSub.includes(normQ)) score += 25;
      if (item.currId === activeCurrId) score += 5;

      counts.all++;
      if (counts[item.type] !== undefined) counts[item.type]++;

      if (currentTypeFilter === 'all' || item.type === currentTypeFilter) {
        matchedBySubject.push({ item, score });
      }
    }

    matchedBySubject.sort((a, b) => b.score - a.score);
    const items = matchedBySubject.slice(0, MAX_RESULTS).map(m => m.item);

    const pageJump = detectPageJumpEntry(query);
    if (pageJump && (currentTypeFilter === 'all')) {
      items.unshift(pageJump);
      counts.all++;
    }

    return { items, counts };
  }

  function renderTypeFilterPills(counts) {
    const container = document.getElementById('globalSearchTypeFilters');
    if (!container) return;
    const filters = [
      ['all', '🌐 الكل', counts.all],
      ['lesson', '📖 الدروس والمقاطع', counts.lesson],
      ['rule', '💡 القواعد والمفاهيم', counts.rule],
      ['diagram', '🔬 الرسوم التوضيحية', counts.diagram],
      ['quiz', '🎯 أسئلة الاختبارات', counts.quiz]
    ];
    container.innerHTML = filters.map(([key, label, cnt]) => {
      const isActive = currentTypeFilter === key;
      const badgeHtml = currentQuery.trim() ? ` <span class="search-type-count">${cnt}</span>` : '';
      return `
        <button type="button" class="search-type-pill ${isActive ? 'active' : ''}" aria-pressed="${isActive ? 'true' : 'false'}" onclick="GlobalSearch.setTypeFilter('${key}')">
          <span>${label}</span>${badgeHtml}
        </button>
      `;
    }).join('');
  }

  function renderIdleState(resultsEl, statusEl) {
    renderTypeFilterPills({ all: 0, lesson: 0, rule: 0, diagram: 0, quiz: 0 });
    const indexedCount = entries.length + customEntries.length;
    const allReady = isEverythingIndexed();

    if (statusEl) {
      statusEl.innerHTML = allReady
        ? `<span>✅ الفهرس الشامل مكتمل (${indexedCount.toLocaleString('en-US')} عنصراً عبر المواد الـ 9 وبنك الأسئلة).</span>`
        : `<span>⚡ المفهرس حالياً: <strong>${indexedCount.toLocaleString('en-US')}</strong> عنصراً • <button type="button" class="search-inline-link" onclick="GlobalSearch.indexAllNow()">تحميل وفهرسة كافة المواد الـ 9 الآن</button></span>`;
    }

    const recent = getRecentSearches();
    let html = '';

    if (recent.length > 0) {
      html += `
        <div class="search-idle-section">
          <div class="search-idle-header">
            <span>🕒 عمليات البحث الأخيرة</span>
            <button type="button" class="search-inline-link" onclick="GlobalSearch.clearRecent()">مسح السجل</button>
          </div>
          <div class="search-chips-wrap">
            ${recent.map(term => `
              <button type="button" class="search-suggestion-chip" data-term="${escapeHtml(term)}" onclick="GlobalSearch.applyQuery(this.getAttribute('data-term'))">
                <span>🔍</span> ${escapeHtml(term)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `
      <div class="search-idle-section">
        <div class="search-idle-header">
          <span>✨ اقتراحات سريعة للبحث عبر المناهج</span>
        </div>
        <div class="search-chips-wrap">
          ${QUICK_SUGGESTIONS.map(term => `
            <button type="button" class="search-suggestion-chip" data-term="${escapeHtml(term)}" onclick="GlobalSearch.applyQuery(this.getAttribute('data-term'))">
              <span>⚡</span> ${escapeHtml(term)}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="search-tip-box">
        💡 <strong>تلميح ذكي:</strong> يمكنك البحث بدون حركات التشكيل (مثل <code>الميزان الصرفي</code> أو <code>نيوتن</code>)، أو القفز المباشر لصفحة كتاب بكتابة <code>ص 45</code>.
      </div>
    `;

    resultsEl.innerHTML = html;
    currentResults = [];
    selectedResultIndex = -1;
  }

  function renderSearchUI() {
    const resultsEl = document.getElementById('globalSearchResults');
    const statusEl = document.getElementById('globalSearchStatusBar');
    if (!resultsEl) return;

    const trimmed = currentQuery.trim();
    if (!trimmed) {
      renderIdleState(resultsEl, statusEl);
      return;
    }

    const { items, counts } = scoreAndFilter(trimmed);
    currentResults = items;
    renderTypeFilterPills(counts);

    if (statusEl) {
      if (isBatchLoading) {
        statusEl.innerHTML = `<span>⏳ جارٍ استكمال فهرسة بقية المواد... النتائج المعروضة حتى الآن: <strong>${items.length}</strong></span>`;
      } else {
        const shownNote = counts.all > MAX_RESULTS ? ` (يُعرض أفضل ${MAX_RESULTS})` : '';
        statusEl.innerHTML = `<span>🎯 تم العثور على <strong>${counts.all}</strong> نتيجة مطابقة${shownNote}</span>`;
      }
    }

    if (items.length === 0) {
      selectedResultIndex = -1;
      resultsEl.innerHTML = `
        <div class="search-empty-state">
          <div style="font-size: 2rem; margin-bottom: 0.4rem;">🔎</div>
          <div style="font-weight: 800; color: var(--slate-800); margin-bottom: 0.25rem;">لم يُعثر على نتائج مطابقة لـ «${escapeHtml(trimmed)}»</div>
          <div style="font-size: 0.8rem; color: var(--slate-500);">جرّب كلمات أقصر أو اختر «كافة المواد الدراسية» من القائمة.</div>
        </div>
      `;
      return;
    }

    if (selectedResultIndex < 0 || selectedResultIndex >= items.length) {
      selectedResultIndex = 0;
    }

    resultsEl.innerHTML = items.map((item, idx) => {
      const subj = SUBJECT_META[item.currId] || { label: 'منهج', icon: '📚', color: '#4338ca', bg: '#eef2ff' };
      const tMeta = TYPE_META[item.type] || TYPE_META.lesson;
      const snippet = buildSnippet(item.body, trimmed);
      const isSelected = idx === selectedResultIndex;

      return `
        <button type="button"
          class="search-result-item ${isSelected ? 'is-selected' : ''}"
          role="option"
          aria-selected="${isSelected ? 'true' : 'false'}"
          data-type="${escapeHtml(item.type)}"
          data-result-idx="${idx}"
          onclick="GlobalSearch.openResult(${idx})">
          <div class="search-result-top">
            <div class="search-result-badges">
              <span class="search-subj-badge" style="background: ${subj.bg}; color: ${subj.color}; border-color: ${subj.color}33;">
                ${subj.icon} ${escapeHtml(subj.label)}
              </span>
              <span class="search-type-badge ${tMeta.cls}">
                ${tMeta.icon} ${tMeta.label}
              </span>
            </div>
            <span class="search-result-action-hint">فتح ⏎</span>
          </div>
          <div class="search-result-title">${highlightMatches(item.title, trimmed)}</div>
          ${item.subtitle ? `<div class="search-result-sub">${highlightMatches(item.subtitle, trimmed)}</div>` : ''}
          ${snippet ? `<div class="search-result-snippet">${highlightMatches(snippet, trimmed)}</div>` : ''}
        </button>
      `;
    }).join('');
  }

  function runSearch() {
    indexAllLoadedSources();
    renderSearchUI();
    if (currentQuery.trim() && window.A11yManager) {
      A11yManager.announce(`تم تحديث نتائج البحث: ${currentResults.length} نتيجة`);
    }
  }

  function updateSelectionVisual() {
    const resultsEl = document.getElementById('globalSearchResults');
    if (!resultsEl) return;
    const rows = resultsEl.querySelectorAll('.search-result-item');
    rows.forEach((row, idx) => {
      const active = idx === selectedResultIndex;
      row.classList.toggle('is-selected', active);
      row.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) {
        row.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  async function openResult(idx) {
    const item = currentResults[idx];
    if (!item) return;

    saveRecentSearch(currentQuery);
    closeModal();

    if (item.type === 'page') {
      if (typeof openDigitalLibraryReader === 'function') {
        openDigitalLibraryReader(item.currId, item.pageNum, 'student');
      }
      return;
    }

    if (item.type === 'lesson') {
      window._pendingSearchHighlight = {
        lessonId: item.lessonId,
        chunkIdx: item.chunkIdx || 0,
        query: currentQuery.trim()
      };
      if (typeof onCurriculumSelectChange === 'function') {
        onCurriculumSelectChange(item.currId, true);
      } else {
        appData.currentCurriculumId = item.currId;
      }
      appData.currentLessonId = item.lessonId;
      saveData();
      switchTab('study');
      return;
    }

    if (item.type === 'rule') {
      switchTab('grammar', { preserveGrammarSearch: true, skipGrammarRender: true });
      if (typeof setGrammarSubjectMode === 'function') {
        await setGrammarSubjectMode(item.grammarMode, { initialSearch: item.ruleTitle || item.title });
      }
      return;
    }

    if (item.type === 'diagram') {
      if (typeof openDiagramViewerModal === 'function') {
        await openDiagramViewerModal(item.diagramSubject, item.diagramId);
      }
      return;
    }

    if (item.type === 'quiz') {
      if (typeof startChapterQuiz === 'function') {
        await startChapterQuiz(item.currId, item.chapterId);
        if (item.questionId && typeof jumpToQuizQuestion === 'function') {
          setTimeout(() => jumpToQuizQuestion(item.questionId), 200);
        }
      }
    }
  }

  function openModal(initialQuery = null) {
    const modal = document.getElementById('globalSearchModal');
    if (!modal) return;
    indexAllLoadedSources();

    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClearBtn');
    const subjSel = document.getElementById('globalSearchSubjectSelect');

    if (subjSel) subjSel.value = currentSubjectFilter;
    if (typeof initialQuery === 'string') {
      currentQuery = initialQuery;
    }
    if (input) input.value = currentQuery;
    if (clearBtn) clearBtn.classList.toggle('hidden', !currentQuery);

    renderSearchUI();
    modal.classList.remove('hidden');

    if (currentQuery.trim().length >= 1) {
      ensureScopeLoaded(false);
    }

    if (input) {
      requestAnimationFrame(() => {
        input.focus({ preventScroll: true });
        if (input.value) input.select();
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('globalSearchModal');
    if (modal) modal.classList.add('hidden');
  }

  function onInputChange(val) {
    currentQuery = String(val || '');
    selectedResultIndex = 0;
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.classList.toggle('hidden', !currentQuery);

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      runSearch();
      if (currentQuery.trim().length >= 1) {
        ensureScopeLoaded(false);
      }
    }, 140);
  }

  function clearInput() {
    currentQuery = '';
    selectedResultIndex = -1;
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (clearBtn) clearBtn.classList.add('hidden');
    runSearch();
  }

  function applyQuery(q) {
    currentQuery = String(q || '');
    selectedResultIndex = 0;
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (input) {
      input.value = currentQuery;
      input.focus();
    }
    if (clearBtn) clearBtn.classList.toggle('hidden', !currentQuery);
    runSearch();
    ensureScopeLoaded(false);
  }

  function setSubjectFilter(val) {
    currentSubjectFilter = val || 'all';
    selectedResultIndex = 0;
    runSearch();
    if (currentQuery.trim().length >= 1) {
      ensureScopeLoaded(false);
    }
  }

  function setTypeFilter(typeKey) {
    currentTypeFilter = typeKey || 'all';
    selectedResultIndex = 0;
    runSearch();
  }

  function indexAllNow() {
    return ensureScopeLoaded(true);
  }

  function handleModalKeydown(e) {
    const modal = document.getElementById('globalSearchModal');
    if (!modal || modal.classList.contains('hidden')) return;

    if (e.key === 'ArrowDown') {
      if (currentResults.length === 0) return;
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex + 1) % currentResults.length;
      updateSelectionVisual();
    } else if (e.key === 'ArrowUp') {
      if (currentResults.length === 0) return;
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex - 1 + currentResults.length) % currentResults.length;
      updateSelectionVisual();
    } else if (e.key === 'Enter') {
      const activeEl = document.activeElement;
      const isInput = activeEl && activeEl.id === 'globalSearchInput';
      if (isInput && currentResults.length > 0 && selectedResultIndex >= 0) {
        e.preventDefault();
        openResult(selectedResultIndex);
      }
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const modal = document.getElementById('globalSearchModal');
    if (modal) {
      modal.addEventListener('keydown', handleModalKeydown);
    }
  }

  return {
    init,
    openModal,
    closeModal,
    onInputChange,
    clearInput,
    applyQuery,
    setSubjectFilter,
    setTypeFilter,
    indexAllNow,
    clearRecent: clearRecentSearches,
    openResult,
    runSearch
  };
})();

function openGlobalSearchModal(initialQuery = null) {
  window.GlobalSearch.openModal(initialQuery);
}

function closeGlobalSearchModal() {
  window.GlobalSearch.closeModal();
}
