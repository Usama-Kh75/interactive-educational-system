// =========================================================================
// لوحة التحكم، قائمة المناهج، الواجهة النشطة، وأشرطة السياق
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

// تصميم واجهة 2: شريط أزرار المناهج والمقررات بالصفحة الرئيسية
function renderDashboardCurriculaQuickBar() {
  const container = document.getElementById('dashboardCurriculaQuickBar');
  if (!container) return;

  const isEngActive = appData.currentCurriculumId === 3;
  const isAr1Active = appData.currentCurriculumId === 4;
  const isAr2Active = appData.currentCurriculumId === 5;
  const isIsActive = appData.currentCurriculumId === 6;
  const isPhyActive = appData.currentCurriculumId === 7;
  const isMathActive = appData.currentCurriculumId === 8;
  const isSocialActive = appData.currentCurriculumId === 9;
  const isChemActive = appData.currentCurriculumId === 10;
  const isBioActive = appData.currentCurriculumId === 11;

  container.innerHTML = `
    <!-- زر 1: مادة اللغة الإنجليزية -->
    <button type="button" aria-pressed="${isEngActive ? 'true' : 'false'}" class="curr-nav-btn eng-btn ${isEngActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(3)" title="تحديد منهج اللغة الإنجليزية">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #eef2ff; color: #4338ca; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📘</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">اللغة الإنجليزية</strong>
          ${isEngActive ? '<span style="background: #4f46e5; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #eef2ff; color: #4338ca; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">English</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">8 وحدات • 76 درساً • 119 ص</div>
      </div>
    </button>

    <!-- زر 2: اللغة العربية الجزء الأول -->
    <button type="button" aria-pressed="${isAr1Active ? 'true' : 'false'}" class="curr-nav-btn ar1-btn ${isAr1Active ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(4)" title="تحديد منهج اللغة العربية الجزء الأول">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📙</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">العربية (الجزء 1)</strong>
          ${isAr1Active ? '<span style="background: #059669; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #ecfdf5; color: #059669; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">كتاب 1</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">10 وحدات • 40 درساً • 136 ص</div>
      </div>
    </button>

    <!-- زر 3: اللغة العربية الجزء الثاني -->
    <button type="button" aria-pressed="${isAr2Active ? 'true' : 'false'}" class="curr-nav-btn ar2-btn ${isAr2Active ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(5)" title="تحديد منهج اللغة العربية الجزء الثاني">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📗</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">العربية (الجزء 2)</strong>
          ${isAr2Active ? '<span style="background: #16a34a; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #f0fdf4; color: #16a34a; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">كتاب 2</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">10 وحدات • 40 درساً • 136 ص</div>
      </div>
    </button>

    <!-- زر 4: مادة التربية الإسلامية -->
    <button type="button" aria-pressed="${isIsActive ? 'true' : 'false'}" class="curr-nav-btn is-btn ${isIsActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(6)" title="تحديد منهج التربية الإسلامية">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #f0fdfa; color: #0d9488; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🕌</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">التربية الإسلامية</strong>
          ${isIsActive ? '<span style="background: #0d9488; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #f0fdfa; color: #0d9488; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">6 وحدات • 31 درساً • 120 ص</div>
      </div>
    </button>

    <!-- زر 5: مادة الفيزياء -->
    <button type="button" aria-pressed="${isPhyActive ? 'true' : 'false'}" class="curr-nav-btn phy-btn ${isPhyActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(7)" title="تحديد منهج الفيزياء">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #f0f9ff; color: #0284c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">⚛️</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">الفيزياء</strong>
          ${isPhyActive ? '<span style="background: #0284c7; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #f0f9ff; color: #0284c7; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">3 وحدات • 6 فصول • 88 ص</div>
      </div>
    </button>

    <!-- زر 6: مادة الرياضيات -->
    <button type="button" aria-pressed="${isMathActive ? 'true' : 'false'}" class="curr-nav-btn math-btn ${isMathActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(8)" title="تحديد منهج الرياضيات">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #faf5ff; color: #7e22ce; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">📐</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">الرياضيات</strong>
          ${isMathActive ? '<span style="background: #7e22ce; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #faf5ff; color: #7e22ce; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">7 فصول • 51 درساً • 17 رسماً SVG</div>
      </div>
    </button>

    <!-- زر 7: مادة الاجتماعيات -->
    <button type="button" aria-pressed="${isSocialActive ? 'true' : 'false'}" class="curr-nav-btn soc-btn ${isSocialActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(9)" title="تحديد منهج الاجتماعيات">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #fffbeb; color: #b45309; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🌍</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">الاجتماعيات</strong>
          ${isSocialActive ? '<span style="background: #b45309; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #fffbeb; color: #b45309; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">6 فصول • 39 درساً • 140 ص</div>
      </div>
    </button>

    <!-- زر 8: مادة الكيمياء -->
    <button type="button" aria-pressed="${isChemActive ? 'true' : 'false'}" class="curr-nav-btn chem-btn ${isChemActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(10)" title="تحديد منهج الكيمياء">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🧪</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">الكيمياء</strong>
          ${isChemActive ? '<span style="background: #059669; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #ecfdf5; color: #059669; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">3 وحدات • 6 فصول • 96 ص</div>
      </div>
    </button>

    <!-- زر 9: مادة علم الأحياء -->
    <button type="button" aria-pressed="${isBioActive ? 'true' : 'false'}" class="curr-nav-btn bio-btn ${isBioActive ? 'active-curr' : ''}" onclick="selectCurriculumInDashboard(11)" title="تحديد منهج علم الأحياء">
      <div class="curr-btn-icon-box" style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🧬</div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.3rem;">
          <strong style="font-size: 0.92rem; color: var(--slate-900);">علم الأحياء</strong>
          ${isBioActive ? '<span style="background: #16a34a; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">النشط ✓</span>' : '<span style="background: #f0fdf4; color: #16a34a; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">معتمد</span>'}
        </div>
        <div style="font-size: 0.74rem; color: var(--slate-500); font-weight: 600; margin-top: 0.15rem;">3 وحدات • 7 فصول • 92 ص</div>
      </div>
    </button>
  `;
}

// شريط تبويبات المناهج الفردية في بوابة المناهج والمواد
function renderCurriculaTabsNav() {
  const nav = document.getElementById('curriculaTabsNav');
  if (!nav) return;

  if (!currentCurriculumViewTab) {
    if (appData.currentCurriculumId === 4 || appData.currentCurriculumId === 5) {
      currentCurriculumViewTab = 'arabic';
    } else if (appData.currentCurriculumId === 6) {
      currentCurriculumViewTab = 6;
    } else if (appData.currentCurriculumId === 7) {
      currentCurriculumViewTab = 7;
    } else if (appData.currentCurriculumId === 8) {
      currentCurriculumViewTab = 8;
    } else if (appData.currentCurriculumId === 9) {
      currentCurriculumViewTab = 9;
    } else if (appData.currentCurriculumId === 10) {
      currentCurriculumViewTab = 10;
    } else if (appData.currentCurriculumId === 11) {
      currentCurriculumViewTab = 11;
    } else {
      currentCurriculumViewTab = 3;
    }
  }

  nav.innerHTML = `
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 3 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 3 ? 'active eng' : ''}" onclick="setCurriculumViewTab(3)">
      <span>📘</span>
      <span>اللغة الإنجليزية</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 3 ? 'background: #e0e7ff; color: #4338ca;' : 'background: #e2e8f0; color: #475569;'}">English</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 'arabic' ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 'arabic' ? 'active arab' : ''}" onclick="setCurriculumViewTab('arabic')">
      <span>📚</span>
      <span>اللغة العربية</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 'arabic' ? 'background: #d1fae5; color: #065f46;' : 'background: #e2e8f0; color: #475569;'}">كتابان</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 6 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 6 ? 'active islamic' : ''}" onclick="setCurriculumViewTab(6)">
      <span>🕌</span>
      <span>التربية الإسلامية</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 6 ? 'background: #ccfbf1; color: #0f766e;' : 'background: #e2e8f0; color: #475569;'}">120 ص</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 7 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 7 ? 'active physics' : ''}" onclick="setCurriculumViewTab(7)">
      <span>⚛️</span>
      <span>الفيزياء</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 7 ? 'background: #e0f2fe; color: #0369a1;' : 'background: #e2e8f0; color: #475569;'}">88 ص</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 8 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 8 ? 'active math' : ''}" onclick="setCurriculumViewTab(8)">
      <span>📐</span>
      <span>الرياضيات</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 8 ? 'background: #f3e8ff; color: #7e22ce;' : 'background: #e2e8f0; color: #475569;'}">7 فصول</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 9 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 9 ? 'active social' : ''}" onclick="setCurriculumViewTab(9)">
      <span>🌍</span>
      <span>الاجتماعيات</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 9 ? 'background: #fef3c7; color: #92400e;' : 'background: #e2e8f0; color: #475569;'}">6 فصول</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 10 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 10 ? 'active chemistry' : ''}" onclick="setCurriculumViewTab(10)">
      <span>🧪</span>
      <span>الكيمياء</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 10 ? 'background: #d1fae5; color: #065f46;' : 'background: #e2e8f0; color: #475569;'}">6 فصول</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 11 ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 11 ? 'active bio' : ''}" onclick="setCurriculumViewTab(11)">
      <span>🧬</span>
      <span>علم الأحياء</span>
      <span class="curr-pill-badge" style="font-size:0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; ${currentCurriculumViewTab === 11 ? 'background: #dcfce7; color: #15803d;' : 'background: #e2e8f0; color: #475569;'}">7 فصول</span>
    </button>
    <button type="button" role="tab" aria-selected="${currentCurriculumViewTab === 'all' ? 'true' : 'false'}" class="curricula-tab-btn ${currentCurriculumViewTab === 'all' ? 'active all' : ''}" onclick="setCurriculumViewTab('all')">
      <span>🌐</span>
      <span>عرض كافة المناهج</span>
    </button>
  `;
}

function setCurriculumViewTab(tabMode) {
  currentCurriculumViewTab = tabMode;
  renderCurriculaTabsNav();
  renderCurriculumsList();
}

// تحديث إحصائيات لوحة التحكم الشاملة لكافة مناهج المنظومة
function renderDashboard() {
  const currs = (appData.curriculums || []).filter(c => 
    c && c.id !== 1 && 
    !(c.name && (c.name.includes('دليل وثيقة') || c.name.includes('وثيقة النظام'))) && 
    !(c.subject && (c.subject.includes('هندسة النظم') || c.subject.includes('وثيقة')))
  );
  // حساب عدد المواد والمناهج المعتمدة (الإنجليزية، العربية بجزأيها، الإسلامية، الفيزياء، الرياضيات، الاجتماعيات، الكيمياء، علم الأحياء)
  const officialSubjects = new Set();
  currs.forEach(c => {
    const n = (c.name || '').toLowerCase();
    const s = (c.subject || '').toLowerCase();
    if (n.includes('أحياء') || s.includes('أحياء') || c.id === 11) {
      officialSubjects.add('biology');
    } else if (n.includes('كيمياء') || s.includes('كيمياء') || c.id === 10) {
      officialSubjects.add('chemistry');
    } else if (n.includes('اجتماع') || s.includes('اجتماع') || c.id === 9) {
      officialSubjects.add('social');
    } else if (n.includes('رياضيات') || s.includes('رياض') || c.id === 8) {
      officialSubjects.add('math');
    } else if (n.includes('فيزياء') || s.includes('فيزياء') || c.id === 7) {
      officialSubjects.add('physics');
    } else if (n.includes('إسلامية') || s.includes('إسلام') || c.id === 6) {
      officialSubjects.add('islamic');
    } else if (n.includes('عربية') || s.includes('عرب') || c.id === 4 || c.id === 5) {
      officialSubjects.add('arabic');
    } else if (n.includes('انجليزية') || s.includes('eng') || c.id === 3) {
      officialSubjects.add('english');
    } else {
      officialSubjects.add(c.id);
    }
  });
  document.getElementById('statCurriculums').innerText = officialSubjects.size || 8;
  
  let totalChapters = 0;
  let totalLessons = 0;

  currs.forEach(c => {
    const chaps = getCurriculumChapters(c);
    if (chaps && chaps.length > 0) {
      totalChapters += chaps.length;
      chaps.forEach(ch => {
        totalLessons += (ch.lessons || []).length;
      });
    } else {
      totalChapters += (c.metaChaptersCount || 0);
      totalLessons += (c.metaLessonsCount || 0);
    }
  });

  const engGrammarCount = (window.GRAMMAR_RULES || []).length || 43;
  const arGrammarCount = (window.ARABIC_GRAMMAR_RULES || []).length || 18;
  const isGrammarCount = (window.ISLAMIC_RULES || []).length || 15;
  const phyRulesCount = (window.PHYSICS_RULES || []).length || 18;
  const mathRulesCount = (window.MATH_RULES || []).length || 22;
  const socRulesCount = (window.SOCIAL_TERMS_BANK || []).length || 13;
  const chemRulesCount = (window.CHEMISTRY_RULES || []).length || 24;
  const bioRulesCount = (window.BIOLOGY_RULES || []).length || 28;
  const totalGrammarCount = engGrammarCount + arGrammarCount + isGrammarCount + phyRulesCount + mathRulesCount + socRulesCount + chemRulesCount + bioRulesCount;

  document.getElementById('statChapters').innerText = totalChapters || 42;
  document.getElementById('statLessons').innerText = totalLessons || 214;
  
  const statGrammarEl = document.getElementById('statGrammar');
  if (statGrammarEl) {
    statGrammarEl.innerText = totalGrammarCount + ' قاعدة ومفهوماً';
    statGrammarEl.title = `إجمالي القواعد والمفاهيم الموثقة في المنظومة: ${engGrammarCount} إنجليزية + ${arGrammarCount} عربية + ${isGrammarCount} إسلامية + ${phyRulesCount} فيزياء + ${mathRulesCount} رياضيات + ${socRulesCount} اجتماعيات + ${chemRulesCount} كيمياء + ${bioRulesCount} علم أحياء`;
  }

  renderDashboardCurriculaQuickBar();
  renderActiveSubjectShowcase();
}

// عرض بطاقات المناهج بأسلوب المنصات العالمية بدون تكرار
function renderCurriculumsList() {
  const container = document.getElementById('curriculumsContainer');
  if (!container) return;
  container.innerHTML = '';

  const currs = (appData.curriculums || []).filter(c => 
    c && c.id !== 1 && 
    !(c.name && (c.name.includes('دليل وثيقة') || c.name.includes('وثيقة النظام'))) && 
    !(c.subject && (c.subject.includes('هندسة النظم') || c.subject.includes('وثيقة')))
  );

  const showEng = currentCurriculumViewTab === 3 || currentCurriculumViewTab === 'all';
  const showArab = currentCurriculumViewTab === 'arabic' || currentCurriculumViewTab === 'all';
  const showIslamic = currentCurriculumViewTab === 6 || currentCurriculumViewTab === 'all';
  const showPhysics = currentCurriculumViewTab === 7 || currentCurriculumViewTab === 'all';
  const showMath = currentCurriculumViewTab === 8 || currentCurriculumViewTab === 'all';
  const showSocial = currentCurriculumViewTab === 9 || currentCurriculumViewTab === 'all';
  const showChemistry = currentCurriculumViewTab === 10 || currentCurriculumViewTab === 'all';
  const showBiology = currentCurriculumViewTab === 11 || currentCurriculumViewTab === 'all';

  // 1. بطاقة منهج اللغة الإنجليزية
  if (showEng) {
  const engCurr = currs.find(c => c.id === 3);
  if (engCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1px solid var(--slate-200); box-shadow: var(--shadow); transition: transform 0.25s ease, box-shadow 0.25s ease; grid-column: 1 / -1; margin-bottom: 1.5rem;';
    div.innerHTML = `
      <div style="display: flex; gap: 1.5rem; padding: 1.5rem; align-items: stretch; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); flex-wrap: wrap;">
        <div style="width: 125px; height: 180px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -8px 10px 22px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06); background: #1e1b4b; cursor: default;">
          <img src="./book_images/page_1.jpeg" alt="${engCurr.name}" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
        </div>
        <div style="flex: 1 1 380px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span class="curr-badge" style="background: var(--primary-light); color: var(--primary); font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 6px;">English for Iraq</span>
              <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الوزاري المعتمد • مكتمل 100%</span>
              <span style="background: var(--slate-100); color: var(--slate-700); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">الصف: ${engCurr.grade || 'الثاني متوسط'}</span>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 0.4rem; color: var(--slate-900); display: flex; align-items: center; gap: 0.5rem;">
              <span>📘</span>
              <span>${engCurr.name}</span>
            </h3>
            <p style="font-size: 0.86rem; color: var(--slate-600); line-height: 1.65; margin-bottom: 0.85rem;">
              منهاج تفاعلي متكامل يشمل قراءة نصوص كتاب الطالب وكتاب النشاط بصوت بشري فصيح طبيعي، تتبع الكلمات اللحظي، بنك القواعد النحوية الشامل (43 قاعدة ومفهوماً)، ونماذج الامتحانات الوزارية والشهرية السابقة وحلولها النموذجية مع ميزة الطباعة الورقية والتدريب التفاعلي.
            </p>
            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              <span style="background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 800;">📚 8 وحدات و 76 درساً</span>
              <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 800;">💡 43 قاعدة ومفهوماً</span>
              <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 800;">📝 الامتحان النهائي الشامل 100 درجة</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.6rem; border-top: 1px solid var(--slate-100); padding-top: 0.85rem; margin-top: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="openSubjectTab(${engCurr.id})" style="font-weight: 800; background: linear-gradient(135deg, #4338ca, #6366f1); border: none; padding: 0.65rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(67, 56, 202, 0.3);">
              📖 دخول قاعة المذاكرة والدروس ⮞
            </button>
            <button class="btn btn-secondary" onclick="openPastExamsTab('midyear')" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
              📝 نماذج الامتحانات والأسئلة
            </button>
            <button class="btn btn-secondary" onclick="switchTab('grammar')" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
              💡 بنك القواعد النحوية
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  }

  }

  // 2. بطاقة موحدة لمنهج اللغة العربية يتفرع منها الجزء الأول والجزء الثاني
  if (showArab) {
  const arP1Curr = currs.find(c => c.id === 4);
  const arP2Curr = currs.find(c => c.id === 5);

  if (arP1Curr || arP2Curr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #a7f3d0; box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.12); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <!-- رأس البطاقة الموحدة لمادة اللغة العربية -->
      <div style="padding: 1.5rem 1.75rem 1.25rem; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-bottom: 1.5px solid #d1fae5;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span class="curr-badge" style="background: #059669; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد</span>
              <span style="background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الشامل بجزأيه الأول والثاني • مكتمل 100%</span>
              <span style="background: #ffffff; color: var(--slate-700); border: 1px solid var(--slate-200); padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">الصف: الثاني متوسط</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.4rem; color: #064e3b; display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.75rem;">📚</span>
              <span>مادة اللغة العربية - الصف الثاني المتوسط</span>
            </h3>
            <p style="font-size: 0.88rem; color: #065f46; line-height: 1.65; margin: 0; max-width: 900px;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية بكامل أجزائه ونصوصه المشكولة بالحركات، متضمناً 20 وحدة دراسية و 80 درساً شاملاً و 272 صفحة أصلية بدقة فائقة 130 DPI، بنك القواعد النحوية والإملائية (18 قاعدة تفصيلية مع الأمثلة والشواهد والإعراب)، والقراءة الصوتية الفصيحة التفاعلية.
            </p>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="background: #ffffff; color: #047857; border: 1.5px solid #a7f3d0; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              📖 272 صفحة أصلية
            </span>
            <span style="background: #ffffff; color: #92400e; border: 1.5px solid #fde68a; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              💡 18 قاعدة نحوية وإملائية
            </span>
          </div>
        </div>
      </div>

      <!-- تفريع المنهج: الفرعان المتفرعان (كتاب الجزء الأول وكتاب الجزء الثاني) -->
      <div style="padding: 1.5rem 1.75rem; background: #ffffff;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.92rem; font-weight: 900; color: var(--slate-800); display: flex; align-items: center; gap: 0.4rem;">
            <span>🌿</span> يتفرع المنهج إلى كتابين مقررين معتمدين:
          </span>
          <span style="font-size: 0.78rem; color: var(--slate-500);">اختر الجزء المطلوب لمباشرة قاعة المذاكرة والدروس</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.25rem;">
          
          <!-- الفرع الأول: كتاب الجزء الأول -->
          <div class="arabic-branch-card ${appData.currentCurriculumId === 4 ? 'active-card' : ''}">
            <div style="display: flex; gap: 1rem; align-items: stretch;">
              <div style="width: 105px; height: 152px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(5,150,105,0.2), 0 0 0 1px rgba(0,0,0,0.06); background: #064e3b; cursor: default;">
                <img src="./book_images/arabic_p1/page_1.jpeg" alt="غلاف الجزء الأول" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.25rem;">
                    <span style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">الكورس الأول</span>
                    <span style="background: var(--slate-100); color: var(--slate-600); font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">136 صفحة</span>
                  </div>
                  <h4 style="font-size: 1.15rem; font-weight: 900; color: #064e3b; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
                    <span>📙</span>
                    <span>كتاب الجزء الأول</span>
                  </h4>
                  <p style="font-size: 0.78rem; color: var(--slate-600); line-height: 1.55; margin: 0 0 0.5rem;">
                    المطالعة والنصوص القرآنية والأدبية، علامات الإعراب الأصلية والفرعية، جمع المذكر، جمع المؤنث، المثنى، الأسماء الخمسة، الأفعال الخمسة، والميزان الصرفي.
                  </p>
                </div>
                <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
                  <span style="background: #f0fdf4; color: #166534; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px; border: 1px solid #bbf7d0;">📚 10 وحدات و 40 درساً</span>
                  <span style="background: #fef3c7; color: #92400e; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px; border: 1px solid #fde68a;">💡 9 قواعد تخصصية</span>
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 0.85rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary" onclick="openSubjectTab(4)" style="flex: 1; min-width: 140px; font-weight: 800; background: linear-gradient(135deg, #059669, #10b981); border: none; padding: 0.55rem 1rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                📖 مذاكرة الجزء الأول ⮞
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="openArabicP1ReviewsModal()" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.85rem;" title="مراجعات وحلول الوحدات">
                🎯 المراجعات والحلول (9 وحدات)
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(4); switchTab('grammar');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 0.85rem;" title="قواعد الجزء الأول">
                💡 القواعد
              </button>
            </div>
          </div>

          <!-- الفرع الثاني: كتاب الجزء الثاني -->
          <div class="arabic-branch-card ${appData.currentCurriculumId === 5 ? 'active-card' : ''}">
            <div style="display: flex; gap: 1rem; align-items: stretch;">
              <div style="width: 105px; height: 152px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(4,120,87,0.2), 0 0 0 1px rgba(0,0,0,0.06); background: #064e3b; cursor: default;">
                <img src="./book_images/arabic_p2/page_1.jpeg" alt="غلاف الجزء الثاني" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.25rem;">
                    <span style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">الكورس الثاني</span>
                    <span style="background: var(--slate-100); color: var(--slate-600); font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;">136 صفحة</span>
                  </div>
                  <h4 style="font-size: 1.15rem; font-weight: 900; color: #047857; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
                    <span>📗</span>
                    <span>كتاب الجزء الثاني</span>
                  </h4>
                  <p style="font-size: 0.78rem; color: var(--slate-600); line-height: 1.55; margin: 0 0 0.5rem;">
                    نصوص الفداء، سورة الرحمن، نساء في القمة، الربيع، إرادة الحياة، النداء، الاستفهام، بناء المضارع، المثنى، الجموع، المقصور والمنقوص والممدود، والممنوع من الصرف.
                  </p>
                </div>
                <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
                  <span style="background: #f0fdf4; color: #166534; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px; border: 1px solid #bbf7d0;">📚 10 وحدات و 40 درساً</span>
                  <span style="background: #fef3c7; color: #92400e; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px; border: 1px solid #fde68a;">💡 9 قواعد تخصصية</span>
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 0.85rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary" onclick="openSubjectTab(5)" style="flex: 1; min-width: 140px; font-weight: 800; background: linear-gradient(135deg, #047857, #059669); border: none; padding: 0.55rem 1rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25);">
                📖 مذاكرة الجزء الثاني ⮞
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="openArabicP2ReviewsModal()" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.85rem;" title="مراجعات وحلول الوحدات">
                🎯 المراجعات والحلول (9 وحدات)
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(5); switchTab('grammar');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 0.85rem;" title="قواعد الجزء الثاني">
                💡 القواعد
              </button>
            </div>
          </div>

        </div>

        <!-- شريط الأدوات المشترك لمادة اللغة العربية -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1.5px dashed #e2e8f0;">
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(4); switchTab('grammar');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; font-size: 0.88rem; padding: 0.6rem 1.2rem;">
            💡 بنك قواعد اللغة العربية الشامل لكلا الجزأين (18 قاعدة تفصيلية) ⮞
          </button>
          <span style="font-size: 0.8rem; color: #047857; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>🎙️</span> قراءة صوتية باللغة العربية الفصحى مشكولة ومضبوطة بالشكل
          </span>
        </div>
      </div>
    `;
    container.appendChild(div);
  }

  }

  // 3. أي مناهج أخرى مخصصة مضافة من المستخدم (دون تكرار المناهج الوزارية الـ 9 المعتمدة)
  if (currentCurriculumViewTab === 'all') {
    currs.filter(c => !BUILTIN_CURRICULUM_IDS.has(Number(c.id))).forEach(curr => {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1px solid var(--slate-200); box-shadow: var(--shadow); grid-column: 1 / -1; margin-bottom: 1.5rem;';
    div.innerHTML = `
      <div style="display: flex; gap: 1.5rem; padding: 1.5rem; align-items: stretch; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); flex-wrap: wrap;">
        <div style="width: 125px; height: 180px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: #334155; display: flex; align-items: center; justify-content: center; color: #e2e8f0; font-size: 2.5rem;">📘</div>
        <div style="flex: 1 1 380px;">
          <h3>${escapeHtml(curr.name)}</h3>
          <p>${escapeHtml(curr.description || '')}</p>
          <button class="btn btn-primary" onclick="openSubjectTab(${Number(curr.id)})">📖 دخول قاعة المذاكرة والدروس ⮞</button>
        </div>
      </div>
    `;
    container.appendChild(div);
    });
  }

  // 3. بطاقة منهج التربية الإسلامية
  if (showIslamic) {
  const islamicCardCurr = currs.find(c => c.id === 6);
  if (islamicCardCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #99f6e4; box-shadow: 0 10px 25px -5px rgba(13, 148, 136, 0.15); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <div style="padding: 1.5rem 1.75rem 1.25rem; background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%); border-bottom: 1.5px solid #ccfbf1;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span class="curr-badge" style="background: #0d9488; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد</span>
              <span style="background: #ffffff; color: #0f766e; border: 1px solid #99f6e4; padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الكامل (6 وحدات) • مكتمل 100%</span>
              <span style="background: #ffffff; color: var(--slate-700); border: 1px solid var(--slate-200); padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">الصف: الثاني متوسط</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.4rem; color: #115e59; display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.75rem;">🕌</span>
              <span>مادة التربية الإسلامية والقرآن الكريم - الصف الثاني المتوسط</span>
            </h3>
            <p style="font-size: 0.88rem; color: #134e4a; line-height: 1.65; margin: 0; max-width: 900px;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية بكامل نصوصه المشكولة بالحركات وتفاسيره المعتمدة: أحكام التلاوة والمد العارض للسكون، السور الكريمة (النبأ، القيامة، المزمل، الجمعة، والصف)، الأحاديث النبوية الشريفة وأهم ما ترشد إليه، العقيدة والمعجزات، فقه الصلاة والجماعة والليل والآيات والصوم والسجود، السيرة النبوية والتراجم، ومكارم الأخلاق والتهذيب (31 درساً تفاعلياً، 111 مقطعاً، 120 صفحة أصلية، و 15 حكماً وقاعدة فقهية وعقدية).
            </p>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="background: #ffffff; color: #0d9488; border: 1.5px solid #99f6e4; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              📖 120 صفحة أصلية
            </span>
            <span style="background: #ffffff; color: #92400e; border: 1.5px solid #fde68a; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              💡 15 حكماً وقاعدة فقهية
            </span>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem 1.75rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 75px; height: 105px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -3px 4px 10px rgba(13,148,136,0.2); background: #134e4a; cursor: default;">
            <img src="./book_images/islamic/page_1.jpeg" alt="كتاب التربية الإسلامية" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          </div>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; color: #0f766e; margin-bottom: 0.25rem;">كتاب الطالب الرسمي المعتمد</div>
            <div style="font-size: 0.82rem; color: var(--slate-600); line-height: 1.5;">6 وحدات شاملة متضمنة أحكام التلاوة، السور القرآنية للحفظ والشرح، وبنك الأحكام والبطاقات المفاهيمية.</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openSubjectTab(6)" style="font-weight: 800; background: linear-gradient(135deg, #0d9488, #0f766e); border: none; padding: 0.65rem 1.25rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">
            📖 دخول قاعة المذاكرة والدروس ⮞
          </button>
          <button class="btn btn-secondary" onclick="openIslamicReviewsModal()" style="background: #f0fdfa; color: #0d9488; border-color: #99f6e4; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎯 مناقشات ومراجعات الفصول والحلول النموذجية (6 وحدات)
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(6); switchTab('grammar'); setGrammarSubjectMode('is');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            💡 بنك أحكام وقواعد التربية الإسلامية
          </button>
          <button class="btn btn-secondary" onclick="openDigitalLibraryReader(6, 4)" style="background: #ffffff; color: #0f766e; border-color: #99f6e4; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            📖 تصفح صفحات الكتاب (120 صفحة)
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
  }

  // 4. بطاقة منهج الفيزياء
  if (showPhysics) {
  const phyCardCurr = currs.find(c => c.id === 7);
  if (phyCardCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #7dd3fc; box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.15); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <div style="padding: 1.5rem 1.75rem 1.25rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-bottom: 1.5px solid #bae6fd;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span class="curr-badge" style="background: #0284c7; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد</span>
              <span style="background: #ffffff; color: #0369a1; border: 1px solid #7dd3fc; padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الكامل (3 وحدات • 6 فصول) • مكتمل 100%</span>
              <span style="background: #ffffff; color: var(--slate-700); border: 1px solid var(--slate-200); padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">الصف: الثاني متوسط</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.4rem; color: #075985; display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.75rem;">⚛️</span>
              <span>مادة الفيزياء - الصف الثاني المتوسط</span>
            </h3>
            <p style="font-size: 0.88rem; color: #0369a1; line-height: 1.65; margin: 0; max-width: 900px;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية بكامل فصوله ومسائله وقوانينه: الحركة والقوة، قوانين نيوتن والجاذبية، الشغل والقدرة والطاقة وتحولاتها، الآلات البسيطة والعتلات وكفاءة الآلة، الحركة الموجية وخصائص الصوت والصدى، والضوء وانعكاسه والمرايا وانكسار الضوء والعدسات (20 درساً تفاعلياً، 60 بطاقة تمارين و 259 سؤالاً محلولاً، 88 صفحة أصلية، 15 لوحة SVG، و18 قانوناً فيزيائياً).
            </p>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="background: #ffffff; color: #0284c7; border: 1.5px solid #7dd3fc; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              📖 88 صفحة أصلية
            </span>
            <span style="background: #ffffff; color: #b45309; border: 1.5px solid #fde68a; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              💡 18 قانوناً ومفهوماً فيزيائياً
            </span>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem 1.75rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 75px; height: 105px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -3px 4px 10px rgba(2,132,199,0.2); background: #0c4a6e; cursor: default;">
            <img src="./book_images/physics/page_1.jpeg" alt="كتاب الفيزياء" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          </div>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; color: #0369a1; margin-bottom: 0.25rem;">كتاب الطالب الرسمي المعتمد</div>
            <div style="font-size: 0.82rem; color: var(--slate-500); font-weight: 700;">3 وحدات دراسية • 6 فصول • 20 درساً تفاعلياً • 60 بطاقة (259 سؤالاً) • 88 صفحة ملونة</div>
            <div style="font-size: 0.76rem; color: #0284c7; font-weight: 800; margin-top: 0.2rem;">إعداد وتطوير: إعداد المهندس أسامة خليل هاشم</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openSubjectTab(${phyCardCurr.id})" style="font-weight: 800; background: linear-gradient(135deg, #0284c7, #0369a1); border: none; padding: 0.65rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);">
            📖 دخول قاعة المذاكرة والدروس ⮞
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${phyCardCurr.id}); switchTab('grammar'); setGrammarSubjectMode('phy');" style="background: #f0f9ff; color: #0369a1; border-color: #7dd3fc; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            💡 بنك القوانين والمفاهيم
          </button>
          <button class="btn btn-secondary" onclick="openPhysicsReviewsModal()" style="background: #e0f2fe; color: #0284c7; border-color: #bae6fd; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎯 مراجعات الدروس والفصول (259 سؤالاً)
          </button>
          <button class="btn btn-secondary" onclick="openDigitalLibraryReader(${phyCardCurr.id}, 1)" style="background: #ffffff; color: var(--slate-700); border-color: var(--slate-300); font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            📖 تصفح الكتاب الأصلي
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
  }

  // 5. بطاقة منهج الرياضيات
  if (showMath) {
  const mathCardCurr = currs.find(c => c.id === 8);
  if (mathCardCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #d8b4fe; box-shadow: 0 10px 25px -5px rgba(126, 34, 206, 0.15); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <div style="padding: 1.5rem 1.75rem 1.25rem; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-bottom: 1.5px solid #e9d5ff;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
              <span class="curr-badge" style="background: #7e22ce; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد</span>
              <span style="background: #ffffff; color: #6b21a8; border: 1px solid #d8b4fe; padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الكامل (الجزء الأول والثاني • 7 فصول) • مكتمل 100%</span>
              <span style="background: #ffffff; color: #581c87; border: 1px solid #d8b4fe; padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">📐 17 لوحة هندسية وبيانية SVG</span>
              <span style="background: #ffffff; color: var(--slate-700); border: 1px solid var(--slate-200); padding: 0.2rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">الصف: الثاني متوسط</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 900; margin: 0 0 0.4rem; color: #581c87; display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.75rem;">📐</span>
              <span>مادة الرياضيات - الصف الثاني المتوسط</span>
            </h3>
            <p style="font-size: 0.88rem; color: #6b21a8; line-height: 1.65; margin: 0; max-width: 900px;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية بكامل فصوله ومسائله ونظرياته: الأعداد النسبية، الأعداد الحقيقية وخواص العمليات، الحدوديات والتحليل الجبري، المعادلات والمتباينات في R، الهندسة والقياس وتطابق المثلثات، الهندسة الإحداثية والميل، والإحصاء والاحتمالات (51 درساً تفاعلياً، 635 سؤالاً محلولاً، 17 لوحة هندسية وبيانية SVG، و22 قانوناً ونظرية ومفهوماً).
            </p>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span style="background: #ffffff; color: #7e22ce; border: 1.5px solid #d8b4fe; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              📖 7 فصول • 51 درساً
            </span>
            <span style="background: #ffffff; color: #b45309; border: 1.5px solid #fde68a; font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.85rem; border-radius: 9999px;">
              💡 22 قانوناً ونظرية
            </span>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem 1.75rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 75px; height: 105px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -3px 4px 10px rgba(126,34,206,0.2); background: #581c87; cursor: default; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <span style="font-size: 2.2rem;">📐</span>
            <span style="font-size: 0.65rem; font-weight: 800; margin-top: 0.2rem;">الرياضيات</span>
          </div>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; color: #581c87; margin-bottom: 0.25rem;">كتاب الطالب الرسمي المعتمد (الجزأين 1 و 2)</div>
            <div style="font-size: 0.82rem; color: var(--slate-500); font-weight: 700;">4 وحدات كبرى • 7 فصول • 51 درساً تفاعلياً • 17 لوحة SVG • بنك النظريات</div>
            <div style="font-size: 0.76rem; color: #7e22ce; font-weight: 800; margin-top: 0.2rem;">إعداد وتطوير: إعداد المهندس أسامة خليل هاشم</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openSubjectTab(${mathCardCurr.id})" style="font-weight: 800; background: linear-gradient(135deg, #7e22ce, #6b21a8); border: none; padding: 0.65rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(126, 34, 206, 0.3);">
            📖 دخول قاعة المذاكرة والدروس ⮞
          </button>
          <button class="btn btn-secondary" onclick="openAllMathDiagramsGallery()" style="background: #ffffff; color: #7e22ce; border-color: #d8b4fe; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎨 الرسوم الهندسية SVG (17 لوحة)
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${mathCardCurr.id}); switchTab('grammar'); setGrammarSubjectMode('math');" style="background: #faf5ff; color: #6b21a8; border-color: #d8b4fe; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            💡 بنك القوانين والنظريات
          </button>
          <button class="btn btn-secondary" onclick="openMathReviewsModal()" style="background: #f3e8ff; color: #7e22ce; border-color: #e9d5ff; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎯 مراجعات الفصول والحلول النموذجية (7 فصول)
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${mathCardCurr.id}); switchTab('exams'); setExamSubjectMode('math');" style="background: #ffffff; color: var(--slate-700); border-color: var(--slate-300); font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            📝 الامتحانات الوزارية
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
  }

  // 6. بطاقة منهج الاجتماعيات
  if (showSocial) {
  const socCardCurr = currs.find(c => c.id === 9);
  if (socCardCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #fde68a; box-shadow: 0 10px 25px -5px rgba(180, 83, 9, 0.15); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <div style="display: flex; gap: 1.5rem; padding: 1.75rem; align-items: stretch; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); flex-wrap: wrap;">
        <div style="width: 135px; height: 195px; border-radius: 12px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 16px rgba(180,83,9,0.3); background: #78350f; cursor: default; position: relative;">
          <img src="./book_images/social/page_1.jpeg" alt="غلاف كتاب الاجتماعيات" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(120,53,15,0.95), transparent); padding: 0.5rem; text-align: center;">
            <span style="color: white; font-size: 0.72rem; font-weight: 800;">140 صفحة أصلية</span>
          </div>
        </div>

        <div style="flex: 1 1 420px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.6rem;">
              <span class="badge" style="background: #b45309; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
              <span class="badge" style="background: #ffffff; color: #92400e; border: 1px solid #fde68a; font-size: 0.76rem; font-weight: 800;">🌍 6 فصول كاملة (140 صفحة)</span>
              <span class="badge" style="background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.76rem; font-weight: 800;">💡 أطلس الخرائط وبنك المصطلحات</span>
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 900; color: #78350f; margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.6rem;">
              <span>🌍</span>
              <span>الاجتماعيات - الصف الثاني المتوسط</span>
            </h2>
            <p style="font-size: 0.92rem; color: #92400e; line-height: 1.7; margin: 0 0 1rem; font-weight: 600;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الاجتماعيات (الباب الأول: جغرافية العالم العربي الطبيعية والاقتصادية، والباب الثاني: تاريخ العالم العربي وشبه الجزيرة ومكة المكرمة والسيرة النبوية الشريفة في مكة والمدينة) • 6 فصول شاملة، 39 درساً تفاعلياً، 71 بطاقة تمارين و 164 سؤالاً محلولاً، وربط كافة صفحات المحتوى (4–139) وبنك المصطلحات والمفاهيم.
            </p>
          </div>

          <div style="display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap; background: rgba(255,255,255,0.7); padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #fde68a;">
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #92400e; font-weight: 800;">
              <span>📚 6 فصول</span>
            </div>
            <div style="width: 1px; height: 16px; background: #fde68a;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #92400e; font-weight: 800;">
              <span>📖 39 درساً تفاعلياً</span>
            </div>
            <div style="width: 1px; height: 16px; background: #fde68a;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #92400e; font-weight: 800;">
              <span>🎯 71 بطاقة (164 سؤالاً)</span>
            </div>
            <div style="width: 1px; height: 16px; background: #fde68a;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #92400e; font-weight: 800;">
              <span>🖼️ 140 صفحة أصلية</span>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem 1.75rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 75px; height: 105px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -3px 4px 10px rgba(180,83,9,0.2); background: #78350f; cursor: default; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <span style="font-size: 2.2rem;">🌍</span>
            <span style="font-size: 0.65rem; font-weight: 800; margin-top: 0.2rem;">الاجتماعيات</span>
          </div>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; color: #78350f; margin-bottom: 0.25rem;">كتاب الطالب الرسمي المعتمد (الباب الأول والباب الثاني)</div>
            <div style="font-size: 0.82rem; color: var(--slate-500); font-weight: 700;">بابان رئيسيان • 6 فصول • 39 درساً تفاعلياً • أطلس الخرائط وبنك المصطلحات</div>
            <div style="font-size: 0.76rem; color: #b45309; font-weight: 800; margin-top: 0.2rem;">إعداد وتطوير: إعداد المهندس أسامة خليل هاشم</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openSubjectTab(${socCardCurr.id})" style="font-weight: 800; background: linear-gradient(135deg, #b45309, #92400e); border: none; padding: 0.65rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.3);">
            📖 دخول قاعة المذاكرة والدروس ⮞
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${socCardCurr.id}); switchTab('grammar'); setGrammarSubjectMode('social');" style="background: #fffbeb; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            💡 بنك المصطلحات والمفاهيم
          </button>
          <button class="btn btn-secondary" onclick="openSocialReviewsModal()" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎯 مراجعات الدروس والفصول (164 سؤالاً)
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${socCardCurr.id}); switchTab('exams'); setExamSubjectMode('soc');" style="background: #ffffff; color: var(--slate-700); border-color: var(--slate-300); font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            📝 الامتحانات الوزارية والشهرية
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
  }

  // 7. بطاقة منهج الكيمياء
  if (showChemistry) {
  const chemCardCurr = currs.find(c => c.id === 10);
  if (chemCardCurr) {
    const div = document.createElement('div');
    div.className = 'card curr-card';
    div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1.5px solid #a7f3d0; box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.15); grid-column: 1 / -1; margin-bottom: 1.75rem; background: #ffffff;';
    div.innerHTML = `
      <div style="display: flex; gap: 1.5rem; padding: 1.75rem; align-items: stretch; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); flex-wrap: wrap;">
        <div style="width: 135px; height: 195px; border-radius: 12px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 16px rgba(5,150,105,0.3); background: #064e3b; cursor: default; position: relative;">
          <img src="./book_images/chemistry/page_1.jpeg" alt="غلاف كتاب الكيمياء" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,78,59,0.95), transparent); padding: 0.5rem; text-align: center;">
            <span style="color: white; font-size: 0.72rem; font-weight: 800;">96 صفحة أصلية</span>
          </div>
        </div>

        <div style="flex: 1 1 420px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.6rem;">
              <span class="badge" style="background: #059669; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
              <span class="badge" style="background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.76rem; font-weight: 800;">🧪 3 وحدات • 6 فصول (96 صفحة)</span>
              <span class="badge" style="background: #ffffff; color: #047857; border: 1px solid #6ee7b7; font-size: 0.76rem; font-weight: 800;">⚗️ 16 رسماً علمياً متجهياً</span>
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 900; color: #064e3b; margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.6rem;">
              <span>🧪</span>
              <span>الكيمياء - الصف الثاني المتوسط</span>
            </h2>
            <p style="font-size: 0.92rem; color: #065f46; line-height: 1.7; margin: 0 0 1rem; font-weight: 600;">
              المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الكيمياء (الوحدة 1: العناصر والترابط الكيميائي، الوحدة 2: التفاعلات الكيميائية والمحاليل، الوحدة 3: الحوامض والقواعد والأملاح) • 6 فصول شاملة، 21 درساً تفاعلياً، 48 بطاقة تمارين و 203 سؤالاً محلولاً، ربط كافة صفحات المحتوى (5–96)، 16 لوحة توضيحية علمية متجهة، وبنك المفاهيم والقواعد الكيميائية.
            </p>
          </div>

          <div style="display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap; background: rgba(255,255,255,0.7); padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #a7f3d0;">
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #065f46; font-weight: 800;">
              <span>📚 3 وحدات و 6 فصول</span>
            </div>
            <div style="width: 1px; height: 16px; background: #a7f3d0;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #065f46; font-weight: 800;">
              <span>📖 21 درساً تفاعلياً</span>
            </div>
            <div style="width: 1px; height: 16px; background: #a7f3d0;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #065f46; font-weight: 800;">
              <span>🎯 48 بطاقة (203 سؤالاً)</span>
            </div>
            <div style="width: 1px; height: 16px; background: #a7f3d0;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #065f46; font-weight: 800;">
              <span>🎨 16 رسماً متجهياً</span>
            </div>
            <div style="width: 1px; height: 16px; background: #a7f3d0;"></div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #065f46; font-weight: 800;">
              <span>🖼️ 96 صفحة أصلية</span>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem 1.75rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 75px; height: 105px; border-radius: 8px; overflow: hidden; flex-shrink: 0; box-shadow: -3px 4px 10px rgba(5,150,105,0.2); background: #064e3b; cursor: default; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <span style="font-size: 2.2rem;">🧪</span>
            <span style="font-size: 0.65rem; font-weight: 800; margin-top: 0.2rem;">الكيمياء</span>
          </div>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; color: #064e3b; margin-bottom: 0.25rem;">كتاب الطالب الرسمي المعتمد (الوحدات 1، 2، 3)</div>
            <div style="font-size: 0.82rem; color: var(--slate-500); font-weight: 700;">3 وحدات كبرى • 6 فصول • 21 درساً تفاعلياً • 48 بطاقة (203 سؤالاً) • 16 رسماً متجهياً</div>
            <div style="font-size: 0.76rem; color: #059669; font-weight: 800; margin-top: 0.2rem;">إعداد وتطوير: إعداد المهندس أسامة خليل هاشم</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openSubjectTab(${chemCardCurr.id})" style="font-weight: 800; background: linear-gradient(135deg, #059669, #047857); border: none; padding: 0.65rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.3);">
            📖 دخول قاعة المذاكرة والدروس ⮞
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${chemCardCurr.id}); switchTab('grammar'); setGrammarSubjectMode('chem');" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            💡 بنك المفاهيم والقواعد (24)
          </button>
          <button class="btn btn-secondary" onclick="openChemistryReviewsModal()" style="background: #d1fae5; color: #064e3b; border-color: #a7f3d0; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎯 مراجعات الدروس والفصول (203 سؤالاً)
          </button>
          <button class="btn btn-secondary" onclick="openAllChemistryDiagramsGallery()" style="background: #ffffff; color: #059669; border-color: #a7f3d0; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            🎨 الرسوم التوضيحية (16 لوحة)
          </button>
          <button class="btn btn-secondary" onclick="selectCurriculumForStudy(${chemCardCurr.id}); switchTab('exams'); setExamSubjectMode('chem');" style="background: #ffffff; color: var(--slate-700); border-color: var(--slate-300); font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
            📝 الامتحانات الوزارية والشهرية
          </button>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
  }

  // 8. بطاقة منهج علم الأحياء
  if (showBiology) {
    const bioCurr = currs.find(c => c.id === 11);
    if (bioCurr) {
      const div = document.createElement('div');
      div.className = 'card curr-card';
      div.style.cssText = 'padding: 0; overflow: hidden; border-radius: 18px; border: 1px solid var(--slate-200); box-shadow: var(--shadow); transition: transform 0.25s ease, box-shadow 0.25s ease; grid-column: 1 / -1; margin-bottom: 1.5rem;';
      div.innerHTML = `
        <div style="display: flex; gap: 1.5rem; padding: 1.5rem; align-items: stretch; background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%); flex-wrap: wrap;">
          <div style="width: 125px; height: 180px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -8px 10px 22px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06); background: #14532d; cursor: default;">
            <img src="./book_images/biology/page_1.jpeg" alt="${bioCurr.name}" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          </div>
          <div style="flex: 1 1 380px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span class="curr-badge" style="background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 6px;">علم الأحياء - الثاني متوسط</span>
                <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">✅ المنهج الوزاري المعتمد • 7 فصول • 21 درساً تفاعلياً</span>
                <span style="background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">🔬 17 لوحة توضيحية حيوية</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 900; color: #14532d; margin-bottom: 0.4rem;">علم الأحياء - الصف الثاني المتوسط</h3>
              <p style="color: var(--slate-600); font-size: 0.86rem; line-height: 1.6; margin-bottom: 0.75rem;">
                المنهج الدراسي الرسمي الكامل الصادر عن وزارة التربية العراقية (3 وحدات كبرى، 7 فصول، 21 درساً تفاعلياً، 92 صفحة أصلية مربوطة بالكامل): علم التصنيف وممالك الكائنات الحية الخمس، الكائنات الحية البسيطة (الطليعيات والفطريات والأشنات)، مملكة النباتات (الحزازيات والسرخسيات والبذرية)، مملكة الحيوانات (اللافقريات والفقريات)، والبيئة ومكوناتها ودورات العناصر في الطبيعة ومشكلات التوازن البيئي مع الرسوم التوضيحية المتجهية التفاعلية وبنك المفاهيم والتمارين التفاعلية والحلول النموذجية الشاملة لكافة مراجعات الدروس والفصول.
              </p>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="openSubjectTab(11)" style="font-weight: 800; padding: 0.65rem 1.25rem; font-size: 0.88rem; background: #15803d; border-color: #14532d;">
                🚀 فتح ودراسة علم الأحياء
              </button>
              <button class="btn btn-secondary" onclick="openAllBiologyDiagramsGallery()" style="background: #dcfce7; color: #14532d; border-color: #86efac; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
                🔬 أطلس الرسوم الحيوية (17 لوحة)
              </button>
              <button class="btn btn-secondary" onclick="openBiologyReviewsModal()" style="background: #dcfce7; color: #14532d; border-color: #86efac; font-weight: 800; padding: 0.65rem 1.1rem; font-size: 0.85rem;">
                🎯 مراجعات الدروس والفصول (260 سؤالاً)
              </button>
              <button class="btn btn-secondary" onclick="openBookPageModal(1, 'غلاف كتاب علم الأحياء', 'student', 11)" style="font-weight: 800; padding: 0.65rem 1rem; font-size: 0.85rem;">
                📖 تصفح الكتاب الأصلي (92 ص)
              </button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    }
  }

  // المقررات القادمة ضمن خطة التوسع الأكاديمي
  if (currentCurriculumViewTab === 'all') {
  const upcoming = [
    { title: 'العلوم العامة', icon: '🔬', grade: 'الصف الثاني متوسط', status: 'المقرر القادم • قيد الإعداد والبرمجة' }
  ];

  const upcomingHeader = document.createElement('div');
  upcomingHeader.style.cssText = 'grid-column: 1 / -1; margin-top: 1rem; margin-bottom: 0.75rem;';
  upcomingHeader.innerHTML = `
    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--slate-800); display: flex; align-items: center; gap: 0.5rem;">
      <span>🌐</span> المقررات القادمة ضمن خطة التوسع المعتمدة
    </h3>
  `;
  container.appendChild(upcomingHeader);

  upcoming.forEach(up => {
    const uDiv = document.createElement('div');
    uDiv.className = 'card';
    uDiv.style.cssText = 'padding: 1.1rem; border-radius: 14px; border: 1px solid var(--slate-200); opacity: 0.9; background: #ffffff;';
    uDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-size: 1.5rem;">${up.icon}</span>
        <span style="background: #fef3c7; color: #92400e; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 6px;">${up.status}</span>
      </div>
      <div style="font-weight: 900; font-size: 1.05rem; color: var(--slate-900); margin-bottom: 0.2rem;">${up.title}</div>
      <div style="font-size: 0.78rem; color: var(--slate-500);">${up.grade}</div>
    `;
    container.appendChild(uDiv);
  });
  }
}

function selectCurriculumInDashboard(currId) {
  const idNum = Number(currId);
  appData.currentCurriculumId = idNum;
  currentActiveGrammarFilter = 'all';
  const searchInput = document.getElementById('grammarSearchInput');
  if (searchInput) searchInput.value = '';
  saveData();
  renderDashboardCurriculaQuickBar();
  renderActiveSubjectShowcase();
  const activeCurrObj = (appData.curriculums || []).find(c => c.id === idNum) || { id: idNum };
  updateGlobalSubjectContextBars(activeCurrObj);
  const grammarTab = document.getElementById('tab-grammar');
  if (grammarTab && !grammarTab.classList.contains('hidden') && typeof renderGrammarRules === 'function') {
    renderGrammarRules();
  }
  const examsTab = document.getElementById('tab-exams');
  if (examsTab && !examsTab.classList.contains('hidden') && typeof renderExamsCenter === 'function') {
    renderExamsCenter();
  }
}

function renderActiveSubjectShowcase() {
  const container = document.getElementById('activeSubjectShowcase');
  if (!container) return;

  const currs = (appData.curriculums || []).filter(c => 
    c && c.id !== 1 && 
    !(c.name && (c.name.includes('دليل وثيقة') || c.name.includes('وثيقة النظام'))) && 
    !(c.subject && (c.subject.includes('هندسة النظم') || c.subject.includes('وثيقة')))
  );
  const curr = currs.find(c => c.id === appData.currentCurriculumId) || currs[0];
  if (!curr) {
    container.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 1.5rem;">لا يوجد منهج محدد حالياً.</div>';
    return;
  }

  const isSocial = curr.id === 9 || (curr.subject && curr.subject.includes('اجتماع'));
  const isMath = curr.id === 8 || (curr.subject && curr.subject.includes('رياضيات'));
  const isArP1 = curr.id === 4 || (curr.name && curr.name.includes('الجزء الأول'));
  const isArP2 = curr.id === 5 || (curr.name && curr.name.includes('الجزء الثاني'));
  const isArabic = isArP1 || isArP2;
  const isIslamic = curr.id === 6 || (curr.subject && curr.subject.includes('إسلام'));
  const isPhysics = curr.id === 7 || (curr.subject && curr.subject.includes('فيزياء'));
  const isChemistry = curr.id === 10 || (curr.subject && curr.subject.includes('كيمياء'));
  const isBiology = curr.id === 11 || (curr.subject && curr.subject.includes('أحياء'));

  if (isBiology) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #86efac; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(22, 163, 74, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(22,163,74,0.25); background: #14532d; position: relative;">
            <img src="./book_images/biology/page_1.jpeg" alt="غلاف كتاب علم الأحياء" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(20,83,45,0.95), transparent); padding: 0.35rem; text-align: center;">
              <span style="color: white; font-size: 0.65rem; font-weight: 800;">92 صفحة أصلية</span>
            </div>
          </div>

          <div style="flex: 1 1 360px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #16a34a; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px;">المنهج الوزاري المعتمد • مكتمل 100%</span>
                <span style="background: #fff; color: #166534; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #86efac;">وزارة التربية العراقية</span>
                <span style="background: #fff; color: #15803d; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #4ade80;">3 وحدات • 7 فصول • 21 درساً تفاعلياً</span>
                <span style="background: #dcfce7; color: #14532d; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #86efac;">🎨 17 لوحة توضيحية تفاعلية</span>
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #14532d; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🧬</span>
                <span>علم الأحياء - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.84rem; color: #166534; margin: 0 0 0.75rem; line-height: 1.6; font-weight: 600;">
                المنهج الوزاري الرسمي المعتمد شاملاً علم التصنيف وممالك الكائنات الحية الخمس، الكائنات البسيطة (الطليعيات والفطريات)، المملكة النباتية (الحزازيات والسرخسيات والبذرية)، المملكة الحيوانية (اللافقريات والفقريات)، والنظام البيئي وتوازنه ودورات العناصر مع 17 لوحة توضيحية علمية متجهة وعارض 92 صفحة أصلية وبنك المفاهيم البيولوجية والتمارين التفاعلية والامتحانات والحلول النموذجية الشاملة لكافة مراجعات الدروس والفصول.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" onclick="openSubjectTab(11)" style="background: linear-gradient(135deg, #16a34a, #15803d); border: none; font-weight: 800; padding: 0.45rem 1rem;">
                📖 الانتقال لقاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(11, 4, 'student')" style="background: #ffffff; color: #14532d; border: 1px solid #86efac; font-weight: 800;">
                📖 تصفح كتاب الأحياء (92 صفحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openAllBiologyDiagramsGallery()" style="background: #dcfce7; color: #14532d; border: 1px solid #86efac; font-weight: 800;">
                🎨 معرض الرسوم التوضيحية (17 لوحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openBiologyReviewsModal()" style="background: #ffffff; color: #166534; border: 1px solid #86efac; font-weight: 800;">
                🎯 مراجعات الدروس والفصول (260 سؤالاً)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="switchTab('grammar'); setGrammarSubjectMode('bio');" style="background: #ffffff; color: #15803d; border: 1px solid #86efac; font-weight: 800;">
                💡 بنك المفاهيم والقواعد (28)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isChemistry) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(5, 150, 105, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(5,150,105,0.25); background: #064e3b; position: relative;">
            <img src="./book_images/chemistry/page_1.jpeg" alt="غلاف كتاب الكيمياء" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,78,59,0.95), transparent); padding: 0.35rem; text-align: center;">
              <span style="color: white; font-size: 0.65rem; font-weight: 800;">96 صفحة أصلية</span>
            </div>
          </div>

          <div style="flex: 1 1 360px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #059669; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px;">المنهج الوزاري المعتمد • مكتمل 100%</span>
                <span style="background: #fff; color: #065f46; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #a7f3d0;">وزارة التربية العراقية</span>
                <span style="background: #fff; color: #047857; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #6ee7b7;">3 وحدات • 6 فصول • 21 درساً تفاعلياً</span>
                <span style="background: #d1fae5; color: #064e3b; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 4px; border: 1px solid #a7f3d0;">🎨 16 لوحة توضيحية تفاعلية</span>
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #064e3b; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🧪</span>
                <span>الكيمياء - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.84rem; color: #065f46; margin: 0 0 0.75rem; line-height: 1.6; font-weight: 600;">
                المنهج الوزاري الرسمي المعتمد شاملاً العناصر والترابط، المركبات وقوى الجذب، الصيغ والمعادلات والتفاعلات، المحاليل والذوبان، الحوامض والقواعد، والأملاح والدلائل ومقياس pH مع 48 بطاقة تمارين و 203 سؤالاً محلولاً وربط كافة صفحات المحتوى (5–96) و 16 لوحة توضيحية علمية متجهة.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" onclick="openSubjectTab(10)" style="background: linear-gradient(135deg, #059669, #047857); border: none; font-weight: 800; padding: 0.45rem 1rem;">
                📖 الانتقال لقاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(10, 4, 'student')" style="background: #ffffff; color: #064e3b; border: 1px solid #a7f3d0; font-weight: 800;">
                📖 تصفح كتاب الكيمياء (96 صفحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openAllChemistryDiagramsGallery()" style="background: #d1fae5; color: #064e3b; border: 1px solid #a7f3d0; font-weight: 800;">
                🎨 معرض الرسوم التوضيحية (16 لوحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openChemistryReviewsModal()" style="background: #ffffff; color: #065f46; border: 1px solid #a7f3d0; font-weight: 800;">
                🎯 مراجعات الدروس والفصول (203 سؤالاً)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="switchTab('grammar'); setGrammarSubjectMode('chem');" style="background: #ffffff; color: #047857; border: 1px solid #a7f3d0; font-weight: 800;">
                💡 بنك المفاهيم والقواعد (24)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isSocial) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(180, 83, 9, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(180,83,9,0.25); background: #78350f; cursor: default; position: relative;">
            <img src="./book_images/social/page_1.jpeg" alt="غلاف كتاب الاجتماعيات" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 250px;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #b45309; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
                <span style="background: #ffffff; color: #92400e; border: 1px solid #fde68a; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">📖 140 صفحة أصلية</span>
                <span style="background: #ffffff; color: #b45309; border: 1px solid #fde68a; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">💡 13 مفهوماً ومصطلحاً أساسياً</span>
              </div>
              <h3 style="font-size: 1.4rem; font-weight: 900; color: #78350f; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🌍</span>
                <span>كتاب الاجتماعيات - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.85rem; color: #92400e; line-height: 1.6; margin: 0 0 0.75rem;">
                المنهج الرسمي المعتمد لوزارة التربية العراقية: جغرافية العالم العربي الطبيعية والبشرية والاقتصادية، وأحوال شبه الجزيرة العربية قبل الإسلام، وتاريخ مكة المكرمة، والسيرة النبوية الشريفة بمكة والمدينة المنورة (6 فصول شاملة، 39 درساً تفاعلياً، 71 بطاقة تمارين و 164 سؤالاً محلولاً، ربط كافة صفحات المحتوى 4–139، وبنك المصطلحات والامتحانات الوزارية).
              </p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="openSubjectTab(9)" style="font-weight: 800; background: linear-gradient(135deg, #b45309, #92400e); border: none; padding: 0.55rem 1.15rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3);">
                📖 دخول قاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(9); switchTab('grammar'); setGrammarSubjectMode('social');" style="background: #fffbeb; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 1rem;">
                💡 بنك المفاهيم والمصطلحات
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openSocialReviewsModal()" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 1rem;">
                🎯 مراجعات الدروس والفصول (164 سؤالاً)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(9, 1)" style="background: #ffffff; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 1rem;">
                📖 تصفح الكتاب الأصلي (140 صفحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(9); switchTab('exams'); setExamSubjectMode('soc');" style="background: #ffffff; color: #b45309; border-color: #fde68a; font-weight: 800; padding: 0.55rem 1rem;">
                📝 الامتحانات الوزارية والشهرية
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isMath) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border: 1.5px solid #d8b4fe; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(126, 34, 206, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(126,34,206,0.25); background: #581c87; cursor: default; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <span style="font-size: 3rem;">📐</span>
            <span style="font-size: 0.75rem; font-weight: 800; margin-top: 0.5rem; text-align: center; padding: 0 0.25rem;">كتاب الرياضيات</span>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 250px;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #7e22ce; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
                <span style="background: #ffffff; color: #6b21a8; border: 1px solid #d8b4fe; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">📖 7 فصول • 51 درساً (635 سؤالاً)</span>
                <span style="background: #ffffff; color: #581c87; border: 1px solid #d8b4fe; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">📐 17 لوحة هندسية SVG</span>
                <span style="background: #ffffff; color: #b45309; border: 1px solid #fde68a; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">💡 22 قانوناً ونظرية ومفهوماً</span>
              </div>
              <h3 style="font-size: 1.4rem; font-weight: 900; color: #581c87; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📐</span>
                <span>كتاب الرياضيات - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.85rem; color: #6b21a8; line-height: 1.6; margin: 0 0 0.75rem;">
                المنهج الرسمي المعتمد لوزارة التربية العراقية (الجزء الأول والجزء الثاني): الأعداد النسبية، الأعداد الحقيقية، الحدوديات، المعادلات والمتباينات، الهندسة والقياس، الهندسة الإحداثية، والإحصاء والاحتمالات (7 فصول شاملة، 51 درساً تفاعلياً، 17 لوحة هندسية وبيانية SVG، وبنك النظريات والامتحانات المحلولة).
              </p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="openSubjectTab(8)" style="font-weight: 800; background: linear-gradient(135deg, #7e22ce, #6b21a8); border: none; padding: 0.55rem 1.15rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(126, 34, 206, 0.3);">
                📖 دخول قاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openAllMathDiagramsGallery()" style="background: #ffffff; color: #7e22ce; border-color: #d8b4fe; font-weight: 800; padding: 0.55rem 1rem;">
                🎨 معرض الرسوم الهندسية (17 لوحة)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(8); switchTab('grammar'); setGrammarSubjectMode('math');" style="background: #faf5ff; color: #6b21a8; border-color: #d8b4fe; font-weight: 800; padding: 0.55rem 1rem;">
                💡 بنك القوانين والنظريات
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openMathReviewsModal()" style="background: #f3e8ff; color: #7e22ce; border-color: #e9d5ff; font-weight: 800; padding: 0.55rem 1rem;">
                🎯 مراجعات الفصول والحلول النموذجية (7 فصول)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(8); switchTab('exams'); setExamSubjectMode('math');" style="background: #ffffff; color: #7e22ce; border-color: #d8b4fe; font-weight: 800; padding: 0.55rem 1rem;">
                📝 الامتحانات الوزارية والشهرية
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isPhysics) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #7dd3fc; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(2, 132, 199, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(2,132,199,0.25); background: #0c4a6e; cursor: default; position: relative;">
            <img src="./book_images/physics/page_1.jpeg" alt="غلاف كتاب الفيزياء" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 250px;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #0284c7; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
                <span style="background: #ffffff; color: #0369a1; border: 1px solid #7dd3fc; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">📖 88 صفحة أصلية</span>
                <span style="background: #ffffff; color: #b45309; border: 1px solid #fde68a; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">💡 18 قانوناً ومفهوماً فيزيائياً</span>
              </div>
              <h3 style="font-size: 1.4rem; font-weight: 900; color: #075985; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚛️</span>
                <span>كتاب الفيزياء - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.85rem; color: #0369a1; line-height: 1.6; margin: 0 0 0.75rem;">
                المنهج الرسمي المعتمد لوزارة التربية: الحركة والقوة، قوانين نيوتن والجاذبية، الشغل والقدرة والطاقة، الآلات البسيطة والعتلات، الحركة الموجية وخصائص الصوت والصدى، والضوء والمرايا والعدسات (6 فصول شاملة، 20 درساً تفاعلياً، 60 بطاقة و 259 سؤالاً محلولاً، وبنك القوانين الفيزيائية).
              </p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="openSubjectTab(7)" style="font-weight: 800; background: linear-gradient(135deg, #0284c7, #0369a1); border: none; padding: 0.55rem 1.15rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
                📖 دخول قاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(7); switchTab('grammar'); setGrammarSubjectMode('phy');" style="background: #f0f9ff; color: #0369a1; border-color: #7dd3fc; font-weight: 800; padding: 0.55rem 1rem;">
                💡 بنك القوانين والمفاهيم
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openPhysicsReviewsModal()" style="background: #e0f2fe; color: #0284c7; border-color: #bae6fd; font-weight: 800; padding: 0.55rem 1rem;">
                🎯 مراجعات الدروس والفصول (259 سؤالاً)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(7, 1)" style="background: #ffffff; color: #0369a1; border-color: #7dd3fc; font-weight: 800; padding: 0.55rem 1rem;">
                📖 تصفح الكتاب الأصلي (88 صفحة)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isIslamic) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%); border: 1.5px solid #99f6e4; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px -4px rgba(13, 148, 136, 0.15);">
        <div style="display: flex; gap: 1.25rem; align-items: stretch; flex-wrap: wrap;">
          <div style="width: 110px; height: 160px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -4px 6px 14px rgba(13,148,136,0.25); background: #134e4a; cursor: default; position: relative;">
            <img src="./book_images/islamic/page_1.jpeg" alt="غلاف كتاب التربية الإسلامية" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
            
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 250px;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span style="background: #0d9488; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 6px;">مقرر وزاري معتمد • مكتمل 100%</span>
                <span style="background: #ffffff; color: #0f766e; border: 1px solid #99f6e4; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">📖 120 صفحة أصلية</span>
                <span style="background: #ffffff; color: #b45309; border: 1px solid #fde68a; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px;">💡 15 حكماً وقاعدة فقهية وعقدية</span>
              </div>
              <h3 style="font-size: 1.4rem; font-weight: 900; color: #115e59; margin: 0 0 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🕌</span>
                <span>كتاب التربية الإسلامية والقرآن الكريم - الصف الثاني المتوسط</span>
              </h3>
              <p style="font-size: 0.85rem; color: #134e4a; line-height: 1.6; margin: 0 0 0.75rem;">
                المنهج الرسمي المعتمد لوزارة التربية: أحكام التلاوة والمد العارض، السور الكريمة (النبأ، القيامة، المزمل، الجمعة، الصف)، الأحاديث الشريفة، العقيدة والمعجزات، فقه الصلاة والعبادات والصوم والسجود، السيرة النبوية والتراجم، ومكارم الأخلاق والتهذيب.
              </p>
            </div>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="openSubjectTab(6)" style="font-weight: 800; background: linear-gradient(135deg, #0d9488, #0f766e); border: none; padding: 0.55rem 1.15rem; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);">
                📖 دخول قاعة المذاكرة والدروس ⮞
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openIslamicReviewsModal()" style="background: #f0fdfa; color: #0f766e; border-color: #99f6e4; font-weight: 800; padding: 0.55rem 1rem;">
                🎯 المناقشات والحلول النموذجية (6 وحدات)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(6); switchTab('grammar'); setGrammarSubjectMode('is');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 1rem;">
                💡 بنك الأحكام والقواعد
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(6, 4)" style="background: #ffffff; color: #0f766e; border-color: #99f6e4; font-weight: 800; padding: 0.55rem 1rem;">
                📖 تصفح الكتاب الأصلي (120 صفحة)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (isArabic) {
    const activePartNum = isArP2 ? 2 : 1;
    const partCover = activePartNum === 1 ? './book_images/arabic_p1/page_1.jpeg' : './book_images/arabic_p2/page_1.jpeg';
    const partColor = activePartNum === 1 ? '#059669' : '#047857';
    const partTitle = activePartNum === 1 ? 'كتاب اللغة العربية (الجزء الأول)' : 'كتاب اللغة العربية (الجزء الثاني)';
    const partDesc = activePartNum === 1
      ? 'المطالعة والنصوص القرآنية والأدبية، علامات الإعراب الأصلية والفرعية، الأسماء الخمسة، الميزان الصرفي، اللازم والمتعدي، نائب الفاعل، المفعول فيه، المفعول المطلق، الحال، والاستثناء بـ إلا.'
      : 'نصوص الفداء، سورة الرحمن، نساء في القمة، الربيع، إرادة الحياة، النداء، الاستفهام، بناء المضارع، المثنى، جمع المذكر والمؤنث والتكسير، المقصور والمنقوص والممدود، والممنوع من الصرف.';

    container.innerHTML = `
      <!-- شريط التفريع المشترك لمادة اللغة العربية -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #a7f3d0; border-radius: 14px; padding: 0.65rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.4rem;">📚</span>
          <div>
            <strong style="color: #064e3b; font-size: 1rem; display: block;">مادة اللغة العربية - الصف الثاني المتوسط</strong>
            <span style="color: #047857; font-size: 0.75rem; font-weight: 700;">وزارة التربية العراقية • مقرران كاملان (272 صفحة)</span>
          </div>
        </div>
        
        <!-- مفتاحا التفريع: الجزء الأول والجزء الثاني -->
        <div style="display: flex; gap: 0.5rem; align-items: center; background: #ffffff; padding: 0.25rem 0.35rem; border-radius: 10px; border: 1px solid #d1fae5;">
          <button class="branch-pill-btn ${activePartNum === 1 ? 'active-branch' : ''}" onclick="selectCurriculumInDashboard(4)" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
            <span>📙</span> <strong>الجزء الأول</strong> ${activePartNum === 1 ? '✓ النشط' : ''}
          </button>
          <button class="branch-pill-btn ${activePartNum === 2 ? 'active-branch' : ''}" onclick="selectCurriculumInDashboard(5)" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
            <span>📗</span> <strong>الجزء الثاني</strong> ${activePartNum === 2 ? '✓ النشط' : ''}
          </button>
        </div>
      </div>

      <div style="display: flex; gap: 1.5rem; align-items: stretch; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <!-- صورة غلاف الجزء النشط -->
        <div style="width: 145px; height: 205px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -8px 12px 24px rgba(5,150,105,0.25), 0 0 0 1px rgba(0,0,0,0.08); background: #064e3b; cursor: default; position: relative;">
          <img src="${partCover}" alt="${partTitle}" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(6, 78, 59, 0.92)); padding: 0.4rem 0.3rem; color: white; font-size: 0.68rem; font-weight: 800; text-align: center; pointer-events: none;">
            ${activePartNum === 1 ? '📙 كتاب الجزء الأول' : '📗 كتاب الجزء الثاني'}
          </div>
        </div>

        <!-- تفاصيل المقرر النشط -->
        <div style="flex: 1 1 450px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <span class="subject-card-badge green" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;">
                <span>🌟</span> المنهج الوزاري المعتمد • مكتمل 100%
              </span>
              <span style="font-size: 0.78rem; font-weight: 800; color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.2rem 0.65rem; border-radius: 9999px;">
                الصف الثاني متوسط • ${activePartNum === 1 ? 'الجزء الأول (الكورس 1)' : 'الجزء الثاني (الكورس 2)'}
              </span>
            </div>
            <h3 style="font-size: 1.45rem; font-weight: 900; color: var(--slate-900); display: flex; align-items: center; gap: 0.65rem; margin: 0 0 0.4rem;">
              <span style="font-size: 1.8rem;">${activePartNum === 1 ? '📙' : '📗'}</span>
              <span>${partTitle}</span>
            </h3>
            <p style="font-size: 0.88rem; color: var(--slate-600); line-height: 1.65; max-width: 850px; margin: 0 0 1rem;">
              ${partDesc} مع القراءة الصوتية الفصيحة وبنك القواعد النحوية الشامل وعارض الصفحات الأصلية بدقة عالية 130 DPI.
            </p>
          </div>

          <!-- أزرار الإجراءات السريعة للمقرر -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <button class="btn btn-primary" onclick="openSubjectTab(${curr.id})" style="background: linear-gradient(135deg, ${partColor}, #10b981); border: none; font-weight: 800; padding: 0.65rem 1.3rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);">
              📖 دخول قاعة المذاكرة والدروس ⮞
            </button>
            ${activePartNum === 1 ? `
              <button class="btn btn-secondary btn-sm" onclick="openArabicP1ReviewsModal()" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.95rem;">
                🎯 مراجعات وتمارين الوحدات والحلول النموذجية (9 وحدات)
              </button>
            ` : `
              <button class="btn btn-secondary btn-sm" onclick="openArabicP2ReviewsModal()" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.95rem;">
                🎯 مراجعات وتمارين الوحدات والحلول النموذجية (9 وحدات)
              </button>
            `}
            <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(${curr.id}, 1)" style="background: #ffffff; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.95rem;">
              📖 تصفح الكتاب الأصلي (136 صفحة)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="selectCurriculumForStudy(${curr.id}); switchTab('grammar');" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 0.95rem;">
              💡 بنك القواعد النحوية والصرفية
            </button>
            <button class="btn btn-secondary btn-sm" onclick="switchTab('curriculums')" style="background: #f8fafc; color: var(--slate-700); border-color: var(--slate-300); font-weight: 800; padding: 0.55rem 0.95rem;">
              📚 استعراض بوابة المناهج
            </button>
          </div>
        </div>
      </div>

      <!-- شبكة الإحصائيات والأرقام -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">الوحدات المقررة</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #064e3b;">10 وحدات دراسية</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">الدروس والنصوص</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #064e3b;">40 درساً شاملاً</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">صفحات الكتاب الأصلي</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #064e3b;">136 صفحة أصلية</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">حالة المنهج</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #166534;">✅ جاهز للمذاكرة</div>
        </div>
      </div>
    `;
  } else {
    // اللغة الإنجليزية
    const chaps = curr.chapters || [];
    let totalLessons = 0;
    chaps.forEach(ch => { totalLessons += (ch.lessons || []).length; });

    container.innerHTML = `
      <div style="display: flex; gap: 1.5rem; align-items: stretch; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <div style="width: 145px; height: 205px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: -8px 12px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08); background: #1e1b4b; cursor: default; position: relative;">
          <img src="./book_images/page_1.jpeg" alt="${escapeHtml(curr.name)}" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;" onerror="this.style.display='none';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(30, 27, 75, 0.9); color: white; font-size: 0.65rem; font-weight: 800; text-align: center; padding: 0.25rem 0.2rem; pointer-events: none;">📘 English for Iraq</div>
        </div>

        <div style="flex: 1 1 450px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <span class="subject-card-badge green" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;">
                <span>🌟</span> المنهج الوزاري المعتمد • مكتمل 100%
              </span>
              <span style="font-size: 0.78rem; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 0.2rem 0.65rem; border-radius: 9999px;">
                الصف: ${escapeHtml(curr.grade || 'الثاني متوسط')} • English for Iraq
              </span>
            </div>
            <h3 style="font-size: 1.45rem; font-weight: 900; color: var(--slate-900); display: flex; align-items: center; gap: 0.65rem; margin: 0 0 0.4rem;">
              <span style="font-size: 1.8rem;">📘</span>
              <span>${escapeHtml(curr.name)}</span>
            </h3>
            <p style="font-size: 0.88rem; color: var(--slate-600); line-height: 1.65; max-width: 850px; margin: 0 0 1rem;">
              منهاج تفاعلي متكامل لكتاب الطالب والنشاط بالصوت البشري الفصيح، تتبع الكلمات اللحظي، بنك القواعد النحوية الشامل (43 قاعدة ومفهوماً)، ونماذج الامتحانات الوزارية والشهرية السابقة وحلولها النموذجية.
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <button class="btn btn-primary" onclick="openSubjectTab(${curr.id})" style="background: linear-gradient(135deg, #4338ca, #6366f1); border: none; font-weight: 800; padding: 0.65rem 1.3rem; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(67, 56, 202, 0.35);">
              📖 دخول قاعة المذاكرة والدروس ⮞
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(3, 4, 'student')" style="background: #ffffff; color: #4338ca; border-color: #c7d2fe; font-weight: 800; padding: 0.55rem 0.95rem;">
              📖 تصفح كتاب الطالب (119 صفحة)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openDigitalLibraryReader(3, 4, 'activity')" style="background: #f0fdfa; color: #0f766e; border-color: #99f6e4; font-weight: 800; padding: 0.55rem 0.95rem;">
              📝 تصفح كراس النشاط (127 صفحة)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openPastExamsTab('final_comprehensive')" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; font-weight: 800; padding: 0.55rem 0.95rem;">
              📝 الامتحان النهائي 100 درجة
            </button>
            <button class="btn btn-secondary btn-sm" onclick="switchTab('grammar')" style="background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 800; padding: 0.55rem 0.95rem;">
              💡 بنك القواعد النحوية
            </button>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">الوحدات المكتملة</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">8 وحدات (100%)</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">الدروس التفاعلية</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">76 درساً شاملاً</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">القواعد والمفاهيم</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #d97706;">43 قاعدة ومفهوماً</div>
        </div>
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.65rem 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700; margin-bottom: 0.2rem;">الامتحانات الوزارية</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #166534;">امتحان 100 درجة محلول</div>
        </div>
      </div>
    `;
  }      updateGlobalSubjectContextBars(curr);
}

function updateGlobalSubjectContextBars(curr) {
  if (!curr) return;
  const sLower = (curr.subject || '').toLowerCase() + ' ' + (curr.name || '').toLowerCase();
  let icon = '📘';
    if (sLower.includes('eng') || sLower.includes('انجل')) icon = '📘';
    else if (sLower.includes('arab') || sLower.includes('عرب')) icon = '📙';
  else if (sLower.includes('scien') || sLower.includes('علوم')) icon = '🔬';
  else if (sLower.includes('math') || sLower.includes('رياض')) icon = '📐';
  else if (sLower.includes('comp') || sLower.includes('حاسوب')) icon = '💻';
  else if (sLower.includes('islam') || sLower.includes('إسلام')) icon = '🕌';
  else if (sLower.includes('physic') || sLower.includes('فيزياء')) icon = '⚛️';
  else if (sLower.includes('social') || sLower.includes('اجتماع')) icon = '🌍';
  else if (sLower.includes('chem') || sLower.includes('كيمياء')) icon = '🧪';
  else if (sLower.includes('bio') || sLower.includes('أحياء') || sLower.includes('احياء')) icon = '🧬';

  const titleText = `${curr.name} (${curr.grade || 'مرحلة دراسية'})`;

  // قاعة المذاكرة
  const studyTitle = document.getElementById('studyActiveSubjectTitle');
  const studyIcon = document.getElementById('studyActiveSubjectIcon');
  const arabicQuickBar = document.getElementById('studyArabicQuickBranches');
  const btnP1 = document.getElementById('btnStudyBranchP1');
  const btnP2 = document.getElementById('btnStudyBranchP2');

  const isArCurr = curr.id === 4 || curr.id === 5;
  if (isArCurr) {
    if (studyTitle) studyTitle.innerHTML = 'مادة اللغة العربية - ' + (curr.id === 4 ? '<span style="color:#059669; font-weight:900;">كتاب الجزء الأول</span>' : '<span style="color:#047857; font-weight:900;">كتاب الجزء الثاني</span>') + ' <span style="font-size:0.75rem; color:var(--slate-500); font-weight:700;">(136 صفحة)</span>';
    if (studyIcon) studyIcon.innerText = '📚';
    if (arabicQuickBar) {
      arabicQuickBar.style.display = 'flex';
      if (btnP1) btnP1.className = 'branch-pill-btn ' + (curr.id === 4 ? 'active-branch' : '');
      if (btnP2) btnP2.className = 'branch-pill-btn ' + (curr.id === 5 ? 'active-branch' : '');
    }
  } else {
    if (studyTitle) studyTitle.innerText = titleText;
    if (studyIcon) studyIcon.innerText = icon;
    if (arabicQuickBar) arabicQuickBar.style.display = 'none';
  }

  // القواعد
  const grammarTitle = document.getElementById('grammarActiveSubjectTitle');
  const grammarIcon = document.getElementById('grammarActiveSubjectIcon');
  if (grammarTitle) grammarTitle.innerText = titleText;
  if (grammarIcon) grammarIcon.innerText = icon;

  const voiceStudioBtn = document.getElementById('grammarVoiceStudioBtn');
  if (voiceStudioBtn) {
    voiceStudioBtn.style.display = (curr.id === 3) ? 'inline-flex' : 'none';
  }
  const audioBar = document.getElementById('audioPlayerBar');
  if (audioBar) {
    audioBar.style.display = (curr.id === 3) ? 'flex' : 'none';
  }

  // الامتحانات
  const examsTitle = document.getElementById('examsActiveSubjectTitle');
  const examsIcon = document.getElementById('examsActiveSubjectIcon');
  if (examsTitle) examsTitle.innerText = titleText;
  if (examsIcon) examsIcon.innerText = icon;

  const examsVoiceStudioBtn = document.getElementById('examsVoiceStudioBtn');
  if (examsVoiceStudioBtn) {
    examsVoiceStudioBtn.style.display = (curr.id === 3) ? 'inline-flex' : 'none';
  }
}
