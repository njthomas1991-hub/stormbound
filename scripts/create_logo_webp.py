#!/usr/bin/env python3
"""
Create an optimized WebP version of assets/images/logo.png, resized to a max width.
"""
import os, sys
from PIL import Image

SRC = os.path.abspath('assets/images/logo.png')
OUT = os.path.abspath('assets/images/logo.webp')
MAX_W = 400
QUALITY = 80

if not os.path.exists(SRC):
    print('Source not found:', SRC); sys.exit(2)

img = Image.open(SRC)
w,h = img.size
if w > MAX_W:
    new_h = int(round((MAX_W / w) * h))
    img = img.resize((MAX_W, new_h), Image.LANCZOS)
    print('Resized to', MAX_W, 'x', new_h)
else:
    print('Source width <=', MAX_W, '- keeping original size', w, 'x', h)

# Convert to RGBA if needed for transparency
if img.mode not in ('RGBA','RGB'):
    img = img.convert('RGBA')

img.save(OUT, 'WEBP', quality=QUALITY, method=6)
print('Saved optimized WebP:', OUT)
