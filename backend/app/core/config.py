import os
import logging
from typing import List

logger = logging.getLogger("explore_udgir.config")

# Automatically load .env if present (checks backend/.env, root .env, or current working directory)
def _load_env_files():
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    current_dir = os.path.dirname(os.path.abspath(__file__))      # backend/app/core
    backend_dir = os.path.dirname(os.path.dirname(current_dir))  # backend
    root_dir = os.path.dirname(backend_dir)                      # project root

    candidates = [
        os.path.join(backend_dir, ".env"),
        os.path.join(root_dir, ".env"),
        os.path.join(os.getcwd(), ".env")
    ]
    for candidate in candidates:
        if os.path.isfile(candidate):
            load_dotenv(dotenv_path=candidate, override=False)
            break

_load_env_files()

def parse_cors_origins(raw: str | None) -> List[str]:
    default_dev_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    if not raw:
        return default_dev_origins

    raw = raw.strip()
    origins = []
    if raw.startswith("[") and raw.endswith("]"):
        try:
            import json
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                origins = [str(item).strip() for item in parsed if item]
        except Exception:
            origins = []

    if not origins:
        origins = [item.strip() for item in raw.split(",") if item.strip()]

    # Security requirement: remove wildcard '*' when credentials are used
    origins = [orig for orig in origins if orig != "*"]
    return origins if origins else default_dev_origins

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Explore Udgir Tourism API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", os.getenv("ENV", "development")).lower()

    # Database: SQLite fallback for local dev, PostgreSQL supported via DATABASE_URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./explore_udgir.db")

    # Security & JWT Token Settings
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24)))

    # Admin Credentials for Initial Bootstrap
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@exploreudgir.in")

    def __init__(self):
        # 1. SECRET_KEY Handling:
        # Never use an insecure hardcoded fallback in production mode.
        env_secret = os.getenv("SECRET_KEY")
        if self.ENVIRONMENT in ("production", "prod"):
            if not env_secret or not env_secret.strip():
                raise RuntimeError(
                    "CRITICAL SECURITY CONFIGURATION ERROR: "
                    "SECRET_KEY environment variable must be set in production mode. "
                    "Refusing to start with insecure or missing secret key."
                )
            self.SECRET_KEY = env_secret.strip()
        else:
            if env_secret and env_secret.strip():
                self.SECRET_KEY = env_secret.strip()
            else:
                # Local development / test fallback only. Never used in production.
                self.SECRET_KEY = "dev_insecure_secret_key_local_development_only"
                logger.warning(
                    "No SECRET_KEY set in environment. "
                    "Using local development fallback key. "
                    "Never use this in production!"
                )

        # 2. ADMIN_PASSWORD Handling:
        # In production, require environment configuration and remove default password.
        env_admin_pw = os.getenv("ADMIN_PASSWORD")
        if self.ENVIRONMENT in ("production", "prod"):
            self.ADMIN_PASSWORD = env_admin_pw.strip() if env_admin_pw else ""
        else:
            self.ADMIN_PASSWORD = env_admin_pw.strip() if env_admin_pw else "UdgirAdmin#2025"

        # 3. CORS Origins:
        # Strip wildcard '*' and load allowed origins from environment or local dev defaults.
        raw_cors = os.getenv("CORS_ORIGINS")
        self.CORS_ORIGINS: List[str] = parse_cors_origins(raw_cors)

settings = Settings()
