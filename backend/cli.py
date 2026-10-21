import sys
import argparse
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.database import SessionLocal
from backend.app.models import Admin, Course, Kalima, MasnoonDua, QuranSurah, QuranAyah
from backend.app.security import hash_password
from backend.app.config import settings

def create_or_update_admin(username: str, password: str, email: str = None, full_name: str = None):
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == username).first()
        pwd_hash = hash_password(password)
        if admin:
            admin.password_hash = pwd_hash
            if email:
                admin.email = email
            if full_name:
                admin.full_name = full_name
            db.commit()
            print(f"Admin '{username}' updated successfully.")
        else:
            admin = Admin(
                username=username,
                email=email or settings.ADMIN_EMAIL,
                password_hash=pwd_hash,
                full_name=full_name or settings.ADMIN_DISPLAY_NAME,
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print(f"Admin '{username}' created successfully.")
    finally:
        db.close()

def check_db_status():
    db = SessionLocal()
    try:
        surah_count = db.query(QuranSurah).count()
        ayah_count = db.query(QuranAyah).count()
        kalima_count = db.query(Kalima).count()
        dua_count = db.query(MasnoonDua).count()
        course_count = db.query(Course).count()
        admin_count = db.query(Admin).count()

        print("=== Database Content Status ===")
        print(f"Quran Surahs: {surah_count} / 114")
        print(f"Quran Ayahs:  {ayah_count} / 6236")
        print(f"Kalimas:      {kalima_count} / 6")
        print(f"Masnoon Duas: {dua_count}")
        print(f"Courses:      {course_count} / 6")
        print(f"Admins:       {admin_count}")
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description="Al-Hadi Online Quran Academy Administration CLI")
    subparsers = parser.add_subparsers(dest="command")

    admin_parser = subparsers.add_parser("create-admin", help="Create or reset administrator password")
    admin_parser.add_argument("--username", default=settings.ADMIN_USERNAME, help="Admin username")
    admin_parser.add_argument("--password", required=True, help="New password for administrator")
    admin_parser.add_argument("--email", default=settings.ADMIN_EMAIL, help="Admin email")
    admin_parser.add_argument("--full-name", default=settings.ADMIN_DISPLAY_NAME, help="Display name")

    subparsers.add_parser("check-db", help="Check database connection and content count")

    args = parser.parse_args()
    if args.command == "create-admin":
        create_or_update_admin(args.username, args.password, args.email, args.full_name)
    elif args.command == "check-db":
        check_db_status()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
