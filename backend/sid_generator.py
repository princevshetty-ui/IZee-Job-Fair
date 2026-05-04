import re
from db import supabase

PREFIXES = {
    "UG": "UGR",
    "PG": "PGR",
    "Diploma": "DIP",
    "ITI": "ITI",
    "PUC": "PUC",
    "Graduate": "GRD",
    "Professional": "PRO",
    "Fresher": "FRS"
}


def generate_sid(academic_level: str) -> str:
    """
    Generate a sequential SID for the given academic level.

    Queries the DB for the highest existing number under this prefix,
    then returns prefix + (max + 1) zero-padded to at least 3 digits.
    Each prefix has its own independent sequence (UGR001, PGR001, DIP001 …).
    """
    prefix = PREFIXES.get(academic_level, "GEN")

    # Fetch all SIDs that start with this prefix
    response = supabase.table("attendees").select("sid").like("sid", f"{prefix}%").execute()
    existing = response.data or []

    max_num = 0
    for row in existing:
        sid = row.get("sid", "")
        # Extract the numeric suffix after the prefix
        match = re.match(rf"^{re.escape(prefix)}(\d+)$", sid)
        if match:
            max_num = max(max_num, int(match.group(1)))

    next_num = max_num + 1
    # Zero-pad to at least 3 digits; if the sequence grows beyond 3 digits it expands naturally
    return f"{prefix}{next_num:03d}"
