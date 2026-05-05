import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ACADEMIC_DISPLAY = {
    "UG": "UNDERGRADUATE",
    "PG": "POSTGRADUATE",
    "Diploma": "DIPLOMA",
    "ITI": "ITI",
    "PUC": "PUC PASS",
    "Graduate": "GRADUATE",
    "Fresher": "FRESHER",
    "Professional": "WORKING PROFESSIONAL",
}

NEVARA_PATH  = os.path.join(BASE_DIR, "assets", "fonts", "Nevarademo-6YXEY.otf")
BOLD_PATH    = os.path.join(BASE_DIR, "assets", "fonts", "DejaVuSans-Bold.ttf")
TEMPLATE_PATH = os.path.join(BASE_DIR, "assets", "templates", "jobfair_template.png")

TW, TH = 1536, 1024

# ── Text placement ──
NAME_X         = 119
NAME_Y         = 349
NAME_MAX_WIDTH = 700
NAME_FONT_MAX  = 80     # primary size; shrinks to fit
NAME_FONT_MIN  = 42

# ── QR placement — top-left corner ──
QR_X    = 1095
QR_Y    = 291
QR_SIZE = 280

# ── Colours ──
COLOR_NAME   = (255, 255, 255)   # white
COLOR_LABEL  = (0, 207, 255)     # #00CFFF cyan
COLOR_DETAIL = (176, 212, 255)   # #B0D4FF light-blue
COLOR_SID    = (0, 207, 255)     # cyan


# ── Font helpers ──

def _load(path: str, size: int):
    try:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    except Exception:
        pass
    return None


def _name_font(size: int) -> ImageFont.FreeTypeFont:
    return _load(NEVARA_PATH, size) or _load(BOLD_PATH, size) or ImageFont.load_default()


def _bold_font(size: int) -> ImageFont.FreeTypeFont:
    return _load(BOLD_PATH, size) or ImageFont.load_default()


def _tsz(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0], b[3] - b[1]


def _fit_name(draw, text: str):
    """Word-wrap name into ≤2 lines, shrinking from NAME_FONT_MAX to NAME_FONT_MIN."""
    text = " ".join(str(text or "").split()) or "N/A"
    for size in range(NAME_FONT_MAX, NAME_FONT_MIN - 1, -2):
        font = _bold_font(size)
        words = text.split()
        lines, cur = [], ""
        for word in words:
            candidate = word if not cur else f"{cur} {word}"
            if _tsz(draw, candidate, font)[0] <= NAME_MAX_WIDTH:
                cur = candidate
            else:
                if cur:
                    lines.append(cur)
                cur = word
            if len(lines) >= 2:
                break
        if cur and len(lines) < 2:
            lines.append(cur)
        if not lines:
            continue
        if max(_tsz(draw, ln, font)[0] for ln in lines) <= NAME_MAX_WIDTH and len(lines) <= 2:
            return lines, font
    font = _bold_font(NAME_FONT_MIN)
    return [text[:30] + ("..." if len(text) > 30 else "")], font


def generate_qr_image(sid: str, size: int = 280) -> Image.Image:
    import qrcode
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(sid)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    return qr_img.resize((size, size), Image.Resampling.LANCZOS)


def generate_pass(attendee: dict) -> str:
    """
    Generate a job fair pass image.

    Args:
        attendee: dict with keys — full_name, academic_level, stream, sid,
                  reg_type, attendee_type, college_name (city optional)

    Returns:
        Base64-encoded JPEG string.
    """
    try:
        if os.path.exists(TEMPLATE_PATH):
            img = Image.open(TEMPLATE_PATH).convert("RGBA")
            if img.size != (TW, TH):
                img = img.resize((TW, TH), Image.Resampling.LANCZOS)
        else:
            img = Image.new("RGBA", (TW, TH), (10, 20, 40, 255))

        draw = ImageDraw.Draw(img, "RGBA")

        full_name     = str(attendee.get("full_name") or "N/A")
        academic_level = str(attendee.get("academic_level") or "UG")
        stream        = str(attendee.get("stream") or "")
        sid           = str(attendee.get("sid") or "")
        attendee_type = str(attendee.get("attendee_type") or "student").lower()
        college_name  = str(attendee.get("college_name") or "")

        is_professional = attendee_type == "professional"

        if attendee_type == "fresher":
            category_label = "FRESHER"
        elif is_professional:
            category_label = "WORKING PROFESSIONAL"
        else:
            category_label = ACADEMIC_DISPLAY.get(academic_level, academic_level.upper())

        # ── NAME  (white, Nevara/DejaVuSans-Bold, 72→42) ──
        name_lines, name_font = _fit_name(draw, full_name)
        cursor_y = NAME_Y
        for idx, line in enumerate(name_lines):
            draw.text((NAME_X, cursor_y), line, font=name_font, fill=COLOR_NAME)
            _, lh = _tsz(draw, line, name_font)
            cursor_y += lh + (6 if idx < len(name_lines) - 1 else 0)
        name_bottom = cursor_y

        # ── CATEGORY LABEL  (cyan #00CFFF, 32pt bold) ──
        cat_font = _bold_font(32)
        cat_y = name_bottom + 10
        draw.text((NAME_X, cat_y), category_label, font=cat_font, fill=COLOR_LABEL)
        _, cat_h = _tsz(draw, category_label, cat_font)

        # ── STREAM · COLLEGE  (light-blue #B0D4FF, 26pt) — skipped for professionals ──
        if not is_professional:
            detail_font = _bold_font(26)
            detail_y = cat_y + cat_h + 10

            stream_clean  = stream if stream and stream.upper() not in ("N/A", "") else ""
            college_clean = college_name if college_name and college_name.upper() != "N/A" else ""

            parts = [p for p in [stream_clean, college_clean] if p]
            detail_text = "  ·  ".join(parts) if parts else ""

            if detail_text:
                draw.text((NAME_X, detail_y), detail_text, font=detail_font, fill=COLOR_DETAIL)

        # ── QR CODE  (pasted directly — no white plate, QR already has white bg) ──
        qr_img = generate_qr_image(sid or "N/A", size=QR_SIZE)
        img.alpha_composite(qr_img, (QR_X, QR_Y))

        # ── SID  (cyan, 32pt bold, centered under QR) ──
        sid_font = _bold_font(32)
        sid_text = sid.upper() if sid else "N/A"
        sw, _ = _tsz(draw, sid_text, sid_font)
        sid_center_x = QR_X + QR_SIZE // 2
        sid_y = QR_Y + QR_SIZE + 20
        draw.text((sid_center_x - sw // 2, sid_y), sid_text, font=sid_font, fill=COLOR_SID)

        # ── DESCRIPTION TEXT  (light-blue #B0D4FF, 15pt, wrapped to 580px) ──
        desc_text = (
            "Organised in association with the Sub-Regional Employment Exchange "
            "& Bangalore University, this job fair is designed to give you more "
            "than just openings — it gives you exposure, interaction, and the "
            "confidence to present yourself in front of recruiters."
        )
        desc_font = _bold_font(15)
        desc_x, desc_y, desc_max_width = 119, 697, 580
        desc_lines = textwrap.wrap(desc_text, width=72)
        _, line_h = _tsz(draw, "Ay", desc_font)
        for i, line in enumerate(desc_lines):
            draw.text((desc_x, desc_y + i * (line_h + 4)), line, font=desc_font, fill=COLOR_DETAIL)

        # ── OUTPUT ──
        rgb = img.convert("RGB")
        buf = BytesIO()
        rgb.save(buf, format="JPEG", quality=85)
        buf.seek(0)
        return base64.b64encode(buf.getvalue()).decode()

    except Exception as e:
        print(f"Error generating pass: {e}")
        raise
