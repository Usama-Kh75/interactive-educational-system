// =========================================================================
// محرك وبنك الاختبارات التفاعلية المنهجية الشاملة لكافة المواد الـ 9
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

// =========================================================================
// محرك وبنك الاختبارات التفاعلية المنهجية الشاملة لكافة المواد الـ 9 (10+ أسئلة لكل فصل)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================
// currentQuizQuestions معرف في النطاق العام
// selectedQuizAnswers معرف في النطاق العام
let quizTimerInterval = null;
let quizTimerSecondsRemaining = 900; // 15 دقيقة
let quizTimerActive = false;
let instantFeedbackMode = true;
let quizLoadToken = 0;
let currentQuizMeta = {
  currId: 3,
  chapterId: null,
  title: '',
  subjectName: ''
};

// أسماء المواد المعتمدة بالنظام
const QUIZ_SUBJECT_NAMES = {
  3: 'اللغة الإنجليزية (English for Iraq)',
  4: 'اللغة العربية - الجزء الأول',
  5: 'اللغة العربية - الجزء الثاني',
  6: 'التربية الإسلامية وأحكام التلاوة',
  7: 'مادة الفيزياء',
  8: 'مادة الرياضيات',
  9: 'مادة الاجتماعيات',
  10: 'مادة الكيمياء',
  11: 'مادة علم الأحياء'
};

async function ensureQuizzesReady(reqToken) {
  if (CurriculumLoader.isQuizzesLoaded()) return true;
  const container = document.getElementById('quizQuestionsContainer');
  if (container) {
    container.innerHTML = CurriculumLoader.renderLoadingHTML('بنك الاختبارات التفاعلية (640 سؤالاً)');
  }
  const ok = await CurriculumLoader.ensureQuizzesLoaded();
  if (reqToken !== quizLoadToken) return false;
  if (!ok) {
    if (container) {
      container.innerHTML = CurriculumLoader.renderErrorHTML('بنك الاختبارات التفاعلية', 'startSelectedChapterQuiz()');
    }
    return false;
  }
  return true;
}

// تعبئة قائمة فصول المادة المحددة في واجهة الاختبار
function populateQuizChaptersDropdown(currId, selectedChapId = null) {
  const select = document.getElementById('quizChapterSelect');
  if (!select) return;
  select.innerHTML = '';

  const chaptersMap = window.CHAPTER_QUIZZES ? window.CHAPTER_QUIZZES[currId] : null;
  if (!chaptersMap) {
    select.innerHTML = '<option value="">-- لا تتوفر فصول --</option>';
    return;
  }

  const chapterIds = Object.keys(chaptersMap).map(Number).sort((a, b) => a - b);
  chapterIds.forEach((chapId, idx) => {
    const quizObj = chaptersMap[chapId];
    const opt = document.createElement('option');
    opt.value = chapId;
    opt.textContent = `${quizObj.title} (${quizObj.questions.length} أسئلة)`;
    if (selectedChapId && Number(selectedChapId) === chapId) {
      opt.selected = true;
    } else if (!selectedChapId && idx === 0) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

// عند تغيير المادة من القائمة المنسدلة في شاشة الاختبار
async function onQuizSubjectChanged() {
  const reqToken = ++quizLoadToken;
  const subSelect = document.getElementById('quizSubjectSelect');
  if (!subSelect) return;
  const currId = Number(subSelect.value) || 3;
  appData.currentCurriculumId = currId;
  saveData();
  if (!(await ensureQuizzesReady(reqToken))) return;
  populateQuizChaptersDropdown(currId);
  const chapSelect = document.getElementById('quizChapterSelect');
  if (chapSelect && chapSelect.value) {
    await loadChapterQuiz(currId, Number(chapSelect.value));
  }
}

// بدء اختبار الفصل المحدد في القوائم المنسدلة
async function startSelectedChapterQuiz() {
  const subSelect = document.getElementById('quizSubjectSelect');
  const chapSelect = document.getElementById('quizChapterSelect');
  const currId = Number(subSelect ? subSelect.value : (appData.currentCurriculumId || 3));
  const chapId = Number(chapSelect ? chapSelect.value : null);
  if (chapId) {
    await startChapterQuiz(currId, chapId);
  } else {
    await startRandomSubjectQuiz(currId);
  }
}

// بدء اختبار الفصل والانتقال لشاشة الاختبارات
async function startChapterQuiz(currId, chapterId) {
  const reqToken = ++quizLoadToken;
  const cId = Number(currId) || 3;
  const chId = Number(chapterId);

  // الانتقال للتبويب أولاً لعرض مؤشر التحميل إذا لم يُحمّل بنك الأسئلة بعد
  switchTab('exams', { skipExamsRender: true });
  await switchExamSubtab('interactive', true);

  const subSelect = document.getElementById('quizSubjectSelect');
  if (subSelect) subSelect.value = cId;

  const quizView = document.getElementById('interactiveQuizViewContainer');
  if (quizView) quizView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!(await ensureQuizzesReady(reqToken))) return;

  populateQuizChaptersDropdown(cId, chId);
  await loadChapterQuiz(cId, chId);
}

// توليد اختبار عشوائي من فصول المادة المختارة
async function startRandomSubjectQuiz(specificCurrId = null) {
  const reqToken = ++quizLoadToken;
  const currId = Number(specificCurrId || (document.getElementById('quizSubjectSelect')?.value) || (appData.currentCurriculumId || 3));

  switchTab('exams', { skipExamsRender: true });
  await switchExamSubtab('interactive', true);

  const subSelect = document.getElementById('quizSubjectSelect');
  if (subSelect) subSelect.value = currId;

  const quizView = document.getElementById('interactiveQuizViewContainer');
  if (quizView) quizView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!(await ensureQuizzesReady(reqToken))) return;

  populateQuizChaptersDropdown(currId);

  const qs = (typeof getRandomQuestionsForCurriculum === 'function')
    ? getRandomQuestionsForCurriculum(currId, 10)
    : [];

  if (!qs || qs.length === 0) {
    alert('لا تتوفر أسئلة عشوائية لهذه المادة حالياً.');
    return;
  }

  const subjName = QUIZ_SUBJECT_NAMES[currId] || 'المادة المحددة';
  setupQuizData(qs, `اختبار عشوائي شامل - ${subjName}`, subjName, currId, null);
}

// تحميل اختبار الفصل من بنك الاختبارات
async function loadChapterQuiz(currId, chapterId) {
  const reqToken = ++quizLoadToken;
  const cId = Number(currId);
  const chId = Number(chapterId);

  if (!(await ensureQuizzesReady(reqToken))) return;

  const quizData = (typeof getChapterQuiz === 'function') ? getChapterQuiz(cId, chId) : null;
  if (!quizData) {
    console.warn('Quiz not found for curr:', cId, 'chap:', chId);
    return;
  }

  const subjName = QUIZ_SUBJECT_NAMES[cId] || 'المادة الدراسية';
  setupQuizData(quizData.questions, quizData.title, subjName, cId, chId);
}

// خلط ترتيب خيارات كل سؤال مع تحديث فهرس الإجابة الصحيحة دون المساس بالبيانات الأصلية
function prepareShuffledQuizQuestions(rawQuestions) {
  return (rawQuestions || []).map((q) => {
    const origOpts = Array.isArray(q.options) ? q.options : [];
    const origCorrect = (q.correct !== undefined) ? Number(q.correct) : Number(q.answer ?? 0);
    const tagged = origOpts.map((text, idx) => ({ text, isCorrect: idx === origCorrect }));
    for (let i = tagged.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
    }
    const newCorrect = Math.max(0, tagged.findIndex((item) => item.isCorrect));
    return {
      ...q,
      options: tagged.map((item) => item.text),
      correct: newCorrect,
      answer: newCorrect
    };
  });
}

// تهيئة بيانات الاختبار وتحديث الواجهة
function setupQuizData(questions, title, subjectName, currId = 3, chapterId = null) {
  currentQuizQuestions = prepareShuffledQuizQuestions(questions);
  selectedQuizAnswers = {};
  currentQuizMeta = {
    currId: Number(currId),
    chapterId: chapterId ? Number(chapterId) : null,
    title: title || 'اختبار تفاعلي منهجي',
    subjectName: subjectName || QUIZ_SUBJECT_NAMES[currId] || ''
  };

  // تحديث العناوين
  const subtitle = document.getElementById('examSubtitle');
  if (subtitle) {
    subtitle.innerHTML = `<strong>${currentQuizMeta.subjectName}:</strong> ${currentQuizMeta.title} (${currentQuizQuestions.length} أسئلة منهجية معتمدة)`;
  }

  // إخفاء بطاقة النتيجة وإظهار زر الإرسال
  const banner = document.getElementById('quizResultBanner');
  if (banner) banner.classList.add('hidden');
  const filterMistakesBtn = document.getElementById('btnFilterMistakes');
  if (filterMistakesBtn) filterMistakesBtn.style.display = '';
  const submitBtn = document.getElementById('submitQuizBtn');
  if (submitBtn) {
    submitBtn.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>✅</span> تسليم الإجابات وإنهاء الاختبار';
  }

  // إعادة ضبط المؤقت
  resetQuizTimer();

  // رسم الأسئلة وشريط التقدم وشبكة القفز
  renderQuizQuestions();
  updateQuizProgressUI();
}

// رسم أسئلة الاختبار في الحاوية التفاعلية
function renderQuizQuestions() {
  const container = document.getElementById('quizQuestionsContainer');
  if (!container) return;
  container.innerHTML = '';

  if (!currentQuizQuestions || currentQuizQuestions.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--slate-500); font-weight: 700;">لا توجد أسئلة متوفرة لهذا الفصل حالياً.</div>';
    return;
  }

  const currId = currentQuizMeta.currId || Number(appData.currentCurriculumId || 3);
  const useMathFmt = (currId === 7 || currId === 8 || currId === 10) && typeof formatPhysicsMath === 'function';
  const isEnCurr = (typeof isEnglishCurriculum === 'function') ? isEnglishCurriculum(currId) : (currId === 3);

  currentQuizQuestions.forEach((q, idx) => {
    const isArabicText = !isEnCurr || /[\u0600-\u06FF]/.test(q.question);
    const textDir = isArabicText ? 'rtl' : 'ltr';
    const textAlign = isArabicText ? 'right' : 'left';
    const optionLetters = isArabicText ? ['أ', 'ب', 'ج', 'د', 'هـ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];
    const fmtQuiz = (s) => useMathFmt ? formatPhysicsMath(s) : s;

    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.id = `quiz-q-${q.id}`;
    qDiv.style.position = 'relative';

    qDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-weight: 800; background: var(--primary-light); color: var(--primary); padding: 0.15rem 0.55rem; border-radius: 9999px;">
            سؤال ${idx + 1} من ${currentQuizQuestions.length}
          </span>
          <span id="q-status-badge-${q.id}" style="font-size: 0.72rem; font-weight: 700; color: var(--slate-400);">لم يُجب بعد</span>
        </div>
        ${!isArabicText ? `
          <button type="button" class="mini-listen-btn" onclick="speakQuizQuestion(${q.id})" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;" title="استمع للسؤال باللغة الإنجليزية">
            🔊 استمع للسؤال
          </button>
        ` : ''}
      </div>

      <div style="font-size: 0.95rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.85rem; direction: ${textDir}; text-align: ${textAlign}; line-height: 1.65;">
        ${fmtQuiz(q.question)}
      </div>

      <div class="options-group">
        ${q.options.map((opt, optIdx) => `
          <button type="button" class="quiz-option" id="opt-${q.id}-${optIdx}" onclick="selectQuizAnswer(${q.id}, ${optIdx})" style="direction: ${textDir}; text-align: ${textAlign}; font-size: 0.88rem; font-weight: 600;">
            <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background: rgba(0,0,0,0.06); font-size: 0.72rem; font-weight: 800; margin-left: 0.5rem; margin-right: 0.5rem;">
              ${optionLetters[optIdx] || String.fromCharCode(65 + optIdx)}
            </span>
            ${fmtQuiz(opt)}
          </button>
        `).join('')}
      </div>

      <div id="explanation-${q.id}" class="hidden" style="margin-top: 0.85rem; padding: 0.75rem 1rem; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 8px; font-size: 0.82rem; color: var(--slate-700); direction: ${textDir}; text-align: ${textAlign}; line-height: 1.65; box-shadow: var(--shadow-sm);">
        <strong style="color: var(--primary);">💡 التفسير والشرح النموذجي: </strong><span>${fmtQuiz(q.explanation || 'إجابة منهجية معتمدة وفق كتاب وزارة التربية العراقية.')}</span>
      </div>
    `;
    container.appendChild(qDiv);
  });

  renderQuestionJumpGrid();
}

// توليد شبكة أزرار القفز السريع بين الأسئلة (1 .. 10)
function renderQuestionJumpGrid() {
  const grid = document.getElementById('quizJumpGrid');
  if (!grid) return;
  grid.innerHTML = '';

  currentQuizQuestions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = `jump-btn-${q.id}`;
    btn.className = 'quiz-jump-btn';
    btn.textContent = (idx + 1);
    btn.title = `الذهاب للسؤال ${idx + 1}`;
    btn.onclick = () => jumpToQuizQuestion(q.id);
    grid.appendChild(btn);
  });
}

// القفز المباشر لسؤال محدد مع وميض التركيز
function jumpToQuizQuestion(qId) {
  const el = document.getElementById(`quiz-q-${qId}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.style.transition = 'all 0.3s ease';
  el.style.boxShadow = '0 0 0 3px #6366f1, 0 10px 25px rgba(99, 102, 241, 0.2)';
  setTimeout(() => {
    el.style.boxShadow = '';
  }, 1200);
}

// اختيار إجابة السؤال والتصحيح الفوري
function selectQuizAnswer(qId, optIdx) {
  selectedQuizAnswers[qId] = optIdx;
  const q = currentQuizQuestions.find(item => item.id === qId);
  if (!q) return;

  const correctTarget = (q.correct !== undefined) ? q.correct : q.answer;
  const isCorrect = (optIdx === correctTarget);

  // تحديث حالة الأزرار
  q.options.forEach((_, idx) => {
    const btn = document.getElementById(`opt-${qId}-${idx}`);
    if (btn) {
      btn.classList.remove('selected', 'correct', 'wrong');
      if (idx === optIdx) {
        btn.classList.add('selected');
      }
      // إذا كان نمط التصحيح الفوري مفعلاً
      if (instantFeedbackMode) {
        if (idx === correctTarget) {
          btn.classList.add('correct');
        } else if (idx === optIdx && !isCorrect) {
          btn.classList.add('wrong');
        }
      }
    }
  });

  // إظهار التفسير في نمط التصحيح الفوري
  const exp = document.getElementById(`explanation-${qId}`);
  if (exp && instantFeedbackMode) {
    exp.classList.remove('hidden');
    if (isCorrect) {
      exp.style.background = 'var(--success-light)';
      exp.style.borderColor = '#86efac';
    } else {
      exp.style.background = '#fef2f2';
      exp.style.borderColor = '#fca5a5';
    }
  }

  // تحديث شارة حالة السؤال
  const statusBadge = document.getElementById(`q-status-badge-${qId}`);
  if (statusBadge) {
    if (instantFeedbackMode) {
      statusBadge.innerHTML = isCorrect ? '<span style="color: #059669; font-weight: 800;">✓ إجابة صحيحة</span>' : '<span style="color: #dc2626; font-weight: 800;">✗ إجابة خاطئة</span>';
    } else {
      statusBadge.innerHTML = '<span style="color: var(--primary); font-weight: 800;">تمت الإجابة</span>';
    }
  }

  // تحديث زر القفز السريع
  const jumpBtn = document.getElementById(`jump-btn-${qId}`);
  if (jumpBtn) {
    jumpBtn.classList.add('answered');
    if (instantFeedbackMode) {
      if (isCorrect) {
        jumpBtn.classList.add('correct');
        jumpBtn.classList.remove('wrong');
      } else {
        jumpBtn.classList.add('wrong');
        jumpBtn.classList.remove('correct');
      }
    }
  }

  updateQuizProgressUI();
}

// تحديث مؤشرات شريط التقدم ونسبة الإنجاز
function updateQuizProgressUI() {
  const total = currentQuizQuestions.length;
  if (total === 0) return;
  const answeredCount = Object.keys(selectedQuizAnswers).length;
  const pct = Math.round((answeredCount / total) * 100);

  const progText = document.getElementById('quizProgressText');
  if (progText) progText.textContent = `تمت إجابة ${answeredCount} من ${total} أسئلة`;

  const accText = document.getElementById('quizAccuracyText');
  if (accText) accText.textContent = `نسبة الإنجاز: ${pct}%`;

  const bar = document.getElementById('quizProgressBar');
  if (bar) bar.style.width = `${pct}%`;
}

// تسليم الاختبار وحساب الدرجة وإظهار شهادة الإنجاز
function submitQuiz() {
  stopQuizTimer();

  let score = 0;
  let wrongQuestions = [];
  const total = currentQuizQuestions.length;

  currentQuizQuestions.forEach(q => {
    const userAns = selectedQuizAnswers[q.id];
    const correctTarget = (q.correct !== undefined) ? q.correct : q.answer;
    const isCorrect = (userAns === correctTarget);

    if (isCorrect) {
      score++;
    } else {
      wrongQuestions.push(q);
    }

    // إبراز الإجابات النموذجية لجميع الأسئلة
    q.options.forEach((_, idx) => {
      const btn = document.getElementById(`opt-${q.id}-${idx}`);
      if (btn) {
        btn.classList.remove('correct', 'wrong');
        if (idx === correctTarget) {
          btn.classList.add('correct');
        } else if (idx === userAns && !isCorrect) {
          btn.classList.add('wrong');
        }
      }
    });

    // إظهار التفسير لجميع الأسئلة
    const exp = document.getElementById(`explanation-${q.id}`);
    if (exp) {
      exp.classList.remove('hidden');
      if (isCorrect) {
        exp.style.background = 'var(--success-light)';
        exp.style.borderColor = '#86efac';
      } else {
        exp.style.background = '#fef2f2';
        exp.style.borderColor = '#fca5a5';
      }
    }

    // تحديث زر القفز بلون النتيجة
    const jumpBtn = document.getElementById(`jump-btn-${q.id}`);
    if (jumpBtn) {
      jumpBtn.classList.remove('correct', 'wrong');
      jumpBtn.classList.add(isCorrect ? 'correct' : 'wrong');
    }

    const statusBadge = document.getElementById(`q-status-badge-${q.id}`);
    if (statusBadge) {
      statusBadge.innerHTML = isCorrect ? '<span style="color: #059669; font-weight: 800;">✓ إجابة صحيحة</span>' : '<span style="color: #dc2626; font-weight: 800;">✗ إجابة خاطئة</span>';
    }
  });

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  if (window.ReportManager && typeof window.ReportManager.recordQuizResult === 'function') {
    window.ReportManager.recordQuizResult({
      currId: currentQuizMeta.currId,
      chapterId: currentQuizMeta.chapterId,
      subjectName: currentQuizMeta.subjectName,
      title: currentQuizMeta.title,
      score,
      total,
      pct,
      wrongCount: wrongQuestions.length
    });
  }

  // إظهار شهادة التميز ولوحة النتيجة
  const banner = document.getElementById('quizResultBanner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const medalIcon = document.getElementById('quizMedalIcon');
  if (medalIcon) {
    medalIcon.textContent = pct >= 90 ? '🏆' : (pct >= 75 ? '🥇' : (pct >= 50 ? '🎖️' : '📚'));
  }

  const gradeBadge = document.getElementById('quizGradeBadge');
  if (gradeBadge) {
    if (pct >= 90) {
      gradeBadge.textContent = `ممتاز (${pct}%)`;
      gradeBadge.style.background = '#059669';
    } else if (pct >= 75) {
      gradeBadge.textContent = `جيد جداً (${pct}%)`;
      gradeBadge.style.background = '#4f46e5';
    } else if (pct >= 50) {
      gradeBadge.textContent = `جيد (${pct}%)`;
      gradeBadge.style.background = '#d97706';
    } else {
      gradeBadge.textContent = `يحتاج مراجعة (${pct}%)`;
      gradeBadge.style.background = '#dc2626';
    }
  }

  const scoreTitle = document.getElementById('quizScoreTitle');
  if (scoreTitle) {
    if (pct >= 90) scoreTitle.textContent = 'ممتاز جداً! أداء استثنائي متكامل';
    else if (pct >= 75) scoreTitle.textContent = 'أحسنت! إتقان متقدم لمفاهيم الفصل';
    else if (pct >= 50) scoreTitle.textContent = 'جيد! تم اجتياز الاختبار بنجاح';
    else scoreTitle.textContent = 'تحتاج لمراجعة مفاهيم هذا الفصل مجدداً';
  }

  const scoreText = document.getElementById('quizScoreText');
  if (scoreText) {
    scoreText.textContent = `النتيجة الرسمية لاختبار ${currentQuizMeta.subjectName} — ${currentQuizMeta.title}: درجتك ${score} من ${total} (${pct}%)`;
  }

  const pedagogicalFeedback = document.getElementById('quizPedagogicalFeedback');
  if (pedagogicalFeedback) {
    pedagogicalFeedback.innerHTML = `أجبت بشكل صحيح على <strong>${score}</strong> أسئلة، وأخطأت في <strong>${wrongQuestions.length}</strong> أسئلة من أصل ${total} سؤالاً. تم إعداد هذا الاختبار وفق المعايير الوزارية الرسمية — إعداد المهندس أسامة خليل هاشم.`;
  }

  const filterMistakesBtn = document.getElementById('btnFilterMistakes');
  if (filterMistakesBtn) {
    filterMistakesBtn.style.display = wrongQuestions.length > 0 ? '' : 'none';
  }

  // إخفاء زر التسليم
  const submitBtn = document.getElementById('submitQuizBtn');
  if (submitBtn) submitBtn.classList.add('hidden');
}

// إعادة خوض نفس الاختبار وتصفير الاختيارات
function resetCurrentQuiz() {
  selectedQuizAnswers = {};
  currentQuizQuestions = prepareShuffledQuizQuestions(currentQuizQuestions);
  const banner = document.getElementById('quizResultBanner');
  if (banner) banner.classList.add('hidden');
  const filterMistakesBtn = document.getElementById('btnFilterMistakes');
  if (filterMistakesBtn) filterMistakesBtn.style.display = '';
  const submitBtn = document.getElementById('submitQuizBtn');
  if (submitBtn) submitBtn.classList.remove('hidden');

  renderQuizQuestions();
  updateQuizProgressUI();
  resetQuizTimer();

  const quizView = document.getElementById('interactiveQuizViewContainer');
  if (quizView) quizView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// استعراض وتصفية الأسئلة التي أخطأ بها الطالب فقط للتركيز عليها
function filterIncorrectQuestionsOnly() {
  currentQuizQuestions.forEach(q => {
    const userAns = selectedQuizAnswers[q.id];
    const correctTarget = (q.correct !== undefined) ? q.correct : q.answer;
    const isCorrect = (userAns === correctTarget);
    const qEl = document.getElementById(`quiz-q-${q.id}`);
    if (qEl) {
      if (isCorrect) {
        qEl.style.display = 'none';
      } else {
        qEl.style.display = 'block';
      }
    }
  });
  alert('تمت تصفية الأسئلة لعرض الأسئلة التي تحتاج إلى مراجعة وتصحيح فقط.');
  const container = document.getElementById('quizQuestionsContainer');
  if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// طباعة نتائج الاختبار والشهادة
function printInteractiveQuiz() {
  if (window.ReportManager && typeof window.ReportManager.printInteractiveQuiz === 'function') {
    window.ReportManager.printInteractiveQuiz();
    return;
  }
  document.body.classList.add('printing-interactive-quiz');
  const cleanup = () => document.body.classList.remove('printing-interactive-quiz');
  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
  setTimeout(cleanup, 1000);
}

// قراءة السؤال صوتياً عبر محرك TTS (مخصص لأسئلة اللغة الإنجليزية فقط)
function speakQuizQuestion(qId) {
  const q = currentQuizQuestions.find(item => item.id === qId);
  if (!q) return;
  const isEnCurr = (typeof isEnglishCurriculum === 'function')
    ? isEnglishCurriculum(currentQuizMeta.currId)
    : (Number(currentQuizMeta.currId) === 3);
  const isEnglish = isEnCurr && !(/[\u0600-\u06FF]/.test(q.question));
  if (!isEnglish) return;

  const cleanPart = (s) => String(s || '')
    .replace(/_{2,}/g, ' blank ')
    .replace(/\([^)]*[\u0600-\u06FF][^)]*\)/g, '')
    .replace(/[\u0600-\u06FF]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const optionsSpeech = (q.options || [])
    .map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${cleanPart(opt)}`)
    .join('. ');
  const textToSpeak = `${cleanPart(q.question)}. ${optionsSpeech}`;

  if (typeof speakSnippet === 'function') {
    speakSnippet(textToSpeak, 'en');
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }
}

// تفعيل / إيقاف المؤقت التنازلي الذكي (15 دقيقة)
function toggleQuizTimer() {
  quizTimerActive = !quizTimerActive;
  const display = document.getElementById('quizTimerDisplay');
  const btn = document.getElementById('btnToggleQuizTimer');
  if (quizTimerActive) {
    if (display) display.classList.remove('hidden');
    if (btn) btn.innerHTML = '⏸️ إيقاف المؤقت';
    startQuizTimer();
  } else {
    if (btn) btn.innerHTML = '⏱️ تشغيل المؤقت (15 دقيقة)';
    stopQuizTimer();
  }
}

function startQuizTimer() {
  stopQuizTimer();
  const display = document.getElementById('quizTimerDisplay');
  quizTimerInterval = setInterval(() => {
    if (quizTimerSecondsRemaining > 0) {
      quizTimerSecondsRemaining--;
      const mins = Math.floor(quizTimerSecondsRemaining / 60);
      const secs = quizTimerSecondsRemaining % 60;
      if (display) {
        display.textContent = `⏳ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (quizTimerSecondsRemaining <= 60) {
          display.style.background = '#fef2f2';
          display.style.color = '#dc2626';
          display.style.borderColor = '#fca5a5';
        }
      }
    } else {
      stopQuizTimer();
      alert('⏰ انتهى وقت الاختبار المحدد (15 دقيقة)! سيتم تسليم إجاباتك الآن تلقائياً.');
      submitQuiz();
    }
  }, 1000);
}

function stopQuizTimer() {
  if (quizTimerInterval) {
    clearInterval(quizTimerInterval);
    quizTimerInterval = null;
  }
}

function resetQuizTimer() {
  stopQuizTimer();
  quizTimerSecondsRemaining = 900;
  const display = document.getElementById('quizTimerDisplay');
  if (display) {
    display.textContent = '⏳ 15:00';
    display.style.background = '';
    display.style.color = '';
    display.style.borderColor = '';
  }
  if (quizTimerActive) {
    startQuizTimer();
  }
}

// تفعيل / إلغاء نمط التصحيح الفوري
function toggleInstantFeedbackMode() {
  instantFeedbackMode = !instantFeedbackMode;
  const txt = document.getElementById('instantFeedbackStatusText');
  if (txt) {
    txt.textContent = instantFeedbackMode ? 'مفعّل' : 'معطّل';
    txt.style.color = instantFeedbackMode ? '#059669' : '#dc2626';
  }
}

// توليد اختبار فوري على الدرس المختار (يربط بالوحدة/الفصل)
async function generateQuizForCurrentLesson() {
  const currId = Number(appData.currentCurriculumId || 3);
  const lessonId = appData.currentLessonId;

  if (lessonId && BUILTIN_CURRICULUM_IDS.has(currId) && !CurriculumLoader.isCurriculumLoaded(currId)) {
    await CurriculumLoader.ensureCurriculumLoaded(currId, { includeDiagrams: false });
  }
  await CurriculumLoader.ensureQuizzesLoaded();

  let targetChapterId = null;

  // البحث عن الفصل التابع له الدرس المختار في هيكلية المنهج
  if (lessonId && typeof getCurriculumChapters === 'function') {
    const chapters = getCurriculumChapters(currId) || [];
    for (const ch of chapters) {
      if ((ch.lessons || []).some(l => l.id === lessonId)) {
        targetChapterId = ch.id;
        break;
      }
    }
  }

  // إذا لم يتم تحديد الفصل من الدرس، اختر الفصل الأول المتوفر
  if (!targetChapterId && window.CHAPTER_QUIZZES && window.CHAPTER_QUIZZES[currId]) {
    const chapIds = Object.keys(window.CHAPTER_QUIZZES[currId]).map(Number);
    if (chapIds.length > 0) {
      targetChapterId = chapIds[0];
    }
  }

  if (targetChapterId) {
    await startChapterQuiz(currId, targetChapterId);
  } else {
    await startRandomSubjectQuiz(currId);
  }
}
