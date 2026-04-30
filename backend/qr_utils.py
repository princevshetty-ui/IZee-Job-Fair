import qrcode
from PIL import Image
import io
import base64

def generate_qr_image(sid, size=300):
    """
    Generate a QR code image for the given SID.
    
    Args:
        sid (str): The SID to encode in the QR code
        size (int): Size of the QR code image (default: 300)
        
    Returns:
        PIL.Image: QR code image in RGBA format
    """
    # Create QR code instance with high error correction
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    
    # Add SID data to QR code
    qr.add_data(sid)
    qr.make(fit=True)
    
    # Create QR code image
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to RGBA format
    qr_image = qr_image.convert("RGBA")
    
    # Resize to specified size
    qr_image = qr_image.resize((size, size), Image.Resampling.LANCZOS)
    
    return qr_image

if __name__ == "__main__":
    # Test the function
    test_sid = "JF26-UG24-00001"
    img = generate_qr_image(test_sid)
    print(f"Generated QR code for {test_sid}")
    print(f"Image size: {img.size}")
    print(f"Image mode: {img.mode}")