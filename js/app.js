// =========================================================================
// نقطة التشغيل الرئيسية، إدارة الحالة، التنقل، التحديثات الحية، والنسخ الاحتياطي
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

// مزامنة شارات وأرقام الإصدار عبر شاشات ومخرجات النظام بالكامل
function syncSystemVersionBadges(verLabel = CURRENT_VERSION_LABEL) {
  const headerBadge = document.getElementById('headerVersionBadge');
  if (headerBadge) headerBadge.innerText = `${verLabel} ✨`;
  const settingsBadge = document.getElementById('settingsVersionBadge');
  if (settingsBadge) settingsBadge.innerText = verLabel;
  const settingsBadge2 = document.getElementById('settingsVersionBadge2');
  if (settingsBadge2) settingsBadge2.innerText = `الإصدار الحالي: ${verLabel}`;
  const footerBadge = document.getElementById('footerVersionBadge');
  if (footerBadge) footerBadge.innerText = verLabel;
  const modalTitle = document.getElementById('whatsNewModalTitle');
  if (modalTitle) modalTitle.innerText = `ما الجديد في الإصدار ${verLabel}؟`;
  const modalBadge = document.getElementById('whatsNewModalVersionBadge');
  if (modalBadge) modalBadge.innerText = verLabel;
}

// ربط فصول المنهج المحمّل كسولاً بكائن المنهج داخل appData.curriculums
function hydrateCurriculumChapters(currId) {
  const id = Number(currId);
  const idsToHydrate = (id === 4 || id === 5) ? [4, 5] : [id];
  idsToHydrate.forEach(targetId => {
    const meta = (BUILTIN_CURRICULA_META || []).find(m => m.id === targetId);
    if (!meta) return;
    const loadedChapters = window[meta.globalKey];
    if (!Array.isArray(loadedChapters) || loadedChapters.length === 0) return;
    const existing = (appData.curriculums || []).find(c => c && Number(c.id) === targetId);
    if (existing) {
      existing.chapters = loadedChapters;
    }
  });
}

// الدالة المساعدة لاسترجاع فصول المنهج النشط بذكاء ودقة
function getCurriculumChapters(currOrId) {
  const id = typeof currOrId === 'object' ? (currOrId ? currOrId.id : null) : currOrId;
  const curr = (typeof currOrId === 'object' && currOrId) ? currOrId : (appData.curriculums || []).find(c => c.id === id);
  if (curr && Array.isArray(curr.chapters) && curr.chapters.length > 0) return curr.chapters;
  if (id === 4) return window.ARABIC_CURRICULUM_P1 || [];
  if (id === 5) return window.ARABIC_CURRICULUM_P2 || [];
  if (id === 6) return window.ISLAMIC_CURRICULUM || [];
  if (id === 7) return window.PHYSICS_CURRICULUM || [];
  if (id === 8) return window.MATH_CURRICULUM || [];
  if (id === 9) return window.SOCIAL_CURRICULUM || [];
  if (id === 10) return window.CHEMISTRY_CURRICULUM || [];
  if (id === 11) return window.BIOLOGY_CURRICULUM || [];
  return window.CURRICULUM_DATA || [];
}

// بناء وضمان وجود المناهج التسعة المعتمدة باستخدام السجل التعريفي الخفيف (بدون إجبار تحميل البيانات مسبقاً)
function ensureDefaultEnglishCurriculum() {
  if (Array.isArray(appData.curriculums)) {
    appData.curriculums = appData.curriculums.filter(c => {
      if (!c) return false;
      if (c.id === 1) return false;
      const nameStr = (c.name || '').toString();
      const subjStr = (c.subject || '').toString();
      if (nameStr.includes('دليل وثيقة') || nameStr.includes('وثيقة النظام') || nameStr.includes('هندسة النظم')) return false;
      if (subjStr.includes('هندسة النظم') || subjStr.includes('وثيقة')) return false;
      return true;
    });
  } else {
    appData.curriculums = [];
  }

  (BUILTIN_CURRICULA_META || []).forEach(meta => {
    const loadedChapters = window[meta.globalKey] || [];
    const baseRecord = {
      id: meta.id,
      name: meta.name,
      subject: meta.subject,
      grade: meta.grade,
      status: meta.status,
      image_folder: meta.image_folder,
      description: meta.description,
      metaChaptersCount: meta.metaChaptersCount,
      metaLessonsCount: meta.metaLessonsCount,
      metaRulesCount: meta.metaRulesCount
    };

    const existingIdx = appData.curriculums.findIndex(c => c && Number(c.id) === meta.id);
    if (existingIdx >= 0) {
      const prevChapters = appData.curriculums[existingIdx].chapters || [];
      appData.curriculums[existingIdx] = {
        ...appData.curriculums[existingIdx],
        ...baseRecord,
        id: meta.id,
        chapters: loadedChapters.length > 0 ? loadedChapters : prevChapters
      };
    } else {
      appData.curriculums.push({
        ...baseRecord,
        chapters: loadedChapters
      });
    }
  });

  if (!appData.currentCurriculumId || !(appData.curriculums || []).some(c => Number(c.id) === Number(appData.currentCurriculumId))) {
    appData.currentCurriculumId = 3;
  }
  saveData();
}

function saveData() {
  try {
    const customCurriculums = (appData.curriculums || []).filter(c =>
      c && !BUILTIN_CURRICULUM_IDS.has(Number(c.id)) && Number(c.id) !== 1
    );
    const compactState = {
      currentCurriculumId: appData.currentCurriculumId || 3,
      currentLessonId: appData.currentLessonId || null,
      customCurriculums
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compactState));
  } catch (e) {
    console.error('Save error', e);
  }
}

// فحص الاتصال بالخادم
async function checkBackendConnection() {
  if (!IS_LOCAL_SERVER) {
    document.getElementById('systemStatusText').innerText = 'وضع الويب السحابي التفاعلي (PWA أوفلاين)';
    document.getElementById('systemStatusBadge').style.borderColor = 'var(--primary)';
    return;
  }
  try {
    const res = await fetch('http://127.0.0.1:8000/api/health');
    if (res.ok) {
      document.getElementById('systemStatusText').innerText = 'الخادم المحلي متصل نشط (API & AI)';
      document.getElementById('systemStatusBadge').style.borderColor = 'var(--success)';

      const currsRes = await fetch('http://127.0.0.1:8000/api/curriculums');
      if (currsRes.ok) {
        const serverCurrs = await currsRes.json();
        if (serverCurrs && serverCurrs.length > 0) {
          const filtered = serverCurrs.filter(sc =>
            sc &&
            sc.id !== 1 &&
            !(sc.name && (sc.name.includes('دليل وثيقة') || sc.name.includes('وثيقة النظام'))) &&
            !(sc.subject && (sc.subject.includes('هندسة النظم') || sc.subject.includes('وثيقة')))
          );
          filtered.forEach(sc => {
            if (!sc.chapters || sc.chapters.length === 0) {
              sc.chapters = window.CURRICULUM_DATA || [];
            }
          });
          if (filtered.length > 0) {
            appData.curriculums = filtered;
            ensureDefaultEnglishCurriculum();
            renderDashboard();
            renderCurriculumsList();
            populateStudyCurriculumSelect();
          }
        }
      }
    }
  } catch (e) {
    document.getElementById('systemStatusText').innerText = 'الوضع المحلي المستقل (أوفلاين 100%)';
  }
}

// التبديل بين التبويبات مع تفعيل التحميل الكسول عند الدخول الفعلي للتبويب
function switchTab(tabId, options = {}) {
  if (tabId !== 'study' && typeof closeMobileStudyDrawers === 'function') {
    closeMobileStudyDrawers(false);
  }

  const tabs = ['dashboard', 'curriculums', 'study', 'grammar', 'exams', 'settings'];
  tabs.forEach(t => {
    const sec = document.getElementById('tab-' + t);
    if (sec) sec.classList.add('hidden');
  });

  const activeSec = document.getElementById('tab-' + tabId);
  if (activeSec) activeSec.classList.remove('hidden');

  const targetActiveTab = (tabId === 'study') ? 'curriculums' : tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    const oc = btn.getAttribute('onclick') || '';
    const dt = btn.getAttribute('data-tab') || '';
    const isMatched = (dt === targetActiveTab || (targetActiveTab !== 'curriculums' && oc.includes("'" + targetActiveTab + "'")));
    if (isMatched) {
      btn.classList.add('active');
    }
    if (btn.getAttribute('role') === 'tab') {
      btn.setAttribute('aria-selected', isMatched ? 'true' : 'false');
    }
  });

  document.querySelectorAll('#mobileBottomNav .mobile-bottom-btn').forEach(btn => {
    const bTab = btn.getAttribute('data-tab') || '';
    const matched = (bTab === targetActiveTab);
    btn.classList.toggle('active', matched);
    if (matched) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });

  const activeCurrObj = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || { id: 3 };
  updateGlobalSubjectContextBars(activeCurrObj);

  let tabPromise = null;
  if (tabId === 'study') {
    tabPromise = renderStudyView();
  } else if (tabId === 'grammar') {
    currentActiveGrammarFilter = 'all';
    if (!options.preserveGrammarSearch) {
      const searchInput = document.getElementById('grammarSearchInput');
      if (searchInput) searchInput.value = '';
    }
    if (!options.skipGrammarRender) {
      tabPromise = renderGrammarRules();
    }
  } else if (tabId === 'exams') {
    if (!options.skipExamsRender) {
      tabPromise = renderExamsCenter();
    }
  } else if (tabId === 'curriculums') {
    if (!currentCurriculumViewTab) {
      if (appData.currentCurriculumId === 4 || appData.currentCurriculumId === 5) {
        currentCurriculumViewTab = 'arabic';
      } else if ([6, 7, 8, 9, 10, 11].includes(appData.currentCurriculumId)) {
        currentCurriculumViewTab = appData.currentCurriculumId;
      } else {
        currentCurriculumViewTab = 3;
      }
    }
    renderCurriculaTabsNav();
    renderCurriculumsList();
    renderActiveSubjectShowcase();
  }

  const tabLabels = {
    dashboard: 'لوحة المعلومات',
    curriculums: 'المناهج الدراسية',
    study: 'قاعة المذاكرة',
    grammar: 'القواعد والمفاهيم',
    exams: 'الاختبارات الشاملة',
    settings: 'الإعدادات والحفظ'
  };
  if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
    window.A11yManager.announce(`تم الانتقال إلى ${tabLabels[tabId] || tabId}`);
  }

  if (!options.skipScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return tabPromise;
}

// تهيئة التطبيق عند بدء التشغيل (إقلاع فوري خفيف بـ 0 ك.ب من ملفات المناهج)
function initApp() {
  audioPlayer.init();
  try {
    const isCustomUserCurr = (c) => c &&
      !BUILTIN_CURRICULUM_IDS.has(Number(c.id)) &&
      Number(c.id) !== 1 &&
      !(c.name && (c.name.includes('دليل وثيقة') || c.name.includes('وثيقة النظام')));

    const savedCompact = localStorage.getItem(STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);

    if (savedCompact) {
      const parsed = JSON.parse(savedCompact);
      if (parsed && typeof parsed === 'object') {
        appData.currentCurriculumId = Number(parsed.currentCurriculumId) || 3;
        appData.currentLessonId = parsed.currentLessonId || null;
        appData.curriculums = Array.isArray(parsed.customCurriculums)
          ? parsed.customCurriculums.filter(isCustomUserCurr)
          : [];
      }
    } else if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (legacyParsed && typeof legacyParsed === 'object') {
        appData.currentCurriculumId = Number(legacyParsed.currentCurriculumId) || 3;
        appData.currentLessonId = legacyParsed.currentLessonId || null;
        appData.curriculums = Array.isArray(legacyParsed.curriculums)
          ? legacyParsed.curriculums.filter(isCustomUserCurr)
          : [];
      }
    }

    if (legacyRaw !== null) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('LocalStorage read error', e);
  }

  ensureDefaultEnglishCurriculum();

  renderDashboard();
  renderDashboardCurriculaQuickBar();
  renderCurriculaTabsNav();
  renderCurriculumsList();
  renderActiveSubjectShowcase();
  populateStudyCurriculumSelect();
  initAiChatPanelState();
  if (window.ThemeManager && typeof window.ThemeManager.init === 'function') window.ThemeManager.init();
  if (window.A11yManager && typeof window.A11yManager.init === 'function') window.A11yManager.init();
  if (window.ReportManager && typeof window.ReportManager.init === 'function') window.ReportManager.init();
  if (window.GlobalSearch && typeof window.GlobalSearch.init === 'function') window.GlobalSearch.init();
  syncSystemVersionBadges();
  checkBackendConnection();

  // دعم اختصارات manifest.json مثل #study و #grammar
  const validHashTabs = new Set(['dashboard', 'curriculums', 'study', 'grammar', 'exams', 'settings']);
  const applyHashRoute = () => {
    const hashTab = window.location.hash.replace('#', '').trim();
    if (validHashTabs.has(hashTab)) {
      switchTab(hashTab);
    }
  };
  applyHashRoute();
  window.addEventListener('hashchange', applyHashRoute);

  checkWhatsNewOnStartup();

  setTimeout(() => {
    checkForSystemUpdate(false);
  }, 3500);

  setInterval(() => {
    checkForSystemUpdate(false);
  }, 30 * 60 * 1000);

  window.addEventListener('online', () => {
    checkForSystemUpdate(false);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForSystemUpdate(false);
    }
  });
}

// إدارة إضافة المناهج والمودال والنسخ الاحتياطي
function openAddModalWithPreset(name, subject, grade) {
  openAddModal();
  if (name) document.getElementById('newCurrName').value = name;
  if (subject) document.getElementById('newCurrSubject').value = subject;
  const gradeInput = document.getElementById('newCurrGrade');
  if (gradeInput) gradeInput.value = grade || 'الثاني متوسط';
}

function openAddModal() {
  document.getElementById('newCurrName').value = '';
  document.getElementById('newCurrSubject').value = '';
  document.getElementById('newCurrGrade').value = '';
  document.getElementById('selectedFileName').innerText = 'انقر لاختيار ملف المنهج من جهازك';
  document.getElementById('currFileInput').value = '';
  document.getElementById('addCurriculumModal').classList.remove('hidden');
}

function closeAddModal() {
  document.getElementById('addCurriculumModal').classList.add('hidden');
}

let selectedUploadFile = null;
function onFileSelected(e) {
  if (e.target.files && e.target.files[0]) {
    selectedUploadFile = e.target.files[0];
    document.getElementById('selectedFileName').innerText = selectedUploadFile.name;
    if (!document.getElementById('newCurrName').value) {
      document.getElementById('newCurrName').value = selectedUploadFile.name.replace(/\.[^/.]+$/, '');
    }
  }
}

async function saveNewCurriculum() {
  const name = document.getElementById('newCurrName').value.trim();
  const subject = document.getElementById('newCurrSubject').value.trim();
  const grade = document.getElementById('newCurrGrade').value.trim();

  if (!name || !subject) {
    alert('يرجى كتابة اسم المنهج والمادة الدراسية.');
    return;
  }

  const saveBtn = document.getElementById('saveCurrBtn');
  saveBtn.innerText = 'جارٍ الحفظ والمعالجة...';
  saveBtn.disabled = true;

  const newId = Date.now();
  let extractedChapters = [];

  if (selectedUploadFile) {
    const fileName = selectedUploadFile.name;
    if (IS_LOCAL_SERVER) {
      try {
        const createRes = await fetch('http://127.0.0.1:8000/api/curriculums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, subject, grade, description: `منهج ${name}` })
        });

        if (createRes.ok) {
          const created = await createRes.json();
          const formData = new FormData();
          formData.append('file', selectedUploadFile);

          await fetch(`http://127.0.0.1:8000/api/curriculums/${created.id}/upload`, {
            method: 'POST',
            body: formData
          });

          const chapsRes = await fetch(`http://127.0.0.1:8000/api/curriculums/${created.id}/chapters`);
          if (chapsRes.ok) {
            const serverChaps = await chapsRes.json();
            extractedChapters = serverChaps.map(ch => ({
              id: ch.id,
              title: ch.title,
              lessons: (ch.lessons || []).map(l => ({
                id: l.id,
                title: l.title,
                chunks: [
                  { id: 1, page: 1, heading: l.title, text: `محتوى درس ${escapeHtml(l.title)} المعتمد من ملف ${escapeHtml(fileName)}` }
                ]
              }))
            }));
          }
        }
      } catch (e) {
        console.log('Processed offline', e);
      }
    }

    if (extractedChapters.length === 0) {
      extractedChapters = [
        {
          id: 1,
          title: 'الوحدة الأولى: المفاهيم والأسس',
          lessons: [
            {
              id: newId + 1,
              title: `مدخل إلى ${name}`,
              chunks: [
                { id: 1, page: 1, heading: 'المقدمة والأهداف', text: `تم استخراج هذا الدرس محلياً من ملف: ${escapeHtml(fileName)}. يغطي المبادئ التأسيسية للمادة المقررة.` }
              ]
            }
          ]
        }
      ];
    }
  }

  const newCurriculum = {
    id: newId,
    name,
    subject,
    grade,
    status: 'approved',
    description: 'تم إضافته وحفظه محلياً بنجاح',
    chapters: extractedChapters
  };

  appData.curriculums.unshift(newCurriculum);
  appData.currentCurriculumId = newId;
  if (extractedChapters[0] && extractedChapters[0].lessons[0]) {
    appData.currentLessonId = extractedChapters[0].lessons[0].id;
  }
  saveData();

  saveBtn.innerText = 'حفظ ومعالجة المنهج';
  saveBtn.disabled = false;
  selectedUploadFile = null;

  closeAddModal();
  renderDashboard();
  renderActiveSubjectShowcase();
  renderCurriculumsList();
  populateStudyCurriculumSelect();
  switchTab('study');
}

function exportDataBackup() {
  const backupPayload = {
    ...appData,
    backupVersion: typeof CURRENT_VERSION_LABEL !== 'undefined' ? CURRENT_VERSION_LABEL : 'v5.4.0',
    exportedAt: new Date().toISOString(),
    preferences: {
      themeMode: (window.ThemeManager && window.ThemeManager.getMode()) || 'light',
      darkDimMedia: window.ThemeManager ? window.ThemeManager.getDarkDimMedia() : true,
      fontScale: lsGet('a11y_font_scale') || 'normal',
      highContrast: lsGet('a11y_high_contrast') === 'true',
      reducedMotion: lsGet('a11y_reduced_motion') || 'auto'
    },
    studentProfile: window.ReportManager ? window.ReportManager.getStudentProfile() : null,
    progress: window.ReportManager ? window.ReportManager.getProgressData() : null
  };
  const jsonText = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `educational_system_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importDataBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported.curriculums) {
        appData = {
          curriculums: imported.curriculums,
          currentCurriculumId: imported.currentCurriculumId || 3,
          currentLessonId: imported.currentLessonId || null
        };
        saveData();
        if (imported.preferences && typeof imported.preferences === 'object') {
          const p = imported.preferences;
          if (p.themeMode) lsSet('theme_mode', p.themeMode);
          if (typeof p.darkDimMedia === 'boolean') lsSet('dark_dim_media', p.darkDimMedia ? 'true' : 'false');
          if (p.fontScale) lsSet('a11y_font_scale', p.fontScale);
          if (typeof p.highContrast === 'boolean') lsSet('a11y_high_contrast', p.highContrast ? 'true' : 'false');
          if (p.reducedMotion) lsSet('a11y_reduced_motion', p.reducedMotion);
        }
        if (imported.studentProfile && window.ReportManager) {
          window.ReportManager.saveStudentProfile(imported.studentProfile);
        }
        if (imported.progress && typeof imported.progress === 'object') {
          lsSet('progress_v1', JSON.stringify(imported.progress));
        }
        initApp();
        alert('تم استعادة النسخة الاحتياطية بنجاح!');
      } else {
        alert('ملف النسخة الاحتياطية غير صالح.');
      }
    } catch (err) {
      alert('خطأ أثناء قراءة ملف النسخة الاحتياطية.');
    }
  };
  reader.readAsText(file);
}

// =========================================================================
// نظام الكشف والاستقبال التلقائي للتحديثات الفورية (Live PWA Update System)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

function compareVersions(v1, v2) {
  if (!v1 || !v2) return 0;
  const clean1 = String(v1).replace(/^v/i, '').trim();
  const clean2 = String(v2).replace(/^v/i, '').trim();
  const parts1 = clean1.split('.').map(n => parseInt(n, 10) || 0);
  const parts2 = clean2.split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < len; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

function showUpdateBanner(updateData) {
  pendingUpdateData = updateData;
  const banner = document.getElementById('pwaUpdateNotification');
  if (!banner) return;

  const badge = document.getElementById('updateNewVersionBadge');
  if (badge && updateData && (updateData.versionLabel || updateData.version)) {
    badge.innerText = updateData.versionLabel || `v${updateData.version}`;
  }

  const body = document.getElementById('updateNotificationBody');
  if (body && updateData && updateData.title) {
    body.innerHTML = `<strong>${escapeHtml(updateData.title)}</strong><br>انقر على «تحديث الآن» لتطبيق الإصدار وتثبيته فوراً.`;
  }

  const modalApplyBtn = document.getElementById('modalApplyUpdateBtn');
  if (modalApplyBtn) modalApplyBtn.classList.remove('hidden');

  banner.classList.remove('hidden');
}

function dismissUpdateBanner() {
  const banner = document.getElementById('pwaUpdateNotification');
  if (banner) banner.classList.add('hidden');
  if (pendingUpdateData && pendingUpdateData.version) {
    localStorage.setItem(DISMISSED_UPDATE_KEY, String(pendingUpdateData.version));
  }
}

async function applySystemUpdate() {
  const banner = document.getElementById('pwaUpdateNotification');
  if (banner) {
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; justify-content: center; width: 100%; padding: 0.6rem 0;">
        <span class="update-spinner"></span>
        <strong style="color: white; font-size: 0.88rem;">جارٍ تطبيق التحديث وتثبيت النسخة الجديدة...</strong>
      </div>
    `;
  }

  const modalApplyBtn = document.getElementById('modalApplyUpdateBtn');
  if (modalApplyBtn) {
    modalApplyBtn.disabled = true;
    modalApplyBtn.innerHTML = '<span class="update-spinner"></span> جارٍ التحديث...';
  }

  try {
    if (window.caches) {
      const keys = await caches.keys();
      const targetCacheName = 'interactive-edu-pwa-v' + (pendingUpdateData && pendingUpdateData.version ? pendingUpdateData.version : CURRENT_VERSION);
      for (const key of keys) {
        if (key.startsWith('interactive-edu-pwa-') && key !== targetCacheName && key !== 'interactive-edu-pwa-images-v1') {
          console.log('[PWA Update] Deleting old cache from window:', key);
          await caches.delete(key);
        }
      }
    }

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.update().catch(() => {});
        const targetWorker = reg.waiting || pendingServiceWorker || reg.active;
        if (targetWorker) {
          targetWorker.postMessage('skipWaiting');
        }
      }
    }
  } catch (e) {
    console.warn('Error during update application:', e);
  }

  setTimeout(() => {
    window.location.reload(true);
  }, 500);
}

async function checkForSystemUpdate(isManual = false) {
  const statusEl = document.getElementById('updateCheckStatus');
  if (isManual && statusEl) {
    statusEl.innerHTML = '<span class="update-spinner" style="border-top-color: var(--primary); width: 14px; height: 14px; vertical-align: middle;"></span> جارٍ فحص التحديثات من الخادم...';
    statusEl.style.color = 'var(--primary)';
  }

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        reg.update().catch(() => {});
        if (reg.waiting) {
          pendingServiceWorker = reg.waiting;
        }
      }
    }

    const res = await fetch(`./version.json?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });

    if (!res.ok) throw new Error('تعذر جلب ملف التحديث');
    const verData = await res.json();

    const isNewer = compareVersions(verData.version, CURRENT_VERSION) > 0;
    const dismissedVer = localStorage.getItem(DISMISSED_UPDATE_KEY);

    if (isNewer || pendingServiceWorker) {
      if (isManual || dismissedVer !== String(verData.version)) {
        showUpdateBanner(verData);
      }
      if (isManual && statusEl) {
        statusEl.innerHTML = `🎉 يتوفر تحديث جديد: <strong>${escapeHtml(verData.versionLabel || verData.version)}</strong>! تم إظهار إشعار التحديث.`;
        statusEl.style.color = 'var(--warning)';
      }
    } else {
      if (isManual && statusEl) {
        statusEl.innerHTML = `✅ نظامك محدث بالكامل إلى آخر إصدار رسمي (${escapeHtml(CURRENT_VERSION_LABEL)}) - ${escapeHtml(verData.author || SYSTEM_AUTHOR)}.`;
        statusEl.style.color = 'var(--success)';
      }
    }
  } catch (err) {
    console.warn('Update check failed:', err);
    if (isManual && statusEl) {
      statusEl.innerText = 'تعذر الاتصال بالخادم للتحقق من التحديثات (تأكد من اتصالك بالإنترنت).';
      statusEl.style.color = 'var(--danger)';
    }
  }
}

// =========================================================================
// نافذة ما الجديد (What's New Modal)
// =========================================================================

async function showWhatsNewModal(fromUpdateBanner = false) {
  let dataToDisplay = null;

  try {
    const res = await fetch(`./version.json?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      dataToDisplay = await res.json();
    }
  } catch (e) {
    console.log('Using local fallback for whatsNew');
  }

  if (!dataToDisplay) {
    dataToDisplay = {
      version: CURRENT_VERSION,
      versionLabel: CURRENT_VERSION_LABEL,
      date: '2026-11-27',
      author: SYSTEM_AUTHOR,
      title: 'قصر زر الاستماع الصوتي في الاختبارات التفاعلية على أسئلة اللغة الإنجليزية وتحديث عامل الخدمة (v5.13.2)',
      whatsNew: [
        'إخفاء زر «استمع للسؤال» في الاختبارات التفاعلية للرياضيات وبقية المناهج غير الإنجليزية.',
        'الإبقاء على الزر مفعّلاً لأسئلة اللغة الإنجليزية فقط مع تنظيف الفراغات والشروح الجانبية قبل النطق.',
        'مزامنة ذاكرة عامل الخدمة المعزول interactive-edu-pwa-v5.13.2.'
      ],
      history: [
        {
          version: '5.3.0',
          versionLabel: 'v5.3.0',
          date: '2026-11-24',
          title: 'تجربة الجوال المتكاملة والبحث الشامل وإمكانية الوصول WCAG 2.1 AA',
          notes: [
            'شريط تنقل سفلي وأدراج منزلقة للجوال، محرك البحث الشامل Ctrl+K (js/search.js)، ووحدة إمكانية الوصول (js/a11y.js).'
          ]
        },
        {
          version: '5.2.0',
          versionLabel: 'v5.2.0',
          date: '2026-11-24',
          title: 'تقسيم index.html وتوحيد النوافذ والتحميل الكسول للمواد',
          notes: [
            'فصل التنسيقات إلى css/styles.css والمنطق إلى 11 وحدة js/ مع التحميل الكسول CurriculumLoader وتوحيد نوافذ المراجعات والرسوم.'
          ]
        },
        {
          version: '5.1.2',
          versionLabel: 'v5.1.2',
          date: '2026-11-24',
          title: 'تحسينات الاستقرار والأمان والأداء وإصلاح التصفح وحفظ الحالة',
          notes: [
            'تقليص بيانات localStorage (< 1 كيلوبايت)، إصلاح تكرار البطاقات وتفعيل شريط مواد بنك القواعد، التعقيم escapeHtml، وتقليص version.json.'
          ]
        },
        {
          version: '5.1.1',
          versionLabel: 'v5.1.1',
          date: '2026-11-24',
          title: 'تحديث الصيانة الشامل وإصلاح الاختبارات وعزل PWA',
          notes: [
            'خلط خيارات الأسئلة الـ 640، وتفعيل القفز السريع والشهادة والطباعة والنطق العربي، وتفعيل نوافذ علم الأحياء ومراجعات الرياضيات وعزل مخازن عامل الخدمة.'
          ]
        },
        {
          version: '5.1.0',
          versionLabel: 'v5.1.0',
          date: '2026-11-03',
          title: 'تدشين المنظومة الشاملة للاختبارات التفاعلية المنهجية (640 سؤالاً)',
          notes: [
            'بناء بنك الاختبارات المنهجية لكافة المواد التسع (64 فصلاً ووحدة / 640 سؤالاً مع الشروحات والتفسيرات المعتمدة).'
          ]
        }
      ]
    };
  }

  const titleEl = document.getElementById('whatsNewModalTitle');
  if (titleEl) {
    titleEl.innerText = `ما الجديد في ${dataToDisplay.versionLabel || ('v' + dataToDisplay.version)}؟`;
  }

  const dateEl = document.getElementById('whatsNewModalDate');
  if (dateEl) {
    dateEl.innerText = dataToDisplay.date || 'نوفمبر 2026';
  }

  const badgeEl = document.getElementById('whatsNewModalVersionBadge');
  if (badgeEl) {
    badgeEl.innerText = dataToDisplay.versionLabel || ('v' + dataToDisplay.version);
  }

  const summaryTitle = document.getElementById('whatsNewReleaseSummaryTitle');
  if (summaryTitle && dataToDisplay.title) {
    summaryTitle.innerText = dataToDisplay.title;
  }

  const listEl = document.getElementById('whatsNewFeatureList');
  if (listEl && Array.isArray(dataToDisplay.whatsNew)) {
    listEl.innerHTML = dataToDisplay.whatsNew.map(item => `
      <div class="whatsnew-feature-item">
        <span class="whatsnew-feature-icon">✓</span>
        <div>${escapeHtml(item)}</div>
      </div>
    `).join('');
  }

  const historyEl = document.getElementById('whatsNewHistoryContent');
  if (historyEl && Array.isArray(dataToDisplay.history)) {
    historyEl.innerHTML = dataToDisplay.history.map(hist => {
      const rawVer = String(hist.version || '');
      const vLbl = hist.versionLabel || (rawVer.startsWith('v') ? rawVer : 'v' + rawVer);
      return `
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 8px; padding: 0.75rem; font-size: 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="color: var(--primary);">${escapeHtml(vLbl)} - ${escapeHtml(hist.title)}</strong>
            <span style="font-size: 0.72rem; color: var(--slate-500);">${escapeHtml(hist.date)}</span>
          </div>
          <ul style="margin: 0; padding-inline-start: 1.2rem; color: var(--slate-600); line-height: 1.5;">
            ${(hist.notes || hist.whatsNew || []).map(n => `<li>${escapeHtml(n)}</li>`).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  const modalApplyBtn = document.getElementById('modalApplyUpdateBtn');
  if (modalApplyBtn) {
    if (fromUpdateBanner || (pendingUpdateData && compareVersions(pendingUpdateData.version, CURRENT_VERSION) > 0)) {
      modalApplyBtn.classList.remove('hidden');
    } else {
      modalApplyBtn.classList.add('hidden');
    }
  }

  const modal = document.getElementById('whatsNewModal');
  if (modal) modal.classList.remove('hidden');
}

function closeWhatsNewModal() {
  const modal = document.getElementById('whatsNewModal');
  if (modal) modal.classList.add('hidden');
  localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION);
}

function toggleWhatsNewHistory() {
  const hist = document.getElementById('whatsNewHistoryContent');
  const icon = document.getElementById('historyToggleIcon');
  if (!hist) return;
  if (hist.classList.contains('hidden')) {
    hist.classList.remove('hidden');
    if (icon) icon.innerText = '▲';
  } else {
    hist.classList.add('hidden');
    if (icon) icon.innerText = '▼';
  }
}

function checkWhatsNewOnStartup() {
  const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
  if (!lastSeen) {
    setTimeout(() => {
      showWhatsNewModal();
    }, 1200);
  } else if (compareVersions(CURRENT_VERSION, lastSeen) > 0) {
    setTimeout(() => {
      showWhatsNewModal();
    }, 1200);
  }
}

window.addEventListener('DOMContentLoaded', initApp);

// تسجيل Service Worker وتفعيل المراقبة اللحظية للتحديثات
if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('PWA Service Worker registered:', reg.scope);

        if (reg.waiting) {
          pendingServiceWorker = reg.waiting;
          checkForSystemUpdate(false);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                pendingServiceWorker = newWorker;
                console.log('New PWA update installed and waiting!');
                checkForSystemUpdate(false);
              }
            });
          }
        });

        reg.update().catch(() => {});
      })
      .catch(err => console.log('Service Worker registration failed:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload(true);
      }
    });
  });
}

// إدارة تثبيت تطبيق PWA (الزر المعتمد الموحد في شريط العنوان العلوي)
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const navBtn = document.getElementById('pwaInstallBtn');
  if (navBtn) navBtn.style.display = 'inline-flex';
});

async function installPWA() {
  if (!deferredPrompt) {
    alert('تطبيق النظام التعليمي جاهز! يمكنك تثبيته مباشرة عبر أيقونة التثبيت (Install App) في شريط عنوان المتصفح أو قائمة الخيارات.');
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    const navBtn = document.getElementById('pwaInstallBtn');
    if (navBtn) navBtn.style.display = 'none';
  }
  deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  const navBtn = document.getElementById('pwaInstallBtn');
  if (navBtn) navBtn.style.display = 'none';
  alert('تم تثبيت التطبيق بنجاح على جهازك!');
});

// معالج لوحة المفاتيح الموحّد: اختصارات البحث الشامل + تقليب صفحات الكتاب + Escape
window.addEventListener('keydown', (e) => {
  const activeTag = (document.activeElement && document.activeElement.tagName) ? document.activeElement.tagName.toUpperCase() : '';
  const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || (document.activeElement && document.activeElement.isContentEditable);

  // اختصار البحث الشامل Ctrl+K / Cmd+K أو '/' خارج حقول الكتابة
  if (((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) || (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey && e.key === '/')) {
    if (typeof openGlobalSearchModal === 'function') {
      e.preventDefault();
      openGlobalSearchModal();
      return;
    }
  }

  // تقليب صفحات عارض الكتاب بالأسهم (RTL: اليسار للصفحة التالية، اليمين للسابقة)
  const bookModal = document.getElementById('bookPageModal');
  if (bookModal && !bookModal.classList.contains('hidden') && !isTyping && typeof navModalBookPage === 'function') {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navModalBookPage(1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navModalBookPage(-1);
      return;
    }
  }

  if (e.key !== 'Escape') return;
  const modalCloseMap = [
    ['globalSearchModal', () => typeof closeGlobalSearchModal === 'function' && closeGlobalSearchModal()],
    ['reportsCenterModal', () => typeof closeReportsCenterModal === 'function' && closeReportsCenterModal()],
    ['bookPageModal', () => closeBookPageModal()],
    ['diagramViewerModal', () => closeDiagramViewerModal()],
    ['diagramsGalleryModal', () => closeDiagramsGalleryModal()],
    ['chapterReviewsModal', () => closeChapterReviewsModal()],
    ['voiceStudioModal', () => closeVoiceStudioModal()],
    ['addCurriculumModal', () => closeAddModal()],
    ['whatsNewModal', () => closeWhatsNewModal()]
  ];
  for (const [id, closeFn] of modalCloseMap) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      closeFn();
      return;
    }
  }
  if (window.A11yManager && typeof window.A11yManager.hasOpenMobileDrawer === 'function' && window.A11yManager.hasOpenMobileDrawer()) {
    closeMobileStudyDrawers(true);
  }
});
