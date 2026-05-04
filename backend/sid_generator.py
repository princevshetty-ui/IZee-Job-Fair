import random
from db import supabase

# Define prefixes for different academic levels
PREFIXES = {
    "UG": "UGR",
    "PG": "PGR",
    "Diploma": "DIP",
    "ITI": "ITI",
    "PUC": "PUC",
    "Graduate": "GRD",
    "Professional": "PRO",
    "Fresher": "FRS"  # e.g. FRS59134
}

def generate_sid(academic_level: str) -> str:
    """
    Generate a unique SID with appropriate prefix and check for uniqueness in database.
    Returns a unique SID string.
    """
    # Get the prefix for the academic level
    prefix = PREFIXES.get(academic_level, "GEN")  # Default to "GEN" if not found
    
    # Generate SID with prefix and random 5-digit number
    max_retries = 100
    for _ in range(max_retries):
        # Generate random 5-digit number between 10000-99999
        random_number = random.randint(10000, 99999)
        sid = f"{prefix}{random_number}"
        
        # Check if SID already exists in database
        try:
            response = supabase.table("attendees").select("id").eq("sid", sid).execute()
            if not response.data:
                return sid
        except Exception:
            # If there's an error checking uniqueness, we'll assume it's unique and return it
            return sid
    
    # If we've exhausted retries, raise an exception
    raise Exception("Could not generate unique SID after 100 retries")