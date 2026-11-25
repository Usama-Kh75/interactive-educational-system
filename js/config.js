// =========================================================================
// ثوابت النظام، المتغيرات العامة، الدوال المساعدة، وسجل المناهج الخفيف
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

const LEGACY_STORAGE_KEY = 'interactive_educational_system_v2';
const STORAGE_KEY = 'interactive_edu_state_v1';
const BUILTIN_CURRICULUM_IDS = new Set([3, 4, 5, 6, 7, 8, 9, 10, 11]);
const CURRENT_VERSION = '5.7.0';
const CURRENT_VERSION_LABEL = 'v5.7.0';
const SYSTEM_VERSION = 'v5.7.0';
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
    description: 'المنهج الرسمي المعتمد لكتاب اللغة العربية (الجزء الثاني): نصوص الفداء والإحسان والربيع وإرادة الحياة، وقواعد النداء والاستفهام والمضارع والجموع والميزان الصرفي.',
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
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الرياضيات (الجزء الأول والثاني): الأعداد النسبية، الأعداد الحقيقية، الحدوديات والمقادير الجبرية، المعادلات والمتباينات، الهندسة والقياس، الهندسة الإحداثية، والإحصاء والاحتمالات مع 17 لوحة هندسية وبيانية SVG وبنك القوانين والنظريات ونماذج الامتحانات والحلول النموذجية الشاملة.',
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
    description: 'المنهج الرسمي المعتمد لوزارة التربية العراقية لكتاب الاجتماعيات (الباب الأول: جغرافية العالم العربي وتضاريسه ومناخه وموارده وسكانه ونشاطه الاقتصادي، والباب الثاني: تاريخ العالم العربي وشبه الجزيرة ومكة المكرمة والسيرة النبوية الشريفة في مكة والمدينة) مع القراءة الصوتية وعارض الصفحات والحلول النموذجية الشاملة.',
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
    metaLessonsCount: 15,
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
function formatPhysicsMath(text) {
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
  return text;
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
