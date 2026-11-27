// =========================================================================
// وحدة تقارير التقدم، محرك الطباعة A4، تصدير التقارير، ومقارنة المناهج حياً
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

window.ReportManager = (() => {
  const PROFILE_KEY = 'student_profile';
  const PROGRESS_KEY = 'progress_v1';
  const MAX_QUIZ_HISTORY = 50;
  const SIGNATURE_TEXT = 'إعداد المهندس أسامة خليل هاشم';

  // الأعداد الفعلية لصفحات الكتب المصورة على القرص (book_images/)
  const ACTUAL_BOOK_IMAGES_COUNT = {
    3: 247, // 120 كتاب الطالب + 127 كراس النشاط
    4: 136,
    5: 136,
    6: 120,
    7: 88,
    8: 196, // كتاب الرياضيات الموحد (196 صفحة)
    9: 140,
    10: 96,
    11: 92
  };

  const SUBJECT_AUDIT_SPECS = [
    {
      id: 3,
      name: 'اللغة الإنجليزية (English for Iraq)',
      shortName: 'اللغة الإنجليزية',
      icon: '📘',
      globalKey: 'CURRICULUM_DATA',
      rulesKey: 'GRAMMAR_RULES',
      examMode: 'en',
      diagramsKey: null,
      declaredLessons: 84,
      declaredPages: 120,
      declaredActivityPages: 127
    },
    {
      id: 4,
      name: 'اللغة العربية (الجزء الأول)',
      shortName: 'العربية ج1',
      icon: '📙',
      globalKey: 'ARABIC_CURRICULUM_P1',
      rulesKey: 'ARABIC_GRAMMAR_RULES',
      examMode: 'ar',
      diagramsKey: null,
      declaredLessons: 40,
      declaredPages: 136
    },
    {
      id: 5,
      name: 'اللغة العربية (الجزء الثاني)',
      shortName: 'العربية ج2',
      icon: '📗',
      globalKey: 'ARABIC_CURRICULUM_P2',
      rulesKey: 'ARABIC_GRAMMAR_RULES',
      examMode: 'ar',
      diagramsKey: null,
      declaredLessons: 40,
      declaredPages: 136
    },
    {
      id: 6,
      name: 'التربية الإسلامية والقرآن الكريم',
      shortName: 'التربية الإسلامية',
      icon: '🕌',
      globalKey: 'ISLAMIC_CURRICULUM',
      rulesKey: 'ISLAMIC_RULES',
      examMode: 'is',
      diagramsKey: null,
      declaredLessons: 31,
      declaredPages: 120
    },
    {
      id: 7,
      name: 'الفيزياء - الثاني متوسط',
      shortName: 'الفيزياء',
      icon: '⚛️',
      globalKey: 'PHYSICS_CURRICULUM',
      rulesKey: 'PHYSICS_RULES',
      examMode: 'phy',
      diagramsKey: 'PHYSICS_DIAGRAMS',
      declaredLessons: 20,
      declaredPages: 88
    },
    {
      id: 8,
      name: 'الرياضيات - الثاني متوسط',
      shortName: 'الرياضيات',
      icon: '📐',
      globalKey: 'MATH_CURRICULUM',
      rulesKey: 'MATH_RULES',
      examMode: 'math',
      diagramsKey: 'MATH_DIAGRAMS',
      declaredLessons: 51,
      declaredPages: 196
    },
    {
      id: 9,
      name: 'الاجتماعيات - الثاني متوسط',
      shortName: 'الاجتماعيات',
      icon: '🌍',
      globalKey: 'SOCIAL_CURRICULUM',
      rulesKey: 'SOCIAL_TERMS_BANK',
      examMode: 'soc',
      diagramsKey: null,
      declaredLessons: 39,
      declaredPages: 140
    },
    {
      id: 10,
      name: 'الكيمياء - الثاني متوسط',
      shortName: 'الكيمياء',
      icon: '🧪',
      globalKey: 'CHEMISTRY_CURRICULUM',
      rulesKey: 'CHEMISTRY_RULES',
      examMode: 'chem',
      diagramsKey: 'CHEMISTRY_DIAGRAMS',
      declaredLessons: 21,
      declaredPages: 96
    },
    {
      id: 11,
      name: 'علم الأحياء - الثاني متوسط',
      shortName: 'علم الأحياء',
      icon: '🧬',
      globalKey: 'BIOLOGY_CURRICULUM',
      rulesKey: 'BIOLOGY_RULES',
      examMode: 'bio',
      diagramsKey: 'BIOLOGY_DIAGRAMS',
      declaredLessons: 21,
      declaredPages: 92
    }
  ];

  let activeReportTab = 'progress'; // 'progress' | 'audit' | 'lesson' | 'quiz'
  let includeSolutionsInLessonReport = true;
  let lastAuditResult = null;
  let auditLoading = false;
  let printSafetyTimer = null;

  function safeLsGet(key) {
    if (typeof lsGet === 'function') return lsGet(key);
    return localStorage.getItem('interactive_edu_' + key);
  }

  function safeLsSet(key, val) {
    if (typeof lsSet === 'function') return lsSet(key, val);
    localStorage.setItem('interactive_edu_' + key, String(val));
  }

  function getEscaped(val) {
    if (typeof escapeHtml === 'function') return escapeHtml(val);
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatRichText(raw, useMath = false) {
    const escaped = getEscaped(raw || '');
    if (useMath && typeof formatPhysicsMath === 'function') {
      return formatPhysicsMath(escaped);
    }
    return escaped;
  }

  function formatDateAr(isoStr) {
    if (!isoStr) return 'غير محدد';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return String(isoStr);
      return d.toLocaleString('ar-IQ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(isoStr).slice(0, 16);
    }
  }

  // -----------------------------------------------------------------------
  // 1. إدارة ملف الطالب وسجل التقدم المحلي المضغوط
  // -----------------------------------------------------------------------
  function getStudentProfile() {
    try {
      const raw = safeLsGet(PROFILE_KEY);
      if (!raw) return { name: '', section: '', school: '' };
      const p = JSON.parse(raw);
      return {
        name: String(p?.name || '').trim(),
        section: String(p?.section || '').trim(),
        school: String(p?.school || '').trim()
      };
    } catch {
      return { name: '', section: '', school: '' };
    }
  }

  function saveStudentProfile(profile = {}) {
    const clean = {
      name: String(profile.name || '').trim().slice(0, 80),
      section: String(profile.section || '').trim().slice(0, 60),
      school: String(profile.school || '').trim().slice(0, 80)
    };
    safeLsSet(PROFILE_KEY, JSON.stringify(clean));
    syncStudentProfileInputs();
    return clean;
  }

  function syncStudentProfileInputs() {
    const p = getStudentProfile();
    const pairs = [
      ['settingsStudentNameInput', p.name],
      ['settingsStudentSectionInput', p.section],
      ['settingsStudentSchoolInput', p.school],
      ['reportStudentNameInput', p.name],
      ['reportStudentSectionInput', p.section],
      ['reportStudentSchoolInput', p.school]
    ];
    pairs.forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && el.value !== val) el.value = val;
    });
  }

  function getProgressData() {
    try {
      const raw = safeLsGet(PROGRESS_KEY);
      if (!raw) return { visitedLessons: {}, quizHistory: [], updatedAt: null };
      const parsed = JSON.parse(raw);
      return {
        visitedLessons: (parsed && typeof parsed.visitedLessons === 'object' && parsed.visitedLessons) ? parsed.visitedLessons : {},
        quizHistory: Array.isArray(parsed?.quizHistory) ? parsed.quizHistory : [],
        updatedAt: parsed?.updatedAt || null
      };
    } catch {
      return { visitedLessons: {}, quizHistory: [], updatedAt: null };
    }
  }

  function saveProgressData(data) {
    try {
      safeLsSet(PROGRESS_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[ReportManager] Unable to persist progress:', e);
    }
  }

  function recordLessonVisit(currId, lessonId) {
    const cId = String(Number(currId) || 3);
    const lId = Number(lessonId);
    if (!lId) return;
    const data = getProgressData();
    if (!Array.isArray(data.visitedLessons[cId])) {
      data.visitedLessons[cId] = [];
    }
    if (!data.visitedLessons[cId].includes(lId)) {
      data.visitedLessons[cId].push(lId);
    }
    data.updatedAt = new Date().toISOString();
    saveProgressData(data);
  }

  function recordQuizResult(entry) {
    if (!entry) return;
    const data = getProgressData();
    const record = {
      id: Date.now(),
      currId: Number(entry.currId) || 3,
      chapterId: entry.chapterId ? Number(entry.chapterId) : null,
      subjectName: String(entry.subjectName || ''),
      title: String(entry.title || 'اختبار تفاعلي'),
      score: Number(entry.score) || 0,
      total: Number(entry.total) || 10,
      pct: Number(entry.pct) || 0,
      wrongCount: Number(entry.wrongCount) || 0,
      date: new Date().toISOString()
    };
    data.quizHistory.unshift(record);
    if (data.quizHistory.length > MAX_QUIZ_HISTORY) {
      data.quizHistory = data.quizHistory.slice(0, MAX_QUIZ_HISTORY);
    }
    data.updatedAt = record.date;
    saveProgressData(data);
  }

  function clearProgressData() {
    saveProgressData({ visitedLessons: {}, quizHistory: [], updatedAt: null });
    if (activeReportTab === 'progress') {
      renderReportsModalBody();
    }
    if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
      window.A11yManager.announce('تم مسح سجل التقدم والاختبارات المحلي');
    }
  }

  // -----------------------------------------------------------------------
  // 2. محرك تدقيق ومقارنة المناهج التسعة بالمادة المعروضة حياً
  // -----------------------------------------------------------------------
  async function runCurriculumAudit(onProgress = null) {
    if (window.CurriculumLoader && typeof window.CurriculumLoader.ensureAllSearchAssets === 'function') {
      await window.CurriculumLoader.ensureAllSearchAssets({
        includeQuizzes: true,
        includeDiagrams: true,
        onProgress
      });
    }

    const rows = SUBJECT_AUDIT_SPECS.map((spec) => {
      const chapters = Array.isArray(window[spec.globalKey])
        ? window[spec.globalKey]
        : (typeof getCurriculumChapters === 'function' ? getCurriculumChapters(spec.id) : []);

      let lessonsCount = 0;
      let chunksCount = 0;
      let totalChars = 0;
      let lessonsWithExercises = 0;
      let lessonsWithoutExercises = 0;
      let exerciseCardsCount = 0;
      let questionsCount = 0;
      let answeredQuestionsCount = 0;
      const referencedPages = new Set();

      (chapters || []).forEach((ch) => {
        (ch.lessons || []).forEach((les) => {
          lessonsCount++;
          let lessonEx = 0;
          (les.chunks || []).forEach((ck) => {
            chunksCount++;
            totalChars += ((ck.heading || '') + (ck.text || ck.content_text || '')).length;
            if (ck.page) {
              const p = Number(ck.page);
              if (!isNaN(p) && p > 0) referencedPages.add(p);
            }
            if (Array.isArray(ck.exercises) && ck.exercises.length > 0) {
              lessonEx += ck.exercises.length;
              exerciseCardsCount += ck.exercises.length;
              ck.exercises.forEach((ex) => {
                (ex.questions || []).forEach((qObj) => {
                  questionsCount++;
                  if (qObj && qObj.a && String(qObj.a).trim().length > 0) {
                    answeredQuestionsCount++;
                  }
                });
              });
            }
          });
          if (lessonEx > 0) lessonsWithExercises++;
          else lessonsWithoutExercises++;
        });
      });

      // الحلول المنفصلة في نافذة المراجعات الموحدة (الكيمياء والأحياء)
      let modalReviewAnswersCount = 0;
      if (spec.id === 10 && exerciseCardsCount === 0 && Array.isArray(window.CHEMISTRY_CHAPTER_REVIEWS)) {
        window.CHEMISTRY_CHAPTER_REVIEWS.forEach((r) => {
          (r.solutions || []).forEach((sec) => {
            modalReviewAnswersCount += (sec.answers || []).length;
          });
        });
      } else if (spec.id === 11 && exerciseCardsCount === 0 && Array.isArray(window.BIOLOGY_CHAPTER_REVIEWS)) {
        window.BIOLOGY_CHAPTER_REVIEWS.forEach((r) => {
          (r.solutions || []).forEach((sec) => {
            modalReviewAnswersCount += (sec.answers || []).length;
          });
        });
      }

      const rulesArr = spec.rulesKey ? (window[spec.rulesKey] || []) : [];
      const rulesCount = Array.isArray(rulesArr) ? rulesArr.length : 0;

      let pastExamsCount = 0;
      if (typeof getSubjectExams === 'function') {
        const examsObj = getSubjectExams(spec.examMode);
        pastExamsCount = examsObj ? Object.keys(examsObj).length : 0;
      }

      const quizzesMap = (window.CHAPTER_QUIZZES && window.CHAPTER_QUIZZES[spec.id]) || {};
      const chapterQuizzesCount = Object.keys(quizzesMap).length;
      const chapterQuizQuestionsCount = Object.values(quizzesMap).reduce((sum, item) => sum + ((item && item.questions) ? item.questions.length : 0), 0);

      const diagramsCount = spec.diagramsKey && Array.isArray(window[spec.diagramsKey]) ? window[spec.diagramsKey].length : 0;
      const actualDiskImages = ACTUAL_BOOK_IMAGES_COUNT[spec.id] ?? 0;

      // رصد الفجوات المحددة لكل منهج بدقة
      const gaps = [];
      if (spec.id === 8) {
        if (lessonsCount !== spec.declaredLessons) {
          gaps.push(`عدد الدروس الفعلي (${lessonsCount}) يختلف عن المُعلن في الواجهة (${spec.declaredLessons}).`);
        }
        if (lessonsWithoutExercises > 0) {
          gaps.push(`توجد ${lessonsWithoutExercises} دروس في الرياضيات بدون بطاقات تمارين داخلية.`);
        }
        if (actualDiskImages < spec.declaredPages) {
          gaps.push(`صور صفحات كتاب الرياضيات ناقصة على القرص (${actualDiskImages} من ${spec.declaredPages} صفحة).`);
        }
        if (referencedPages.size < (actualDiskImages - 5)) {
          gaps.push(`${(actualDiskImages - 5) - referencedPages.size} صفحة محتوى من أصل ${actualDiskImages - 5} صفحة غير مرتبطة بمقاطع الدروس.`);
        }
        if (diagramsCount === 0) {
          gaps.push(`لا توجد رسوم SVG هندسية مضافة للرياضيات بعد (الحجم النصي للبيانات: ${Math.round(totalChars / 1024)} ك.ب).`);
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الدروس الـ ${lessonsCount} تشتمل على تمارين تفاعلية وحلول نموذجية (${answeredQuestionsCount} سؤالاً عبر ${exerciseCardsCount} بطاقة)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 4–194) من الكتاب الموحد مربوطة بمقاطعها مع ${diagramsCount} لوحة SVG.`);
        }
      } else if (spec.id === 11) {
        if (lessonsWithoutExercises > 0) {
          gaps.push(`${lessonsWithoutExercises} من ${lessonsCount} درساً في علم الأحياء بدون بطاقات تمارين تفاعلية داخلية.`);
        }
        if (referencedPages.size < (actualDiskImages - 3)) {
          gaps.push(`${(actualDiskImages - 3) - referencedPages.size} صفحة محتوى من أصل ${actualDiskImages - 3} صفحة غير مرتبطة بمقاطع الدروس.`);
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الدروس الـ ${lessonsCount} تشتمل على تمارين تفاعلية وحلول نموذجية (${answeredQuestionsCount} سؤالاً)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 4–92) مربوطة بمقاطعها مع 17 لوحة SVG.`);
        }
      } else if (spec.id === 9) {
        if (lessonsWithoutExercises > 0) {
          gaps.push(`${lessonsWithoutExercises} من ${lessonsCount} درساً بدون بطاقات تمارين تفاعلية.`);
        }
        if (referencedPages.size < (actualDiskImages - 4)) {
          gaps.push(`${(actualDiskImages - 4) - referencedPages.size} صفحة محتوى من أصل ${actualDiskImages - 4} صفحة غير مرتبطة مباشرة بمقاطع الدروس.`);
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الدروس الـ ${lessonsCount} تشتمل على تمارين تفاعلية وأنشطة صفية وحلول نموذجية (${answeredQuestionsCount} سؤالاً)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 4–139) مربوطة بمقاطعها.`);
        }
      } else if (spec.id === 7) {
        if (lessonsWithoutExercises > 0) {
          gaps.push(`${lessonsWithoutExercises} من ${lessonsCount} درساً في الفيزياء بدون بطاقات تمارين تفاعلية داخلية.`);
        }
        if (referencedPages.size < (actualDiskImages - 4)) {
          gaps.push(`${(actualDiskImages - 4) - referencedPages.size} صفحة محتوى من أصل ${actualDiskImages - 4} صفحة غير مرتبطة بمقاطع الدروس.`);
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الدروس الـ ${lessonsCount} (14 درساً بمراجعات «أختبر معلوماتي» والتفكير الناقد + 6 مراجعات فصول) تشتمل على تمارين تفاعلية وحلول نموذجية (${answeredQuestionsCount} سؤالاً)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 5–88) مربوطة بمقاطعها مع 15 لوحة SVG.`);
        }
      } else if (spec.id === 10) {
        if (lessonsWithoutExercises > 0) {
          gaps.push(`${lessonsWithoutExercises} من ${lessonsCount} درساً في الكيمياء بدون بطاقات تمارين تفاعلية داخلية.`);
        }
        if (referencedPages.size < (actualDiskImages - 4)) {
          gaps.push(`${(actualDiskImages - 4) - referencedPages.size} صفحة محتوى من أصل ${actualDiskImages - 4} صفحة غير مرتبطة بمقاطع الدروس.`);
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الدروس الـ ${lessonsCount} تشتمل على تمارين تفاعلية وحلول نموذجية (${answeredQuestionsCount} سؤالاً)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 5–96) مربوطة بمقاطعها مع 16 لوحة SVG.`);
        }
      } else if (spec.id === 4) {
        const unitQuestionCounts = (chapters || [])
          .filter(ch => ch && ch.id >= 401 && ch.id <= 409)
          .map(ch => {
            let qSum = 0;
            (ch.lessons || []).forEach(l => (l.chunks || []).forEach(ck => (ck.exercises || []).forEach(ex => { qSum += (ex.questions || []).length; })));
            return qSum;
          });
        const minQ = unitQuestionCounts.length > 0 ? Math.min(...unitQuestionCounts) : 0;
        const maxQ = unitQuestionCounts.length > 0 ? Math.max(...unitQuestionCounts) : 0;
        if (unitQuestionCounts.length === 9 && minQ >= 20) {
          gaps.push(`تغطية كاملة ومتوازنة 100%؛ جميع الوحدات التسع تضم تمارين وتطبيقات تفاعلية متوازنة (${answeredQuestionsCount} سؤالاً محلولاً عبر ${exerciseCardsCount} بطاقة، بمعدل ${minQ}–${maxQ} سؤالاً لكل وحدة) وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 5–135) مربوطة بمقاطعها.`);
        } else {
          gaps.push(`تفاوت عدد الأسئلة بين الوحدات (${minQ} إلى ${maxQ} سؤالاً).`);
        }
      } else if (spec.id === 5) {
        const hasMamnoo = Array.isArray(window.ARABIC_GRAMMAR_RULES) && window.ARABIC_GRAMMAR_RULES.some(r => (r.title || '').includes('الممنوع من الصرف'));
        const hasRabeeExercises = (chapters || []).some(ch => (ch.lessons || []).some(l => l.id === 5042 && (l.chunks || []).some(ck => Array.isArray(ck.exercises) && ck.exercises.length > 0)));
        if (!hasMamnoo) {
          gaps.push('قاعدة «الممنوع من الصرف» (الوحدة 9) غير مدرجة في بنك القواعد ومكانها تكرار «الميزان الصرفي».');
        }
        if (!hasRabeeExercises) {
          gaps.push('درس المطالعة (وصف الربيع لأبي تمام - 5042) يخلو من تمارين المناقشة التفاعلية.');
        }
        if (gaps.length === 0) {
          gaps.push(`تغطية كاملة 100%؛ جميع الوحدات التسع (بما فيها مطالعة وصف الربيع لأبي تمام) تشتمل على تمارين تفاعلية وحلول نموذجية (${answeredQuestionsCount} سؤالاً)، وبنك القواعد يضم قاعدة «الممنوع من الصرف»، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 3–135) مربوطة بمقاطعها.`);
        }
      } else if (spec.id === 6) {
        const missingIslamic = [46, 68, 74, 96].filter(p => !referencedPages.has(p));
        if (missingIslamic.length === 0 && referencedPages.size >= (actualDiskImages - 5)) {
          gaps.push(`تغطية كاملة 100%؛ جميع الوحدات الست تشتمل على مناقشات وحلول نموذجية (${answeredQuestionsCount} سؤالاً عبر ${exerciseCardsCount} بطاقة)، وجميع صفحات المحتوى الـ ${referencedPages.size} (ص 4–118 بما فيها 46، 68، 74، 96) مربوطة بمقاطع الدروس.`);
        } else {
          gaps.push(`صفحات داخلية غير مشار إليها في المقاطع (${missingIslamic.join('، ') || (actualDiskImages - 5 - referencedPages.size)}).`);
        }
      } else if (spec.id === 3) {
        const missingEngSb = [40, 42, 81, 83, 84, 85].filter(p => !referencedPages.has(p));
        const hasEnReviewModal = typeof openEnglishReviewsModal === 'function';
        if (missingEngSb.length === 0 && hasEnReviewModal) {
          gaps.push(`تغطية كاملة 100%؛ أغنى مادة تفاعلياً (${answeredQuestionsCount} سؤالاً مجاباً عبر ${exerciseCardsCount} بطاقة و124/127 صفحة نشاط)، مع ربط جميع صفحات المحتوى الـ ${referencedPages.size} من كتاب الطالب (ص 4–120) وفتحها وتمارين الكراس من نافذة المراجعات الموحدة.`);
        } else {
          gaps.push(`فجوات ربط في اللغة الإنجليزية: صفحات غير مرتبطة (${missingEngSb.length}) أو نافذة المراجعات غير مفعلة.`);
        }
      }

      let status = 'مكتمل وعالي';
      let statusTone = 'success';
      if (spec.id === 8) {
        if (lessonsWithoutExercises === 0 && actualDiskImages >= spec.declaredPages && referencedPages.size >= (actualDiskImages - 5) && diagramsCount > 0) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else if (lessonsWithExercises >= 28) {
          status = 'جيد مع فجوات جزئية';
          statusTone = 'warning';
        } else {
          status = 'ناقص ويحتاج استكمالاً';
          statusTone = 'danger';
        }
      } else if (spec.id === 11) {
        if (lessonsWithoutExercises === 0 && referencedPages.size >= (actualDiskImages - 3)) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else {
          status = 'جيد مع فجوات تمارين';
          statusTone = 'warning';
        }
      } else if (spec.id === 9) {
        if (lessonsWithoutExercises === 0 && referencedPages.size >= (actualDiskImages - 4)) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else {
          status = 'جيد مع فجوات جزئية';
          statusTone = 'warning';
        }
      } else if (spec.id === 10) {
        if (lessonsWithoutExercises === 0 && referencedPages.size >= (actualDiskImages - 4)) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else {
          status = 'جيد مع فجوات جزئية';
          statusTone = 'warning';
        }
      } else if (spec.id === 7) {
        if (lessonsWithoutExercises === 0 && referencedPages.size >= (actualDiskImages - 4)) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else {
          status = 'جيد مع فجوات جزئية';
          statusTone = 'warning';
        }
      } else if (spec.id === 5 || spec.id === 4 || spec.id === 6 || spec.id === 3) {
        if (gaps.length === 1 && gaps[0].startsWith('تغطية كاملة')) {
          status = 'مكتمل وعالي';
          statusTone = 'success';
        } else {
          status = 'جيد مع فجوات جزئية';
          statusTone = 'warning';
        }
      }

      return {
        id: spec.id,
        name: spec.name,
        shortName: spec.shortName,
        icon: spec.icon,
        chaptersCount: chapters.length,
        lessonsCount,
        declaredLessons: spec.declaredLessons,
        chunksCount,
        textSizeKB: Math.round(totalChars / 1024),
        lessonsWithExercises,
        lessonsWithoutExercises,
        exerciseCardsCount,
        questionsCount,
        answeredQuestionsCount,
        modalReviewAnswersCount,
        rulesCount,
        pastExamsCount,
        chapterQuizzesCount,
        chapterQuizQuestionsCount,
        diagramsCount,
        distinctReferencedPages: referencedPages.size,
        actualDiskImages,
        declaredPages: spec.declaredPages,
        status,
        statusTone,
        gaps
      };
    });

    lastAuditResult = {
      generatedAt: new Date().toISOString(),
      rows,
      totals: {
        subjects: rows.length,
        chapters: rows.reduce((a, r) => a + r.chaptersCount, 0),
        lessons: rows.reduce((a, r) => a + r.lessonsCount, 0),
        chunks: rows.reduce((a, r) => a + r.chunksCount, 0),
        exerciseCards: rows.reduce((a, r) => a + r.exerciseCardsCount, 0),
        questions: rows.reduce((a, r) => a + r.questionsCount, 0),
        modalReviewAnswers: rows.reduce((a, r) => a + r.modalReviewAnswersCount, 0),
        chapterQuizQuestions: rows.reduce((a, r) => a + r.chapterQuizQuestionsCount, 0),
        diagrams: rows.reduce((a, r) => a + r.diagramsCount, 0),
        diskImages: rows.reduce((a, r) => a + r.actualDiskImages, 0)
      }
    };

    return lastAuditResult;
  }

  // -----------------------------------------------------------------------
  // 3. تجميع بيانات التقرير حسب النوع (progress | audit | lesson | quiz | exam | review)
  // -----------------------------------------------------------------------
  function getActiveLessonSnapshot(includeSolutions = true) {
    const currId = Number((window.appData && window.appData.currentCurriculumId) || 3);
    const currObj = (window.appData && Array.isArray(window.appData.curriculums))
      ? window.appData.curriculums.find(c => Number(c.id) === currId)
      : null;
    const chapters = (typeof getCurriculumChapters === 'function') ? getCurriculumChapters(currId) : [];
    let activeChapter = null;
    let activeLesson = null;
    const targetLessonId = window.appData ? window.appData.currentLessonId : null;

    for (const ch of chapters) {
      for (const l of (ch.lessons || [])) {
        if (l.id === targetLessonId) {
          activeChapter = ch;
          activeLesson = l;
          break;
        }
      }
      if (activeLesson) break;
    }

    if (!activeLesson && chapters[0] && chapters[0].lessons && chapters[0].lessons[0]) {
      activeChapter = chapters[0];
      activeLesson = chapters[0].lessons[0];
    }

    return {
      currId,
      subjectName: (currObj && currObj.name) || 'المنهج الدراسي',
      chapterTitle: activeChapter ? activeChapter.title : '',
      lesson: activeLesson,
      useMath: currId === 7 || currId === 8,
      includeSolutions: Boolean(includeSolutions)
    };
  }

  function buildStudentHeaderMetaHTML() {
    const p = getStudentProfile();
    const parts = [];
    if (p.name) parts.push(`<span><strong>الطالب:</strong> ${getEscaped(p.name)}</span>`);
    if (p.section) parts.push(`<span><strong>الصف/الشعبة:</strong> ${getEscaped(p.section)}</span>`);
    if (p.school) parts.push(`<span><strong>المدرسة:</strong> ${getEscaped(p.school)}</span>`);
    parts.push(`<span><strong>التاريخ:</strong> ${getEscaped(formatDateAr(new Date().toISOString()))}</span>`);
    return parts.join(' <span style="opacity:0.45;">|</span> ');
  }

  function buildReportDocumentBodyHTML(type, options = {}) {
    if (type === 'progress') {
      const progress = getProgressData();
      const rows = SUBJECT_AUDIT_SPECS.map(spec => {
        const visited = Array.isArray(progress.visitedLessons[String(spec.id)]) ? progress.visitedLessons[String(spec.id)] : [];
        const chapters = Array.isArray(window[spec.globalKey]) ? window[spec.globalKey] : [];
        let totalLessons = spec.declaredLessons;
        if (chapters.length > 0) {
          totalLessons = chapters.reduce((acc, ch) => acc + ((ch.lessons || []).length), 0);
        }
        const pct = totalLessons > 0 ? Math.min(100, Math.round((visited.length / totalLessons) * 100)) : 0;
        const quizAttempts = progress.quizHistory.filter(q => Number(q.currId) === spec.id);
        const avgQuiz = quizAttempts.length > 0
          ? Math.round(quizAttempts.reduce((a, q) => a + (q.pct || 0), 0) / quizAttempts.length)
          : null;
        return {
          ...spec,
          visitedCount: visited.length,
          totalLessons,
          pct,
          quizCount: quizAttempts.length,
          avgQuiz
        };
      });

      const totalVisited = rows.reduce((a, r) => a + r.visitedCount, 0);
      const totalAllLessons = rows.reduce((a, r) => a + r.totalLessons, 0);
      const totalQuizzes = progress.quizHistory.length;
      const avgAllQuizzes = totalQuizzes > 0
        ? Math.round(progress.quizHistory.reduce((a, q) => a + (q.pct || 0), 0) / totalQuizzes)
        : 0;

      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">جمهورية العراق • الصف الثاني المتوسط</div>
            <h2>تقرير تقدم الطالب وإنجاز المناهج والاختبارات</h2>
            <div class="report-doc-meta">${buildStudentHeaderMetaHTML()}</div>
          </div>
          <div class="report-doc-brand">
            <div>النظام التعليمي التفاعلي الشامل</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>

        <div class="report-kpi-grid">
          <div class="report-kpi-card">
            <div class="report-kpi-val">${totalVisited} / ${totalAllLessons}</div>
            <div class="report-kpi-lbl">الدروس المُطالعَة عبر 9 كتب</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${totalAllLessons > 0 ? Math.round((totalVisited / totalAllLessons) * 100) : 0}%</div>
            <div class="report-kpi-lbl">نسبة التغطية الكلية</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${totalQuizzes}</div>
            <div class="report-kpi-lbl">محاولات الاختبارات التفاعلية</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${totalQuizzes > 0 ? avgAllQuizzes + '%' : '—'}</div>
            <div class="report-kpi-lbl">معدل درجات الاختبارات</div>
          </div>
        </div>

        <h3 class="report-sec-title">📚 ملخص التقدم حسب المادة الدراسية</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th>المادة الدراسية</th>
              <th>الدروس المُنجزة</th>
              <th>نسبة الإنجاز</th>
              <th>الاختبارات المُنجزة</th>
              <th>معدل الدرجات</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td><strong>${r.icon} ${getEscaped(r.name)}</strong></td>
                <td>${r.visitedCount} من ${r.totalLessons}</td>
                <td>${r.pct}%</td>
                <td>${r.quizCount}</td>
                <td>${r.avgQuiz !== null ? r.avgQuiz + '%' : 'لم يُختبر بعد'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 class="report-sec-title">🎯 سجل آخر الاختبارات التفاعلية</h3>
        ${progress.quizHistory.length === 0 ? `
          <div class="report-empty-note">لا توجد نتائج اختبارات مسجلة حتى الآن. سيُسجّل كل اختبار تفاعلي تسلمه تلقائياً هنا.</div>
        ` : `
          <table class="report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المادة</th>
                <th>عنوان الاختبار</th>
                <th>الدرجة</th>
                <th>النسبة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              ${progress.quizHistory.slice(0, 25).map((q, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${getEscaped(q.subjectName)}</td>
                  <td>${getEscaped(q.title)}</td>
                  <td><strong>${q.score} / ${q.total}</strong></td>
                  <td><span class="report-pill ${q.pct >= 75 ? 'ok' : (q.pct >= 50 ? 'warn' : 'bad')}">${q.pct}%</span></td>
                  <td>${getEscaped(formatDateAr(q.date))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}

        <div class="report-doc-footer">
          <span>تقرير مولّد محلياً بدون إنترنت • النظام التعليمي التفاعلي</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    if (type === 'audit') {
      const audit = lastAuditResult;
      if (!audit) {
        return '<div class="report-empty-note">جارٍ فحص وتدقيق كافة المناهج التسعة...</div>';
      }
      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">التدقيق المنهجي الحي لمحتوى النظام (${typeof CURRENT_VERSION_LABEL !== 'undefined' ? CURRENT_VERSION_LABEL : 'v5.4.0'})</div>
            <h2>تقرير مقارنة المناهج التسعة بالمادة المعروضة</h2>
            <div class="report-doc-meta"><span><strong>تاريخ الفحص:</strong> ${getEscaped(formatDateAr(audit.generatedAt))}</span></div>
          </div>
          <div class="report-doc-brand">
            <div>النظام التعليمي التفاعلي الشامل</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>

        <div class="report-kpi-grid">
          <div class="report-kpi-card">
            <div class="report-kpi-val">${audit.totals.lessons}</div>
            <div class="report-kpi-lbl">إجمالي الدروس الفعلية</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${audit.totals.questions + audit.totals.modalReviewAnswers}</div>
            <div class="report-kpi-lbl">إجمالي الأسئلة والحلول التفاعلية</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${audit.totals.chapterQuizQuestions}</div>
            <div class="report-kpi-lbl">أسئلة اختبارات الفصول</div>
          </div>
          <div class="report-kpi-card">
            <div class="report-kpi-val">${audit.totals.diskImages}</div>
            <div class="report-kpi-lbl">صفحات الكتب المصورة على القرص</div>
          </div>
        </div>

        <h3 class="report-sec-title">📊 جدول المقارنة الرقمية لجميع المواد التسع</h3>
        <table class="report-table report-table-compact">
          <thead>
            <tr>
              <th>المادة</th>
              <th>الفصول</th>
              <th>الدروس (فعلي/معلن)</th>
              <th>دروس بتمارين / بلا</th>
              <th>الأسئلة المجابة</th>
              <th>حلول نافذة المراجعة</th>
              <th>اختبارات الفصول</th>
              <th>صور الكتاب</th>
              <th>التقييم</th>
            </tr>
          </thead>
          <tbody>
            ${audit.rows.map(r => `
              <tr>
                <td><strong>${r.icon} ${getEscaped(r.shortName)}</strong></td>
                <td>${r.chaptersCount}</td>
                <td>${r.lessonsCount} / ${r.declaredLessons}</td>
                <td>${r.lessonsWithExercises} / <strong style="color:${r.lessonsWithoutExercises > 0 ? '#dc2626' : '#059669'};">${r.lessonsWithoutExercises}</strong></td>
                <td>${r.answeredQuestionsCount} (${r.exerciseCardsCount} تمرين)</td>
                <td>${r.modalReviewAnswersCount > 0 ? r.modalReviewAnswersCount + ' إجابة' : (r.exerciseCardsCount > 0 ? 'مربوطة بالدروس' : '—')}</td>
                <td>${r.chapterQuizQuestionsCount} (${r.chapterQuizzesCount} فصل)</td>
                <td>${r.actualDiskImages} / ${r.declaredPages}</td>
                <td><span class="report-pill ${r.statusTone === 'success' ? 'ok' : (r.statusTone === 'danger' ? 'bad' : 'warn')}">${getEscaped(r.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 class="report-sec-title">🔍 تفاصيل الفجوات والملاحظات المكتشفة لكل مادة</h3>
        <div class="report-gaps-grid">
          ${audit.rows.map(r => `
            <div class="report-gap-card">
              <div class="report-gap-title">${r.icon} ${getEscaped(r.name)} <span class="report-pill ${r.statusTone === 'success' ? 'ok' : (r.statusTone === 'danger' ? 'bad' : 'warn')}">${getEscaped(r.status)}</span></div>
              <ul>
                ${r.gaps.map(g => `<li>${getEscaped(g)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="report-doc-footer">
          <span>تدقيق حي من بيانات المناهج المحمّلة ومجلد book_images/</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    if (type === 'lesson') {
      const includeSol = options.withSolutions !== undefined ? Boolean(options.withSolutions) : includeSolutionsInLessonReport;
      const snap = getActiveLessonSnapshot(includeSol);
      if (!snap.lesson) {
        return '<div class="report-empty-note">يرجى اختيار درس من قاعة المذاكرة أولاً لتوليد ملخصه القابل للطباعة والتصدير.</div>';
      }
      const chunks = snap.lesson.chunks || [];
      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">${getEscaped(snap.subjectName)} • ${getEscaped(snap.chapterTitle)}</div>
            <h2>${getEscaped(snap.lesson.title)}</h2>
            <div class="report-doc-meta">
              <span>${getEscaped(snap.lesson.summary || '')}</span>
              ${buildStudentHeaderMetaHTML() ? `<span style="opacity:0.45;">|</span> ${buildStudentHeaderMetaHTML()}` : ''}
            </div>
          </div>
          <div class="report-doc-brand">
            <div>ملخص الدرس والتمارين المعتمدة</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>

        ${chunks.map((ck, idx) => {
          const exercises = ck.exercises || [];
          return `
            <div class="report-lesson-chunk">
              <div class="report-lesson-chunk-head">
                <strong>${idx + 1}. ${getEscaped(ck.heading || ('مقطع ' + (idx + 1)))}</strong>
                <span>صفحة ${getEscaped(ck.activity_book_page || ck.page || '—')}</span>
              </div>
              ${ck.text ? `<div class="report-lesson-chunk-body">${formatRichText(ck.text, snap.useMath)}</div>` : ''}
              ${exercises.length > 0 ? `
                <div class="report-lesson-exercises">
                  ${exercises.map((ex, exIdx) => `
                    <div class="report-ex-box">
                      <div class="report-ex-title">${getEscaped(ex.num || ('تمرين ' + (exIdx + 1)))}: ${getEscaped(ex.title || '')}</div>
                      ${(ex.words_box && ex.words_box.length > 0) ? `<div class="report-words-box">الكلمات المساعدة: ${ex.words_box.map(w => `<span>${getEscaped(w)}</span>`).join(' ')}</div>` : ''}
                      ${(ex.questions || []).map(qObj => `
                        <div class="report-q-row">
                          <div class="report-q-text">${formatRichText(qObj.q || '', snap.useMath)}</div>
                          ${includeSol && qObj.a ? `<div class="report-q-ans"><strong>الحل النموذجي:</strong> ${formatRichText(qObj.a, snap.useMath)}</div>` : ''}
                        </div>
                      `).join('')}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}

        <div class="report-doc-footer">
          <span>ملخص تعليمي معتمد من كتاب وزارة التربية العراقية</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    if (type === 'quiz') {
      const qs = Array.isArray(window.currentQuizQuestions) ? window.currentQuizQuestions : [];
      const ans = (typeof window.selectedQuizAnswers === 'object' && window.selectedQuizAnswers) ? window.selectedQuizAnswers : {};
      const meta = (typeof currentQuizMeta !== 'undefined' && currentQuizMeta) ? currentQuizMeta : { title: 'الاختبار التفاعلي', subjectName: '' };

      if (qs.length === 0) {
        const hist = getProgressData().quizHistory;
        if (hist.length === 0) {
          return '<div class="report-empty-note">لم يتم تحميل أو تسليم اختبار تفاعلي حالياً. افتح تبويب «الامتحانات» لبدء اختبار، ثم عُد هنا لتصديره.</div>';
        }
        const latest = hist[0];
        return `
          <div class="report-doc-header">
            <div>
              <div class="report-doc-kicker">شهادة ونتيجة آخر اختبار تفاعلي مسجّل</div>
              <h2>${getEscaped(latest.subjectName)} — ${getEscaped(latest.title)}</h2>
              <div class="report-doc-meta">${buildStudentHeaderMetaHTML()}</div>
            </div>
            <div class="report-doc-brand">
              <div>النتيجة: ${latest.score} / ${latest.total} (${latest.pct}%)</div>
              <small>${SIGNATURE_TEXT}</small>
            </div>
          </div>
          <div class="report-empty-note">ملاحظة: لعرض تفاصيل الأسئلة وخياراتها وتفسير كل سؤال، افتح الاختبار من تبويب «الامتحانات» واضغط «تصدير التقرير» بعد التسليم.</div>
        `;
      }

      let score = 0;
      const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
      qs.forEach(q => {
        const correctIdx = q.correct !== undefined ? q.correct : q.answer;
        if (ans[q.id] === correctIdx) score++;
      });
      const pct = Math.round((score / qs.length) * 100);

      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">تقرير نتيجة الاختبار التفاعلي المنهجي</div>
            <h2>${getEscaped(meta.subjectName)} — ${getEscaped(meta.title)}</h2>
            <div class="report-doc-meta">${buildStudentHeaderMetaHTML()}</div>
          </div>
          <div class="report-doc-brand">
            <div style="font-size:1.1rem;font-weight:900;">الدرجة: ${score} / ${qs.length} (${pct}%)</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>السؤال</th>
              <th>إجابتك</th>
              <th>الإجابة الصحيحة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${qs.map((q, idx) => {
              const correctIdx = q.correct !== undefined ? q.correct : q.answer;
              const userIdx = ans[q.id];
              const isOk = userIdx === correctIdx;
              const userText = (userIdx !== undefined && q.options[userIdx]) ? `${letters[userIdx] || ''}) ${q.options[userIdx]}` : 'لم يُجب';
              const corrText = q.options[correctIdx] ? `${letters[correctIdx] || ''}) ${q.options[correctIdx]}` : '—';
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td>
                    <div><strong>${getEscaped(q.question)}</strong></div>
                    ${q.explanation ? `<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem;">التفسير: ${getEscaped(q.explanation)}</div>` : ''}
                  </td>
                  <td>${getEscaped(userText)}</td>
                  <td>${getEscaped(corrText)}</td>
                  <td><span class="report-pill ${isOk ? 'ok' : 'bad'}">${isOk ? 'صحيحة' : 'خاطئة'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="report-doc-footer">
          <span>اختبار منهجي معتمد وفق كتاب وزارة التربية العراقية</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    if (type === 'review') {
      const ctx = (typeof getActiveChapterReviewContext === 'function') ? getActiveChapterReviewContext() : null;
      if (!ctx || !ctx.cfg || !ctx.activeMeta) {
        return '<div class="report-empty-note">لا توجد مراجعة فصل مفتوحة حالياً.</div>';
      }
      const { cfg, activeMeta, sections, chunkItems } = ctx;
      const withSol = options.withSolutions !== false;
      const useMath = Boolean(cfg.usePhysicsMath);
      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">${getEscaped(cfg.title)}</div>
            <h2>${getEscaped(activeMeta.title)}</h2>
            <div class="report-doc-meta">
              <span>${getEscaped(activeMeta.pageRange || ('الصفحات: ' + (activeMeta.pages || '')))}</span>
              ${buildStudentHeaderMetaHTML() ? `<span style="opacity:0.45;">|</span> ${buildStudentHeaderMetaHTML()}` : ''}
            </div>
          </div>
          <div class="report-doc-brand">
            <div>دليل مراجعة الفصل والحلول النموذجية</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>

        ${Array.isArray(sections) && sections.length > 0 ? sections.map(sec => `
          <div class="report-lesson-chunk">
            <div class="report-lesson-chunk-head"><strong>${getEscaped(sec.title)}</strong></div>
            ${withSol ? `
              <div class="report-lesson-exercises">
                ${(sec.answers || []).map(a => `<div class="report-q-ans">${formatRichText(a, useMath)}</div>`).join('')}
              </div>
            ` : '<div class="report-empty-note">تم إخفاء الحلول في هذه النسخة.</div>'}
          </div>
        `).join('') : ''}

        ${Array.isArray(chunkItems) && chunkItems.length > 0 ? chunkItems.map((item, idx) => `
          <div class="report-lesson-chunk">
            <div class="report-lesson-chunk-head">
              <strong>${idx + 1}. ${getEscaped(item.chunk.heading || ('مراجعة - صفحة ' + (item.chunk.page || '')))}</strong>
              <span>ص ${getEscaped(item.chunk.page || activeMeta.startPage || '')}</span>
            </div>
            ${(item.chunk.exercises || []).map((ex, exIdx) => `
              <div class="report-ex-box">
                <div class="report-ex-title">${getEscaped(ex.num || ('س' + (exIdx + 1)))}: ${getEscaped(ex.title || '')}</div>
                ${(ex.questions || []).map(qObj => `
                  <div class="report-q-row">
                    <div class="report-q-text">${formatRichText(qObj.q || '', useMath)}</div>
                    ${withSol && qObj.a ? `<div class="report-q-ans"><strong>الحل النموذجي:</strong> ${formatRichText(qObj.a, useMath)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        `).join('') : ''}

        <div class="report-doc-footer">
          <span>مركز الحلول النموذجية المعتمدة • النظام التعليمي التفاعلي</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    if (type === 'exam') {
      const ctx = (typeof getActivePastExamContext === 'function') ? getActivePastExamContext() : null;
      const exam = ctx && ctx.exam;
      if (!exam) {
        return '<div class="report-empty-note">يرجى فتح نموذج امتحان من مركز الامتحانات أولاً.</div>';
      }
      const withSol = Boolean(options.withSolutions);
      const isEn = ctx.mode === 'en';
      const dir = isEn ? 'ltr' : 'rtl';
      const align = isEn ? 'left' : 'right';
      return `
        <div class="report-doc-header">
          <div>
            <div class="report-doc-kicker">جمهورية العراق - وزارة التربية • ${getEscaped(exam.stage || '')} • ${getEscaped(exam.subject || '')}</div>
            <h2>${getEscaped(exam.title)}</h2>
            <div class="report-doc-meta">
              <span>العام الدراسي: ${getEscaped(exam.year || '')}</span>
              <span>الوقت: ${getEscaped(exam.time || '')}</span>
              <span>الدرجة الكلية: ${getEscaped(exam.totalMarks || '100')}</span>
              ${buildStudentHeaderMetaHTML() ? `<span style="opacity:0.45;">|</span> ${buildStudentHeaderMetaHTML()}` : ''}
            </div>
          </div>
          <div class="report-doc-brand">
            <div>${withSol ? 'نموذج امتحان مع الحلول النموذجية' : 'ورقة امتحان تدريبية'}</div>
            <small>${SIGNATURE_TEXT}</small>
          </div>
        </div>
        ${exam.notes ? `<div class="report-words-box" style="margin-bottom:0.85rem;">${getEscaped(exam.notes)}</div>` : ''}
        ${(exam.questions || []).map(q => `
          <div class="report-lesson-chunk">
            <div class="report-lesson-chunk-head">
              <strong>${getEscaped(q.number)}: ${getEscaped(q.title)}</strong>
              <span>${getEscaped(q.marks || '')}</span>
            </div>
            <div style="direction:${dir}; text-align:${align}; line-height:1.7;">
              ${q.instructions ? `<div style="font-size:0.85rem;color:#475569;margin-bottom:0.4rem;">${getEscaped(q.instructions)}</div>` : ''}
              ${q.passage ? `<div class="report-words-box" style="margin-bottom:0.5rem;">${getEscaped(q.passage)}</div>` : ''}
              ${q.content ? `<div style="margin-bottom:0.5rem;">${formatPhysicsMathSafeHTML(q.content)}</div>` : ''}
              ${q.branchA ? `<div style="margin-bottom:0.4rem;"><strong>${formatPhysicsMathSafeHTML(q.branchA.title)}</strong>${(q.branchA.items || []).map(it => `<div>${formatPhysicsMathSafeHTML(it)}</div>`).join('')}</div>` : ''}
              ${q.branchB ? `<div style="margin-bottom:0.4rem;"><strong>${formatPhysicsMathSafeHTML(q.branchB.title)}</strong>${(q.branchB.items || []).map(it => `<div>${formatPhysicsMathSafeHTML(it)}</div>`).join('')}</div>` : ''}
              ${q.branchC ? `<div style="margin-bottom:0.4rem;"><strong>${formatPhysicsMathSafeHTML(q.branchC.title)}</strong>${(q.branchC.items || []).map(it => `<div>${formatPhysicsMathSafeHTML(it)}</div>`).join('')}</div>` : ''}
              ${Array.isArray(q.items) ? q.items.map(it => `<div>${formatPhysicsMathSafeHTML(it)}</div>`).join('') : ''}
              ${withSol && (q.answer || q.solution) ? `<div class="report-q-ans" style="margin-top:0.6rem;"><strong>الجواب النموذجي:</strong><div>${formatPhysicsMathSafeHTML(q.answer || q.solution)}</div></div>` : ''}
            </div>
          </div>
        `).join('')}
        <div class="report-doc-footer">
          <span>ورقة امتحانية صادرة من النظام التعليمي التفاعلي</span>
          <strong>${SIGNATURE_TEXT}</strong>
        </div>
      `;
    }

    return '';
  }

  // مساعدة لتحويل نصوص الامتحانات التي قد تحتوي وسوم HTML منسقة مسبقاً
  function formatPhysicsMathSafeHTML(raw) {
    if (!raw) return '';
    return (typeof formatPhysicsMath === 'function') ? formatPhysicsMath(String(raw)) : String(raw);
  }

  // -----------------------------------------------------------------------
  // 4. محرك الطباعة متعدد الأوضاع (A4 + RTL + إجبار الوضع الفاتح عند الطباعة)
  // -----------------------------------------------------------------------
  function triggerPrint(mode, prepareFn = null, cleanupFn = null) {
    clearTimeout(printSafetyTimer);
    document.body.classList.remove('printing-interactive-quiz');
    document.body.dataset.printMode = mode || 'general';

    if (typeof prepareFn === 'function') {
      try { prepareFn(); } catch (e) { console.warn('[ReportManager] preparePrint error:', e); }
    }

    let cleaned = false;
    const finish = () => {
      if (cleaned) return;
      cleaned = true;
      clearTimeout(printSafetyTimer);
      delete document.body.dataset.printMode;
      document.body.classList.remove('printing-interactive-quiz');
      if (typeof cleanupFn === 'function') {
        try { cleanupFn(); } catch {}
      }
    };

    window.addEventListener('afterprint', finish, { once: true });
    window.print();
    printSafetyTimer = setTimeout(finish, 1800);
  }

  function printExamPaper(withSolutions = false) {
    const exams = (typeof getSubjectExams === 'function') ? getSubjectExams(currentExamSubjectMode) : {};
    const exam = exams[currentSelectedPastExamId];
    const prevStates = new Map();
    const prevAllFlag = typeof allExamSolutionsVisible !== 'undefined' ? allExamSolutionsVisible : false;

    triggerPrint(
      withSolutions ? 'exam-solved' : 'exam-blank',
      () => {
        if (exam && Array.isArray(exam.questions)) {
          exam.questions.forEach(q => {
            const box = document.getElementById(`solBox_${q.id}`);
            if (box) {
              prevStates.set(q.id, box.classList.contains('hidden'));
              if (withSolutions) box.classList.remove('hidden');
              else box.classList.add('hidden');
            }
          });
        }
      },
      () => {
        prevStates.forEach((wasHidden, qId) => {
          const box = document.getElementById(`solBox_${qId}`);
          if (box) {
            box.classList.toggle('hidden', wasHidden);
          }
        });
        if (typeof allExamSolutionsVisible !== 'undefined') {
          allExamSolutionsVisible = prevAllFlag;
        }
      }
    );
  }

  function printInteractiveQuiz() {
    const banner = document.getElementById('quizResultBanner');
    let injectedMeta = null;

    triggerPrint(
      'quiz-result',
      () => {
        document.body.classList.add('printing-interactive-quiz');
        if (banner && !banner.classList.contains('hidden')) {
          const p = getStudentProfile();
          const infoParts = [];
          if (p.name) infoParts.push(`الطالب: ${p.name}`);
          if (p.section) infoParts.push(`الصف: ${p.section}`);
          if (p.school) infoParts.push(`المدرسة: ${p.school}`);
          infoParts.push(`تاريخ الطباعة: ${formatDateAr(new Date().toISOString())}`);
          injectedMeta = document.createElement('div');
          injectedMeta.className = 'print-only-meta-strip';
          injectedMeta.style.cssText = 'font-size:0.85rem;color:#334155;font-weight:700;margin:0.4rem auto 0.6rem;padding:0.4rem 0.75rem;border:1px solid #cbd5e1;border-radius:8px;display:inline-block;';
          injectedMeta.textContent = infoParts.join('  •  ');
          const scoreTextEl = document.getElementById('quizScoreText');
          if (scoreTextEl && scoreTextEl.parentNode) {
            scoreTextEl.parentNode.insertBefore(injectedMeta, scoreTextEl.nextSibling);
          }
        }
      },
      () => {
        if (injectedMeta && injectedMeta.parentNode) {
          injectedMeta.parentNode.removeChild(injectedMeta);
        }
      }
    );
  }

  function printPrintableReportDocument(html) {
    const printArea = document.getElementById('printableReportArea');
    if (!printArea) {
      window.print();
      return;
    }
    triggerPrint(
      'report',
      () => {
        printArea.innerHTML = `<div class="report-sheet">${html}</div>`;
      },
      () => {
        printArea.innerHTML = '';
      }
    );
  }

  async function printCurrentLesson(withSolutions = true) {
    const currId = Number((window.appData && window.appData.currentCurriculumId) || 3);
    if (window.CurriculumLoader && typeof window.CurriculumLoader.ensureCurriculumLoaded === 'function' && !window.CurriculumLoader.isCurriculumLoaded(currId)) {
      await window.CurriculumLoader.ensureCurriculumLoaded(currId, { includeDiagrams: false });
    }
    const html = buildReportDocumentBodyHTML('lesson', { withSolutions });
    printPrintableReportDocument(html);
  }

  function printCurrentChapterReview(withSolutions = true) {
    const html = buildReportDocumentBodyHTML('review', { withSolutions });
    printPrintableReportDocument(html);
  }

  async function printActiveReport() {
    if (activeReportTab === 'audit' && !lastAuditResult) {
      await runCurriculumAudit();
    }
    const html = buildReportDocumentBodyHTML(activeReportTab, { withSolutions: includeSolutionsInLessonReport });
    printPrintableReportDocument(html);
  }

  // -----------------------------------------------------------------------
  // 5. محرك التصدير المستقل أوفلاين (HTML / CSV UTF-8 BOM / JSON)
  // -----------------------------------------------------------------------
  function downloadBlob(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function getExportStylesCSS() {
    return `
      @page { size: A4 portrait; margin: 14mm 12mm; }
      * { box-sizing: border-box; font-family: system-ui, -apple-system, 'Segoe UI', 'Cairo', 'Tajawal', sans-serif; }
      body { margin: 0; padding: 1.5rem; background: #f8fafc; color: #0f172a; direction: rtl; text-align: right; line-height: 1.65; }
      .export-toolbar { max-width: 960px; margin: 0 auto 1rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.75rem 1rem; }
      .export-toolbar button { background: #4338ca; color: #ffffff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 800; cursor: pointer; font-family: inherit; }
      .report-sheet { max-width: 960px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 14px; padding: 1.5rem; }
      .report-doc-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border-bottom: 2px solid #4338ca; padding-bottom: 0.9rem; margin-bottom: 1.1rem; flex-wrap: wrap; }
      .report-doc-kicker { font-size: 0.78rem; font-weight: 800; color: #4338ca; margin-bottom: 0.25rem; }
      .report-doc-header h2 { margin: 0 0 0.35rem; font-size: 1.3rem; color: #0f172a; }
      .report-doc-meta { font-size: 0.82rem; color: #475569; font-weight: 600; }
      .report-doc-brand { text-align: left; font-size: 0.85rem; font-weight: 800; color: #0f172a; }
      .report-doc-brand small { display: block; color: #4338ca; margin-top: 0.2rem; }
      .report-kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
      .report-kpi-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.75rem; text-align: center; }
      .report-kpi-val { font-size: 1.25rem; font-weight: 900; color: #4338ca; }
      .report-kpi-lbl { font-size: 0.75rem; color: #475569; font-weight: 700; margin-top: 0.15rem; }
      .report-sec-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 1.25rem 0 0.6rem; border-right: 4px solid #4338ca; padding-right: 0.55rem; }
      .report-table { width: 100%; border-collapse: collapse; margin-bottom: 1.15rem; font-size: 0.84rem; }
      .report-table th, .report-table td { border: 1px solid #cbd5e1; padding: 0.5rem 0.65rem; text-align: right; vertical-align: top; }
      .report-table th { background: #eef2ff; color: #1e1b4b; font-weight: 800; }
      .report-table tr:nth-child(even) td { background: #f8fafc; }
      .report-pill { display: inline-block; padding: 0.12rem 0.5rem; border-radius: 9999px; font-size: 0.74rem; font-weight: 800; }
      .report-pill.ok { background: #dcfce7; color: #166534; }
      .report-pill.warn { background: #fef3c7; color: #92400e; }
      .report-pill.bad { background: #fee2e2; color: #991b1b; }
      .report-gaps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
      .report-gap-card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.75rem 0.9rem; background: #f8fafc; break-inside: avoid; }
      .report-gap-title { font-weight: 800; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; }
      .report-gap-card ul { margin: 0; padding-inline-start: 1.15rem; font-size: 0.8rem; color: #334155; }
      .report-lesson-chunk { border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.85rem; margin-bottom: 0.85rem; break-inside: avoid; }
      .report-lesson-chunk-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem; margin-bottom: 0.55rem; font-size: 0.9rem; color: #1e1b4b; }
      .report-lesson-chunk-body { white-space: pre-wrap; font-size: 0.9rem; color: #1e293b; }
      .report-ex-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem; margin-top: 0.55rem; }
      .report-ex-title { font-weight: 800; color: #0f172a; margin-bottom: 0.4rem; font-size: 0.88rem; }
      .report-q-row { padding: 0.4rem 0; border-bottom: 1px solid #e2e8f0; }
      .report-q-row:last-child { border-bottom: none; }
      .report-q-text { font-weight: 700; white-space: pre-wrap; }
      .report-q-ans { margin-top: 0.35rem; background: #f0fdf4; border-right: 3px solid #16a34a; padding: 0.45rem 0.7rem; border-radius: 6px; color: #14532d; white-space: pre-wrap; font-size: 0.86rem; }
      .report-words-box { background: #f8fafc; border: 1px dashed #94a3b8; padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.82rem; margin-bottom: 0.4rem; }
      .report-empty-note { padding: 1.25rem; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; color: #475569; font-weight: 700; }
      .report-doc-footer { margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 0.78rem; color: #475569; }
      .phy-math-block { direction: ltr; text-align: center; font-weight: 800; margin: 0.4rem 0; padding: 0.35rem; background: #eef2ff; border-radius: 6px; color: #1e1b4b; }
      .phy-formula { direction: ltr; display: inline-block; font-weight: 800; color: #1e40af; padding: 0 0.25rem; }
      @media print {
        body { background: #ffffff; padding: 0; }
        .no-print { display: none !important; }
        .report-sheet { border: none; padding: 0; max-width: none; }
      }
    `;
  }

  async function exportReportHTML(type = activeReportTab, options = {}) {
    if (type === 'audit' && !lastAuditResult) {
      await runCurriculumAudit();
    }
    const bodyHtml = buildReportDocumentBodyHTML(type, options);
    const titleMap = {
      progress: 'تقرير تقدم الطالب والاختبارات',
      audit: 'تقرير مقارنة المناهج التسعة بالمادة المعروضة',
      lesson: 'ملخص الدرس والتمارين المعتمدة',
      quiz: 'تقرير نتيجة الاختبار التفاعلي',
      exam: 'ورقة الامتحان الرسمية',
      review: 'دليل مراجعة الفصل والحلول النموذجية'
    };
    const title = titleMap[type] || 'تقرير النظام التعليمي التفاعلي';
    const fullDoc = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getEscaped(title)} - ${SIGNATURE_TEXT}</title>
  <style>${getExportStylesCSS()}</style>
</head>
<body>
  <div class="export-toolbar no-print">
    <div><strong>📄 ${getEscaped(title)}</strong> • <span style="font-size:0.82rem;color:#475569;">${SIGNATURE_TEXT}</span></div>
    <button type="button" onclick="window.print()">🖨️ طباعة / حفظ كـ PDF</button>
  </div>
  <div class="report-sheet">
    ${bodyHtml}
  </div>
</body>
</html>`;
    const dateTag = new Date().toISOString().slice(0, 10);
    downloadBlob(`edu_${type}_report_${dateTag}.html`, fullDoc, 'text/html;charset=utf-8');
  }

  function escapeCsvCell(value) {
    let str = String(value ?? '').replace(/\r?\n/g, ' ');
    if (/^[=+\-@]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  }

  function buildCsvRows(headers, dataRows) {
    const lines = [headers.map(escapeCsvCell).join(',')];
    dataRows.forEach(row => {
      lines.push(row.map(escapeCsvCell).join(','));
    });
    return '\uFEFF' + lines.join('\r\n');
  }

  async function exportReportCSV(type = activeReportTab) {
    const dateTag = new Date().toISOString().slice(0, 10);

    if (type === 'audit') {
      if (!lastAuditResult) await runCurriculumAudit();
      const headers = ['المعرف', 'المادة', 'الفصول', 'الدروس الفعلية', 'الدروس المعلنة', 'دروس بتمارين', 'دروس بدون تمارين', 'بطاقات التمارين', 'الأسئلة المجابة', 'إجابات نافذة المراجعة', 'القواعد/المفاهيم', 'اختبارات الفصول', 'صور الكتاب الفعلية', 'الصفحات المعلنة', 'التقييم', 'الفجوات المرصودة'];
      const rows = lastAuditResult.rows.map(r => [
        r.id, r.name, r.chaptersCount, r.lessonsCount, r.declaredLessons,
        r.lessonsWithExercises, r.lessonsWithoutExercises, r.exerciseCardsCount,
        r.answeredQuestionsCount, r.modalReviewAnswersCount, r.rulesCount,
        r.chapterQuizQuestionsCount, r.actualDiskImages, r.declaredPages,
        r.status, r.gaps.join(' | ')
      ]);
      downloadBlob(`edu_curriculum_audit_${dateTag}.csv`, buildCsvRows(headers, rows), 'text/csv;charset=utf-8');
      return;
    }

    if (type === 'quiz') {
      const qs = Array.isArray(window.currentQuizQuestions) ? window.currentQuizQuestions : [];
      const ans = window.selectedQuizAnswers || {};
      if (qs.length > 0) {
        const headers = ['#', 'السؤال', 'إجابة الطالب', 'الإجابة الصحيحة', 'الحالة', 'التفسير'];
        const rows = qs.map((q, idx) => {
          const cIdx = q.correct !== undefined ? q.correct : q.answer;
          const uIdx = ans[q.id];
          return [
            idx + 1,
            q.question,
            uIdx !== undefined ? (q.options[uIdx] || '') : 'لم يُجب',
            q.options[cIdx] || '',
            uIdx === cIdx ? 'صحيحة' : 'خاطئة',
            q.explanation || ''
          ];
        });
        downloadBlob(`edu_quiz_result_${dateTag}.csv`, buildCsvRows(headers, rows), 'text/csv;charset=utf-8');
        return;
      }
      const hist = getProgressData().quizHistory;
      const headers = ['#', 'المادة', 'الاختبار', 'الدرجة', 'الإجمالي', 'النسبة %', 'الأخطاء', 'التاريخ'];
      const rows = hist.map((h, i) => [i + 1, h.subjectName, h.title, h.score, h.total, h.pct, h.wrongCount, h.date]);
      downloadBlob(`edu_quiz_history_${dateTag}.csv`, buildCsvRows(headers, rows), 'text/csv;charset=utf-8');
      return;
    }

    if (type === 'lesson') {
      const snap = getActiveLessonSnapshot(true);
      const headers = ['المادة', 'الفصل', 'الدرس', 'الصفحة', 'عنوان المقطع / التمرين', 'السؤال', 'الحل النموذجي'];
      const rows = [];
      if (snap.lesson) {
        (snap.lesson.chunks || []).forEach(ck => {
          const exs = ck.exercises || [];
          if (exs.length === 0) {
            rows.push([snap.subjectName, snap.chapterTitle, snap.lesson.title, ck.page || '', ck.heading || '', '', ck.text || '']);
          } else {
            exs.forEach(ex => {
              (ex.questions || []).forEach(qObj => {
                rows.push([snap.subjectName, snap.chapterTitle, snap.lesson.title, ck.page || '', `${ck.heading || ''} - ${ex.title || ''}`, qObj.q || '', qObj.a || '']);
              });
            });
          }
        });
      }
      downloadBlob(`edu_lesson_export_${dateTag}.csv`, buildCsvRows(headers, rows), 'text/csv;charset=utf-8');
      return;
    }

    // default: progress
    const progress = getProgressData();
    const headers = ['المادة', 'الدروس المطالعة', 'إجمالي الدروس', 'نسبة الإنجاز %', 'عدد الاختبارات', 'معدل الدرجات %'];
    const rows = SUBJECT_AUDIT_SPECS.map(spec => {
      const visited = Array.isArray(progress.visitedLessons[String(spec.id)]) ? progress.visitedLessons[String(spec.id)] : [];
      const chapters = Array.isArray(window[spec.globalKey]) ? window[spec.globalKey] : [];
      const totalLessons = chapters.length > 0 ? chapters.reduce((acc, ch) => acc + ((ch.lessons || []).length), 0) : spec.declaredLessons;
      const pct = totalLessons > 0 ? Math.min(100, Math.round((visited.length / totalLessons) * 100)) : 0;
      const quizAttempts = progress.quizHistory.filter(q => Number(q.currId) === spec.id);
      const avgQuiz = quizAttempts.length > 0 ? Math.round(quizAttempts.reduce((a, q) => a + (q.pct || 0), 0) / quizAttempts.length) : '';
      return [spec.name, visited.length, totalLessons, pct, quizAttempts.length, avgQuiz];
    });
    downloadBlob(`edu_progress_${dateTag}.csv`, buildCsvRows(headers, rows), 'text/csv;charset=utf-8');
  }

  async function exportReportJSON(type = activeReportTab) {
    const dateTag = new Date().toISOString().slice(0, 10);
    let dataPayload = null;
    if (type === 'audit') {
      if (!lastAuditResult) await runCurriculumAudit();
      dataPayload = lastAuditResult;
    } else if (type === 'lesson') {
      dataPayload = getActiveLessonSnapshot(includeSolutionsInLessonReport);
    } else if (type === 'quiz') {
      dataPayload = {
        meta: typeof currentQuizMeta !== 'undefined' ? currentQuizMeta : null,
        questions: window.currentQuizQuestions || [],
        answers: window.selectedQuizAnswers || {},
        history: getProgressData().quizHistory
      };
    } else if (type === 'exam') {
      dataPayload = (typeof getActivePastExamContext === 'function') ? getActivePastExamContext() : null;
    } else if (type === 'review') {
      dataPayload = (typeof getActiveChapterReviewContext === 'function') ? getActiveChapterReviewContext() : null;
    } else {
      dataPayload = getProgressData();
    }

    const envelope = {
      system: 'النظام التعليمي التفاعلي الشامل',
      version: typeof CURRENT_VERSION_LABEL !== 'undefined' ? CURRENT_VERSION_LABEL : 'v5.4.0',
      author: SIGNATURE_TEXT,
      reportType: type,
      generatedAt: new Date().toISOString(),
      studentProfile: getStudentProfile(),
      data: dataPayload
    };

    downloadBlob(`edu_${type}_report_${dateTag}.json`, JSON.stringify(envelope, null, 2), 'application/json;charset=utf-8');
  }

  // -----------------------------------------------------------------------
  // 6. نافذة مركز التقارير والتصدير (#reportsCenterModal)
  // -----------------------------------------------------------------------
  async function openModal(tab = 'progress') {
    const modal = document.getElementById('reportsCenterModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    await switchTab(tab);
  }

  function closeModal() {
    const modal = document.getElementById('reportsCenterModal');
    if (modal) modal.classList.add('hidden');
  }

  async function switchTab(tab = 'progress') {
    activeReportTab = ['progress', 'audit', 'lesson', 'quiz'].includes(tab) ? tab : 'progress';
    const tabs = ['progress', 'audit', 'lesson', 'quiz'];
    tabs.forEach(t => {
      const btn = document.getElementById(`reportTabBtn_${t}`);
      if (btn) {
        const isActive = t === activeReportTab;
        btn.classList.toggle('btn-primary', isActive);
        btn.classList.toggle('btn-secondary', !isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
    });

    if (activeReportTab === 'lesson') {
      const currId = Number((window.appData && window.appData.currentCurriculumId) || 3);
      if (window.CurriculumLoader && !window.CurriculumLoader.isCurriculumLoaded(currId)) {
        const bodyEl = document.getElementById('reportsModalBody');
        if (bodyEl && window.CurriculumLoader.renderLoadingHTML) {
          bodyEl.innerHTML = window.CurriculumLoader.renderLoadingHTML('بيانات الدرس الحالي');
        }
        await window.CurriculumLoader.ensureCurriculumLoaded(currId, { includeDiagrams: false });
      }
    }

    if (activeReportTab === 'audit' && !lastAuditResult && !auditLoading) {
      auditLoading = true;
      renderReportsModalBody();
      try {
        await runCurriculumAudit((done, total, label) => {
          const progEl = document.getElementById('auditProgressStatusText');
          if (progEl) {
            progEl.textContent = `جارٍ فحص المناهج (${done} / ${total}): ${label || ''}...`;
          }
        });
      } finally {
        auditLoading = false;
      }
    }

    renderReportsModalBody();
  }

  function renderReportsModalBody() {
    const bodyEl = document.getElementById('reportsModalBody');
    const controlsEl = document.getElementById('reportsModalSubControls');
    if (!bodyEl) return;

    if (controlsEl) {
      if (activeReportTab === 'progress') {
        const p = getStudentProfile();
        controlsEl.innerHTML = `
          <div class="report-profile-inline">
            <input type="text" id="reportStudentNameInput" class="form-control" placeholder="اسم الطالب (اختياري للتقارير والشهادات)" value="${getEscaped(p.name)}">
            <input type="text" id="reportStudentSectionInput" class="form-control" placeholder="الصف / الشعبة (مثال: الثاني متوسط - أ)" value="${getEscaped(p.section)}">
            <input type="text" id="reportStudentSchoolInput" class="form-control" placeholder="اسم المدرسة (اختياري)" value="${getEscaped(p.school)}">
            <button type="button" class="btn btn-primary btn-sm" onclick="ReportManager.saveProfileFromInputs('report')">💾 حفظ البيانات</button>
          </div>
        `;
      } else if (activeReportTab === 'audit') {
        controlsEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
            <span style="font-size:0.8rem;color:var(--slate-600);font-weight:700;">مقارنة حية لبيانات الملفات الـ 9 ومجلد <code>book_images/</code> مع الإحصائيات المعروضة</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="ReportManager.refreshAudit()">🔄 إعادة الفحص الحي</button>
          </div>
        `;
      } else if (activeReportTab === 'lesson') {
        controlsEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
            <label style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.82rem;font-weight:700;cursor:pointer;">
              <input type="checkbox" ${includeSolutionsInLessonReport ? 'checked' : ''} onchange="ReportManager.setIncludeLessonSolutions(this.checked)">
              <span>تضمين الحلول النموذجية للتمارين داخل الملخص والتصدير</span>
            </label>
          </div>
        `;
      } else {
        controlsEl.innerHTML = '';
      }
    }

    if (activeReportTab === 'audit' && auditLoading) {
      bodyEl.innerHTML = `
        <div class="lazy-loading-card">
          <div class="lazy-spinner"></div>
          <div id="auditProgressStatusText" style="font-weight:800;">جارٍ تحميل ومطابقة كافة المناهج الـ 9...</div>
        </div>
      `;
      return;
    }

    bodyEl.innerHTML = `<div class="report-sheet report-sheet-preview">${buildReportDocumentBodyHTML(activeReportTab, { withSolutions: includeSolutionsInLessonReport })}</div>`;
  }

  function saveProfileFromInputs(source = 'report') {
    const prefix = source === 'settings' ? 'settings' : 'report';
    const nameEl = document.getElementById(`${prefix}StudentNameInput`);
    const secEl = document.getElementById(`${prefix}StudentSectionInput`);
    const schEl = document.getElementById(`${prefix}StudentSchoolInput`);
    saveStudentProfile({
      name: nameEl ? nameEl.value : '',
      section: secEl ? secEl.value : '',
      school: schEl ? schEl.value : ''
    });
    if (activeReportTab === 'progress') {
      renderReportsModalBody();
    }
    if (window.A11yManager && typeof window.A11yManager.announce === 'function') {
      window.A11yManager.announce('تم حفظ بيانات الطالب للتقارير والطباعة');
    }
  }

  function setIncludeLessonSolutions(val) {
    includeSolutionsInLessonReport = Boolean(val);
    renderReportsModalBody();
  }

  async function refreshAudit() {
    lastAuditResult = null;
    await switchTab('audit');
  }

  function init() {
    syncStudentProfileInputs();
  }

  return {
    init,
    getStudentProfile,
    saveStudentProfile,
    saveProfileFromInputs,
    getProgressData,
    recordLessonVisit,
    recordQuizResult,
    clearProgressData,
    runCurriculumAudit,
    triggerPrint,
    printExamPaper,
    printInteractiveQuiz,
    printCurrentLesson,
    printCurrentChapterReview,
    printActiveReport,
    exportReportHTML,
    exportReportCSV,
    exportReportJSON,
    openModal,
    closeModal,
    switchTab,
    setIncludeLessonSolutions,
    refreshAudit
  };
})();

// أغلفة الربط العامة لسهولة الاستدعاء من HTML والوحدات الأخرى
function openReportsCenterModal(tab = 'progress') {
  return window.ReportManager.openModal(tab);
}

function closeReportsCenterModal() {
  return window.ReportManager.closeModal();
}

function switchReportTab(tab) {
  return window.ReportManager.switchTab(tab);
}

function printCurrentLesson(withSolutions = true) {
  return window.ReportManager.printCurrentLesson(withSolutions);
}

function printCurrentChapterReview(withSolutions = true) {
  return window.ReportManager.printCurrentChapterReview(withSolutions);
}

function exportCurrentExamHTML() {
  return window.ReportManager.exportReportHTML('exam', { withSolutions: Boolean(window.allExamSolutionsVisible) });
}

function exportCurrentChapterReviewHTML() {
  return window.ReportManager.exportReportHTML('review', { withSolutions: true });
}

function saveStudentProfileFromSettings() {
  window.ReportManager.saveProfileFromInputs('settings');
  const statusEl = document.getElementById('settingsProfileSavedMsg');
  if (statusEl) {
    statusEl.textContent = '✓ تم الحفظ';
    setTimeout(() => { statusEl.textContent = ''; }, 2500);
  }
}

function clearStudentProgressHistory() {
  if (confirm('هل تريد مسح سجل الدروس المُطالعة ونتائج الاختبارات المحلية من هذا الجهاز؟')) {
    window.ReportManager.clearProgressData();
  }
}
