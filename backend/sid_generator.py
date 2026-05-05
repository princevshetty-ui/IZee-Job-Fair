def generate_sid(attendee_type: str, academic_level: str, supabase) -> str:
    prefix_map = {
        ('student', 'UG'): 'UGR', ('student', 'PG'): 'PGR',
        ('student', 'Diploma'): 'DIP', ('student', 'ITI'): 'ITI',
        ('student', 'PUC'): 'PUC', ('student', 'Graduate'): 'GRD',
        ('fresher', None): 'FRS', ('professional', None): 'PRO',
    }
    key = (attendee_type, academic_level) if attendee_type == 'student' else (attendee_type, None)
    prefix = prefix_map.get(key, 'REG')
    result = supabase.table('attendees').select('sid').like('sid', f'{prefix}%').order('sid', desc=True).limit(1).execute()
    if result.data:
        last = result.data[0]['sid']
        num = int(last[len(prefix):]) + 1
    else:
        num = 1
    return f"{prefix}{str(num).zfill(5)}"
