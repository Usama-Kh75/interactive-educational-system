// =========================================================================
// المساعد التعليمي الذكي المحلي (Local AI Tutor) ومحركات المواد السبعة
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

// تحديث الأسئلة السريعة المقترحة
function resetAiChatForLesson(lesson) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages || !lesson) return;

  const curr = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || {};
  const isChemistry = curr.id === 10 || (curr.subject && curr.subject.includes('كيمياء'));
  const isSocial = curr.id === 9 || (curr.subject && curr.subject.includes('اجتماع'));
  const isMath = curr.id === 8 || (curr.subject && curr.subject.includes('رياضيات'));
  const isPhysics = curr.id === 7 || (curr.subject && curr.subject.includes('فيزياء'));
  const isIslamic = curr.id === 6 || (curr.subject && curr.subject.includes('إسلام'));
  const isArabic = curr.id === 4 || curr.id === 5 || (curr.subject && curr.subject.includes('عرب'));

  const isBiology = curr.id === 11 || (curr.subject && curr.subject.includes('أحياء'));

  let greeting = '';
  if (isBiology) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>علم الأحياء (الصف الثاني المتوسط)</strong> 🧬.<br>` +
               `اسألني عن ممالك الكائنات الحية الخمس، أو الكائنات البسيطة (الأميبا والبراميسيوم واليوغلينا والفطريات)، أو الحزازيات والسرخسيات والنباتات، أو اللافقريات والفقريات، أو سلاسل الغذاء وتوازن البيئة ودورات العناصر في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق أرقام الصفحات والرسوم العلمية التوضيحية المعتمدة.`;
  } else if (isChemistry) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>الكيمياء (الصف الثاني المتوسط)</strong> 🧪.<br>` +
               `اسألني عن أي مفهوم كيميائي، أو إلكترونات التكافؤ، أو الروابط الأيونية والتساهمية، أو موازنة المعادلات، أو الحوامض والقواعد والأملاح في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق الصفحة والرسوم العلمية.`;
  } else if (isSocial) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>الاجتماعيات (الصف الثاني المتوسط)</strong> 🌍.<br>` +
               `اسألني عن أي ظاهرة جغرافية، أو إقليم مناخي، أو ثروة اقتصادية، أو واقعة وتاريخ وشخصية في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق أرقام الصفحات بدقة.`;
  } else if (isMath) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>الرياضيات (الصف الثاني المتوسط)</strong> 📐.<br>` +
               `اسألني عن أي قانون رياضي، أو خطوة حل مسألة، أو نظرية هندسية، أو تبسيط جملة عددية في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق الخطوات الرياضية.`;
  } else if (isPhysics) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>الفيزياء (الصف الثاني المتوسط)</strong> ⚛️.<br>` +
               `اسألني عن أي قانون رياضي، أو مسألة حسابية، أو مفهوم علمي، أو تفسير ظاهرة فيزيائية في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق الصفحة والمعادلات الدقيقة.`;
  } else if (isIslamic) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>التربية الإسلامية والقرآن الكريم</strong> 🕌.<br>` +
               `اسألني عن معاني وتفسير الآيات، أو شرح الأحاديث النبوية، أو الأحكام الفقهية والتجويدية في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق الصفحة.`;
  } else if (isArabic) {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>اللغة العربية</strong> 📖.<br>` +
               `اسألني عن إعراب الكلمات، أو القواعد النحوية والصرفية، أو ضوابط الإملاء ونصوص المطالعة في درس «${lesson.title}» وسأشرحها لك فوراً مع توثيق الصفحة والشواهد المعتمدة.`;
  } else {
    greeting = `أهلاً بك! أنا معلمك الذكي الموثق لمنهج <strong>اللغة الإنجليزية (English for Iraq)</strong> 🇬🇧.<br>` +
               `اسألني عن أي نقطة، مفردة، أو قاعدة لغوية في درس «${lesson.title}»، وسأشرحها لك فوراً مع توثيق الصفحة، ويمكنك الاستماع للإجابة صوتياً.`;
  }

  chatMessages.innerHTML = `
    <div class="message assistant">
      ${greeting}
    </div>
  `;
}

// تحديث الأسئلة السريعة المقترحة لكل مادة ودرس
function updateSuggestedChips(lesson) {
  const container = document.getElementById('suggestedChipsContainer');
  if (!container || !lesson) return;
  container.innerHTML = '';

  const curr = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || {};
  const isChemistry = curr.id === 10 || (curr.subject && curr.subject.includes('كيمياء'));
  const isSocial = curr.id === 9 || (curr.subject && curr.subject.includes('اجتماع'));
  const isMath = curr.id === 8 || (curr.subject && curr.subject.includes('رياضيات'));
  const isPhysics = curr.id === 7 || (curr.subject && curr.subject.includes('فيزياء'));
  const isIslamic = curr.id === 6 || (curr.subject && curr.subject.includes('إسلام'));
  const isArabic = curr.id === 4 || curr.id === 5 || (curr.subject && curr.subject.includes('عرب'));

  let suggestions = [];

  if (isChemistry) {
    const lt = (lesson.title || '').toLowerCase();
    if (lt.includes('ذري') || lt.includes('تكافؤ') || lt.includes('بناء')) {
      suggestions = [
        'ما هو عدد التأكسد وإلكترونات التكافؤ؟',
        'كيف يتم رسم التوزيع الإلكتروني للذرة والأيون؟',
        'ما هو الفرق بين الفقدان والاكتساب في الغلاف الخارجي؟'
      ];
    } else if (lt.includes('رابط') || lt.includes('ترابط') || lt.includes('أيون') || lt.includes('تساهم')) {
      suggestions = [
        'ما هو الفرق بين الرابطة الأيونية والرابطة التساهمية؟',
        'كيف تتكون الرابطة الأيونية في مركب كلوريد الصوديوم NaCl؟',
        'ما هي خواص المركبات الأيونية والتساهمية؟'
      ];
    } else if (lt.includes('معادل') || lt.includes('صيغ') || lt.includes('تفاعل')) {
      suggestions = [
        'كيف تتم موازنة المعادلة الكيميائية بالتفصيل؟',
        'ما هي أنواع التفاعلات الكيميائية الخمسة؟',
        'ما هو الفرق بين التفاعل الباعث للحرارة والماص للحرارة؟'
      ];
    } else if (lt.includes('حامض') || lt.includes('قاعد') || lt.includes('ملح') || lt.includes('ph') || lt.includes('دليل')) {
      suggestions = [
        'ما هو تعريف أرهينيوس للحامض والقاعدة؟',
        'ما هو مقياس الرقم الهيدروجيني pH وعلاقته بالحموضة والقاعدية؟',
        'كيف يحدث تفاعل التعادل لإنتاج الملح والماء؟'
      ];
    } else {
      suggestions = [
        'اشرح لي المفاهيم الأساسية في هذا الدرس',
        'ما هي أهم التعاريف والتعاليل الواردة في هذا الدرس؟',
        'ما هي الأسئلة الامتحانية المتوقعة لهذا الدرس؟'
      ];
    }
  } else if (isSocial) {
    const lt = (lesson.title || '').toLowerCase();
    if (lt.includes('موقع') || lt.includes('تضاريس') || lt.includes('جبال') || lt.includes('هضاب') || lt.includes('سهول')) {
      suggestions = [
        'ما هو الموقع الفلكي والجغرافي للعالم العربي وأهميته؟',
        'ما هي السلاسل الجبلية الأربع في العالم العربي؟',
        'ما هي الهضاب والسهول الفيضية والساحلية بالعالم العربي؟',
        'ما هي مميزات قمة طوبقال وقمة هلكرد؟'
      ];
    } else if (lt.includes('مناخ') || lt.includes('أقاليم') || lt.includes('نبات')) {
      suggestions = [
        'ما هي الأقاليم المناخية الخمسة في العالم العربي؟',
        'ما الفرق بين مناخ البحر المتوسط والإقليم الصحراوي؟',
        'ما هي أنواع النبات الطبيعي وحشائش السافانا والسهوب؟',
        'ما هي العوامل المؤثرة في مناخ العالم العربي؟'
      ];
    } else if (lt.includes('مياه') || lt.includes('أنهار') || lt.includes('دجلة') || lt.includes('فرات') || lt.includes('نيل')) {
      suggestions = [
        'ما هو منبع ومصب وروافد نهري دجلة والفرات؟',
        'ما هي روافد نهر النيل وأطواله وسدوده الكبرى؟',
        'ما هي المياه الجوفية والينابيع وأهميتها الاقتصادية؟',
        'ما هي البحيرات والسدود المائية في العراق والعالم العربي؟'
      ];
    } else if (lt.includes('سكان') || lt.includes('هجرات') || lt.includes('توزيع')) {
      suggestions = [
        'ما هي الأقاليم السكانية الأربعة في العالم العربي ونسبها؟',
        'ما هي الهجرات التاريخية لسكان شبه الجزيرة العربية؟',
        'ما العوامل الطبيعية والبشرية المؤثرة في توزيع السكان؟'
      ];
    } else if (lt.includes('زراعة') || lt.includes('ثروة') || lt.includes('حيوانية') || lt.includes('سمكية')) {
      suggestions = [
        'ما هي أقاليم الزراعة الكبرى في العالم العربي؟',
        'ما هي أهم المحاصيل الزراعية الغذائية والصناعية؟',
        'ما هي أهمية الثروة الحيوانية والسمكية في العالم العربي؟'
      ];
    } else if (lt.includes('نفط') || lt.includes('غاز') || lt.includes('تعدين') || lt.includes('صناعة') || lt.includes('تجارة')) {
      suggestions = [
        'ما هي مميزات وخصائص النفط العربي وأهميته العالمية؟',
        'ما هي خامات التعدين الأخرى كالفوسفات والكبريت والحديد؟',
        'ما هي خصائص التجارة الخارجية والميزان التجاري العربي؟'
      ];
    } else if (lt.includes('شبه الجزيرة') || lt.includes('قبيلة') || lt.includes('مرأة') || lt.includes('أصنام') || lt.includes('حنيفية')) {
      suggestions = [
        'ما هو موقع ومناخ شبه الجزيرة العربية قبل الإسلام؟',
        'ما هو التنظيم القبلي ومكانة المرأة والأسرة عند العرب؟',
        'ما هي ديانة الحنيفية والفرق بينها وبين عبادة الأصنام؟',
        'ما هي أهم أسواق العرب وأشهر فنون العمارة؟'
      ];
    } else if (lt.includes('مكة') || lt.includes('قصي') || lt.includes('ندوة') || lt.includes('زمزم') || lt.includes('شتاء') || lt.includes('صيف')) {
      suggestions = [
        'كيف نشأت مكة وما قصة بئر زمزم وبناء الكعبة المشرفة؟',
        'ما دور قصي بن كلاب في توحيد قريش وتأسيس دار الندوة؟',
        'ما هي وظائف مكة الخمس: الرفادة والسقاية والحجابة واللواء والندوة؟',
        'ما هي رحلتا الشتاء والصيف وأهميتهما الاقتصادية؟'
      ];
    } else if (lt.includes('نبي') || lt.includes('رسول') || lt.includes('مولد') || lt.includes('بعثة') || lt.includes('فضول') || lt.includes('هجرة')) {
      suggestions = [
        'ما هو نسب النبي ﷺ ونشأته وأخلاقه الشريفة؟',
        'ما هو حلف الفضول ولماذا أثنى عليه النبي ﷺ؟',
        'كيف بدأت الدعوة سراً ثم جهراً في مكة المكرمة؟',
        'ما أسباب هجرة المسلمين الأولى والثانية إلى الحبشة؟',
        'ما هي بيعتا العقبة الأولى والثانية ونتائجهما؟'
      ];
    } else if (lt.includes('مدينة') || lt.includes('غزوة') || lt.includes('بدر') || lt.includes('أحد') || lt.includes('خندق') || lt.includes('حديبية') || lt.includes('وداع')) {
      suggestions = [
        'ما هي بنود ومبادئ وثيقة المدينة المنورة؟',
        'قارن بين أسباب ونتائج غزوتي بدر الكبرى وأحد',
        'ما دور سلمان الفارسي وخطة حفر الخندق في غزوة الأحزاب؟',
        'ما هي شروط صلح الحديبية ولماذا عُدّ فتحاً مبيناً؟',
        'ما هي المبادئ والحقوق الإنسانية في خطبة حجة الوداع؟'
      ];
    } else {
      suggestions = [
        'ما هو الموقع الجغرافي للعالم العربي وأهميته الاستراتيجية؟',
        'ما هي خصائص ومميزات النفط والغاز في العالم العربي؟',
        'ما هي وظائف مكة المكرمة الخمس قبل الإسلام؟',
        'ما هي المبادئ الدستورية لوثيقة المدينة المنورة؟',
        'ما هي حقوق الإنسان التي أعلنتها خطبة حجة الوداع؟'
      ];
    }
  } else if (isMath) {
    suggestions = [
      'ما هي خطوات ترتيب العمليات الحسابية على الأعداد النسبية؟',
      'اشرح كيفية التعامل مع الأسس السالبة والصورة العلمية',
      'ما هو نص وتطبيقات نظرية فيثاغورس؟',
      'كيف نحلل المقدار الجبري باستخراج العامل المشترك الأكبر G.C.F؟',
      'كيف نجد ميل المستقيم ونحل معادلات ومتباينات الدرجة الأولى؟'
    ];
  } else if (isPhysics) {
    const lid = lesson.id;
    const lt = (lesson.title || '').toLowerCase();

    if (lid === 7011 || lt.includes('قياس') || lt.includes('وحدات')) {
      suggestions = [
        'ما هو القياس وما هي عناصره الأساسية؟',
        'ما هي وحدات النظام الدولي الأساسية (SI)؟',
        'كيف نستخدم البادئات الأسية (تيرا، نانو، فيمتو)؟',
        'ما الفرق بين الكميات المقدارية والاتجاهية؟',
        'ما أهمية أدوات القياس ودقة القياس؟'
      ];
    } else if (lid === 7012 || lt.includes('حركة وأنواعها') || lt.includes('مسار')) {
      suggestions = [
        'ما مفهوم الحركة ونقطة الإسناد والجسم الساكن؟',
        'ما هي أنواع الحركة (الانتقالية والدورية)؟',
        'ما هو مسار الحركة وكيف نصفه؟',
        'أعطني أمثلة على الحركة الدورانية والاهتزازية'
      ];
    } else if (lid === 7013 || lt.includes('وصف الحركة') || lt.includes('مسافة') || lt.includes('سرعة')) {
      suggestions = [
        'ما الفرق الجوهري بين المسافة (d) والإزاحة (x)؟',
        'كيف نحسب محصلة إزاحتين بنفس الاتجاه أو متعامدتين؟',
        'ما الفرق بين الانطلاق (Speed) والسرعة (Velocity)؟',
        'ما هو التعجيل وما قانون حسابه: a = (v_f - v_i) / t؟'
      ];
    } else if (lid === 7014 || lt.includes('مراجعة الفصل الأول')) {
      suggestions = [
        'حل مسألة إزاحتين متعامدتين: 3km شرقاً و 4km شمالاً',
        'حل مسألة حساب السرعة والتعجيل',
        'ما شروط اعتبار الجسم في حالة حركة؟'
      ];
    } else if (lid === 7021 || lt.includes('نيوتن')) {
      suggestions = [
        'اشرح قانون نيوتن الأول (القصور الذاتي)',
        'ما الصيغة الرياضية لقانون نيوتن الثاني: F = m × a؟',
        'اشرح قانون نيوتن الثالث (لكل فعل رد فعل)',
        'لماذا يندفع الراكب للأمام عند توقف الحافلة فجأة؟'
      ];
    } else if (lid === 7022 || lt.includes('جاذبية') || lt.includes('وزن')) {
      suggestions = [
        'ما نص قانون الجذب العام لنيوتن؟',
        'ما الفرق بين وزن الجسم (w) وكتلته (m)؟',
        'كيف نقيس الوزن باستخدام القبان الحلزوني؟',
        'ما هو السقوط الحر وانعدام الوزن بالأقمار الصناعية؟'
      ];
    } else if (lid === 7031 || lt.includes('شغل') || lt.includes('قدرة')) {
      suggestions = [
        'ما هو الشغل بالفيزياء وما قانونه: W = F × x؟',
        'ما هي وحدة الجول وكيف تُعرّف؟',
        'ما هي القدرة وما قانونها: P = W / t ووحدة الواط؟',
        'ما الفرق بين الواط والقدرة الحصانية (hp)؟'
      ];
    } else if (lid === 7032 || lt.includes('طاقة')) {
      suggestions = [
        'ما هي الطاقة الحركية وما قانونها: KE = ½mv²؟',
        'ما هي الطاقة الكامنة وما قانونها: PE = mgh؟',
        'اشرح قانون حفظ الطاقة مع أمثلة لتحولاتها',
        'ما هي مصادر الطاقة المتجددة وغير المتجددة؟'
      ];
    } else if (lid === 7041 || lt.includes('عتلات')) {
      suggestions = [
        'ما هو قانون العتلات: القوة × ذراعها = المقاومة × ذراعها؟',
        'ما هي الفائدة الميكانيكية للعتلة وكيف نحسبها؟',
        'ما الفرق بين عتلات النوع الأول والثاني والثالث؟',
        'أعطني أمثلة حياتية على كل نوع من العتلات'
      ];
    } else if (lid === 7042 || lt.includes('سطح مائل') || lt.includes('آلات') || lt.includes('بكرة')) {
      suggestions = [
        'كيف يوفر السطح المائل والإسفين فائدة ميكانيكية؟',
        'ما الفرق بين البكرة الثابتة والبكرة المتحركة؟',
        'ما هي كفاءة الآلة ولماذا لا توجد آلة كفاءتها 100%؟'
      ];
    } else if (lid === 7051 || lt.includes('موجات') || lt.includes('موجية')) {
      suggestions = [
        'ما هي الحركة الموجية وما أنواع الموجات؟',
        'ما الفرق بين الموجات الطولية والمستعرضة؟',
        'ما قانون سرعة انتشار الموجه: v = λ × f؟'
      ];
    } else if (lid === 7052 || lt.includes('صوت') || lt.includes('صدى')) {
      suggestions = [
        'ما طبيعة الصوت وما شروط انتقاله وسرعته؟',
        'ما هي خصائص الصوت: الدرجة، الشدة، والنوع؟',
        'ما هو صدى الصوت وما شروط حدوثه؟',
        'كيف نحسب عمق البحر باستخدام صدى الموجات فوق الصوتية؟'
      ];
    } else if (lid === 7061 || lt.includes('ضوء') || lt.includes('ظلال')) {
      suggestions = [
        'ما هي خصائص الضوء وسلوكه في الأوساط؟',
        'كيف تتكون الظلال وما الفرق بين الكسوف والخسوف؟'
      ];
    } else if (lid === 7062 || lt.includes('انعكاس') || lt.includes('مرايا')) {
      suggestions = [
        'ما هما قانونا انعكاس الضوء؟',
        'ما صفات الصورة في المرآة المستوية؟',
        'ما الفرق بين المرآة المقعرة اللامة والمرآة المحدبة؟'
      ];
    } else if (lid === 7063 || lt.includes('انكسار') || lt.includes('عدسات')) {
      suggestions = [
        'ما هو انكسار الضوء والكثافة الضوئية والزاوية الحرجة؟',
        'ما هو الانعكاس الكلي الداخلي وتطبيقاته في الألياف البصرية؟',
        'كيف تعالج العدسات المحدبة والمقعرة عيوب البصر؟',
        'كيف يتحلل الضوء الأبيض بالمنشور الزجاجي إلى ألوان الطيف؟'
      ];
    } else {
      suggestions = [
        'اشرح قوانين نيوتن الثلاثة في الحركة',
        'ما هو قانون الشغل والقدرة ووحداتهما؟',
        'ما الفرق بين الكتلة والوزن؟',
        'كيف نحسب الفائدة الميكانيكية للعتلات؟',
        'ما شروط حدوث صدى الصوت؟'
      ];
    }
  } else if (isIslamic) {
    const lt = (lesson.title || '').toLowerCase();
    if (lt.includes('تلاوة') || lt.includes('مد')) {
      suggestions = ['ما هو المد العارض للسكون وما شروطه ومقداره؟', 'ما هي أحرف المد الثلاثة؟', 'أعطني أمثلة على المد العارض من القرآن الكريم'];
    } else if (lt.includes('النبأ')) {
      suggestions = ['ما موضوعات سورة النبأ؟', 'ما معاني: وجنات ألفافا، ثجاجا، لا يرجون حسابا؟', 'ما عاقبة الطاغين وثواب المتقين في سورة النبأ؟'];
    } else if (lt.includes('القيامة')) {
      suggestions = ['ما معنى: لا أقسم بيوم القيامة؟', 'ما هي أهوال يوم القيامة المذكورة بالسورة؟', 'اشرح الآية: بل الإنسان على نفسه بصيرة'];
    } else if (lt.includes('المزمل')) {
      suggestions = ['ما سبب نزول سورة المزمل؟', 'ما معنى: ورتل القرآن ترتيلا؟', 'ما فضل قيام الليل والاستغفار؟'];
    } else if (lt.includes('الجمعة')) {
      suggestions = ['ما هي أحكام صلاة الجمعة وشروط وجوبها؟', 'ما معنى: وذروا البيع؟', 'ما فضل يوم الجمعة؟'];
    } else if (lt.includes('الصف')) {
      suggestions = ['ما معنى سورة الصف ولماذا سميت بهذا الاسم؟', 'اشرح الآية: لم تقولون ما لا تفعلون؟', 'ما هي التجارة الرابحة المنجية من عذاب أليم؟'];
    } else if (lt.includes('حديث') || lt.includes('المنافق') || lt.includes('معروف') || lt.includes('حرمة') || lt.includes('أخلاق') || lt.includes('ضرر')) {
      suggestions = ['ما نص الحديث النبوي الشريف وشرحه؟', 'ما هي علامات المنافق الثلاث؟', 'ما معنى: لا ضرر ولا ضرار؟', 'ما أهم ما يرشد إليه الحديث الشريف؟'];
    } else if (lt.includes('صلاة') || lt.includes('صوم') || lt.includes('سجود')) {
      suggestions = ['ما هي أركان وشروط فريضة الصلاة؟', 'ما هي صلاة الآيات (الكسوف والخسوف) وكيفيتها؟', 'ما هي مبطلات الصيام وشروطه؟', 'ما هي الأعضاء السبعة للسجود؟'];
    } else {
      suggestions = [
        'ما هو المد العارض للسكون وما حكمه؟',
        'ما هي شروط المعجزة الإلهية؟',
        'ما هي علامات المنافق في الحديث النبوي؟',
        'ما هي أركان الصلاة وفريضة الصوم؟',
        'اذكر نبذة عن فضائل عمر بن الخطاب وعثمان بن عفان'
      ];
    }
  } else if (isArabic) {
    const lt = (lesson.title || '').toLowerCase();
    if (lt.includes('إعراب') || lt.includes('علامات')) {
      suggestions = ['ما هي علامات الإعراب الأصلية والفرعية؟', 'ما الفرق بين الحركات الأصلية وحروف الإعراب؟', 'متى يعرب الاسم بالحركات الفرعية؟'];
    } else if (lt.includes('الأسماء الخمسة')) {
      suggestions = ['ما هي الأسماء الخمسة وما إعرابها؟', 'ما شروط إعراب الأسماء الخمسة بالحروف؟', 'أعرب: جاء أبوك، ورأيت أخاك'];
    } else if (lt.includes('ميزان') || lt.includes('صرف')) {
      suggestions = ['ما هو الميزان الصرفي وكيف نزن الكلمات؟', 'كيف نزن الكلمات المزيدة مثل استخرج وكاتب؟', 'ما وزن قِ وصُنْ بعد حذف الحروف؟'];
    } else if (lt.includes('لازم') || lt.includes('متعد')) {
      suggestions = ['ما الفرق بين الفعل اللازم والفعل المتعدي؟', 'كيف نحول الفعل اللازم إلى متعد؟', 'أعطني أمثلة على أفعال لازمة ومتعدية'];
    } else if (lt.includes('نائب الفاعل')) {
      suggestions = ['ما هو نائب الفاعل وما حكمه الإعرابي؟', 'كيف نبني الفعل الماضي والمضارع للمجهول؟', 'أعرب: كُتِبَ الدرسُ'];
    } else if (lt.includes('مفعول')) {
      suggestions = ['ما الفرق بين المفعول فيه والمفعول المطلق والمفعول به؟', 'ما هي ظروف الزمان وظروف المكان؟', 'ما الفائدة البلاغية للمفعول المطلق؟'];
    } else if (lt.includes('حال')) {
      suggestions = ['ما هو الحال وما شروطه في الجملة؟', 'ما الفرق بين الحال والصفة (النعت)؟', 'أعرب: جاء الطالبُ راكباً'];
    } else if (lt.includes('استثناء')) {
      suggestions = ['ما هي أركان جملة الاستثناء بـ إلا؟', 'متى يكون المستثنى تاماً متصلاً أو مفرغاً؟', 'أعرب: ما فاز إلا المجتهدُ'];
    } else if (lt.includes('نداء') || lt.includes('منادى')) {
      suggestions = ['ما هي أحرف النداء واستعمالاتها؟', 'متى يبنى المنادى على الضم ومتى ينصب؟', 'أعرب: يا محمدُ، ويا طالبَ العلمِ'];
    } else if (lt.includes('استفهام')) {
      suggestions = ['ما الفرق بين استفهام التصديق واستفهام التصور؟', 'ما هي أدوات الاستفهام ومعانيها؟', 'متى نستخدم الهمزة مع أم المعادلة؟'];
    } else if (lt.includes('مضارع') || lt.includes('بناء')) {
      suggestions = ['متى يبنى الفعل المضارع وما هي حالات بنائه؟', 'ما الفرق بين نون التوكيد الثقيلة ونون النسوة؟', 'أعرب: واللهِ لأدرسَنَّ، والطالباتُ يدرسْنَ'];
    } else if (lt.includes('مثنى')) {
      suggestions = ['ما هو المثنى وما علامات إعرابه؟', 'ما هي الملحقات بالمثنى (اثنان واثنتان وكلا وكلتا)؟', 'متى تعرب كلا وكلتا إعراب المثنى؟'];
    } else if (lt.includes('جمع مذكر') || lt.includes('مذكر سالم')) {
      suggestions = ['ما هو جمع المذكر السالم وعلامات إعرابه؟', 'ما هي ملحقات جمع المذكر السالم؟', 'أعرب: حضر المهندسونَ، ورأيتُ العاملينَ'];
    } else if (lt.includes('جمع مؤنث') || lt.includes('مؤنث سالم')) {
      suggestions = ['ما علامة نصب جمع المؤنث السالم؟', 'ما هي شروط وما يجمع جمع مؤنث سالم؟', 'أعرب: شكرتُ المعلماتِ'];
    } else {
      suggestions = [
        'ما هي علامات الإعراب الأصلية والفرعية؟',
        'اشرح قاعدة الأسماء الخمسة وإعرابها',
        'ما هو الميزان الصرفي وكيف نزن الكلمات؟',
        'ما هي أنواع المنادى وحكم كل نوع؟',
        'ما الفرق بين استفهام التصديق والتصور؟'
      ];
    }
  } else {
    // منهج اللغة الإنجليزية
    const t = (lesson.title || '').toLowerCase();
    if (t.includes('keep fit')) {
      suggestions = ['كيف نحافظ على اللياقة البدنية؟', 'اشرح قاعدة should و shouldn\'t', 'لماذا تعتبر الرياضة مهمة؟'];
    } else if (t.includes('eat the right food')) {
      suggestions = ['ما الفرق بين too much و too many؟', 'ما نصائح الممرضة جانيت للغذاء الصحي؟', 'متى نستخدم a few و a little؟'];
    } else if (t.includes('restaurant')) {
      suggestions = ['ما معنى grilled و fried و baked؟', 'كيف أطلب الطعام في المطعم بأدب؟', 'ما أقسام قائمة الطعام؟'];
    } else if (t.includes('aches')) {
      suggestions = ['كيف أعبر عن الصداع وألم الأسنان؟', 'متى نستخدم hurts ومتى نستخدم ache؟', 'ما علاج ألم الأذن في الدرس؟'];
    } else if (t.includes('jalal')) {
      suggestions = ['ما العبرة من قصة جلال وأخيه إبراهيم؟', 'ماذا كان مرض إبراهيم الحقيقي؟', 'اشرح قاعدة want + pronoun + to'];
    } else if (t.includes('sports')) {
      suggestions = ['ما الفرق بين play و go و do مع الرياضة؟', 'متى نستخدم used to؟', 'أعطني أمثلة على رياضات الكرة.'];
    } else {
      suggestions = [
        'ما هي أقسام مجلة المدرسة؟',
        'اشرح قاعدة s التملك',
        'ما الفرق بين for و since؟',
        'ما معنى كلمة article و editor؟',
        'ما هي نصائح Aunt Sally لتجاوز الخجل؟'
      ];
    }
  }

  suggestions.forEach(q => {
    const chip = document.createElement('button');
    chip.className = 'chip-btn';
    chip.innerText = q;
    chip.onclick = () => {
      document.getElementById('chatInput').value = q;
      sendChatMessage(q);
    };
    container.appendChild(chip);
  });
}

async function sendChatMessage(customQuery = null) {
  const input = document.getElementById('chatInput');
  const query = (customQuery || input.value).trim();
  if (!query) return;

  if (!customQuery) input.value = '';
  const chatMessages = document.getElementById('chatMessages');

  // رسالة الطالب
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.innerText = query;
  chatMessages.appendChild(userDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // رسالة المعلم الذكي
  const botDiv = document.createElement('div');
  botDiv.className = 'message assistant';
  botDiv.innerHTML = '<span style="color: var(--slate-500);">المعلم الذكي يطالع نصوص ومفاهيم المنهج ويبني إجابتك بالدليل...</span>';
  chatMessages.appendChild(botDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const explanationLevel = document.getElementById('explanationLevelSelect').value;
  const allowExternal = document.getElementById('allowExternalCheck').checked;

  // 1. المحاولة عبر الخادم أولاً إذا كان محلياً
  if (IS_LOCAL_SERVER) {
    try {
      const sessRes = await fetch('http://127.0.0.1:8000/api/tutor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_id: appData.currentCurriculumId || 3,
          lesson_id: appData.currentLessonId || null,
          title: 'محادثة المنهج'
        })
      });

      if (sessRes.ok) {
        const sess = await sessRes.json();
        const msgRes = await fetch(`http://127.0.0.1:8000/api/tutor/sessions/${sess.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: query,
            explanation_level: explanationLevel,
            allow_external_enrichment: allowExternal
          })
        });

        if (msgRes.ok) {
          const botData = await msgRes.json();
          if (botData.content && !botData.content.includes('غير مهيأ')) {
            renderBotResponse(botDiv, botData.content, botData.sources);
            return;
          }
        }
      }
    } catch (err) {
      console.log('Using local educational intelligence engine');
    }
  }

  // 2. المحرك التعليمي الذكي المحلي (مبني على نصوص الكتاب وقواعده)
  await CurriculumLoader.ensureCurriculumLoaded(appData.currentCurriculumId || 3, { silent: true });
  setTimeout(() => {
    const localAns = generateLocalAnswer(query, appData.currentLessonId);
    renderBotResponse(botDiv, localAns.content, localAns.sources, localAns.speakText);
  }, 200);
}

function formatSafeBotMarkdown(raw) {
  if (!raw) return '';
  const preserved = [];
  const tokenPrefix = '__SAFE_HTML_TAG_';
  const withTokens = String(raw).replace(/<\/?(?:span(?:\s+(?:dir|class)=['"][a-zA-Z0-9 _-]+['"])*|div(?:\s+(?:dir|class)=['"][a-zA-Z0-9 _-]+['"])*|sub|sup|strong|br)\s*\/?>/gi, (tag) => {
    const idx = preserved.length;
    preserved.push(tag);
    return `${tokenPrefix}${idx}__`;
  });
  const escaped = withTokens
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const restored = escaped.replace(new RegExp(`${tokenPrefix}(\\d+)__`, 'g'), (_, idx) => preserved[Number(idx)] || '');
  return restored
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function renderBotResponse(botDiv, content, sources = [], speakText = '') {
  botDiv.innerHTML = formatSafeBotMarkdown(content);
  
  const audioToSpeak = speakText || content.replace(/<[^>]*>/g, '');
  
  const actionRow = document.createElement('div');
  actionRow.style.marginTop = '0.6rem';
  actionRow.style.display = 'flex';
  actionRow.style.gap = '0.5rem';
  actionRow.style.alignItems = 'center';
  actionRow.style.flexWrap = 'wrap';

  if (isEnglishCurriculum(appData.currentCurriculumId)) {
    const speakBtn = document.createElement('button');
    speakBtn.className = 'mini-listen-btn';
    speakBtn.innerHTML = '🔊 استمع للإجابة والشرح';
    speakBtn.onclick = () => speakSnippet(audioToSpeak, 'en');
    actionRow.appendChild(speakBtn);
  }

  if (sources && sources.length > 0) {
    sources.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'source-tag';
      tag.innerText = `📄 ص ${s.page || s.page_number || 1} (${s.heading || 'المنهج'})`;
      actionRow.appendChild(tag);
    });
  }

  botDiv.appendChild(actionRow);
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة الفيزياء (الصف الثاني المتوسط)
// -------------------------------------------------------------
function generatePhysicsLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const rules = window.PHYSICS_RULES || [];
  const diagrams = window.PHYSICS_DIAGRAMS || [];

  // 1. فحص أسئلة حل المسائل الحسابية والقوانين الرياضية المحددة
  if (qClean.includes('مسال') || qClean.includes('احسب') || qClean.includes('حل مسال') || qClean.includes('قانون')) {
    if (qClean.includes('ازاح') || qClean.includes('محصل') || qClean.includes('فيثاغورس')) {
      return {
        content: `📌 **حل مسألة حساب محصلة إزاحتين (كتاب الفيزياء ص 15-17):**\n\n` +
                 `1. **إذا كانت الإزاحتان باتجاه واحد:**\n` +
                 `• نجمع الإزاحتين: <span dir='ltr' class='phy-formula'>x<sub>R</sub> = x₁ + x₂</span>\n` +
                 `• مثال: تحرك جسم 3km شرقاً ثم 4km شرقاً ➔ المحصلة = 3 + 4 = 7km شرقاً.\n\n` +
                 `2. **إذا كانت الإزاحتان باتجاهين متعاكسين:**\n` +
                 `• نطرح الصغرى من الكبرى: <span dir='ltr' class='phy-formula'>x<sub>R</sub> = x₁ - x₂</span> (باتجاه الإزاحة الأكبر).\n` +
                 `• مثال: 5km شرقاً و 2km غرباً ➔ المحصلة = 5 - 2 = 3km شرقاً.\n\n` +
                 `3. **إذا كانت الإزاحتان متعامدتين (بزاوية 90°):**\n` +
                 `• نطبق مبرهنة فيثاغورس: <span dir='ltr' class='phy-formula'>x<sub>R</sub> = √(x₁² + x₂²)</span>\n` +
                 `• مثال الكتاب: تحركت سيارة 3km شمالاً و 4km شرقاً:\n` +
                 `<div dir='ltr' class='phy-math-block'>x<sub>R</sub> = √(3² + 4²) = √(9 + 16) = √25 = 5 km</div>\n` +
                 `والاتجاه: شمال الشرق (بزاوية 37° تقريباً).`,
        sources: [{ page: 16, heading: 'محصلة إزاحتين' }]
      };
    }
    if (qClean.includes('سرع') || qClean.includes('انطلاق') || qClean.includes('تعجيل')) {
      return {
        content: `📌 **قوانين ومسائل السرعة والانطلاق والتعجيل (ص 17-20):**\n\n` +
                 `1. **قانون الانطلاق (Speed):**\n` +
                 `• <span dir='ltr' class='phy-formula'>s = d / t</span> (الانطلاق = المسافة الكلية ÷ الزمن المستغرق).\n` +
                 `• الوحدة: م/ث (m/s).\n\n` +
                 `2. **قانون السرعة (Velocity):**\n` +
                 `• <span dir='ltr' class='phy-formula'>v = x / t</span> (السرعة = الإزاحة المقطوعة ÷ الزمن).\n` +
                 `• وهي كمية اتجاهية لها نفس اتجاه الإزاحة.\n\n` +
                 `3. **قانون التعجيل (Acceleration):**\n` +
                 `• <span dir='ltr' class='phy-formula'>a = (v<sub>f</sub> - v<sub>i</sub>) / t</span> (التعجيل = التغير بالسرعة ÷ الزمن).\n` +
                 `• الوحدة: م/ث² (m/s²).\n` +
                 `• إذا كانت السرعة تزداد فالتعجيل **تسارعي موجب**، وإذا تباطأت فالتعجيل **تباطئي سالب**.`,
        sources: [{ page: 18, heading: 'الانطلاق والسرعة والتعجيل' }]
      };
    }
    if (qClean.includes('شغل') || qClean.includes('قدر')) {
      return {
        content: `📌 **قوانين ومسائل الشغل والقدرة (كتاب الفيزياء ص 36-39):**\n\n` +
                 `1. **قانون الشغل الفيزيائي (Work):**\n` +
                 `• <span dir='ltr' class='phy-formula'>W = F × x</span> (الشغل = القوة × الإزاحة باتجاه القوة).\n` +
                 `• الوحدة: الجول (Joule) = نيوتن × متر (<span dir='ltr' class='phy-formula'>N · m</span>).\n` +
                 `• شرط إنجاز الشغل: أن تتحرك نقطة تأثير القوة باتجاه القوة نفسها.\n\n` +
                 `2. **قانون القدرة (Power):**\n` +
                 `• <span dir='ltr' class='phy-formula'>P = W / t</span> (القدرة = الشغل المنجز ÷ الزمن المستغرق).\n` +
                 `• الوحدة: الواط (Watt) = جول/ثانية (<span dir='ltr' class='phy-formula'>J/s</span>).\n` +
                 `• القدرة الحصانية: <span dir='ltr' class='phy-formula'>1 hp = 746 Watt</span>.`,
        sources: [{ page: 37, heading: 'الشغل والقدرة' }]
      };
    }
    if (qClean.includes('عتل') || qClean.includes('فائده ميكانيك')) {
      return {
        content: `📌 **قوانين ومسائل العتلات والفائدة الميكانيكية (ص 47-49):**\n\n` +
                 `1. **قانون العتلات الأساسي:**\n` +
                 `<div dir='ltr' class='phy-math-block'>القوة × ذراعها = المقاومة × ذراعها</div>\n` +
                 `<div dir='ltr' class='phy-math-block'>F₁ × d₁ = F₂ × d₂</div>\n\n` +
                 `2. **قانون الفائدة الميكانيكية (Mechanical Advantage - MA):**\n` +
                 `<div dir='ltr' class='phy-math-block'>MA = F₂ / F₁ = d₁ / d₂</div>\n` +
                 `• إذا كان <span dir='ltr' class='phy-formula'>MA > 1</span>: نحصل على **ربح قوة** (القوة أصغر من المقاومة).\n` +
                 `• إذا كان <span dir='ltr' class='phy-formula'>MA < 1</span>: نحصل على **ربح سرعة** (ذراع المقاومة أطول من ذراع القوة).\n` +
                 `• إذا كان <span dir='ltr' class='phy-formula'>MA = 1</span>: لا ربح قوة ولا ربح سرعة (مثل الميزان ذي الكفتين).`,
        sources: [{ page: 48, heading: 'قانون العتلات' }]
      };
    }
    if (qClean.includes('صدى') || qClean.includes('صدي') || qClean.includes('عمق') || qClean.includes('بحر')) {
      return {
        content: `📌 **مسألة حساب عمق البحر بصدى الصوت (ص 64-65):**\n\n` +
                 `• ينتقل الصوت في ماء البحر بسرعة <span dir='ltr' class='phy-formula'>v ≈ 1500 m/s</span>.\n` +
                 `• النبضة الصوتية تقطع المسافة **ذهاباً وإياباً**، فالزمن المقاس t هو زمن الذهاب والإياب.\n` +
                 `• قانون العمق:\n` +
                 `<div dir='ltr' class='phy-math-block'>d = (v × t) / 2</div>\n` +
                 `• **مثال:** أرسلت سفينة موجة فوق صوتية لقاع البحر واستلمت صداها بعد <span dir='ltr' class='phy-formula'>t = 2 s</span>:\n` +
                 `<div dir='ltr' class='phy-math-block'>d = (1500 × 2) / 2 = 1500 m</div> (عمق البحر = 1.5 كيلومتر).`,
        sources: [{ page: 65, heading: 'تطبيقات صدى الصوت' }]
      };
    }
  }

  // 2. مطابقة قوانين ومفاهيم بنك الفيزياء الـ 18
  let matchedRuleId = null;
  if (qClean.includes('انكسار') || qClean.includes('عدس') || qClean.includes('زاويه حرجه') || qClean.includes('الياف بصر') || qClean.includes('منشور') || qClean.includes('قصر البصر') || qClean.includes('طول البصر') || qClean.includes('ابصار') || qClean.includes('بصر') || qClean.includes('طيف')) {
    matchedRuleId = 718;
  } else if (qClean.includes('مرايا') || qClean.includes('مراه') || qClean.includes('انعكاس') || qClean.includes('كسوف') || qClean.includes('خسوف') || qClean.includes('ظلال') || qClean.includes('ظل') || qClean.includes('ضوء')) {
    matchedRuleId = 717;
  } else if (qClean.includes('صوت') || qClean.includes('صدي') || qClean.includes('فوق صوتي') || qClean.includes('ديسيبل')) {
    matchedRuleId = 716;
  } else if (qClean.includes('موج') || qClean.includes('طول موج') || qClean.includes('تردد') || qClean.includes('مستعرض') || qClean.includes('طولي') || qClean.includes('هرتز')) {
    matchedRuleId = 715;
  } else if (qClean.includes('عتل') || qClean.includes('فائده ميكانيك')) {
    matchedRuleId = 713;
  } else if (qClean.includes('سطح مائل') || qClean.includes('بكر') || qClean.includes('اسفين') || qClean.includes('بريم') || qClean.includes('عجله ومحور') || qClean.includes('كفاءه الاله') || qClean.includes('اله بسيط')) {
    matchedRuleId = 714;
  } else if (qClean.includes('طاق') || qClean.includes('حركي') || qClean.includes('كامن') || qClean.includes('حفظ الطاق')) {
    matchedRuleId = 712;
  } else if (qClean.includes('قدر') || qClean.includes('واط') || qClean.includes('قدره حصان') || qClean.includes('وات')) {
    matchedRuleId = 711;
  } else if (qClean.includes('شغل') || qClean.includes('جول')) {
    matchedRuleId = 710;
  } else if (qClean.includes('جذب عام') || qClean.includes('جاذبي') || qClean.includes('وزن') || qClean.includes('كتل') || qClean.includes('سقوط حر') || qClean.includes('انعدام الوزن') || qClean.includes('قبان')) {
    matchedRuleId = 709;
  } else if (qClean.includes('نيوتن الثالث') || qClean.includes('فعل ورد فعل') || qClean.includes('صاروخ') || qClean.includes('الغازات')) {
    matchedRuleId = 708;
  } else if (qClean.includes('نيوتن الثاني') || qClean.includes('f = m') || qClean.includes('f=m') || qClean.includes('قوه وكتل') || qClean.includes('قوه وتعجيل') || qClean.includes('نيوتن 2')) {
    matchedRuleId = 707;
  } else if (qClean.includes('نيوتن الاول') || qClean.includes('قصور ذاتي') || qClean.includes('عطال') || qClean.includes('يندفع الراكب') || qClean.includes('نيوتن 1') || qClean.includes('نيوتن')) {
    matchedRuleId = 706;
  } else if (qClean.includes('انطلاق') || qClean.includes('سرع') || qClean.includes('تعجيل')) {
    matchedRuleId = 705;
  } else if (qClean.includes('مساف') || qClean.includes('ازاح') || qClean.includes('محصل')) {
    matchedRuleId = 704;
  } else if (qClean.includes('نقطه اسناد') || qClean.includes('سكون') || qClean.includes('مسار') || qClean.includes('حرك')) {
    matchedRuleId = 703;
  } else if (qClean.includes('مقداري') || qClean.includes('اتجاهي') || qClean.includes('قياسي') || qClean.includes('متجه')) {
    matchedRuleId = 702;
  } else if (qClean.includes('قياس') || qClean.includes('بادئ') || qClean.includes('نظام دولي') || qClean.includes('si') || qClean.includes('وحدات') || qClean.includes('تيرا') || qClean.includes('نانو') || qClean.includes('فيمتو')) {
    matchedRuleId = 701;
  }

  if (matchedRuleId) {
    const rule = rules.find(r => r.id === matchedRuleId);
    if (rule) {
      let diagNotice = '';
      const diag = diagrams.find(d => {
        const dt = (d.title || '') + ' ' + (d.category || '');
        return dt.includes(rule.title.substring(0, 10)) || 
               (rule.title.includes('نيوتن') && d.id === 'diag_newton_laws') || 
               (rule.title.includes('الشغل') && d.id === 'diag_work_power') || 
               (rule.title.includes('العتلات') && d.id === 'diag_levers_classes') || 
               (rule.title.includes('الصدى') && d.id === 'diag_sound_echo') || 
               (rule.title.includes('البادئات') && d.id === 'diag_measurement_prefixes');
      });
      if (diag) {
        diagNotice = `\n\n🔬 **اللوحة والتمثيل البياني المعتمد:** يتوفر رسم توضيحي هندسي متكامل لهذا المفهوم بعنوان «${diag.title}»، ويمكنك معاينته وتكبيره عبر زر "🔬 الرسم التوضيحي" بالدرس أو من معرض اللوحات.`;
      }

      const pageNum = {
        701: 5, 702: 8, 703: 11, 704: 14, 705: 17,
        706: 24, 707: 26, 708: 28, 709: 30,
        710: 36, 711: 38, 712: 40,
        713: 47, 714: 51,
        715: 57, 716: 62,
        717: 72, 718: 78
      }[rule.id] || 5;

      return {
        content: `📌 **${rule.title}** (كتاب الفيزياء - الصف الثاني المتوسط):\n\n` +
                 `💡 **الخلاصة العلمية:** ${rule.summary}\n\n` +
                 `📐 **القوانين والتفاصيل والضوابط:**\n${rule.details}${diagNotice}`,
        sources: [{ page: pageNum, heading: rule.title }]
      };
    }
  }

  // 3. البحث في بنك الرسوم واللوحات التوضيحية
  if (qClean.includes('رسم') || qClean.includes('لوح') || qClean.includes('مخطط') || qClean.includes('سلم البادئات')) {
    const diag = diagrams.find(d => {
      const dt = normalizeArabicSearchText(d.title + ' ' + d.category + ' ' + d.summary);
      return qClean.split(' ').some(w => w.length > 3 && dt.includes(w));
    }) || diagrams[0];

    return {
      content: `🎨 **اللوحة التوضيحية المتجهة (SVG): ${diag.title}**\n\n` +
               `💡 **التفسير الفيزيائي للرسم:** ${diag.summary}\n\n` +
               `📐 **المعادلة الرياضية للرسم:** ${diag.formula}\n\n` +
               `📌 **أهم مخرجات واستنتاجات اللوحة:**\n` +
               diag.keyPoints.map(p => `• ${p}`).join('\n') + `\n\n` +
               `🔍 يمكنك النقر على زر **«🔬 الرسم التوضيحي للدرس»** في أعلى الصفحة لتكبير اللوحة وفحص عناصرها بدقة فائقة.`,
      sources: [{ page: 5, heading: diag.title }]
    };
  }

  // 4. البحث في مقاطع الدرس الحالي المفتوح (Chunks)
  if (window.PHYSICS_CURRICULUM && window.PHYSICS_CURRICULUM.chapters) {
    let activeChunks = [];
    for (const ch of window.PHYSICS_CURRICULUM.chapters) {
      for (const l of ch.lessons || []) {
        if (l.id === appData.currentLessonId) {
          activeChunks = l.chunks || [];
          break;
        }
      }
      if (activeChunks.length > 0) break;
    }

    if (activeChunks.length > 0) {
      const qWords = qClean.split(/\s+/).filter(w => w.length > 2);
      let bestChunk = null;
      let maxMatches = 0;
      activeChunks.forEach(ch => {
        const chText = normalizeArabicSearchText(ch.content || ch.text || '');
        let score = 0;
        qWords.forEach(w => { if (chText.includes(w)) score++; });
        if (score > maxMatches) {
          maxMatches = score;
          bestChunk = ch;
        }
      });

      if (bestChunk && maxMatches >= 2) {
        return {
          content: `📖 **إجابة موثقة من الدرس الحالي (${bestChunk.heading || 'كتاب الفيزياء'}):**\n\n` +
                   `${bestChunk.content || bestChunk.text}`,
          sources: [{ page: bestChunk.page_number || bestChunk.page || 5, heading: bestChunk.heading || 'منهج الفيزياء' }]
        };
      }
    }
  }

  // 5. الرد العام الذكي لمادة الفيزياء
  return {
    content: `أهلاً بك! أنا **معلم الفيزياء الذكي للصف الثاني المتوسط** ⚛️.\n\n` +
             `تم فحص استفسارك في كتاب الفيزياء المعتمد (وزارة التربية العراقية).\n` +
             `يمكنك سؤالي عن:\n` +
             `1. **الحركة والقوة:** عناصر القياس، البادئات، المسافة والإزاحة، السرعة والتعجيل، وقوانين نيوتن الثلاثة.\n` +
             `2. **الشغل والقدرة والطاقة:** حساب الشغل بالجول، القدرة بالواط، الطاقة الحركية والكامنة، وحفظ الطاقة.\n` +
             `3. **الآلات البسيطة:** قانون العتلات بأنواعها الثلاثة، الفائدة الميكانيكية، السطح المائل، والبكرات.\n` +
             `4. **الصوت والضوء:** الموجات والتردد، صدى الصوت وعمق البحر، انعكاس وانكسار الضوء، والمرايا والعدسات.\n\n` +
             `💡 **جرّب النقر على أحد الأسئلة المقترحة أسفل الشاشة، أو اكتب مسألتك وسأشرحها لك خطوة بخطوة بالدليل والمعادلات.**`,
    sources: [{ page: 5, heading: 'كتاب الفيزياء - الثاني المتوسط' }]
  };
}

// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة التربية الإسلامية
// -------------------------------------------------------------
function generateIslamicLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const rules = window.ISLAMIC_RULES || [];

  let matchedRuleId = null;
  if (qClean.includes('مد') || qClean.includes('عارض') || qClean.includes('تلاو') || qClean.includes('تجويد')) {
    matchedRuleId = 601;
  } else if (qClean.includes('معجز') || qClean.includes('عقيد') || qClean.includes('تحدي')) {
    matchedRuleId = 602;
  } else if (qClean.includes('منافق')) {
    matchedRuleId = 603;
  } else if (qClean.includes('ايات') || qClean.includes('ايات') || qClean.includes('كسوف') || qClean.includes('خسوف')) {
    matchedRuleId = 608;
  } else if (qClean.includes('جماع') || qClean.includes('ليل')) {
    matchedRuleId = 606;
  } else if (qClean.includes('صلاه') || qClean.includes('صلات') || qClean.includes('ركوع')) {
    matchedRuleId = 604;
  } else if (qClean.includes('معروف') || qClean.includes('منكر')) {
    matchedRuleId = 605;
  } else if (qClean.includes('حرم') || qClean.includes('دم المسلم')) {
    matchedRuleId = 607;
  } else if (qClean.includes('اخلاق') || qClean.includes('اقربكم مني')) {
    matchedRuleId = 609;
  } else if (qClean.includes('صوم') || qClean.includes('صيام') || qClean.includes('افطار')) {
    matchedRuleId = 610;
  } else if (qClean.includes('ضرر') || qClean.includes('ضرار')) {
    matchedRuleId = 611;
  } else if (qClean.includes('سجود') || qClean.includes('ساجد')) {
    matchedRuleId = 612;
  } else if (qClean.includes('ايثار')) {
    matchedRuleId = 613;
  } else if (qClean.includes('اسراف') || qClean.includes('تبذير')) {
    matchedRuleId = 614;
  } else if (qClean.includes('رحم') || qClean.includes('اقارب')) {
    matchedRuleId = 615;
  }

  if (matchedRuleId) {
    const rule = rules.find(r => r.id === matchedRuleId);
    if (rule) {
      const pageNum = {
        601: 4, 602: 12, 603: 16, 604: 18, 605: 38,
        606: 41, 607: 62, 608: 65, 609: 86, 610: 89,
        611: 108, 612: 110, 613: 75, 614: 97, 615: 116
      }[rule.id] || 7;

      return {
        content: `📌 **${rule.title}** (كتاب التربية الإسلامية - الثاني المتوسط):\n\n` +
                 `💡 **الخلاصة الفقهية والعقدية:** ${rule.summary}\n\n` +
                 `📖 **الأدلة والتفاصيل والأحكام:**\n${rule.details}`,
        sources: [{ page: pageNum, heading: rule.title }]
      };
    }
  }

  // البحث في مقاطع الدرس الإسلامي الحالي
  if (window.ISLAMIC_CURRICULUM && window.ISLAMIC_CURRICULUM.chapters) {
    let activeChunks = [];
    for (const ch of window.ISLAMIC_CURRICULUM.chapters) {
      for (const l of ch.lessons || []) {
        if (l.id === appData.currentLessonId) {
          activeChunks = l.chunks || [];
          break;
        }
      }
      if (activeChunks.length > 0) break;
    }

    if (activeChunks.length > 0) {
      const qWords = qClean.split(/\s+/).filter(w => w.length > 2);
      let bestChunk = null;
      let maxMatches = 0;
      activeChunks.forEach(ch => {
        const chText = normalizeArabicSearchText(ch.content || ch.text || '');
        let score = 0;
        qWords.forEach(w => { if (chText.includes(w)) score++; });
        if (score > maxMatches) {
          maxMatches = score;
          bestChunk = ch;
        }
      });

      if (bestChunk && maxMatches >= 2) {
        return {
          content: `📖 **إجابة موثقة من الدرس الإسلامي الحالي (${bestChunk.heading || 'كتاب التربية الإسلامية'}):**\n\n` +
                   `${bestChunk.content || bestChunk.text}`,
          sources: [{ page: bestChunk.page_number || bestChunk.page || 7, heading: bestChunk.heading || 'التربية الإسلامية' }]
        };
      }
    }
  }

  return {
    content: `أهلاً بك! أنا **معلم التربية الإسلامية الذكي للصف الثاني المتوسط** 🕌.\n\n` +
             `تم فحص استفسارك في كتاب التربية الإسلامية المعتمد (وزارة التربية العراقية).\n` +
             `يمكنك سؤالي عن:\n` +
             `• **القرآن الكريم والتلاوة:** أحكام المد العارض للسكون، وتفسير سور: النبأ، القيامة، المزمل، الجمعة، والصف.\n` +
             `• **الحديث النبوي الشريف:** علامات المنافق، الأمر بالمعروف، حرمة المسلم، في الأخلاق، ومنع الضرر.\n` +
             `• **الفقه الإسلامي:** أركان الصلاة، صلاة الجماعة، صلاة الآيات، فريضة الصوم، وأعضاء السجود.\n` +
             `• **السيرة والآداب:** فتح مكة، الصحابة الكرام، خلق الإيثار، النهي عن الإسراف، وصلة الرحم.\n\n` +
             `💡 **جرّب النقر على أحد الأسئلة المقترحة أسفل الشاشة أو اكتب سؤالك وسأجيبك فوراً مع توثيق الصفحة.**`,
    sources: [{ page: 7, heading: 'كتاب التربية الإسلامية' }]
  };
}

// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة اللغة العربية
// -------------------------------------------------------------
function generateArabicLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);

  if (qClean.includes('علامات الاعراب') || qClean.includes('علامه الاعراب') || qClean.includes('اصليه وفرعيه') || qClean.includes('حركات فرعيه')) {
    return {
      content: `📌 **علامات الإعراب الأصلية والفرعية (الجزء الأول - ص 9 إلى 16):**\n\n` +
               `1. **العلامات الأصلية:**\n` +
               `• **الضمة:** للرفع في المفرد وجمع التكسير وجمع المؤنث السالم والمضارع.\n` +
               `• **الفتحة:** للنصب في المفرد وجمع التكسير والمضارع المسبوق بناصب.\n` +
               `• **الكسرة:** للجر في المفرد وجمع التكسير وجمع المؤنث السالم.\n` +
               `• **السكون:** للجزم في الفعل المضارع صحيح الآخر.\n\n` +
               `2. **العلامات الفرعية:**\n` +
               `• **الواو:** لرفع الأسماء الخمسة وجمع المذكر السالم.\n` +
               `• **الألف:** لرفع المثنى ونصب الأسماء الخمسة.\n` +
               `• **الياء:** لنصب وجر المثنى وجمع المذكر السالم وجر الأسماء الخمسة.\n` +
               `• **الكسرة بدل الفتحة:** لنصب جمع المؤنث السالم.\n` +
               `• **الفتحة بدل الكسرة:** لجر الممنوع من الصرف.\n` +
               `• **ثبوت وحذف النون:** لرفع ونصب وجزم الأفعال الخمسة.`,
      sources: [{ page: 9, heading: 'علامات الإعراب الأصلية والفرعية' }]
    };
  }

  if (qClean.includes('اسماء خمس') || qClean.includes('ابو') || qClean.includes('اخو') || qClean.includes('حمو') || qClean.includes('ذو') || qClean.includes('فو')) {
    return {
      content: `📌 **قاعدة الأسماء الخمسة وإعرابها (الجزء الأول - ص 26 إلى 30):**\n\n` +
               `• **الأسماء الخمسة هي:** (أبُو، أخُو، حَمُو، فُو، ذُو بمعنى صاحب).\n\n` +
               `• **إعرابها بالحروف:**\n` +
               `1. **ترفع بالواو:** جاءَ أبُوكَ، ذُو العلمِ مكرَمٌ.\n` +
               `2. **تنصب بالألف:** رأيتُ أخَاكَ، احترمتُ ذَا الفضلِ.\n` +
               `3. **تجر بالياء:** سلّمتُ على أبِيكَ، استمعتُ إلى ذِي الحكمةِ.\n\n` +
               `• **شروط إعرابها بالحروف:** أن تكون مفردة، مضافة إلى غير ياء المتكلم.`,
      sources: [{ page: 26, heading: 'الأسماء الخمسة' }]
    };
  }

  if (qClean.includes('ميزان صرفي') || qClean.includes('وزن الكلمات') || qClean.includes('فاء الكلمه') || qClean.includes('عين الكلمه')) {
    return {
      content: `📌 **قواعد الميزان الصرفي (الجزء الأول ص 38، والجزء الثاني ص 125):**\n\n` +
               `1. **الأساس:** جعل علماء العربية لفظ (فَـ ـعَـ ـلَ) ميزاناً للكلمات الثلاثية المجردة (كَتَبَ -> فَعَلَ).\n` +
               `2. **الكلمات المزيدة:** تنزل حروف الزيادة (سألتمونيها) في الميزان كما هي: (كَاتِب -> فَاعِل، اسْتَخْرَجَ -> اسْتَفْعَلَ).\n` +
               `3. **الرباعي والخماسي المجرد:** نزيد لاماً في الرباعي (دَحْرَجَ -> فَعْلَلَ)، ولامين في الخماسي (سَفَرْجَل -> فَعَلَّل).\n` +
               `4. **حذف حرف أصلي:** يُحذف ما يقابله في الميزان (قِ -> عِ، صُنْ -> فُلْ، يَصِلُ -> يَعِلُ).`,
      sources: [{ page: 38, heading: 'الميزان الصرفي' }]
    };
  }

  if (qClean.includes('نداء') || qClean.includes('منادي') || qClean.includes('حروف النداء') || qClean.includes('يا محمد')) {
    return {
      content: `📌 **أسلوب النداء وأحكام المنادى (الجزء الثاني - ص 8 إلى 12):**\n\n` +
               `1. **أحرف النداء:** (يا) لجميع المنادى، و(الهمزة وأي) للقريب، و(أيا وهيا) للبعيد.\n` +
               `2. **المنادى المبني (يبنى على ما يرفع به في محل نصب):**\n` +
               `• العلم المفرد: يا محمّدُ، يا فاطمةُ.\n` +
               `• النكرة المقصودة: يا رجلُ، يا طالبُ.\n` +
               `3. **المنادى المعرب المنصوب:**\n` +
               `• النكرة غير المقصودة: يا غافلاً تنبّهْ.\n` +
               `• المنادى المضاف: يا طالبَ العلمِ.\n` +
               `• الشبيه بالمضاف: يا حسناً وجهُهُ.`,
      sources: [{ page: 8, heading: 'أسلوب النداء' }]
    };
  }

  if (qClean.includes('استفهام') || qClean.includes('تصديق') || qClean.includes('تصور') || qClean.includes('ادوات الاستفهام') || qClean.includes('ام المعادله')) {
    return {
      content: `📌 **أسلوب الاستفهام (الجزء الثاني - ص 23 إلى 29):**\n\n` +
               `1. **استفهام التصديق:** يُطلب به إثبات النسبة أو نفيها، ويُجاب عنه بنعم أو لا. أدواته: (هل) و(الهمزة بدون أم المعادلة).\n` +
               `2. **استفهام التصور:** يُطلب به تعيين مفرد، ويُجاب عنه بالتعيين. أدواته: (الهمزة مع أم المعادلة) وأسماء الاستفهام (من، ما، أين، متى، كيف، كم، أي).`,
      sources: [{ page: 23, heading: 'الاستفهام' }]
    };
  }

  if (qClean.includes('لازم') || qClean.includes('متعدي')) {
    return {
      content: `📌 **الفعل اللازم والمتعدي (الجزء الأول - ص 53):**\n\n` +
               `1. **الفعل اللازم:** هو الفعل الذي يكتفي بفاعله ولا يحتاج لمفعول به لإتمام معناه (مثل: نامَ الطفلُ، جاءَ الحقُّ).\n` +
               `2. **الفعل المتعدي:** هو الفعل الذي لا يكتفي بفاعله بل يتعداه إلى مفعول به واحد أو أكثر لإتمام المعنى (مثل: كَتَبَ الطالبُ الدرسَ).\n` +
               `• **علامة المتعدي:** يقبل الاتصال بضمائر النصب (الهاء، الكاف، الياء): أكرمَ -> أكرَمَهُ.`,
      sources: [{ page: 53, heading: 'الفعل اللازم والمتعدي' }]
    };
  }

  if (qClean.includes('نائب فاعل') || qClean.includes('مبني للمجهول')) {
    return {
      content: `📌 **نائب الفاعل وبناء الفعل للمجهول (الجزء الأول - ص 68):**\n\n` +
               `• **نائب الفاعل:** اسم مرفوع يحل محل الفاعل بعد حذفه، ويأخذ أحكامه الإعرابية.\n` +
               `• **صياغة المبني للمجهول:**\n` +
               `1. في الماضي: يُضم أوله ويُكسر ما قبل آخره (كَتَبَ -> كُـتِـبَ).\n` +
               `2. في المضارع: يُضم أوله ويُفتح ما قبل آخره (يَكْتُبُ -> يُـكْـتَـبُ).\n` +
               `• **مثال الإعراب:** كُتِبَ الدرسُ (الدرسُ: نائب فاعل مرفوع بالضمة).`,
      sources: [{ page: 68, heading: 'نائب الفاعل' }]
    };
  }

  if (qClean.includes('مفعول فيه') || qClean.includes('مفعول مطلق') || qClean.includes('ظرف زمان') || qClean.includes('ظرف مكان')) {
    return {
      content: `📌 **المفاعيل: المفعول فيه والمفعول المطلق (الجزء الأول - ص 84 و ص 97):**\n\n` +
               `1. **المفعول فيه (ظرفا الزمان والمكان):** اسم منصوب متضمن معنى (في) يدل على زمان أو مكان وقوع الفعل (سافرتُ ليلاً، وقفتُ أمامَ الصفِّ).\n` +
               `2. **المفعول المطلق:** مصدر منصوب مشتق من لفظ الفعل يُذكر معه لتوكيده، أو بيان نوعه، أو بيان عدده (وَرَتِّلِ الْقُرْآنَ تَرْتِيلاً).`,
      sources: [{ page: 84, heading: 'المفعول فيه' }]
    };
  }

  if (qClean.includes('مثني') || qClean.includes('كلا وكلتا') || qClean.includes('اثنان واثنتان')) {
    return {
      content: `📌 **المثنى والملحق به (الجزء الثاني - ص 52):**\n\n` +
               `• **المثنى:** اسم يدل على اثنين أو اثنتين بزيادة ألف ونون في الرفع، أو ياء ونون في النصب والجر.\n` +
               `• **إعرابه:** يرفع بالألف (حضر الطالبانِ)، وينصب ويجر بالياء (كافأتُ الطالبينِ).\n` +
               `• **الملحق بالمثنى:** اثنان واثنتان، وكلا وكلتا إذا أضيفتا لضمير (كلاهما).`,
      sources: [{ page: 52, heading: 'المثنى والملحق به' }]
    };
  }

  if (qClean.includes('جمع مذكر') || qClean.includes('جمع مؤنث') || qClean.includes('ملحقات جمع')) {
    return {
      content: `📌 **جمع المذكر والمؤنث السالم (الجزء الثاني - ص 66 و ص 84):**\n\n` +
               `1. **جمع المذكر السالم:** يرفع بالواو (نجح المهندسونَ)، وينصب ويجر بالياء (شكرتُ المهندسينَ).\n` +
               `2. **جمع المؤنث السالم:** يرفع بالضمة (حضرتْ المعلماتُ)، وينصب ويجر بالكسرة بدل الفتحة (شكرتُ المعلماتِ).`,
      sources: [{ page: 66, heading: 'جمع المذكر والمؤنث السالم' }]
    };
  }

  return {
    content: `أهلاً بك! أنا **معلم اللغة العربية الذكي للصف الثاني المتوسط** 📖.\n\n` +
             `تم فحص استفسارك في كتابي اللغة العربية المعتمدين (الجزء الأول والثاني).\n` +
             `يمكنك سؤالي عن علامات الإعراب، الأسماء الخمسة، الميزان الصرفي، نائب الفاعل، المفاعيل، الحال، الاستثناء، أسلوب النداء، أسلوب الاستفهام، المثنى، وجموع السالم والتكسير.\n\n` +
             `💡 **جرّب النقر على أحد الأسئلة المقترحة أسفل الشاشة أو اكتب سؤالك وسأجيبك فوراً مع توثيق الصفحة.**`,
    sources: [{ page: 5, heading: 'كتاب اللغة العربية' }]
  };
}


// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة الرياضيات (الصف الثاني المتوسط)
// -------------------------------------------------------------
function generateMathLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const mathRules = window.MATH_RULES || [];

  if (qClean.includes('فيثاغورس') || qClean.includes('مثلث قائم') || qClean.includes('وتر') || qClean.includes('عكس فيثاغورس')) {
    return {
      content: '📌 **مبرهنة فيثاغورس وتطبيقاتها (كتاب الرياضيات - الفصل 2):**\n\n' +
               '• **نص المبرهنة:** في أي مثلث قائم الزاوية، مساحة المربع المنشأ على الوتر تساوي مجموع مساحتي المربعين المنشأين على الضلعين القائمين الآخرين.\n' +
               '• **الصيغة الرياضية:** <span dir="ltr" class="phy-formula">c² = a² + b²</span> (حيث c هو الوتر).\n' +
               '• **طول الوتر:** <span dir="ltr" class="phy-formula">c = √(a² + b²)</span>.\n' +
               '• **عكس مبرهنة فيثاغورس:** إذا كان مربع أطول أضلاع مثلث يساوي مجموع مربعي الضلعين الآخرين، فإن المثلث قائم الزاوية حتماً المقابلة لذلك الضلع.',
      sources: [{ page: 46, heading: 'تطبيقات نظرية فيثاغورس' }]
    };
  }

  if (qClean.includes('مسافه بين نقطت') || qClean.includes('قانون المسافه') || qClean.includes('مستوي احداثي')) {
    return {
      content: '📌 **قانون المسافة بين نقطتين في المستوي الإحداثي (ص 52):**\n\n' +
               '• تعطى المسافة d بين النقطتين <span dir="ltr" class="phy-formula">A(x₁, y₁)</span> و <span dir="ltr" class="phy-formula">B(x₂, y₂)</span> بالقانون:\n' +
               '<div dir="ltr" class="phy-math-block">d = √[ (x₂ - x₁)² + (y₂ - y₁)² ]</div>\n' +
               '• **خطوات الحل:** 1. نحدد إحداثيات النقطتين، 2. نطرح السينات ونربع، 3. نطرح الصادات ونربع، 4. نجمع الناتجين ونأخذ الجذر التربيعي الموجب.',
      sources: [{ page: 52, heading: 'المستوي الإحداثي وقانون المسافة' }]
    };
  }

  if (qClean.includes('ميل') || qClean.includes('ميل المستقيم') || qClean.includes('تغير صادي') || qClean.includes('تغير سيني')) {
    return {
      content: '📌 **ميل المستقيم وحالاته الأربع (كتاب الرياضيات - الفصل 6):**\n\n' +
               '• **قانون الميل:** <span dir="ltr" class="phy-formula">m = (y₂ - y₁) / (x₂ - x₁)</span> (حيث x₂ ≠ x₁).\n' +
               '• **الحالات الأربع للميل:**\n' +
               '1. **الميل موجب (m > 0):** المستقيم يتجه للأعلى نحو اليمين (كلما زادت x زادت y).\n' +
               '2. **الميل سالب (m < 0):** المستقيم يتجه للأسفل نحو اليمين (كلما زادت x تناقصت y).\n' +
               '3. **الميل صفر (m = 0):** مستقيم أفقي موازٍ لمحور السينات، وقيم y ثابتة.\n' +
               '4. **الميل غير محدد (غير معرف):** مستقيم عمودي (رأسي) موازٍ لمحور الصادات، والمقام x₂ - x₁ = 0.',
      sources: [{ page: 12, heading: 'ميل المستقيم' }]
    };
  }

  if (qClean.includes('عامل مشترك') || qClean.includes('gcf') || qClean.includes('تحليل مقدار') || qClean.includes('فرق بين مربعين')) {
    return {
      content: '📌 **طرائق تحليل المقادير الجبرية (كتاب الرياضيات - الفصل 3):**\n\n' +
               '1. **التحليل باستخراج العامل المشترك الأكبر (G.C.F):** استخراج حاصل ضرب العوامل المشتركة بأصغر أس للرموز مع العامل المشترك العددي.\n' +
               '2. **خاصية التجميع والمعكوس:** تجميع الحدود ذات العوامل المشتركة مثنى مثنى، وإذا تعاكست الإشارات نستخرج (-1) كعامل مشترك.\n' +
               '3. **التحليل بالفرق بين مربعين:**\n' +
               '<div dir="ltr" class="phy-math-block">a² - b² = (a - b)(a + b)</div>\n' +
               '• مثال: <span dir="ltr" class="phy-formula">x² - 25 = (x - 5)(x + 5)</span>.',
      sources: [{ page: 78, heading: 'تحليل المقادير الجبرية' }]
    };
  }

  if (qClean.includes('مطلق') || qClean.includes('معادله القيمه المطلقه') || qClean.includes('متباينه') || qClean.includes('حل متباينه')) {
    return {
      content: '📌 **معادلات القيمة المطلقة والمتباينات (كتاب الرياضيات - الفصل 4):**\n\n' +
               '• **معادلة المطلق |x| = a (حيث a ≥ 0):** تكافئ حالتين: إما <span dir="ltr" class="phy-formula">x = a</span> أو <span dir="ltr" class="phy-formula">x = -a</span>.\n' +
               '• إذا كان a < 0 فإن مجموعة الحل خالية <span dir="ltr" class="phy-formula">S = ∅</span> لأن المطلق موجب دوماً.\n' +
               '• **قاعدة ذهبية في المتباينات:** عند ضرب أو قسمة طرفي المتباينة على عدد سالب، يجب **عكس اتجاه رمز التباين** (الأكبر يصبح أصغر والعكس).',
      sources: [{ page: 104, heading: 'معادلات القيمة المطلقة والمتباينات' }]
    };
  }

  // مطابقة عامة مع بنك قوانين الرياضيات
  const matched = mathRules.find(r => {
    const titleClean = normalizeArabicSearchText(r.title);
    const catClean = normalizeArabicSearchText(r.category || '');
    return qClean.split(' ').some(w => w.length > 2 && (titleClean.includes(w) || catClean.includes(w)));
  });

  if (matched) {
    return {
      content: '📌 **' + matched.title + ' (رياضيات الثاني متوسط):**\n\n' +
               '• **الملخص:** ' + matched.summary + '\n\n' +
               '• **التفاصيل والقوانين:**\n' + matched.details,
      sources: [{ page: matched.page || 6, heading: matched.category || 'قوانين الرياضيات' }]
    };
  }

  return {
    content: 'أهلاً بك! أنا **معلم الرياضيات الذكي للصف الثاني المتوسط** 📐.\n\n' +
             'تم فحص استفسارك في كتاب الرياضيات المعتمد بجزأيه الأول والثاني.\n' +
             'يمكنك سؤالي عن: مبرهنة فيثاغورس، المسافة بين نقطتين، ميل المستقيم، تحليل المقادير الجبرية (العامل المشترك والفرق بين مربعين)، معادلات القيمة المطلقة، المتباينات، وحساب حجوم ومساحات الهرم والمخروط والإحصاء.\n\n' +
             '💡 **اكتب مسألتك أو استفسارك وسأزودك بالقانون وخطوات الحل والصفحة المعتمدة فوراً.**',
    sources: [{ page: 6, heading: 'كتاب الرياضيات' }]
  };
}

// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة الاجتماعيات (الصف الثاني المتوسط)
// -------------------------------------------------------------
function generateSocialLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const terms = window.SOCIAL_TERMS_BANK || [];

  if (qClean.includes('طوبقال') || qClean.includes('جبال الاطلس') || qClean.includes('اعلي قمه')) {
    return {
      content: '📌 **قمة طوبقال وجبال الأطلس (كتاب الاجتماعيات ص 10-12):**\n\n' +
               '• **طوبقال:** هي أعلى قمة جبلية في العالم العربي، يبلغ ارتفاعها **4165 متراً** فوق مستوى سطح البحر.\n' +
               '• تقع ضمن سلسلة جبال الأطلس الكبير في المملكة المغربية.\n' +
               '• تكسوها الثلوج طوال فصل الشتاء وتعد من أهم المعالم التضاريسية والجغرافية في المغرب العربي.',
      sources: [{ page: 11, heading: 'سلاسل جبال العالم العربي' }]
    };
  }

  if (qClean.includes('دجله') || qClean.includes('فرات') || qClean.includes('نيل') || qClean.includes('انهار طويله')) {
    return {
      content: '📌 **شبكة الأنهار الطويلة في العالم العربي (ص 24-28):**\n\n' +
               '1. **نهر النيل:** أطول أنهار العالم والعالم العربي بطول **6670 كم**، ينبع من بحيرة فيكتوريا وهضبة الحبشة ويصب في البحر المتوسط.\n' +
               '2. **نهر الفرات:** ينبع من جبال طوروس في تركيا بطول **2940 كم** ويدخل سوريا عند جرابلس والعراق عند القائم ويلتقي بدجلة عند كرمة علي مكوناً شط العرب.\n' +
               '3. **نهر دجلة:** ينبع من بحيرة كولجك ومرتفعات تركيا بطول **1900 كم**، ويدخل العراق عند فيشخابور وتصب فيه خمسة روافد رئيسية (الخابور، الزاب الكبير، الزاب الصغير، العظيم، وديالى).',
      sources: [{ page: 25, heading: 'الأنهار الطويلة في العالم العربي' }]
    };
  }

  if (qClean.includes('حلف الفضول') || qClean.includes('دار الندوه') || qClean.includes('قصي بن كلاب')) {
    return {
      content: '📌 **أوضاع مكة قبل الإسلام: حلف الفضول ودار الندوة (ص 86-90):**\n\n' +
               '• **دار الندوة:** أول مجلس شورى وبناء برلماني أسسه **قصي بن كلاب** بجوار الكعبة المعظمة لإدارة شؤون مكة والتشاور في شؤون الحرب والسلم وتسيير القوافل.\n' +
               '• **حلف الفضول:** أشرف وأعظم حلف تعاهدت عليه قبائل قريش في دار عبد الله بن جدعان، لنصرة أي مظلوم بمكة غريباً كان أو قريباً، وحضره النبي ﷺ قبل البعثة وأثنى عليه قائلاً: «لقد شهدتُ في دار عبد الله بن جدعان حلفاً ما أحب أن لي به حُمر النَّعَم».',
      sources: [{ page: 88, heading: 'أوضاع مكة المكرمة وحلف الفضول' }]
    };
  }

  if (qClean.includes('وثيقه المدينه') || qClean.includes('دستور المدينه') || qClean.includes('المؤاخاه')) {
    return {
      content: '📌 **وثيقة المدينة المنورة والمؤاخاة (ص 118-122):**\n\n' +
               '• **وثيقة المدينة:** أول دستور مدني وحقوقي مكتوب في تاريخ البشرية أرساه النبي ﷺ بعد وصوله للمدينة المنورة.\n' +
               '• **أهم بنودها ومبادئها:**\n' +
               '1. حرية العقيدة وممارسة الشعائر الدينية لكافة سكان المدينة بمن فيهم اليهود.\n' +
               '2. المساواة في الحقوق والواجبات والتكافل الاجتماعي المشترك.\n' +
               '3. الدفاع المشترك عن يثرب (المدينة) ضد أي عدوان خارجي، واعتبار سكانها أمة واحدة.\n' +
               '• **المؤاخاة:** آخى النبي ﷺ بين المهاجرين والأنصار لإذابة الفوارق القبلية وإرساء الأخوة الإيمانية.',
      sources: [{ page: 120, heading: 'بناء الدولة ووثيقة المدينة' }]
    };
  }

  // مطابقة عامة مع مصطلحات الاجتماعيات
  const matched = terms.find(t => {
    const titleClean = normalizeArabicSearchText(t.title);
    const catClean = normalizeArabicSearchText(t.category || '');
    return qClean.split(' ').some(w => w.length > 2 && (titleClean.includes(w) || catClean.includes(w)));
  });

  if (matched) {
    return {
      content: '📌 **' + matched.title + ' (كتاب الاجتماعيات):**\n\n' +
               '• **المفهوم:** ' + matched.summary + '\n\n' +
               '• **التفاصيل:**\n' + matched.details,
      sources: [{ page: matched.page || 20, heading: matched.category || 'الاجتماعيات' }]
    };
  }

  return {
    content: 'أهلاً بك! أنا **معلم الاجتماعيات الذكي للصف الثاني المتوسط** 🌍.\n\n' +
             'تم فحص استفسارك في كتاب الاجتماعيات المعتمد (جغرافية وتاريخ العالم العربي).\n' +
             'يمكنك سؤالي عن: جغرافية العالم العربي وتضاريسه، سلاسل الجبال (الأطلس، شمال العراق، بلاد الشام)، شبكة الأنهار (دجلة والفرات والنيل)، الأقاليم المناخية، النفط والثروات المعدنية، أحوال مكة وحلف الفضول، والسيرة النبوية والغزوات ووثيقة المدينة المنورة.\n\n' +
             '💡 **اكتب استفسارك وسأزودك بالإجابة الموثقة مع رقم الصفحة فوراً.**',
    sources: [{ page: 4, heading: 'كتاب الاجتماعيات' }]
  };
}

// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة الكيمياء (الصف الثاني المتوسط)
// -------------------------------------------------------------
function generateChemistryLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const chemRules = window.CHEMISTRY_RULES || [];

  if (qClean.includes('رابطه ايوني') || qClean.includes('رابطه تساهمي') || qClean.includes('ترابط كيميائي')) {
    return {
      content: '📌 **الروابط الكيميائية: الأيونية والتساهمية (كتاب الكيمياء ص 12-16):**\n\n' +
               '1. **الرابطة الأيونية (Ionic Bond):** قوة جذب إلكتروستاتيكية تنشأ بين أيون فلزي موجب فقد إلكترونات وأيون لافلزي سالب اكتسبها (مثل: <span dir="ltr" class="phy-formula">Na⁺ + Cl⁻ ➔ NaCl</span>).\n' +
               '2. **الرابطة التساهمية (Covalent Bond):** قوة ربط تنشأ بين ذرتين لافلزيتين بمشاركة زوج أو أكثر من الإلكترونات للوصول لحالة الاستقرار الثماني (مثل جزيء الماء H₂O وغاز الميثان CH₄).\n' +
               '• المركبات الأيونية درجات انصهارها مرتفعة وتوصل الكهرباء بمحاليلها، بينما التساهمية درجات انصهارها منخفضة ولا توصل محاليلها التيار الكهربائي.',
      sources: [{ page: 14, heading: 'الروابط الكيميائية' }]
    };
  }

  if (qClean.includes('الكترونات التكافؤ') || qClean.includes('تكافؤ') || qClean.includes('اعداد التاكسد') || qClean.includes('عدد تاكسد')) {
    return {
      content: '📌 **إلكترونات التكافؤ وأعداد التأكسد (ص 8-10):**\n\n' +
               '• **إلكترونات التكافؤ:** هي إلكترونات الغلاف الخارجي الأبعد عن النواة وتحدد قابلية الذرة للدخول في التفاعلات الكيميائية.\n' +
               '• **أعداد التأكسد:** شحنة كهربائية موجبة أو سالبة تدل على عدد الإلكترونات التي فقدتها الذرة أو اكتسبتها أو شاركت بها.\n' +
               '• **قاعدة عامة:** مجموع أعداد التأكسد لجميع ذرات أي مركب كيميائي متعادل يساوي **صفراً**، بينما للأيون يساوي شحنة الأيون.',
      sources: [{ page: 9, heading: 'البناء الذري وإلكترونات التكافؤ' }]
    };
  }

  if (qClean.includes('موازنه') || qClean.includes('معادله كيميائي') || qClean.includes('تفاعل كيميائي') || qClean.includes('انواع التفاعلات')) {
    return {
      content: '📌 **المعادلات الكيميائية وأنواع التفاعلات وموازنتها (ص 38-44):**\n\n' +
               '• **قانون حفظ الكتلة:** مجموع كتل المواد المتفاعلة يساوي مجموع كتل المواد الناتجة، ولذلك نزن المعادلة بجعل عدد ذرات كل عنصر متساوياً بالطرفين.\n' +
               '• **أنواع التفاعلات الرئيسية الأربعة:**\n' +
               '1. **تفاعل الاتحاد:** مادتان تتحدان لتكوين مادة واحدة (<span dir="ltr" class="phy-formula">A + B ➔ AB</span>).\n' +
               '2. **تفاعل التفكك (الانحلال):** مركب يتفكك لمركبين أو عنصرين أبسط (<span dir="ltr" class="phy-formula">AB ➔ A + B</span>).\n' +
               '3. **تفاعل الاستبدال الأحادي:** عنصر يحل محل عنصر آخر في مركب (<span dir="ltr" class="phy-formula">A + BC ➔ AC + B</span>).\n' +
               '4. **تفاعل الاستبدال الثنائي:** تبادل أيونات بين مركبين لتكوين مركبين جديدين.',
      sources: [{ page: 40, heading: 'التفاعلات الكيميائية وموازنتها' }]
    };
  }

  if (qClean.includes('حامض') || qClean.includes('قاعده') || qClean.includes('ارهينيوس') || qClean.includes('ph') || qClean.includes('رقم هيدروجيني') || qClean.includes('زهره الشمس')) {
    return {
      content: '📌 **الحوامض والقواعد ومقياس الرقم الهيدروجيني pH (ص 66-86):**\n\n' +
               '• **الحامض (أرهينيوس):** يحرر أيونات <span dir="ltr" class="phy-formula">H⁺</span> بالماء، طعمه حامض لاذع، ويحول ورقة زهرة الشمس إلى **الأحمر**.\n' +
               '• **القاعدة (أرهينيوس):** تحرر أيونات <span dir="ltr" class="phy-formula">OH⁻</span> بالماء، ملمسها صابوني زلق، وتحول ورقة زهرة الشمس إلى **الأزرق**.\n' +
               '• **مقياس الرقم الهيدروجيني (pH):**\n' +
               '• <span dir="ltr" class="phy-formula">pH < 7</span>: محلول حامضي (كلما قل زادت الحامضية).\n' +
               '• <span dir="ltr" class="phy-formula">pH = 7</span>: محلول متعادل كالمياه النقية.\n' +
               '• <span dir="ltr" class="phy-formula">pH > 7</span>: محلول قاعدي (كلما زاد زادت القاعدية).\n' +
               '• **تفاعل التعادل:** حامض + قاعدة ➔ ملح + ماء.',
      sources: [{ page: 70, heading: 'الحوامض والقواعد والأملاح' }]
    };
  }

  // مطابقة عامة مع قواعد الكيمياء
  const matched = chemRules.find(r => {
    const titleClean = normalizeArabicSearchText(r.title);
    const catClean = normalizeArabicSearchText(r.category || '');
    return qClean.split(' ').some(w => w.length > 2 && (titleClean.includes(w) || catClean.includes(w)));
  });

  if (matched) {
    return {
      content: '📌 **' + matched.title + ' (كتاب الكيمياء ص ' + (matched.page || 10) + '):**\n\n' +
               '• **الملخص:** ' + matched.summary + '\n\n' +
               '• **التفاصيل والشرح العلمي:**\n' + matched.details,
      sources: [{ page: matched.page || 10, heading: matched.category || 'الكيمياء' }]
    };
  }

  return {
    content: 'أهلاً بك! أنا **معلم الكيمياء الذكي للصف الثاني المتوسط** 🧪.\n\n' +
             'تم فحص استفسارك في كتاب الكيمياء المعتمد بكافة فصوله الستة.\n' +
             'يمكنك سؤالي عن: البناء الذري وإلكترونات التكافؤ، أعداد التأكسد، الروابط الأيونية والتساهمية، قوى فان در فال والروابط الهيدروجينية، كتابة الصيغ الكيميائية وموازنة المعادلات، طرائق فصل المخاليط، الحوامض والقواعد، مقياس الرقم الهيدروجيني pH، وتفاعلات التعادل وتكون الأملاح.\n\n' +
             '💡 **اكتب سؤالك وسأجيبك فوراً مع الصيغ الكيميائية والصفحة المعتمدة.**',
    sources: [{ page: 5, heading: 'كتاب الكيمياء' }]
  };
}

// -------------------------------------------------------------
// محرك المعلم الذكي الموثق لمادة علم الأحياء (الصف الثاني المتوسط)
// -------------------------------------------------------------
function generateBiologyLocalAnswer(query, lessonId, curr) {
  const qClean = normalizeArabicSearchText(query);
  const bioRules = window.BIOLOGY_RULES || [];

  if (qClean.includes('تصنيف') || qClean.includes('مراتب تصنيف') || qClean.includes('وايتكر') || qClean.includes('لينيوس') || qClean.includes('نوع') || qClean.includes('تسميه ثنائي')) {
    return {
      content: '📌 **علم التصنيف والممالك الخمس والتسمية الثنائية (كتاب الأحياء ص 4-22):**\n\n' +
               '• **مفهوم النوع (جون راي ولينيوس):** الوحدة الأساسية في التصنيف، ويضم أفراداً متشابهين قادرين على التزاوج الخصب.\n' +
               '• **نظام التسمية الثنائية (لينيوس):** اسم لاتيني من كلمتين: اسم الجنس (Capital) واسم النوع (small).\n' +
               '• **المراتب السبع الهرمية:** مملكة ➔ شعبة ➔ صنف ➔ رتبة ➔ عائلة ➔ جنس ➔ نوع.\n' +
               '• **ممالك وايتكر الخمس (1969):** 1. البدائيات (البكتيريا)، 2. الطليعيات (الأميبا والبراميسيوم واليوغلينا)، 3. الفطريات (عفن الخبز والمشروم)، 4. النباتات، 5. الحيوانات.',
      sources: [{ page: 12, heading: 'علم التصنيف والممالك الخمس' }]
    };
  }

  if (qClean.includes('اميبا') || qClean.includes('براميسيوم') || qClean.includes('يوغلينا') || qClean.includes('طليعيات') || qClean.includes('فطريات') || qClean.includes('اشنات')) {
    return {
      content: '📌 **الكائنات الحية البسيطة: الطليعيات والفطريات (ص 28-36):**\n\n' +
               '• **الأميبا:** كائن وحيد الخلية يتحرك ويقتنص الغذاء بالأقدام الكاذبة بالبلعمة.\n' +
               '• **البراميسيوم:** كائن مغزلي يتحرك بالأهداب، يدخل الغذاء عبر الميزاب الفموي، وله نواتان (كبيرة وصغيرة).\n' +
               '• **اليوغلينا:** كائن سوطي يحوي بلاستيدات خضراء يصنع غذاءه بالضوء وبقعة عينية حساسة للضوء.\n' +
               '• **الأشنات (Lichens):** معيشة تكافلية مشتركة بين فطر وطحلب لتبادل المنفعة والحماية.',
      sources: [{ page: 28, heading: 'مملكة الطليعيات والفطريات' }]
    };
  }

  if (qClean.includes('نبات') || qClean.includes('حزازيات') || qClean.includes('سرخسيات') || qClean.includes('تعاقب الاجيال') || qClean.includes('فلقه') || qClean.includes('فلقتين')) {
    return {
      content: '📌 **مملكة النباتات وتصنيفها (ص 42-50):**\n\n' +
               '• **الحزازيات (كالفيوناريا):** نباتات لا وعائية صغيرة تعيش بالأماكن الرطبة الظليلة ولها أشباه جذور وسيقان.\n' +
               '• **السرخسيات (كالبوليبوديوم):** نباتات وعائية تمتلك خشب ولحاء حقيقيين وتتكاثر بالأبواغ.\n' +
               '• **تعاقب الأجيال:** تعاقب جيل جنسي مشيجي (1n) وجيل لاجنسي بوغي (2n) في دورة حياة النبات.\n' +
               '• **ذوات الفلقة الواحدة:** فلقة واحدة، تعرق متوازي، جذور ليفية (كالقمح والذرة).\n' +
               '• **ذوات الفلقتين:** فلقتان، تعرق شبكي، جذور وتدية (كالباقلاء والفاصولياء).',
      sources: [{ page: 44, heading: 'مملكة النباتات' }]
    };
  }

  if (qClean.includes('حيوان') || qClean.includes('لافقريات') || qClean.includes('فقريات') || qClean.includes('اسماك') || qClean.includes('برمائيات') || qClean.includes('زواحف') || qClean.includes('طيور') || qClean.includes('ثدييات')) {
    return {
      content: '📌 **مملكة الحيوانات: اللافقريات والفقريات (ص 56-66):**\n\n' +
               '• **اللافقريات (8 شعب):** مساميات (إسفنج)، لاسعات (هيدرا)، ديدان مسطحة (بلاناريا)، ديدان خيطية (إسكارس)، ديدان حلقية (دودة الأرض)، رخويات (حلزون)، مفصليات الأرجل (حشرات وعناكب)، وشوكيات الجلد (نجم البحر).\n' +
               '• **الفقريات (الحبليات - 5 أصناف):**\n' +
               '1. الأسماك: خياشيم وزعانف وتعيش بالماء.\n' +
               '2. البرمائيات: تتنفس بالخياشيم صغاراً وبالرئات والجلد كباراً (كالضفدع).\n' +
               '3. الزواحف: جلد حرشفي جاف يمنع فقدان الماء (كالسحلية والتمساح).\n' +
               '4. الطيور: ريش وأجنحة وعظام مجوفة وأكياس هوائية للطيران.\n' +
               '5. الثدييات: يغطيها الشعر وترضع صغارها الحليب وثابتة درجة الحرارة.',
      sources: [{ page: 58, heading: 'مملكة الحيوانات' }]
    };
  }

  if (qClean.includes('بيئه') || qClean.includes('نظام بيئي') || qClean.includes('سلسله غذائي') || qClean.includes('هرم طاقه') || qClean.includes('نيتروجين') || qClean.includes('كربون') || qClean.includes('احتباس حراري') || qClean.includes('امطار حامضي')) {
    return {
      content: '📌 **البيئة والتوازن البيئي ودورات العناصر (ص 72-90):**\n\n' +
               '• **النظام البيئي:** مجتمع حيوي (منتجات، مستهلكات، محللات) يتفاعل مع عوامل غير حية (ماء، هواء، تربة، ضوء).\n' +
               '• **هرم الطاقة والسلسلة الغذائية:** مسار انتقال الطاقة من المنتجات للمستهلكات مع فقدان 90% من الطاقة كحرارة وتنفس عند كل مستوى غذائي.\n' +
               '• **دورات العناصر:**\n' +
               '• دورة النيتروجين: تثبيت بكتيري ➔ امتصاص نباتي ➔ تحلل ➔ نزع النيتروجين.\n' +
               '• دورة الكربون والأكسجين: تكامل وتوازن بين البناء الضوئي (ينتج الأكسجين) والتنفس الخلوي (ينتج CO₂).\n' +
               '• **المشكلات البيئية:** الاحتباس الحراري، الأمطار الحامضية، والقواعد الثلاث لاستدامة الموارد (ترشيد، إعادة استخدام، تدوير 3Rs).',
      sources: [{ page: 74, heading: 'البيئة ومواردها والتوازن' }]
    };
  }

  // مطابقة عامة مع مفاهيم وقواعد علم الأحياء
  const matched = bioRules.find(r => {
    const titleClean = normalizeArabicSearchText(r.title);
    const catClean = normalizeArabicSearchText(r.category || '');
    return qClean.split(' ').some(w => w.length > 2 && (titleClean.includes(w) || catClean.includes(w)));
  });

  if (matched) {
    return {
      content: '📌 **' + matched.title + ' (علم الأحياء - الثاني متوسط):**\n\n' +
               '• **الملخص:** ' + matched.summary + '\n\n' +
               '• **التفاصيل العلمية:**\n' + matched.details,
      sources: [{ page: 15, heading: matched.category || 'علم الأحياء' }]
    };
  }

  return {
    content: 'أهلاً بك! أنا **معلم علم الأحياء الذكي للصف الثاني المتوسط** 🧬.\n\n' +
             'تم فحص استفسارك في كتاب علم الأحياء المعتمد بكافة وحداته وفصوله السبعة.\n' +
             'يمكنك سؤالي عن: علم التصنيف والممالك الخمس، الطليعيات (الأميبا، البراميسيوم، اليوغلينا)، الفطريات والأشنات، مملكة النباتات (الحزازيات، السرخسيات، البذرية)، مملكة الحيوانات (اللافقريات والفقريات)، السلاسل والشبكات الغذائية، هرم الطاقة، دورات العناصر في الطبيعة (الكربون والنيتروجين والماء)، والمشكلات البيئية واستدامة الموارد.\n\n' +
             '💡 **اكتب استفسارك وسأزودك بالإجابة الموثقة والصفحة فوراً.**',
    sources: [{ page: 4, heading: 'كتاب علم الأحياء' }]
  };
}

// محرك الإجابة المحلي الذكي الموثق الشامل
function generateLocalAnswer(query, lessonId) {
  const q = query.toLowerCase().trim();
  const curr = (appData.curriculums || []).find(c => c.id === appData.currentCurriculumId) || {};
  const isBiology = curr.id === 11 || (curr.subject && curr.subject.includes('أحياء'));
  const isChemistry = curr.id === 10 || (curr.subject && curr.subject.includes('كيمياء'));
  const isSocial = curr.id === 9 || (curr.subject && curr.subject.includes('اجتماع'));
  const isMath = curr.id === 8 || (curr.subject && curr.subject.includes('رياضيات'));
  const isPhysics = curr.id === 7 || (curr.subject && curr.subject.includes('فيزياء'));
  const isIslamic = curr.id === 6 || (curr.subject && curr.subject.includes('إسلام'));
  const isArabic = curr.id === 4 || curr.id === 5 || (curr.subject && curr.subject.includes('عرب'));

  // توجيه السؤال مباشرة إلى محرك المادة المعتمد حصراً منعاً لأي تداخل بين المناهج
  if (isBiology) {
    return generateBiologyLocalAnswer(query, lessonId, curr);
  }
  if (isChemistry) {
    return generateChemistryLocalAnswer(query, lessonId, curr);
  }
  if (isSocial) {
    return generateSocialLocalAnswer(query, lessonId, curr);
  }
  if (isMath) {
    return generateMathLocalAnswer(query, lessonId, curr);
  }
  if (isPhysics) {
    return generatePhysicsLocalAnswer(query, lessonId, curr);
  }
  if (isIslamic) {
    return generateIslamicLocalAnswer(query, lessonId, curr);
  }
  if (isArabic) {
    return generateArabicLocalAnswer(query, lessonId, curr);
  }

  // فيما يلي: المحرك الخاص بمنهج اللغة الإنجليزية حصراً

  // فحص أسئلة s التملك
  if (q.includes('تملك') || q.includes('possessive') || q.includes('boy\'s') || q.includes('boys\'')) {
    return {
      content: `📌 **قاعدة s التملك (Possessive 's'):**\n` +
               `1. **مع المفرد:** نضيف فاصلة عليا ثم s مثل:\n` +
               `• The boy's bag = حقيبة الولد (ولد واحد).\n` +
               `• The school's magazine = مجلة المدرسة (مدرسة واحدة).\n\n` +
               `2. **مع الجمع العادي (المنتهي بـ s):** نضع الفاصلة العليا بعد حرف الـ s فقط:\n` +
               `• The boys' bags = حقائب الأولاد (أكثر من ولد).\n` +
               `• The schools' magazines = مجلات المدارس.\n\n` +
               `3. **مع الجمع الشاذ (غير المنتهي بـ s):** نضيف 's طبيعياً:\n` +
               `• The children's room = غرفة الأطفال.`,
      sources: [{ page: 4, heading: 'Possessive s' }, { page: 110, heading: 'Grammar Reference' }],
      speakText: "Possessive apostrophe s: The boy's bag is for one boy. The boys' bags with apostrophe after s is for more than one boy. The children's room."
    };
  }

  // فحص أسئلة for و since
  if (q.includes('since') || q.includes('for') || q.includes('مضارع تام') || q.includes('منذ')) {
    return {
      content: `📌 **الفرق بين For و Since في المضارع التام (صفحة 7 و 110):**\n` +
               `1. **Since (منذ):** تُستخدم لتحديد **نقطة بداية الحدث** في الماضي:\n` +
               `• I have lived in Ashby since I was born (منذ أن ولدت).\n` +
               `• since 2018 / since yesterday / since 8 o'clock.\n\n` +
               `2. **For (لمدة):** تُستخدم لتحديد **طول الفترة الزمنية الإجمالية**:\n` +
               `• I have been in this school for three years (لمدة 3 سنوات).\n` +
               `• for 2 hours / for a long time.`,
      sources: [{ page: 7, heading: 'Talking about time' }, { page: 110, heading: 'Grammar Reference' }],
      speakText: "We use since with a point in the past, like since I was born. We use for with a period of time, like for three years."
    };
  }

  // فحص أسئلة أقسام المجلة
  if (q.includes('اقسام') || q.includes('مجلة') || q.includes('sections') || q.includes('magazine')) {
    return {
      content: `📌 **أقسام مجلة المدرسة (School Magazine Sections - صفحة 4):**\n` +
               `تتكون المجلة من 11 قسماً معتمداً:\n` +
               `1. **Puzzles:** ألغاز وأحاجي.\n` +
               `2. **Town events:** أحداث وفعاليات المدينة.\n` +
               `3. **Cartoons:** رسوم وقصص فكاهية مصورة.\n` +
               `4. **Problem page:** صفحة المشاكل والحلول (Aunt Sally).\n` +
               `5. **Stories:** القصص الواقعية والخيالية.\n` +
               `6. **School news:** أخبار وفعاليات المدرسة.\n` +
               `7. **Sports reports:** التقارير الرياضية والمباريات.\n` +
               `8. **Poetry:** القصائد والأشعار.\n` +
               `9. **Jokes:** النكات والمواقف الطريفة.\n` +
               `10. **Letters:** رسائل القراء والطلاب.\n` +
               `11. **Interviews:** مقابلات مع شخصيات مشهورة محلياً.`,
      sources: [{ page: 4, heading: 'A school magazine' }],
      speakText: "The sections of the school magazine are: Puzzles, Town events, Cartoons, Problem page, Stories, School news, Sports reports, Poetry, Jokes, Letters, and Interviews."
    };
  }

  // فحص معاني الكلمات article, editor, etc.
  if (q.includes('article') || q.includes('editor') || q.includes('printer') || q.includes('report') || q.includes('معنى')) {
    return {
      content: `📌 **قاموس مفردات النشر والصحافة (صفحة 5):**\n` +
               `• **article (n.):** مقال - a piece of writing in a newspaper or magazine.\n` +
               `• **cover (n.):** غلاف - the outside of a book or magazine.\n` +
               `• **edit (v.):** يحرر / يدقق - to check and correct a piece of writing.\n` +
               `• **editor (n.):** المحرر - somebody who edits.\n` +
               `• **print (v.):** يطبع - to put words or pictures on paper with a machine.\n` +
               `• **printer (n.):** 1. المطبعي (شخص) 2. آلة الطباعة (طابعة).\n` +
               `• **reporter (n.):** مراسل صحفي - somebody who describes events.`,
      sources: [{ page: 5, heading: 'Lesson 2: A new project' }],
      speakText: "Article: a piece of writing in a newspaper or magazine. Editor: somebody who edits. Printer: somebody who prints, or a machine that prints."
    };
  }

  // فحص نصائح Aunt Sally
  if (q.includes('sally') || q.includes('سالي') || q.includes('خجل') || q.includes('نصائح')) {
    return {
      content: `📌 **نصائح Aunt Sally للطالبة الخجولة Jill (صفحة 8):**\n` +
               `قدمت Aunt Sally أربع نصائح ذهبية للتغلب على الخجل وبناء الثقة:\n` +
               `1. قبل الذهاب للمدرسة، قولي لنفسك: (سأتحدث إلى شخص ما اليوم).\n` +
               `2. كوني ودودة: ألقي التحية 'Hello' على زميلاتك وابتسمي.\n` +
               `3. للتغلب على التلعثم: عدي حتى الرقم 5 وفكري بما تريدين قوله قبل الكلام.\n` +
               `4. تحدثي مع المعلمة واطلبي منها منحك مهلة قصيرة للإجابة بهدوء.`,
      sources: [{ page: 8, heading: 'Ask Aunt Sally' }],
      speakText: "Aunt Sally gave four tips: say to yourself I will speak to somebody today, be friendly and smile, count to five before speaking, and talk to your teacher."
    };
  }

  // فحص أفعال الرياضة
  if (q.includes('رياضة') || q.includes('play') || q.includes('go') || q.includes('do')) {
    return {
      content: `📌 **قواعد أفعال الرياضات: Play, Go, Do (صفحة 32 و 114):**\n` +
               `• **Play:** مع رياضات الكرة والتنافس الجماعي (play football, play tennis, play basketball).\n` +
               `• **Go:** مع الرياضات المنتهية بـ -ing (go swimming, go cycling, go running).\n` +
               `• **Do:** مع الرياضات الفردية والفنون القتالية (do karate, do judo, do yoga).`,
      sources: [{ page: 32, heading: 'Sports verbs' }, { page: 114, heading: 'Grammar Reference' }],
      speakText: "We use play for ball games like tennis and football. We use go for sports ending in i n g like swimming. We use do for martial arts like karate."
    };
  }


  // --- أسئلة الوحدة الثانية: نمط الحياة الصحي ---

  // فحص أسئلة should و shouldn't والنصائح
  if (q.includes('should') || q.includes("shouldn't") || q.includes('نصيحة') || q.includes('نصائح') || q.includes('advice') || q.includes('keep fit') || q.includes('لياقة')) {
    return {
      content: `📌 **قاعدة إعطاء النصيحة (Giving Advice: Should & Shouldn't - صفحة 17 و 111):**\n` +
               `1. **Should (ينبغي):** لتقديم نصيحة بفعل شيء مفيد:\n` +
               `• You should take exercise regularly = ينبغي عليك ممارسة الرياضة بانتظام.\n` +
               `• You should walk quickly for 20 minutes every day = ينبغي المشي السريع 20 دقيقة يومياً.\n\n` +
               `2. **Shouldn't (لا ينبغي):** للتحذير من عادة ضارة:\n` +
               `• You shouldn't watch TV all the time = لا ينبغي مشاهدة التلفاز طوال الوقت.\n` +
               `• You shouldn't go to bed late = لا ينبغي النوم متأخراً.\n\n` +
               `⚠️ **القاعدة الذهبية:** يأتي بعد should و shouldn't فعل في المصدر المجرد دائماً (Infinitive without to).`,
      sources: [{ page: 17, heading: 'Lesson 1: Keep fit!' }, { page: 111, heading: 'Grammar Reference' }],
      speakText: "We use should and shouldn't to give advice. Always use the infinitive verb without to: You should take exercise regularly, you shouldn't go to bed late."
    };
  }

  // فحص أسئلة محددات الكمية too much, too many, a few, a little
  if (q.includes('too much') || q.includes('too many') || q.includes('a few') || q.includes('a little') || q.includes('محددات') || q.includes('كميات') || q.includes('quantifier') || q.includes('معدود')) {
    return {
      content: `📌 **محددات الكمية مع المعدود وغير المعدود (Quantifiers - صفحة 18 و 111):**\n` +
               `1. **مع الأسماء غير المعدودة (Uncountable: sugar, salt, fat, water):**\n` +
               `• **Too much:** كمية زائدة عن الحد وضارة (Too much sugar is bad for your teeth).\n` +
               `• **A little:** كمية قليلة مقبولة (A little salt on your soup is all right).\n\n` +
               `2. **مع الأسماء المعدودة الجمع (Countable Plural: crisps, sweets, biscuits, apples):**\n` +
               `• **Too many:** عدد مفرط وضار (Too many crisps will make you unhealthy).\n` +
               `• **A few:** بضعة / عدد قليل مقبول (It is all right to eat a few biscuits).\n\n` +
               `3. **مع النوعين:**\n` +
               `• **A lot of / plenty of:** للكثير الوافر (Drink a lot of water every day).`,
      sources: [{ page: 18, heading: 'Lesson 2: Eat the right food' }, { page: 111, heading: 'Grammar Reference' }],
      speakText: "Too much and a little are used for uncountable nouns like sugar and salt. Too many and a few are used for countable nouns like crisps and biscuits."
    };
  }

  // فحص نصائح الممرضة جانيت والغذاء الصحي
  if (q.includes('janette') || q.includes('جانيت') || q.includes('ممرضة') || q.includes('طعام صحي') || q.includes('غذاء') || q.includes('خضار') || q.includes('فواكه') || q.includes('diet')) {
    return {
      content: `📌 **توصيات الممرضة جانيت للغذاء الصحي المتوازن (صفحة 18):**\n` +
               `قدمت Nurse Janette تقريراً طبياً مهماً للطلاب:\n` +
               `1. **الخضار والفواكه:** يجب تناول 5 حصص على الأقل يومياً لأنها تحافظ على صحة الجسم ومناعته.\n` +
               `2. **الماء:** شرب كميات وافرة من الماء يومياً للترطيب وطرد السموم.\n` +
               `3. **اللحوم والأجبان:** مفيدة للبروتين ولكن باعتدال لاحتوائها على الدهون (fat).\n` +
               `4. **الحذر الشديد:** من الأغذية الغنية بالدهون والسكريات والأملاح.\n` +
               `5. **الحلويات والمقرمشات:** القليل منها مسموح، لكن الإفراط فيها يسبب السمنة والأمراض.\n` +
               `🌟 **شعار الدرس:** You are what you eat (أنت نتاج ما تأكله).`,
      sources: [{ page: 18, heading: 'Nurse Janette\'s talk' }],
      speakText: "Nurse Janette advised eating at least five pieces of fruit and vegetables every day, drinking plenty of water, and avoiding too much fat, salt, and sugar."
    };
  }

  // فحص قائمة المطعم وطرق الطهي
  if (q.includes('مطعم') || q.includes('restaurant') || q.includes('menu') || q.includes('قائمة') || q.includes('grilled') || q.includes('fried') || q.includes('baked') || q.includes('طهي') || q.includes('curry')) {
    return {
      content: `📌 **قائمة المطعم وأساليب الطهي (In a Restaurant - صفحة 19):**\n` +
               `1. **طرق الطهي الأساسية:**\n` +
               `• **fried (adj.):** مقلي في الزيت الساخن (cooked in hot fat or oil).\n` +
               `• **grilled (adj.):** مشوي على الفحم أو النار المباشرة (cooked under strong heat).\n` +
               `• **baked (adj.):** مخبوز في الفرن (cooked in an oven).\n` +
               `• **boiled (adj.):** مسلوق في الماء المغلي.\n\n` +
               `2. **أقسام القائمة (Menu Sections):**\n` +
               `• **Starters:** المقبلات والشوربات.\n` +
               `• **Main Courses:** الأطباق الرئيسية (Lamb curry, Beef curry, Fried chicken, Pizza).\n` +
               `• **Desserts:** أطباق التحلية (Chocolate cake, Fruit salad, Ice cream).\n` +
               `• **Drinks:** المشروبات والعصائر والمياه المعدنية (Mineral water).\n\n` +
               `3. **أسلوب الطلب المهذب:**\n` +
               `• Could I have the grilled fish, please? / I would like a fruit salad.`,
      sources: [{ page: 19, heading: 'Lesson 3: In a restaurant' }],
      speakText: "Fried means cooked in hot fat. Grilled means cooked under strong heat. Baked means cooked in an oven. Starters come first, followed by main courses, desserts, and drinks."
    };
  }

  // فحص الأوجاع والأعراض الطبية
  if (q.includes('صداع') || q.includes('headache') || q.includes('toothache') || q.includes('earache') || q.includes('stomach ache') || q.includes('ألم') || q.includes('وجع') || q.includes('painkiller') || q.includes('طبيب اسنان') || q.includes('dentist')) {
    return {
      content: `📌 **التعبير عن الأوجاع والأعراض الطبية (Aches and Pains - صفحة 20 و 112):**\n` +
               `1. **المصطلحات الشائعة:**\n` +
               `• **Headache:** صداع الرأس ➔ العلاج: حبتي مسكن (take two painkillers with water).\n` +
               `• **Toothache:** ألم الأسنان ➔ العلاج: مراجعة طبيب الأسنان (see a dentist).\n` +
               `• **Earache:** ألم والتهاب الأذن ➔ العلاج: قطرات أذن مرتين يومياً (ear drops twice a day).\n` +
               `• **Stomach ache:** مغص المعدة ➔ النصيحة: تجنب الإكثار من المقرمشات الحارة.\n\n` +
               `2. **الصيغتان المتطابقتان:**\n` +
               `• I've got a headache = My head aches (لهما نفس المعنى تماماً).\n` +
               `• My right ear hurts = أذني تؤلمني.`,
      sources: [{ page: 20, heading: 'Lesson 4: Aches and pains' }, { page: 112, heading: 'Grammar Reference' }],
      speakText: "Common aches: headache, stomach ache, toothache, and earache. You can say I have got a headache, or my head aches. Both mean the same thing."
    };
  }

  // فحص قصة جلال وعبرتها
  if (q.includes('جلال') || q.includes('jalal') || q.includes('ابراهيم') || q.includes('ibrahim') || q.includes('appendicitis') || q.includes('زائدة')) {
    return {
      content: `📌 **قصة جلال وعبرتها الأخلاقية (Jalal's Story - صفحة 21):**\n` +
               `1. **أحداث القصة:** طلب الوالدان من جلال رعاية أخيه الصغير إبراهيم (8 سنوات) أثناء خروجهما. انشغل جلال بلعب ألعاب الكمبيوتر وتجاهل شكوى إبراهيم المتكررة من ألم بطنه ظناً منه أنه يتدلل ويدعي المرض.\n` +
               `2. **التدهور الإسعافي:** بدأ إبراهيم بالبكاء الشديد وشحب لونه وتقيأ، وعند عودة الوالدين تم استدعاء الإسعاف (ambulance) فوراً.\n` +
               `3. **التشخيص الجراحي:** تبين إصابته بالتهاب حاد في الزائدة الدودية (severe appendicitis) وأجرى الجراحون عملية طارئة لاستئصالها وإنقاذ حياته.\n` +
               `4. **الدرس المستفاد:** عدم الاستهانة بألم الآخرين وتحمل المسؤولية والاهتمام الفوري عند الشكوى من المرض.`,
      sources: [{ page: 21, heading: 'Lesson 5: Jalal\'s story' }],
      speakText: "Jalal ignored his brother Ibrahim's stomach ache thinking he was pretending, but Ibrahim had severe appendicitis and needed an emergency operation. The lesson is: never ignore someone in pain."
    };
  }

  // فحص بطاقات الشفاء والرسائل
  if (q.includes('get well') || q.includes('شفاء') || q.includes('بطاقات') || q.includes('recovery') || q.includes('رسالة غير رسمية') || q.includes('marwa') || q.includes('مروة') || q.includes('سارة')) {
    return {
      content: `📌 **بطاقات الشفاء والرسالة غير الرسمية (صفحة 22 و 23):**\n` +
               `1. **بطاقات الشفاء (Get Well Cards):**\n` +
               `• تُرسل للأصدقاء والأقارب المرضى لإدخال البهجة وتسريع الشفاء.\n` +
               `• العبارة الأساسية المشتركة: **Get well soon** (أتمنى لك الشفاء العاجل).\n` +
               `• قد تحتوي على رسوم ونكات فكاهية للتخفيف من وحشة المرض.\n\n` +
               `2. **هيكل الرسالة غير الرسمية (Informal Letter):**\n` +
               `• **أعلى اليمين:** العنوان والتاريخ (Flat 411, Street 36, Baghdad - March 2021).\n` +
               `• **التحية الودية:** Dear Marwa,\n` +
               `• **مقدمة التعاطف:** I was very sorry to hear about your accident...\n` +
               `• **أخبار الصف:** إرسال المجلة المدرسية وكتب الألغاز وتحيات الزميلات.\n` +
               `• **الخاتمة والتوقيع:** Best wishes, Sara.`,
      sources: [{ page: 22, heading: 'Get well cards' }, { page: 23, heading: 'An informal letter' }],
      speakText: "Get well cards cheer up sick friends. An informal letter includes the address and date on the top right, greeting like Dear Marwa, sympathy words, school news, and warm sign-off."
    };
  }

  // فحص قصائد الليمريك
  if (q.includes('ليمريك') || q.includes('limerick') || q.includes('قافية') || q.includes('aabba') || q.includes('بيرو') || q.includes('peru') || q.includes('كويت') || q.includes('kuwait') || q.includes('شعر فكاهي')) {
    return {
      content: `📌 **قصائد الليمريك الإنجليزية الفكاهية (Limericks - صفحة 24):**\n` +
               `الليمريك هي قصيدة فكاهية كلاسيكية ذات قواعد وزن وقافية محددة بدقة:\n` +
               `1. **عدد الأسطر:** تتكون دائماً من **5 أسطر** فقط.\n` +
               `2. **نمط القافية:** **A A B B A**:\n` +
               `• الأسطر (1 و 2 و 5) تتطابق في القافية (Rhyme A) وتكون أطول (3 نبضات إيقاعية).\n` +
               `• السطران (3 و 4) يتطابقان في القافية (Rhyme B) ويكونا أقصر (نبضتان).\n\n` +
               `3. **أمثلة الكتاب المقررة:**\n` +
               `• **فتاة بيرو (Peru):** حاولت صبغ سقفها بالأزرق فسكبت الدهان وباتت بحاجة للشامبو!\n` +
               `• **فتى الكويت (Kuwait):** يتأخر عن المدرسة دوماً لأن ساعته توقظه عند الثامنة!`,
      sources: [{ page: 24, heading: 'Lesson 8: Limericks' }],
      speakText: "A limerick is a five-line funny poem. The rhyme scheme is A A B B A. Lines 1, 2, and 5 have three beats, while lines 3 and 4 have two beats."
    };
  }

  // فحص قصة ستونهنج والتخييم
  if (q.includes('ستونهنج') || q.includes('stonehenge') || q.includes('تخييم') || q.includes('camping') || q.includes('خروف') || q.includes('sheep') || q.includes('مارشميلو') || q.includes('marshmallow') || q.includes('شروق')) {
    return {
      content: `📌 **قصة جاد وجوني: التخييم في ستونهنج (Camping at Stonehenge - صفحة 26 و 27):**\n` +
               `1. **الموقع التاريخي:** ستونهنج صرح حجري أثري عريق في إنجلترا يعود لأكثر من 4000 عام، كان يُستخدم لدراسة السماء وحركة النجوم والشمس (علم الفلك Astronomy).\n` +
               `2. **سهرة التخييم:** اجتمع الفائزون بالمسابقة حول النار لشواء قطع المارشميلو وشرب الكاكاو الساخن وتبادل القصص المرعبة.\n` +
               `3. **رعب الليل الكوميدي:** سُمع صوت غريب خارج الخيمة فظن جاد أنه كائن فضائي أو عملاق، لكن تبين أنه خروف أليف يأكل المارشميلو!\n` +
               `4. **شروق الشمس 5:00 فجراً:** شروق خلاب بهر الجميع، بينما نام جاد مسنداً ظهره لحجر ضخم، فالتقط له جوني صورة تذكارية مضحكة للانتقام!`,
      sources: [{ page: 26, heading: 'Story time Part 1' }, { page: 27, heading: 'Story time Part 2' }],
      speakText: "At Stonehenge, the boys camped overnight. A strange noise turned out to be a fluffy sheep eating marshmallows. At sunrise, Jad fell asleep against a stone and Johnny took a funny picture."
    };
  }

  // فحص قاعدة want + pronoun + to
  if (q.includes('want') || q.includes('يريد') || q.includes('رغبة')) {
    return {
      content: `📌 **صيغة الرغبة والتوجيه (Want Pattern - صفحة 25 و 112):**\n` +
               `التركيب: **Subject + want/wants + (me / you / him / her / us / them) + to + base verb**\n` +
               `• My mother wants me to eat more vegetables = تريدني والدتي أن آكل المزيد من الخضار.\n` +
               `• Your father wants you to help him in his shop = يريدك والدك أن تساعده في دكانه.\n` +
               `• The doctor wants him to rest in bed = يريده الطبيب أن يستريح في السرير.`,
      sources: [{ page: 25, heading: 'Unit 2 Round up' }, { page: 112, heading: 'Grammar Reference' }],
      speakText: "We use want plus pronoun plus to plus infinitive: My mother wants me to eat more vegetables. Your father wants you to help him."
    };
  }

  // فحص ظروف وتعبيرات التكرار How often
  if (q.includes('how often') || q.includes('تكرار') || q.includes('كم مرة') || q.includes('regularly') || q.includes('twice')) {
    return {
      content: `📌 **تعبيرات وظروف التكرار (Frequency Expressions - صفحة 17 و 25):**\n` +
               `تُستخدم للسؤال والإجابة عن معدل تكرار ممارسة النشاط:\n` +
               `• **How often do you take exercise?**\n` +
               `➔ I walk **every day** (كل يوم).\n` +
               `➔ I play basketball **once a week** (مرة في الأسبوع).\n` +
               `➔ I play chess **twice a week** (مرتين في الأسبوع).\n` +
               `➔ I take exercise **three times a week** (ثلاث مرات أسبوعياً).\n` +
               `➔ I take exercise **regularly** (بانتظام).`,
      sources: [{ page: 17, heading: 'Keep fit' }, { page: 25, heading: 'Round up' }],
      speakText: "How often asks about frequency. Answers include: every day, once a week, twice a week, three times a week, and regularly."
    };
  }

  // فحص أفعال الرياضات play, go, do
  if (q.includes('play') || q.includes('go') || q.includes('do') || q.includes('رياضة') || q.includes('رياضات') || q.includes('sports')) {
    return {
      content: `📌 **قاعدة أفعال الرياضات (Verbs and Sports - صفحة 28 و 112):**\n` +
               `1. **Play:** مع ألعاب الكرة والألعاب التنافسية والفرق:\n` +
               `• play football / play basketball / play tennis / play volleyball / play table tennis / play netball.\n\n` +
               `2. **Go:** مع الرياضات والأنشطة الفردية المنتهية بـ -ing:\n` +
               `• go swimming / go horse riding / go sailing / go running / go skateboarding / go surfing.\n\n` +
               `3. **Do:** مع الفنون القتالية والجمباز والأنشطة الفردية غير المنتهية بـ -ing:\n` +
               `• do judo / do karate / do gymnastics / do athletics.\n\n` +
               `🎯 **السؤال عن التفضيل:** What sports would you like to do? ➔ I'd like to play tennis / I'd like to do judo.`,
      sources: [{ page: 28, heading: 'Lesson 1: The sports centre' }, { page: 112, heading: 'Grammar Reference Unit 3' }],
      speakText: "We use play with ball games like football and tennis. We use go with sports ending in ing like swimming and horse riding. We use do with judo, karate and gymnastics."
    };
  }

  // فحص قاعدة الاعتياد في الماضي Used to
  if (q.includes('used to') || q.includes('اعتاد') || q.includes('تغير') || q.includes('تغيرات') || q.includes('changes')) {
    return {
      content: `📌 **قاعدة الاعتياد في الماضي (Used to - صفحة 34 و 112):**\n` +
               `تُستخدم للتعبير عن عادات أو حالات كانت مستمرة في الماضي وتغيرت في الوقت الحاضر:\n` +
               `• **الصيغة:** Subject + used to + Base Verb (فعل مجرد) ... but now + Present Simple.\n\n` +
               `**أمثلة من مقال سعد صالح (Saad Salih):**\n` +
               `• I **used to be** very shy, but judo has given me confidence.\n` +
               `• I **used to have** no friends, but now I have lots.\n` +
               `• I **used to be** lazy, but now I train every day.\n` +
               `• I **used to be** bad at schoolwork, but now I get good marks.\n\n` +
               `💡 **في النفي:** didn't use to + فعل مجرد.\n` +
               `💡 **في السؤال:** Did you use to + فعل مجرد?`,
      sources: [{ page: 34, heading: 'Lesson 7: Changes' }, { page: 112, heading: 'Grammar Reference Unit 3' }],
      speakText: "Used to expresses past states or habits that have changed. For example: I used to be shy, but now I am confident. I used to have no friends, but now I have lots."
    };
  }

  // فحص مصطلحات نتائج المباريات win, lose, beat
  if (q.includes('beat') || q.includes('won') || q.includes('lost') || q.includes('فوز') || q.includes('هزيمة') || q.includes('خسارة') || q.includes('نتيجة')) {
    return {
      content: `📌 **مصطلحات نتائج المباريات والمنافسات (صفحة 31):**\n` +
               `عندما كانت نتيجة مباراة كرة السلة (Babil 60 - Kirkuk 54):\n` +
               `1. **Won (فاز بالمباراة):** Babil won the game (الفائز + won + اسم اللعبة).\n` +
               `2. **Lost (خسر المباراة):** Kirkuk lost the game (الخاسر + lost + اسم اللعبة).\n` +
               `3. **Beat (هزم المنافس):** Babil beat Kirkuk (الفائز + beat + الفريق المهزوم).\n` +
               `4. **Lost to (خسر أمام):** Kirkuk lost to Babil (الخاسر + lost to + الفريق الفائز).\n\n` +
               `⚡ **صفات المقارنة الرياضية:** fitter than (أكثر لياقة)، faster than (أسرع من)، higher than (أعلى من).`,
      sources: [{ page: 31, heading: 'Lesson 4: The basketball game' }],
      speakText: "Match results: Babil won the game. Kirkuk lost the game. Babil beat Kirkuk. Kirkuk lost to Babil."
    };
  }

  // فحص الألعاب الأولمبية Olympic Games
  if (q.includes('olympic') || q.includes('اولمبياد') || q.includes('ميداليات') || q.includes('coubertin') || q.includes('حلقات')) {
    return {
      content: `📌 **الألعاب الأولمبية (The Olympic Games - صفحة 32):**\n` +
               `• **البداية:** بدأت قديماً في اليونان قبل 2,000 عام.\n` +
               `• **الألعاب الحديثة:** أطلقها الفرنسي **Pierre de Coubertin** عام 1896 وتقام كل 4 سنوات في مدينة مختلفة.\n` +
               `• **الميثاق الأولمبي:** «The most important thing in the Olympic Games is not to win, but to take part» (أهم ما في الأولمبياد المشاركة وليس الفوز).\n` +
               `• **الميداليات:**\n` +
               `  🥇 المركز الأول: Gold medal (ميدالية ذهبية).\n` +
               `  🥈 المركز الثاني: Silver medal (ميدالية فضية).\n` +
               `  🥉 المركز الثالث: Bronze medal (ميدالية برونزية).\n` +
               `• **الحلقات الأولمبية (The rings):** ترمز لالتقاء رياضيي قارات العالم الخمس بروح رياضية.`,
      sources: [{ page: 32, heading: 'Lesson 5: The Olympic Games' }],
      speakText: "The modern Olympic Games started in 1896 by Pierre de Coubertin. The motto is: not to win, but to take part. Medals are gold, silver and bronze."
    };
  }

  // --- أسئلة الوحدة الخامسة: تلقي وإرسال المعلومات ---
  // فحص أسئلة المبني للمجهول Passive Voice
  if (q.includes('مبني للمجهول') || q.includes('passive') || q.includes('active') || q.includes('مجهول') || q.includes('is written') || q.includes('was invented')) {
    return {
      content: `📌 **قواعد المبني للمجهول الشاملة (Passive Voice - الوحدة الخامسة ص 51، 52، 53، 115-117):**\n` +
               `يُستخدم المبني للمجهول عندما يكون الحدث والنتيجة أهم من الفاعل، أو عندما يكون الفاعل غير معروف:\n\n` +
               `1. **المضارع البسيط (Present Simple Passive):**\n` +
               `• القاعدة: **المفعول به + am / is / are + التصريف الثالث (p.p.)**\n` +
               `• مثال: An article **is written** in Cairo. | The newspapers **are printed** at night.\n\n` +
               `2. **الماضي البسيط (Past Simple Passive):**\n` +
               `• القاعدة: **المفعول به + was / were + التصريف الثالث (p.p.) + (by + الفاعل)**\n` +
               `• مثال: The radio **was invented** by Marconi. | TV pictures **were shown** by Baird in 1926.\n\n` +
               `3. **مع الأفعال الناقصة (Passive with Can):**\n` +
               `• القاعدة: **المفعول به + can / cannot + be + التصريف الثالث (p.p.)**\n` +
               `• مثال: Mobile phones **can be used** almost anywhere. | Landlines **can only be used** in one place.`,
      sources: [{ page: 51, heading: 'Present Passive' }, { page: 52, heading: 'Past Passive' }, { page: 53, heading: 'Passive with Can' }, { page: 115, heading: 'Grammar Reference' }],
      speakText: "Passive voice has three forms: Present passive with is or are plus past participle; past passive with was or were plus past participle; and modal passive with can be plus past participle."
    };
  }

  // فحص وسائل الاتصال القديمة
  if (q.includes('الوسائل القديمة') || q.includes('old ways') || q.includes('البريد') || q.includes('barid') || q.includes('حمام') || q.includes('pigeon') || q.includes('منارة') || q.includes('lighthouse') || q.includes('دخان') || q.includes('smoke')) {
    return {
      content: `📌 **وسائل الاتصال القديمة (Old Ways of Sending Information - صفحة 47):**\n` +
               `1. **خدمة البريد (Al-Barid):** بدأت في العالم العربي عام 670م؛ كان الركاب يمتطون الخيول لساعات حاملين الرسائل، ويستبدلون الخيل المتعبة بأخرى طازجة.\n` +
               `2. **الحمام الزاجل (Pigeons):** استُخدم لنقل الرسائل بين مصر وسوريا؛ فكان الحمام القوي يطير من القاهرة إلى دمشق دون توقف.\n` +
               `3. **المنارات والفنارات (Lighthouses):** شُيدت قرب السواحل لتحذير السفن القادمة من أخطار الصخور والشعاب.\n` +
               `4. **إشارات الدخان (Smoke Signals):** إشعال النيران على قمم الجبال لإرسال إشارات بصرية مشفرة للمسافات البعيدة.\n` +
               `5. **الطبول والأعلام (Drums and Flags):** استخدمت الطبول في أجزاء من إفريقيا، والأعلام بين السفن لإرسال الإشارات.`,
      sources: [{ page: 47, heading: 'Lesson 1: Old ways of sending information' }],
      speakText: "Old ways of sending information included Al-Barid horse messengers started in 670, pigeons flying between Cairo and Damascus, smoke signals on mountains, and lighthouses warning ships."
    };
  }

  // فحص رحلة المقال من القاهرة إلى بغداد
  if (q.includes('cairo') || q.includes('baghdad') || q.includes('قاهرة') || q.includes('بغداد') || q.includes('مقال') || q.includes('article') || q.includes('مطبعة') || q.includes('printing press')) {
    return {
      content: `📌 **رحلة المقالة الصحفية من القاهرة إلى بغداد (صفحة 50 و 51):**\n` +
               `المسافة بين القاهرة وبغداد 1,300 كم، وتمر المقالة بـ 8 خطوات متسلسلة بالمبني للمجهول:\n` +
               `1. **الاثنين صباحاً:** An article **is written** in Cairo (تُكتب المقالة بواسطة مراسل).\n` +
               `2. **الإرسال السريع:** It **is sent** by email to Baghdad (تُرسل بالإيميل في أقل من دقيقة).\n` +
               `3. **القراءة والتقييم:** It **is read** by an editor (يقرؤها المحرر في بغداد).\n` +
               `4. **التدقيق والإدراج:** It **is edited and inserted** into the newspaper (تُدقق وتُدرج في صفحات الجريدة).\n` +
               `5. **المطبعة:** It **is sent** to the printing press (تُرسل المسودة إلى المطبعة).\n` +
               `6. **الطباعة ليلاً:** The newspapers **are printed** at night (تُطبع آلاف النسخ ليلاً).\n` +
               `7. **التوزيع فجراً:** Early Tuesday morning, they **are sent** to the shops (تُرسل فجر الثلاثاء للمحلات والأكشاك).\n` +
               `8. **البيع للقراء:** The newspapers **are sold** to readers (تُباع للقراء مع فتح المحلات كشارع المتنبي).`,
      sources: [{ page: 50, heading: 'From Cairo to Baghdad Part A' }, { page: 51, heading: 'From Cairo to Baghdad Part B' }],
      speakText: "The article journey: written in Cairo on Monday morning, emailed to Baghdad in under a minute, edited, printed at night, sent to shops Tuesday morning, and sold to readers."
    };
  }

  // فحص المخترعين (جون بيرد وماركوني وتلفزيون وراديو)
  if (q.includes('بيرد') || q.includes('baird') || q.includes('ماركوني') || q.includes('marconi') || q.includes('تلفزيون') || q.includes('television') || q.includes('راديو') || q.includes('radio') || q.includes('مخترع') || q.includes('inventions')) {
    return {
      content: `📌 **أعظم الاختراعات في الاتصالات (Great Inventions - صفحة 52):**\n` +
               `1. **جون لوجي بيرد (John Logie Baird 1888–1946):**\n` +
               `• مخترع اسكتلندي (Scottish inventor).\n` +
               `• عام **1926** في لندن: أول من عرض صوراً على شاشة التلفزيون (لم تكن متحركة).\n` +
               `• عام **1927**: أرسل صوراً متحركة من لندن إلى اسكتلندا بأسلاك الهاتف.\n` +
               `• عام **1928**: أرسل صوراً إلى أمريكا بالموجات اللاسلكية، وساهم في تطوير التلفزيون الملون.\n\n` +
               `2. **غولييلمو ماركوني (Guglielmo Marconi 1874–1937):**\n` +
               `• مبتكر إيطالي (Italian).\n` +
               `• عام **1896**: أرسل رسالة راديوية لمسافة 1.5 كم بالموجات اللاسلكية.\n` +
               `• عام **1897**: أرسل رسالة من اليابسة إلى سفينة في البحر (29 كم).\n` +
               `• عام **1902**: أرسل رسالة راديو لاسلكية تاريخية عبر المحيط الأطلسي من أمريكا إلى إنجلترا.`,
      sources: [{ page: 52, heading: 'Lesson 6: Great inventions' }],
      speakText: "John Baird, a Scottish inventor, showed the first television pictures in London in 1926. Guglielmo Marconi, an Italian inventor, sent radio messages across the Atlantic Ocean in 1902."
    };
  }

  // فحص الهواتف الأرضية والمحمولة
  if (q.includes('هاتف') || q.includes('phone') || q.includes('landline') || q.includes('mobile') || q.includes('أرضي') || q.includes('محمول') || q.includes('mast') || q.includes('برج')) {
    return {
      content: `📌 **مقارنة الهواتف: الأرضية والمحمولة والذكية (Telephones - صفحة 53):**\n` +
               `1. **الهاتف الأرضي (Landline Phone):**\n` +
               `• يرسل ويستقبل الإشارات عبر أسلاك أرضية متصلة حول العالم.\n` +
               `• **العيب:** يُستخدم في مكان واحد فقط (less useful).\n` +
               `• **الميزة:** أكثر موثوقية وثباتاً في الاتصال (more reliable).\n\n` +
               `2. **الهاتف المحمول (Mobile Phone):**\n` +
               `• يرسل إشارات عبر موجات الراديو إلى أبراج التقوية (masts).\n` +
               `• يُستخدم في أي مكان تقريباً، لكنه يحتاج لبطارية مشحونة (battery).\n\n` +
               `3. **الهواتف الذكية (Smartphones):**\n` +
               `• هواتف متطورة تتصل بالإنترنت وتلتقط صوراً عالية الجودة وتشغل المقاطع والتطبيقات.`,
      sources: [{ page: 53, heading: 'Lesson 7: Telephones' }],
      speakText: "Landline phones use wires and work in one place but are very reliable. Mobile phones use radio waves to masts and can be used almost anywhere."
    };
  }

  // فحص آداب المكالمات الهاتفية
  if (q.includes('مكالمة') || q.includes('اتصال') || q.includes('telephone call') || q.includes('etiquette') || q.includes('anas') || q.includes('أنس') || q.includes('موعد') || q.includes('appointment')) {
    return {
      content: `📌 **آداب المكالمات الهاتفية (Making Telephone Calls - صفحة 54):**\n` +
               `1. **التعريف بالنفس فوراً:** قل اسمك في بداية الاتصال (Layla Ahmed here / Anas speaking).\n` +
               `2. **توضيح الغرض:** اذكر سبب المكالمة مباشرة (I'm calling about tomorrow's appointment).\n` +
               `3. **التحضير المسبق:** فكّر بما ستقوله وجهز ورقة وقلماً قبل طلب الرقم.\n` +
               `4. **التحدث ببطء ووضوح:** تكلّم بتؤدة لأن المستمع لا يرى تعابير وجهك.\n` +
               `5. **عبارات مهذبة:**\n` +
               `• Could I speak to ... please? (هل يمكنني التحدث إلى... من فضلك؟)\n` +
               `• Hold on a moment, please (انتظر لحظة لو سمحت).\n` +
               `• Could you repeat that, please? (هل يمكنك إعادة ذلك؟)\n` +
               `• Can you spell that, please? (هل تتهجى ذلك لو سمحت؟)`,
      sources: [{ page: 54, heading: 'Lesson 8: Making telephone calls' }],
      speakText: "Telephone etiquette: Introduce yourself immediately, state why you are calling, think before calling, and speak slowly and clearly."
    };
  }

  // فحص قصة جاد وجوني في فينيسيا
  if (q.includes('فينيسيا') || q.includes('venice') || q.includes('جندول') || q.includes('gondola') || q.includes('قناة') || q.includes('بيتزا') || q.includes('pizza') || q.includes('marcus') || q.includes('ماركوس') || q.includes('هاتف ماركوس')) {
    return {
      content: `📌 **قصة جاد وجوني: رحلة الجندول في البندقية (The Gondola Trip in Venice - صفحة 56 و 57):**\n` +
               `1. **مدينة البندقية (Venice):** مدينة مائية في شمال إيطاليا مبنية على القنوات المائية، لا توجد فيها سيارات أو حافلات، والتنقل إما مشياً أو بقارب الجندول (gondola).\n` +
               `2. **حادث الهاتف:** صعد الأولاد في الجندول، فوقف ماركوس في القارب ليتصل بوالده بالفيديو ويريه معالم المدينة. اصطدم الجندول بقارب آخر، فسقط هاتف ماركوس وغرق في ماء القناة!\n` +
               `3. **رحلة البحث عن البيتزا:** كان جاد متلهفاً لأكل البيتزا الإيطالية، لكن جميع المطاعم كانت مزدحمة بالسياح ولا توجد طاولة لخمسة أشخاص.\n` +
               `4. **المفاجأة الطريفة:** اختفى جاد وماركوس بين الحشود، وبعد 20 دقيقة من البحث قلقاً وجدهم باولو وجوني وأزيز جالسين في مطعم يلتهمون البيتزا، وقد اشترى ماركوس هاتفاً جديداً! فأخذ جوني طبق جاد وقال له: الآن يمكنك طلب المزيد!`,
      sources: [{ page: 56, heading: 'Story time Part 1' }, { page: 57, heading: 'Story time Part 2' }],
      speakText: "In Venice, a water city with no cars, Marcus stood up in a gondola and his phone sank in the canal. Jad and Marcus disappeared and were found eating pizza in a crowded restaurant."
    };
  }

  // فحص منتدى المحادثة ومناظرة المال والسعادة
  if (q.includes('منتدى') || q.includes('forum') || q.includes('chat') || q.includes('سعادة') || q.includes('happiness') || q.includes('مال') || q.includes('money') || q.includes('essay') || q.includes('مقال جدلي')) {
    return {
      content: `📌 **منتدى المحادثة الإلكتروني ومناظرة المال والسعادة (A Chat Forum - صفحة 58 و 59):**\n` +
               `1. **موضوع المناظرة:** هل يستطيع المال شراء السعادة؟ (Can money buy happiness?):\n` +
               `• **ليلى (LaylaIraq123) وتوم (EnglishTom44):** لا يستطيع المال شراء السعادة، فالأصدقاء والعائلة والصحة هي سر السعادة الحقيقية، والمال لا يمنع الوحدة.\n` +
               `• **فرانسوا (FrancoisF56):** المال يجلب حياة أفضل وشراء منازل وسيارات والسفر حول العالم.\n` +
               `• **طيّب (Tayyeb101):** الصحة والمال مترابطان، فالمال يتيح الغذاء الصحي والرعاية الطبية الممتازة والأندية الرياضية.\n` +
               `• **بولي (PollyP):** من الصعب أن تكون سعيداً وأنت فقير، فنحن بحاجة لمال كافٍ للمعيشة، لكن الثراء الفاحش لا يعني سعادة أكبر.\n\n` +
               `2. **هيكل مقال الرأي (For-and-Against Essay):**\n` +
               `• **الفقرة 1:** طرح الموضوع ومقدمته.\n` +
               `• **الفقرة 2:** الحجج المؤيدة (Arguments For).\n` +
               `• **الفقرة 3:** الحجج المعارضة (Arguments Against).\n` +
               `• **الفقرة 4:** تلخيص الحجج وخاتمة الرأي الشخصي المتوازن.`,
      sources: [{ page: 58, heading: 'Project 3: Global Chat' }, { page: 59, heading: 'Project 3: For-and-Against Essay' }],
      speakText: "The chat forum discusses whether money can buy happiness. A for-and-against essay has 4 paragraphs: introduction, arguments for, arguments against, and summary conclusion."
    };
  }

  // فحص اختصارات القاموس والترتيب الأبجدي
  if (q.includes('قاموس') || q.includes('dictionary') || q.includes('أبجدي') || q.includes('alphabetical') || q.includes('اختصارات') || q.includes('abbreviations') || q.includes('prep') || q.includes('conj') || q.includes('pron')) {
    return {
      content: `📌 **دليل القواميس واختصارات أقسام الكلام (صفحة 49 و 55):**\n` +
               `1. **الترتيب الأبجدي:** ترتب الكلمات في القاموس هجائياً من A إلى Z لسرعة البحث.\n` +
               `2. **الرموز المعتمدة:**\n` +
               `• **n.** = noun (اسم) مثل book, river\n` +
               `• **v.** = verb (فعل) مثل run, invent\n` +
               `• **adj.** = adjective (صفة) مثل fast, clear\n` +
               `• **adv.** = adverb (ظرف/حال) مثل easily, slowly\n` +
               `• **prep.** = preposition (حرف جر) مثل in, on, at\n` +
               `• **conj.** = conjunction (أداة ربط) مثل and, but, so\n` +
               `• **pron.** = pronoun (ضمير) مثل he, she, it\n\n` +
               `3. **تعدد المعاني (كلمة Bank):**\n` +
               `• اسم: مصرف مالي، أو ضفة نهر.\n` +
               `• فعل: يودع مالاً، أو تميل الطائرة وتنعطف.`,
      sources: [{ page: 49, heading: 'Reading tip 6: Dictionaries' }, { page: 55, heading: 'Unit 5 Round up' }],
      speakText: "Dictionaries arrange words alphabetically. Key abbreviations are n for noun, v for verb, adj for adjective, adv for adverb, prep for preposition, and conj for conjunction."
    };
  }

  // إجابة عامة موثقة بالدرس الحالي
  return {
    content: `أهلاً بك! لقد تم فحص استفسارك في نصوص المنهج المعتمد. يمكنك الاستفسار عن أي قاعدة نحوية (مثل s التملك، for و since، أفعال الرياضة)، أو معاني الكلمات والمفردات، أو تفاصيل دروس مجلة المدرسة والقصص المقررة. تفضل بطرح سؤالك وسأجيبك بدقة مع رقم الصفحة.`,
    sources: [{ page: 4, heading: 'منهج اللغة الإنجليزية' }],
    speakText: "Welcome! Ask me any question about the curriculum, grammar rules, vocabulary, or lesson contents."
  };
}
