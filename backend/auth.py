from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Reads JWT_SECRET first, falls back to SUPABASE_JWT_SECRET for compatibility
JWT_SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SUPABASE_JWT_SECRET")

# Create OAuth2 password bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

# Reusable password functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

# JWT token functions
def create_token(email: str, role: str = "admin") -> str:
    """Create JWT token for admin user"""
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {
        "sub": email,
        "role": role,
        "exp": expire
    }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")

def create_volunteer_token(roll_number: str, volunteer_id: str) -> str:
    """Create JWT token for volunteer user"""
    expire = datetime.utcnow() + timedelta(hours=12)
    to_encode = {
        "sub": roll_number,
        "role": "volunteer",
        "volunteer_id": volunteer_id,
        "exp": expire
    }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")

# Admin authentication functions
def get_current_admin(token: str = Depends(oauth2_scheme)):
    """Get current admin from token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials or insufficient permissions"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def get_current_volunteer(token: str = Depends(oauth2_scheme)):
    """Get current volunteer from token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "volunteer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials or insufficient permissions"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )