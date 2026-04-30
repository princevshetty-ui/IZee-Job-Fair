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
        "SID", "Name", "Email", "Phone", "Academic Level", 
        "Stream", "College", "Department", "Registration Type", 
        "Payment Status", "Payment ID"
    ]
    
    if export_type == "attended":
        headers.append("Attendance Time")
    
    # Create CSV content in memory
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    
    # Write attendee data
    for attendee in attendees:
        row = {
            "SID": attendee.get("sid", ""),
            "Name": attendee.get("name", ""),
            "Email": attendee.get("email", ""),
            "Phone": attendee.get("phone", ""),
            "Academic Level": attendee.get("academic_level", ""),
            "Stream": attendee.get("stream", ""),
            "College": attendee.get("college", ""),
            "Department": attendee.get("department", ""),
            "Registration Type": attendee.get("reg_type", ""),
            "Payment Status": attendee.get("payment_status", ""),
            "Payment ID": attendee.get("payment_id", "")
        }
        
        if export_type == "attended":
            row["Attendance Time"] = attendee.get("attendance_time", "")
            
        writer.writerow(row)
    
    # Get the CSV content
    csv_content = output.getvalue()
    output.close()
    
    return csv_content

if __name__ == "__main__":
    # Test the function
    test_attendees = [
        {
            "sid": "JF26-UG24-00001",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "academic_level": "UG",
            "stream": "Computer Science",
            "college": "Test College",
            "department": "CS",
            "reg_type": "PRE-REGISTERED",
            "payment_status": "PAID",
            "payment_id": "PAY123"
        }
    ]
    
    csv_result = export_attendees_csv(test_attendees)
    print("CSV export test successful")
    print(f"Generated CSV length: {len(csv_result)} characters")