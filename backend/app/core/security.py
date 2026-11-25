import jwt
import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.core.config import settings

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False

def get_password_hash(password: str) -> str:
    if HAS_BCRYPT:
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    else:
        # Fallback salt+sha256 if bcrypt unavailable
        salt = "explore_udgir_static_salt_"
        return "sha256$" + hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith("sha256$"):
        salt = "explore_udgir_static_salt_"
        expected = "sha256$" + hashlib.sha256((salt + plain_password).encode('utf-8')).hexdigest()
        return expected == hashed_password
    
    if HAS_BCRYPT:
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False
    return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
