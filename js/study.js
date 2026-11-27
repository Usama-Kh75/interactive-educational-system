// =========================================================================
// قاعة المذاكرة، عارض الدروس، المعرض البصري، والمكتبة الرقمية
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

function populateStudyCurriculumSelect() {
  const select = document.getElementById('studyCurrSelect');
  if (!select) return;
  select.innerHTML = '';
  const currs = (appData.curriculums || []).filter(c => 
    c && c.id !== 1 && 
    !(c.name && (c.name.includes('دليل وثيقة') || c.name.includes('وثيقة النظام'))) && 
    !(c.subject && (c.subject.includes('هندسة النظم') || c.subject.includes('وثيقة')))
  );

  // 1. اللغة الإنجليزية
  const eng = currs.find(c => c.id === 3);
  if (eng) {
    const opt = document.createElement('option');
    opt.value = 3;
    opt.innerText = '📘 اللغة الانجليزية (English for Iraq)';
    if (appData.currentCurriculumId === 3) opt.selected = true;
    select.appendChild(opt);
  }

  // 2. تفرع مادة اللغة العربية في مجموعة منظمة
  const optGroup = document.createElement('optgroup');
  optGroup.label = '📚 مادة اللغة العربية (مقرران معتمدان)';

  const ar1 = currs.find(c => c.id === 4);
  if (ar1) {
    const opt = document.createElement('option');
    opt.value = 4;
    opt.innerText = '📙 الجزء الأول (136 صفحة - 10 وحدات)';
    if (appData.currentCurriculumId === 4) opt.selected = true;
    optGroup.appendChild(opt);
  }

  const ar2 = currs.find(c => c.id === 5);
  if (ar2) {
    const opt = document.createElement('option');
    opt.value = 5;
    opt.innerText = '📗 الجزء الثاني (136 صفحة - 10 وحدات)';
    if (appData.currentCurriculumId === 5) opt.selected = true;
    optGroup.appendChild(opt);
  }

  select.appendChild(optGroup);

  // 3. مادة التربية الإسلامية
  const islamic = currs.find(c => c.id === 6);
  if (islamic) {
    const opt = document.createElement('option');
    opt.value = 6;
    opt.innerText = '🕌 التربية الإسلامية (120 صفحة - 6 وحدات معتمدة)';
    if (appData.currentCurriculumId === 6) opt.selected = true;
    select.appendChild(opt);
  }

  // 4. مادة الفيزياء
  const physics = currs.find(c => c.id === 7);
  if (physics) {
    const opt = document.createElement('option');
    opt.value = 7;
    opt.innerText = '⚛️ الفيزياء (88 صفحة - 6 فصول معتمدة)';
    if (appData.currentCurriculumId === 7) opt.selected = true;
    select.appendChild(opt);
  }

  // 5. مادة الرياضيات
  const math = currs.find(c => c.id === 8);
  if (math) {
    const opt = document.createElement('option');
    opt.value = 8;
    opt.innerText = '📐 الرياضيات (196 صفحة - 7 فصول معتمدة - 51 درساً تفاعلياً)';
    if (appData.currentCurriculumId === 8) opt.selected = true;
    select.appendChild(opt);
  }

  // 6. مادة الاجتماعيات
  const social = currs.find(c => c.id === 9);
  if (social) {
    const opt = document.createElement('option');
    opt.value = 9;
    opt.innerText = '🌍 الاجتماعيات (140 صفحة - 6 فصول معتمدة - 39 درساً تفاعلياً)';
    if (appData.currentCurriculumId === 9) opt.selected = true;
    select.appendChild(opt);
  }

  // 7. مادة الكيمياء
  const chemistry = currs.find(c => c.id === 10);
  if (chemistry) {
    const opt = document.createElement('option');
    opt.value = 10;
    opt.innerText = '🧪 الكيمياء (96 صفحة - 6 فصول معتمدة - 21 درساً تفاعلياً)';
    if (appData.currentCurriculumId === 10) opt.selected = true;
    select.appendChild(opt);
  }

  // 8. مادة علم الأحياء
  const biology = currs.find(c => c.id === 11);
  if (biology) {
    const opt = document.createElement('option');
    opt.value = 11;
    opt.innerText = '🧬 علم الأحياء (92 صفحة - 7 فصول معتمدة - 21 درساً تفاعلياً)';
    if (appData.currentCurriculumId === 11) opt.selected = true;
    select.appendChild(opt);
  }

  // 9. أي مناهج أخرى
  currs.filter(c => ![3, 4, 5, 6, 7, 8, 9, 10, 11].includes(c.id)).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.innerText = c.name;
    if (c.id === appData.currentCurriculumId) opt.selected = true;
    select.appendChild(opt);
  });
}

function onCurriculumSelectChange(currId, skipRender = false) {
  const idNum = Number(currId);
  appData.currentCurriculumId = idNum;
  appData.currentLessonId = null;
  saveData();
  if (idNum === 11) currentCurriculumViewTab = 11;
  else if (idNum === 10) currentCurriculumViewTab = 10;
  else if (idNum === 9) currentCurriculumViewTab = 9;
  else if (idNum === 8) currentCurriculumViewTab = 8;
  else if (idNum === 7) currentCurriculumViewTab = 7;
  else if (idNum === 6) currentCurriculumViewTab = 6;
  else if (idNum === 4 || idNum === 5) currentCurriculumViewTab = 'arabic';
  else if (idNum === 3) currentCurriculumViewTab = 3;
  renderDashboardCurriculaQuickBar();
  renderCurriculaTabsNav();
  if (!skipRender) {
    renderStudyView();
  }
}

function selectCurriculumForStudy(currId) {
  onCurriculumSelectChange(currId, true);
  switchTab('study');
}

function openSubjectTab(currId = 3) {
  selectCurriculumForStudy(currId);
}

function scrollToStudyContent() {
  const el = document.getElementById('lessonChunksContainerWrapper') || document.querySelector('.study-layout');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

let studyRenderToken = 0;

// عرض شاشة المذاكرة المتكاملة
async function renderStudyView() {
  const reqToken = ++studyRenderToken;
  audioPlayer.stop();
  populateStudyCurriculumSelect();
  const currId = Number(appData.currentCurriculumId) || 3;
  const isEnglish = isEnglishCurriculum(currId);

  // إظهار أو إخفاء شريط القارئ الصوتي وشاشة التتبع الصوتي المباشر (حصراً لمنهج اللغة الإنجليزية)
  const audioBar = document.getElementById('audioPlayerBar');
  const teleprompterBox = document.getElementById('liveTeleprompterBox');
  if (audioBar) {
    audioBar.style.display = isEnglish ? 'flex' : 'none';
  }
  if (teleprompterBox && !isEnglish) {
    teleprompterBox.style.display = 'none';
  }

  const treeContainer = document.getElementById('chaptersTreeContainer');
  const chunksContainer = document.getElementById('lessonChunksContainer');

  let chapters = [];

  // 1. محاولة جلب الفصول من الخادم أولاً إذا كان محلياً
  if (IS_LOCAL_SERVER) {
    try {
      const chapsRes = await fetch(`http://127.0.0.1:8000/api/curriculums/${currId}/chapters`);
      if (reqToken !== studyRenderToken) return;
      if (chapsRes.ok) {
        chapters = await chapsRes.json();
      }
    } catch (e) {
      console.log('Using local embedded chapters');
    }
  }

  // 2. التحميل الكسول لملفات المادة عند الطلب إذا لم تكن محمّلة بعد
  if ((!chapters || chapters.length === 0) && BUILTIN_CURRICULUM_IDS.has(currId) && !CurriculumLoader.isCurriculumLoaded(currId)) {
    const currObj = (appData.curriculums || []).find(c => c.id === currId);
    const subjLabel = (currObj && (currObj.subject || currObj.name)) || 'بيانات المنهج';
    if (treeContainer) {
      treeContainer.innerHTML = '<div style="color: var(--slate-500); font-size: 0.8rem; text-align: center; padding: 1.25rem;">جارٍ تحميل فهرس الفصول...</div>';
    }
    if (chunksContainer) {
      chunksContainer.innerHTML = CurriculumLoader.renderLoadingHTML(subjLabel);
    }
    const ok = await CurriculumLoader.ensureCurriculumLoaded(currId);
    if (reqToken !== studyRenderToken) return;
    if (!ok) {
      if (treeContainer) {
        treeContainer.innerHTML = '<div style="color: #dc2626; font-size: 0.8rem; text-align: center; padding: 1rem;">تعذر تحميل الفصول.</div>';
      }
      if (chunksContainer) {
        chunksContainer.innerHTML = CurriculumLoader.renderErrorHTML(subjLabel, 'renderStudyView()');
      }
      return;
    }
  }

  // إذا لم يتصل بالخادم، استخدم المنهج المدمج محلياً
  if (!chapters || chapters.length === 0) {
    chapters = getCurriculumChapters(currId);
  }
  if (reqToken !== studyRenderToken) return;

  treeContainer.innerHTML = '';
  if (!chapters || chapters.length === 0) {
    treeContainer.innerHTML = '<div style="color: var(--slate-400); font-size: 0.8rem; text-align: center; padding: 1rem;">لا توجد فصول مستخرجة بعد.</div>';
    return;
  }

  // إذا لم يُحدد درس حالي، اختر الدرس الأول
  if (!appData.currentLessonId) {
    for (const ch of chapters) {
      if (ch.lessons && ch.lessons.length > 0) {
        appData.currentLessonId = ch.lessons[0].id;
        break;
      }
    }
  }

  // بناء شجرة الفصول والدروس
  chapters.forEach(chap => {
    const group = document.createElement('div');
    group.className = 'chapter-group';
    
    const header = document.createElement('div');
    header.className = 'chapter-title-header';
    header.innerHTML = `<span>${chap.title}</span> <span style="font-size: 0.7rem; color: var(--slate-500);">${(chap.lessons || []).length} دروس</span>`;
    group.appendChild(header);

    (chap.lessons || []).forEach(les => {
      const item = document.createElement('button');
      item.type = 'button';
      const isReviewLes = les.title && les.title.includes('مراجعة');
      const isCurrentLes = (les.id === appData.currentLessonId);
      item.className = `tree-item ${isCurrentLes ? 'active' : ''}`;
      if (isCurrentLes) item.setAttribute('aria-current', 'page');
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 0.35rem;">
          <span>${les.title}</span>
          ${isReviewLes ? '<span style="background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; font-size: 0.62rem; font-weight: 800; padding: 0.1rem 0.35rem; border-radius: 4px; white-space: nowrap; flex-shrink: 0;">🎯 حلول معتمدة</span>' : ''}
        </div>
        <span style="font-size: 0.68rem; color: var(--slate-400);">${les.summary || ''}</span>
      `;
      item.onclick = () => {
        appData.currentLessonId = les.id;
        saveData();
        renderStudyView();
        if (window.innerWidth <= 1100 && typeof closeMobileStudyDrawers === 'function') {
          closeMobileStudyDrawers(false);
          if (typeof scrollToStudyContent === 'function') scrollToStudyContent();
        }
      };
      group.appendChild(item);
    });

    // إضافة زر اختبار الفصل التفاعلي المباشر (10 أسئلة منهجية) - إعداد المهندس أسامة خليل هاشم
    const chapterQuizItem = document.createElement('button');
    chapterQuizItem.type = 'button';
    chapterQuizItem.className = 'chapter-quiz-tree-item';
    chapterQuizItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.4rem;">
        <span>📝</span>
        <span style="font-weight: 800;">اختبار ${chap.title}</span>
      </div>
      <span class="badge" style="background: #4f46e5; color: #ffffff; font-weight: 800; font-size: 0.65rem; padding: 0.15rem 0.45rem; border-radius: 9999px;">10 أسئلة 🚀</span>
    `;
    chapterQuizItem.onclick = (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 1100 && typeof closeMobileStudyDrawers === 'function') {
        closeMobileStudyDrawers(false);
      }
      startChapterQuiz(currId, chap.id);
    };
    group.appendChild(chapterQuizItem);

    treeContainer.appendChild(group);
  });

  // جلب وعرض نصوص الدرس المختار
  renderCurrentLessonContent(currId, chapters);
}

async function renderCurrentLessonContent(currId, chapters) {
  const chunksContainer = document.getElementById('lessonChunksContainer');
  const headerSpan = document.getElementById('currentLessonHeader');
  const countBadge = document.getElementById('lessonChunksCountBadge');
  const breadcrumbEl = document.getElementById('lessonBreadcrumbBanner');

  // البحث عن الدرس المختار في الهيكلية
  let activeLesson = null;
  let activeChapter = null;
  for (const ch of chapters) {
    for (const l of ch.lessons || []) {
      if (l.id === appData.currentLessonId) {
        activeLesson = l;
        activeChapter = ch;
        break;
      }
    }
    if (activeLesson) break;
  }

  if (!activeLesson) {
    if (chunksContainer) chunksContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem 1rem;">يرجى اختيار درس من القائمة.</div>';
    return;
  }

  const unitTitle = activeChapter ? activeChapter.title : 'الوحدة الدراسية';
  const lessonTitle = activeLesson.title;

  if (window.ReportManager && typeof window.ReportManager.recordLessonVisit === 'function') {
    window.ReportManager.recordLessonVisit(currId, activeLesson.id);
  }

  if (headerSpan) headerSpan.innerText = `${lessonTitle}`;

  // فحص القواعد المرتبطة بهذا الدرس
  updateLessonGrammarAlert(activeLesson);

  // تحديث رقائق الأسئلة المقترحة وتخصيص رسالة ترحيب المعلم الذكي بحسب المادة والدرس
  updateSuggestedChips(activeLesson);
  resetAiChatForLesson(activeLesson);

  let chunks = [];

  // 1. محاولة جلب المقاطع من الخادم إذا كان محلياً
  if (IS_LOCAL_SERVER) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/curriculums/${currId}/chunks?lesson_id=${activeLesson.id}`);
      if (res.ok) {
        chunks = await res.json();
      }
    } catch (e) {
      // Fallback
    }
  }

  // إذا لم يتصل، استخرج المقاطع من الكائن المحلي
  if (!chunks || chunks.length === 0) {
    chunks = activeLesson.chunks || [];
  }

  const rawPages = (chunks || []).map(ch => ch.page || ch.page_number).filter(Boolean);
  const pages = [...new Set(rawPages)];
  const studentPageText = pages.length > 0 ? pages.join(', ') : '4';

  let activityBookText = '';
  for (const ch of chunks) {
    const full = (ch.heading || '') + ' ' + (ch.text || ch.content_text || '');
    const abM = full.match(/\bAB\s*(\d+(?:-\d+)?)\b/i);
    if (abM) {
      activityBookText = `صفحة (${abM[1]})`;
      break;
    }
  }

  // تحديث بطاقة موقع الدرس والوحدة والصفحة في الكتاب المعتمد
  const isEnCurr = isEnglishCurriculum(currId);
  let bookCoordHtml = '';
  if (isEnCurr) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage">
        📖 <strong>كتاب الطالب (SB):</strong> صفحة ${studentPageText}
      </div>
      ${activityBookText ? `
        <div class="coord-badge activity-book">
          📝 <strong>كتاب النشاط (AB):</strong> ${activityBookText}
        </div>
      ` : ''}
    `;
  } else if (currId === 4) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0;">
        📖 <strong>كتاب اللغة العربية (الجزء الأول):</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 5) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0;">
        📖 <strong>كتاب اللغة العربية (الجزء الثاني):</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 6) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #f0fdfa; color: #0f766e; border-color: #99f6e4;">
        🕌 <strong>كتاب التربية الإسلامية:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 7) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #f0f9ff; color: #0369a1; border-color: #bae6fd;">
        ⚛️ <strong>كتاب الفيزياء:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 8) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #faf5ff; color: #6b21a8; border-color: #d8b4fe;">
        📐 <strong>كتاب الرياضيات:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 9) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #fffbeb; color: #92400e; border-color: #fde68a;">
        🌍 <strong>كتاب الاجتماعيات:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 10) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0;">
        🧪 <strong>كتاب الكيمياء:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else if (currId === 11) {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage" style="background: #f0fdf4; color: #166534; border-color: #86efac;">
        🧬 <strong>كتاب علم الأحياء المعتمد:</strong> صفحة ${studentPageText}
      </div>
    `;
  } else {
    bookCoordHtml = `
      <div class="coord-badge student-book" id="breadcrumbStudentBookPage">
        📖 <strong>الكتاب المنهجي المعتمد:</strong> صفحة ${studentPageText}
      </div>
    `;
  }

  if (breadcrumbEl) {
    const actPages = activeLesson.activity_book_pages || [];
    const hasActPages = isEnCurr && actPages.length > 0;
    breadcrumbEl.innerHTML = `
      <div class="breadcrumb-top-row">
        <div class="breadcrumb-unit-badge" id="breadcrumbUnitBadge">
          <span>📚</span> ${escapeHtml(unitTitle)}
        </div>
        <div style="font-size: 0.72rem; color: var(--slate-500); font-weight: 700;">
          المنهج الوزاري المعتمد
        </div>
      </div>
      <h2 class="breadcrumb-lesson-title" id="breadcrumbLessonTitle">
        ${escapeHtml(lessonTitle)}
      </h2>
      <div class="breadcrumb-coords-row">
        ${bookCoordHtml}
        <button class="btn btn-primary btn-sm" onclick="openBookPageModal(${pages[0] || 4}, \`${escapeForAttribute(lessonTitle)}\`, 'student')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem;">
          🔍 فتح كتاب الطالب (${pages[0] || 4})
        </button>
        ${hasActPages ? `
          <button class="btn btn-sm" onclick="openBookPageModal(${actPages[0]}, \`${escapeForAttribute(lessonTitle)}\`, 'activity')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #0d9488; color: #ffffff; border: none; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(13,148,136,0.3);">
            📝 فتح كراس النشاط (${actPages.join(', ')})
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" id="toggleVisualBtn" onclick="toggleMediaSection('lessonMediaVisualContainer')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem;">
          🎨 المعرض البصري والمفاهيم
        </button>
        ${(appData.currentCurriculumId === 7 && window.getPhysicsDiagram && window.getPhysicsDiagram(activeLesson.id)) ? `
          <button class="btn btn-sm" id="togglePhysicsDiagramBtn" onclick="toggleMediaSection('lessonMediaVisualContainer', 'physicsDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #0284c7; color: #ffffff; border: none; font-weight: 700; box-shadow: 0 1px 3px rgba(2,132,199,0.3);">
            🔬 الرسم التوضيحي للدرس
          </button>
        ` : ''}
        ${(appData.currentCurriculumId === 8 && window.getMathDiagramsForLesson && window.getMathDiagramsForLesson(activeLesson.id).length > 0) ? `
          <button class="btn btn-sm" id="toggleMathDiagramBtn" onclick="toggleMediaSection('lessonMediaVisualContainer', 'mathDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #7e22ce; color: #ffffff; border: none; font-weight: 700; box-shadow: 0 1px 3px rgba(126,34,206,0.3);">
            📐 الرسم الهندسي للدرس
          </button>
        ` : ''}
        ${(appData.currentCurriculumId === 10 && window.getChemistryDiagramsForLesson && window.getChemistryDiagramsForLesson(activeLesson.id).length > 0) ? `
          <button class="btn btn-sm" id="toggleChemistryDiagramBtn" onclick="toggleMediaSection('lessonMediaVisualContainer', 'chemistryDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #059669; color: #ffffff; border: none; font-weight: 700; box-shadow: 0 1px 3px rgba(5,150,105,0.3);">
            🧪 الرسم التوضيحي للدرس
          </button>
        ` : ''}
        ${(appData.currentCurriculumId === 11 && window.getBiologyDiagramsForLesson && window.getBiologyDiagramsForLesson(activeLesson.id).length > 0) ? `
          <button class="btn btn-sm" id="toggleBiologyDiagramBtn" onclick="toggleMediaSection('lessonMediaVisualContainer', 'biologyDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #16a34a; color: #ffffff; border: none; font-weight: 700; box-shadow: 0 1px 3px rgba(22,163,74,0.3);">
            🧬 الرسم التوضيحي للدرس
          </button>
        ` : ''}
        ${(chunks || []).some(ch => ch.exercises && ch.exercises.length > 0) ? `
          <button class="btn btn-sm" id="toggleAllChunkReviewSolsBtn" onclick="toggleAllReviewSolutionsInPage()" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; background: #0284c7; color: #ffffff; border: none; font-weight: 800; box-shadow: 0 1px 3px rgba(2,132,199,0.3); border-radius: 6px;">
            🎯 إظهار كافة الحلول النموذجية
          </button>
        ` : ''}
      </div>
    `;
  }

  // تحديث المعرض البصري والرسوم التوضيحية لصفحات الكتاب والبطاقات المصممة
  renderLessonMediaGallery(activeLesson, activeChapter, chunks);

  if (countBadge) countBadge.innerText = `${chunks.length} مقاطع معتمدة`;
  chunksContainer.innerHTML = '';

  if (chunks.length === 0) {
    chunksContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 2rem;">لا توجد نصوص مسجلة لهذا الدرس حالياً.</div>';
    return;
  }

  chunks.forEach((ch, idx) => {
    const text = ch.content_text || ch.text || '';
    const page = ch.page || ch.page_number || 1;
    const heading = ch.heading || `المقطع ${idx + 1}`;
    const isActivity = Boolean(ch.is_activity_book || ch.activity_book);

    const hasExercises = Boolean(ch.exercises && ch.exercises.length > 0);
    const isReviewChunk = Boolean(ch.is_review || (activeLesson && activeLesson.title && activeLesson.title.includes('مراجعة')));
    const box = document.createElement('div');
    box.className = (isActivity || isReviewChunk) ? 'chunk-box chunk-box-activity' : 'chunk-box';
    box.id = `chunk-box-${idx}`;

    let innerContentHtml = '';

    if (hasExercises) {
      let bannerHtml = '';
      const isArP1 = (appData.currentCurriculumId === 4);
      const isArP2 = (appData.currentCurriculumId === 5);
      const isArCurr = isArP1 || isArP2;
      const isMathCurr = (appData.currentCurriculumId === 8);
      const isSocCurr = (appData.currentCurriculumId === 9);
      const isChemCurr = (appData.currentCurriculumId === 10);
      const isBioCurr = (appData.currentCurriculumId === 11);
      const useMathFmt = (appData.currentCurriculumId === 7 || isMathCurr);
      if (isActivity) {
        bannerHtml = `
          <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: #e6fffa; border: 1px solid #b2f5ea; padding: 0.45rem 0.75rem; border-radius: 8px;">
            <span style="font-size: 0.82rem; font-weight: 800; color: #0d9488;">
              🎯 تمارين كتاب النشاط الرسمية والحلول النموذجية المعتمدة
            </span>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; font-weight: 700; background: white;">
              👁️ إظهار / إخفاء جميع الحلول
            </button>
          </div>
        `;
      } else if (isArCurr) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #a7f3d0; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(5,150,105,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #065f46; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>${isArP2 ? '📗' : '📙'}</span> تمرينات ومراجعة الوحدة والحلول النموذجية المعتمدة (اللغة العربية - ${isArP2 ? 'الجزء الثاني' : 'الجزء الأول'})
              </span>
              <span class="badge" style="background: ${isArP2 ? '#047857' : '#059669'}; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: ${isArP2 ? '#047857' : '#059669'}; border: 1px solid #a7f3d0; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة حلول التمرينات
            </button>
          </div>
        `;
      } else if (isMathCurr) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border: 1.5px solid #d8b4fe; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(126,34,206,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #581c87; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>📐</span> ${isReviewChunk ? 'مراجعة واختبار الفصل والحلول النموذجية المعتمدة (الرياضيات)' : 'تمارين الدرس والحلول النموذجية المعتمدة (تأكد من فهمك • تدرب • مسائل حياتية • فكّر)'}
              </span>
              <span class="badge" style="background: #7e22ce; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: #7e22ce; border: 1px solid #d8b4fe; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة الحلول
            </button>
          </div>
        `;
      } else if (isSocCurr) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(180,83,9,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #78350f; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>🌍</span> ${isReviewChunk ? 'مراجعة الفصل والحلول النموذجية المعتمدة (الاجتماعيات)' : 'مراجعة الدرس والأنشطة الصفية والحلول النموذجية المعتمدة (الاجتماعيات)'}
              </span>
              <span class="badge" style="background: #b45309; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: #92400e; border: 1px solid #fde68a; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة الحلول
            </button>
          </div>
        `;
      } else if (isChemCurr) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(5,150,105,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #064e3b; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>🧪</span> ${isReviewChunk ? 'مراجعة الفصل والحلول النموذجية المعتمدة (الكيمياء)' : 'مراجعة الدرس والأنشطة والتفكير الناقد والحلول النموذجية (الكيمياء)'}
              </span>
              <span class="badge" style="background: #059669; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: #065f46; border: 1px solid #a7f3d0; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة الحلول
            </button>
          </div>
        `;
      } else if (isBioCurr) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1.5px solid #86efac; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(22,163,74,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #14532d; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>🧬</span> ${isReviewChunk ? 'مراجعة الفصل والحلول النموذجية المعتمدة (علم الأحياء)' : 'مراجعة الدرس وأسئلة التفكير الناقد والحلول النموذجية المعتمدة (علم الأحياء)'}
              </span>
              <span class="badge" style="background: #16a34a; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: #15803d; border: 1px solid #86efac; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة الحلول
            </button>
          </div>
        `;
      } else if (appData.currentCurriculumId === 7) {
        bannerHtml = `
          <div style="margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #7dd3fc; padding: 0.55rem 0.9rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(2,132,199,0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.88rem; font-weight: 800; color: #0369a1; display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>⚛️</span> ${isReviewChunk ? 'مراجعة الفصل والحلول النموذجية المعتمدة (الفيزياء)' : 'مراجعة الدرس (أختبر معلوماتي والتفكير الناقد) والحلول النموذجية (الفيزياء)'}
              </span>
              <span class="badge" style="background: #0284c7; color: white; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">
                ✨ حل نموذجي وزاري معتمد
              </span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.74rem; padding: 0.25rem 0.75rem; font-weight: 800; background: white; color: #0284c7; border: 1px solid #7dd3fc; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              👁️ إظهار / إخفاء كافة حلول المراجعة
            </button>
          </div>
        `;
      } else {
        bannerHtml = `
          <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.45rem 0.75rem; border-radius: 8px;">
            <span style="font-size: 0.82rem; font-weight: 800; color: var(--slate-800);">
              🎯 الأسئلة والحلول النموذجية المعتمدة
            </span>
            <button class="btn btn-secondary btn-sm" onclick="toggleAllActivitySolutions('${idx}')" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; font-weight: 700; background: white;">
              👁️ إظهار / إخفاء جميع الحلول
            </button>
          </div>
        `;
      }

      innerContentHtml = bannerHtml + `<div class="activity-exercises-list" id="activityExercisesList_${idx}">`;

      ch.exercises.forEach((ex, exIdx) => {
        const exId = ex.id || `ex_${idx}_${exIdx}`;
        let wordsBoxHtml = '';
        if (ex.words_box && ex.words_box.length > 0) {
          const wbBorder = isEnCurr ? '#cbd5e1' : ((isArCurr || isBioCurr) ? '#86efac' : (isChemCurr ? '#a7f3d0' : (isSocCurr ? '#fde68a' : (isMathCurr ? '#d8b4fe' : '#7dd3fc'))));
          const wbTitleColor = isEnCurr ? 'var(--slate-700)' : (isBioCurr ? '#14532d' : (isChemCurr ? '#064e3b' : (isSocCurr ? '#78350f' : (isArCurr ? '#065f46' : (isMathCurr ? '#6b21a8' : '#0369a1')))));
          const wbTagBg = isEnCurr ? '#f1f5f9' : (isBioCurr ? '#f0fdf4' : (isChemCurr ? '#ecfdf5' : (isSocCurr ? '#fffbeb' : (isArCurr ? '#ecfdf5' : (isMathCurr ? '#faf5ff' : '#f0f9ff')))));
          const wbTagBorder = isEnCurr ? '#e2e8f0' : (isBioCurr ? '#86efac' : (isChemCurr ? '#a7f3d0' : (isSocCurr ? '#fde68a' : (isArCurr ? '#a7f3d0' : (isMathCurr ? '#d8b4fe' : '#bae6fd')))));
          const wbTagColor = isEnCurr ? '#0f172a' : (isBioCurr ? '#14532d' : (isChemCurr ? '#064e3b' : (isSocCurr ? '#78350f' : (isArCurr ? '#064e3b' : (isMathCurr ? '#581c87' : '#0c4a6e')))));

          wordsBoxHtml = `
            <div style="background: #ffffff; border: 1px dashed ${wbBorder}; border-radius: 8px; padding: 0.45rem 0.75rem; margin: 0.45rem 0; font-size: 0.84rem; display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;">
              <strong style="color: ${wbTitleColor};">📦 الكلمات / الخيارات المتاحة:</strong>
              ${ex.words_box.map(w => `<span style="background: ${wbTagBg}; border: 1px solid ${wbTagBorder}; padding: 0.18rem 0.5rem; border-radius: 5px; font-weight: 700; color: ${wbTagColor};">${w}</span>`).join('')}
            </div>
          `;
        }

        let qListHtml = '';
        if (ex.questions && ex.questions.length > 0) {
          qListHtml = ex.questions.map((qObj, qIdx) => {
            const isEnglishText = /[a-zA-Z]{3,}/.test(qObj.q) && isEnCurr;
            const qDir = isEnglishText ? 'ltr' : 'rtl';
            const qAlign = isEnglishText ? 'left' : 'right';
            const ansIsEnglish = /[a-zA-Z]{3,}/.test(qObj.a) && isEnCurr;
            const aDir = ansIsEnglish ? 'ltr' : 'rtl';
            const aAlign = ansIsEnglish ? 'left' : 'right';

            const solBorderColor = isEnCurr ? '#0d9488' : (isBioCurr ? '#16a34a' : (isChemCurr ? '#059669' : (isSocCurr ? '#b45309' : (isArCurr ? '#059669' : (isMathCurr ? '#7e22ce' : '#0284c7')))));
            const solBgColor = isEnCurr ? '#f0fdfa' : (isBioCurr ? '#f0fdf4' : (isChemCurr ? '#ecfdf5' : (isSocCurr ? '#fffdf5' : (isArCurr ? '#f0fdf4' : (isMathCurr ? '#fdf4ff' : '#f0f9ff')))));
            const solHeaderColor = isEnCurr ? '#0d9488' : (isBioCurr ? '#15803d' : (isChemCurr ? '#065f46' : (isSocCurr ? '#92400e' : (isArCurr ? '#059669' : (isMathCurr ? '#7e22ce' : '#0284c7')))));
            const solBodyColor = isEnCurr ? '#065f46' : (isBioCurr ? '#14532d' : (isChemCurr ? '#064e3b' : (isSocCurr ? '#78350f' : (isArCurr ? '#064e3b' : (isMathCurr ? '#701a75' : '#0c4a6e')))));

            return `
              <div style="margin-bottom: 0.75rem; padding-bottom: 0.6rem; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 700; color: var(--slate-900); font-size: 0.9rem; direction: ${qDir}; text-align: ${qAlign}; line-height: 1.6; white-space: pre-wrap;">
                  ${useMathFmt ? formatPhysicsMath(qObj.q) : qObj.q}
                </div>
                ${(qObj.options && qObj.options.length > 0) ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.35rem 0 0.2rem; font-size: 0.8rem; direction: ${qDir};">
                    ${qObj.options.map(opt => `<span style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.15rem 0.45rem; border-radius: 4px; color: var(--slate-700); font-weight: 600;">${useMathFmt ? formatPhysicsMath(opt) : opt}</span>`).join('')}
                  </div>
                ` : ''}
                ${qObj.q_ar ? `<div style="font-size: 0.76rem; color: var(--slate-500); margin-top: 0.15rem;">${qObj.q_ar}</div>` : ''}
                <div class="exam-model-answer-box hidden" id="sol_${exId}_${qIdx}" style="margin-top: 0.45rem; padding: 0.6rem 0.85rem; font-size: 0.85rem; border-left: 3.5px solid ${solBorderColor}; background: ${solBgColor}; border-radius: 6px;">
                  <div style="font-weight: 800; color: ${solHeaderColor}; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                    <span>✅</span> الحل النموذجي المعتمد والشرح:
                  </div>
                  <div style="direction: ${aDir}; text-align: ${aAlign}; font-weight: 600; color: ${solBodyColor}; white-space: pre-wrap; line-height: 1.7;">${useMathFmt ? formatPhysicsMath(qObj.a) : qObj.a}</div>
                </div>
              </div>
            `;
          }).join('');
        }

        const cardBorder = isEnCurr ? '#e2e8f0' : (isBioCurr ? '#86efac' : (isChemCurr ? '#a7f3d0' : (isSocCurr ? '#fde68a' : (isArCurr ? '#a7f3d0' : (isMathCurr ? '#e9d5ff' : '#bae6fd')))));
        const cardBadgeBg = isEnCurr ? '#ccfbf1' : (isBioCurr ? '#dcfce7' : (isChemCurr ? '#d1fae5' : (isSocCurr ? '#fef3c7' : (isArCurr ? '#ecfdf5' : (isMathCurr ? '#f3e8ff' : '#e0f2fe')))));
        const cardBadgeColor = isEnCurr ? '#0f766e' : (isBioCurr ? '#15803d' : (isChemCurr ? '#064e3b' : (isSocCurr ? '#92400e' : (isArCurr ? '#065f46' : (isMathCurr ? '#6b21a8' : '#0284c7')))));

        innerContentHtml += `
          <div class="activity-exercise-card" style="background: #ffffff; border: 1.5px solid ${cardBorder}; border-radius: 12px; padding: 0.95rem; margin-bottom: 0.85rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
              <div>
                <span class="badge" style="background: ${cardBadgeBg}; color: ${cardBadgeColor}; font-weight: 800; font-size: 0.76rem; padding: 0.2rem 0.55rem; border-radius: 5px;">${ex.num || `التمرين ${exIdx+1}`}</span>
                <h4 style="display: inline; font-size: 0.94rem; font-weight: 800; margin-right: 0.4rem; color: var(--slate-900);">${ex.title}</h4>
                ${ex.title_ar ? `<div style="font-size: 0.78rem; color: ${isBioCurr ? '#15803d' : (isChemCurr ? '#065f46' : (isSocCurr ? '#92400e' : (isArCurr ? '#059669' : (isMathCurr ? '#6b21a8' : 'var(--slate-500)'))))}; margin-top: 0.15rem; font-weight: 600;">${ex.title_ar}</div>` : ''}
              </div>
              <div style="display: flex; gap: 0.35rem; align-items: center;">
                <button class="exam-toggle-sol-btn" id="btn_sol_${exId}" onclick="toggleActivityCardSolutions('${exId}', ${ex.questions ? ex.questions.length : 0})" ${isBioCurr ? 'style="background: #f0fdf4; color: #15803d; border: 1px solid #86efac;"' : (isChemCurr ? 'style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;"' : (isSocCurr ? 'style="background: #fffbeb; color: #92400e; border: 1px solid #fde68a;"' : (isArCurr ? 'style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;"' : (isMathCurr ? 'style="background: #faf5ff; color: #6b21a8; border: 1px solid #d8b4fe;"' : ''))))}>
                  <span>👁️</span> إظهار الحل
                </button>
                ${isEnCurr ? `
                  <button class="mini-listen-btn" onclick="speakSnippet(\`${escapeForAttribute(ex.title + '. ' + (ex.questions || []).map(q => q.q).join(' '))}\`, 'en')">
                    🔊 استماع
                  </button>
                ` : ''}
              </div>
            </div>
            ${wordsBoxHtml}
            <div style="margin-top: 0.6rem;">
              ${qListHtml}
            </div>
          </div>
        `;
      });

      innerContentHtml += `</div>`;
    } else {
      innerContentHtml = `<div class="chunk-content-text" style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.85; color: var(--slate-800); direction: ${(isEnCurr && /[a-zA-Z]{2,}/.test(text)) ? 'ltr' : 'rtl'}; text-align: ${(isEnCurr && /[a-zA-Z]{2,}/.test(text)) ? 'left' : 'right'}; unicode-bidi: plaintext;">${formatTextHighlights(text)}</div>`;
    }

            let chunkDiagramHtml = '';
    if (ch.diagram_id) {
      let diag = null;
      if (window.BIOLOGY_DIAGRAMS) diag = window.BIOLOGY_DIAGRAMS.find(d => d.id === ch.diagram_id);
      if (!diag && window.CHEMISTRY_DIAGRAMS) diag = window.CHEMISTRY_DIAGRAMS.find(d => d.id === ch.diagram_id);
      if (!diag && window.MATH_DIAGRAMS) diag = window.MATH_DIAGRAMS.find(d => d.id === ch.diagram_id);
      if (diag) {
        const isBioDiag = (diag.id && diag.id.startsWith('diag_bio_')) || (appData.currentCurriculumId === 11);
        const isMathDiag = (diag.id && diag.id.startsWith('diag_math_')) || (appData.currentCurriculumId === 8);
        const borderCol = isMathDiag ? '#7e22ce' : (isBioDiag ? '#16a34a' : '#059669');
        const bgLight = isMathDiag ? '#faf5ff' : (isBioDiag ? '#f0fdf4' : '#ecfdf5');
        const textDark = isMathDiag ? '#581c87' : (isBioDiag ? '#166534' : '#065f46');
        const icon = isMathDiag ? '📐' : (isBioDiag ? '🧬' : '🧪');
        const diagTypeLabel = isMathDiag ? 'لوحة هندسية وبيانية معتمدة' : 'لوحة توضيحية علمية معتمدة';
        const diagExplainLabel = isMathDiag ? '💡 الشرح الهندسي المرافق للرسم: ' : '💡 الشرح العلمي المرافق للرسم: ';
        const openModalFn = isMathDiag ? `openMathDiagramModal('${diag.id}')` : (isBioDiag ? `openBiologyDiagramModal('${diag.id}')` : `openChemistryDiagramModal('${diag.id}')`);

        chunkDiagramHtml = `
          <div style="margin: 0.85rem 0; background: #ffffff; border: 2px solid ${borderCol}; border-radius: 12px; padding: 0.85rem; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.45rem;">
                <span style="font-size: 1.3rem;">${icon}</span>
                <div>
                  <strong style="color: #0f172a; font-size: 0.95rem;">${diag.title}</strong>
                  <div style="font-size: 0.72rem; color: ${textDark}; font-weight: 700;">${diagTypeLabel} • ${diag.category}</div>
                </div>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="${openModalFn}" style="font-size: 0.74rem; padding: 0.25rem 0.65rem; background: ${bgLight}; border: 1px solid ${borderCol}; color: ${textDark}; font-weight: 800;">
                🔍 تكبير وفحص اللوحة التوضيحية
              </button>
            </div>
            <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeForAttribute(diag.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${openModalFn};}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem; display: flex; justify-content: center; align-items: center; cursor: pointer;" onclick="${openModalFn}" title="انقر لتكبير وفحص اللوحة التوضيحية">
              <div style="width: 100%; max-width: 650px;">
                ${diag.svg}
              </div>
            </div>
            <div style="margin-top: 0.5rem; background: ${bgLight}; border-right: 4px solid ${borderCol}; padding: 0.45rem 0.75rem; border-radius: 6px; font-size: 0.82rem; color: ${textDark}; line-height: 1.5;">
              <strong>${diagExplainLabel}</strong>${diag.summary}
            </div>
          </div>
        `;
      }
    }

    const pageLabel = isActivity ? `كراس النشاط ص (${ch.activity_book_page || page})` : `كتاب الطالب ص (${page})`;
    const pageImgBtn = isActivity
      ? `<button class="mini-listen-btn" style="background: #0d9488; color: #ffffff; font-weight: 700;" onclick="openBookPageModal(${ch.activity_book_page || page}, \`${escapeForAttribute(activeLesson.title)}\`, 'activity')">📝 صورة صفحة النشاط (${ch.activity_book_page || page})</button>`
      : `<button class="mini-listen-btn" style="background: var(--slate-200); color: var(--slate-700);" onclick="openBookPageModal(${page}, \`${escapeForAttribute(activeLesson.title)}\`, 'student')">📖 صورة صفحة (${page})</button>`;

    box.innerHTML = `
      <div class="chunk-meta" ${isActivity ? 'style="background: #e6fffa; border-color: #b2f5ea;"' : ''}>
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <span>📌 ${heading.length > 50 ? heading.substring(0, 48) + '...' : heading} - ${pageLabel}</span>
          ${pageImgBtn}
        </div>
        ${isEnCurr ? `
          <button class="mini-listen-btn" onclick="speakSnippet(\`${escapeForAttribute(text)}\`, 'en')">
            🔊 قراءة هذا المقطع
          </button>
        ` : ''}
      </div>
      ${innerContentHtml}
      ${chunkDiagramHtml}
    `;
    chunksContainer.appendChild(box);
  });

  // بطاقة التحدي واختبار الفصل التفاعلي المباشر بنهاية الدرس - إعداد المهندس أسامة خليل هاشم
  if (activeChapter) {
    const quizBanner = document.createElement('div');
    quizBanner.style.cssText = 'margin-top: 2rem; background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 2px dashed #6366f1; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; box-shadow: var(--shadow-sm);';
    quizBanner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="width: 44px; height: 44px; border-radius: 10px; background: #4f46e5; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; font-weight: 800; flex-shrink: 0;">📝</div>
        <div>
          <div style="font-weight: 800; font-size: 0.95rem; color: #1e1b4b;">اختبر معلوماتك في "${activeChapter.title}"</div>
          <div style="font-size: 0.78rem; color: #4338ca; margin-top: 0.15rem;">اختبار تفاعلي وزاري شامل يضم 10 أسئلة مصممة وفق معايير الاختبارات الرسمية - إعداد المهندس أسامة خليل هاشم</div>
        </div>
      </div>
      <button type="button" class="btn btn-primary" style="background: #4f46e5; font-size: 0.85rem; padding: 0.6rem 1.25rem; font-weight: 800; border-radius: 8px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);" onclick="startChapterQuiz(${currId}, ${activeChapter.id})">
        🚀 خوض اختبار الفصل الآن (10 أسئلة)
      </button>
    `;
    chunksContainer.appendChild(quizBanner);
  }

  // القفز والوميض عند الانتقال من محرك البحث الشامل إلى مقطع محدد
  if (window._pendingSearchHighlight && String(window._pendingSearchHighlight.lessonId) === String(activeLesson.id)) {
    const targetChunkIdx = Number(window._pendingSearchHighlight.chunkIdx) || 0;
    window._pendingSearchHighlight = null;
    requestAnimationFrame(() => {
      const targetBox = document.getElementById(`chunk-box-${targetChunkIdx}`) || document.getElementById('chunk-box-0');
      if (targetBox) {
        targetBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetBox.classList.remove('search-target-flash');
        void targetBox.offsetWidth;
        targetBox.classList.add('search-target-flash');
        setTimeout(() => targetBox.classList.remove('search-target-flash'), 2200);
      }
    });
  }

  const studyTab = document.getElementById('tab-study');
  if (studyTab && !studyTab.classList.contains('hidden') && window.A11yManager && typeof window.A11yManager.announce === 'function') {
    window.A11yManager.announce(`تم تحميل الدرس: ${activeLesson.title}`);
  }
}

// ----------------------------------------------------
// إدارة المعرض البصري وقارئ المكتبة الرقمية وتصفح الكتب المدرسية
// ----------------------------------------------------
let currentBookZoom = 1;
let currentPageAudioText = '';
let currentModalBookCurrId = 3;
let currentModalEnglishBookType = 'student'; // 'student' or 'activity'
let currentModalBookPage = 1;

function bindBookModalSwipe() {
  const wrapper = document.getElementById('bookPageImgWrapper');
  if (!wrapper || wrapper.dataset.swipeBound === '1') return;
  wrapper.dataset.swipeBound = '1';
  let startX = 0;
  let startY = 0;
  wrapper.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  wrapper.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;
    if (currentBookZoom > 1.05) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 70 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) navModalBookPage(1);
      else navModalBookPage(-1);
    }
  }, { passive: true });
}

// دالة مساعدة لتحديد إجمالي صفحات الكتاب المعتمد بدقة
function getCurriculumMaxPages(currId, bookType = 'student') {
  const id = Number(currId);
  if (id === 3) return (bookType === 'activity' ? 127 : 120);
  if (id === 4 || id === 5) return 136;
  if (id === 6) return 120;
  if (id === 7) return 88;
  if (id === 8) return 196;
  if (id === 9) return 140;
  if (id === 10) return 96;
  if (id === 11) return 92;
  return 100;
}

// فتح المكتبة الرقمية العامة وتصفح صفحات الكتب المدرسية المعتمدة
function openDigitalLibraryReader(currId = 3, pageNum = 4, bookType = 'student') {
  currentModalBookCurrId = Number(currId) || 3;
  currentModalEnglishBookType = bookType || 'student';
  currentModalBookPage = Number(pageNum) || 1;
  bindBookModalSwipe();
  renderDigitalLibraryPage();
  const modal = document.getElementById('bookPageModal');
  if (modal) modal.classList.remove('hidden');
}

function switchEnglishBookType(type) {
  if (audioPlayer.isPlaying) audioPlayer.stop();
  currentModalEnglishBookType = type;
  currentModalBookPage = 1;
  renderDigitalLibraryPage();
}

function switchModalBookCurr(currId) {
  if (audioPlayer.isPlaying) audioPlayer.stop();
  currentModalBookCurrId = Number(currId);
  currentModalBookPage = 1;
  renderDigitalLibraryPage();
}

function navModalBookPage(delta) {
  if (audioPlayer.isPlaying) audioPlayer.stop();
  const maxPages = getCurriculumMaxPages(currentModalBookCurrId, currentModalEnglishBookType);
  let nextP = currentModalBookPage + delta;
  if (nextP < 1) nextP = 1;
  if (nextP > maxPages) nextP = maxPages;
  currentModalBookPage = nextP;
  renderDigitalLibraryPage();
}

function goToModalBookPage(p) {
  if (audioPlayer.isPlaying) audioPlayer.stop();
  const maxPages = getCurriculumMaxPages(currentModalBookCurrId, currentModalEnglishBookType);
  let targetP = Number(p);
  if (isNaN(targetP) || targetP < 1) targetP = 1;
  if (targetP > maxPages) targetP = maxPages;
  currentModalBookPage = targetP;
  renderDigitalLibraryPage();
}

function renderDigitalLibraryPage(lessonTitle = '') {
  bindBookModalSwipe();
  const modal = document.getElementById('bookPageModal');
  const img = document.getElementById('bookPageModalImg');
  const title = document.getElementById('bookPageModalTitle');
  const subtitle = document.getElementById('bookPageModalSubtitle');
  const currSelect = document.getElementById('modalBookCurrSelect');
  const pageSelect = document.getElementById('modalBookPageSelect');
  const totalLbl = document.getElementById('modalBookTotalPagesLbl');

  if (!modal || !img) return;

  const currId = currentModalBookCurrId;
  const pageNum = currentModalBookPage;
  const isEn = (currId === 3);
  const isActivity = isEn && (currentModalEnglishBookType === 'activity');
  const isP1 = currId === 4;
  const isP2 = currId === 5;
  const isIslamic = currId === 6;
  const isPhysics = currId === 7;
  const isMath = currId === 8;
  const isSocial = currId === 9;
  const isChemistry = currId === 10;
  const isBiology = currId === 11;

  let folder = '';
  let bookName = isActivity ? 'كراس النشاط (Activity Book)' : 'كتاب اللغة الإنجليزية (Student\'s Book)';
  let maxPages = isActivity ? 127 : 120;

  if (isActivity) {
    folder = 'english_activity/';
  } else if (isP1) {
    folder = 'arabic_p1/';
    bookName = 'كتاب اللغة العربية (الجزء الأول)';
    maxPages = 136;
  } else if (isP2) {
    folder = 'arabic_p2/';
    bookName = 'كتاب اللغة العربية (الجزء الثاني)';
    maxPages = 136;
  } else if (isIslamic) {
    folder = 'islamic/';
    bookName = 'كتاب التربية الإسلامية';
    maxPages = 120;
  } else if (isPhysics) {
    folder = 'physics/';
    bookName = 'كتاب الفيزياء (الصف الثاني المتوسط)';
    maxPages = 88;
  } else if (isMath) {
    folder = 'math/';
    bookName = 'كتاب الرياضيات الموحد (الصف الثاني المتوسط)';
    maxPages = 196;
  } else if (isSocial) {
    folder = 'social/';
    bookName = 'كتاب الاجتماعيات (الصف الثاني المتوسط)';
    maxPages = 140;
  } else if (isChemistry) {
    folder = 'chemistry/';
    bookName = 'كتاب الكيمياء (الصف الثاني المتوسط)';
    maxPages = 96;
  } else if (isBiology) {
    folder = 'biology/';
    bookName = 'كتاب علم الأحياء (الصف الثاني المتوسط)';
    maxPages = 92;
  }

  // محول نمط الكتاب للمنهج الإنجليزي (كتاب الطالب مقابل كراس النشاط)
  const engTypeWrapper = document.getElementById('modalEnglishBookTypeWrapper');
  if (engTypeWrapper) {
    engTypeWrapper.style.display = isEn ? 'inline-flex' : 'none';
    const btnSb = document.getElementById('modalBtnStudentBook');
    const btnAb = document.getElementById('modalBtnActivityBook');
    if (btnSb && btnAb) {
      if (isActivity) {
        btnAb.style.background = '#0d9488';
        btnAb.style.color = '#ffffff';
        btnAb.style.border = '1px solid #0f766e';
        btnSb.style.background = '#ffffff';
        btnSb.style.color = 'var(--slate-700)';
        btnSb.style.border = '1px solid var(--slate-300)';
      } else {
        btnSb.style.background = 'var(--primary)';
        btnSb.style.color = '#ffffff';
        btnSb.style.border = '1px solid var(--primary-dark)';
        btnAb.style.background = '#ffffff';
        btnAb.style.color = 'var(--slate-700)';
        btnAb.style.border = '1px solid var(--slate-300)';
      }
    }
  }

  if (title) title.innerText = `📖 المكتبة الرقمية: ${bookName}`;
  if (subtitle) {
    subtitle.innerText = lessonTitle 
      ? `صفحة (${pageNum} من ${maxPages}) • ${lessonTitle} - إعداد المهندس أسامة خليل هاشم`
      : `صفحة (${pageNum} من ${maxPages}) • المنهج المعتمد لوزارة التربية - إعداد المهندس أسامة خليل هاشم`;
  }

  const missingNotice = document.getElementById('bookPageMissingNotice');
  const missingTitle = document.getElementById('bookPageMissingTitle');
  const missingDesc = document.getElementById('bookPageMissingDesc');
  const missingActions = document.getElementById('bookPageMissingActions');

  if (missingNotice) missingNotice.classList.add('hidden');
  img.style.display = 'block';
  img.onerror = function() {
    img.style.display = 'none';
    if (missingNotice) {
      if (missingTitle) missingTitle.innerText = `تعذر عرض صفحة الكتاب (ص ${pageNum})`;
      if (missingDesc) missingDesc.innerText = 'تأكد من الاتصال بالإنترنت عند فتح الصفحة لأول مرة ليتم تخزينها محلياً، أو انتقل لقاعة المذاكرة لقراءة النص الكامل.';
      if (missingActions) {
        missingActions.innerHTML = `
          <button type="button" class="btn btn-primary btn-sm" onclick="closeBookPageModal(); selectCurriculumForStudy(${currId}); scrollToStudyContent();">📚 الانتقال لقاعة المذاكرة</button>
        `;
      }
      missingNotice.classList.remove('hidden');
    }
  };
  img.src = `book_images/${folder}page_${pageNum}.jpeg`;
  resetBookPageZoom();

  if (currSelect) currSelect.value = currId;
  if (totalLbl) totalLbl.innerText = `/ ${maxPages}`;

  if (pageSelect) {
    let optHtml = '';
    for (let p = 1; p <= maxPages; p++) {
      optHtml += `<option value="${p}" ${p === pageNum ? 'selected' : ''}>صفحة ${p}</option>`;
    }
    pageSelect.innerHTML = optHtml;
  }

  // جمع نص الصفحة للاستماع الصوتي (حصراً للمنهج الإنجليزي)
  const listenBtn = document.getElementById('bookPageModalListenBtn');
  const stopBtn = document.getElementById('bookPageModalStopBtn');
  const statusBanner = document.getElementById('bookPageAudioStatusBanner');

  if (!isEn) {
    if (listenBtn) listenBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusBanner) statusBanner.style.display = 'none';
    if (audioPlayer.isPlaying) audioPlayer.stop();
    currentPageAudioText = '';
  } else {
    if (listenBtn) listenBtn.style.display = 'inline-flex';
    if (CurriculumLoader.isCurriculumLoaded(3)) {
      currentPageAudioText = extractEnglishBookPageAudioText(pageNum);
    } else {
      currentPageAudioText = '';
      CurriculumLoader.ensureCurriculumLoaded(3, { silent: true }).then((ok) => {
        if (ok && currentModalBookCurrId === 3 && currentModalBookPage === pageNum) {
          currentPageAudioText = extractEnglishBookPageAudioText(pageNum);
        }
      });
    }
    updateBookPageAudioUI(audioPlayer.isPlaying);
  }
}

function extractEnglishBookPageAudioText(pageNum) {
  let pageText = '';
  const currObj = (appData.curriculums || []).find(c => c.id === 3) || { id: 3 };
  const activeChapters = getCurriculumChapters(currObj);
  for (const ch of activeChapters) {
    for (const l of (ch.lessons || [ch])) {
      if (l.chunks) {
        const pageChunks = l.chunks.filter(c => (c.page_number || c.page) === pageNum);
        if (pageChunks.length > 0) {
          pageText = pageChunks.map(c => c.content_text || c.text || '').join('\n');
          break;
        }
      }
    }
    if (pageText) break;
  }
  return pageText;
}

function openBookPageModal(pageNum, lessonTitle, bookType = 'student', customCurrId = null) {
  currentModalBookCurrId = customCurrId || appData.currentCurriculumId || 3;
  currentModalEnglishBookType = bookType || 'student';
  currentModalBookPage = Number(pageNum) || 1;
  renderDigitalLibraryPage(lessonTitle);
  const modal = document.getElementById('bookPageModal');
  if (modal) modal.classList.remove('hidden');
}


// دوال إظهار وإخفاء الحلول النموذجية لتمارين كراس النشاط
function toggleActivityCardSolutions(exId, count) {
  let anyHidden = false;
  for (let i = 0; i < count; i++) {
    const box = document.getElementById(`sol_${exId}_${i}`);
    if (box && box.classList.contains('hidden')) {
      anyHidden = true;
      break;
    }
  }
  for (let i = 0; i < count; i++) {
    const box = document.getElementById(`sol_${exId}_${i}`);
    if (box) {
      if (anyHidden) box.classList.remove('hidden');
      else box.classList.add('hidden');
    }
  }
  const btn = document.getElementById(`btn_sol_${exId}`);
  if (btn) {
    btn.innerHTML = anyHidden 
      ? '<span>🙈</span> إخفاء الحل' 
      : '<span>👁️</span> إظهار الحل';
  }
}

function toggleAllActivitySolutions(chunkIdx) {
  const container = document.getElementById(`activityExercisesList_${chunkIdx}`);
  if (!container) return;
  const solBoxes = container.querySelectorAll('.exam-model-answer-box, .activity-solution-block, .exercise-solution-box');
  let anyHidden = false;
  solBoxes.forEach(b => { if (b.classList.contains('hidden')) anyHidden = true; });
  solBoxes.forEach(b => {
    if (anyHidden) b.classList.remove('hidden');
    else b.classList.add('hidden');
  });
  const toggleBtns = container.querySelectorAll('.exam-toggle-sol-btn, .math-toggle-sol-btn, [id^="btn_sol_"]');
  toggleBtns.forEach(btn => {
    btn.innerHTML = anyHidden 
      ? '<span>🙈</span> إخفاء الحل' 
      : '<span>👁️</span> إظهار الحل';
  });
}

function toggleAllReviewSolutionsInPage() {
  const container = document.getElementById('lessonChunksContainer');
  if (!container) return;
  const solBoxes = container.querySelectorAll('.exam-model-answer-box');
  let anyHidden = false;
  solBoxes.forEach(b => { if (b.classList.contains('hidden')) anyHidden = true; });
  solBoxes.forEach(b => {
    if (anyHidden) b.classList.remove('hidden');
    else b.classList.add('hidden');
  });
  const toggleBtns = container.querySelectorAll('.exam-toggle-sol-btn');
  toggleBtns.forEach(btn => {
    btn.innerHTML = anyHidden 
      ? '<span>🙈</span> إخفاء الحل' 
      : '<span>👁️</span> إظهار الحل';
  });
  const topBtn = document.getElementById('toggleAllChunkReviewSolsBtn');
  if (topBtn) {
    topBtn.innerText = anyHidden ? '🙈 إخفاء كافة الحلول النموذجية' : '🎯 إظهار كافة الحلول النموذجية';
  }
}

function updateBookPageAudioUI(isPlaying) {
  const listenBtn = document.getElementById('bookPageModalListenBtn');
  const stopBtn = document.getElementById('bookPageModalStopBtn');
  const statusBanner = document.getElementById('bookPageAudioStatusBanner');

  if (!listenBtn) return;

  const isEn = (currentModalBookCurrId === 3);
  if (!isEn) {
    listenBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusBanner) statusBanner.style.display = 'none';
    return;
  }

  if (isPlaying) {
    if (audioPlayer.isPaused) {
      listenBtn.innerHTML = '<span>▶️</span> استئناف القراءة';
      listenBtn.style.background = '#0284c7';
      listenBtn.style.borderColor = '#0369a1';
    } else {
      listenBtn.innerHTML = '<span>⏸️</span> إيقاف مؤقت';
      listenBtn.style.background = '#d97706';
      listenBtn.style.borderColor = '#b45309';
    }
    if (stopBtn) stopBtn.style.display = 'inline-flex';
    if (statusBanner) statusBanner.style.display = 'flex';
  } else {
    listenBtn.innerHTML = '<span>🔊</span> استماع لصفحة الكتاب';
    listenBtn.style.background = '';
    listenBtn.style.borderColor = '';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusBanner) statusBanner.style.display = 'none';
  }
}

async function toggleBookPageAudio() {
  if (currentModalBookCurrId !== 3) return;
  if (audioPlayer.isPlaying && !audioPlayer.isPaused) {
    audioPlayer.pause();
  } else if (audioPlayer.isPaused) {
    audioPlayer.resume();
  } else {
    if (!CurriculumLoader.isCurriculumLoaded(3)) {
      await CurriculumLoader.ensureCurriculumLoaded(3);
      currentPageAudioText = extractEnglishBookPageAudioText(currentModalBookPage);
    } else if (!currentPageAudioText) {
      currentPageAudioText = extractEnglishBookPageAudioText(currentModalBookPage);
    }
    if (currentPageAudioText && currentPageAudioText.trim()) {
      audioPlayer.stop();
      const curr = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId);
      const isEn = curr ? (curr.id === 3 || curr.subject === 'English') : /[a-zA-Z]{3,}/.test(currentPageAudioText);
      audioPlayer.speakSmart(currentPageAudioText, isEn ? 'en' : 'ar', () => {
        updateBookPageAudioUI(false);
      });
      updateBookPageAudioUI(true);
    } else {
      alert('تنبيه: لم يتم العثور على نص مسجل لهذه الصفحة في المنهج.');
    }
  }
}

function stopBookPageAudio() {
  audioPlayer.stop();
  updateBookPageAudioUI(false);
}

function closeBookPageModal() {
  if (audioPlayer.isPlaying) {
    audioPlayer.stop();
  }
  updateBookPageAudioUI(false);
  const modal = document.getElementById('bookPageModal');
  if (modal) modal.classList.add('hidden');
}

function zoomBookPage(delta) {
  currentBookZoom = Math.max(0.6, Math.min(2.5, currentBookZoom + delta));
  const img = document.getElementById('bookPageModalImg');
  if (img) img.style.transform = `scale(${currentBookZoom})`;
}


function resetBookPageZoom() {
  currentBookZoom = 1;
  const img = document.getElementById('bookPageModalImg');
  if (img) img.style.transform = `scale(1)`;
}

function toggleMediaSection(secId, childId) {
  const el = document.getElementById(secId);
  const btn = document.getElementById('toggleVisualBtn');
  if (el) {
    if (childId) {
      el.style.display = 'block';
      const childEl = document.getElementById(childId);
      if (childEl) {
        childEl.style.display = 'block';
        childEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (btn) btn.innerHTML = '<span>🔼</span> إخفاء المعرض البصري';
      return;
    }
    const isHidden = (el.style.display === 'none' || !el.style.display);
    el.style.display = isHidden ? 'block' : 'none';
    if (btn) {
      btn.innerHTML = isHidden ? '<span>🔼</span> إخفاء المعرض البصري' : '<span>🎨</span> المعرض البصري والمفاهيم';
    }
    if (isHidden) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function toggleFocusMode() {
  const studyLayout = document.querySelector('.study-layout');
  const btn = document.getElementById('focusModeBtn');
  if (!studyLayout) return;
  studyLayout.classList.toggle('focus-mode');
  const isFocused = studyLayout.classList.contains('focus-mode');
  if (btn) {
    btn.innerHTML = isFocused ? '<span>🔙</span> إلغاء التركيز' : '<span>👁️</span> وضع التركيز (ملء الشاشة)';
    btn.setAttribute('aria-pressed', isFocused ? 'true' : 'false');
  }
}

function toggleAiChatPanel(forceState) {
  if (window.innerWidth <= 1100 && typeof toggleMobileStudyDrawer === 'function') {
    toggleMobileStudyDrawer('ai', forceState);
    return;
  }

  const studyLayout = document.querySelector('.study-layout');
  const panel = document.getElementById('aiChatPanel');
  const btn = document.getElementById('toggleAiPanelBtn');
  if (!studyLayout || !panel) return;

  const isCurrentlyHidden = studyLayout.classList.contains('hide-ai-panel') || panel.style.display === 'none';
  const shouldShow = (typeof forceState === 'boolean') ? forceState : isCurrentlyHidden;

  if (shouldShow) {
    studyLayout.classList.remove('hide-ai-panel');
    panel.style.display = 'flex';
    if (btn) {
      btn.innerHTML = '<span>💬</span> إخفاء المعلم الذكي';
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
    lsSet('show_ai_chat_panel', 'true');
  } else {
    studyLayout.classList.add('hide-ai-panel');
    panel.style.display = 'none';
    if (btn) {
      btn.innerHTML = '<span>💬</span> المعلم الذكي';
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
    lsSet('show_ai_chat_panel', 'false');
  }
}

function initAiChatPanelState() {
  const saved = lsGet('show_ai_chat_panel', 'show_ai_chat_panel');
  const btn = document.getElementById('toggleAiPanelBtn');
  if (window.innerWidth <= 1100) {
    if (btn) btn.setAttribute('aria-expanded', 'false');
    return;
  }
  if (saved === 'false') {
    toggleAiChatPanel(false);
  } else {
    if (btn) {
      btn.innerHTML = '<span>💬</span> إخفاء المعلم الذكي';
      btn.setAttribute('aria-expanded', 'true');
    }
  }
}

function renderLessonMediaGallery(lesson, chapter, chunks) {
  const container = document.getElementById('lessonMediaVisualContainer');
  if (!container) return;

  const curr = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || {};
  const isP1 = curr.id === 4 || curr.image_folder === 'arabic_p1';
  const isP2 = curr.id === 5 || curr.image_folder === 'arabic_p2';
  const isIslamic = curr.id === 6 || curr.image_folder === 'islamic';
  const isPhysics = curr.id === 7 || curr.image_folder === 'physics';
  const isMath = curr.id === 8 || curr.image_folder === 'math';
  const isSocial = curr.id === 9 || curr.image_folder === 'social';
  const isChemistry = curr.id === 10 || curr.image_folder === 'chemistry';
  const isBiology = curr.id === 11 || curr.image_folder === 'biology';
  let imgFolder = '';
  let bookLabel = 'كتاب الطالب المعتمد';
  if (isP1) { imgFolder = 'arabic_p1/'; bookLabel = 'كتاب العربية (الجزء الأول)'; }
  else if (isP2) { imgFolder = 'arabic_p2/'; bookLabel = 'كتاب العربية (الجزء الثاني)'; }
  else if (isIslamic) { imgFolder = 'islamic/'; bookLabel = 'كتاب التربية الإسلامية'; }
  else if (isPhysics) { imgFolder = 'physics/'; bookLabel = 'كتاب الفيزياء'; }
  else if (isMath) { imgFolder = 'math/'; bookLabel = 'كتاب الرياضيات المعتمد'; }
  else if (isSocial) { imgFolder = 'social/'; bookLabel = 'كتاب الاجتماعيات'; }
  else if (isChemistry) { imgFolder = 'chemistry/'; bookLabel = 'كتاب الكيمياء'; }
  else if (isBiology) { imgFolder = 'biology/'; bookLabel = 'كتاب علم الأحياء المعتمد (الصور والرسوم الأصلية)'; }

  const rawPages = (chunks || []).map(ch => ch.page_number || ch.page || 1);
  const pages = [...new Set(rawPages)];
  const mathDiagramsList = (isMath && window.getMathDiagramsForLesson) ? window.getMathDiagramsForLesson(lesson.id) : [];
  const cardData = (window.TOPIC_CARDS && window.TOPIC_CARDS[lesson.id]) ? window.TOPIC_CARDS[lesson.id] : 
                   (window.ARABIC_TOPIC_CARDS && window.ARABIC_TOPIC_CARDS[lesson.id] ? window.ARABIC_TOPIC_CARDS[lesson.id] : 
                   (window.ISLAMIC_TOPIC_CARDS && window.ISLAMIC_TOPIC_CARDS[lesson.id] ? window.ISLAMIC_TOPIC_CARDS[lesson.id] : 
                   (window.PHYSICS_TOPIC_CARDS && window.PHYSICS_TOPIC_CARDS[lesson.id] ? window.PHYSICS_TOPIC_CARDS[lesson.id] : 
                   (window.SOCIAL_TOPIC_CARDS && window.SOCIAL_TOPIC_CARDS[lesson.id] ? window.SOCIAL_TOPIC_CARDS[lesson.id] : null))));

  // بالنسبة لمنهج علم الأحياء يُعرض المعرض التوضيحي افتراضياً لأهمية الرسوم البصرية
  container.style.display = isBiology ? 'block' : 'none';

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.15rem;">🎨</span>
        <span style="font-weight: 800; font-size: 0.92rem; color: var(--slate-800);">المعرض البصري التوضيحي للدرس</span>
      </div>
      <div style="display: flex; gap: 0.35rem; align-items: center;">
        <span style="font-size: 0.72rem; color: var(--slate-500); margin-left: 0.25rem;">إعداد م. أسامة خليل هاشم</span>
        <button class="btn btn-secondary btn-sm" onclick="toggleMediaSection('bookPagesSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem;">
          📖 صور الكتاب (${pages.join(', ')})
        </button>
        ${cardData ? `
          <button class="btn btn-primary btn-sm" onclick="toggleMediaSection('topicCardSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: ${cardData.themeColor || 'var(--primary)'};">
            ✨ بطاقة المفهوم المصورة
          </button>
        ` : ''}
        ${(isPhysics && window.getPhysicsDiagram && window.getPhysicsDiagram(lesson.id)) ? `
          <button class="btn btn-sm" onclick="toggleMediaSection('physicsDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #0284c7; color: #ffffff; font-weight: 700;">
            🔬 الرسم التوضيحي
          </button>
        ` : ''}
        ${(isMath && mathDiagramsList.length > 0) ? `
          <button class="btn btn-sm" onclick="toggleMediaSection('mathDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #7e22ce; color: #ffffff; font-weight: 700;">
            📐 الرسوم الهندسية
          </button>
        ` : ''}
        ${(isChemistry && window.getChemistryDiagramsForLesson && window.getChemistryDiagramsForLesson(lesson.id).length > 0) ? `
          <button class="btn btn-sm" onclick="toggleMediaSection('chemistryDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #059669; color: #ffffff; font-weight: 700;">
            🧪 الرسوم التوضيحية
          </button>
        ` : ''}
        ${(isBiology && window.getBiologyDiagram && window.getBiologyDiagram(lesson.id)) ? `
          <button class="btn btn-sm" onclick="toggleMediaSection('biologyDiagramSec')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #16a34a; color: #ffffff; font-weight: 700;">
            🧬 الرسوم التوضيحية
          </button>
        ` : ''}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 0.75rem;">
  `;

  // 1. بطاقات صفحات الكتاب الأصلية
  pages.forEach((p, idx) => {
    html += `
      <div ${idx === 0 ? 'id="bookPagesSec"' : ''} class="book-pages-media-card" style="background: white; border: 1px solid var(--slate-200); border-radius: 10px; padding: 0.6rem; display: flex; gap: 0.75rem; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="width: 72px; height: 98px; border-radius: 6px; overflow: hidden; background: #e2e8f0; flex-shrink: 0; cursor: default; border: 1px solid var(--slate-300);">
          <img src="book_images/${imgFolder}page_${p}.jpeg" alt="صفحة ${p}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" onerror="this.onerror=null; this.src='icons/icon-192.png'">
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
            <span class="badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.7rem; font-weight: 700;">صفحة ${p}</span>
            <span style="font-size: 0.72rem; color: var(--slate-500);">${bookLabel}</span>
          </div>
          <p style="font-size: 0.78rem; font-weight: 700; color: var(--slate-800); margin: 0 0 0.45rem 0; line-height: 1.3;">${lesson.title}</p>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openBookPageModal(${p}, \`${escapeForAttribute(lesson.title)}\`, 'student')" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; width: 100%;">
            🔍 تكبير ومطالعة الصفحة
          </button>
        </div>
      </div>
    `;
  });

  // 1.2. بطاقات صفحات كراس النشاط (Activity Book Pages)
  if (curr.id === 3 && lesson.activity_book_pages && lesson.activity_book_pages.length > 0) {
    lesson.activity_book_pages.forEach((abP, abIdx) => {
      html += `
        <div ${abIdx === 0 ? 'id="activityBookPagesSec"' : ''} class="activity-book-media-card" style="background: #f0fdfa; border: 1.5px solid #99f6e4; border-radius: 10px; padding: 0.6rem; display: flex; gap: 0.75rem; align-items: center; box-shadow: 0 1px 3px rgba(13,148,136,0.06);">
          <div style="width: 72px; height: 98px; border-radius: 6px; overflow: hidden; background: #e2e8f0; flex-shrink: 0; cursor: default; border: 1px solid #5eead4;">
            <img src="book_images/english_activity/page_${abP}.jpeg" alt="كراس النشاط ص ${abP}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" onerror="this.onerror=null; this.src='icons/icon-192.png'">
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
              <span class="badge" style="background: #ccfbf1; color: #0f766e; font-size: 0.7rem; font-weight: 800;">كراس النشاط ص ${abP}</span>
              <span style="font-size: 0.72rem; color: #0d9488; font-weight: 700;">Activity Book</span>
            </div>
            <p style="font-size: 0.78rem; font-weight: 700; color: var(--slate-800); margin: 0 0 0.45rem 0; line-height: 1.3;">تمارين وتطبيقات الدرس</p>
            <button type="button" class="btn btn-sm" onclick="openBookPageModal(${abP}, \`${escapeForAttribute(lesson.title)}\`, 'activity')" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; width: 100%; background: #0d9488; color: #ffffff; border: none; font-weight: 700; border-radius: 6px;">
              🔍 تكبير ومطالعة النشاط
            </button>
          </div>
        </div>
      `;
    });
  }

  // 1.5. الرسوم التوضيحية واللوحات الفيزيائية المعتمدة (Physics Visual Diagrams)
  const physDiagram = (isPhysics && window.getPhysicsDiagram) ? window.getPhysicsDiagram(lesson.id) : null;
  if (physDiagram) {
    html += `
      <div id="physicsDiagramSec" style="background: white; border: 2px solid #0284c7; border-radius: 12px; padding: 0.85rem; box-shadow: 0 4px 12px rgba(2,132,199,0.08); grid-column: 1 / -1; margin-bottom: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;">🔬</span>
            <div>
              <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a;">${physDiagram.title}</h4>
              <span style="font-size: 0.72rem; color: #0284c7; font-weight: 700;">لوحة توضيحية علمية معتمدة • ${physDiagram.category}</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.7rem; font-weight: 800;">
              رسم فيزيائي دقيق
            </span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="openPhysicsDiagramModal('${physDiagram.id}')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #f0f9ff; border: 1px solid #bae6fd; color: #0284c7; font-weight: 700;">
              🔍 تكبير وفحص الرسم
            </button>
          </div>
        </div>

        <!-- SVG Container -->
        <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeForAttribute(physDiagram.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openPhysicsDiagramModal('${physDiagram.id}');}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0.4rem;" onclick="openPhysicsDiagramModal('${physDiagram.id}')" title="انقر لتكبير وفحص الرسم التوضيحي">
          <div style="width: 100%; max-width: 680px;">
            ${physDiagram.svg}
          </div>
        </div>

        <!-- Summary & Formula -->
        <div style="background: #f0fdf4; border-right: 4px solid #10b981; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.82rem; color: #065f46; margin-bottom: 0.5rem; line-height: 1.5;">
          <strong>💡 الشرح العلمي: </strong>${physDiagram.summary}
        </div>

        ${physDiagram.formula ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.85rem;">📐</span>
            <span style="font-size: 0.82rem; font-weight: 800; color: #1d4ed8;">القانون الرياضي: ${physDiagram.formula}</span>
          </div>
        ` : ''}

        <!-- Takeaway Points -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.4rem;">
          ${(physDiagram.keyPoints || []).map(pt => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.76rem; color: #334155; line-height: 1.4;">
              <span style="color: #0284c7; font-weight: 800;">•</span> ${pt}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 1.7. الرسوم التوضيحية واللوحات البيولوجية المعتمدة (Biology Visual Diagrams)
  const bioDiagramsList = (isBiology && window.getBiologyDiagramsForLesson) ? window.getBiologyDiagramsForLesson(lesson.id) : 
                         ((isBiology && window.getBiologyDiagram && window.getBiologyDiagram(lesson.id)) ? [window.getBiologyDiagram(lesson.id)] : []);
  if (bioDiagramsList.length > 0) {
    bioDiagramsList.forEach((bioDiagram, bioIdx) => {
      html += `
        <div ${bioIdx === 0 ? 'id="biologyDiagramSec"' : ''} class="biology-diagram-media-card" style="background: white; border: 2px solid #16a34a; border-radius: 12px; padding: 0.85rem; box-shadow: 0 4px 12px rgba(22,163,74,0.1); margin-bottom: 1rem; grid-column: 1 / -1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem; border-bottom: 1px solid #dcfce7; padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.4rem;">🧬</span>
              <div>
                <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a;">${bioDiagram.title}</h4>
                <span style="font-size: 0.72rem; color: #15803d; font-weight: 700;">لوحة توضيحية علمية معتمدة • ${bioDiagram.category}</span>
              </div>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.68rem; background: #dcfce7; color: #166534; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">رسم متجهي دقيق</span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="openBiologyDiagramModal('${bioDiagram.id}')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #f0fdf4; border: 1px solid #86efac; color: #166534; font-weight: 700;">
                🔍 تكبير وفحص الرسم
              </button>
            </div>
          </div>

          <!-- SVG Container -->
          <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeForAttribute(bioDiagram.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openBiologyDiagramModal('${bioDiagram.id}');}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0.4rem;" onclick="openBiologyDiagramModal('${bioDiagram.id}')" title="انقر لتكبير وفحص الرسم التوضيحي">
            <div style="width: 100%; max-width: 680px;">
              ${bioDiagram.svg}
            </div>
          </div>

          <!-- Summary & Formula -->
          <div style="background: #f0fdf4; border-right: 4px solid #16a34a; padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.8rem; color: #14532d; margin-top: 0.5rem; margin-bottom: 0.5rem; line-height: 1.5;">
            <strong>💡 الشرح العلمي: </strong>${bioDiagram.summary}
          </div>

          ${bioDiagram.formula ? `
            <div style="background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1rem;">🔬</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #0e7490;">المعادلة / القاعدة الحيوية: ${bioDiagram.formula}</span>
            </div>
          ` : ''}

          <!-- Takeaway Points -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.4rem;">
            ${(bioDiagram.keyPoints || []).map(pt => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.74rem; color: #334155; line-height: 1.4;">
                <span style="color: #16a34a; font-weight: 800;">✔️</span> ${pt}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // 1.6. الرسوم التوضيحية واللوحات الكيميائية المعتمدة (Chemistry Visual Diagrams)
  const chemDiagramsList = (isChemistry && window.getChemistryDiagramsForLesson) ? window.getChemistryDiagramsForLesson(lesson.id) :
                           ((isChemistry && window.getChemistryDiagram && window.getChemistryDiagram(lesson.id)) ? [window.getChemistryDiagram(lesson.id)] : []);
  if (chemDiagramsList.length > 0) {
    chemDiagramsList.forEach((chemDiagram, chemIdx) => {
      html += `
      <div ${chemIdx === 0 ? 'id="chemistryDiagramSec"' : ''} class="chemistry-diagram-media-card" style="background: white; border: 2px solid #059669; border-radius: 12px; padding: 0.85rem; box-shadow: 0 4px 12px rgba(5,150,105,0.08); grid-column: 1 / -1; margin-bottom: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;">🧪</span>
            <div>
              <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a;">${chemDiagram.title}</h4>
              <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">لوحة توضيحية علمية معتمدة • ${chemDiagram.category}</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 800;">
              رسم كيميائي متجهي دقيق
            </span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="openChemistryDiagramModal('${chemDiagram.id}')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-weight: 700;">
              🔍 تكبير وفحص الرسم
            </button>
          </div>
        </div>

        <!-- SVG Container -->
        <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeForAttribute(chemDiagram.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openChemistryDiagramModal('${chemDiagram.id}');}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0.4rem;" onclick="openChemistryDiagramModal('${chemDiagram.id}')" title="انقر لتكبير وفحص الرسم التوضيحي">
          <div style="width: 100%; max-width: 680px;">
            ${chemDiagram.svg}
          </div>
        </div>

        <!-- Summary & Formula -->
        <div style="background: #f0fdf4; border-right: 4px solid #10b981; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.82rem; color: #065f46; margin-bottom: 0.5rem; line-height: 1.5;">
          <strong>💡 الشرح العلمي: </strong>${chemDiagram.summary}
        </div>

        ${chemDiagram.formula ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.85rem;">⚗️</span>
            <span style="font-size: 0.82rem; font-weight: 800; color: #1d4ed8;">الصيغة / المعادلة الكيميائية: ${chemDiagram.formula}</span>
          </div>
        ` : ''}

        <!-- Takeaway Points -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.4rem;">
            ${(chemDiagram.keyPoints || []).map(pt => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.76rem; color: #334155; line-height: 1.4;">
                <span style="color: #059669; font-weight: 800;">•</span> ${pt}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // 1.8. الرسوم الهندسية والبيانية للرياضيات (Math Geometric & Coordinate SVG Diagrams)
  if (mathDiagramsList.length > 0) {
    mathDiagramsList.forEach((mathDiagram, mIdx) => {
      html += `
        <div ${mIdx === 0 ? 'id="mathDiagramSec"' : ''} class="math-diagram-media-card" style="background: white; border: 2px solid #7e22ce; border-radius: 12px; padding: 0.85rem; box-shadow: 0 4px 12px rgba(126,34,206,0.1); margin-bottom: 1rem; grid-column: 1 / -1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem; border-bottom: 1px solid #e9d5ff; padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.4rem;">📐</span>
              <div>
                <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a;">${mathDiagram.title}</h4>
                <span style="font-size: 0.72rem; color: #6b21a8; font-weight: 700;">لوحة هندسية وبيانية معتمدة • ${mathDiagram.category}</span>
              </div>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.68rem; background: #f3e8ff; color: #581c87; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;">رسم متجهي دقيق</span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="openMathDiagramModal('${mathDiagram.id}')" style="font-size: 0.72rem; padding: 0.2rem 0.55rem; background: #faf5ff; border: 1px solid #d8b4fe; color: #7e22ce; font-weight: 700;">
                🔍 تكبير وفحص الرسم
              </button>
            </div>
          </div>

          <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeForAttribute(mathDiagram.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMathDiagramModal('${mathDiagram.id}');}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0.4rem;" onclick="openMathDiagramModal('${mathDiagram.id}')" title="انقر لتكبير وفحص الرسم التوضيحي">
            <div style="width: 100%; max-width: 680px;">
              ${mathDiagram.svg}
            </div>
          </div>

          <div style="background: #faf5ff; border-right: 4px solid #7e22ce; padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.8rem; color: #581c87; margin-top: 0.5rem; margin-bottom: 0.5rem; line-height: 1.5;">
            <strong>💡 الشرح الهندسي: </strong>${mathDiagram.summary}
          </div>

          ${mathDiagram.formula ? `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.85rem;">📐</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #1d4ed8;">القانون الرياضي: ${mathDiagram.formula}</span>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.4rem;">
            ${(mathDiagram.keyPoints || []).map(pt => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.74rem; color: #334155; line-height: 1.4;">
                <span style="color: #7e22ce; font-weight: 800;">✔️</span> ${pt}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // 2. البطاقة البصرية المصممة للموضوع
  if (cardData) {
    html += `
      <div id="topicCardSec" style="background: white; border: 2px solid ${cardData.themeColor || 'var(--primary)'}; border-radius: 10px; padding: 0.75rem; box-shadow: 0 2px 6px rgba(0,0,0,0.06); grid-column: 1 / -1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px dashed var(--slate-200); padding-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-size: 1.35rem;">${cardData.icon || '📌'}</span>
            <div>
              <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--slate-900);">${cardData.titleAr || cardData.title}</h4>
              ${cardData.titleEn ? `<span style="font-size: 0.72rem; color: var(--slate-500); font-weight: 600;">${cardData.titleEn}</span>` : ''}
            </div>
          </div>
          <span class="badge" style="background: ${cardData.themeColor || '#059669'}22; color: ${cardData.themeColor || '#059669'}; font-size: 0.7rem; font-weight: 800;">
            بطاقة المفاهيم البصرية
          </span>
        </div>

        ${cardData.summary ? `
          <div style="background: #f8fafc; border-right: 4px solid ${cardData.themeColor || 'var(--primary)'}; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.8rem; color: var(--slate-700); margin-bottom: 0.6rem; line-height: 1.5;">
            ${cardData.summary}
          </div>
        ` : ''}

        <!-- شبكة المفاهيم أو النقاط التوضيحية -->
        ${cardData.sections ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 0.5rem; margin-bottom: 0.6rem;">
            ${(cardData.sections || []).map(sec => `
              <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 6px; padding: 0.45rem 0.6rem;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 0.8rem; font-weight: 800; color: var(--slate-900);">${sec.icon || '🔹'} ${sec.name}</span>
                  <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700;">${sec.ar}</span>
                </div>
                <p style="margin: 0.2rem 0 0 0; font-size: 0.7rem; color: var(--slate-600); line-height: 1.3;">${sec.def}</p>
              </div>
            `).join('')}
          </div>
        ` : (cardData.points ? `
          <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.6rem;">
            ${(cardData.points || []).map(pt => `
              <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.78rem; color: var(--slate-800); background: #f0fdf4; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid #dcfce7;">
                <span style="color: #059669;">✔️</span>
                <span>${pt}</span>
              </div>
            `).join('')}
          </div>
        ` : '')}

        <!-- صندوق القاعدة النحوية المميز -->
        ${cardData.grammarFocus ? `
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 0.5rem 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.25rem;">
              <span style="font-size: 0.9rem;">💡</span>
              <strong style="font-size: 0.8rem; color: #92400e;">${cardData.grammarFocus.title}</strong>
              <span style="font-size: 0.7rem; color: #b45309;">(${cardData.grammarFocus.rule})</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${(cardData.grammarFocus.examples || []).map(ex => `
                <span style="background: white; border: 1px solid #fcd34d; border-radius: 4px; padding: 0.15rem 0.45rem; font-size: 0.73rem; color: #78350f;">
                  <strong>${ex.en}</strong> ➔ ${ex.ar}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function formatTextHighlights(text) {
  if (!text) return '';
  // تنقية النص من الرموز والتشكيلات المركبة غير المتوافقة مع خطوط العرض (مثل سهم المتجهات U+20D7)
  const clean = text.replace(/\u20d7/g, '');
  // إبراز الكلمات المفتاحية النحوية بأسلوب جمالي
  return clean
    .replace(/\b(Possessive 's'|A school magazine|article|cover|edit|editor|print|printer|report|reporter|for|since|used to|should|shouldn't|too much|too many|a few|a little|a lot of|headache|stomach ache|toothache|earache|painkiller|dentist|appendicitis|limerick|limericks|Stonehenge|healthy|unfit|exercise|regularly|fried|grilled|baked|boiled|starters|desserts|curry|marshmallow|marshmallows|ambulance|must|mustn't|play|go|do|passive|be going to)\b/gi, 
      '<span style="background: #fef3c7; color: #92400e; font-weight: 700; padding: 0.05rem 0.25rem; border-radius: 3px;">$1</span>');
}

function escapeForAttribute(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/`/g, '\\`').replace(/\n/g, ' ');
}

// تنبيه القواعد المرتبطة بالدرس
function updateLessonGrammarAlert(lesson) {
  const alertDiv = document.getElementById('lessonGrammarAlert');
  const textDiv = document.getElementById('lessonGrammarAlertText');
  const t = lesson.title.toLowerCase();

  let matchedRule = null;
  if (t.includes('lesson 1') || t.includes('school magazine')) {
    matchedRule = 's التملك (Possessive \'s\') - صفحة 4';
  } else if (t.includes('interview') || t.includes('lesson 4') || t.includes('for') || t.includes('since')) {
    matchedRule = 'المضارع التام مع For و Since والتعبير عن الإعجاب - صفحة 7';
  } else if (t.includes('problems') || t.includes('aunt sally') || t.includes('keep fit')) {
    matchedRule = 'تقديم النصائح باستخدام Should و Shouldn\'t - صفحة 8 و 17';
  } else if (t.includes('eat the right food') || t.includes('healthy food')) {
    matchedRule = 'محددات الكمية (Too much, Too many, A few, A little, A lot of) - صفحة 18';
  } else if (t.includes('restaurant') || t.includes('menu')) {
    matchedRule = 'أساليب الطلب المؤدب وطرق الطهي (fried, grilled, baked) - صفحة 19';
  } else if (t.includes('aches') || t.includes('pains')) {
    matchedRule = 'التعبير عن الأوجاع والأعراض (have got a headache / hurts) - صفحة 20';
  } else if (t.includes('jalal')) {
    matchedRule = 'السرد القصصي وقاعدة الرغبة (want + pronoun + to + verb) - صفحة 21';
  } else if (t.includes('get well')) {
    matchedRule = 'عبارات التمني والدعاء بالشفاء العاجل (Get well soon) - صفحة 22';
  } else if (t.includes('informal letter') || t.includes('letter')) {
    matchedRule = 'هيكل وكتابة الرسالة غير الرسمية لصديق مريض - صفحة 23';
  } else if (t.includes('limerick')) {
    matchedRule = 'قواعد وهيكل قصائد الليمريك الفكاهية (قافية AABBA) - صفحة 24';
  } else if (t.includes('round up')) {
    matchedRule = 'المراجعة الشاملة لكفايات وقواعد الوحدة - صفحة 25';
  } else if (t.includes('stonehenge')) {
    matchedRule = 'السرد القصصي والماضي المستمر (was/were + -ing) - صفحة 26 و 27';
  } else if (t.includes('healthy living poster') || t.includes('project 2')) {
    matchedRule = 'مشروع الوحدة: إعداد ملصق وتوصيات نمط الحياة الصحي - صفحات 17-25';
  } else if (t.includes('sports') || t.includes('booking')) {
    matchedRule = 'أفعال الرياضات (play, go, do) والاعتياد (used to) - صفحة 32';
  } else if (t.includes('telephone') || t.includes('passive')) {
    matchedRule = 'المبني للمجهول (Passive Voice) - صفحة 51';
  } else if (t.includes('job') || t.includes('future')) {
    matchedRule = 'المستقبل المخطط له (be going to) - صفحة 63';
  } else if (t.includes('world problems') || t.includes('rules')) {
    matchedRule = 'قواعد الإلزام والنصيحة (must vs should) والاحتمالية (may & might) - صفحة 74';
  } else if (t.includes('علامات الإعراب') || t.includes('العلامات الأصلية')) {
    matchedRule = 'علامات الإعراب الأصلية (الضمة، الفتحة، الكسرة، السكون) والفرعية (الواو، الألف، الياء، النون، حذف العلة) - الجزء 1 ص 9-16';
  } else if (t.includes('الأسماء الخمسة')) {
    matchedRule = 'الأسماء الخمسة (أبو، أخو، حمو، فو، ذو) وإعرابها بالحروف بشرط الإضافة - الجزء 1 ص 26-30';
  } else if (t.includes('الميزان الصرفي')) {
    matchedRule = 'الميزان الصرفي (فَعَلَ) وأوزان الكلمات الثلاثية والرباعية والمزيدة والمحذوفة - ص 38-43 و 125-129';
  } else if (t.includes('اللازم') || t.includes('المتعدي')) {
    matchedRule = 'الفعل اللازم (يكتفي بفاعله) والفعل المتعدي (ينصب مفعولاً به) - الجزء 1 ص 55-59';
  } else if (t.includes('نائب الفاعل') || t.includes('المجهول')) {
    matchedRule = 'نائب الفاعل وبناء الفعل الماضي والمضارع للمجهول - الجزء 1 ص 69-73';
  } else if (t.includes('المفعول فيه') || t.includes('الزمان') || t.includes('المكان')) {
    matchedRule = 'المفعول فيه: ظرف الزمان وظرف المكان متضمناً معنى (في) - الجزء 1 ص 85-88';
  } else if (t.includes('المفعول المطلق')) {
    matchedRule = 'المفعول المطلق: المؤكد لفعله، المبين لنوعه، المبين لعدد مراته - الجزء 1 ص 98-101';
  } else if (t.includes('الحال')) {
    matchedRule = 'الحال: اسم نكرة مشتق منصوب يبين هيئة صاحب الحال المعرفة - الجزء 1 ص 110-114';
  } else if (t.includes('الاستثناء') || t.includes('إلا')) {
    matchedRule = 'أسلوب الاستثناء بـ (إلا): التام المتصل والمنقطع والمفرغ - الجزء 1 ص 123-127';
  } else if (t.includes('الخط القياسي') || t.includes('غير القياسي')) {
    matchedRule = 'الإملاء والخط: الخط القياسي والخط غير القياسي العثماني في القرآن الكريم - الجزء 1 ص 17-19';
  } else if (t.includes('النداء') || t.includes('المنادى')) {
    matchedRule = 'أسلوب النداء وأحكام المنادى: المبني على الضم والمعرب المنصوب - الجزء 2 ص 8-12';
  } else if (t.includes('الاستفهام')) {
    matchedRule = 'أسلوب الاستفهام: التصديق (هل والهمزة) والتصور (أسماء الاستفهام) - الجزء 2 ص 23-29';
  } else if (t.includes('بناء الفعل المضارع') || t.includes('المضارع')) {
    matchedRule = 'بناء الفعل المضارع على السكون مع نون النسوة وعلى الفتح مع نوني التوكيد - الجزء 2 ص 39-43';
  } else if (t.includes('المثنى')) {
    matchedRule = 'المثنى والملحق به (اثنان واثنتان، وكلا وكلتا المضافتان لضمير) - الجزء 2 ص 53-57';
  } else if (t.includes('جمع المذكر السالم')) {
    matchedRule = 'جمع المذكر السالم والملحق به وألفاظ العقود (عشرون إلى تسعون) - الجزء 2 ص 66-72';
  } else if (t.includes('جمع المؤنث السالم')) {
    matchedRule = 'جمع المؤنث السالم وإعرابه بالكسرة نيابة عن الفتحة والملحق به - الجزء 2 ص 84-88';
  } else if (t.includes('جمع التكسير')) {
    matchedRule = 'جمع التكسير: أوزان القلة الأربعة وأوزان الكثرة وصيغ منتهى الجموع - الجزء 2 ص 98-102';
  } else if (t.includes('المقصور') || t.includes('المنقوص') || t.includes('الممدود')) {
    matchedRule = 'الأسماء المقصور والمنقوص والممدود وأحكام إعرابها بالحركات المقدرة والظاهرة - الجزء 2 ص 111-117';
  }

  if (matchedRule) {
    alertDiv.classList.remove('hidden');
    textDiv.innerHTML = `💡 <strong>قواعد هذا الدرس:</strong> ${matchedRule}`;
  } else {
    alertDiv.classList.add('hidden');
  }
}
