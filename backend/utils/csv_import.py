# Google Forms column mapping
GFORMS_COLUMN_MAPPING = {
    "Timestamp": "timestamp",
    "Full Name": "name",
    "Email": "email",
    "Phone Number": "phone",
    "Academic Level": "academic_level",
    "Stream": "stream",
    "Registration Type": "reg_type",
    "College": "college",
    "Department": "department",
    "Semester": "semester",
    "SID": "sid",
    "Payment Status": "payment_status",
    "Payment ID": "payment_id"
}

def map_gforms_row(row_data):
    """
    Map Google Forms column names to our standard field names
    
    Args:
        row_data (dict): Raw row data from CSV
        
    Returns:
        dict: Mapped row data
    """
    mapped_data = {}
    
    # Map each field according to our mapping
    for gforms_key, standard_key in GFORMS_COLUMN_MAPPING.items():
        if gforms_key in row_data:
            mapped_data[standard_key] = row_data[gforms_key]
    
    # Apply auto-correction logic if needed
    # For example, standardize academic levels
    if "academic_level" in mapped_data:
        academic_level = mapped_data["academic_level"]
        if academic_level:
            # Standardize common variations
            academic_level = academic_level.strip().upper()
            if "UNDERGRAD" in academic_level:
                mapped_data["academic_level"] = "UG"
            elif "POSTGRAD" in academic_level:
                mapped_data["academic_level"] = "PG"
            elif "DIPLOMA" in academic_level:
                mapped_data["academic_level"] = "Diploma"
            elif "ITI" in academic_level:
                mapped_data["academic_level"] = "ITI"
            elif "PUC" in academic_level:
                mapped_data["academic_level"] = "PUC"
    
    # Standardize registration type
    if "reg_type" in mapped_data:
        reg_type = mapped_data["reg_type"]
        if reg_type:
            reg_type = reg_type.strip().upper()
            if "PRE-REG" in reg_type:
                mapped_data["reg_type"] = "PRE-REGISTERED"
            elif "ONSPOT" in reg_type or "ON SPOT" in reg_type:
                mapped_data["reg_type"] = "ON-SPOT"
    
    return mapped_data

if __name__ == "__main__":
    # Test the function
    test_data = {
        "Full Name": "John Doe",
        "Email": "john@example.com",
        "Phone Number": "1234567890",
        "Academic Level": "Undergraduate",
        "Stream": "Computer Science",
        "Registration Type": "Pre-Registered"
    }
    
    result = map_gforms_row(test_data)
    print("CSV import mapping test:")
    print(result)