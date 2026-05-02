"""Generate PWA icons from scratch (purple gradient + 'T' letter).

Usage:
    python tools/generate-icons.py

Generates:
    icons/icon-192.png   (Android/manifest)
    icons/icon-512.png   (Android/manifest)
    icons/icon-512-maskable.png  (Android adaptive)
    icons/apple-touch-icon.png   (180x180, iOS home screen)
    icons/apple-touch-icon-167.png (167x167, iPad Pro)
    icons/apple-touch-icon-152.png (152x152, iPad)
    icons/favicon-32.png
    icons/favicon-16.png
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

OUT = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(OUT, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_icon(size: int, rounded: bool = True, padding_ratio: float = 0.0):
    """Draw a square icon with purple gradient background and white 'T'."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background: purple gradient (#6c2bd9 -> #8b5bff)
    c1 = (108, 43, 217)
    c2 = (139, 91, 255)

    # Compute corner radius (~22% for rounded squircle look)
    if rounded:
        r = int(size * 0.22)
    else:
        r = 0

    # Build the rounded rect mask
    mask = Image.new('L', (size, size), 0)
    md = ImageDraw.Draw(mask)
    inset = int(size * padding_ratio)
    md.rounded_rectangle(
        [inset, inset, size - inset - 1, size - inset - 1],
        radius=r if not padding_ratio else int((size - inset * 2) * 0.22),
        fill=255,
    )

    # Render gradient pixel-by-pixel (vertical)
    grad = Image.new('RGB', (size, size))
    gpx = grad.load()
    for y in range(size):
        col = lerp(c1, c2, y / max(1, size - 1))
        for x in range(size):
            gpx[x, y] = col
    grad.putalpha(mask)

    img = Image.alpha_composite(img, grad)
    draw = ImageDraw.Draw(img)

    # Draw the letter 'T'
    text = 'T'
    target_h = int(size * 0.55)
    font = None
    candidates = [
        'C:\\Windows\\Fonts\\arialbd.ttf',
        'C:\\Windows\\Fonts\\arial.ttf',
        'C:\\Windows\\Fonts\\segoeuib.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, target_h)
                break
            except Exception:
                pass
    if font is None:
        font = ImageFont.load_default()

    # Center the text
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    cx = (size - tw) / 2 - bbox[0]
    cy = (size - th) / 2 - bbox[1] - int(size * 0.02)
    draw.text((cx, cy), text, fill=(255, 255, 255, 255), font=font)

    return img


def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path, 'PNG', optimize=True)
    print(f'  wrote {os.path.relpath(path)}')


def main():
    print('Generating PWA icons...')
    save(draw_icon(192), 'icon-192.png')
    save(draw_icon(512), 'icon-512.png')
    # Maskable: solid background with safe-zone padding (~10% on each side)
    save(draw_icon(512, padding_ratio=0.10), 'icon-512-maskable.png')
    # Apple touch icons (no transparency, no rounded — iOS rounds them automatically)
    save(draw_icon(180, rounded=False), 'apple-touch-icon.png')
    save(draw_icon(167, rounded=False), 'apple-touch-icon-167.png')
    save(draw_icon(152, rounded=False), 'apple-touch-icon-152.png')
    save(draw_icon(32), 'favicon-32.png')
    save(draw_icon(16), 'favicon-16.png')
    print('Done.')


if __name__ == '__main__':
    main()
