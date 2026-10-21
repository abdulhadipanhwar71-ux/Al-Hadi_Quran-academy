from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..models import QuranSurah, QuranAyah

def get_all_surahs(db: Session) -> List[QuranSurah]:
    return db.query(QuranSurah).order_by(QuranSurah.surah_number.asc()).all()

def get_surah_by_number(db: Session, surah_number: int) -> Optional[QuranSurah]:
    return db.query(QuranSurah).filter(QuranSurah.surah_number == surah_number).first()

def get_ayahs_by_surah(
    db: Session,
    surah_number: int,
    offset: int = 0,
    limit: int = 50
) -> Tuple[List[QuranAyah], int]:
    query = db.query(QuranAyah).filter(QuranAyah.surah_number == surah_number)
    total = query.count()
    ayahs = query.order_by(QuranAyah.ayah_number_in_surah.asc()).offset(offset).limit(limit).all()
    return ayahs, total

def search_quran_text(db: Session, query_text: str, limit: int = 30) -> List[QuranAyah]:
    pattern = f"%{query_text}%"
    return db.query(QuranAyah).filter(
        or_(
            QuranAyah.text_arabic.ilike(pattern),
            QuranAyah.text_urdu.ilike(pattern),
            QuranAyah.text_english.ilike(pattern)
        )
    ).limit(limit).all()
