def normalize_academic_level(value: str) -> str:
    if not value:
        return ""

    normalized = value.strip().lower()
    if "puc" in normalized:
        return "PUC"
    if "undergraduate" in normalized:
        return "UG"
    if "postgraduate" in normalized or "post graduate" in normalized or normalized == "pg":
        return "PG"
    if "graduate" in normalized:
        return "Graduate"
    if "diploma" in normalized:
        return "Diploma"
    if "iti" in normalized:
        return "ITI"
    return value.strip()

def map_gforms_row(row_data):
    """Map Google Forms CSV row to attendee fields."""
    name = row_data.get("Name") or row_data.get("Full Name")
    phone = row_data.get("Contact No") or row_data.get("Phone") or row_data.get("Phone Number")
    email = row_data.get("Email")
    college = row_data.get("College Name") or row_data.get("College")
    academic_raw = row_data.get("Academic Details") or row_data.get("Academic Level")
    stream = row_data.get("Graduation Stream") or row_data.get("Stream")
    mba_specialization = row_data.get("MBA Specialization")

    academic_level = normalize_academic_level(academic_raw)

    if stream and stream.strip().upper() in {"MCA", "MCOM", "MBA"} and academic_level == "UG":
        academic_level = "PG"

    if not all([name, phone, email, college, academic_level, stream]):
        return None

    return {
        "full_name": name.strip(),
        "phone": str(phone).strip(),
        "email": email.strip(),
        "college_name": college.strip(),
        "academic_level": academic_level,
        "stream": stream.strip(),
        "mba_specialization": mba_specialization.strip() if mba_specialization else None,
        "attendee_type": "student",
        "reg_type": "pre",
        "status": "approved"
    }

if __name__ == "__main__":
    # Test the function
    test_data = {
        "Name": "John Doe",
        "Contact No": "1234567890",
        "Email": "john@example.com",
        "Academic Details": "Undergraduate",
        "Graduation Stream": "BCA",
        "College Name": "Test College"
    }
    
    result = map_gforms_row(test_data)
    print("CSV import mapping test:")
    print(result)