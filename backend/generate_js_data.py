import json

# Read exported curriculum JSON
with open('storage/curriculum_3_exported.json', 'r', encoding='utf-8') as f:
    chapters = json.load(f)

grammar_rules = [
    {
        "id": "possessive_s",
        "unit": 1,
        "title": "s التملك (Possessive 's')",
        "level": "مهم جداً - الوحدة 1",
        "page": 4,
        "formula": "المفرد: الاسم + 's  |  الجمع العادي: الاسم الجمع + '  |  الجمع الشاذ: الاسم + 's",
        "explanation": "تُستخدم فاصلة التملك للتعبير عن ملكية شيء لشخص أو جهة. إذا كان المالك مفرداً نضع فاصلة قبل الـ s، وإذا كان المالك جمعاً ينتهي بـ s نضع الفاصلة بعد الـ s فقط لمنع التكرار.",
        "examples": [
            {"en": "Go and get the boy's bag.", "ar": "اذهب واجلب حقيبة الولد. (ولد واحد)"},
            {"en": "Go and get the boys' bags.", "ar": "اذهب واجلب حقائب الأولاد. (أكثر من ولد)"},
            {"en": "The school's magazine is interesting.", "ar": "مجلة المدرسة ممتعة. (مدرسة واحدة)"},
            {"en": "The schools' magazines are interesting.", "ar": "مجلات المدارس ممتعة. (مجموعة مدارس)"},
            {"en": "These are the children's books.", "ar": "هذه كتب الأطفال. (جمع شاذ نضيف 's)"}
        ],
        "quiz": {
            "question": "Which sentence refers to bags belonging to MORE THAN ONE boy?",
            "options": [
                "The boy's bags are new.",
                "The boys' bags are new.",
                "The boys bags are new.",
                "The boy bags is new."
            ],
            "correct": 1,
            "explanation": "في حالة الجمع نضع الفاصلة العليا بعد حرف الـ s: (boys')."
        }
    },
    {
        "id": "for_and_since",
        "unit": 1,
        "title": "المضارع التام مع For و Since",
        "level": "قاعدة أساسية - الوحدة 1",
        "page": 7,
        "formula": "Since + نقطة البداية المحددة  |  For + طول الفترة الزمنية الإجمالية",
        "explanation": "نستخدم since عندما نحدد نقطة انطلاق الحدث في الماضي (سنة، يوم، مناسبة مثل: since 2020, since yesterday, since 8 o'clock). ونستخدم for عند حساب المدة الزمنية كعدد (ساعات، أيام، سنوات مثل: for 3 hours, for 5 years, for a long time).",
        "examples": [
            {"en": "I have lived in Ashby since I was born.", "ar": "أعيش في آشبي منذ أن ولدت."},
            {"en": "I have lived in Basra since 2018.", "ar": "أنا أعيش في البصرة منذ عام 2018."},
            {"en": "I have been in this school for three years.", "ar": "أنا في هذه المدرسة لمدة ثلاث سنوات."},
            {"en": "He has been ill for two days.", "ar": "هو مريض منذ يومين (لمدة يومين)."}
        ],
        "quiz": {
            "question": "I have studied English _______ five years.",
            "options": [
                "since",
                "for",
                "ago",
                "in"
            ],
            "correct": 1,
            "explanation": "نستخدم for لأن خمس سنوات (five years) تمثل طول فترة زمنية إجمالية."
        }
    },
    {
        "id": "likes_dislikes",
        "unit": 1,
        "title": "التعبير عن الإعجاب وعدم الإعجاب (Likes & Dislikes)",
        "level": "الوحدة 1",
        "page": 7,
        "formula": "Subject + (like / love / enjoy / hate / dislike) + Verb-ing / Noun",
        "explanation": "أفعال المشاعر مثل (like, love, enjoy, hate, dislike) يأتي بعدها الفعل مضافاً إليه ing أو يأتي بعدها اسم صريح.",
        "examples": [
            {"en": "I like cooking.", "ar": "أنا أحب الطبخ."},
            {"en": "I don't like cleaning up.", "ar": "أنا لا أحب التنظيف."},
            {"en": "I dislike cleaning up.", "ar": "أنا أكره التنظيف (dislike تعادل don't like)."},
            {"en": "She enjoys playing football.", "ar": "هي تستمتع بلعب كرة القدم."}
        ],
        "quiz": {
            "question": "He dislikes _______ the house after the party.",
            "options": [
                "clean",
                "to clean",
                "cleaning",
                "cleaned"
            ],
            "correct": 2,
            "explanation": "الفعل dislike يتبعه فعل مضاف إليه -ing دائماً (cleaning)."
        }
    },
    {
        "id": "relative_clauses_who",
        "unit": 1,
        "title": "وصف الأشخاص بجمل الوصل (Relative Pronoun: Who)",
        "level": "الوحدة 1",
        "page": 7,
        "formula": "Subject + like/dislike + people + WHO + Verb...",
        "explanation": "نستخدم ضمير الوصل who للإشارة إلى الأشخاص ووصف صفاتهم وسلوكياتهم.",
        "examples": [
            {"en": "I like people who help others.", "ar": "أنا أحب الأشخاص الذين يساعدون الآخرين."},
            {"en": "I dislike people who are noisy.", "ar": "أنا لا أحب الأشخاص الذين يثيرون الإزعاج."},
            {"en": "I love teachers who explain clearly.", "ar": "أنا أحب المعلمين الذين يشرحون بوضوح."}
        ],
        "quiz": {
            "question": "I like students _______ do their homework on time.",
            "options": [
                "which",
                "who",
                "where",
                "whose"
            ],
            "correct": 1,
            "explanation": "نستخدم who للإشارة إلى العاقل (students)."
        }
    },
    {
        "id": "giving_advice_should",
        "unit": 2,
        "title": "إعطاء النصيحة (Giving Advice: Should / Shouldn't)",
        "level": "الوحدة 2",
        "page": 17,
        "formula": "You + should / shouldn't + مصدر الفعل (Infinitive)",
        "explanation": "تُستخدم should لتقديم نصيحة بفعل شيء جيد، و shouldn't للنصيحة بتجنب شيء ضار. يأتي بعدهما الفعل مجرداً دائماً بدون أي إضافة.",
        "examples": [
            {"en": "You should take more exercise.", "ar": "ينبغي عليك ممارسة المزيد من التمارين الرياضية."},
            {"en": "You shouldn't eat too much crisps and sweets.", "ar": "لا ينبغي أن تأكل الكثير من المقرمشات والحلويات."},
            {"en": "You should drink plenty of water every day.", "ar": "يجب عليك شرب الكثير من الماء يومياً."}
        ],
        "quiz": {
            "question": "You _______ watch TV for hours; it hurts your eyes.",
            "options": [
                "should",
                "shouldn't",
                "must",
                "can"
            ],
            "correct": 1,
            "explanation": "نستخدم shouldn't لتقديم نصيحة بعدم الإفراط في مشاهدة التلفاز."
        }
    },
    {
        "id": "sports_verbs",
        "unit": 3,
        "title": "أفعال الرياضات: Play, Go, Do",
        "level": "مهم جداً - الوحدة 3",
        "page": 32,
        "formula": "Play + رياضات الكرة | Go + رياضات تنتهي بـ ing | Do + رياضات فردية وقتالية",
        "explanation": "1. نستخدم play مع الألعاب التي تستخدم الكرة أو التنافس الجماعي (football, basketball, tennis, chess).\n2. نستخدم go مع الرياضات المنتهية بـ -ing (swimming, cycling, running, riding).\n3. نستخدم do مع الرياضات الفردية، اللياقة والفنون القتالية (karate, judo, yoga, gymnastics).",
        "examples": [
            {"en": "I play tennis with my brother every Friday.", "ar": "أنا ألعب التنس مع أخي كل جمعة."},
            {"en": "We go swimming at the leisure centre.", "ar": "نحن نذهب للسباحة في المركز الترفيهي."},
            {"en": "My mother does yoga in the morning.", "ar": "والدتي تمارس اليوغا في الصباح."},
            {"en": "I want to do karate in the holidays.", "ar": "أريد ممارسة الكاراتيه في العطلة."}
        ],
        "quiz": {
            "question": "My friends _______ cycling at the weekend.",
            "options": [
                "do",
                "play",
                "go",
                "make"
            ],
            "correct": 2,
            "explanation": "الرياضة المنتهية بـ -ing مثل cycling تأخذ الفعل go."
        }
    },
    {
        "id": "used_to",
        "unit": 3,
        "title": "الاعتياد في الماضي (Used to)",
        "level": "الوحدة 3",
        "page": 36,
        "formula": "الإثبات: Subject + used to + infinitive  |  النفي: Subject + didn't use to + infinitive",
        "explanation": "تُستخدم used to للحديث عن عادة أو حالة كانت موجودة في الماضي وتغيرت في الحاضر. في حالة النفي والسؤال نحذف حرف الـ d ليصبح use to.",
        "examples": [
            {"en": "I used to play tennis, but now I prefer football.", "ar": "كنت معتاداً على لعب التنس، لكن الآن أفضل كرة القدم."},
            {"en": "They didn't use to like their English classes. Now they love them!", "ar": "لم يكونوا معتادين على حب دروس الإنجليزية، الآن يحبونها جداً!"},
            {"en": "Did you use to play video games?", "ar": "هل كنت معتاداً على لعب ألعاب الفيديو؟"}
        ],
        "quiz": {
            "question": "She didn't _______ like vegetables when she was young.",
            "options": [
                "used to",
                "use to",
                "uses to",
                "using to"
            ],
            "correct": 1,
            "explanation": "بعد didn't نحذف الـ d ونستخدم الصيغة المجردة use to."
        }
    },
    {
        "id": "passive_voice",
        "unit": 5,
        "title": "المبني للمجهول (Passive Voice)",
        "level": "الوحدة 5",
        "page": 51,
        "formula": "المضارع: Object + is / are + Past Participle  |  مع can: Object + can be + Past Participle",
        "explanation": "يُستخدم المبني للمجهول عندما يكون الفعل أو الحدث أهم من الفاعل الذي قام به، أو عندما يكون الفاعل غير معروف.",
        "examples": [
            {"en": "Arabic is spoken in Iraq.", "ar": "اللغة العربية يُتحدث بها في العراق."},
            {"en": "Newspapers are sold in this shop.", "ar": "الصحف تُباع في هذا المتجر."},
            {"en": "Mobile phones can be used when the plane lands.", "ar": "الهواتف المحمولة يمكن استخدامها عند هبوط الطائرة."},
            {"en": "Mobile phones cannot be used during take-off.", "ar": "الهواتف المحمولة لا يمكن استخدامها أثناء الإقلاع."}
        ],
        "quiz": {
            "question": "English _______ in many schools around the world.",
            "options": [
                "speaks",
                "is spoken",
                "is speak",
                "spoken"
            ],
            "correct": 1,
            "explanation": "جملة مبني للمجهول في المضارع: is + التصريف الثالث (spoken)."
        }
    },
    {
        "id": "future_going_to",
        "unit": 6,
        "title": "المستقبل المخطط له (Future with: be going to)",
        "level": "الوحدة 6",
        "page": 63,
        "formula": "Subject + (am / is / are) + going to + مصدر الفعل (Infinitive)",
        "explanation": "تُستخدم be going to للتعبير عن الخطط المستقبلية المؤكدة والنوايا المسبقة.",
        "examples": [
            {"en": "I am going to be a doctor.", "ar": "أنا أنوي أن أصبح طبيباً في المستقبل."},
            {"en": "He is going to study architecture in Baghdad.", "ar": "هو يخطط لدراسة الهندسة المعمارية في بغداد."},
            {"en": "Are you going to join the sports club?", "ar": "هل تخطط للانضمام للنادي الرياضي؟"}
        ],
        "quiz": {
            "question": "Look at the clouds! It _______ rain soon.",
            "options": [
                "is going to",
                "goes to",
                "will to",
                "is going"
            ],
            "correct": 0,
            "explanation": "نستخدم is going to بوجود دليل حاضر على حدوث الفعل (الغيوم)."
        }
    },
    {
        "id": "must_vs_should",
        "unit": 7,
        "title": "الإلزام والقوانين مقابل النصيحة (Must vs Should)",
        "level": "الوحدة 7",
        "page": 74,
        "formula": "Must: إلزام وقانون إجباري  |  Should: نصيحة ورأي اختياري",
        "explanation": "1. Must / Mustn't: للتعبير عن الإلزام القانوني والأخلاقي الإجباري وتجنب المخالفات الخطيرة.\n2. Should / Shouldn't: لتقديم النصيحة الودية والتوجيه بدون إلزام إجباري.",
        "examples": [
            {"en": "You must not throw litter on the street.", "ar": "يُحظر تماماً رمي القمامة في الشارع (قانون)."},
            {"en": "You should sleep early to feel fresh.", "ar": "ينبغي أن تنام مبكراً لتشعر بالانتعاش (نصيحة)."},
            {"en": "We must reduce pollution to save our planet.", "ar": "يجب علينا الحد من التلوث لإنقاذ كوكبنا."}
        ],
        "quiz": {
            "question": "Drivers _______ stop when the traffic light is red.",
            "options": [
                "should",
                "must",
                "may",
                "might"
            ],
            "correct": 1,
            "explanation": "إشارة المرور الحمراء قانون إلزامي صارم، لذا نستخدم must."
        }
    },
    {
        "id": "may_and_might",
        "unit": 7,
        "title": "الاحتمالية والترجيح (May & Might)",
        "level": "الوحدة 7",
        "page": 77,
        "formula": "Subject + may / might + مصدر الفعل (Infinitive)",
        "explanation": "نستخدم may و might للتعبير عن احتمال حدوث شيء في الحاضر أو المستقبل دون تأكيد جازم. وتعتبر might أقل تأكيداً من may.",
        "examples": [
            {"en": "If we plant thousands of trees, we may turn parts of the desert green.", "ar": "إذا زرعنا آلاف الأشجار، قد نحول أجزاءً من الصحراء إلى مساحات خضراء."},
            {"en": "It might rain this afternoon, but the sky is clear now.", "ar": "ربما تمطر بعد الظهر، لكن السماء صافية الآن."}
        ],
        "quiz": {
            "question": "Take an umbrella with you; it _______ rain later.",
            "options": [
                "might",
                "must",
                "should to",
                "need"
            ],
            "correct": 0,
            "explanation": "نستخدم might للتعبير عن إمكانية واحتمالية هطول المطر."
        }
    }
]

# Write to curriculum_data.js
js_code = f"""// بيانات المنهج التعليمي والقواعد والمساعد الذكي - نسخة محلية متكاملة 100%
window.CURRICULUM_DATA = {json.dumps(chapters, ensure_ascii=False, indent=2)};

window.GRAMMAR_RULES = {json.dumps(grammar_rules, ensure_ascii=False, indent=2)};
"""

with open('curriculum_data.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print('Generated curriculum_data.js successfully!')
