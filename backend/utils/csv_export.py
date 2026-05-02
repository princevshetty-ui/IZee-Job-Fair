import csv
import zipfile
from typing import List, Dict
from io import StringIO, BytesIO


HEADERS = [
    "SID", "Full Name", "Email", "Phone", "College Name",
    "Academic Level", "Stream", "Attendee Type", "MBA Specialization",
    "Company Name", "Designation", "Experience Years",
    "Registration Type", "Status", "Attended", "Attended At", "Created At"
]


def _row(attendee: Dict) -> Dict:
    """Map an attendee record to a CSV row dict."""
    return {
        "SID": attendee.get("sid", ""),
        "Full Name": attendee.get("full_name", ""),
        "Email": attendee.get("email", ""),
        "Phone": attendee.get("phone", ""),
        "College Name": attendee.get("college_name", ""),
        "Academic Level": attendee.get("academic_level", ""),
        "Stream": attendee.get("stream", ""),
        "Attendee Type": attendee.get("attendee_type", ""),
        "MBA Specialization": attendee.get("mba_specialization", ""),
        "Company Name": attendee.get("company_name", ""),
        "Designation": attendee.get("designation", ""),
        "Experience Years": attendee.get("experience_years", ""),
        "Registration Type": attendee.get("reg_type", ""),
        "Status": attendee.get("status", ""),
        "Attended": "Yes" if attendee.get("attended") else "No",
        "Attended At": attendee.get("attended_at", "") or "",
        "Created At": attendee.get("created_at", "") or ""
    }


def _write_csv(attendees: List[Dict]) -> str:
    """Write a list of attendees to CSV string."""
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=HEADERS)
    writer.writeheader()
    for a in attendees:
        writer.writerow(_row(a))
    result = output.getvalue()
    output.close()
    return result


def export_attendees_csv(attendees: List[Dict], export_type: str = "all") -> str:
    """
    Simple flat CSV export (legacy — used by /export/all and /export/attended).
    """
    return _write_csv(attendees)


def export_pre_register_zip(attendees: List[Dict]) -> bytes:
    """
    Export pre-registered attendees as a ZIP containing separate CSVs:
      - Students.csv       (attendee_type == 'student')
      - Professionals.csv  (attendee_type == 'professional')
      - Freshers.csv       (attendee_type == 'fresher')
      - All_Pre_Registered.csv (everything)

    Returns bytes (ZIP file content).
    """
    students = [a for a in attendees if (a.get("attendee_type") or "").lower() == "student"]
    professionals = [a for a in attendees if (a.get("attendee_type") or "").lower() == "professional"]
    freshers = [a for a in attendees if (a.get("attendee_type") or "").lower() == "fresher"]

    buf = BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("All_Pre_Registered.csv", _write_csv(attendees))
        if students:
            zf.writestr("Students.csv", _write_csv(students))
        if professionals:
            zf.writestr("Professionals.csv", _write_csv(professionals))
        if freshers:
            zf.writestr("Freshers.csv", _write_csv(freshers))

    return buf.getvalue()


def export_onspot_csv(attendees: List[Dict]) -> str:
    """
    Export on-spot registrations as a single CSV.
    """
    return _write_csv(attendees)


if __name__ == "__main__":
    test = [
        {"sid": "UGR12345", "full_name": "Alice", "attendee_type": "student", "reg_type": "pre", "status": "approved"},
        {"sid": "PRO54321", "full_name": "Bob", "attendee_type": "professional", "reg_type": "pre", "status": "approved"},
        {"sid": "UGR99999", "full_name": "Charlie", "attendee_type": "fresher", "reg_type": "pre", "status": "approved"},
    ]
    z = export_pre_register_zip(test)
    print(f"ZIP size: {len(z)} bytes")
    print(f"CSV export: {len(export_onspot_csv(test))} chars")
    print("All exports OK")