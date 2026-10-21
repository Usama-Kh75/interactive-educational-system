import sqlite3

def clean_structure():
    conn = sqlite3.connect('storage/database.sqlite3')
    cur = conn.cursor()
    
    units_def = [
        {
            'title': 'الوحدة 1: مجلة المدرسة (Unit 1: A School Magazine)',
            'start_page': 4,
            'end_page': 16,
            'lessons': [
                {'title': 'Lesson 1: A School Magazine (مجلة المدرسة وأقسامها)', 'start': 4, 'end': 4},
                {'title': 'Lesson 2: A New Project (مشروع النشر والمفردات)', 'start': 5, 'end': 5},
                {'title': 'Lesson 3: An Interview - Part A (المقابلة الصحفية)', 'start': 6, 'end': 6},
                {'title': 'Lesson 4: An Interview - Part B (قواعد for & since و likes)', 'start': 7, 'end': 7},
                {'title': 'Lesson 5: Problems - Ask Aunt Sally (المشاكل والنصائح)', 'start': 8, 'end': 8},
                {'title': 'Lesson 6: Ask Aunt Sally - Notes (الملاحظات والاختصارات)', 'start': 9, 'end': 9},
                {'title': 'Lesson 7: Embarrassing Moments (مواقف محرجة)', 'start': 10, 'end': 10},
                {'title': 'Lesson 8: The Global Youth Magazine (مجلة الشباب)', 'start': 11, 'end': 11},
                {'title': 'Unit 1 Round up & Review (مراجعة الوحدة الأولى)', 'start': 12, 'end': 12},
                {'title': 'Story Time: Jad and Johnny - A Tour of London', 'start': 13, 'end': 14},
                {'title': 'Project 1: My First Day at School', 'start': 15, 'end': 16}
            ]
        },
        {
            'title': 'الوحدة 2: نمط الحياة الصحي (Unit 2: Healthy Lifestyle)',
            'start_page': 17,
            'end_page': 29,
            'lessons': [
                {'title': 'Lesson 1: Keep Fit! (الحفاظ على اللياقة البدنية)', 'start': 17, 'end': 17},
                {'title': 'Lesson 2: Eat the Right Food (الغذاء الصحي المتوازن)', 'start': 18, 'end': 18},
                {'title': 'Lesson 3: In a Restaurant (في المطعم وقوائم الطعام)', 'start': 19, 'end': 19},
                {'title': 'Lesson 4: Aches and Pains (الأوجاع والأمراض الشائعة)', 'start': 20, 'end': 20},
                {'title': "Lesson 5: Jalal's Story (قصة جلال والتصرف السليم)", 'start': 21, 'end': 21},
                {'title': "Lesson 6: Get Well Cards (بطاقات التمني بالشفاء)", 'start': 22, 'end': 22},
                {'title': 'Lesson 7: An Informal Letter (كتابة رسالة غير رسمية)', 'start': 23, 'end': 23},
                {'title': 'Lesson 8: Limericks (القصائد الفكاهية الإنجليزية)', 'start': 24, 'end': 24},
                {'title': 'Unit 2 Round Up (مراجعة الوحدة الثانية)', 'start': 25, 'end': 25},
                {'title': 'Story Time: Jad and Johnny - Camping at Stonehenge', 'start': 26, 'end': 27},
                {'title': 'Project 2: Healthy Living Poster', 'start': 28, 'end': 29}
            ]
        },
        {
            'title': 'الوحدة 3: الرياضة والألعاب (Unit 3: Sports and Games)',
            'start_page': 30,
            'end_page': 42,
            'lessons': [
                {'title': 'Lesson 1: Sports and Games (أنواع الرياضات وأفعالها)', 'start': 30, 'end': 31},
                {'title': 'Lesson 2: Sports Verbs (play, go, do)', 'start': 32, 'end': 33},
                {'title': 'Lesson 3: Booking Lessons (حجز الدروس الرياضية)', 'start': 34, 'end': 35},
                {'title': 'Lesson 4: How Often? & Using Used to', 'start': 36, 'end': 37},
                {'title': 'Lesson 5: Sports Days (يوم الرياضة والمسابقات)', 'start': 38, 'end': 39},
                {'title': 'Unit 3 Round up & Story Time: The Football Match', 'start': 40, 'end': 42}
            ]
        },
        {
            'title': 'الوحدة 4: المراجعة الشاملة 1 (Unit 4: Review 1)',
            'start_page': 43,
            'end_page': 48,
            'lessons': [
                {'title': 'Review: Reading & Listening Skills', 'start': 43, 'end': 45},
                {'title': 'Review: Speaking, Writing & Grammar Consolidation', 'start': 46, 'end': 48}
            ]
        },
        {
            'title': 'الوحدة 5: تلقي وإرسال المعلومات (Unit 5: Getting & Sending Info)',
            'start_page': 49,
            'end_page': 60,
            'lessons': [
                {'title': 'Lesson 1: History of Communication (تاريخ وسائل الاتصال)', 'start': 49, 'end': 50},
                {'title': 'Lesson 2: Telephone Calls & Passive Voice (المبني للمجهول)', 'start': 51, 'end': 53},
                {'title': 'Lesson 3: Satellites and the Internet (الأقمار الصناعية والإنترنت)', 'start': 54, 'end': 56},
                {'title': 'Story Time: Jad and Johnny - The Gondola Trip', 'start': 57, 'end': 58},
                {'title': 'Project 3: A Chat Forum', 'start': 59, 'end': 60}
            ]
        },
        {
            'title': 'الوحدة 6: المهن والوظائف (Unit 6: Jobs and Occupations)',
            'start_page': 61,
            'end_page': 70,
            'lessons': [
                {'title': 'Lesson 1: What is my job? (المهن والمسارات الوظيفية)', 'start': 61, 'end': 62},
                {'title': 'Lesson 2: Future Plans with (be going to)', 'start': 63, 'end': 65},
                {'title': 'Lesson 3: Good at / Not good at + V-ing', 'start': 66, 'end': 68},
                {'title': 'Story Time: Jad and Johnny - The Alps', 'start': 69, 'end': 70}
            ]
        },
        {
            'title': 'الوحدة 7: العالم من حولنا والبيئة (Unit 7: The World Around Us)',
            'start_page': 71,
            'end_page': 84,
            'lessons': [
                {'title': 'Lesson 1: World Problems (مشاكل التلوث والبيئة)', 'start': 71, 'end': 73},
                {'title': "Lesson 2: Rules with (must / mustn't & should / shouldn't)", 'start': 74, 'end': 76},
                {'title': 'Lesson 3: Possibility with (may and might)', 'start': 77, 'end': 79},
                {'title': 'Story Time: Jad and Johnny - The Eiffel Tower', 'start': 80, 'end': 82},
                {'title': 'Project 4: Recycling at Home', 'start': 83, 'end': 84}
            ]
        },
        {
            'title': 'الوحدة 8: المراجعة الشاملة 2 (Unit 8: Review 2)',
            'start_page': 85,
            'end_page': 88,
            'lessons': [
                {'title': 'Unit 8: Final Review & Strategy Practice', 'start': 85, 'end': 88}
            ]
        },
        {
            'title': 'نصوص الاستماع والمحادثة (Listening Transcripts)',
            'start_page': 89,
            'end_page': 109,
            'lessons': [
                {'title': 'Listening Transcripts: Units 1 - 4', 'start': 89, 'end': 98},
                {'title': 'Listening Transcripts: Units 5 - 8', 'start': 99, 'end': 109}
            ]
        },
        {
            'title': 'المرجع الشامل للقواعد والوظائف اللغوية (Grammar & Functions)',
            'start_page': 110,
            'end_page': 120,
            'lessons': [
                {'title': "Grammar Unit 1: Possessive 's', For/Since, Likes & Relatives", 'start': 110, 'end': 111},
                {'title': "Grammar Unit 2: Giving Advice (should/shouldn't), Common Ailments", 'start': 112, 'end': 113},
                {'title': 'Grammar Unit 3: Sports Verbs (do/go/play), Used to', 'start': 114, 'end': 114},
                {'title': 'Grammar Unit 5: Active & Passive Voice, Passive with Can', 'start': 115, 'end': 117},
                {'title': 'Grammar Unit 6: Future with (be going to), Good at + V-ing', 'start': 118, 'end': 118},
                {'title': "Grammar Unit 7: Must / Mustn't vs Should, May & Might", 'start': 119, 'end': 120}
            ]
        }
    ]

    for curr_id in [2, 3]:
        cur.execute('DELETE FROM lessons WHERE curriculum_id=?', (curr_id,))
        cur.execute('DELETE FROM chapters WHERE curriculum_id=?', (curr_id,))
        
        chap_order = 1
        for u in units_def:
            cur.execute(
                'INSERT INTO chapters (curriculum_id, title, order_index, description) VALUES (?, ?, ?, ?)',
                (curr_id, u['title'], chap_order, f"صفحات {u['start_page']} - {u['end_page']}")
            )
            chap_id = cur.lastrowid
            chap_order += 1
            
            les_order = 1
            for l in u['lessons']:
                cur.execute(
                    'INSERT INTO lessons (chapter_id, curriculum_id, title, order_index, summary) VALUES (?, ?, ?, ?, ?)',
                    (chap_id, curr_id, l['title'], les_order, f"صفحة {l['start']} - {l['end']}")
                )
                les_id = cur.lastrowid
                les_order += 1
                
                # Assign content chunks
                cur.execute(
                    'UPDATE content_chunks SET chapter_id=?, lesson_id=? WHERE curriculum_id=? AND page_number >= ? AND page_number <= ?',
                    (chap_id, les_id, curr_id, l['start'], l['end'])
                )
    
    conn.commit()
    print('Curriculum structure re-organized successfully!')
    
    for curr_id in [2, 3]:
        cur.execute('SELECT count(*) FROM chapters WHERE curriculum_id=?', (curr_id,))
        c_count = cur.fetchone()[0]
        cur.execute('SELECT count(*) FROM lessons WHERE curriculum_id=?', (curr_id,))
        l_count = cur.fetchone()[0]
        cur.execute('SELECT count(*) FROM content_chunks WHERE curriculum_id=? AND lesson_id IS NOT NULL', (curr_id,))
        ch_count = cur.fetchone()[0]
        print(f'Curr {curr_id}: {c_count} chapters, {l_count} lessons, {ch_count} chunks linked!')

if __name__ == '__main__':
    clean_structure()
