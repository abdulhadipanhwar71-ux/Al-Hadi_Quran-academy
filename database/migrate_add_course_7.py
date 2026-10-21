import pymysql

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='1234',
    port=3306,
    database='alhadi_academy_db',
    charset='utf8mb4'
)
cur = conn.cursor()

# Check if course 7 exists
cur.execute("SELECT id FROM courses WHERE code = 'hadith-studies';")
row = cur.fetchone()
if not row:
    cur.execute("""
        INSERT INTO courses (
            code, title_en, title_ur, description_en, description_ur,
            level_en, level_ur, target_audience_en, target_audience_ur,
            is_active, display_order
        )
        VALUES (
            'hadith-studies',
            'Hadith Studies, Translation, and Memorization',
            'مطالعۂ حدیث، ترجمہ اور حفظِ احادیث',
            'Study selected authentic Hadith of the Prophet Muhammad ﷺ with word-by-word translation, core prophetic teachings, character building, and short Hadith memorization.',
            'پیارے نبی کریم ﷺ کی منتخب احادیث مبارکہ کا مطالعہ، لفظی و بامحاورہ ترجمہ، اخلاقی و عملی تربیت اور منتخب احادیث کا حفظ۔',
            'Beginner to Intermediate',
            'ابتدائی تا متوسط',
            'Children & Adults (Boys & Girls)',
            'بچوں اور بڑوں کے لیے',
            1,
            7
        );
    """)
    print("Course 7 successfully inserted!")
else:
    print("Course 7 already exists.")

# Ensure course 3 is titled 'Quran with Tajweed'
cur.execute("UPDATE courses SET title_en = 'Quran with Tajweed' WHERE code = 'tajweed';")
# Ensure course 2 is titled 'Quran Reading / Nazra'
cur.execute("UPDATE courses SET title_en = 'Quran Reading / Nazra' WHERE code = 'quran-reading';")

conn.commit()

cur.execute("SELECT id, code, title_en, title_ur, display_order FROM courses ORDER BY display_order;")
courses = cur.fetchall()
print(f"Total courses now: {len(courses)}")
for c in courses:
    print(f" - #{c[4]}: {c[2]} ({c[3]}) [code: {c[1]}]")

conn.close()
