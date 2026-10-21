import os
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.app.config import settings
from backend.app.database import Base
from backend.app.models import (
    Admin, Course, Application, Student,
    ClassSchedule, QuranSurah, QuranAyah,
    Kalima, MasnoonDua, AuditLog
)

sqlite_path = ROOT_DIR / "database" / "alhadi_academy.db"
if sqlite_path.exists():
    sqlite_path.unlink()

mysql_engine = create_engine(settings.database_url)
sqlite_engine = create_engine(f"sqlite:///{sqlite_path}")

Base.metadata.create_all(bind=sqlite_engine)

MysqlSession = sessionmaker(bind=mysql_engine)
SqliteSession = sessionmaker(bind=sqlite_engine)

models_order = [
    Admin,
    Course,
    QuranSurah,
    QuranAyah,
    Kalima,
    MasnoonDua,
    Application,
    Student,
    ClassSchedule,
    AuditLog
]

mysql_db = MysqlSession()
sqlite_db = SqliteSession()

print("Starting export from MySQL to SQLite...")
try:
    for model in models_order:
        items = mysql_db.query(model).all()
        count = len(items)
        for item in items:
            data = {c.name: getattr(item, c.name) for c in model.__table__.columns}
            new_item = model(**data)
            sqlite_db.add(new_item)
        sqlite_db.commit()
        print(f"Exported {model.__tablename__}: {count} records")

    print(f"Export completed successfully to {sqlite_path}")
except Exception as e:
    sqlite_db.rollback()
    print(f"Error during export: {e}")
    raise
finally:
    mysql_db.close()
    sqlite_db.close()
