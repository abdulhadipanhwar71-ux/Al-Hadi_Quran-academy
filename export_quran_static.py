import sqlite3
import json
import os

out_dir = os.path.join("frontend", "public", "quran")
os.makedirs(out_dir, exist_ok=True)

conn = sqlite3.connect(os.path.join("database", "alhadi_academy.db"))
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Export Surahs list
cur.execute("SELECT surah_number, name_arabic, name_english, english_meaning, total_ayahs, revelation_type FROM quran_surahs ORDER BY surah_number")
surahs = [dict(r) for r in cur.fetchall()]
with open(os.path.join(out_dir, "surahs.json"), "w", encoding="utf-8") as f:
    json.dump(surahs, f, ensure_ascii=False, indent=2)
print(f"Exported {len(surahs)} surahs to {out_dir}/surahs.json")

# Export Ayahs by Surah
cur.execute("SELECT id, surah_number, ayah_number_in_surah, global_ayah_number, juz, manzil, page, ruku, sajda, text_arabic, text_urdu, text_english, audio_url FROM quran_ayahs ORDER BY surah_number, ayah_number_in_surah")
all_ayahs = cur.fetchall()

ayahs_by_surah = {}
for r in all_ayahs:
    d = dict(r)
    d["sajda"] = bool(d["sajda"])
    s_num = d["surah_number"]
    if s_num not in ayahs_by_surah:
        ayahs_by_surah[s_num] = []
    ayahs_by_surah[s_num].append(d)

for s_num, s_list in ayahs_by_surah.items():
    file_path = os.path.join(out_dir, f"{s_num}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(s_list, f, ensure_ascii=False)

print(f"Successfully exported all {len(ayahs_by_surah)} Surahs with {len(all_ayahs)} Ayahs to {out_dir}!")
conn.close()
