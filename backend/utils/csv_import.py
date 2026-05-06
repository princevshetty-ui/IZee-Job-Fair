_ACADEMIC_MAP = {
    "puc pass": "PUC",
    "puc": "PUC",
    "undergraduate": "UG",
    "ug": "UG",
    "graduate": "Graduate",
    "postgraduate": "PG",
    "post graduate": "PG",
    "pg": "PG",
    "mba": "PG",
    "diploma": "Diploma",
    "iti": "ITI",
}


def normalize_academic_level(value: str) -> str:
    if not value or not value.strip():
        return "UG"
    key = value.strip().lower()
    if key in _ACADEMIC_MAP:
        return _ACADEMIC_MAP[key]
    if "puc" in key:
        return "PUC"
    if "undergraduate" in key:
        return "UG"
    if "postgraduate" in key or "post graduate" in key:
        return "PG"
    if "graduate" in key:
        return "Graduate"
    if "diploma" in key:
        return "Diploma"
    if "iti" in key:
        return "ITI"
    return "UG"


def _s(val) -> str:
    """Strip a value to string, return empty string if None/falsy."""
    return str(val).strip() if val else ""


def map_gforms_row(row_data: dict) -> dict | None:
    """
    Map a CSV row to attendee fields.
    Accepts both Google Forms column names and snake_case DB export column names.
    Returns None only if name, phone, and email are all absent (blank row).
    Missing optional fields default to None; missing academic_level → UG; missing stream → N/A.
    """
    full_name = _s(row_data.get("full_name") or row_data.get("Name") or row_data.get("Full Name"))
    phone = _s(row_data.get("phone") or row_data.get("Contact No") or row_data.get("Phone") or row_data.get("Phone Number"))
    email = _s(row_data.get("email") or row_data.get("Email"))

    # Only skip entirely blank rows
    if not full_name and not phone and not email:
        return None

    college_name = _s(row_data.get("college_name") or row_data.get("College Name") or row_data.get("College")) or None

    # Optional college-contact fields
    principal_name = _s(row_data.get("principal_name") or row_data.get("Principal Name")) or None
    principal_email = _s(row_data.get("principal_email") or row_data.get("Principal email id")) or None
    coordinator_name = _s(row_data.get("coordinator_name") or row_data.get("Name - College Co-ordinator/ Placement Head")) or None
    coordinator_phone = _s(row_data.get("coordinator_phone") or row_data.get("Contact no - College Coordinator/ Placement Head")) or None
    coordinator_email = _s(row_data.get("coordinator_email") or row_data.get("Email - College Coordinator/ Placement Head")) or None

    # Academic level — use direct value if it's a DB export, otherwise normalize from Google Forms label
    raw_level = _s(row_data.get("academic_level") or row_data.get("Academic Details") or row_data.get("Academic Level"))
    academic_level = normalize_academic_level(raw_level)

    # Stream — default N/A if missing
    stream = _s(row_data.get("stream") or row_data.get("Graduation Stream") or row_data.get("Stream")) or "N/A"

    # Auto-upgrade UG→PG for clearly postgraduate streams
    if stream.upper() in {"MCA", "MCOM", "MBA"} and academic_level == "UG":
        academic_level = "PG"

    mba_raw = _s(row_data.get("mba_specialization") or row_data.get("MBA Specialization"))
    mba_specialization = mba_raw if mba_raw else None

    # "I will carry 10 Hard copies of my Resumes" — intentionally ignored

    return {
        "full_name": full_name,
        "phone": phone,
        "email": email,
        "college_name": college_name,
        "principal_name": principal_name,
        "principal_email": principal_email,
        "coordinator_name": coordinator_name,
        "coordinator_phone": coordinator_phone,
        "coordinator_email": coordinator_email,
        "academic_level": academic_level,
        "stream": stream,
        "mba_specialization": mba_specialization,
        "attendee_type": "student",
        "reg_type": "pre",
        "status": "approved",
    }


if __name__ == "__main__":
    tests = [
        {
            "Name": "John Doe",
            "Contact No": "9876543210",
            "Email": "john@example.com",
            "College Name": "Test College",
            "Academic Details": "PUC pass",
            "Graduation Stream": "Science",
        },
        {
            "Name": "Jane Smith",
            "Contact No": "9123456789",
            "Email": "jane@example.com",
            "College Name": "ABC College",
            "Academic Details": "Graduate",
            "Graduation Stream": "",           # missing stream → N/A
            "Principal Name": "Dr. Kumar",
            "Name - College Co-ordinator/ Placement Head": "Mr. Raj",
        },
        {
            "Name": "Bob",
            "Contact No": "9000000000",
            "Email": "bob@example.com",
            "College Name": "XYZ",
            "Academic Details": "",            # missing → UG default
            "Graduation Stream": "",           # missing → N/A
            "I will carry 10 Hard copies of my Resumes": "Yes",  # ignored
        },
    ]
    for t in tests:
        result = map_gforms_row(t)
        print(result)
