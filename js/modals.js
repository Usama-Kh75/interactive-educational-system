// =========================================================================
// المحرك الموحد لنوافذ المراجعات والحلول النموذجية (8 مواد) والرسوم التوضيحية (3 مواد)
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

const PHYSICS_REVIEW_CHAPTERS_META = [
  { id: 7014, chapterNum: 1, title: 'الفصل 1: الحركة', subtitle: 'القياس، الحركة والسرعة، والتعجيل', pages: '21 - 23', startPage: 21 },
  { id: 7023, chapterNum: 2, title: 'الفصل 2: قوانين الحركة', subtitle: 'قوانين نيوتن الثلاثة، الجاذبية، والسقوط الحر', pages: '32 - 33', startPage: 32 },
  { id: 7033, chapterNum: 3, title: 'الفصل 3: الشغل والقدرة والطاقة', subtitle: 'حسابات الشغل، القدرة، الطاقة وتحولاتها', pages: '43 - 45', startPage: 43 },
  { id: 7043, chapterNum: 4, title: 'الفصل 4: الآلات البسيطة', subtitle: 'العتلات بأنواعها الثلاث، البكرات، وكفاءة الآلة', pages: '54 - 55', startPage: 54 },
  { id: 7053, chapterNum: 5, title: 'الفصل 5: الحركة الموجية والصوت', subtitle: 'الموجات، سرعة الصوت والصدى، والموجات فوق الصوتية', pages: '68 - 70', startPage: 68 },
  { id: 7064, chapterNum: 6, title: 'الفصل 6: الضوء', subtitle: 'الانعكاس والمرايا، الانكسار والعدسات، وتفسير الرؤية', pages: '87 - 88', startPage: 87 }
];

const ARABIC_P1_REVIEW_UNITS_META = [
  { id: 401, unitNum: 1, title: 'الوحدة 1: رعاية الله ووعده', subtitle: 'علامات الإعراب الأصلية والفرعية، سورة القصص، الخط القياسي وغير القياسي، والنص التقويمي', pages: '5 - 21', startPage: 8, primaryLessonId: 4013 },
  { id: 402, unitNum: 2, title: 'الوحدة 2: الإخاء', subtitle: 'الأسماء الخمسة، الأخوة في الإسلام حديث شريف، ووصية أب لابنه', pages: '22 - 33', startPage: 25, primaryLessonId: 4023 },
  { id: 403, unitNum: 3, title: 'الوحدة 3: الطموح وعلو الهمة', subtitle: 'الميزان الصرفي، قصيدة الشابي إرادة الحياة، ورسم الهمزة على السطر', pages: '34 - 50', startPage: 37, primaryLessonId: 4033 },
  { id: 404, unitNum: 4, title: 'الوحدة 4: المرء يخلد بعلمه وعمله', subtitle: 'الفعل اللازم والفعل المتعدي، العلم والعمل، والتطبيقات النحوية', pages: '51 - 63', startPage: 54, primaryLessonId: 4043 },
  { id: 405, unitNum: 5, title: 'الوحدة 5: نحن وعلوم العربية', subtitle: 'نائب الفاعل، لغتنا الجميلة ومكانتها، ورسم الهمزة على الواو والياء', pages: '64 - 80', startPage: 68, primaryLessonId: 4053 },
  { id: 406, unitNum: 6, title: 'الوحدة 6: أمجادنا وحضارتنا', subtitle: 'المفعول فيه ظرفا الزمان والمكان، وحضارة وادي الرافدين', pages: '81 - 92', startPage: 84, primaryLessonId: 4063 },
  { id: 407, unitNum: 7, title: 'الوحدة 7: من عجائب عالم الحيوان', subtitle: 'المفعول المطلق وأنواعه، غرائب الطيور والحيوانات، وهجرة الحيوانات', pages: '93 - 104', startPage: 97, primaryLessonId: 4073 },
  { id: 408, unitNum: 8, title: 'الوحدة 8: النهر والحياة', subtitle: 'الحال وأنواعه وصاحب الحال، القرية والنهر، وقصيدة النهر والمدينة', pages: '105 - 118', startPage: 109, primaryLessonId: 4083 },
  { id: 409, unitNum: 9, title: 'الوحدة 9: أحباب الله', subtitle: 'الاستثناء بـ إلا وأركانه، يوم الطفل العالمي، وقصة بائعة الكبريت', pages: '119 - 132', startPage: 122, primaryLessonId: 4093 }
];

const ARABIC_P2_REVIEW_UNITS_META = [
  { id: 501, unitNum: 1, title: 'الوحدة 1: فداءٌ لِوَطَنِي', subtitle: 'النداء وأنواع المنادى، تميم البرغوثي، الهمزة المتوسطة على السطر، وحارث السوداني', pages: '3 - 17', startPage: 7, primaryLessonId: 5013 },
  { id: 502, unitNum: 2, title: 'الوحدة 2: هَلْ جَزَاءُ الإِحْسَانِ إِلَّا الإِحْسَانُ', subtitle: 'الاستفهام وأدواته، حكاية الطائي والنعمان، وقصة شيما والأسد', pages: '18 - 33', startPage: 22, primaryLessonId: 5023 },
  { id: 503, unitNum: 3, title: 'الوحدة 3: نِسَاءٌ فِي القِمَّةِ', subtitle: 'بناء الفعل المضارع، نازك الملائكة، الألف اللينة، وابنة السهروردي', pages: '34 - 48', startPage: 37, primaryLessonId: 5033 },
  { id: 504, unitNum: 4, title: 'الوحدة 4: الرَّبِيعُ', subtitle: 'المثنى والملحق به، قصيدة أبي تمام، ودنيا الرافعي في جمال الطبيعة', pages: '49 - 60', startPage: 53, primaryLessonId: 5043 },
  { id: 505, unitNum: 5, title: 'الوحدة 5: كُنُــــوزُ العِــــلْمِ', subtitle: 'جمع المذكر السالم، جابر بن حيان، علامات الترقيم، وبيت الحكمة', pages: '61 - 79', startPage: 65, primaryLessonId: 5053 },
  { id: 506, unitNum: 6, title: 'الوحدة 6: إِرَادَةُ الحَيَاةِ', subtitle: 'جمع المؤنث السالم والملحق به، قصيدة الشابي، وإرادة الكفاح', pages: '80 - 92', startPage: 83, primaryLessonId: 5063 },
  { id: 507, unitNum: 7, title: 'الوحدة 7: جَمَــــالُ بِلاَدِي', subtitle: 'جمع التكسير (أوزان القلة والكثرة وصيغ منتهى الجموع)، الجواهري، وشارع الأميرات', pages: '93 - 105', startPage: 97, primaryLessonId: 5073 },
  { id: 508, unitNum: 8, title: 'الوحدة 8: نُورٌ مِنَ السَّمَاءِ', subtitle: 'الأسماء: المقصور والمنقوص والممدود، فاروق جويدة، والرحمة النبوية', pages: '106 - 120', startPage: 110, primaryLessonId: 5083 },
  { id: 509, unitNum: 9, title: 'الوحدة 9: الغَرْسُ الطَّيِّبُ', subtitle: 'الممنوع من الصرف وأحكامه، الغرس والعطاء، والصخور الكبيرة في الحياة', pages: '121 - 132', startPage: 124, primaryLessonId: 5093 }
];

const ISLAMIC_REVIEW_UNITS_META = [
  { id: 600, unitNum: 'أحكام التلاوة', title: 'أحكام التلاوة: المد العارض للسكون', subtitle: 'تعريف المد العارض وشروطه ومقداره وتطبيقاته مع مد اللين وعلامات الوقف', pages: '4 - 6', startPage: 4, primaryLessonId: 6001 },
  { id: 601, unitNum: 1, title: 'الوحدة 1: سورة النبأ، المعجزة، علامات المنافق، الصلاة، فتح مكة، وآداب عامة', subtitle: 'القرآن والعقيدة والحديث والعبادات والسيرة والتهذيب', pages: '7 - 29', startPage: 7, primaryLessonId: 6011 },
  { id: 602, unitNum: 2, title: 'الوحدة 2: سورة القيامة، معجزات الرسول، الأمر بالمعروف، صلاة الجماعة والليل، أخلاق الرسول، وآداب شخصية', subtitle: 'أهوال الساعة، دلائل النبوة، صلاة الجماعة، الشمائل المحمدية، وآداب التكنولوجيا', pages: '30 - 52', startPage: 30, primaryLessonId: 6021 },
  { id: 603, unitNum: 3, title: 'الوحدة 3: سورة المزمل، معجزات موسى، حرمة المسلم، صلاة الآيات، أمهات المؤمنين وعمر بن الخطاب، والإيثار', subtitle: 'ترتيل القرآن، فلق البحر، صلاة الكسوف والخسوف، أمهات المؤمنين، والفاروق', pages: '53 - 77', startPage: 53, primaryLessonId: 6031 },
  { id: 604, unitNum: 4, title: 'الوحدة 4: سورة الجمعة، معجزات عيسى، في الأخلاق، الصوم، عثمان بن عفان وجعفر الطيار، والإسراف والتبذير', subtitle: 'صلاة الجمعة، معجزات عيسى، فريضة الصيام، ذو النورين وجعفر الطيار، ومحاربة التبذير', pages: '78 - 99', startPage: 78, primaryLessonId: 6041 },
  { id: 605, unitNum: 5, title: 'الوحدة 5: سورة الصف، أصحاب البستان، في منع الضرر، السجود لله، أسماء بنت أبي بكر وجليبيب، وصلة الرحم', subtitle: 'التجارة الرابحة، قصة البستان، مثل السفينة، فقه السجود، ذات النطاقين وجليبيب، وبر الأرحام', pages: '100 - 118', startPage: 100, primaryLessonId: 6051 }
];

const CHEMISTRY_CHAPTER_LESSON_MAP = { 1: 10012, 2: 10022, 3: 10033, 4: 10042, 5: 10052, 6: 10063 };

const REVIEW_MODAL_CONFIGS = {
  math: {
    key: 'math',
    currId: 8,
    icon: '📐',
    title: 'مركز الحلول النموذجية لتمارين ومراجعات فصول الرياضيات',
    subtitle: 'منهج الرياضيات للصف الثاني المتوسط (7 فصول • تمارين الكتاب الوزاري ومراجعات واختبارات الفصول) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 801,
    defaultSolutionsVisible: false,
    bookOpenMode: 'library',
    showChunkBookBtn: false,
    usePhysicsMath: true,
    itemTypeLabel: 'الفصل',
    theme: {
      primary: '#7e22ce',
      darkText: '#581c87',
      accentText: '#6b21a8',
      lightBg: '#faf5ff',
      softBg: '#f3e8ff',
      border: '#d8b4fe',
      cardBorder: '#e9d5ff',
      solBg: '#fdf4ff',
      solText: '#701a75',
      gradient: 'linear-gradient(135deg, #7e22ce, #6b21a8)',
      shadowRgba: 'rgba(126,34,206,0.28)'
    },
    getMetaList: () => (window.MATH_REVIEW_CHAPTERS_META || []).map(m => ({
      ...m,
      itemKey: m.unitId || m.id,
      primaryLessonId: m.primaryLessonId || m.id
    })),
    getCurriculum: () => window.MATH_CURRICULUM || []
  },
  biology: {
    key: 'biology',
    currId: 11,
    icon: '🧬',
    title: 'مركز الحلول النموذجية لمراجعات دروس وفصول علم الأحياء',
    subtitle: 'منهج علم الأحياء للصف الثاني المتوسط (7 فصول • 21 درساً • مراجعات الدروس والفصول والحلول النموذجية) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 1101,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: false,
    itemTypeLabel: 'الفصل',
    theme: {
      primary: '#16a34a',
      darkText: '#14532d',
      accentText: '#15803d',
      lightBg: '#f0fdf4',
      softBg: '#dcfce7',
      border: '#86efac',
      cardBorder: '#86efac',
      solBg: '#f0fdf4',
      solText: '#14532d',
      gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
      shadowRgba: 'rgba(22,163,74,0.28)'
    },
    getMetaList: () => (window.BIOLOGY_CHAPTER_REVIEWS || []).map(m => ({
      ...m,
      itemKey: m.unitId || (1100 + Number(m.chapterNum || m.chapterId || 1)),
      chapterNum: m.chapterNum || m.chapterId,
      primaryLessonId: m.primaryLessonId || (11003 + 10 * Number(m.chapterNum || m.chapterId || 1))
    })),
    getCurriculum: () => window.BIOLOGY_CURRICULUM || []
  },
  chemistry: {
    key: 'chemistry',
    currId: 10,
    icon: '🧪',
    title: 'مركز الحلول النموذجية لمراجعات فصول الكيمياء',
    subtitle: 'منهج الكيمياء للصف الثاني المتوسط (6 فصول معتمدة) • إعداد المهندس أسامة خليل هاشم',
    mode: 'solutions-sections',
    defaultItemId: 1,
    defaultSolutionsVisible: true,
    bookOpenMode: 'page',
    showChunkBookBtn: false,
    usePhysicsMath: false,
    itemTypeLabel: 'الفصل',
    theme: {
      primary: '#059669',
      darkText: '#064e3b',
      accentText: '#065f46',
      lightBg: '#ecfdf5',
      softBg: '#d1fae5',
      border: '#a7f3d0',
      cardBorder: '#a7f3d0',
      solBg: '#f0fdf4',
      solText: '#064e3b',
      gradient: 'linear-gradient(135deg, #059669, #047857)',
      shadowRgba: 'rgba(5,150,105,0.28)'
    },
    getMetaList: () => (window.CHEMISTRY_CHAPTER_REVIEWS || []).map(m => {
      const cleanPages = String(m.pages || m.pageRange || '').replace(/^الصفحات?\s*/, '').trim() || '21 - 22';
      const firstPage = parseInt((cleanPages.match(/\d+/) || ['21'])[0], 10);
      return {
        ...m,
        itemKey: m.chapterNum,
        chapterId: m.chapterNum,
        pages: cleanPages,
        startPage: m.startPage || firstPage,
        primaryLessonId: m.primaryLessonId || CHEMISTRY_CHAPTER_LESSON_MAP[m.chapterNum] || 10012
      };
    }),
    getCurriculum: () => window.CHEMISTRY_CURRICULUM || []
  },
  social: {
    key: 'social',
    currId: 9,
    icon: '🌍',
    title: 'مركز الحلول النموذجية لمراجعات دروس وفصول الاجتماعيات',
    subtitle: 'منهج الاجتماعيات للصف الثاني المتوسط (6 فصول • 39 درساً • 71 بطاقة و 164 سؤالاً محلولاً) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 901,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: false,
    itemTypeLabel: 'الفصل',
    theme: {
      primary: '#b45309',
      darkText: '#78350f',
      accentText: '#92400e',
      lightBg: '#fffbeb',
      softBg: '#fef3c7',
      border: '#fde68a',
      cardBorder: '#fde68a',
      solBg: '#fffdf5',
      solText: '#78350f',
      gradient: 'linear-gradient(135deg, #b45309, #92400e)',
      shadowRgba: 'rgba(180,83,9,0.28)'
    },
    getMetaList: () => (window.SOCIAL_CHAPTER_REVIEWS || []).map((m, idx) => ({
      ...m,
      itemKey: m.unitId || (901 + idx),
      chapterNum: idx + 1,
      badgeText: `الفصل ${idx + 1} • ${m.unitId || (901 + idx)}`
    })),
    getCurriculum: () => window.SOCIAL_CURRICULUM || []
  },
  physics: {
    key: 'physics',
    currId: 7,
    icon: '⚛️',
    title: 'مركز الحلول النموذجية لمراجعات فصول الفيزياء',
    subtitle: 'منهج الفيزياء للصف الثاني المتوسط (6 فصول معتمدة) • إعداد المهندس أسامة خليل هاشم',
    mode: 'lesson-exercises',
    defaultItemId: 7014,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: true,
    itemTypeLabel: 'الفصل',
    theme: {
      primary: '#0284c7',
      darkText: '#075985',
      accentText: '#0369a1',
      lightBg: '#f0f9ff',
      softBg: '#e0f2fe',
      border: '#bae6fd',
      cardBorder: '#bae6fd',
      solBg: '#f0f9ff',
      solText: '#0c4a6e',
      gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
      shadowRgba: 'rgba(2,132,199,0.28)'
    },
    getMetaList: () => PHYSICS_REVIEW_CHAPTERS_META.map(m => ({ ...m, itemKey: m.id, primaryLessonId: m.id })),
    getCurriculum: () => window.PHYSICS_CURRICULUM || []
  },
  arabic_p1: {
    key: 'arabic_p1',
    currId: 4,
    icon: '📙',
    title: 'مركز الحلول النموذجية لمراجعات وتمارين اللغة العربية (الجزء الأول)',
    subtitle: 'كتاب اللغة العربية للصف الثاني المتوسط (9 وحدات معتمدة) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 401,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: false,
    itemTypeLabel: 'الوحدة',
    theme: {
      primary: '#059669',
      darkText: '#065f46',
      accentText: '#047857',
      lightBg: '#f0fdf4',
      softBg: '#ecfdf5',
      border: '#a7f3d0',
      cardBorder: '#a7f3d0',
      solBg: '#f0fdf4',
      solText: '#064e3b',
      gradient: 'linear-gradient(135deg, #059669, #047857)',
      shadowRgba: 'rgba(5,150,105,0.28)'
    },
    getMetaList: () => ARABIC_P1_REVIEW_UNITS_META.map(m => ({ ...m, itemKey: m.id })),
    getCurriculum: () => window.ARABIC_CURRICULUM_P1 || []
  },
  arabic_p2: {
    key: 'arabic_p2',
    currId: 5,
    icon: '📗',
    title: 'مركز الحلول النموذجية لمراجعات وتمارين اللغة العربية (الجزء الثاني)',
    subtitle: 'كتاب اللغة العربية للصف الثاني المتوسط (9 وحدات معتمدة) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 501,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: false,
    itemTypeLabel: 'الوحدة',
    theme: {
      primary: '#047857',
      darkText: '#064e3b',
      accentText: '#065f46',
      lightBg: '#f0fdf4',
      softBg: '#ecfdf5',
      border: '#a7f3d0',
      cardBorder: '#a7f3d0',
      solBg: '#f0fdf4',
      solText: '#064e3b',
      gradient: 'linear-gradient(135deg, #047857, #065f46)',
      shadowRgba: 'rgba(4,120,87,0.28)'
    },
    getMetaList: () => ARABIC_P2_REVIEW_UNITS_META.map(m => ({ ...m, itemKey: m.id })),
    getCurriculum: () => window.ARABIC_CURRICULUM_P2 || []
  },
  islamic: {
    key: 'islamic',
    currId: 6,
    icon: '🕌',
    title: 'مركز الحلول النموذجية لمناقشات ومراجعات التربية الإسلامية',
    subtitle: 'كتاب التربية الإسلامية للصف الثاني المتوسط (المدخل + 5 وحدات معتمدة) • إعداد المهندس أسامة خليل هاشم',
    mode: 'unit-exercises',
    defaultItemId: 601,
    defaultSolutionsVisible: false,
    bookOpenMode: 'page',
    showChunkBookBtn: true,
    usePhysicsMath: false,
    itemTypeLabel: 'الوحدة',
    theme: {
      primary: '#0d9488',
      darkText: '#115e59',
      accentText: '#0f766e',
      lightBg: '#f0fdfa',
      softBg: '#ccfbf1',
      border: '#99f6e4',
      cardBorder: '#99f6e4',
      solBg: '#f0fdfa',
      solText: '#134e4a',
      gradient: 'linear-gradient(135deg, #0d9488, #0f766e)',
      shadowRgba: 'rgba(13,148,136,0.28)'
    },
    getMetaList: () => ISLAMIC_REVIEW_UNITS_META.map(m => ({
      ...m,
      itemKey: m.id,
      shortNavTitle: typeof m.unitNum === 'number' ? `الوحدة ${m.unitNum}` : 'أحكام التلاوة'
    })),
    getCurriculum: () => window.ISLAMIC_CURRICULUM || []
  }
};

let activeReviewSubjectKey = 'physics';
let activeReviewItemKey = 7014;
let activeReviewSolutionsVisible = false;
let reviewsRenderToken = 0;

function resolveReviewItem(cfg, metaList, targetId) {
  if (!metaList || metaList.length === 0) return null;
  if (targetId !== null && targetId !== undefined) {
    const numId = Number(targetId);
    const strId = String(targetId);
    const found = metaList.find(m =>
      m.itemKey === numId ||
      m.id === numId ||
      m.id === strId ||
      m.chapterId === numId ||
      m.chapterNum === numId ||
      m.primaryLessonId === numId ||
      m.unitId === numId
    );
    if (found) return found;
  }
  const def = metaList.find(m => m.itemKey === cfg.defaultItemId || m.id === cfg.defaultItemId);
  return def || metaList[0];
}

function getThemedReviewPalette(cfg) {
  const base = cfg.theme;
  const isDark = document.documentElement.dataset.theme === 'dark';
  if (!isDark) {
    return {
      ...base,
      cardBg: '#ffffff',
      chipBg: '#f8fafc',
      btnWhiteBg: '#ffffff',
      rowBorder: '#f1f5f9'
    };
  }
  return {
    ...base,
    darkText: '#f8fafc',
    accentText: '#cbd5e1',
    lightBg: '#162033',
    softBg: '#1e293b',
    border: base.primary,
    cardBorder: '#334155',
    solBg: '#102826',
    solText: '#a7f3d0',
    cardBg: '#162033',
    chipBg: '#0f172a',
    btnWhiteBg: '#1e293b',
    rowBorder: '#293548'
  };
}

function applyReviewModalTheme(cfg) {
  const t = getThemedReviewPalette(cfg);
  const modal = document.getElementById('chapterReviewsModal');
  if (modal) modal.setAttribute('aria-label', cfg.title);

  const iconBox = document.getElementById('unifiedReviewIconBox');
  if (iconBox) {
    iconBox.innerText = cfg.icon;
    iconBox.style.background = t.softBg;
    iconBox.style.color = t.primary;
  }

  const titleEl = document.getElementById('unifiedReviewModalTitle');
  if (titleEl) {
    titleEl.innerText = cfg.title;
    titleEl.style.color = t.darkText;
  }

  const subEl = document.getElementById('unifiedReviewModalSubtitle');
  if (subEl) {
    subEl.innerText = cfg.subtitle;
    subEl.style.color = document.documentElement.dataset.theme === 'dark' ? '#93c5fd' : t.primary;
  }

  const toggleAllBtn = document.getElementById('btnToggleAllUnifiedReviewSols');
  if (toggleAllBtn) {
    toggleAllBtn.style.background = t.lightBg;
    toggleAllBtn.style.color = t.accentText;
    toggleAllBtn.style.border = `1px solid ${t.border}`;
  }

  const headerBar = document.getElementById('unifiedReviewHeaderBar');
  if (headerBar) {
    headerBar.style.background = t.lightBg;
    headerBar.style.border = `1px solid ${t.border}`;
  }

  const badgeEl = document.getElementById('unifiedReviewItemBadge');
  if (badgeEl) badgeEl.style.background = t.primary;

  const itemTitleEl = document.getElementById('unifiedReviewItemTitle');
  if (itemTitleEl) itemTitleEl.style.color = t.darkText;

  const pagesEl = document.getElementById('unifiedReviewItemPages');
  if (pagesEl) pagesEl.style.color = t.accentText;

  const studyBtn = document.getElementById('btnOpenUnifiedReviewInStudy');
  if (studyBtn) {
    studyBtn.style.background = t.gradient;
    studyBtn.style.boxShadow = `0 2px 6px ${t.shadowRgba}`;
  }

  const bookBtn = document.getElementById('btnOpenUnifiedReviewBookPage');
  if (bookBtn) {
    bookBtn.style.background = t.btnWhiteBg;
    bookBtn.style.color = t.accentText;
    bookBtn.style.border = `1px solid ${t.border}`;
  }
}

async function openChapterReviewsModal(subjectKey, targetId = null) {
  const cfg = REVIEW_MODAL_CONFIGS[subjectKey];
  if (!cfg) return;

  const reqToken = ++reviewsRenderToken;
  activeReviewSubjectKey = subjectKey;
  activeReviewSolutionsVisible = Boolean(cfg.defaultSolutionsVisible);

  applyReviewModalTheme(cfg);

  const modal = document.getElementById('chapterReviewsModal');
  if (modal) modal.classList.remove('hidden');

  const navContainer = document.getElementById('unifiedReviewChaptersNav');
  const contentContainer = document.getElementById('unifiedReviewModalContent');
  const badgeEl = document.getElementById('unifiedReviewItemBadge');
  const titleEl = document.getElementById('unifiedReviewItemTitle');
  const pagesEl = document.getElementById('unifiedReviewItemPages');

  if (!CurriculumLoader.isCurriculumLoaded(cfg.currId)) {
    if (navContainer) navContainer.innerHTML = '';
    if (badgeEl) badgeEl.innerText = cfg.itemTypeLabel;
    if (titleEl) titleEl.innerText = 'جارٍ تحميل بيانات المراجعة...';
    if (pagesEl) pagesEl.innerText = '';
    if (contentContainer) {
      contentContainer.innerHTML = CurriculumLoader.renderLoadingHTML(cfg.title);
    }
    const ok = await CurriculumLoader.ensureCurriculumLoaded(cfg.currId, { includeDiagrams: false });
    if (reqToken !== reviewsRenderToken) return;
    if (!ok) {
      if (contentContainer) {
        contentContainer.innerHTML = CurriculumLoader.renderErrorHTML(cfg.title, `openChapterReviewsModal('${subjectKey}', ${JSON.stringify(targetId)})`);
      }
      return;
    }
  }

  const metaList = cfg.getMetaList();
  const activeMeta = resolveReviewItem(cfg, metaList, targetId);
  activeReviewItemKey = activeMeta ? activeMeta.itemKey : cfg.defaultItemId;
  renderChapterReviewsModal();
}

function closeChapterReviewsModal() {
  const modal = document.getElementById('chapterReviewsModal');
  if (modal) modal.classList.add('hidden');
}

function switchChapterReviewsItem(itemKey) {
  activeReviewItemKey = Number(itemKey);
  const cfg = REVIEW_MODAL_CONFIGS[activeReviewSubjectKey];
  if (cfg) {
    activeReviewSolutionsVisible = Boolean(cfg.defaultSolutionsVisible);
  }
  renderChapterReviewsModal();
}

function formatReviewText(cfg, txt) {
  if (!txt) return '';
  return cfg.usePhysicsMath ? formatPhysicsMath(txt) : txt;
}

function renderUnifiedExerciseChunksHTML(cfg, activeMeta, chunkItems) {
  const t = getThemedReviewPalette(cfg);
  const isVisible = activeReviewSolutionsVisible;
  const hiddenClass = isVisible ? '' : ' hidden';
  const toggleBtnText = isVisible ? '<span>🙈</span> إخفاء الحل' : '<span>👁️</span> إظهار الحل';
  let html = '';

  chunkItems.forEach((item, chunkIdx) => {
    const ch = item.chunk;
    const lesson = item.lesson;
    const pageNum = ch.page || activeMeta.startPage || 1;
    const exercises = ch.exercises || [];
    const listPrefix = `unified_${cfg.key}_${chunkIdx}`;

    html += `
      <div style="background: ${t.cardBg}; border: 1.5px solid ${t.cardBorder}; border-radius: 12px; margin-bottom: 1.25rem; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.03);">
        <div style="background: linear-gradient(135deg, ${t.lightBg} 0%, ${t.softBg} 100%); border-bottom: 1.5px solid ${t.cardBorder}; padding: 0.6rem 0.95rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <span style="font-size: 1rem;">${cfg.mode === 'unit-exercises' ? cfg.icon : '📌'}</span>
            <div>
              <strong style="color: ${t.darkText}; font-size: 0.92rem;">${ch.heading || ('مراجعة الفصل - صفحة ' + pageNum)}</strong>
              ${item.showLessonTitle ? `<span style="font-size: 0.74rem; color: ${t.accentText}; margin-inline-start: 0.4rem; font-weight: 700;">• ${lesson.title}</span>` : ''}
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            ${cfg.showChunkBookBtn ? `
              <button class="btn btn-sm" onclick="openBookPageModal(${pageNum}, \`${escapeForAttribute(lesson.title)}\`, 'student', ${cfg.currId})" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; background: ${t.btnWhiteBg}; color: ${t.accentText}; border: 1px solid ${t.border}; font-weight: 700; border-radius: 5px;">
                📖 صورة صفحة (${pageNum})
              </button>
            ` : ''}
            <button class="btn btn-sm" onclick="toggleAllActivitySolutions('${listPrefix}')" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; background: ${t.primary}; color: #ffffff; border: none; font-weight: 700; border-radius: 5px;">
              👁️ إظهار/إخفاء حلول هذا المقطع
            </button>
          </div>
        </div>
        <div style="padding: 0.85rem;" class="activity-exercises-list" id="activityExercisesList_${listPrefix}">
    `;

    if (exercises.length > 0) {
      exercises.forEach((ex, exIdx) => {
        const exId = `${listPrefix}_${ex.id || exIdx}`;
        let wordsBoxHtml = '';
        if (ex.words_box && ex.words_box.length > 0) {
          wordsBoxHtml = `
            <div style="background: ${t.chipBg}; border: 1px dashed ${t.border}; border-radius: 8px; padding: 0.45rem 0.75rem; margin: 0.45rem 0; font-size: 0.84rem; display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;">
              <strong style="color: ${t.accentText};">📦 الكلمات / الخيارات المتاحة:</strong>
              ${ex.words_box.map(w => `<span style="background: ${t.lightBg}; border: 1px solid ${t.border}; padding: 0.18rem 0.5rem; border-radius: 5px; font-weight: 700; color: ${t.darkText};">${w}</span>`).join('')}
            </div>
          `;
        }

        let qListHtml = '';
        if (ex.questions && ex.questions.length > 0) {
          qListHtml = ex.questions.map((qObj, qIdx) => `
            <div style="margin-bottom: 0.75rem; padding-bottom: 0.6rem; border-bottom: 1px solid ${t.rowBorder};">
              <div style="font-weight: 700; color: var(--slate-900); font-size: 0.9rem; direction: rtl; text-align: right; line-height: 1.6; white-space: pre-wrap;">${formatReviewText(cfg, qObj.q)}</div>
              ${(qObj.options && qObj.options.length > 0) ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.35rem 0 0.2rem; font-size: 0.8rem; direction: rtl;">
                  ${qObj.options.map(opt => `<span style="background: ${t.chipBg}; border: 1px solid ${t.cardBorder}; padding: 0.15rem 0.45rem; border-radius: 4px; color: var(--slate-700); font-weight: 600;">${formatReviewText(cfg, opt)}</span>`).join('')}
                </div>
              ` : ''}
              <div class="unified-review-solution-box exam-model-answer-box${hiddenClass}" id="sol_${exId}_${qIdx}" style="margin-top: 0.45rem; padding: 0.65rem 0.85rem; font-size: 0.85rem; border-right: 4px solid ${t.primary}; background: ${t.solBg}; border-radius: 6px; border-top: 1px solid ${t.softBg}; border-bottom: 1px solid ${t.softBg}; border-left: 1px solid ${t.softBg};">
                <div style="font-weight: 800; color: ${document.documentElement.dataset.theme === 'dark' ? '#6ee7b7' : t.primary}; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                  <span>💡</span> الحل النموذجي المعتمد:
                </div>
                <div style="direction: rtl; text-align: right; font-weight: 600; color: ${t.solText}; white-space: pre-wrap; line-height: 1.7;">${formatReviewText(cfg, qObj.a)}</div>
              </div>
            </div>
          `).join('');
        }

        html += `
          <div class="activity-exercise-card" style="background: ${t.cardBg}; border: 1px solid ${t.cardBorder}; border-radius: 10px; padding: 0.85rem; margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
              <div>
                <span class="badge" style="background: ${t.softBg}; color: ${t.accentText}; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.55rem; border-radius: 5px;">${ex.num || ('التمرين ' + (exIdx + 1))}</span>
                <h4 style="display: inline; font-size: 0.92rem; font-weight: 800; margin-inline-start: 0.4rem; color: var(--slate-900);">${ex.title || ''}</h4>
                ${ex.title_ar ? `<div style="font-size: 0.78rem; color: ${t.accentText}; margin-top: 0.15rem; font-weight: 600;">${ex.title_ar}</div>` : ''}
              </div>
              <button class="unified-sol-toggle-btn exam-toggle-sol-btn" id="btn_sol_${exId}" onclick="toggleActivityCardSolutions('${exId}', ${(ex.questions || []).length})" style="background: ${t.lightBg}; color: ${t.accentText}; border: 1px solid ${t.border};">
                ${toggleBtnText}
              </button>
            </div>
            ${wordsBoxHtml}
            <div style="margin-top: 0.55rem;">${qListHtml}</div>
          </div>
        `;
      });
    } else {
      html += `<div style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.75; color: var(--slate-800);">${formatReviewText(cfg, ch.text || '')}</div>`;
    }

    html += `
        </div>
      </div>
    `;
  });

  return html;
}

function renderChapterReviewsModal() {
  const cfg = REVIEW_MODAL_CONFIGS[activeReviewSubjectKey];
  if (!cfg) return;

  const t = getThemedReviewPalette(cfg);
  applyReviewModalTheme(cfg);
  const navContainer = document.getElementById('unifiedReviewChaptersNav');
  const contentContainer = document.getElementById('unifiedReviewModalContent');
  const badgeEl = document.getElementById('unifiedReviewItemBadge');
  const titleEl = document.getElementById('unifiedReviewItemTitle');
  const pagesEl = document.getElementById('unifiedReviewItemPages');
  const toggleAllBtn = document.getElementById('btnToggleAllUnifiedReviewSols');

  const metaList = cfg.getMetaList();
  if (metaList.length === 0) {
    if (contentContainer) {
      contentContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem;">لا تتوفر بيانات مراجعة مسجلة لهذه المادة حالياً.</div>';
    }
    return;
  }

  const activeMeta = resolveReviewItem(cfg, metaList, activeReviewItemKey);
  activeReviewItemKey = activeMeta.itemKey;

  if (badgeEl) {
    if (activeMeta.badgeText) {
      badgeEl.innerText = activeMeta.badgeText;
    } else if (typeof activeMeta.unitNum === 'string') {
      badgeEl.innerText = activeMeta.unitNum;
    } else {
      badgeEl.innerText = `${cfg.itemTypeLabel} ${activeMeta.chapterNum || activeMeta.unitNum || activeMeta.chapterId || activeMeta.itemKey}`;
    }
  }
  if (titleEl) {
    titleEl.innerText = activeMeta.title + (activeMeta.subtitle ? ' • ' + activeMeta.subtitle : '');
  }
  if (pagesEl) {
    pagesEl.innerText = activeMeta.pageRange || `الصفحات (${activeMeta.pages || ''})`;
  }

  if (toggleAllBtn) {
    toggleAllBtn.innerHTML = activeReviewSolutionsVisible
      ? '<span>🙈</span> إخفاء كافة الحلول'
      : '<span>👁️</span> إظهار كافة الحلول';
  }

  if (navContainer) {
    navContainer.innerHTML = metaList.map(meta => {
      const isActive = meta.itemKey === activeMeta.itemKey;
      const navLabel = meta.shortNavTitle || meta.title;
      return `
        <button type="button" aria-pressed="${isActive ? 'true' : 'false'}" class="btn btn-sm" onclick="switchChapterReviewsItem(${meta.itemKey})" style="font-size: 0.78rem; padding: 0.35rem 0.85rem; font-weight: 800; border-radius: 8px; ${isActive ? `background: ${t.primary}; color: white; border: none; box-shadow: 0 2px 6px ${t.shadowRgba};` : `background: ${t.lightBg}; color: ${t.accentText}; border: 1px solid ${t.border};`}">
          <span>${navLabel}</span>
          ${meta.pages ? `<span style="font-size: 0.68rem; margin-inline-start: 0.3rem; opacity: 0.85;">(ص ${meta.pages})</span>` : ''}
        </button>
      `;
    }).join('');
  }

  if (!contentContainer) return;

  if (cfg.mode === 'solutions-sections') {
    const sections = activeMeta.solutions || [];
    if (sections.length === 0) {
      contentContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem;">لا تتوفر حلول مسجلة لهذا الفصل حالياً.</div>';
      return;
    }
    const hiddenCls = activeReviewSolutionsVisible ? '' : ' hidden';
    const secBtnLabel = activeReviewSolutionsVisible ? '<span>🙈</span> إخفاء الحلول' : '<span>👁️</span> إظهار الحلول';
    contentContainer.innerHTML = sections.map((sec, secIdx) => {
      const answers = Array.isArray(sec.answers) ? sec.answers : [];
      return `
        <div style="background: ${t.cardBg}; border: 1.5px solid ${t.cardBorder}; border-radius: 12px; margin-bottom: 1.1rem; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.03);">
          <div style="background: linear-gradient(135deg, ${t.lightBg} 0%, ${t.softBg} 100%); border-bottom: 1.5px solid ${t.cardBorder}; padding: 0.6rem 0.95rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.45rem;">
              <span style="font-size: 1rem;">${cfg.icon}</span>
              <strong style="color: ${t.darkText}; font-size: 0.92rem;">${sec.title}</strong>
            </div>
            <button class="btn btn-sm unified-sec-toggle-btn" id="btnToggleUnifiedSec_${secIdx}" onclick="toggleUnifiedReviewSection(${secIdx})" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; background: ${t.btnWhiteBg}; color: ${t.accentText}; border: 1px solid ${t.border}; font-weight: 800; border-radius: 5px;">
              ${secBtnLabel}
            </button>
          </div>
          <div id="unifiedReviewSecBox_${secIdx}" class="unified-review-solution-box${hiddenCls}" style="padding: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
            ${answers.map(ans => `
              <div style="background: ${t.solBg}; border-right: 4px solid ${t.primary}; border-radius: 6px; padding: 0.6rem 0.85rem; font-size: 0.86rem; color: ${t.solText}; line-height: 1.7; white-space: pre-wrap; direction: rtl; text-align: right; border-top: 1px solid ${t.softBg}; border-bottom: 1px solid ${t.softBg}; border-left: 1px solid ${t.softBg};">${ans}</div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
    return;
  }

  const curr = cfg.getCurriculum();
  if (cfg.mode === 'lesson-exercises') {
    let targetLesson = null;
    for (const u of curr) {
      for (const l of u.lessons || []) {
        if (l.id === activeMeta.itemKey || l.id === activeMeta.primaryLessonId) {
          targetLesson = l;
          break;
        }
      }
      if (targetLesson) break;
    }
    if (!targetLesson || !targetLesson.chunks || targetLesson.chunks.length === 0) {
      contentContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem;">لا تتوفر تمارين مسجلة لهذا الفصل حالياً.</div>';
      return;
    }
    const items = targetLesson.chunks.map(chunk => ({ chunk, lesson: targetLesson, showLessonTitle: false }));
    contentContainer.innerHTML = renderUnifiedExerciseChunksHTML(cfg, activeMeta, items);
    return;
  }

  // وضع unit-exercises (العربية بجزأيها والتربية الإسلامية)
  const targetUnit = curr.find(u => u.id === activeMeta.itemKey) || curr[0];
  if (!targetUnit) {
    contentContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem;">لا تتوفر تمرينات مسجلة لهذه الوحدة حالياً.</div>';
    return;
  }
  const reviewChunks = [];
  (targetUnit.lessons || []).forEach(lesson => {
    (lesson.chunks || []).forEach(chunk => {
      if (chunk.exercises && chunk.exercises.length > 0) {
        reviewChunks.push({ chunk, lesson, showLessonTitle: true });
      }
    });
  });
  if (reviewChunks.length === 0) {
    contentContainer.innerHTML = '<div style="text-align: center; color: var(--slate-400); padding: 3rem;">لا توجد تمرينات أو مناقشات مسجلة لهذه الوحدة حالياً.</div>';
    return;
  }
  contentContainer.innerHTML = renderUnifiedExerciseChunksHTML(cfg, activeMeta, reviewChunks);
}

function toggleUnifiedReviewSection(secIdx) {
  const box = document.getElementById(`unifiedReviewSecBox_${secIdx}`);
  const btn = document.getElementById(`btnToggleUnifiedSec_${secIdx}`);
  if (!box) return;
  const willShow = box.classList.contains('hidden');
  box.classList.toggle('hidden');
  if (btn) {
    btn.innerHTML = willShow ? '<span>🙈</span> إخفاء الحلول' : '<span>👁️</span> إظهار الحلول';
  }
}

function toggleAllUnifiedReviewSolutions() {
  const container = document.getElementById('unifiedReviewModalContent');
  if (!container) return;
  activeReviewSolutionsVisible = !activeReviewSolutionsVisible;

  const boxes = container.querySelectorAll('.unified-review-solution-box');
  boxes.forEach(box => {
    if (activeReviewSolutionsVisible) box.classList.remove('hidden');
    else box.classList.add('hidden');
  });

  container.querySelectorAll('.unified-sol-toggle-btn').forEach(btn => {
    btn.innerHTML = activeReviewSolutionsVisible ? '<span>🙈</span> إخفاء الحل' : '<span>👁️</span> إظهار الحل';
  });
  container.querySelectorAll('.unified-sec-toggle-btn').forEach(btn => {
    btn.innerHTML = activeReviewSolutionsVisible ? '<span>🙈</span> إخفاء الحلول' : '<span>👁️</span> إظهار الحلول';
  });

  const topBtn = document.getElementById('btnToggleAllUnifiedReviewSols');
  if (topBtn) {
    topBtn.innerHTML = activeReviewSolutionsVisible
      ? '<span>🙈</span> إخفاء كافة الحلول'
      : '<span>👁️</span> إظهار كافة الحلول';
  }
}

function openUnifiedReviewInStudy() {
  const cfg = REVIEW_MODAL_CONFIGS[activeReviewSubjectKey];
  if (!cfg) return;
  const metaList = cfg.getMetaList();
  const activeMeta = resolveReviewItem(cfg, metaList, activeReviewItemKey);
  const lessonId = (activeMeta && activeMeta.primaryLessonId) || cfg.defaultItemId;

  closeChapterReviewsModal();
  if (typeof onCurriculumSelectChange === 'function') {
    onCurriculumSelectChange(cfg.currId, true);
  } else {
    appData.currentCurriculumId = cfg.currId;
  }
  appData.currentLessonId = lessonId;
  saveData();
  switchTab('study');
  setTimeout(() => {
    if (typeof scrollToStudyContent === 'function') scrollToStudyContent();
  }, 150);
}

function openUnifiedReviewBookPage() {
  const cfg = REVIEW_MODAL_CONFIGS[activeReviewSubjectKey];
  if (!cfg) return;
  const metaList = cfg.getMetaList();
  const activeMeta = resolveReviewItem(cfg, metaList, activeReviewItemKey);
  const startPage = (activeMeta && activeMeta.startPage) || 1;
  const title = (activeMeta && activeMeta.title) || cfg.title;

  if (cfg.bookOpenMode === 'library') {
    closeChapterReviewsModal();
    openDigitalLibraryReader(cfg.currId, startPage);
  } else if (cfg.bookOpenMode === 'page-close') {
    closeChapterReviewsModal();
    openBookPageModal(startPage, title, 'student', cfg.currId);
  } else {
    openBookPageModal(startPage, title, 'student', cfg.currId);
  }
}

function getActiveChapterReviewContext() {
  const cfg = REVIEW_MODAL_CONFIGS[activeReviewSubjectKey];
  if (!cfg) return null;
  const metaList = cfg.getMetaList();
  const activeMeta = resolveReviewItem(cfg, metaList, activeReviewItemKey);
  if (!activeMeta) return null;

  if (cfg.mode === 'solutions-sections') {
    return {
      cfg,
      activeMeta,
      sections: activeMeta.solutions || [],
      chunkItems: []
    };
  }

  const curr = cfg.getCurriculum();
  const chunkItems = [];
  if (cfg.mode === 'lesson-exercises') {
    for (const u of curr) {
      for (const l of u.lessons || []) {
        if (l.id === activeMeta.itemKey || l.id === activeMeta.primaryLessonId) {
          (l.chunks || []).forEach(chunk => chunkItems.push({ chunk, lesson: l }));
          break;
        }
      }
      if (chunkItems.length > 0) break;
    }
  } else {
    const targetUnit = curr.find(u => u.id === activeMeta.itemKey) || curr[0];
    if (targetUnit) {
      (targetUnit.lessons || []).forEach(lesson => {
        (lesson.chunks || []).forEach(chunk => {
          if (chunk.exercises && chunk.exercises.length > 0) {
            chunkItems.push({ chunk, lesson });
          }
        });
      });
    }
  }

  return {
    cfg,
    activeMeta,
    sections: [],
    chunkItems
  };
}

window.addEventListener('ies:themechange', () => {
  const modal = document.getElementById('chapterReviewsModal');
  if (modal && !modal.classList.contains('hidden')) {
    renderChapterReviewsModal();
  }
});

// =========================================================================
// أغلفة التوافق الكامل مع استدعاءات المراجعات الثماني السابقة
// =========================================================================
function openMathReviewsModal(reviewLessonId = 8015) { return openChapterReviewsModal('math', reviewLessonId); }
function closeMathReviewsModal() { closeChapterReviewsModal(); }
function switchMathModalReviewChapter(id) { switchChapterReviewsItem(id); }
function toggleAllMathModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalMathReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalMathBookPage() { openUnifiedReviewBookPage(); }

function openBiologyReviewsModal(targetId = 1) { return openChapterReviewsModal('biology', targetId); }
function closeBiologyReviewsModal() { closeChapterReviewsModal(); }
function switchBiologyModalReviewChapter(id) { switchChapterReviewsItem(id); }
function toggleAllBiologyModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalBioBookPage() { openUnifiedReviewBookPage(); }

function openChemistryReviewsModal(reviewLessonId = 1) { return openChapterReviewsModal('chemistry', reviewLessonId); }
function closeChemistryReviewsModal() { closeChapterReviewsModal(); }
function switchChemistryModalReviewChapter(id) { switchChapterReviewsItem(id); }
function toggleAllChemistryModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalChemReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalChemBookPage() { openUnifiedReviewBookPage(); }

function openSocialReviewsModal(reviewLessonId = 901) { return openChapterReviewsModal('social', reviewLessonId); }
function closeSocialReviewsModal() { closeChapterReviewsModal(); }
function switchSocialModalReviewChapter(id) { switchChapterReviewsItem(id); }
function toggleAllSocialModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalSocReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalSocBookPage() { openUnifiedReviewBookPage(); }

function openPhysicsReviewsModal(reviewLessonId = 7014) { return openChapterReviewsModal('physics', reviewLessonId); }
function closePhysicsReviewsModal() { closeChapterReviewsModal(); }
function switchPhysicsModalReviewChapter(id) { switchChapterReviewsItem(id); }
function toggleAllPhysicsModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalBookPage() { openUnifiedReviewBookPage(); }

function openArabicP1ReviewsModal(unitId = 401) { return openChapterReviewsModal('arabic_p1', unitId); }
function closeArabicP1ReviewsModal() { closeChapterReviewsModal(); }
function switchArabicP1ModalReviewUnit(id) { switchChapterReviewsItem(id); }
function toggleAllArabicP1ModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalArP1ReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalArP1BookPage() { openUnifiedReviewBookPage(); }

function openArabicP2ReviewsModal(unitId = 501) { return openChapterReviewsModal('arabic_p2', unitId); }
function closeArabicP2ReviewsModal() { closeChapterReviewsModal(); }
function switchArabicP2ModalReviewUnit(id) { switchChapterReviewsItem(id); }
function toggleAllArabicP2ModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalArP2ReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalArP2BookPage() { openUnifiedReviewBookPage(); }

function openIslamicReviewsModal(unitId = 601) { return openChapterReviewsModal('islamic', unitId); }
function closeIslamicReviewsModal() { closeChapterReviewsModal(); }
function switchIslamicModalReviewUnit(id) { switchChapterReviewsItem(id); }
function toggleAllIslamicModalSolutions() { toggleAllUnifiedReviewSolutions(); }
function openCurrentModalIslamicReviewInStudy() { openUnifiedReviewInStudy(); }
function openCurrentModalIslamicBookPage() { openUnifiedReviewBookPage(); }

// =========================================================================
// المحرك الموحد لمعارض الرسوم التوضيحية وعارض اللوحات (الفيزياء، الكيمياء، الأحياء)
// =========================================================================
const DIAGRAM_MODAL_CONFIGS = {
  math: {
    key: 'math',
    galleryIcon: '📐',
    viewerIcon: '📐',
    galleryTitle: 'معرض الرسوم الهندسية والبيانية للرياضيات (17 لوحة)',
    gallerySubtitle: 'رسوم متجهية هندسية وإحداثية وإحصائية تغطي فصول المنهج • إعداد المهندس أسامة خليل هاشم',
    viewerDefaultTitle: 'الرسم الهندسي والبياني المعتمد',
    viewerSubPrefix: 'منهج الرياضيات للصف الثاني المتوسط • إعداد المهندس أسامة خليل هاشم',
    summaryLabel: '💡 الشرح الهندسي والمفهوم الرياضي:',
    formulaIcon: '📐',
    formulaLabel: 'القانون والمعادلة المعتمدة:',
    accentColor: '#7e22ce',
    badgeBg: '#f3e8ff',
    badgeText: '#6b21a8',
    categories: [
      ['all', 'كل الرسوم (17)'],
      ['الهندسة والقياس', 'الهندسة والقياس'],
      ['المجسمات والأشكال المركبة', 'المجسمات والأشكال المركبة'],
      ['الهندسة الإحداثية', 'الهندسة الإحداثية'],
      ['التحويلات الهندسية', 'التحويلات الهندسية'],
      ['الإحصاء والاحتمالات', 'الإحصاء والاحتمالات']
    ],
    getList: () => window.MATH_DIAGRAMS || []
  },
  physics: {
    key: 'physics',
    galleryIcon: '🎨',
    viewerIcon: '🔬',
    galleryTitle: 'معرض بنك الرسوم واللوحات التوضيحية للفيزياء (15 لوحة)',
    gallerySubtitle: 'رسوم بيانية متجهة عالية الدقة تغطي كافة فصول المنهج • إعداد المهندس أسامة خليل هاشم',
    viewerDefaultTitle: 'الرسم التوضيحي الفيزيائي المعتمد',
    viewerSubPrefix: 'منهج الفيزياء للصف الثاني المتوسط • إعداد المهندس أسامة خليل هاشم',
    summaryLabel: '💡 الشرح العلمي والتفسير الفيزيائي:',
    formulaIcon: '📐',
    formulaLabel: 'القانون والمعادلة الرياضية:',
    accentColor: '#0284c7',
    badgeBg: '#e0f2fe',
    badgeText: '#0284c7',
    categories: [
      ['all', 'كل الرسوم (15)'],
      ['الحركة والقياس', 'الحركة والقياس'],
      ['قوانين الحركة', 'قوانين الحركة والجاذبية'],
      ['الشغل والقدرة والطاقة', 'الشغل والطاقة'],
      ['الآلات البسيطة', 'الآلات والعتلات'],
      ['الحركة الموجية والصوت', 'الموجات والصوت'],
      ['الضوء والبصريات', 'الضوء والبصريات']
    ],
    getList: () => window.PHYSICS_DIAGRAMS || []
  },
  chemistry: {
    key: 'chemistry',
    galleryIcon: '🎨',
    viewerIcon: '🧪',
    galleryTitle: 'معرض بنك الرسوم واللوحات التوضيحية للكيمياء (16 لوحة)',
    gallerySubtitle: 'رسوم متجهية دقيقة تغطي كافة فصول المنهج • إعداد المهندس أسامة خليل هاشم',
    viewerDefaultTitle: 'الرسم التوضيحي الكيميائي المعتمد',
    viewerSubPrefix: 'منهج الكيمياء للصف الثاني المتوسط • إعداد المهندس أسامة خليل هاشم',
    summaryLabel: '💡 الشرح العلمي والتفسير الكيميائي:',
    formulaIcon: '⚗️',
    formulaLabel: 'الصيغة / المعادلة الكيميائية:',
    accentColor: '#059669',
    badgeBg: '#ecfdf5',
    badgeText: '#065f46',
    categories: [
      ['all', 'كل الرسوم (16)'],
      ['البناء الذري والترابط', 'البناء الذري والترابط'],
      ['المركبات وقوى الجذب', 'المركبات وقوى الترابط'],
      ['الصيغ والمعادلات والتفاعلات', 'الصيغ والتفاعلات'],
      ['المحاليل والذوبان', 'المحاليل والذوبان'],
      ['الحوامض والقواعد', 'الحوامض والقواعد'],
      ['الدلائل والأملاح والـ pH', 'الدلائل والأملاح والـ pH']
    ],
    getList: () => window.CHEMISTRY_DIAGRAMS || []
  },
  biology: {
    key: 'biology',
    galleryIcon: '🔬',
    viewerIcon: '🧬',
    galleryTitle: 'أطلس الرسوم واللوحات التوضيحية البيولوجية الشامل',
    gallerySubtitle: '17 لوحة توضيحية علمية متجهة تغطي كافة فصول الأحياء • إعداد المهندس أسامة خليل هاشم',
    viewerDefaultTitle: 'الرسم التوضيحي الحيوي المعتمد',
    viewerSubPrefix: 'منهج علم الأحياء للصف الثاني المتوسط • إعداد المهندس أسامة خليل هاشم',
    summaryLabel: '💡 الشرح العلمي والتفسير البيولوجي:',
    formulaIcon: '🧬',
    formulaLabel: 'القاعدة / المعادلة الحيوية:',
    accentColor: '#16a34a',
    badgeBg: '#dcfce7',
    badgeText: '#166534',
    categories: [
      ['all', 'كل الرسوم (17)'],
      ['علم التصنيف', 'علم التصنيف والممالك'],
      ['مملكة الطليعيات', 'الطليعيات والفطريات'],
      ['مملكة النباتات', 'مملكة النباتات'],
      ['مملكة الحيوانات', 'مملكة الحيوانات'],
      ['البيئة', 'البيئة ودورات العناصر']
    ],
    getList: () => window.BIOLOGY_DIAGRAMS || []
  }
};

let activeDiagramsSubjectKey = 'physics';
let activeDiagramsFilter = 'all';
let currentUnifiedDiagramZoom = 1;
let diagramsRenderToken = 0;

async function openDiagramViewerModal(subjectKey, diagId) {
  const cfg = DIAGRAM_MODAL_CONFIGS[subjectKey];
  if (!cfg) return;

  const reqToken = ++diagramsRenderToken;
  const modal = document.getElementById('diagramViewerModal');
  const iconEl = document.getElementById('diagramViewerModalIcon');
  const titleEl = document.getElementById('diagramViewerModalTitle');
  const subEl = document.getElementById('diagramViewerModalSubtitle');
  const svgWrap = document.getElementById('diagramViewerSvgWrapper');
  const infoWrap = document.getElementById('diagramViewerInfoWrapper');

  if (!modal) return;
  modal.setAttribute('aria-label', cfg.viewerDefaultTitle);
  if (iconEl) iconEl.innerText = cfg.viewerIcon;
  if (titleEl) titleEl.innerText = cfg.viewerDefaultTitle;
  if (subEl) {
    subEl.innerText = cfg.viewerSubPrefix;
    subEl.style.color = cfg.accentColor;
  }

  if (!CurriculumLoader.isDiagramsLoaded(subjectKey)) {
    if (svgWrap) svgWrap.innerHTML = CurriculumLoader.renderLoadingHTML(cfg.viewerDefaultTitle);
    if (infoWrap) infoWrap.innerHTML = '';
    modal.classList.remove('hidden');
    const ok = await CurriculumLoader.ensureDiagramsLoaded(subjectKey);
    if (reqToken !== diagramsRenderToken) return;
    if (!ok) {
      if (svgWrap) svgWrap.innerHTML = CurriculumLoader.renderErrorHTML(cfg.viewerDefaultTitle, `openDiagramViewerModal('${subjectKey}', '${diagId}')`);
      return;
    }
  }

  const list = cfg.getList();
  const diag = list.find(d => d.id === diagId);
  if (!diag) return;

  if (titleEl) titleEl.innerText = diag.title;
  if (subEl) subEl.innerText = `${diag.category} • ${cfg.viewerSubPrefix}`;

  currentUnifiedDiagramZoom = 1;
  if (svgWrap) {
    svgWrap.innerHTML = `
      <div id="unifiedDiagramZoomTarget" style="display: inline-block; width: 100%; max-width: 760px; transition: transform 0.2s ease; transform-origin: top center; margin: 0 auto;">
        ${diag.svg}
      </div>
    `;
  }

  if (infoWrap) {
    infoWrap.innerHTML = `
      <div style="background: #f0fdf4; border-right: 4px solid ${cfg.accentColor}; padding: 0.6rem 0.85rem; border-radius: 6px; font-size: 0.84rem; color: #064e3b; margin-bottom: 0.5rem; line-height: 1.6;">
        <strong>${cfg.summaryLabel}</strong> ${diag.summary}
      </div>
      ${diag.formula ? `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.5rem 0.85rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.1rem;">${cfg.formulaIcon}</span>
          <strong style="font-size: 0.85rem; color: #1d4ed8;">${cfg.formulaLabel}</strong>
          <span style="font-size: 0.85rem; font-weight: 800; color: #1e40af;">${diag.formula}</span>
        </div>
      ` : ''}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.5rem;">
        ${(diag.keyPoints || []).map(pt => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.45rem 0.75rem; font-size: 0.78rem; color: #334155; line-height: 1.5;">
            <span style="color: ${cfg.accentColor}; font-weight: 800;">✔️</span> ${pt}
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.remove('hidden');
}

function closeDiagramViewerModal() {
  const modal = document.getElementById('diagramViewerModal');
  if (modal) modal.classList.add('hidden');
}

function zoomUnifiedDiagram(delta) {
  currentUnifiedDiagramZoom = Math.max(0.6, Math.min(2.5, currentUnifiedDiagramZoom + delta));
  const target = document.getElementById('unifiedDiagramZoomTarget');
  if (target) target.style.transform = `scale(${currentUnifiedDiagramZoom})`;
}

function resetUnifiedDiagramZoom() {
  currentUnifiedDiagramZoom = 1;
  const target = document.getElementById('unifiedDiagramZoomTarget');
  if (target) target.style.transform = 'scale(1)';
}

async function openDiagramsGalleryModal(subjectKey, filterCat = 'all') {
  const cfg = DIAGRAM_MODAL_CONFIGS[subjectKey];
  if (!cfg) return;

  const reqToken = ++diagramsRenderToken;
  activeDiagramsSubjectKey = subjectKey;
  activeDiagramsFilter = filterCat || 'all';

  const modal = document.getElementById('diagramsGalleryModal');
  const iconEl = document.getElementById('diagramsGalleryIcon');
  const titleEl = document.getElementById('diagramsGalleryTitle');
  const subEl = document.getElementById('diagramsGallerySubtitle');
  const tabsEl = document.getElementById('diagramsGalleryFilterTabs');
  const grid = document.getElementById('diagramsGalleryGrid');

  if (!modal) return;
  modal.setAttribute('aria-label', cfg.galleryTitle);
  if (iconEl) iconEl.innerText = cfg.galleryIcon;
  if (titleEl) titleEl.innerText = cfg.galleryTitle;
  if (subEl) {
    subEl.innerText = cfg.gallerySubtitle;
    subEl.style.color = cfg.accentColor;
  }

  if (tabsEl) {
    tabsEl.innerHTML = cfg.categories.map(([cat, label]) => `
      <button type="button" aria-pressed="${activeDiagramsFilter === cat ? 'true' : 'false'}" class="btn ${activeDiagramsFilter === cat ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="filterUnifiedDiagrams('${cat}', this)">${label}</button>
    `).join('');
  }

  modal.classList.remove('hidden');

  if (!CurriculumLoader.isDiagramsLoaded(subjectKey)) {
    if (grid) grid.innerHTML = CurriculumLoader.renderLoadingHTML(cfg.galleryTitle);
    const ok = await CurriculumLoader.ensureDiagramsLoaded(subjectKey);
    if (reqToken !== diagramsRenderToken) return;
    if (!ok) {
      if (grid) grid.innerHTML = CurriculumLoader.renderErrorHTML(cfg.galleryTitle, `openDiagramsGalleryModal('${subjectKey}', '${activeDiagramsFilter}')`);
      return;
    }
  }

  renderUnifiedDiagramsGrid();
}

function closeDiagramsGalleryModal() {
  const modal = document.getElementById('diagramsGalleryModal');
  if (modal) modal.classList.add('hidden');
}

function filterUnifiedDiagrams(cat, btn) {
  activeDiagramsFilter = cat;
  const tabs = document.querySelectorAll('#diagramsGalleryFilterTabs button');
  tabs.forEach(t => {
    t.className = 'btn btn-secondary btn-sm';
    t.setAttribute('aria-pressed', 'false');
  });
  if (btn) {
    btn.className = 'btn btn-primary btn-sm';
    btn.setAttribute('aria-pressed', 'true');
  }
  renderUnifiedDiagramsGrid();
}

function renderUnifiedDiagramsGrid() {
  const cfg = DIAGRAM_MODAL_CONFIGS[activeDiagramsSubjectKey];
  const grid = document.getElementById('diagramsGalleryGrid');
  if (!cfg || !grid) return;

  const fullList = cfg.getList();
  const list = fullList.filter(d => {
    if (activeDiagramsFilter === 'all') return true;
    if (!d.category) return false;
    if (activeDiagramsSubjectKey === 'biology' && activeDiagramsFilter === 'مملكة الطليعيات') {
      return d.category.includes('الطليعيات') || d.category.includes('الفطريات');
    }
    return d.category.includes(activeDiagramsFilter);
  });

  if (list.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--slate-400); padding: 3rem;">لا توجد رسوم في هذا القسم.</div>';
    return;
  }

  grid.innerHTML = list.map(diag => `
    <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.85rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
          <span class="badge" style="background: ${cfg.badgeBg}; color: ${cfg.badgeText}; font-size: 0.7rem; font-weight: 800;">${diag.category}</span>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openDiagramViewerModal('${cfg.key}', '${diag.id}')" style="font-size: 0.7rem; padding: 0.15rem 0.5rem; color: ${cfg.accentColor};">
            🔍 تكبير
          </button>
        </div>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem; font-weight: 800; color: #0f172a; line-height: 1.35;">${diag.title}</h4>
        <div role="button" tabindex="0" aria-label="تكبير وفحص ${escapeHtml(diag.title)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDiagramViewerModal('${cfg.key}', '${diag.id}');}" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 0.6rem; cursor: pointer;" onclick="openDiagramViewerModal('${cfg.key}', '${diag.id}')" title="انقر لتكبير الرسم">
          ${diag.svg}
        </div>
        <p style="margin: 0 0 0.5rem 0; font-size: 0.77rem; color: #475569; line-height: 1.5;">${diag.summary}</p>
      </div>
      <button type="button" class="btn btn-sm" onclick="openDiagramViewerModal('${cfg.key}', '${diag.id}')" style="background: ${cfg.accentColor}; color: white; width: 100%; font-size: 0.75rem; padding: 0.3rem 0.5rem; font-weight: 700; border: none; border-radius: 6px;">
        ${cfg.viewerIcon} فحص اللوحة والشرح الكامل
      </button>
    </div>
  `).join('');
}

// أغلفة التوافق مع دوال الرسوم التوضيحية السابقة
function openPhysicsDiagramModal(diagId) { return openDiagramViewerModal('physics', diagId); }
function closePhysicsDiagramModal() { closeDiagramViewerModal(); }
function openAllPhysicsDiagramsGallery(filterCat) { return openDiagramsGalleryModal('physics', filterCat); }
function closeAllPhysicsDiagramsGallery() { closeDiagramsGalleryModal(); }

function openChemistryDiagramModal(diagId) { return openDiagramViewerModal('chemistry', diagId); }
function closeChemistryDiagramModal() { closeDiagramViewerModal(); }
function openAllChemistryDiagramsGallery(filterCat) { return openDiagramsGalleryModal('chemistry', filterCat); }
function closeAllChemistryDiagramsGallery() { closeDiagramsGalleryModal(); }

function openBiologyDiagramModal(diagId) { return openDiagramViewerModal('biology', diagId); }
function closeBiologyDiagramModal() { closeDiagramViewerModal(); }
function openAllBiologyDiagramsGallery(filterCat) { return openDiagramsGalleryModal('biology', filterCat); }
function closeAllBiologyDiagramsModal() { closeDiagramsGalleryModal(); }

function openMathDiagramModal(diagId) { return openDiagramViewerModal('math', diagId); }
function closeMathDiagramModal() { closeDiagramViewerModal(); }
function openAllMathDiagramsGallery(filterCat) { return openDiagramsGalleryModal('math', filterCat); }
function closeAllMathDiagramsGallery() { closeDiagramsGalleryModal(); }
