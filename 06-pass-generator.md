# Job Fair 2026 — Pillow Pass Generation Code

## Complete pass_generator.py

```python
"""
Job Fair 2026 — Digital Pass Image Generator
Uses Pillow to overlay text + QR code onto a client-provided template.

COORDINATE SYSTEM:
  Template is loaded as-is. All coordinates below are based on the
  client's template dimensions. Adjust values after receiving the
  actual template PNG from the client.
  
  Developer: Open the template in any image editor, hover over the
  desired text positions to get (x, y) pixel coordinates, then
  update the constants below.
"""

from PIL import Image, ImageDraw, ImageFont
import qrcode
import io
import os
import base64
from typing import Optional, Dict, Any


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TEMPLATE CONFIGURATION — ADJUST AFTER RECEIVING TEMPLATE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATE_PATH = os.path.join(BASE_DIR, 'assets', 'templates', 'jobfair_template.png')

# Template dimensions (will be read from image, but set defaults)
TEMPLATE_WIDTH = 1536   # ← Update after measuring template
TEMPLATE_HEIGHT = 1024  # ← Update after measuring template

# ─── TEXT COORDINATES (x, y) ───
# Developer: Open template in Photoshop/GIMP, find where each
# text element should go. Update these values.

NAME_X = 100            # ← Left edge of name text
NAME_Y = 350            # ← Top of name text
NAME_MAX_WIDTH = 700    # ← Maximum width before text wraps/shrinks

ACADEMIC_LABEL_X = 100  # ← "UNDERGRADUATE" / "POSTGRADUATE" etc.
ACADEMIC_LABEL_Y = 260  # ← Position of academic level badge

SID_X = 100             # ← e.g. "UGR59134" 
SID_Y = 480             # ← Below the name

REG_TYPE_X = 100        # ← "PRE-REGISTERED" or "ON-SPOT"
REG_TYPE_Y = 540        # ← Below SID

STREAM_X = 100          # ← Stream/course label
STREAM_Y = 440          # ← Between name and SID

# ─── QR CODE POSITION ───
QR_CENTER_X = 1200      # ← Center X of QR code area
QR_CENTER_Y = 450       # ← Center Y of QR code area
QR_SIZE = 300           # ← QR code dimension (square)
QR_BG_PADDING = 12      # ← White padding around QR

# ─── FONT SIZES ───
NAME_FONT_SIZE_MAX = 72
NAME_FONT_SIZE_MIN = 42
ACADEMIC_FONT_SIZE = 28
SID_FONT_SIZE = 48
REG_TYPE_FONT_SIZE = 24
STREAM_FONT_SIZE = 30

# ─── COLORS ───
TEXT_COLOR_PRIMARY = (255, 255, 255)       # White - for name
TEXT_COLOR_SECONDARY = (200, 200, 200)     # Light gray - for details
TEXT_COLOR_ACCENT = (190, 163, 93)         # Gold - for SID
BADGE_BG_PRE = (34, 139, 34, 220)         # Green - PRE-REGISTERED
BADGE_BG_ONSPOT = (178, 34, 52, 220)      # Red - ON-SPOT
BADGE_TEXT_COLOR = (255, 255, 255)         # White


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FONT LOADING WITH FALLBACKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    """
    Load a TrueType font with graceful fallback.
    Priority: bundled font → system fonts → PIL default.
    """
    # 1. Try bundled font
    bundled = os.path.join(BASE_DIR, 'assets', 'fonts', 'Inter-Bold.ttf')
    if os.path.exists(bundled):
        try:
            return ImageFont.truetype(bundled, size)
        except Exception:
            pass

    # 2. Try common Linux system fonts (Railway/Docker)
    system_fonts = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ] if bold else [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]

    for path in system_fonts:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue

    # 3. Fallback (will be small but won't crash)
    print(f"WARNING: No TrueType fonts found. Using PIL default at size {size}.")
    return ImageFont.load_default()


def text_size(draw: ImageDraw.ImageDraw, text: str, font) -> tuple:
    """Get (width, height) of rendered text."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def fit_text_to_width(
    draw: ImageDraw.ImageDraw,
    text: str,
    max_width: int,
    max_size: int,
    min_size: int,
    bold: bool = True
) -> tuple:
    """
    Shrink font size until text fits within max_width.
    Returns: (display_text, font, width, height)
    """
    for size in range(max_size, min_size - 1, -2):
        font = load_font(size, bold=bold)
        w, h = text_size(draw, text, font)
        if w <= max_width:
            return text, font, w, h

    # Still too wide at min size → truncate with ellipsis
    font = load_font(min_size, bold=bold)
    truncated = text
    while len(truncated) > 1:
        candidate = truncated[:-1].rstrip() + "..."
        cw, ch = text_size(draw, candidate, font)
        if cw <= max_width:
            return candidate, font, cw, ch
        truncated = truncated[:-1]

    return "...", font, *text_size(draw, "...", font)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# QR CODE GENERATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_qr_image(sid: str, size: int = 300) -> Image.Image:
    """
    Generate a QR code image from the SID string.
    The QR encodes only the SID (e.g. "UGR59134") — the backend
    looks up full details on scan.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(sid)
    qr.make(fit=True)

    qr_img = qr.make_image(
        fill_color="#000000",
        back_color="#FFFFFF"
    ).convert("RGBA")

    return qr_img.resize((size, size), Image.Resampling.LANCZOS)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ACADEMIC LEVEL → DISPLAY LABEL MAPPING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACADEMIC_DISPLAY = {
    'UG': 'UNDERGRADUATE',
    'PG': 'POSTGRADUATE',
    'Diploma': 'DIPLOMA',
    'ITI': 'ITI',
    'PUC': 'PUC PASS',
    'Graduate': 'GRADUATE',
    'Professional': 'WORKING PROFESSIONAL',
}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN PASS GENERATION FUNCTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def generate_pass(attendee: Dict[str, Any]) -> str:
    """
    Generate a digital pass image for an attendee.
    
    Args:
        attendee: dict with keys:
            - full_name (str)
            - academic_level (str): UG|PG|Diploma|ITI|PUC|Graduate
            - stream (str): BCA, MBA, etc.
            - sid (str): e.g. "UGR59134"
            - reg_type (str): "pre" or "onspot"
            - attendee_type (str): "student" or "professional"
    
    Returns:
        Base64-encoded JPG string of the pass image.
    """
    try:
        # ── STEP 1: LOAD TEMPLATE ──
        if os.path.exists(TEMPLATE_PATH):
            img = Image.open(TEMPLATE_PATH).convert('RGBA')
            # Ensure correct size
            tw, th = img.size
        else:
            # Fallback: dark gradient background
            tw, th = TEMPLATE_WIDTH, TEMPLATE_HEIGHT
            img = Image.new('RGBA', (tw, th), (15, 15, 30, 255))
            print(f"WARNING: Template not found at {TEMPLATE_PATH}. Using fallback.")

        draw = ImageDraw.Draw(img, 'RGBA')

        # ── STEP 2: ACADEMIC LEVEL BADGE ──
        academic_level = attendee.get('academic_level', 'UG')
        if attendee.get('attendee_type') == 'professional':
            badge_label = 'WORKING PROFESSIONAL'
        else:
            badge_label = ACADEMIC_DISPLAY.get(academic_level, academic_level.upper())

        badge_font = load_font(ACADEMIC_FONT_SIZE, bold=True)
        bw, bh = text_size(draw, badge_label, badge_font)
        badge_padding = 16

        # Draw badge background rectangle
        draw.rectangle(
            [
                ACADEMIC_LABEL_X - badge_padding,
                ACADEMIC_LABEL_Y - 6,
                ACADEMIC_LABEL_X + bw + badge_padding,
                ACADEMIC_LABEL_Y + bh + 10
            ],
            fill=(50, 50, 80, 200)
        )
        draw.text(
            (ACADEMIC_LABEL_X, ACADEMIC_LABEL_Y),
            badge_label,
            font=badge_font,
            fill=BADGE_TEXT_COLOR
        )

        # ── STEP 3: FULL NAME ──
        full_name = str(attendee.get('full_name', 'N/A')).upper()
        name_text, name_font, nw, nh = fit_text_to_width(
            draw, full_name, NAME_MAX_WIDTH,
            NAME_FONT_SIZE_MAX, NAME_FONT_SIZE_MIN, bold=True
        )
        draw.text(
            (NAME_X, NAME_Y),
            name_text,
            font=name_font,
            fill=TEXT_COLOR_PRIMARY
        )

        # ── STEP 4: STREAM / COURSE ──
        stream = attendee.get('stream', '')
        if stream:
            stream_font = load_font(STREAM_FONT_SIZE, bold=False)
            stream_display = stream
            mba_spec = attendee.get('mba_specialization', '')
            if stream == 'MBA' and mba_spec:
                stream_display = f"MBA — {mba_spec}"
            elif stream == 'Others':
                other = attendee.get('stream_other', '')
                stream_display = other if other else 'Others'

            draw.text(
                (STREAM_X, STREAM_Y),
                stream_display,
                font=stream_font,
                fill=TEXT_COLOR_SECONDARY
            )

        # ── STEP 5: SID (PROMINENT) ──
        sid = attendee.get('sid', 'N/A')
        sid_font = load_font(SID_FONT_SIZE, bold=True)
        draw.text(
            (SID_X, SID_Y),
            sid,
            font=sid_font,
            fill=TEXT_COLOR_ACCENT
        )

        # ── STEP 6: REGISTRATION TYPE BADGE ──
        reg_type = attendee.get('reg_type', 'pre')
        if reg_type == 'onspot':
            reg_label = "ON-SPOT"
            reg_bg = BADGE_BG_ONSPOT
        else:
            reg_label = "PRE-REGISTERED"
            reg_bg = BADGE_BG_PRE

        reg_font = load_font(REG_TYPE_FONT_SIZE, bold=True)
        rw, rh = text_size(draw, reg_label, reg_font)
        reg_pad = 12

        draw.rectangle(
            [
                REG_TYPE_X - reg_pad,
                REG_TYPE_Y - 4,
                REG_TYPE_X + rw + reg_pad,
                REG_TYPE_Y + rh + 8
            ],
            fill=reg_bg
        )
        draw.text(
            (REG_TYPE_X, REG_TYPE_Y),
            reg_label,
            font=reg_font,
            fill=BADGE_TEXT_COLOR
        )

        # ── STEP 7: QR CODE ──
        qr_img = generate_qr_image(sid, size=QR_SIZE)

        # White background plate behind QR
        plate_size = QR_SIZE + (2 * QR_BG_PADDING)
        plate_x1 = QR_CENTER_X - (plate_size // 2)
        plate_y1 = QR_CENTER_Y - (plate_size // 2)

        draw.rectangle(
            [plate_x1, plate_y1,
             plate_x1 + plate_size, plate_y1 + plate_size],
            fill=(255, 255, 255, 255)
        )

        # Paste QR code
        qr_paste_x = QR_CENTER_X - (QR_SIZE // 2)
        qr_paste_y = QR_CENTER_Y - (QR_SIZE // 2)
        img.alpha_composite(qr_img, (qr_paste_x, qr_paste_y))

        # "SCAN TO VERIFY" label below QR
        scan_font = load_font(18, bold=False)
        scan_text = "SCAN TO VERIFY"
        sw, _ = text_size(draw, scan_text, scan_font)
        draw.text(
            (QR_CENTER_X - sw // 2, plate_y1 + plate_size + 16),
            scan_text,
            font=scan_font,
            fill=TEXT_COLOR_SECONDARY
        )

        # ── STEP 8: CONVERT TO JPG AND RETURN BASE64 ──
        final = img.convert('RGB')
        buffer = io.BytesIO()
        final.save(buffer, format='JPEG', quality=92)
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')

    except Exception as e:
        print(f"Pass generation error: {e}")
        import traceback
        traceback.print_exc()
        # Return 1x1 transparent pixel as fallback
        return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
```

## How to Adjust Coordinates for Your Template

1. Open `jobfair_template.png` in any image editor (Photoshop, GIMP, Paint.NET)
2. Note the template dimensions → update `TEMPLATE_WIDTH` and `TEMPLATE_HEIGHT`
3. Hover your cursor over each desired text position:
   - Where the name should go → update `NAME_X`, `NAME_Y`
   - Where the academic badge goes → update `ACADEMIC_LABEL_X/Y`
   - Where the SID code goes → update `SID_X`, `SID_Y`
   - Where the reg type badge goes → update `REG_TYPE_X/Y`
   - Where the QR should be centered → update `QR_CENTER_X/Y`
4. Test locally: `python -c "from pass_generator import generate_pass; ..."`
5. Iterate until placement looks right

> [!TIP]
> Start with a generous `NAME_MAX_WIDTH` (e.g., 60% of template width) and narrow down. Long names will auto-shrink thanks to the `fit_text_to_width` function.
