import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Path to root .env file
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_NAME: str = "Al-Hadi Online Quran Academy"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    SECRET_KEY: str = "alhadi_academy_secret_key_default_2026_abdul_hadi"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000"

    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "1234"
    MYSQL_DATABASE: str = "alhadi_academy_db"
    MYSQL_TEST_DATABASE: str = "alhadi_academy_test_db"

    ADMIN_USERNAME: str = "abdulhadi"
    ADMIN_EMAIL: str = "abdulhadipanhwar71@gmail.com"
    ADMIN_DISPLAY_NAME: str = "Abdul Hadi"

    # Owner Verified Contact Details
    WHATSAPP_NUMBER: str = "923282885660"
    CONTACT_EMAIL: str = "abdulhadipanhwar71@gmail.com"
    ADMIN_NOTIFICATION_EMAIL: str = "abdulhadipanhwar71@gmail.com"

    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH) if ENV_PATH.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def database_url(self) -> str:
        env_url = os.getenv("DATABASE_URL")
        if env_url and env_url.strip():
            return env_url.strip()
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}?charset=utf8mb4"

    @property
    def test_database_url(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_TEST_DATABASE}?charset=utf8mb4"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

settings = Settings()
