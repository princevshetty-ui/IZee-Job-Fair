import csv
from typing import List, Dict
from io import StringIO

def export_attendees_csv(attendees: List[Dict], export_type: str = "all"):
    """
    Generate CSV for attendees export
    
    Args:
        attendees (list): List of attendee dictionaries
        export_type (str): Type of export ("all" or "attended")
        
    Returns:
        str: CSV content as string
    """
    # Define CSV headers
    headers = [
        "SID",
        "Full Name",
        "Email",
        "Phone",
        "College Name",
        "Academic Level",
        "Stream",
        "Attendee Type",
        "Registration Type",
        "Status",
        "Attended",
        "Attended At",
        "Created At"
    ]
    
    # Create CSV content in memory
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    
    # Write attendee data
    for attendee in attendees:
        row = {
            "SID": attendee.get("sid", ""),
            "Full Name": attendee.get("full_name", ""),
            "Email": attendee.get("email", ""),
            "Phone": attendee.get("phone", ""),
            "College Name": attendee.get("college_name", ""),
            "Academic Level": attendee.get("academic_level", ""),
            "Stream": attendee.get("stream", ""),
            "Attendee Type": attendee.get("attendee_type", ""),
            "Registration Type": attendee.get("reg_type", ""),
            "Status": attendee.get("status", ""),
            "Attended": attendee.get("attended", False),
            "Attended At": attendee.get("attended_at", ""),
            "Created At": attendee.get("created_at", "")
        }
            
        writer.writerow(row)
    
    # Get the CSV content
    csv_content = output.getvalue()
    output.close()
    
    return csv_content

if __name__ == "__main__":
    # Test the function
    test_attendees = [
        {
            "sid": "UGR12345",
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "college_name": "Test College",
            "academic_level": "UG",
            "stream": "BCA",
            "attendee_type": "student",
            "reg_type": "pre",
            "status": "approved",
            "attended": False,
            "created_at": "2026-05-01T10:00:00Z"
        }
    ]
    
    csv_result = export_attendees_csv(test_attendees)
    print("CSV export test successful")
    print(f"Generated CSV length: {len(csv_result)} characters")