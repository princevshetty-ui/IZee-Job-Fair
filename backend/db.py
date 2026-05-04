import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY must be the service_role key (bypasses RLS).
# The Supabase dashboard may label it "deprecated" — that is a UI naming change only;
# the key itself is valid and correct. Do not swap it for the anon key.
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create the Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Supabase SQL to run in the SQL editor ---
#
# ALTER TABLE attendees DROP CONSTRAINT IF EXISTS attendees_attendee_type_check;
# ALTER TABLE attendees ADD CONSTRAINT attendees_attendee_type_check
#   CHECK (attendee_type IN ('student', 'professional', 'fresher'));
#
# Fix 3 — PUC added back to academic level options:
# ALTER TABLE attendees DROP CONSTRAINT IF EXISTS attendees_academic_level_check;
# ALTER TABLE attendees ADD CONSTRAINT attendees_academic_level_check
#   CHECK (academic_level IN ('UG', 'PG', 'Diploma', 'ITI', 'PUC', 'Graduate', 'Professional'));
#
# Fix 4 — city stored separately from college_name:
# ALTER TABLE attendees ADD COLUMN IF NOT EXISTS city TEXT;