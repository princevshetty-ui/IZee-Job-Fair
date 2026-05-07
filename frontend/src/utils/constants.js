export const ATTENDEE_TYPES = [
  { value: 'student', label: 'Student (Currently Studying)' },
  { value: 'fresher', label: 'Fresher (Recently Graduated)' },
  { value: 'professional', label: 'Working Professional' },
]

export const CITIES = [
  'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Tumkur', 'Others'
]

export const STATES = [
  'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Maharashtra'
]

export const PASSED_OUT_YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i) // 2000 to 2026

export const STUDENT_ACADEMIC_LEVELS = [
  { value: 'UG', label: 'Undergraduate' },
  { value: 'PG', label: 'Postgraduate' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'ITI', label: 'ITI' },
  { value: 'PUC', label: 'PUC Pass' },
  // DB: run ALTER TABLE attendees DROP CONSTRAINT attendees_academic_level_check;
  // ALTER TABLE attendees ADD CONSTRAINT attendees_academic_level_check
  //   CHECK (academic_level IN ('UG','PG','Diploma','ITI','PUC','Graduate','Professional'));
]

export const FRESHER_STREAMS = [
  { value: 'BBA', label: 'BBA' },
  { value: 'BCA', label: 'BCA' },
  { value: 'BCom', label: 'BCom' },
  { value: 'BSc', label: 'BSc' },
  { value: 'BA', label: 'BA' },
  { value: 'MCA', label: 'MCA' },
  { value: 'MCom', label: 'MCom' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MSc', label: 'MSc' },
  { value: 'MA', label: 'MA' },
  { value: 'Others', label: 'Others' },
]

export const ACADEMIC_LEVELS = [
  { value: 'UG', label: 'Undergraduate' },
  { value: 'PG', label: 'Postgraduate' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'ITI', label: 'ITI' },
  { value: 'PUC', label: 'PUC' },
  { value: 'Graduate', label: 'Graduate' }
]

export const UG_STREAMS = [
  { value: 'BBA', label: 'BBA' },
  { value: 'BCA', label: 'BCA' },
  { value: 'BCom', label: 'BCom' },
  { value: 'BSc', label: 'BSc' },
  { value: 'BA', label: 'BA' },
  { value: 'Others', label: 'Others' }
]

export const PG_STREAMS = [
  { value: 'MCA', label: 'MCA' },
  { value: 'MCom', label: 'MCom' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MSc', label: 'MSc' },
  { value: 'MA', label: 'MA' },
  { value: 'Others', label: 'Others' }
]

export const MBA_SPECIALIZATIONS = [
  { value: 'HR', label: 'HR' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Health Care', label: 'Health Care' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Others', label: 'Others' }
]

export const DIPLOMA_STREAMS = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Others', label: 'Others' }
]

export const ITI_STREAMS = [
  { value: 'Fitter', label: 'Fitter' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Mechanic', label: 'Mechanic' },
  { value: 'Welder', label: 'Welder' },
  { value: 'Others', label: 'Others' }
]

export const PUC_STREAMS = [
  { value: 'Science', label: 'Science' },
  { value: 'Commerce', label: 'Commerce' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Others', label: 'Others' }
]

export const getStreamsForLevel = (level) => {
  switch (level) {
    case 'UG':
      return UG_STREAMS
    case 'PG':
      return PG_STREAMS
    case 'Diploma':
      return DIPLOMA_STREAMS
    case 'ITI':
      return ITI_STREAMS
    case 'PUC':
      return PUC_STREAMS
    default:
      return null
  }
}

export const COURSES = [
  { value: 'BCA', label: 'BCA' },
  { value: 'BBA', label: 'BBA' },
  { value: 'BCom', label: 'BCom' },
  { value: 'BSc', label: 'BSc' },
  { value: 'BA', label: 'BA' },
  { value: 'MCA', label: 'MCA' },
  { value: 'MCom', label: 'MCom' },
  { value: 'MBA', label: 'MBA' }
]

export const YEARS = [
  { value: '1st Year', label: '1st Year' },
  { value: '2nd Year', label: '2nd Year' },
  { value: '3rd Year', label: '3rd Year' }
]

export const COMPANIES = [
  "Swiggy", "Sagility Health", "Advaith Hyundai", "Dodla Dairy Limited", "Volkswagen", "Aishwarya groups", "HDB Financial Services", "Avsar HR Services", "TVS Motor Company Limited",
  "Results CX", "Firstsource Solutions", "Bajaj Life Insurance Company", "EMAMI FRANK ROSS", "Magic Bus India Foundation", "Agustya Automobiles Pvt Ltd", "Flipkart",
  "We Rize", "UPANAL CNC SOLTIONS", "LIC JC Road Bangalore", "LIC of India, Residency road branch", "Advaith Hyundai",
  "RiseArka Solutions", "Muthoot Finance", "Paychex", "KS WORLD VENTURES", "Sambhav Foundation",
  "Digital Elite Service", "VST Group", "Vibhinna Events", "Appsndevices Technologies Pvt Ltd", "Pooja ",
  "SPANDANA BRIGHT FUTURE INNOVATION", "Ezy Ventures", "Indian Edu Hub", "Quess Corp",
  "Incubenation", "Founding Years Learning Solutions Pvt. LTD", "MUST Company", "TSI ", "Govianu Wealth Management ",
  "SFJ Business Solutions Private Limited", "Faction Global Infotech pvt ltd", "SPANDANA BRIGHT FUTURE INNOVATION ", "Dynalektric Equipment pvt Itd", "Qualcomm", "Texas Instruments",
  "Grassroots solutions and services", "Faction Global Infotech pvt ltd", "Pratham Motors Pvt Ltd"
]