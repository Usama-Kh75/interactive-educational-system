// =========================================================================
// بنك نماذج الامتحانات الوزارية والشهرية السابقة ومركز الامتحانات
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

const PAST_EXAMS_DATABASE = {
  final: {
    id: 'final',
    title: 'الامتحان الوزاري النهائي الشامل للكورس الثاني ونهاية العام (Final Comprehensive Examination)',
    stage: 'الصف الثاني متوسط (Second Intermediate)',
    subject: 'اللغة الإنجليزية (English for Iraq - Units 5 to 8)',
    year: '2025 - 2026',
    time: 'ساعتان ونصف (2.5 Hours)',
    totalMarks: '100 درجة (100 Marks)',
    notes: 'ملاحظة: أجب عن جميع الأسئلة الآتية. Note: Answer all the following questions.',
    badge: '🏆 الامتحان النهائي الشامل',
    questions: [
      {
        id: 'fe_q1',
        number: 'Q1',
        title: 'Reading Comprehension (استيعاب المقروء - القطعة الخارجية)',
        marks: '15 Marks',
        instructions: 'Read the following passage carefully, then answer (5) of the questions below: (15 Marks / 3 marks each)',
        passage: 'Muhammad is a determined young student from Baghdad who has dreamed of becoming a pilot since early childhood. When he was young, he loved playing with toy aeroplanes and watching planes soar across the sky. At school, he worked exceptionally hard at all his subjects, especially Maths and English, because he knew that English is the universal "language of the air". After passing his final exams with top marks, Muhammad earned a place at an aviation college in Germany. He was nervous on his first solo flight, but he flew successfully and safely. Muhammad passed all difficult theoretical and practical exams and proudly received his commercial pilot certificate, calling it the best day of his life.',
        items: [
          '1. What has Muhammad always wanted to be since childhood?',
          '2. Why did Muhammad work especially hard at English?',
          '3. Where was the aviation college where Muhammad trained to be a pilot?',
          '4. How did Muhammad feel when he took off on his first solo flight?',
          '5. What was the best day of Muhammad\'s life?',
          '6. Give the passage a suitable title.'
        ],
        solution: `
          <strong>الحل النموذجي وتوزيع الدرجات (15 درجة - 3 درجات لكل نقطة):</strong><br>
          <strong>1.</strong> He has always wanted to be a pilot. (أراد دائماً أن يصبح طياراً).<br>
          <strong>2.</strong> Because he knew that English is the 'language of the air' needed by pilots. (لأن الإنجليزية هي لغة الطيران الدولية).<br>
          <strong>3.</strong> In Germany. (في ألمانيا).<br>
          <strong>4.</strong> He was a little nervous, but also excited to be flying a plane by himself. (كان متوتراً قليلاً ومتحمساً جداً للطيران بمفرده).<br>
          <strong>5.</strong> The day he got his pilot's certificate. (يوم حصوله على شهادة ورخصة الطيران).<br>
          <strong>6.</strong> "A High-Flying Job" / "Muhammad the Pilot" / "A Boy's Dream". (أي عنوان ملائم).
        `
      },
      {
        id: 'fe_q2',
        number: 'Q2',
        title: 'Textbook Passages & Stories (قطع ونصوص وقصص الكتاب المقررة)',
        marks: '15 Marks',
        instructions: 'Answer (5) of the following questions from your textbook units: (15 Marks / 3 marks each)',
        passage: null,
        items: [
          '1. Why are elephants in Kenya killed by poachers? (Unit 7)',
          '2. What causes the desert to move (desertification) in Iraq? (Unit 7)',
          '3. What can students make using two empty plastic bottles and a fastener? (Project 4 / Unit 7)',
          '4. In Unit 8, what information did Susan get wrong when phoning Liz? (Unit 8)',
          '5. Why was Jalal standing outside a dark house at 24 West Street in England? (Unit 8)',
          '6. Why did Jane Smith miss her interview for the secretary job? (Unit 8)'
        ],
        solution: `
          <strong>الحل النموذجي وتوزيع الدرجات (15 درجة - 3 درجات لكل نقطة):</strong><br>
          <strong>1.</strong> They are illegally killed for their ivory tusks. (يُقتلون لسرقة العاج).<br>
          <strong>2.</strong> Sandstorms, lack of rain, cutting down trees, and overgrazing. (العواصف الرملية وقلة الأمطار وقطع الأشجار والرعي الجائر).<br>
          <strong>3.</strong> A useful zip-up pencil case. (مقلمة مدرسية مفيدة بسحاب).<br>
          <strong>4.</strong> She wrote down the wrong telephone number (432147). (كتبت الرقم الخطأ).<br>
          <strong>5.</strong> He had the wrong address (street name or suffix) from his friend Dave. (كان العنوان غير دقيق).<br>
          <strong>6.</strong> She wrote down the interview on the wrong day in her diary (it was yesterday). (سجلت المقابلة في اليوم الخطأ).
        `
      },
      {
        id: 'fe_q3',
        number: 'Q3',
        title: 'Grammar and Functions (القواعد والوظائف اللغوية)',
        marks: '25 Marks',
        instructions: 'Answer both branches: (A) Choices (15 Marks) & (B) Do as required (10 Marks):',
        passage: null,
        branchA: {
          title: 'Branch (A) - Choose the correct word between brackets: (15 Marks / 3 marks each - Answer 5)',
          items: [
            '1. The articles (are written / wrote) in Cairo and printed in Baghdad.',
            '2. A house in Castle Street (was ruined / were ruined) by fire last night.',
            '3. Sami ran (yesterday fast in the race / fast in the race yesterday).',
            '4. This is the pilot (who / which) flew the aeroplane on his first solo flight.',
            '5. Look at those dark clouds! It (is going to rain / rained) soon.',
            '6. You (mustn\'t / may) throw rubbish into the river; it is against the law.'
          ]
        },
        branchB: {
          title: 'Branch (B) - Do as required between brackets: (10 Marks / 2 marks each - Answer 5)',
          items: [
            '1. Fire destroyed the house. (Change into Past Simple Passive)',
            '2. She (live) in Baghdad, but her family (move) to Erbil last year. (Correct the verbs)',
            '3. "When do you have flying lessons?" (Does this question have a rising or falling intonation?) (Answer)',
            '4. What are you going to do when you (finish) school? (Correct the verb)',
            '5. I\'ll help you clean the classroom. (What language function is this?) (Answer)',
            '6. Mazin sang (well / in the hall / beautifully). (Arrange: Manner + Place)'
          ]
        },
        solution: `
          <strong>الحل النموذجي للفرع (A) - الاختيارات (15 درجة):</strong><br>
          <strong>1. are written</strong> (مبني للمجهول في المضارع البسيط لأن articles جمع).<br>
          <strong>2. was ruined</strong> (مبني للمجهول في الماضي البسيط لأن house مفرد).<br>
          <strong>3. fast in the race yesterday</strong> (ترتيب الظروف: حال Manner ثم مكان Place ثم زمان Time: M-P-T).<br>
          <strong>4. who</strong> (ضمير وصل للعاقل pilot).<br>
          <strong>5. is going to rain</strong> (مستقبل مخطط/تنبؤ مبني على دليل حاضر).<br>
          <strong>6. mustn't</strong> (نهي وإلزام صارم لمنع تلوث النهر).<br><br>
          <strong>الحل النموذجي للفرع (B) - المطلوب (10 درجات):</strong><br>
          <strong>1.</strong> The house <strong>was destroyed</strong> by fire. (مبني للمجهول في الماضي).<br>
          <strong>2.</strong> <strong>lives / moved</strong> (مضارع بسيط للمعتاد، وماضٍ بسيط لوجود last year).<br>
          <strong>3.</strong> <strong>Falling intonation</strong> (نبرة هابطة ➘ لأن السؤال يبدأ بأداة استفهام Wh).<br>
          <strong>4.</strong> <strong>finish</strong> (مضارع بسيط بعد أداة الربط when).<br>
          <strong>5.</strong> <strong>Making an offer</strong> (تقديم عرض مساعدة تطوعي).<br>
          <strong>6.</strong> beautifully in the hall (حال ثم مكان).
        `
      },
      {
        id: 'fe_q4',
        number: 'Q4',
        title: 'Vocabulary, Spelling and Punctuation (المفردات، الإملاء وعلامات الترقيم)',
        marks: '25 Marks',
        instructions: 'Answer all branches: (A) Vocabulary (10 M), (B) Spelling (5 M), (C) Punctuation (10 M):',
        passage: null,
        branchA: {
          title: 'Branch (A) - Complete the sentences using words from the box below: (10 Marks / 2 marks each)',
          boxWords: ['language of the air', 'solo', 'aviation college', 'certificate', 'especially', 'poaching'],
          items: [
            '1. Muhammad went to Germany to train at an ______.',
            '2. He was nervous on his first ______ flight because he was alone in the plane.',
            '3. English is known globally as the ______ for pilots and flight towers.',
            '4. He worked hard at all school subjects, ______ Maths and English.',
            '5. Muhammad proudly received his official pilot\'s ______ after passing his exams.'
          ]
        },
        branchB: {
          title: 'Branch (B) - Spelling: Complete with the correct forms: (5 Marks / 1 mark each)',
          items: [
            '1. slow, slowly ; fast, ______',
            '2. good, well ; hard, ______',
            '3. fly, flying ; climb, ______',
            '4. write, written ; ruin, ______',
            '5. f _ _ _ n d (person you like and trust: spell the word)'
          ]
        },
        branchC: {
          title: 'Branch (C) - Punctuation: Punctuate the following sentence correctly: (10 Marks)',
          items: [
            'youve done well in maths english and arabic my mother said but what about history your mark is very bad'
          ]
        },
        solution: `
          <strong>الحل النموذجي للفرع (A) - المفردات (10 درجات):</strong><br>
          1. <strong>aviation college</strong> | 2. <strong>solo</strong> | 3. <strong>language of the air</strong> | 4. <strong>especially</strong> | 5. <strong>certificate</strong>.<br><br>
          <strong>الحل النموذجي للفرع (B) - الإملاء (5 درجات):</strong><br>
          1. <strong>fast</strong> (ظرف شاذ) | 2. <strong>hard</strong> (ظرف شاذ) | 3. <strong>climbing</strong> | 4. <strong>ruined</strong> | 5. <strong>friend</strong>.<br><br>
          <strong>الحل النموذجي للفرع (C) - التنقيط الكامل (10 درجات):</strong><br>
          <div style="direction: ltr; text-align: left; font-weight: 700; color: var(--primary);">
            "You've done well in Maths, English and Arabic," my mother said, "but what about History? Your mark is very bad."
          </div>
        `
      },
      {
        id: 'fe_q5',
        number: 'Q5',
        title: 'Written Composition (الإنشاء والتعبير الكتابي)',
        marks: '20 Marks',
        instructions: 'Choose either Topic (A) or Topic (B): (20 Marks)',
        passage: null,
        items: [
          'Topic A: Write a paragraph of about 60-80 words on "How to protect the environment and keep rivers clean in Iraq". Mention practical steps, recycling, and what students can do.',
          'Topic B: Write a paragraph of about 60-80 words on "My dream job and future career". Mention what job you want to do, why, which school subjects you need, and what you plan to do after high school.'
        ],
        solution: `
          <strong>نموذج موضوع الإنشاء المعتمد (20 درجة):</strong><br>
          <strong>Topic A: Keeping Our Environment and Rivers Clean:</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 0.5rem;">
            Protecting our environment is everyone's responsibility in Iraq. First, we must keep the Tigris and Euphrates rivers clean. Do not throw plastic bottles or rubbish into the water because pollution harms fish and human health. Second, we should plant green belts around towns to stop the moving desert. Finally, we can recycle materials at home, such as plastic bottles and paper. If we work together, our beloved country will stay green, healthy, and beautiful.
          </div>
          <strong>Topic B: My Dream Job (A Pilot):</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;">
            In the future, I am going to become an airline pilot because I have always loved aeroplanes and flying across different countries. At school, I work hard at Maths, Physics, and English because English is the international language of the air. After finishing school with top marks, I am going to enter an aviation academy to train on modern aircraft. Being a pilot is an exciting and responsible career that serves my nation.
          </div>
        `
      }
    ]
  },
  midyear: {
    id: 'midyear',
    title: 'نموذج امتحان نصف السنة الشامل (Mid-Year Comprehensive Exam)',
    stage: 'الصف الثاني متوسط (Second Intermediate)',
    subject: 'اللغة الإنجليزية (English for Iraq)',
    year: '2025 - 2026',
    time: 'ساعتان ونصف (2.5 Hours)',
    totalMarks: '100 درجة (100 Marks)',
    notes: 'ملاحظة: أجب عن جميع الأسئلة الآتية. Note: Answer all the following questions.',
    badge: '🌟 النموذج الوزاري الشامل',
    questions: [
      {
        id: 'my_q1',
        number: 'Q1',
        title: 'Reading Comprehension (استيعاب المقروء - القطعة الخارجية)',
        marks: '15 Marks',
        instructions: 'Read the following passage carefully, then answer (5) of the questions below: (15 Marks / 3 marks each)',
        passage: `Tariq is a second-intermediate student from Baghdad who loves writing and sports. Last year, he was often tired and got out of breath when walking up the stairs because he was unfit. His doctor and physical education teacher advised him to exercise regularly and eat healthy food. Tariq decided to change his lifestyle. He stopped eating too many crisps and sweets, and started eating fresh fruits, vegetables, and fish. Every afternoon, he plays basketball with his school team or goes swimming at the local sports centre. Now, Tariq feels full of energy and very fit. Moreover, he wrote an inspiring article titled "How to Keep Fit" for his school magazine, and his English teacher praised his excellent writing.`,
        items: [
          '1. Why was Tariq often tired last year?',
          '2. What kind of food did Tariq start eating to become healthy?',
          '3. Tariq plays basketball with his school team every afternoon. (True / False)',
          '4. What was the title of the article Tariq wrote for the school magazine?',
          '5. Tariq still eats lots of crisps and sweets every day. (True / False)',
          '6. Give the passage a suitable title.'
        ],
        solution: `
          <strong>الحل النموذجي وتوزيع الدرجات (15 درجة - 3 درجات لكل نقطة):</strong><br>
          <strong>1.</strong> Because he was unfit / he didn't exercise regularly. (لأنه كان غير لائق بدنياً).<br>
          <strong>2.</strong> Fresh fruits, vegetables, and fish. (الفواكه الطازجة، الخضروات، والسمك).<br>
          <strong>3.</strong> <strong>True</strong> (صح).<br>
          <strong>4.</strong> "How to Keep Fit" (عنوان المقالة: كيف تحافظ على رشاقتك وصحتك).<br>
          <strong>5.</strong> <strong>False</strong> (خطأ، لأنه توقف عن ذلك واستبدله بالطعام الصحي).<br>
          <strong>6.</strong> "A Healthy Student" / "Tariq's Healthy Lifestyle" / "Keeping Fit". (أي عنوان ملائم يُقبل).
        `
      },
      {
        id: 'my_q2',
        number: 'Q2',
        title: 'Textbook Passages & Stories (قطع ونصوص وقصص الكتاب المقررة)',
        marks: '10 Marks',
        instructions: 'Answer (5) of the following questions using information from your textbook: (10 Marks / 2 marks each)',
        passage: null,
        items: [
          '1. Why did the students in Unit 1 decide to create a school magazine? (Unit 1)',
          '2. What does an "editor" do in a magazine team? (Unit 1)',
          '3. In Unit 2, what does the word "unfit" mean? (Unit 2)',
          '4. Why did people laugh at Bob in the ice cream shop? (Bob and Basim Story)',
          '5. How many boys were selected for the World Youth Camp in the story? (Bob and Basim Story)',
          '6. Which sport uses a racket and a small yellow ball? (Unit 3)'
        ],
        solution: `
          <strong>الحل النموذجي وتوزيع الدرجات (10 درجات - درجتان لكل نقطة):</strong><br>
          <strong>1.</strong> To write interesting articles, reports, and tell school news. (لكتابة المقالات والتقارير ونقل أخبار المدرسة).<br>
          <strong>2.</strong> An editor decides what goes into the magazine and checks/edits the articles. (المحرر هو من يراجع المقالات ويقرر ما يُنشر).<br>
          <strong>3.</strong> It means someone who cannot run or walk easily and gets out of breath quickly. (الشخص غير اللائق الذي لا يستطيع المشي أو الجري بسهولة وينقطع نفسه).<br>
          <strong>4.</strong> Because his huge ice cream scoop fell off onto his shirt and shoes! (لأن كرة المثلجات الكبيرة سقطت على قميصه وحذائه).<br>
          <strong>5.</strong> Four boys: Bob, Basim, Aziz, and Gareth. (أربعة فتيان: بوب، باسم، عزيز، وغاريث).<br>
          <strong>6.</strong> Tennis. (كرة المضرب / التنس).
        `
      },
      {
        id: 'my_q3',
        number: 'Q3',
        title: 'Grammar and Functions (القواعد والوظائف اللغوية)',
        marks: '20 Marks',
        instructions: 'Answer both branches: (A) Choices (10 Marks) & (B) Do as required (10 Marks):',
        passage: null,
        branchA: {
          title: 'Branch (A) - Choose the correct word between brackets: (10 Marks / 2 marks each - Answer 5)',
          items: [
            '1. I have lived in Basra (since / for) 2018.',
            '2. You have a very bad toothache. You (should / shouldn\'t) see a dentist.',
            '3. While Noor (was cooking / cooked) dinner, the electricity went out.',
            '4. When I was young, I (used to / use to) play football in the street.',
            '5. You must not put (too much / too many) sugar in your tea.',
            '6. Mazin is interested in (read / reading) historical books.'
          ]
        },
        branchB: {
          title: 'Branch (B) - Do as required between brackets: (10 Marks / 2 marks each - Answer 5)',
          items: [
            '1. "Let\'s go to the sports club this evening." (Accept the suggestion)',
            '2. Zaid (play) computer games when his father arrived. (Correct the verb)',
            '3. My brother drinks lots of fizzy drinks. (Give advice using: shouldn\'t)',
            '4. This is the (teacher) room. (Add the possessive apostrophe for one teacher)',
            '5. Sami likes swimming. (Make the sentence negative)',
            '6. How often do you play football? (Answer using: twice a week)'
          ]
        },
        solution: `
          <strong>الحل النموذجي للفرع (A) - الاختيارات مع القاعدة (10 درجات):</strong><br>
          <strong>1. since</strong> (لأن 2018 نقطة بداية زمنية محددة في الماضي).<br>
          <strong>2. should</strong> (نصيحة إيجابية بضرورة مراجعة طبيب الأسنان).<br>
          <strong>3. was cooking</strong> (بعد While يأتي ماضٍ مستمر Past Continuous).<br>
          <strong>4. used to</strong> (للتعبير عن عادة أو حالة سابقة في الماضي وانتهت).<br>
          <strong>5. too much</strong> (لأن السكر sugar اسم غير معدود).<br>
          <strong>6. reading</strong> (حرف الجر in يتبعه فعل مضاف له ing).<br><br>
          <strong>الحل النموذجي للفرع (B) - التطبيق والمطلوب (10 درجات):</strong><br>
          <strong>1.</strong> That's a good idea! / Yes, let's. (قبول الاقتراح).<br>
          <strong>2.</strong> was playing. (الماضي المستمر لوجود when والماضي البسيط arrived).<br>
          <strong>3.</strong> You shouldn't drink too many fizzy drinks. (تقديم النصيحة بـ shouldn't).<br>
          <strong>4.</strong> This is the <strong>teacher's</strong> room. (فارزة التملك للمفرد قبل الـ s).<br>
          <strong>5.</strong> Sami <strong>does not like</strong> swimming. (النفي في المضارع البسيط بـ does not + المصدر المجرد).<br>
          <strong>6.</strong> I play football twice a week. (الإجابة بمعدل التكرار).
        `
      },
      {
        id: 'my_q4',
        number: 'Q4',
        title: 'Vocabulary, Spelling and Punctuation (المفردات والإملاء والتنقيط)',
        marks: '20 Marks',
        instructions: 'Answer all branches: (A) Vocabulary (10 M), (B) Spelling (5 M), (C) Punctuation (5 M):',
        passage: null,
        branchA: {
          title: 'Branch (A) - Complete the sentences using words from the box below: (10 Marks / 2 marks each)',
          boxWords: ['embarrassing', 'fit', 'headache', 'team', 'puzzles', 'article'],
          items: [
            '1. You need to exercise at least three times a week to keep ______.',
            '2. I wrote an interesting ______ about our town museum for the school magazine.',
            '3. Mona took some medicine because she had a severe ______.',
            '4. It was very ______ when I slipped and fell in front of all my classmates.',
            '5. Basim scored the winning goal for his school football ______.'
          ]
        },
        branchB: {
          title: 'Branch (B) - Spelling: Complete the following with the correct forms: (5 Marks / 1 mark each)',
          items: [
            '1. play, played ; see, ______',
            '2. fit, unfit ; happy, ______',
            '3. good, better ; bad, ______',
            '4. tooth, teeth ; foot, ______',
            '5. write, writing ; lie, ______'
          ]
        },
        branchC: {
          title: 'Branch (C) - Punctuation: Re-write the sentence using capital letters and correct punctuation marks: (5 Marks)',
          items: [
            'ali and ahmed didn t travel to erbil last friday'
          ]
        },
        solution: `
          <strong>الحل النموذجي للفرع (A) - المفردات (10 درجات):</strong><br>
          1. <strong>fit</strong> (لائق بدنياً).<br>
          2. <strong>article</strong> (مقالة).<br>
          3. <strong>headache</strong> (صداع).<br>
          4. <strong>embarrassing</strong> (مُحرج).<br>
          5. <strong>team</strong> (فريق).<br><br>
          <strong>الحل النموذجي للفرع (B) - الإملاء والتحويلات (5 درجات):</strong><br>
          1. <strong>saw</strong> (ماضي شاذ للفعل see).<br>
          2. <strong>unhappy</strong> (المعاكس بإضافة البادئة un).<br>
          3. <strong>worse</strong> (مقارنة شاذة للصفة bad).<br>
          4. <strong>feet</strong> (جمع شاذ لكلمة foot).<br>
          5. <strong>lying</strong> (تحويل ie إلى y عند إضافة ing).<br><br>
          <strong>الحل النموذجي للفرع (C) - التنقيط (5 درجات):</strong><br>
          <strong>Ali and Ahmed didn't travel to Erbil last Friday.</strong><br>
          (توزيع الدرجات: حرف A كبير في Ali، وحرف A كبير في Ahmed، والفارزة العليا في didn't، وحرف E كبير في Erbil، وحرف F كبير في Friday، ونقطة النهاية .).
        `
      },
      {
        id: 'my_q5',
        number: 'Q5',
        title: 'Written Composition (الإنشاء والتعبير التحريري)',
        marks: '15 Marks',
        instructions: 'Choose either (A) or (B) to write a complete, coherent paragraph with a title: (15 Marks)',
        passage: null,
        items: [
          'Topic (A): Write a paragraph about "An Embarrassing Moment" in your life. (الوحدة الأولى)',
          'Topic (B): Write a paragraph about "How to Stay Healthy and Fit". (الوحدة الثانية)'
        ],
        solution: `
          <strong>النموذج الكامل للإنشاء الأول Topic (A): An Embarrassing Moment:</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; margin: 0.5rem 0;">
            <strong>An Embarrassing Moment</strong><br>
            Last Tuesday, I had one of the most embarrassing moments of my life. During the school break, I was in a hurry to buy a cold orange juice from the canteen. I took my tray and turned around quickly to talk to my friend Ahmed. Suddenly, I did not notice a bag on the floor, so I tripped and fell down heavily. My orange juice and sandwich flew across the hall and splashed on my teacher's clean jacket! Everyone stopped talking and looked at me. My face went bright red with embarrassment. Luckily, my teacher was very kind, smiled warmly, and helped me get up.
          </div>
          <em>الترجمة: (في يوم الثلاثاء الماضي، مررت بأحد أكثر المواقف إحراجاً في حياتي. أثناء الاستراحة المدرسية، كنت على عجلة لشراء عصير برتقال بارد من المقصف. أخذت صينيتي واستدرت بسرعة لأتحدث مع صديقي أحمد. فجأة لم أنتبه لحقيبة على الأرض فتعثرت وسقطت بقوة. طار العصير والشطيرة وسقطا على سترة أستاذي النظيفة! توقف الجميع عن الكلام ونظروا إليّ، واحمرّ وجهي خجلاً. لحسن الحظ كان أستاذي لطيفاً جداً، وابتسم بدفء وساعدني على النهوض).</em><br><br>
          <strong>النموذج الكامل للإنشاء الثاني Topic (B): How to Stay Healthy:</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; margin: 0.5rem 0;">
            <strong>How to Stay Healthy and Fit</strong><br>
            Health is the most valuable thing in our life, so we should always take care of our bodies. To stay fit, you should exercise regularly, such as playing football, running, or swimming for at least thirty minutes every day. In addition, you should eat a balanced diet containing plenty of fresh fruit, vegetables, and fish. It is very important to avoid eating too many sweets, crisps, and drinking fizzy drinks because they contain too much sugar and fat. Finally, you should sleep at least eight hours every night and drink plenty of water to keep your body active and refreshed.
          </div>
          <em>الترجمة: (الصحة هي أثمن ما نملك في حياتنا، لذا يجب علينا دائماً العناية بأجسادنا. للحفاظ على الرشاقة، ينبغي عليك ممارسة التمارين الرياضية بانتظام، مثل لعب كرة القدم أو الجري أو السباحة لمدة لا تقل عن ثلاثين دقيقة يومياً. بالإضافة إلى ذلك، يجب أن تتناول غذاءً متوازناً يحتوي على الكثير من الفواكه الطازجة والخضروات والسمك. من المهم جداً تجنب الإكثار من الحلويات والمقرمشات والمشروبات الغازية لأنها تحتوي على الكثير من السكر والدهون. وأخيراً، يجب أن تنام ثماني ساعات على الأقل كل ليلة وتشرب الكثير من الماء ليبقى جسمك نشيطاً ومنتعشاً).</em>
        `
      }
    ]
  },
  m1: {
    id: 'm1',
    title: 'نموذج امتحان الشهر الأول (First Month Exam - Unit 1: A School Magazine)',
    stage: 'الصف الثاني متوسط',
    subject: 'اللغة الإنجليزية',
    year: '2025 - 2026',
    time: 'ساعة واحدة',
    totalMarks: '50 درجة',
    notes: 'ملاحظة: امتحان الشهر الأول المخصص للوحدة الأولى (مجلة المدرسة، القواعد، والإملاء).',
    badge: '📘 امتحان الوحدة الأولى',
    questions: [
      {
        id: 'm1_q1',
        number: 'Q1',
        title: 'Reading Comprehension (استيعاب المقروء)',
        marks: '10 Marks',
        instructions: 'Read the short text and answer (5) questions: (10 Marks)',
        passage: `Al-Mustafa Intermediate School started a monthly magazine called "Students' Voice". Four students were chosen for the editorial team: Zaid is the editor, Mazin writes sports articles, and Omar collects jokes and cartoons. Last week, Zaid interviewed Mr. Kareem, the English teacher, about his favourite hobbies. Mr. Kareem said he enjoys reading history books and gardening in his spare time.`,
        items: [
          '1. What is the name of the school magazine?',
          '2. Who is the editor of the magazine team?',
          '3. What does Mazin write for the magazine?',
          '4. Mr. Kareem is the Science teacher. (True / False)',
          '5. What are Mr. Kareem\'s favourite hobbies?'
        ],
        solution: `
          <strong>الحل النموذجي (10 درجات):</strong><br>
          1. "Students' Voice" (صوت الطلاب).<br>
          2. Zaid (زيد).<br>
          3. Sports articles (مقالات رياضية).<br>
          4. <strong>False</strong> (خطأ، هو معلم اللغة الإنجليزية).<br>
          5. Reading history books and gardening (قراءة كتب التاريخ والاعتناء بالحديقة).
        `
      },
      {
        id: 'm1_q2',
        number: 'Q2',
        title: 'Grammar and Functions (القواعد والوظائف اللغوية)',
        marks: '15 Marks',
        instructions: 'Answer all items: (15 Marks)',
        passage: null,
        items: [
          '1. I haven\'t seen Huda (since / for) last Monday. (Choose)',
          '2. We (walk) to school when the rain started. (Correct the verb)',
          '3. This is the (boys) classroom. There are thirty boys in it. (Add apostrophe)',
          '4. "Shall we write a poem for the magazine?" (Accept the suggestion)',
          '5. He has worked in this shop (since / for) five years. (Choose)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          1. <strong>since</strong> (لأن last Monday نقطة زمنية محددة).<br>
          2. <strong>were walking</strong> (ماضٍ مستمر لوجود when).<br>
          3. the <strong>boys'</strong> classroom (فارزة التملك بعد الـ s لأن الاسم جمع ينتهي بـ s).<br>
          4. <strong>Yes, let's. / Good idea!</strong> (قبول الاقتراح).<br>
          5. <strong>for</strong> (لأن five years فترة زمنية ممتدة).
        `
      },
      {
        id: 'm1_q3',
        number: 'Q3',
        title: 'Vocabulary & Spelling (المفردات والإملاء)',
        marks: '15 Marks',
        instructions: 'Complete with suitable words from the box and correct forms: (15 Marks)',
        passage: null,
        items: [
          'A) Fill in the blanks with: [article, cartoon, editor, report]:<br>1. An ______ is someone who checks and decides what to publish.<br>2. A ______ is a funny drawing with a joke.<br>3. I wrote a ______ about the football match.',
          'B) Spelling:<br>1. look, looked ; buy, ______ (bought)<br>2. happy, unhappy ; polite, ______ (impolite)<br>3. one, first ; two, ______ (second)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          A) 1. <strong>editor</strong> | 2. <strong>cartoon</strong> | 3. <strong>report</strong>.<br>
          B) 1. <strong>bought</strong> | 2. <strong>impolite</strong> | 3. <strong>second</strong>.
        `
      },
      {
        id: 'm1_q4',
        number: 'Q4',
        title: 'Written Composition (الإنشاء)',
        marks: '10 Marks',
        instructions: 'Write a short paragraph about an embarrassing moment you had at school: (10 Marks)',
        passage: null,
        items: ['Write about: What happened, when, where, and how you felt.'],
        solution: `
          <strong>نموذج الإنشاء المعتمد (10 درجات):</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;">
            One day last month, I arrived at school in a rush. When I entered the classroom and took off my jacket, all my friends began laughing. I looked down and realised I was wearing one black shoe and one brown shoe! I felt so embarrassed, but soon I laughed with my friends too.
          </div>
        `
      }
    ]
  },
  m2: {
    id: 'm2',
    title: 'نموذج امتحان الشهر الثاني (Second Month Exam - Unit 2: Healthy Lifestyle)',
    stage: 'الصف الثاني متوسط',
    subject: 'اللغة الإنجليزية',
    year: '2025 - 2026',
    time: 'ساعة واحدة',
    totalMarks: '50 درجة',
    notes: 'ملاحظة: امتحان الشهر الثاني المخصص للوحدة الثانية (نمط الحياة الصحي، النصائح بـ Should، والكميات).',
    badge: '📗 امتحان الوحدة الثانية',
    questions: [
      {
        id: 'm2_q1',
        number: 'Q1',
        title: 'Reading Comprehension (استيعاب المقروء)',
        marks: '10 Marks',
        instructions: 'Read and answer: (10 Marks)',
        passage: `Doctor Huda gave a lecture about health at our school. She explained that exercising for 30 minutes every day makes our hearts stronger. She warned us against eating too much junk food, salt, and sugar. Instead, she advised having at least five portions of vegetables and fresh fruits daily. Water is the best drink for our body.`,
        items: [
          '1. How long should we exercise every day according to Dr. Huda?',
          '2. What does daily exercise do for our hearts?',
          '3. We should eat lots of salt and sugar. (True / False)',
          '4. How many portions of fruits and vegetables should we eat daily?',
          '5. What is the best drink for our body?'
        ],
        solution: `
          <strong>الحل النموذجي (10 درجات):</strong><br>
          1. 30 minutes (ثلاثون دقيقة).<br>
          2. It makes our hearts stronger (يجعل قلوبنا أقوى).<br>
          3. <strong>False</strong> (خطأ، حذرت من الإكثار منهما).<br>
          4. At least five portions (خمس حصص على الأقل).<br>
          5. Water (الماء).
        `
      },
      {
        id: 'm2_q2',
        number: 'Q2',
        title: 'Grammar and Functions (القواعد والوظائف اللغوية)',
        marks: '15 Marks',
        instructions: 'Answer all items: (15 Marks)',
        passage: null,
        items: [
          '1. You look pale and tired. You (should / shouldn\'t) go to bed early. (Choose)',
          '2. There are (too much / too many) cars on the road today. (Choose)',
          '3. My brother eats (too much / too many) sugar in his tea. (Choose)',
          '4. Ahmed has a stomach ache. (Give advice using: should / shouldn\'t)',
          '5. How often do you brush your teeth? (Answer using: twice a day)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          1. <strong>should</strong> (نصيحة إيجابية بالراحة والنوم مبكراً).<br>
          2. <strong>too many</strong> (لأن cars اسم جمع معدود).<br>
          3. <strong>too much</strong> (لأن sugar اسم غير معدود).<br>
          4. <strong>You shouldn't eat too much junk food. / You should see a doctor.</strong> (نصيحة مناسبة لألم المعدة).<br>
          5. <strong>I brush my teeth twice a day.</strong> (مرتين في اليوم).
        `
      },
      {
        id: 'm2_q3',
        number: 'Q3',
        title: 'Vocabulary & Aches (المفردات والأمراض)',
        marks: '15 Marks',
        instructions: 'Complete with correct words: (15 Marks)',
        passage: null,
        items: [
          'A) Complete the phrases: [stomach ache, toothache, headache, earache]:<br>1. When my head hurts, I have a ______.<br>2. When I eat too much candy and my tooth hurts, I have a ______.<br>3. After eating bad food, Jalal had a severe ______.',
          'B) Opposites & Plurals:<br>1. fit x ______ (unfit)<br>2. healthy x ______ (unhealthy)<br>3. foot -> ______ (feet)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          A) 1. <strong>headache</strong> | 2. <strong>toothache</strong> | 3. <strong>stomach ache</strong>.<br>
          B) 1. <strong>unfit</strong> | 2. <strong>unhealthy</strong> | 3. <strong>feet</strong>.
        `
      },
      {
        id: 'm2_q4',
        number: 'Q4',
        title: 'Written Composition (الإنشاء)',
        marks: '10 Marks',
        instructions: 'Write a paragraph on "How to Stay Healthy": (10 Marks)',
        passage: null,
        items: ['Include advice about exercise, food, water, and sleep.'],
        solution: `
          <strong>نموذج الإنشاء المعتمد (10 درجات):</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;">
            To keep your body fit and healthy, you should exercise for half an hour every day. Also, eat healthy foods like fresh fruit, vegetables, and fish, and avoid eating too many sweets or fatty foods. Do not forget to drink eight glasses of water daily and sleep well at night.
          </div>
        `
      }
    ]
  },
  u34: {
    id: 'u34',
    title: 'نموذج امتحان شامل للوحدة 3 والوحدة 4 (Sports, Games & Review 1)',
    stage: 'الصف الثاني متوسط',
    subject: 'اللغة الإنجليزية',
    year: '2025 - 2026',
    time: 'ساعة ونصف',
    totalMarks: '50 درجة',
    notes: 'ملاحظة: امتحان مخصص للوحدة 3 (الرياضة والألعاب) والوحدة 4 (المراجعة الشاملة الأولى).',
    badge: '📙 امتحان الوحدات 3 و 4',
    questions: [
      {
        id: 'u34_q1',
        number: 'Q1',
        title: 'Reading Comprehension (استيعاب المقروء)',
        marks: '10 Marks',
        instructions: 'Read and answer: (10 Marks)',
        passage: `Last month, our school held an exciting Sports Day. Students took part in running races, high jump, volleyball, and gymnastics. Mustafa won the gold medal in the 100-metre race because he used to train every morning with his coach. The headmaster presented medals to all winners, and everyone enjoyed the day.`,
        items: [
          '1. What event did the school hold last month?',
          '2. In which race did Mustafa win the gold medal?',
          '3. Why was Mustafa able to win the race?',
          '4. The headmaster gave prizes to the winners. (True / False)',
          '5. Who did Mustafa train with every morning?'
        ],
        solution: `
          <strong>الحل النموذجي (10 درجات):</strong><br>
          1. A Sports Day (اليوم الرياضي).<br>
          2. The 100-metre race (سباق 100 متر).<br>
          3. Because he used to train every morning (لأنه كان يتدرب كل صباح).<br>
          4. <strong>True</strong> (صح).<br>
          5. With his coach (مع مدربه).
        `
      },
      {
        id: 'u34_q2',
        number: 'Q2',
        title: 'Grammar and Functions (القواعد والوظائف اللغوية)',
        marks: '15 Marks',
        instructions: 'Answer all items: (15 Marks)',
        passage: null,
        items: [
          '1. We usually (play / go / do) judo on Saturdays. (Choose)',
          '2. My brother likes to (play / go / do) swimming in summer. (Choose)',
          '3. I (used to be / am) shy when I was seven, but now I am confident. (Choose)',
          '4. "Do you like football?" (Does this question have a rising or falling intonation?) (Answer)',
          '5. They (play) tennis yesterday afternoon. (Correct the verb)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          1. <strong>do</strong> (مع رياضات الفنون القتالية مثل judo و karate نستخدم do).<br>
          2. <strong>go</strong> (مع الرياضات المنتهية بـ ing مثل swimming نستخدم go).<br>
          3. <strong>used to be</strong> (عادة سابقة في الماضي تغيرت الآن).<br>
          4. <strong>Rising intonation</strong> (نبرة صاعدة ↗ لأن السؤال يبدأ بفعل مساعد Yes/No question).<br>
          5. <strong>played</strong> (ماضٍ بسيط لوجود yesterday).
        `
      },
      {
        id: 'u34_q3',
        number: 'Q3',
        title: 'Vocabulary & Sports Terms (المفردات والمصطلحات)',
        marks: '15 Marks',
        instructions: 'Complete with correct sports words: (15 Marks)',
        passage: null,
        items: [
          'A) Match sport with equipment: [racket, net, goggles, ball]:<br>1. Swimming needs ______.<br>2. Tennis needs a ball and a ______.<br>3. Volleyball needs a ball and a high ______.',
          'B) Spelling and verb changes:<br>1. win -> ______ (won)<br>2. lose -> ______ (lost)<br>3. beat -> ______ (beat)'
        ],
        solution: `
          <strong>الحل النموذجي (15 درجة):</strong><br>
          A) 1. <strong>goggles</strong> | 2. <strong>racket</strong> | 3. <strong>net</strong>.<br>
          B) 1. <strong>won</strong> | 2. <strong>lost</strong> | 3. <strong>beat</strong>.
        `
      },
      {
        id: 'u34_q4',
        number: 'Q4',
        title: 'Written Composition (الإنشاء)',
        marks: '10 Marks',
        instructions: 'Write a paragraph about your favourite sport: (10 Marks)',
        passage: null,
        items: ['Mention: Name of sport, why you like it, where you play it, and who you play with.'],
        solution: `
          <strong>نموذج الإنشاء المعتمد (10 درجات):</strong><br>
          <div style="direction: ltr; text-align: left; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;">
            My favourite sport is football because it is exciting and keeps me fit and healthy. I play it twice a week at the school playground with my friends. Football teaches us teamwork and cooperation. My favourite team is the Iraqi national team, and I dream of becoming a famous player one day.
          </div>
        `
      }
    ]
  }
};

// الحصول على قاعدة بيانات الامتحانات للمادة المحددة
function getSubjectExams(mode) {
  if (!mode || mode === 'auto') {
    mode = resolveCurriculumToExamSubject(appData.currentCurriculumId);
  }
  if (mode === 'bio' || mode === 'biology') return window.BIOLOGY_PAST_EXAMS || {};
  if (mode === 'chem' || mode === 'chemistry') return window.CHEMISTRY_PAST_EXAMS || {};
  if (mode === 'soc' || mode === 'social') return window.SOCIAL_PAST_EXAMS || {};
  if (mode === 'math') return window.MATH_PAST_EXAMS || {};
  if (mode === 'phy') return window.PHYSICS_PAST_EXAMS || {};
  if (mode === 'is') return window.ISLAMIC_PAST_EXAMS || {};
  if (mode === 'ar') return window.ARABIC_PAST_EXAMS || {};
  return PAST_EXAMS_DATABASE || {};
}

// مطابقة معرّف المنهج مع نمط المادة الامتحانية
function resolveCurriculumToExamSubject(currId) {
  if (currId === 11) return 'bio';
  if (currId === 10) return 'chem';
  if (currId === 9) return 'soc';
  if (currId === 8) return 'math';
  if (currId === 7) return 'phy';
  if (currId === 6) return 'is';
  if (currId === 4 || currId === 5) return 'ar';
  return 'en';
}

let examsRenderToken = 0;

function inferExamSubjectFromExamId(examId) {
  const id = String(examId || '').toLowerCase();
  if (id.startsWith('bio_')) return 'bio';
  if (id.startsWith('chem_')) return 'chem';
  if (id.endsWith('_soc') || id.startsWith('soc_')) return 'soc';
  if (id.startsWith('math_')) return 'math';
  if (id.startsWith('phy_')) return 'phy';
  if (id.startsWith('is_')) return 'is';
  if (id.startsWith('ar_')) return 'ar';
  return 'en';
}

// تبديل المادة الامتحانية في مركز الامتحانات
async function setExamSubjectMode(mode, userExplicit = true, targetExamId = null) {
  const reqToken = ++examsRenderToken;
  if (mode === 'auto') {
    mode = resolveCurriculumToExamSubject(appData.currentCurriculumId);
  }
  currentExamSubjectMode = mode;

  // تحديث مظهر أزرار المواد فوراً
  const subjectModes = ['bio', 'chem', 'soc', 'math', 'phy', 'is', 'ar', 'en'];
  subjectModes.forEach(m => {
    const btnId = 'btnExamSubject' + m.charAt(0).toUpperCase() + m.slice(1);
    const btn = document.getElementById(btnId);
    if (btn) {
      const isActive = (m === mode);
      btn.className = isActive ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  });

  // مزامنة اختيار المادة مع الاختبار التفاعلي المنهجي عند النقر المباشر أثناء فتح تبويب الاختبار الفوري
  const examModeToCurrId = { en: 3, ar: 4, is: 6, phy: 7, math: 8, soc: 9, chem: 10, bio: 11 };
  const mappedCurrId = examModeToCurrId[mode] || 3;
  const quizContainer = document.getElementById('interactiveQuizViewContainer');
  if (userExplicit && quizContainer && !quizContainer.classList.contains('hidden')) {
    const subSelect = document.getElementById('quizSubjectSelect');
    if (mappedCurrId && subSelect && Number(subSelect.value) !== mappedCurrId) {
      subSelect.value = mappedCurrId;
      if (typeof onQuizSubjectChanged === 'function') {
        onQuizSubjectChanged();
      }
    }
  }

  // التحميل الكسول لنماذج المادة عند الحاجة (الإنجليزية مدمجة في PAST_EXAMS_DATABASE)
  const filterContainer = document.getElementById('pastExamFilterButtons');
  const printArea = document.getElementById('printableExamArea');
  if (mode !== 'en' && !CurriculumLoader.isCurriculumLoaded(mappedCurrId)) {
    if (filterContainer) {
      filterContainer.innerHTML = '<span style="font-size: 0.8rem; color: var(--slate-500); font-weight: 700;">جارٍ تحميل نماذج المادة...</span>';
    }
    if (printArea) {
      printArea.innerHTML = CurriculumLoader.renderLoadingHTML('نماذج الامتحانات الرسمية للمادة');
    }
    const ok = await CurriculumLoader.ensureCurriculumLoaded(mappedCurrId, { includeDiagrams: false });
    if (reqToken !== examsRenderToken) return;
    if (!ok) {
      if (printArea) {
        printArea.innerHTML = CurriculumLoader.renderErrorHTML('نماذج الامتحانات', `setExamSubjectMode('${mode}', ${Boolean(userExplicit)})`);
      }
      return;
    }
  }

  // توليد أزرار النماذج المتاحة لهذه المادة ديناميكياً
  const exams = getSubjectExams(mode);
  const examKeys = Object.keys(exams);

  if (filterContainer) {
    filterContainer.innerHTML = `
      <span style="font-size: 0.8rem; font-weight: 700; color: var(--slate-600); margin-inline-end: 0.35rem;">اختر النموذج:</span>
      ${examKeys.map(k => {
        const ex = exams[k];
        const label = ex.badge || ex.title;
        return `
          <button class="btn btn-sm btn-secondary" id="examFilter_${k}" onclick="selectPastExam('${k}')" style="font-size: 0.75rem; font-weight: 700;">
            ${label}
          </button>
        `;
      }).join('')}
    `;
  }

  // اختيار النموذج المستهدف أو الافتراضي للمادة
  let defaultExamId = (targetExamId && exams[targetExamId]) ? targetExamId : examKeys[0];
  if (!targetExamId || !exams[targetExamId]) {
    if (mode === 'bio') {
      defaultExamId = exams['bio_final'] ? 'bio_final' : (exams['bio_midterm'] ? 'bio_midterm' : examKeys[0]);
    } else if (mode === 'chem') {
      defaultExamId = exams['chem_final'] ? 'chem_final' : (exams['chem_midterm'] ? 'chem_midterm' : examKeys[0]);
    } else if (mode === 'soc') {
      defaultExamId = exams['exam_final_soc'] ? 'exam_final_soc' : (exams['exam_midterm_soc'] ? 'exam_midterm_soc' : examKeys[0]);
    } else if (mode === 'math') {
      defaultExamId = exams['math_final'] ? 'math_final' : (exams['math_midyear'] ? 'math_midyear' : examKeys[0]);
    } else if (mode === 'phy') {
      defaultExamId = exams['phy_midyear'] ? 'phy_midyear' : (exams['phy_final'] ? 'phy_final' : examKeys[0]);
    } else if (mode === 'is') {
      defaultExamId = exams['is_midyear'] ? 'is_midyear' : (exams['is_final'] ? 'is_final' : examKeys[0]);
    } else if (mode === 'ar') {
      defaultExamId = exams['ar_midyear'] ? 'ar_midyear' : (exams['ar_final'] ? 'ar_final' : examKeys[0]);
    } else {
      defaultExamId = exams['midyear'] ? 'midyear' : (exams['final'] ? 'final' : examKeys[0]);
    }
  }

  await selectPastExam(defaultExamId, true);
}

// تهيئة وعرض مركز الامتحانات تلقائياً بناءً على المنهج النشط
async function renderExamsCenter() {
  const detectedMode = resolveCurriculumToExamSubject(appData.currentCurriculumId);
  await setExamSubjectMode(detectedMode, false);
}

// اختيار نموذج امتحاني محدد
async function selectPastExam(examId, fromModeSetup = false) {
  if (!examId) return;

  // فحص إذا كان النموذج المطلوب ينتمي لمادة أخرى
  let matchedMode = null;
  ['bio', 'chem', 'soc', 'math', 'phy', 'is', 'ar', 'en'].forEach(m => {
    const subExams = getSubjectExams(m);
    if (subExams[examId]) matchedMode = m;
  });
  if (!matchedMode) {
    matchedMode = inferExamSubjectFromExamId(examId);
  }

  if (!fromModeSetup && matchedMode && matchedMode !== currentExamSubjectMode) {
    await setExamSubjectMode(matchedMode, true, examId);
    return;
  }

  currentSelectedPastExamId = examId;
  allExamSolutionsVisible = false;

  // تحديث حالة أزرار النماذج
  const exams = getSubjectExams(currentExamSubjectMode);
  Object.keys(exams).forEach(id => {
    const btn = document.getElementById(`examFilter_${id}`);
    if (btn) {
      if (id === currentSelectedPastExamId) {
        btn.className = 'btn btn-sm btn-primary';
      } else {
        btn.className = 'btn btn-sm btn-secondary';
      }
    }
  });

  renderPastExam(currentSelectedPastExamId);
}


// عرض ورقة الامتحان والأسئلة كاملة
function renderPastExam(examId) {
  const container = document.getElementById('printableExamArea');
  if (!container) return;

  const exams = getSubjectExams(currentExamSubjectMode);
  const exam = exams[examId] || Object.values(exams)[0] || PAST_EXAMS_DATABASE['midyear'];
  if (!exam) return;
  currentSelectedPastExamId = exam.id;

  const isEnglish = (currentExamSubjectMode === 'en');
  const textDir = isEnglish ? 'ltr' : 'rtl';
  const textAlign = isEnglish ? 'left' : 'right';

  container.innerHTML = `
    <!-- الترويسة الرسمية لورقة الامتحان -->
    <div class="exam-official-header">
      <div>
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--slate-800);">جمهورية العراق - وزارة التربية</div>
        <div style="font-size: 0.8rem; color: var(--slate-600);">${exam.stage} • ${exam.subject}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary);">${exam.title}</div>
        <div style="font-size: 0.75rem; color: var(--slate-500);">العام الدراسي: ${exam.year}</div>
      </div>
      <div style="text-align: ${isEnglish ? 'right' : 'left'}; font-size: 0.8rem; font-weight: 700; color: var(--slate-700);">
        <div>الوقت: ${exam.time}</div>
        <div style="color: var(--primary);">الدرجة الكلية: ${exam.totalMarks}</div>
      </div>
    </div>

    <div style="background: var(--slate-100); padding: 0.5rem 0.85rem; border-radius: 8px; font-size: 0.8rem; color: var(--slate-700); font-weight: 700; margin-bottom: 1.25rem;">
      ${exam.notes}
    </div>

    <!-- قائمة الأسئلة الرسمية -->
    <div class="exam-questions-container">
      ${(exam.questions || []).map((q, idx) => `
        <div class="exam-q-card" id="card_${q.id}">
          <div class="exam-q-header">
            <div class="exam-q-title">
              <span style="color: var(--primary); font-weight: 800;">${q.number}:</span>
              <span>${q.title}</span>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <span class="exam-q-marks">${q.marks}</span>
              ${(q.passage && isEnglish) ? `
                <button class="exam-listen-btn" onclick="speakExamPassage(this.getAttribute('data-passage'))" data-passage="${q.passage.replace(/"/g, '&quot;')}" title="استمع لنص القطعة بالصوت البشري">
                  <span>🔊</span> استمع للنص
                </button>
              ` : ''}
              <button class="exam-toggle-sol-btn" id="solBtn_${q.id}" onclick="toggleExamSolution('${q.id}')">
                <span>👁️</span> الحل النموذجي
              </button>
            </div>
          </div>

          ${q.instructions ? `
            <div style="font-size: 0.82rem; color: var(--slate-600); margin-bottom: 0.75rem; font-weight: 600; direction: ${textDir}; text-align: ${textAlign};">
              ${q.instructions}
            </div>
          ` : ''}

          ${q.passage ? `
            <div class="exam-passage-box" style="direction: ${textDir}; text-align: ${textAlign};">
              ${q.passage}
            </div>
          ` : ''}

          ${q.content ? `
            <div class="exam-q-content" style="font-size: 0.9rem; line-height: 1.8; color: var(--slate-800); margin-bottom: 0.85rem; direction: ${textDir}; text-align: ${textAlign};">
              ${formatPhysicsMath(q.content)}
            </div>
          ` : ''}

          ${q.branchA ? `
            <div style="margin-bottom: 0.85rem;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.35rem; direction: ${textDir}; text-align: ${textAlign};">
                ${formatPhysicsMath(q.branchA.title)}
              </div>
              ${q.branchA.boxWords ? `
                <div style="background: white; border: 1px dashed var(--slate-300); border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.5rem; direction: ${textDir}; text-align: center; font-weight: 700; color: var(--primary);">
                  [ ${q.branchA.boxWords.join('  •  ')} ]
                </div>
              ` : ''}
              <div class="exam-questions-list" style="direction: ${textDir}; text-align: ${textAlign};">
                ${q.branchA.items.map(it => `<div>${formatPhysicsMath(it)}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${q.branchB ? `
            <div style="margin-bottom: 0.85rem;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.35rem; direction: ${textDir}; text-align: ${textAlign};">
                ${formatPhysicsMath(q.branchB.title)}
              </div>
              <div class="exam-questions-list" style="direction: ${textDir}; text-align: ${textAlign};">
                ${q.branchB.items.map(it => `<div>${formatPhysicsMath(it)}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${q.branchC ? `
            <div style="margin-bottom: 0.85rem;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.35rem; direction: ${textDir}; text-align: ${textAlign};">
                ${formatPhysicsMath(q.branchC.title)}
              </div>
              <div class="exam-questions-list" style="direction: ${textDir}; text-align: ${textAlign};">
                ${q.branchC.items.map(it => `<div>${formatPhysicsMath(it)}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${q.items ? `
            <div class="exam-questions-list" style="direction: ${textDir}; text-align: ${textAlign};">
              ${q.items.map(it => `<div>${formatPhysicsMath(it)}</div>`).join('')}
            </div>
          ` : ''}

          <!-- صندوق الحل النموذجي المفصل -->
          <div class="exam-model-answer-box hidden" id="solBox_${q.id}" style="direction: ${textDir}; text-align: ${textAlign};">
            <div style="font-weight: 800; margin-bottom: 0.45rem; color: #15803d; display: flex; align-items: center; gap: 0.4rem;">
              <span>💡</span> الجواب النموذجي المعتمد وتوزيع الدرجات الوزارية:
            </div>
            <div style="font-size: 0.88rem; line-height: 1.8; color: #166534;">
              ${formatPhysicsMath(q.answer || q.solution || '')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--slate-200); display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--slate-500); flex-wrap: wrap; gap: 0.5rem;">
      <div>✨ تمنياتنا لجميع طلبتنا الأعزاء بالنجاح والتفوق الباهر في الامتحانات الوزارية</div>
      <div style="font-weight: 700; color: var(--primary);">النظام التعليمي التفاعلي • إعداد المهندس أسامة خليل هاشم</div>
    </div>
  `;
}

function speakExamPassage(text) {
  if (currentExamSubjectMode !== 'en' && !isEnglishCurriculum(appData.currentCurriculumId)) return;
  if (audioPlayer && audioPlayer.speakText && text) {
    audioPlayer.speakText(text, 'en');
  }
}

function toggleExamSolution(qId) {
  const box = document.getElementById(`solBox_${qId}`);
  const btn = document.getElementById(`solBtn_${qId}`);
  if (!box) return;

  if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    if (btn) btn.innerHTML = '<span>🙈</span> إخفاء الحل';
  } else {
    box.classList.add('hidden');
    if (btn) btn.innerHTML = '<span>👁️</span> الحل النموذجي';
  }
}

function toggleAllExamSolutions() {
  allExamSolutionsVisible = !allExamSolutionsVisible;
  const btn = document.getElementById('toggleAllSolutionsBtn');
  const exams = getSubjectExams(currentExamSubjectMode);
  const exam = exams[currentSelectedPastExamId];
  if (!exam) return;

  exam.questions.forEach(q => {
    const box = document.getElementById(`solBox_${q.id}`);
    const solBtn = document.getElementById(`solBtn_${q.id}`);
    if (box) {
      if (allExamSolutionsVisible) {
        box.classList.remove('hidden');
        if (solBtn) solBtn.innerHTML = '<span>🙈</span> إخفاء الحل';
      } else {
        box.classList.add('hidden');
        if (solBtn) solBtn.innerHTML = '<span>👁️</span> الحل النموذجي';
      }
    }
  });

  if (btn) {
    btn.innerHTML = allExamSolutionsVisible
      ? '<span>🙈</span> إخفاء كافة الحلول النموذجية'
      : '<span>👁️</span> إظهار كافة الحلول النموذجية';
  }
}

function printExamPaper() {
  document.body.classList.remove('printing-interactive-quiz');
  const exams = getSubjectExams(currentExamSubjectMode);
  const exam = exams[currentSelectedPastExamId];
  if (exam) {
    exam.questions.forEach(q => {
      const box = document.getElementById(`solBox_${q.id}`);
      if (box) box.classList.add('hidden');
    });
  }
  window.print();
}

async function switchExamSubtab(subtab, skipAutoLoad = false) {
  const pastContainer = document.getElementById('pastExamsViewContainer');
  const quizContainer = document.getElementById('interactiveQuizViewContainer');
  const btnPast = document.getElementById('btnSubtabPastExams');
  const btnQuiz = document.getElementById('btnSubtabInteractive');

  if (subtab === 'past-exams') {
    if (pastContainer) pastContainer.classList.remove('hidden');
    if (quizContainer) quizContainer.classList.add('hidden');
    if (btnPast) btnPast.classList.add('active');
    if (btnQuiz) btnQuiz.classList.remove('active');
    renderPastExam(currentSelectedPastExamId);
  } else {
    if (pastContainer) pastContainer.classList.add('hidden');
    if (quizContainer) quizContainer.classList.remove('hidden');
    if (btnPast) btnPast.classList.remove('active');
    if (btnQuiz) btnQuiz.classList.add('active');

    if (!skipAutoLoad) {
      const reqToken = ++quizLoadToken;
      const activeCurrId = Number(appData.currentCurriculumId) || 3;
      const subSelect = document.getElementById('quizSubjectSelect');
      const targetSubId = BUILTIN_CURRICULUM_IDS.has(activeCurrId) ? activeCurrId : 3;
      if (subSelect) subSelect.value = targetSubId;

      if (!(await ensureQuizzesReady(reqToken))) return;

      populateQuizChaptersDropdown(targetSubId);
      const chapSelect = document.getElementById('quizChapterSelect');
      if ((!currentQuizQuestions || currentQuizQuestions.length === 0 || currentQuizMeta.currId !== targetSubId) && chapSelect && chapSelect.value) {
        await loadChapterQuiz(targetSubId, Number(chapSelect.value));
      }
    }
  }
}

async function openPastExamsTab(examId) {
  if (examId) {
    switchTab('exams', { skipExamsRender: true });
    await switchExamSubtab('past-exams', true);
    await selectPastExam(examId);
  } else {
    switchTab('exams');
    await switchExamSubtab('past-exams');
  }
}
