// =========================================================================
// بنك القواعد والمفاهيم والنظريات الشامل
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

// عرض القواعد المهمة (Grammar & Rules View)
let activeGrammarSubjectMode = 'auto'; // 'auto', 'en', 'ar', 'is'
let grammarRenderToken = 0;

function setGrammarSubjectMode(mode, options = {}) {
  if (mode === 'bio') appData.currentCurriculumId = 11;
  else if (mode === 'chem' || mode === 'chemistry') appData.currentCurriculumId = 10;
  else if (mode === 'social' || mode === 'soc') appData.currentCurriculumId = 9;
  else if (mode === 'math') appData.currentCurriculumId = 8;
  else if (mode === 'phy') appData.currentCurriculumId = 7;
  else if (mode === 'is') appData.currentCurriculumId = 6;
  else if (mode === 'ar') {
    if (appData.currentCurriculumId !== 4 && appData.currentCurriculumId !== 5) {
      appData.currentCurriculumId = 4;
    }
  } else if (mode === 'en') {
    appData.currentCurriculumId = 3;
  }
  activeGrammarSubjectMode = mode;
  currentActiveGrammarFilter = 'all';
  const searchInput = document.getElementById('grammarSearchInput');
  if (searchInput) searchInput.value = options.initialSearch ? String(options.initialSearch) : '';
  saveData();
  const activeCurrObj = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || { id: appData.currentCurriculumId };
  updateGlobalSubjectContextBars(activeCurrObj);
  return renderGrammarRules();
}

function matchesGrammarRuleSearch(r, search) {
  if (!search) return true;
  const exText = Array.isArray(r.examples)
    ? r.examples.map(ex => `${ex.en || ''} ${ex.ar || ''}`).join(' ')
    : '';
  const hay = `${r.title || ''} ${r.category || ''} ${r.summary || ''} ${r.details || ''} ${r.explanation || ''} ${r.formula || ''} ${r.rule || ''} ${exText}`;
  return (typeof matchesNormalizedQuery === 'function')
    ? matchesNormalizedQuery(hay, search)
    : hay.toLowerCase().includes(search.toLowerCase());
}

async function renderGrammarRules() {
  const reqToken = ++grammarRenderToken;
  const container = document.getElementById('grammarContainer');
  if (!container) return;
  container.innerHTML = '';

  // تحديد نمط المادة حصراً للمنهج النشط حالياً لمنع أي تداخل بين المواد
  const currId = Number(appData.currentCurriculumId || 3);
  let currentMode = 'en';
  if (currId === 11) currentMode = 'bio';
  else if (currId === 10) currentMode = 'chem';
  else if (currId === 9) currentMode = 'social';
  else if (currId === 8) currentMode = 'math';
  else if (currId === 7) currentMode = 'phy';
  else if (currId === 6) currentMode = 'is';
  else if (currId === 4 || currId === 5) currentMode = 'ar';
  else currentMode = 'en';

  // تحديث حالة أزرار اختيار المادة في شريط بنك القواعد والمفاهيم
  const grammarModes = ['en', 'ar', 'is', 'phy', 'math', 'social', 'chem', 'bio'];
  grammarModes.forEach(m => {
    const btn = document.getElementById('btnGrammarSubject_' + m);
    if (btn) {
      const isActive = (m === currentMode);
      btn.className = isActive ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  });

  // تحديث العناوين ونصوص البحث بحسب المنهج المختار
  const titleEl = document.getElementById('grammarSectionTitle');
  const subTitleEl = document.getElementById('grammarSectionSubtitle');
  const searchInput = document.getElementById('grammarSearchInput');
  const voiceStudioBtn = document.getElementById('grammarVoiceStudioBtn');
  if (voiceStudioBtn) {
    voiceStudioBtn.style.display = (currentMode === 'en') ? 'inline-flex' : 'none';
  }

  if (currentMode === 'en') {
    if (titleEl) titleEl.innerText = '💡 المرجع الشامل لقواعد اللغة الإنجليزية والوظائف اللغوية';
    if (subTitleEl) subTitleEl.innerText = 'شرح وافٍ لكافة القواعد المقررة بالمنهج مع الصيغ النحوية، الأمثلة المنطوقة، وتدريبات الفهم الفورية.';
    if (searchInput) searchInput.placeholder = 'ابحث في القواعد والأزمنة (مثلاً: Past, Present, Future, since, passive)...';
  } else if (currentMode === 'ar') {
    if (titleEl) titleEl.innerText = '💡 المرجع الشامل لقواعد اللغة العربية (الجزء الأول والثاني)';
    if (subTitleEl) subTitleEl.innerText = 'شرح وافٍ لكافة القواعد النحوية والصرفية المقررة مع الضوابط والشواهد الإعرابية المعتمدة.';
    if (searchInput) searchInput.placeholder = 'ابحث في القواعد النحوية والصرفية (مثلاً: الميزان الصرفي، الأسماء الخمسة، النداء، الفاعل)...';
  } else if (currentMode === 'is') {
    if (titleEl) titleEl.innerText = '🕌 المرجع الشامل لأحكام التلاوة والضوابط الشرعية';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الوافي لأحكام التلاوة والتجويد، العقيدة، الحديث الشريف، الفقه، والآداب المقررة في منهج التربية الإسلامية.';
    if (searchInput) searchInput.placeholder = 'ابحث في أحكام التلاوة والآداب والقواعد الفقهية (مثلاً: المد العارض، الصلاة، المعجزة)...';
  } else if (currentMode === 'phy') {
    if (titleEl) titleEl.innerText = '⚛️ المرجع الشامل لقوانين ومفاهيم الفيزياء (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي لقوانين الحركة والقوة، الشغل والقدرة والطاقة، الآلات البسيطة، الموجات والصوت، والضوء والمرايا والعدسات.';
    if (searchInput) searchInput.placeholder = 'ابحث في قوانين ومفاهيم الفيزياء (مثلاً: نيوتن، الشغل، القدرة، العتلات، الصدى، الانكسار)...';
  } else if (currentMode === 'math') {
    if (titleEl) titleEl.innerText = '📐 المرجع الشامل لقوانين ونظريات الرياضيات (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي لقوانين الأعداد والعمليات، الجبر والتحليل، حل المعادلات والمتباينات، نظريات الهندسة والمثلثات والمجسمات، الهندسة الإحداثية، والإحصاء والاحتمالات.';
    if (searchInput) searchInput.placeholder = 'ابحث في قوانين ونظريات ومفاهيم الرياضيات (مثلاً: فيثاغورس، الميل، العامل المشترك، المتباينة، متوازي الأضلاع، الوسيط)...';
  } else if (currentMode === 'bio') {
    if (titleEl) titleEl.innerText = '🧬 بنك المفاهيم والقواعد البيولوجية الشامل';
    if (subTitleEl) subTitleEl.innerText = 'المرجع العلمي المعتمد لمفاهيم علم التصنيف، خصائص الطليعيات والفطريات، النباتات والحيوانات، ودورات النظام البيئي والتوازن.';
    if (searchInput) searchInput.placeholder = 'ابحث في المفاهيم البيولوجية (مثلاً: لينيوس، النوع، الأميبا، البراميسيوم، تعاقب الأجيال، الطيور، النيتروجين)...';
  } else if (currentMode === 'chem') {
    if (titleEl) titleEl.innerText = '🧪 المرجع الشامل لقواعد ومفاهيم الكيمياء (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي للبناء الذري، إلكترونات التكافؤ، الروابط الكيميائية، المعادلات وتفاعلاتها، المحاليل، والحوامض والقواعد والأملاح.';
    if (searchInput) searchInput.placeholder = 'ابحث في مفاهيم وقواعد الكيمياء (مثلاً: إلكترونات التكافؤ، الرابطة التساهمية، موازنة المعادلة، الهيدروجيني، أرهينيوس)...';
  } else if (currentMode === 'social') {
    if (titleEl) titleEl.innerText = '🌍 المرجع الشامل لمفاهيم ومصطلحات الاجتماعيات (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي للمفاهيم الجغرافية، الأقاليم والمناخ، الثروات والاقتصاد، أحوال العرب والجاهلية، وتاريخ وسيرة النبي ﷺ بمكة والمدينة المنورة.';
    if (searchInput) searchInput.placeholder = 'ابحث في المفاهيم والمصطلحات والوقائع (مثلاً: طوبقال، الهلال الخصيب، حلف الفضول، دار الندوة، وثيقة المدينة)...';
  }

  // التحميل الكسول لبيانات المادة عند الطلب قبل عرض قواعدها
  if (BUILTIN_CURRICULUM_IDS.has(currId) && !CurriculumLoader.isCurriculumLoaded(currId)) {
    const filtersLoadingEl = document.getElementById('grammarUnitFilters');
    if (filtersLoadingEl) filtersLoadingEl.innerHTML = '';
    const currObj = (appData.curriculums || []).find(c => c.id === currId);
    const subjLabel = (currObj && (currObj.subject || currObj.name)) || 'قواعد المادة';
    container.innerHTML = CurriculumLoader.renderLoadingHTML(subjLabel);
    const ok = await CurriculumLoader.ensureCurriculumLoaded(currId);
    if (reqToken !== grammarRenderToken) return;
    if (!ok) {
      container.innerHTML = CurriculumLoader.renderErrorHTML(subjLabel, 'renderGrammarRules()');
      return;
    }
    container.innerHTML = '';
  }

  if (currentMode === 'bio') {

    const bioRules = window.BIOLOGY_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredBio = bioRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') matchesFilter = true;
      else if (currentActiveGrammarFilter === 'taxonomy') matchesFilter = r.category && (r.category.includes('التصنيف') || r.category.includes('الصحة'));
      else if (currentActiveGrammarFilter === 'protista_fungi') matchesFilter = r.category && (r.category.includes('الطليعيات') || r.category.includes('الفطريات'));
      else if (currentActiveGrammarFilter === 'plants') matchesFilter = r.category && r.category.includes('النبات');
      else if (currentActiveGrammarFilter === 'animals') matchesFilter = r.category && r.category.includes('الحيوان');
      else if (currentActiveGrammarFilter === 'ecology') matchesFilter = r.category && (r.category.includes('البيئة ومواردها') || r.category.includes('التوازن البيئي'));

      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    // Unit filters
    const filtersContainer = document.getElementById('grammarUnitFilters');
    if (filtersContainer) {
      filtersContainer.innerHTML = `
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'all' ? 'active' : ''}" onclick="filterGrammarByUnit('all')">كل المفاهيم (${bioRules.length})</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'taxonomy' ? 'active' : ''}" onclick="filterGrammarByUnit('taxonomy')">علم التصنيف</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'protista_fungi' ? 'active' : ''}" onclick="filterGrammarByUnit('protista_fungi')">الطليعيات والفطريات</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'plants' ? 'active' : ''}" onclick="filterGrammarByUnit('plants')">مملكة النبات</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'animals' ? 'active' : ''}" onclick="filterGrammarByUnit('animals')">مملكة الحيوان</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'ecology' ? 'active' : ''}" onclick="filterGrammarByUnit('ecology')">البيئة والتوازن</button>
        <button class="btn btn-sm" onclick="openAllBiologyDiagramsGallery()" style="background: #16a34a; color: #ffffff; font-weight: 800; border: none; box-shadow: 0 2px 6px rgba(22,163,74,0.3); margin-right: 0.5rem; border-radius: 6px; padding: 0.25rem 0.65rem;">🔬 أطلس الرسوم (17)</button>
      `;
    }

    if (filteredBio.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد مفاهيم أو قواعد بيولوجية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredBio.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #16a34a; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
            <span style="background: #f0fdf4; color: #166534; font-size: 0.74rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid #86efac;">${rule.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">قاعدة علمية معتمدة</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 900; color: #14532d; margin-bottom: 0.5rem;">${rule.title}</h3>
          <p style="font-size: 0.84rem; color: var(--slate-700); line-height: 1.6; margin-bottom: 0.75rem; background: #f8fafc; padding: 0.6rem 0.85rem; border-radius: 8px;">
            ${rule.summary}
          </p>
          <div style="font-size: 0.8rem; color: var(--slate-600); line-height: 1.6; white-space: pre-line; background: #ffffff; border: 1px dashed #cbd5e1; padding: 0.75rem; border-radius: 8px;">
            ${rule.details}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-100); padding-top: 0.6rem; font-size: 0.72rem; color: #15803d; font-weight: 700;">
          <span>🌱 علم الأحياء - الثاني متوسط</span>
          <span>إعداد المهندس أسامة خليل هاشم</span>
        </div>
      `;
      container.appendChild(card);
    });
    return;
  } else if (currentMode === 'chem') {
    if (titleEl) titleEl.innerText = '🧪 المرجع الشامل لقواعد ومفاهيم الكيمياء (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي للبناء الذري، إلكترونات التكافؤ، الروابط الكيميائية، المعادلات وتفاعلاتها، المحاليل، والحوامض والقواعد والأملاح.';
    if (searchInput) searchInput.placeholder = 'ابحث في مفاهيم وقواعد الكيمياء (مثلاً: إلكترونات التكافؤ، الرابطة التساهمية، موازنة المعادلة، الهيدروجيني، أرهينيوس)...';

    const chemRules = window.CHEMISTRY_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredChem = chemRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') matchesFilter = true;
      else if (currentActiveGrammarFilter === 'bonding') matchesFilter = r.category && (r.category.includes('البناء الذري') || r.category.includes('الترابط') || r.category.includes('التكافؤ'));
      else if (currentActiveGrammarFilter === 'compounds') matchesFilter = r.category && (r.category.includes('المركبات') || r.category.includes('الترابط الكيميائي') || r.category.includes('فان در فال'));
      else if (currentActiveGrammarFilter === 'reactions') matchesFilter = r.category && (r.category.includes('الصيغ') || r.category.includes('المعادلات') || r.category.includes('التفاعلات'));
      else if (currentActiveGrammarFilter === 'solutions') matchesFilter = r.category && (r.category.includes('المحاليل') || r.category.includes('المخاليط') || r.category.includes('الذوبان'));
      else if (currentActiveGrammarFilter === 'acids') matchesFilter = r.category && (r.category.includes('الحوامض') || r.category.includes('القواعد'));
      else if (currentActiveGrammarFilter === 'salts') matchesFilter = r.category && (r.category.includes('الدلائل') || r.category.includes('الأملاح') || r.category.includes('الهيدروجيني'));

      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    // Unit filters for Chemistry
    const filtersContainer = document.getElementById('grammarUnitFilters');
    if (filtersContainer) {
      filtersContainer.innerHTML = `
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'all' ? 'active' : ''}" onclick="filterGrammarByUnit('all')">جميع المفاهيم والقواعد (${chemRules.length})</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'bonding' ? 'active' : ''}" onclick="filterGrammarByUnit('bonding')">⚛️ البناء الذري والترابط</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'compounds' ? 'active' : ''}" onclick="filterGrammarByUnit('compounds')">🧪 المركبات وقوى الجذب</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'reactions' ? 'active' : ''}" onclick="filterGrammarByUnit('reactions')">🔥 المعادلات والتفاعلات</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'solutions' ? 'active' : ''}" onclick="filterGrammarByUnit('solutions')">💧 المحاليل والذوبان</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'acids' ? 'active' : ''}" onclick="filterGrammarByUnit('acids')">🍋 الحوامض والقواعد</button>
        <button class="grammar-filter-pill ${currentActiveGrammarFilter === 'salts' ? 'active' : ''}" onclick="filterGrammarByUnit('salts')">⚗️ الأملاح والـ pH</button>
        <button class="btn btn-sm" onclick="openAllChemistryDiagramsGallery()" style="background: #059669; color: #ffffff; font-weight: 800; border: none; box-shadow: 0 2px 6px rgba(5,150,105,0.3); margin-right: 0.5rem; border-radius: 6px; padding: 0.25rem 0.65rem;">🎨 بنك الرسوم (16)</button>
      `;
    }

    if (filteredChem.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد مفاهيم أو قواعد كيميائية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredChem.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #059669; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 800;">${rule.category}</span>
            <span class="badge" style="background: #f8fafc; color: #64748b; font-size: 0.7rem; border: 1px solid #e2e8f0;">صفحة ${rule.page || ''}</span>
          </div>
          <h3 style="margin: 0 0 0.4rem 0; font-size: 1.05rem; font-weight: 800; color: #064e3b; display: flex; align-items: center; gap: 0.4rem;">
            <span>🧪</span> ${rule.title}
          </h3>
          <p style="margin: 0 0 0.6rem 0; font-size: 0.84rem; color: #047857; font-weight: 600; line-height: 1.5;">${rule.summary}</p>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${rule.details}
          </div>
          ${(() => {
            let diag = null;
            if (window.CHEMISTRY_DIAGRAMS) {
              const t = rule.title || '';
              if (t.includes('الذري') || t.includes('التكافؤ') || t.includes('التأكسد')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_atomic_structure' || d.id === 'diag_chem_valence_electrons');
              else if (t.includes('الأيونية')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_ionic_bond');
              else if (t.includes('التساهمية')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_covalent_bond');
              else if (t.includes('الهيدروجينية') || t.includes('فان در فال')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_hydrogen_bond');
              else if (t.includes('الصيغ الكيميائية')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_chemical_formulas');
              else if (t.includes('المعادلة الكيميائية') || t.includes('موازنة')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_equation_balancing');
              else if (t.includes('أنواع التفاعلات')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_reaction_types');
              else if (t.includes('الحرارة') || t.includes('طاقة التفاعل')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_energy_reactions');
              else if (t.includes('المخاليط') || t.includes('فصل')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_separation_methods');
              else if (t.includes('المحاليل') || t.includes('الذوبان')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_solutions_solubility');
              else if (t.includes('الحوامض')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_acids_arrhenius');
              else if (t.includes('القواعد')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_bases_properties');
              else if (t.includes('الدلائل') || t.includes('الهيدروجيني') || t.includes('pH')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_ph_scale');
              else if (t.includes('التعادل') || t.includes('الأملاح')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_neutralization_salts');
              else if (t.includes('المختبرية') || t.includes('الجدول')) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === 'diag_chem_lab_tools');
            }
            return diag ? `
              <button class="btn btn-sm" onclick="openChemistryDiagramModal('${diag.id}')" style="background: #059669; color: white; border: none; font-size: 0.74rem; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.6rem; cursor: pointer; box-shadow: 0 1px 3px rgba(5,150,105,0.3);">
                <span>🧪</span> عرض الرسم التوضيحي (${diag.title.substring(0, 32)}...)
              </button>
            ` : '';
          })()}
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  if (currentMode === 'social') {
    if (titleEl) titleEl.innerText = '🌍 المرجع الشامل لمفاهيم ومصطلحات الاجتماعيات (الصف الثاني المتوسط)';
    if (subTitleEl) subTitleEl.innerText = 'المرجع الأساسي للمفاهيم الجغرافية، الأقاليم والمناخ، الثروات والاقتصاد، أحوال العرب والجاهلية، وتاريخ وسيرة النبي ﷺ بمكة والمدينة المنورة.';
    if (searchInput) searchInput.placeholder = 'ابحث في المفاهيم والمصطلحات والوقائع (مثلاً: طوبقال، الهلال الخصيب، حلف الفضول، دار الندوة، وثيقة المدينة)...';
  }

  // تحديث وتوليد فلاتر الوحدات والأقسام المخصصة لكل منهج ديناميكياً
  const filtersEl = document.getElementById('grammarUnitFilters');
  if (filtersEl) {
    if (currentMode === 'en') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع القواعد (43)</button>
        <button class="btn ${currentActiveGrammarFilter === 'tenses' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('tenses', this)" style="border: 1px solid #c7d2fe;">⏱️ قواعد الأزمنة (Tenses)</button>
        <button class="btn ${currentActiveGrammarFilter == 1 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(1, this)">الوحدة 1</button>
        <button class="btn ${currentActiveGrammarFilter == 2 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(2, this)">الوحدة 2</button>
        <button class="btn ${currentActiveGrammarFilter == 3 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(3, this)">الوحدة 3</button>
        <button class="btn ${currentActiveGrammarFilter == 4 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(4, this)">الوحدة 4</button>
        <button class="btn ${currentActiveGrammarFilter == 5 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(5, this)">الوحدة 5</button>
        <button class="btn ${currentActiveGrammarFilter == 6 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(6, this)">الوحدة 6</button>
        <button class="btn ${currentActiveGrammarFilter == 7 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(7, this)">الوحدة 7</button>
        <button class="btn ${currentActiveGrammarFilter == 8 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(8, this)">الوحدة 8</button>
      `;
    } else if (currentMode === 'ar') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع قواعد العربية (18)</button>
        <button class="btn ${currentActiveGrammarFilter === 'p1' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('p1', this)">📙 قواعد الجزء الأول (9)</button>
        <button class="btn ${currentActiveGrammarFilter === 'p2' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('p2', this)">📗 قواعد الجزء الثاني (9)</button>
        <button class="btn ${currentActiveGrammarFilter == 1 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(1, this)">الوحدة 1</button>
        <button class="btn ${currentActiveGrammarFilter == 2 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(2, this)">الوحدة 2</button>
        <button class="btn ${currentActiveGrammarFilter == 3 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(3, this)">الوحدة 3</button>
        <button class="btn ${currentActiveGrammarFilter == 4 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(4, this)">الوحدة 4</button>
        <button class="btn ${currentActiveGrammarFilter == 5 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(5, this)">الوحدة 5</button>
        <button class="btn ${currentActiveGrammarFilter == 6 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(6, this)">الوحدة 6</button>
        <button class="btn ${currentActiveGrammarFilter == 7 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(7, this)">الوحدة 7</button>
        <button class="btn ${currentActiveGrammarFilter == 8 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(8, this)">الوحدة 8</button>
        <button class="btn ${currentActiveGrammarFilter == 9 ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit(9, this)">الوحدة 9</button>
      `;
    } else if (currentMode === 'is') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع الأحكام والقواعد (15)</button>
        <button class="btn ${currentActiveGrammarFilter === 'tilawa' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('tilawa', this)">📖 أحكام التلاوة والتجويد</button>
        <button class="btn ${currentActiveGrammarFilter === 'aqeeda' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('aqeeda', this)">🌟 العقيدة والمعجزات</button>
        <button class="btn ${currentActiveGrammarFilter === 'hadith' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('hadith', this)">📜 الحديث النبوي الشريف</button>
        <button class="btn ${currentActiveGrammarFilter === 'fiqh' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('fiqh', this)">🕌 الفقه والعبادات</button>
        <button class="btn ${currentActiveGrammarFilter === 'seerah' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('seerah', this)">🕊️ السيرة والآداب الإسلامية</button>
      `;
    } else if (currentMode === 'phy') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع قوانين ومفاهيم الفيزياء (18)</button>
        <button class="btn ${currentActiveGrammarFilter === 'motion' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('motion', this)">🏃‍♂️ الحركة والقياس (فصل 1)</button>
        <button class="btn ${currentActiveGrammarFilter === 'newton' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('newton', this)">🎯 قوانين نيوتن والجاذبية (فصل 2)</button>
        <button class="btn ${currentActiveGrammarFilter === 'energy' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('energy', this)">⚙️ الشغل والقدرة والطاقة (فصل 3)</button>
        <button class="btn ${currentActiveGrammarFilter === 'machines' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('machines', this)">🏗️ الآلات البسيطة والعتلات (فصل 4)</button>
        <button class="btn ${currentActiveGrammarFilter === 'sound' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('sound', this)">🌊 الموجات والصوت (فصل 5)</button>
        <button class="btn ${currentActiveGrammarFilter === 'light' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('light', this)">💡 الضوء والمرايا والعدسات (فصل 6)</button>
        <button class="btn btn-sm" onclick="openAllPhysicsDiagramsGallery()" style="background: #0284c7; color: #ffffff; font-weight: 800; border: none; box-shadow: 0 2px 6px rgba(2,132,199,0.3); margin-right: 0.5rem;">🎨 استعراض بنك الرسوم التوضيحية (15 لوحة)</button>
      `;
    } else if (currentMode === 'math') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع القوانين والنظريات (22)</button>
        <button class="btn ${currentActiveGrammarFilter === 'numbers' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('numbers', this)">🔢 الأعداد والعمليات (فصل 1 و 2)</button>
        <button class="btn ${currentActiveGrammarFilter === 'algebra' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('algebra', this)">🔣 الجبر والحدوديات (فصل 3)</button>
        <button class="btn ${currentActiveGrammarFilter === 'equations' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('equations', this)">⚖️ المعادلات والمتباينات (فصل 4)</button>
        <button class="btn ${currentActiveGrammarFilter === 'geometry' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('geometry', this)">📐 الهندسة والقياس (فصل 5)</button>
        <button class="btn ${currentActiveGrammarFilter === 'coord' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('coord', this)">📈 الهندسة الإحداثية والميل (فصل 6)</button>
        <button class="btn ${currentActiveGrammarFilter === 'stats' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('stats', this)">📊 الإحصاء والاحتمالات (فصل 7)</button>
      `;
    } else if (currentMode === 'social') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع المفاهيم والمصطلحات (13)</button>
        <button class="btn ${currentActiveGrammarFilter === 'geo' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('geo', this)">🗺️ جغرافية وطبيعة (فصل 1)</button>
        <button class="btn ${currentActiveGrammarFilter === 'econ' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('econ', this)">📈 سكان واقتصاد (فصل 2)</button>
        <button class="btn ${currentActiveGrammarFilter === 'history' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('history', this)">🏺 شبه الجزيرة ومكة (فصل 3 و 4)</button>
        <button class="btn ${currentActiveGrammarFilter === 'seerah' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('seerah', this)">🕊️ السيرة النبوية والغزوات (فصل 5 و 6)</button>
      `;
    } else if (currentMode === 'chem') {
      filtersEl.innerHTML = `
        <button class="btn ${currentActiveGrammarFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('all', this)">جميع المفاهيم والقواعد (24)</button>
        <button class="btn ${currentActiveGrammarFilter === 'bonding' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('bonding', this)">⚛️ البناء الذري والترابط (فصل 1)</button>
        <button class="btn ${currentActiveGrammarFilter === 'compounds' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('compounds', this)">🧪 المركبات وقوى الجذب (فصل 2)</button>
        <button class="btn ${currentActiveGrammarFilter === 'reactions' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('reactions', this)">🔥 الصيغ والمعادلات والتفاعلات (فصل 3)</button>
        <button class="btn ${currentActiveGrammarFilter === 'solutions' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('solutions', this)">💧 المحاليل والذوبان (فصل 4)</button>
        <button class="btn ${currentActiveGrammarFilter === 'acids' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('acids', this)">🍋 الحوامض والقواعد (فصل 5)</button>
        <button class="btn ${currentActiveGrammarFilter === 'salts' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterGrammarByUnit('salts', this)">⚗️ الدلائل والأملاح والـ pH (فصل 6)</button>
        <button class="btn btn-sm" onclick="openAllChemistryDiagramsGallery()" style="background: #059669; color: #ffffff; font-weight: 800; border: none; box-shadow: 0 2px 6px rgba(5,150,105,0.3); margin-right: 0.5rem;">🎨 استعراض بنك الرسوم التوضيحية (16 لوحة)</button>
      `;
    }
  }

  if (currentMode === 'social') {
    const socialTerms = window.SOCIAL_TERMS_BANK || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredSocial = socialTerms.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') {
        matchesFilter = true;
      } else if (currentActiveGrammarFilter === 'geo') {
        matchesFilter = r.category && (r.category.includes('جغرافيا') || r.category.includes('تضاريس') || r.category.includes('مناخ') || r.category.includes('مياه') || r.category.includes('طبيعة'));
      } else if (currentActiveGrammarFilter === 'econ') {
        matchesFilter = r.category && (r.category.includes('سكان') || r.category.includes('أقاليم') || r.category.includes('اقتصاد') || r.category.includes('تجارة'));
      } else if (currentActiveGrammarFilter === 'history') {
        matchesFilter = r.category && (r.category.includes('ما قبل الإسلام') || r.category.includes('مكة') || r.category.includes('عقائد') || r.category.includes('سياسة'));
      } else if (currentActiveGrammarFilter === 'seerah') {
        matchesFilter = r.category && (r.category.includes('الدولة') || r.category.includes('السيرة') || r.category.includes('معاهدات') || r.category.includes('غزوات'));
      }
      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    if (filteredSocial.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد مفاهيم أو مصطلحات مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredSocial.forEach(term => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #b45309; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #fffbeb; color: #b45309; font-size: 0.72rem; font-weight: 800;">${term.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">الاجتماعيات</span>
          </div>
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 900; color: #78350f;">${term.title}</h4>
          <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.83rem; color: #92400e; line-height: 1.6; margin-bottom: 0.65rem;">
            <strong>💡 التعريف والمفهوم:</strong> ${term.summary}
          </div>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${term.details}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-100); padding-top: 0.6rem; margin-top: 0.4rem;">
          <span style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700;">الصف الثاني المتوسط • مقرر وزاري</span>
          <button class="btn btn-sm btn-secondary" onclick="selectCurriculumForStudy(9); switchTab('study');" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; color: #b45309; border-color: #fde68a; font-weight: 700;">
            📖 استعراض في الدروس
          </button>
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  if (currentMode === 'math') {
    // عرض بنك قوانين ونظريات ومفاهيم الرياضيات
    const mathRules = window.MATH_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredMath = mathRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') {
        matchesFilter = true;
      } else if (currentActiveGrammarFilter === 'numbers') {
        matchesFilter = r.category && (r.category.includes('الأعداد') || r.category.includes('العمليات') || r.category.includes('فصل 1') || r.category.includes('فصل 2'));
      } else if (currentActiveGrammarFilter === 'algebra') {
        matchesFilter = r.category && (r.category.includes('الجبر') || r.category.includes('الحدوديات') || r.category.includes('فصل 3'));
      } else if (currentActiveGrammarFilter === 'equations') {
        matchesFilter = r.category && (r.category.includes('المعادلات') || r.category.includes('المتباينات') || r.category.includes('فصل 4'));
      } else if (currentActiveGrammarFilter === 'geometry') {
        matchesFilter = r.category && (r.category.includes('الهندسة والقياس') || r.category.includes('فصل 5'));
      } else if (currentActiveGrammarFilter === 'coord') {
        matchesFilter = r.category && (r.category.includes('الهندسة الإحداثية') || r.category.includes('فصل 6'));
      } else if (currentActiveGrammarFilter === 'stats') {
        matchesFilter = r.category && (r.category.includes('الإحصاء') || r.category.includes('الاحتمالات') || r.category.includes('فصل 7'));
      }
      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    if (filteredMath.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد قوانين أو نظريات رياضية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredMath.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #7e22ce; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #faf5ff; color: #7e22ce; font-size: 0.72rem; font-weight: 800;">${rule.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">الرياضيات</span>
          </div>
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 900; color: #581c87;">${rule.title}</h4>
          <div style="background: #faf5ff; border: 1px solid #e9d5ff; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.83rem; color: #6b21a8; line-height: 1.6; margin-bottom: 0.65rem;">
            <strong>💡 نص القانون والنظرية:</strong> ${rule.summary}
          </div>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${rule.details}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-100); padding-top: 0.6rem; margin-top: 0.4rem;">
          <span style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700;">الصف الثاني المتوسط • مقرر وزاري</span>
          <button class="btn btn-sm btn-secondary" onclick="selectCurriculumForStudy(8); switchTab('study');" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; color: #7e22ce; border-color: #d8b4fe; font-weight: 700;">
            📖 تطبيق في الدروس
          </button>
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  if (currentMode === 'phy') {
    // عرض بنك قوانين ومفاهيم الفيزياء
    const phyRules = window.PHYSICS_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredPhy = phyRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') {
        matchesFilter = true;
      } else if (currentActiveGrammarFilter === 'motion') {
        matchesFilter = r.category && (r.category.includes('الحركة') || r.category.includes('القياس'));
      } else if (currentActiveGrammarFilter === 'newton') {
        matchesFilter = r.category && (r.category.includes('نيوتن') || r.category.includes('الجاذبية') || r.category.includes('القوة'));
      } else if (currentActiveGrammarFilter === 'energy') {
        matchesFilter = r.category && (r.category.includes('الشغل') || r.category.includes('الطاقة') || r.category.includes('القدرة'));
      } else if (currentActiveGrammarFilter === 'machines') {
        matchesFilter = r.category && (r.category.includes('الآلات') || r.category.includes('العتلات'));
      } else if (currentActiveGrammarFilter === 'sound') {
        matchesFilter = r.category && (r.category.includes('الموجات') || r.category.includes('الصوت'));
      } else if (currentActiveGrammarFilter === 'light') {
        matchesFilter = r.category && (r.category.includes('الضوء') || r.category.includes('البصريات') || r.category.includes('المرايا') || r.category.includes('العدسات'));
      }
      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    if (filteredPhy.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد قوانين فيزيائية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredPhy.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #0284c7; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #f0f9ff; color: #0369a1; font-size: 0.72rem; font-weight: 800;">${rule.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">الفيزياء</span>
          </div>
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 900; color: #075985;">${rule.title}</h4>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.83rem; color: #0369a1; line-height: 1.6; margin-bottom: 0.65rem;">
            <strong>💡 خلاصة القانون والمفهوم:</strong> ${rule.summary}
          </div>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${rule.details}
          </div>
          ${(() => {
            let diag = null;
            if (window.PHYSICS_DIAGRAMS) {
              const t = rule.title || '';
              if (t.includes('المسافة') || t.includes('الإزاحة')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_distance_displacement');
              else if (t.includes('السرعة') || t.includes('التعجيل')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_velocity_acceleration');
              else if (t.includes('نيوتن')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_newton_laws');
              else if (t.includes('الجاذبية') || t.includes('الوزن')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_mass_vs_weight');
              else if (t.includes('الشغل') || t.includes('القدرة')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_work_power');
              else if (t.includes('الطاقة') || t.includes('البندول')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_pendulum_energy');
              else if (t.includes('العتلات')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_levers_classes');
              else if (t.includes('الآلات') || t.includes('البكر') || t.includes('السطح المائل')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_pulleys_inclined_plane');
              else if (t.includes('الموجات') || t.includes('الموجية')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_waves_transverse_longitudinal');
              else if (t.includes('الصوت') || t.includes('الصدى')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_sound_echo_sonar');
              else if (t.includes('الظل') || t.includes('الكسوف') || t.includes('الخسوف')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_shadows_eclipses');
              else if (t.includes('الانعكاس') || t.includes('المرايا')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_reflection_mirrors');
              else if (t.includes('الانكسار') || t.includes('العدسات')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_refraction_lenses_vision');
              else if (t.includes('الألياف') || t.includes('المنشور') || t.includes('الطيف')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_total_internal_reflection_prism');
              else if (t.includes('البادئات') || t.includes('القياس')) diag = window.PHYSICS_DIAGRAMS.find(d => d.id === 'diag_measurement_prefixes');
            }
            return diag ? `
              <button class="btn btn-sm" onclick="openPhysicsDiagramModal('${diag.id}')" style="background: #0284c7; color: white; border: none; font-size: 0.74rem; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.6rem; cursor: pointer; box-shadow: 0 1px 3px rgba(2,132,199,0.3);">
                <span>🔬</span> عرض الرسم التوضيحي للظاهرة (${diag.title.substring(0, 32)}...)
              </button>
            ` : '';
          })()}
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  if (currentMode === 'is') {
    // عرض بنك أحكام التربية الإسلامية
    const isRules = window.ISLAMIC_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredIs = isRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') {
        matchesFilter = true;
      } else if (currentActiveGrammarFilter === 'tilawa') {
        matchesFilter = r.category && (r.category.includes('تلاوة') || r.category.includes('تجويد'));
      } else if (currentActiveGrammarFilter === 'aqeeda') {
        matchesFilter = r.category && (r.category.includes('عقيدة') || r.category.includes('معجز'));
      } else if (currentActiveGrammarFilter === 'hadith') {
        matchesFilter = r.category && r.category.includes('حديث');
      } else if (currentActiveGrammarFilter === 'fiqh') {
        matchesFilter = r.category && (r.category.includes('فقه') || r.category.includes('عباد') || r.category.includes('صلاة') || r.category.includes('صوم'));
      } else if (currentActiveGrammarFilter === 'seerah') {
        matchesFilter = r.category && (r.category.includes('سيرة') || r.category.includes('صحاب') || r.category.includes('آداب') || r.category.includes('أخلاق'));
      }
      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    if (filteredIs.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد أحكام إسلامية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredIs.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #0d9488; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #f0fdfa; color: #0f766e; font-size: 0.72rem; font-weight: 800;">${rule.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">التربية الإسلامية</span>
          </div>
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 900; color: #115e59;">${rule.title}</h4>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.83rem; color: #134e4a; line-height: 1.6; margin-bottom: 0.65rem;">
            <strong>💡 خلاصة الحكم والضابط الشرعي:</strong> ${rule.summary}
          </div>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${rule.details}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  if (currentMode === 'ar') {
    // عرض بنك قواعد اللغة العربية
    const arRules = window.ARABIC_GRAMMAR_RULES || [];
    const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();
    const filteredAr = arRules.filter(r => {
      let matchesFilter = true;
      if (currentActiveGrammarFilter === 'all') {
        matchesFilter = true;
      } else if (currentActiveGrammarFilter === 'p1') {
        matchesFilter = r.category && r.category.includes('الجزء الأول');
      } else if (currentActiveGrammarFilter === 'p2') {
        matchesFilter = r.category && r.category.includes('الجزء الثاني');
      } else if (currentActiveGrammarFilter !== undefined && !isNaN(Number(currentActiveGrammarFilter))) {
        matchesFilter = r.category && r.category.includes(`الوحدة ${currentActiveGrammarFilter}`);
      }
      const matchesSearch = matchesGrammarRuleSearch(r, search);
      return matchesFilter && matchesSearch;
    });

    if (filteredAr.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;';
      empty.innerText = 'لا توجد قواعد عربية مطابقة للفلتر أو البحث المحدد.';
      container.appendChild(empty);
      return;
    }

    filteredAr.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'grammar-card';
      card.style.cssText = 'background: white; border: 1px solid var(--slate-200); border-right: 4px solid #059669; border-radius: 12px; padding: 1.15rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 800;">${rule.category}</span>
            <span style="font-size: 0.7rem; color: var(--slate-400); font-weight: 700;">منهج اللغة العربية</span>
          </div>
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 900; color: #064e3b;">${rule.title}</h4>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.83rem; color: #14532d; line-height: 1.6; margin-bottom: 0.65rem;">
            <strong>💡 الخلاصة والقاعدة:</strong> ${rule.summary}
          </div>
          <div style="white-space: pre-wrap; font-size: 0.82rem; color: var(--slate-700); line-height: 1.7; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--slate-200);">
            ${rule.details}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
    return;
  }

  // القواعد الإنجليزية
  const rules = window.GRAMMAR_RULES || [];
  const search = (document.getElementById('grammarSearchInput').value || '').toLowerCase().trim();

  const filtered = rules.filter(r => {
    let matchesUnit = false;
    if (currentActiveGrammarFilter === 'all') {
      matchesUnit = true;
    } else if (currentActiveGrammarFilter === 'tenses') {
      matchesUnit = r.category === 'tenses' || r.isTense || (r.title && (r.title.includes('زمن') || r.title.includes('المضارع') || r.title.includes('الماضي') || r.title.includes('المستقبل')));
    } else {
      matchesUnit = r.unit === Number(currentActiveGrammarFilter);
    }
    const matchesSearch = matchesGrammarRuleSearch(r, search);
    return matchesUnit && matchesSearch;
  });

  // ترتيب تسلسلي صارم ومضمون دائماً حسب رقم الوحدة ثم رقم الصفحة
  filtered.sort((a, b) => {
    if (a.unit !== b.unit) {
      return a.unit - b.unit;
    }
    return (a.page || 0) - (b.page || 0);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;">لا توجد قواعد مطابقة للبحث المحدد.</div>';
    return;
  }

  const UNIT_META = {
    1: { title: 'الوحدة الأولى: مجلة المدرسة', titleEn: 'Unit 1: A School Magazine', icon: '📰', color: '#4f46e5', bg: '#eef2ff' },
    2: { title: 'الوحدة الثانية: نمط الحياة الصحي', titleEn: 'Unit 2: Healthy Lifestyle', icon: '🥗', color: '#059669', bg: '#ecfdf5' },
    3: { title: 'الوحدة الثالثة: الرياضة والألعاب', titleEn: 'Unit 3: Sports and Games', icon: '⚽', color: '#d97706', bg: '#fffbeb' },
    4: { title: 'الوحدة الرابعة: المراجعة الشاملة 1', titleEn: 'Unit 4: Review 1', icon: '🔄', color: '#0284c7', bg: '#f0f9ff' },
    5: { title: 'الوحدة الخامسة: تلقي وإرسال المعلومات', titleEn: 'Unit 5: Getting & Sending Info', icon: '📡', color: '#7c3aed', bg: '#f5f3ff' },
    6: { title: 'الوحدة السادسة: المهن والوظائف', titleEn: 'Unit 6: Jobs and Occupations', icon: '💼', color: '#dc2626', bg: '#fef2f2' },
    7: { title: 'الوحدة السابعة: العالم من حولنا والبيئة', titleEn: 'Unit 7: The World Around Us', icon: '🌍', color: '#16a34a', bg: '#f0fdf4' },
    8: { title: 'الوحدة الثامنة: المراجعة الشاملة 2', titleEn: 'Unit 8: Review 2', icon: '🎯', color: '#7c3aed', bg: '#f5f3ff' }
  };

  let lastRenderedUnit = null;

  filtered.forEach(rule => {
    // فاصل وعنوان الوحدة التسلسلي المنظم
    if (rule.unit !== lastRenderedUnit) {
      const meta = UNIT_META[rule.unit] || { title: `الوحدة ${rule.unit}`, titleEn: `Unit ${rule.unit}`, icon: '📘', color: '#4f46e5', bg: '#eef2ff' };
      const unitCount = filtered.filter(x => x.unit === rule.unit).length;

      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'grammar-unit-section-banner';
      sectionHeader.style.cssText = `grid-column: 1 / -1; margin-top: ${lastRenderedUnit === null ? '0.25rem' : '1.75rem'}; margin-bottom: 0.25rem; background: ${meta.bg}; border: 1px solid ${meta.color}33; border-right: 5px solid ${meta.color}; border-radius: 10px; padding: 0.75rem 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.03);`;
      sectionHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.3rem;">${meta.icon}</span>
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #1e293b;">${meta.title}</div>
            <div style="font-size: 0.75rem; color: var(--slate-500); direction: ltr; text-align: right;">${meta.titleEn}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${currentActiveGrammarFilter === 'tenses' ? '<span style="background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">⏱️ أزمنة مقررة</span>' : ''}
          <span style="background: white; border: 1px solid ${meta.color}55; color: ${meta.color}; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 999px;">
            ${unitCount} ${unitCount === 1 ? 'قاعدة واحدة' : unitCount === 2 ? 'قاعدتان' : 'قواعد موثقة'}
          </span>
        </div>
      `;
      container.appendChild(sectionHeader);
      lastRenderedUnit = rule.unit;
    }

    const card = document.createElement('div');
    card.className = 'grammar-card';
    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            ${rule.category === 'tenses' ? '<span class="curr-badge" style="background: #e0e7ff; color: #3730a3; font-weight: 800; border: 1px solid #c7d2fe;">⏱️ زمن</span>' : ''}
            <span class="curr-badge" style="background: #fef3c7; color: #92400e;">${rule.page >= 110 ? `الوحدة ${rule.unit} • مرجع القواعد (ص ${rule.page})` : `الوحدة ${rule.unit} • صفحة ${rule.page}`}</span>
          </div>
          <span style="font-size: 0.72rem; color: var(--slate-400); font-weight: 700;">${rule.level}</span>
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.35rem;">
          ${rule.title}
        </h3>

        ${(rule.formula || rule.rule) ? `<div class="formula-box">${rule.formula || rule.rule}</div>` : ''}

        <p style="font-size: 0.83rem; color: var(--slate-600); margin-bottom: 0.75rem; line-height: 1.6; white-space: pre-line;">
          ${rule.explanation || rule.summary || rule.rule || ''}
        </p>

        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-700); margin-bottom: 0.35rem;">أمثلة معتمدة من الكتاب:</div>
          ${rule.examples.map(ex => `
            <div class="grammar-example-item">
              <div>
                <div style="font-weight: 700; color: #1e1b4b; direction: ltr; text-align: left;">${ex.en}</div>
                <div style="font-size: 0.75rem; color: var(--slate-500);">${ex.ar}</div>
              </div>
              <button class="mini-listen-btn" onclick="speakSnippet(\`${escapeForAttribute(ex.en)}\`, 'en')">
                🔊 استمع
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="grammar-quick-test">
        <div style="font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 0.35rem;">✍️ تمرين سريع: تحقق من فهمك</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.4rem; direction: ltr; text-align: left;">${rule.quiz.question}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem;">
          ${rule.quiz.options.map((opt, oIdx) => `
            <button type="button" class="quiz-option" id="gquiz-${rule.id}-${oIdx}" style="padding: 0.35rem 0.5rem; font-size: 0.75rem; text-align: center; direction: ltr;" onclick="checkGrammarQuiz('${rule.id}', ${oIdx}, ${rule.quiz.correct}, '${escapeForAttribute(rule.quiz.explanation)}')">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="gquiz-exp-${rule.id}" class="hidden" style="margin-top: 0.4rem; font-size: 0.72rem; padding: 0.35rem 0.5rem; border-radius: 4px;"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterGrammarByUnit(unit, btn) {
  currentActiveGrammarFilter = unit;
  renderGrammarRules();
}

function filterGrammarRules() {
  renderGrammarRules();
}

function checkGrammarQuiz(ruleId, selectedIdx, correctIdx, explanation) {
  const expDiv = document.getElementById(`gquiz-exp-${ruleId}`);
  const isCorrect = selectedIdx === correctIdx;

  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`gquiz-${ruleId}-${i}`);
    if (btn) {
      btn.classList.remove('selected', 'correct', 'wrong');
      if (i === correctIdx) btn.classList.add('correct');
      else if (i === selectedIdx && !isCorrect) btn.classList.add('wrong');
    }
  }

  expDiv.classList.remove('hidden');
  if (isCorrect) {
    expDiv.style.background = 'var(--success-light)';
    expDiv.style.color = '#065f46';
    expDiv.innerHTML = `<strong>إجابة صحيحة ممتاز! 🎉</strong> ${explanation}`;
  } else {
    expDiv.style.background = 'var(--danger-light)';
    expDiv.style.color = '#991b1b';
    expDiv.innerHTML = `<strong>حاول مرة أخرى:</strong> ${explanation}`;
  }
}
