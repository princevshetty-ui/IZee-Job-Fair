import re

def validate_phone(phone: str) -> bool:
    """
    Validate phone number format
    
    Args:
        phone (str): Phone number to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    # Basic phone validation (10 digits)
    if not phone:
        return False
    
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    
    # Check if it's exactly 10 digits
    return len(digits_only) == 10

def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email (str): Email to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not email:
        return False
    
    # Basic email validation pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

if __name__ == "__main__":
    # Test the functions
    print("Phone validation tests:")
    print(f"Valid phone '1234567890': {validate_phone('1234567890')}")
    print(f"Invalid phone '123': {validate_phone('123')}")
    
    print("\nEmail validation tests:")
    print(f"Valid email 'test@example.com': {validate_email('test@example.com')}")
    print(f"Invalid email 'invalid.email': {validate_email('invalid.email')}")