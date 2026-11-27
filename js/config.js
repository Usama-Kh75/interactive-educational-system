// =========================================================================
// ثوابت النظام، المتغيرات العامة، الدوال المساعدة، وسجل المناهج الخفيف
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

const LEGACY_STORAGE_KEY = 'interactive_educational_system_v2';
const STORAGE_KEY = 'interactive_edu_state_v1';
const BUILTIN_CURRICULUM_IDS = new Set([3, 4, 5, 6, 7, 8, 9, 10, 11]);
const CURRENT_VERSION = '5.13.2';
const CURRENT_VERSION_LABEL = 'v5.13.2';
const SYSTEM_VERSION = 'v5.13.2';
const SYSTEM_AUTHOR = 'المهندس أسامة خليل هاشم';
const LAST_SEEN_VERSION_KEY = 'interactive_edu_last_seen_version';
const DISMISSED_UPDATE_KEY = 'interactive_edu_dismissed_update';
const LS_PREFIX = 'interactive_edu_';

// فحص بيئة التشغيل
const IS_LOCAL_SERVER = (
  window.location.protocol === 'http:' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
);

// سجل البيانات التعريفية الخفيف للمناهج التسعة المعتمدة (للإقلاع الفوري والتحميل الكسول)
const BUILTIN_CURRICULA_META = [
  {
    id: 3,
    name: 'اللغة الانجليزية - الثاني متوسط (English for Iraq)',
    subject: 'English',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: '',
    description: 'المنهج الرسمي المعتمد لوزارة التربية متضمناً كافة الوحدات والقصص والقواعد والنصوص مع القراءة الصوتية.',
    scripts: ['curriculum_data.js'],
    globalKey: 'CURRICULUM_DATA',
    metaChaptersCount: 10,
    metaLessonsCount: 84,
    metaRulesCount: 43
  },
  {
    id: 4,
    name: 'اللغة العربية (الجزء الأول) - الثاني متوسط',
    subject: 'اللغة العربية',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'arabic_p1',
    description: 'المنهج الرسمي المعتمد لكتاب اللغة العربية (الجزء الأول): المطالعة والنصوص القرآنية والأدبية، قواعد اللغة العربية، الإملاء، والخط والتعبير مع القراءة الصوتية وعارض الصفحات الأصلية.',
    scripts: ['curriculum_data_arabic.js'],
    globalKey: 'ARABIC_CURRICULUM_P1',
    metaChaptersCount: 10,
    metaLessonsCount: 40,
    metaRulesCount: 18
  },
  {
    id: 5,
    name: 'اللغة العربية (الجزء الثاني) - الثاني متوسط',
    subject: 'اللغة العربية',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'arabic_p2',
    description: 'المنهج الرسمي المعتمد لكتاب اللغة العربية (الجزء الثاني): نصوص الفداء والإحسان والربيع وإرادة الحياة، وقواعد النداء والاستفهام والمضارع والمثنى والجموع والمقصور والمنقوص والممدود والممنوع من الصرف.',
    scripts: ['curriculum_data_arabic.js'],
    globalKey: 'ARABIC_CURRICULUM_P2',
    metaChaptersCount: 10,
    metaLessonsCount: 40,
    metaRulesCount: 0
  },
  {
    id: 6,
    name: 'التربية الإسلامية - الثاني متوسط',
    subject: 'التربية الإسلامية',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'islamic',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب التربية الإسلامية: أحكام التلاوة والمد العارض للسكون، السور الكريمة (النبأ، القيامة، المزمل، الجمعة، والصف)، الأحاديث النبوية، العقيدة والمعجزات، فقه الصلاة والجماعة والليل والآيات والصوم والسجود، السيرة النبوية والتراجم، ومكارم الأخلاق والتهذيب.',
    scripts: ['curriculum_data_islamic.js'],
    globalKey: 'ISLAMIC_CURRICULUM',
    metaChaptersCount: 6,
    metaLessonsCount: 31,
    metaRulesCount: 15
  },
  {
    id: 7,
    name: 'الفيزياء - الثاني متوسط',
    subject: 'الفيزياء',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'physics',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الفيزياء: الحركة والقوة، قوانين الحركة لنيوتن والجاذبية، الشغل والقدرة والطاقة، الآلات البسيطة والعتلات، الحركة الموجية والصوت، والضوء والمرايا والعدسات مع القراءة الصوتية وعارض الصفحات الأصلية.',
    scripts: ['curriculum_data_physics.js'],
    diagramsScript: 'curriculum_diagrams_physics.js',
    globalKey: 'PHYSICS_CURRICULUM',
    diagramsGlobalKey: 'PHYSICS_DIAGRAMS',
    metaChaptersCount: 6,
    metaLessonsCount: 20,
    metaRulesCount: 18
  },
  {
    id: 8,
    name: 'الرياضيات - الثاني متوسط',
    subject: 'الرياضيات',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'math',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الرياضيات الموحد (7 فصول كاملة • 196 صفحة أصلية): الأعداد النسبية، الأعداد الحقيقية، الحدوديات والمقادير الجبرية، المعادلات والمتباينات، الهندسة والقياس، الهندسة الإحداثية، والإحصاء والاحتمالات مع 17 لوحة هندسية وبيانية SVG وبنك القوانين والنظريات ونماذج الامتحانات والحلول النموذجية الشاملة.',
    scripts: ['curriculum_data_math.js'],
    diagramsScript: 'curriculum_diagrams_math.js',
    globalKey: 'MATH_CURRICULUM',
    diagramsGlobalKey: 'MATH_DIAGRAMS',
    metaChaptersCount: 7,
    metaLessonsCount: 51,
    metaRulesCount: 22
  },
  {
    id: 9,
    name: 'الاجتماعيات - الثاني متوسط',
    subject: 'الاجتماعيات',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'social',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الاجتماعيات (الباب الأول: جغرافية العالم العربي وتضاريسه ومناخه وموارده وسكانه ونشاطه الاقتصادي، والباب الثاني: تاريخ العالم العربي وشبه الجزيرة ومكة المكرمة والسيرة النبوية الشريفة في مكة والمدينة) مع ربط كافة صفحات المحتوى (4–139) و 71 بطاقة تمارين و 164 سؤالاً محلولاً والقراءة الصوتية.',
    scripts: ['curriculum_data_social.js'],
    globalKey: 'SOCIAL_CURRICULUM',
    metaChaptersCount: 6,
    metaLessonsCount: 39,
    metaRulesCount: 13
  },
  {
    id: 10,
    name: 'الكيمياء - الثاني متوسط',
    subject: 'الكيمياء',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'chemistry',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الكيمياء: العناصر والترابط الكيميائي، المركبات الأيونية والتساهمية وقوى الترابط، الصيغ والتفاعلات الكيميائية وموازنة المعادلات، المحاليل والذوبان وطرائق الفصل، الحوامض والقواعد، والدلائل ومقياس الرقم الهيدروجيني والأملاح مع الرسوم التوضيحية المتجهية وعارض الصفحات الأصلية والحلول النموذجية الشاملة.',
    scripts: ['curriculum_data_chemistry.js'],
    diagramsScript: 'curriculum_diagrams_chemistry.js',
    globalKey: 'CHEMISTRY_CURRICULUM',
    diagramsGlobalKey: 'CHEMISTRY_DIAGRAMS',
    metaChaptersCount: 6,
    metaLessonsCount: 21,
    metaRulesCount: 24
  },
  {
    id: 11,
    name: 'علم الأحياء - الثاني متوسط',
    subject: 'علم الأحياء',
    grade: 'الثاني متوسط',
    status: 'approved',
    image_folder: 'biology',
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب علم الأحياء: علم التصنيف وممالك الكائنات الحية الخمس، الكائنات الحية البسيطة (الطليعيات والفطريات والأشنات)، مملكة النباتات (الحزازيات والسرخسيات والبذرية)، مملكة الحيوانات (اللافقريات والفقريات)، والبيئة ومكوناتها وتوازنها ودورات العناصر في الطبيعة مع الرسوم التوضيحية المتجهية وعارض الصفحات الأصلية والحلول النموذجية الشاملة.',
    scripts: ['curriculum_data_biology.js'],
    diagramsScript: 'curriculum_diagrams_biology.js',
    globalKey: 'BIOLOGY_CURRICULUM',
    diagramsGlobalKey: 'BIOLOGY_DIAGRAMS',
    metaChaptersCount: 7,
    metaLessonsCount: 21,
    metaRulesCount: 28
  }
];

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeForAttribute(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/`/g, '\\`').replace(/\n/g, ' ');
}

function lsGet(name, legacyKey = null) {
  const v = localStorage.getItem(LS_PREFIX + name);
  if (v !== null) return v;
  if (legacyKey) {
    const oldVal = localStorage.getItem(legacyKey);
    if (oldVal !== null) {
      localStorage.setItem(LS_PREFIX + name, oldVal);
      localStorage.removeItem(legacyKey);
      return oldVal;
    }
  }
  return null;
}

function lsSet(name, val) {
  localStorage.setItem(LS_PREFIX + name, String(val));
}

// التحقق مما إذا كان المنهج الحالي هو منهج اللغة الإنجليزية حصراً (المؤهل للقراءة الصوتية)
function isEnglishCurriculum(currId) {
  const id = Number(currId !== undefined ? currId : (window.appData ? appData.currentCurriculumId : 3));
  return id === 3;
}

// دالة مساعدة لتنظيف وتطبيع النص العربي للبحث الذكي
function normalizeArabicSearchText(txt) {
  if (!txt) return '';
  return String(txt)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// مطابقة ذكية تدعم الكلمات المتعددة والتطبيع العربي الكامل
function matchesNormalizedQuery(haystack, query) {
  const normQ = normalizeArabicSearchText(query);
  if (!normQ) return true;
  const normH = normalizeArabicSearchText(haystack);
  if (!normH) return false;
  const tokens = normQ.split(' ').filter(Boolean);
  return tokens.every(tok => normH.includes(tok));
}

// دالة تهيئة وتنسيق الرموز والمعادلات الرياضية والفيزيائية ومنع أي تشوه في نصوص RTL
function formatPhysicsMath(text, options = {}) {
  if (!text || typeof text !== 'string') return text || '';
  text = text.replace(/\u20d7/g, '');

  function cleanFormula(s, isBlock) {
    if (!s) return '';
    let str = s.trim();
    for (let i = 0; i < 5; i++) {
      if (!str.includes('text{')) break;
      str = str.replace(/\\?text\{([^{}]+)\}/g, '$1');
    }
    for (let i = 0; i < 5; i++) {
      if (!str.includes('sqrt{')) break;
      str = str.replace(/\\?sqrt\{([^{}]+)\}/g, '√($1)');
    }
    for (let i = 0; i < 5; i++) {
      if (!str.includes('frac{')) break;
      str = str.replace(/\\?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
    }
    str = str.replace(/\\times/g, '×').replace(/\btimes\b/g, '×');
    str = str.replace(/\\cdot/g, '·').replace(/\bcdot\b/g, '·');
    str = str.replace(/\\approx/g, '≈').replace(/\bapprox\b/g, '≈');
    str = str.replace(/\\Rightarrow/g, ' ⇐ ').replace(/\bRightarrow\b/g, ' ⇐ ');
    str = str.replace(/\\mu\s*s/g, 'μs').replace(/\bmu\s*s\b/g, 'μs');
    str = str.replace(/\\mu/g, 'μ').replace(/\bmu\b/g, 'μ');
    str = str.replace(/\\theta/g, 'θ').replace(/\btheta\b/g, 'θ');
    str = str.replace(/\\eta/g, 'η').replace(/\beta\b/g, 'η');
    str = str.replace(/\\%/g, '%');
    str = str.replace(/\^\\circ/g, '°').replace(/\^circ/g, '°');
    str = str.replace(/\^{12}/g, '¹²').replace(/\^{-15}/g, '⁻¹⁵').replace(/\^{-12}/g, '⁻¹²').replace(/\^{-9}/g, '⁻⁹').replace(/\^{-6}/g, '⁻⁶').replace(/\^{-3}/g, '⁻³').replace(/\^{-2}/g, '⁻²');
    str = str.replace(/\^{9}/g, '⁹').replace(/\^{8}/g, '⁸').replace(/\^{6}/g, '⁶').replace(/\^{3}/g, '³').replace(/\^{2}/g, '²');
    str = str.replace(/\^12/g, '¹²').replace(/\^-15/g, '⁻¹⁵').replace(/\^-12/g, '⁻¹²').replace(/\^-9/g, '⁻⁹').replace(/\^-6/g, '⁻⁶').replace(/\^-3/g, '⁻³').replace(/\^-2/g, '⁻²');
    str = str.replace(/\^9/g, '⁹').replace(/\^8/g, '⁸').replace(/\^6/g, '⁶').replace(/\^3/g, '³').replace(/\^2/g, '²').replace(/\^1/g, '¹').replace(/\^0/g, '⁰');
    str = str.replace(/_1/g, '₁').replace(/_2/g, '₂').replace(/_3/g, '₃').replace(/_4/g, '₄');
    str = str.replace(/_f/g, '<sub>f</sub>').replace(/_i/g, '<sub>i</sub>').replace(/_R/g, '<sub>R</sub>');
    str = str.replace(/\\/g, '');
    str = str.replace(/\s+/g, ' ').trim();
    if (isBlock) {
      return `<div dir='ltr' class='phy-math-block'>${str}</div>`;
    }
    return `<span dir='ltr' class='phy-formula'>${str}</span>`;
  }

  text = text.replace(/\$\$([^\$]+)\$\$/g, (m, inner) => cleanFormula(inner, true));
  text = text.replace(/\$([^\$]+)\$/g, (m, inner) => cleanFormula(inner, false));

  if (options && options.skipInline) return text;
  return isolateInlineMathHTML(text);
}

// عزل التعابير والجذور والمعادلات الرياضية المضمنة داخل النصوص العربية باتجاه LTR معزول
function isolateInlineMathHTML(htmlText) {
  if (!htmlText || typeof htmlText !== 'string') return htmlText || '';

  const MARK_OPEN = '\uE001';
  const MARK_CLOSE = '\uE002';

  function stripTrailingPunct(s) {
    while (s.length > 0) {
      if (/[ \t.,:!?'"—–،؛؟]$/.test(s)) {
        if (s.endsWith(';') && /&(?:[A-Za-z]+|#\d+|#x[0-9A-Fa-f]+);$/.test(s)) break;
        s = s.slice(0, -1);
      } else {
        break;
      }
    }
    return s;
  }

  function splitAtUnmatchedParens(seg) {
    const parts = [];
    let start = 0;
    let bal = 0;
    let lastOpenAtBal0 = -1;
    for (let i = 0; i < seg.length; i++) {
      const ch = seg[i];
      if (ch === '(') {
        if (bal === 0) lastOpenAtBal0 = i;
        bal++;
      } else if (ch === ')') {
        if (bal === 0) {
          parts.push(seg.slice(start, i + 1));
          start = i + 1;
          lastOpenAtBal0 = -1;
        } else {
          bal--;
          if (bal === 0) lastOpenAtBal0 = -1;
        }
      }
    }
    let tail = seg.slice(start);
    if (bal > 0 && lastOpenAtBal0 >= start) {
      const rel = lastOpenAtBal0 - start;
      if (rel > 0) {
        parts.push(tail.slice(0, rel));
        tail = tail.slice(rel);
      }
    }
    if (tail) parts.push(tail);
    return parts;
  }

  function trimMathRun(raw, atLineStart) {
    let s = raw;
    s = s.replace(/^[ \t.,:;!?'"—–،؛؟]+/, '');
    s = s.replace(/^\d+[).:]\s+/, '');
    if (atLineStart) s = s.replace(/^-\s+/, '');
    s = s.replace(/^[ \t.,:;!?'"—–،؛؟]+/, '');
    s = stripTrailingPunct(s);

    let changed = true;
    while (changed && s.length > 0) {
      changed = false;
      const pairs = [['(', ')'], ['[', ']'], ['{', '}']];
      for (const [open, close] of pairs) {
        let bal = 0;
        for (const ch of s) {
          if (ch === open) bal++;
          else if (ch === close) bal--;
        }
        const isHalfOpen = (open === '[' && close === ']' && s.startsWith('[') && s.endsWith(')')) ||
                           (open === '(' && close === ')' && s.startsWith('(') && s.endsWith(']'));
        if (bal > 0) {
          if (s.endsWith(open)) {
            s = stripTrailingPunct(s.slice(0, -1));
            changed = true;
            break;
          }
          if (s.startsWith(open) && !isHalfOpen) {
            s = s.slice(1).replace(/^[ \t.,:;!?'"—–]+/, '');
            changed = true;
            break;
          }
        } else if (bal < 0) {
          if (s.startsWith(close)) {
            s = s.slice(1).replace(/^[ \t.,:;!?'"—–]+/, '');
            changed = true;
            break;
          }
          if (s.endsWith(close) && !isHalfOpen) {
            s = stripTrailingPunct(s.slice(0, -1));
            changed = true;
            break;
          }
        }
      }
    }
    s = s.replace(/^[ \t.,:;!?'"—–،؛؟]+/, '');
    s = stripTrailingPunct(s);
    return s;
  }

  function isMathSpan(s) {
    const clean = s.replace(/[\uE001\uE002]/g, '');
    if (!clean) return false;
    if (/[√∛∜⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾₀₁₂₃₄₅₆₇₈₉¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⁄±×÷·=≠≈≡≤≥<>≪≫^|∈∉⊂⊃⊆⊇∪∩∅∞Δπθλμη∠°′″⇒⇐→➔↔\u0304]/.test(clean)) return true;
    if (/&(?:lt|gt);/.test(clean)) return true;
    if (/(?:^|[\s(\[{,])[+-]\d/.test(clean)) return true;
    if (/[A-Za-z0-9)]\s*\/\s*[A-Za-z0-9(]/.test(clean)) return true;
    if (/[(\[{]\s*[-+A-Za-z0-9.]+\s*,\s*[-+A-Za-z0-9.]+/.test(clean)) return true;
    if (/(?:\d[A-Za-z]|[A-Za-z]\d|\b[A-Za-z]\b\s*[+-]\s*\b[A-Za-z0-9]\b)/.test(clean)) return true;
    if (/(?:^|[\s(\[{,])[+-][A-Za-z](?:\b|$)/.test(clean)) return true;
    return false;
  }

  function isolatePlainSegment(seg) {
    if (!seg) return '';
    // حماية وسوم <mark class="search-hit"> أثناء العزل حتى لا ينكسر التظليل داخل المعادلات
    const hadMarks = seg.includes('<mark');
    let work = hadMarks
      ? seg.replace(/<mark class="search-hit">/g, MARK_OPEN).replace(/<\/mark>/g, MARK_CLOSE)
      : seg;

    const lines = work.split(/(\r?\n)/);
    const out = lines.map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part.replace(/[^\u0600-\u06FF\u060C\u061B\u061F]+/g, (match, offset) => {
        const subParts = splitAtUnmatchedParens(match);
        return subParts.map((sub, sIdx) => {
          const trimmed = trimMathRun(sub, offset === 0 && sIdx === 0);
          if (!isMathSpan(trimmed)) return sub;
          const pos = sub.indexOf(trimmed);
          const prefix = sub.slice(0, pos);
          const suffix = sub.slice(pos + trimmed.length);
          return `${prefix}<span dir="ltr" class="math-ltr">${trimmed}</span>${suffix}`;
        }).join('');
      });
    }).join('');

    return hadMarks
      ? out.replace(/\uE001/g, '<mark class="search-hit">').replace(/\uE002/g, '</mark>')
      : out;
  }

  // تجنب المساس بالكتل المعزولة مسبقاً أو وسوم HTML (باستثناء <mark class="search-hit"> و <code>)
  const tokenRe = /(<(?:span|div)\b[^>]*\bdir\s*=\s*['"]ltr['"][^>]*>[\s\S]*?<\/(?:span|div)>|<code\b[^>]*>[\s\S]*?<\/code>|<(?!\/?mark\b)[^>]+>)/gi;
  let result = '';
  let lastIndex = 0;
  for (const m of htmlText.matchAll(tokenRe)) {
    const start = m.index || 0;
    if (start > lastIndex) {
      result += isolatePlainSegment(htmlText.slice(lastIndex, start));
    }
    const tagBlock = m[0];
    if (/^<code\b/i.test(tagBlock) && !/\bdir\s*=/i.test(tagBlock) && !/[\u0600-\u06FF]/.test(tagBlock)) {
      result += tagBlock.replace(/^<code\b/i, '<code dir="ltr" class="math-ltr-code"');
    } else {
      result += tagBlock;
    }
    lastIndex = start + tagBlock.length;
  }
  if (lastIndex < htmlText.length) {
    result += isolatePlainSegment(htmlText.slice(lastIndex));
  }
  return result;
}

// متغيرات الحالة المشتركة
let pendingUpdateData = null;
let pendingServiceWorker = null;

let appData = {
  curriculums: [],
  currentCurriculumId: 3,
  currentLessonId: null
};

let selectedQuizAnswers = {};
let currentQuizQuestions = [];
let currentActiveGrammarFilter = 'all';
let currentCurriculumViewTab = 3;
let currentExamSubjectMode = 'auto';
let currentSelectedPastExamId = null;
let allExamSolutionsVisible = false;
