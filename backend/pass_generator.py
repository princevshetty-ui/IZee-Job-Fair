import os
from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Academic level display mapping
ACADEMIC_DISPLAY = {
    "UG": "UNDERGRADUATE",
    "PG": "POSTGRADUATE",
    "Diploma": "DIPLOMA",
    "ITI": "ITI",
    "PUC": "PUC PASS",
    "Graduate": "GRADUATE",
    "Professional": "WORKING PROFESSIONAL"
}

# Color constants
GOLD_COLOR = "#D4AF37"
GREEN_COLOR = "#22c55e"  # PRE-REGISTERED
RED_COLOR = "#ef4444"     # ON-SPOT

# Coordinate constants (will be adjusted with real template)
NAME_POSITION = (100, 200)
STREAM_POSITION = (100, 250)
SID_POSITION = (100, 300)
ACADEMIC_BADGE_POSITION = (100, 150)
REG_TYPE_BADGE_POSITION = (300, 150)
QR_POSITION = (100, 350)

def generate_pass(academic_level, full_name, stream, sid, reg_type, template_path=None):
    """
    Generate a job fair pass image with the provided details.
    
    Args:
        academic_level (str): Academic level of the attendee
        full_name (str): Full name of the attendee
        stream (str): Stream of the attendee
        sid (str): SID of the attendee
        reg_type (str): Registration type ("PRE-REGISTERED" or "ON-SPOT")
        template_path (str): Path to the template image
        
    Returns:
        str: Base64 encoded JPEG image
    """
    try:
        # Resolve template path relative to this file if not provided
        if template_path is None:
            template_path = os.path.join(BASE_DIR, "assets", "templates", "jobfair_template.png")

        # Load template
        if os.path.exists(template_path):
            template = Image.open(template_path).convert("RGBA")
        else:
            # Create a blank template if file doesn't exist
            template = Image.new("RGBA", (500, 600), (255, 255, 255, 255))
        
        # Create a copy to work with
        pass_image = template.copy()
        
        # Get academic level display text
        academic_text = ACADEMIC_DISPLAY.get(academic_level, academic_level)
        
        # Create drawing context
        draw = ImageDraw.Draw(pass_image)
        
        # Try to load a font, fallback to default if not found
        try:
            # Use bundled DejaVuSans fonts (available on all platforms)
            bold_font_path = os.path.join(BASE_DIR, "assets", "fonts", "DejaVuSans-Bold.ttf")
            regular_font_path = os.path.join(BASE_DIR, "assets", "fonts", "DejaVuSans.ttf")
            font = ImageFont.truetype(bold_font_path, 20)
            small_font = ImageFont.truetype(regular_font_path, 16)
        except OSError as font_err:
            # Fallback to default font
            print(f"Warning: could not load DejaVuSans fonts ({font_err}), using bitmap default")
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        # Add academic level badge
        draw.text(ACADEMIC_BADGE_POSITION, academic_text, fill=(0, 0, 0), font=font)
        
        # Add full name (auto-shrink if needed)
        name_font = font
        name_width = draw.textlength(full_name, font=name_font)
        # Simple approach to handle long names - could be improved with better text wrapping
        draw.text(NAME_POSITION, full_name, fill=(0, 0, 0), font=name_font)
        
        # Add stream
        draw.text(STREAM_POSITION, stream, fill=(0, 0, 0), font=font)
        
        # Add SID in gold color
        draw.text(SID_POSITION, sid, fill=GOLD_COLOR, font=font)
        
        # Add registration type badge
        reg_color = GREEN_COLOR if reg_type == "PRE-REGISTERED" else RED_COLOR
        draw.text(REG_TYPE_BADGE_POSITION, reg_type, fill=reg_color, font=font)
        
        # Generate QR code
        from qr_utils import generate_qr_image
        qr_img = generate_qr_image(sid)
        
        # Paste QR code using alpha_composite
        # Create a temporary image for compositing
        qr_x, qr_y = QR_POSITION
        temp = Image.new('RGBA', pass_image.size, (0, 0, 0, 0))
        temp.paste(qr_img, QR_POSITION)
        pass_image = Image.alpha_composite(pass_image, temp)
        
        # Convert to RGB and save as JPEG
        rgb_image = pass_image.convert("RGB")
        
        # Save to bytes
        img_buffer = BytesIO()
        rgb_image.save(img_buffer, format="JPEG", quality=75)
        img_buffer.seek(0)
        
        # Return base64 string
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        return img_str
        
    except Exception as e:
        print(f"Error generating pass: {e}")
        raise

if __name__ == "__main__":
    # Test the function
    try:
        result = generate_pass(
            academic_level="UG",
            full_name="John Doe",
            stream="Computer Science",
            sid="JF26-UG24-00001",
            reg_type="PRE-REGISTERED"
        )
        print("Pass generator test successful")
        print(f"Generated base64 image length: {len(result)}")
    except Exception as e:
        print(f"Pass generator test failed: {e}")