import sqlite3
import json

conn = sqlite3.connect('storage/database.sqlite3')
cur = conn.cursor()

# Get chapters for curr 3
cur.execute('SELECT id, title, order_index, description FROM chapters WHERE curriculum_id=3 ORDER BY order_index')
chapters = []
for c_row in cur.fetchall():
    c_id, c_title, c_order, c_desc = c_row
    cur.execute('SELECT id, title, order_index, summary FROM lessons WHERE chapter_id=? ORDER BY order_index', (c_id,))
    lessons = []
    for l_row in cur.fetchall():
        l_id, l_title, l_order, l_summary = l_row
        cur.execute('SELECT id, page_number, heading, content_text FROM content_chunks WHERE lesson_id=? ORDER BY page_number, paragraph_index', (l_id,))
        chunks = []
        for ch_row in cur.fetchall():
            chunks.append({
                'id': ch_row[0],
                'page': ch_row[1],
                'heading': ch_row[2],
                'text': ch_row[3]
            })
        lessons.append({
            'id': l_id,
            'title': l_title,
            'summary': l_summary,
            'chunks': chunks
        })
    chapters.append({
        'id': c_id,
        'title': c_title,
        'description': c_desc,
        'lessons': lessons
    })

print(f'Chapters count: {len(chapters)}')
total_chunks = sum(len(l['chunks']) for c in chapters for l in c['lessons'])
print(f'Total chunks captured: {total_chunks}')
with open('storage/curriculum_3_exported.json', 'w', encoding='utf-8') as f:
    json.dump(chapters, f, ensure_ascii=False, indent=2)
print('Saved to storage/curriculum_3_exported.json')
