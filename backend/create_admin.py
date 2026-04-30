import sys
import os
from passlib.context import CryptContext
from db import supabase

def create_admin(email, password):
    # Hash the password
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash(password)
    
    # Insert into admin_users table
    admin_data = {
        "email": email,
        "password": hashed_password
    }
    
    try:
        response = supabase.table("admin_users").insert(admin_data).execute()
        if response.data:
            print("Admin user created successfully")
            return True
        else:
            print("Failed to create admin user")
            return False
    except Exception as e:
        print(f"Error creating admin user: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    
    if create_admin(email, password):
        print("Admin user created successfully")
    else:
        print("Failed to create admin user")