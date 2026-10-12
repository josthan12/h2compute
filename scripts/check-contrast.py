"""Check the actual shared text palette without a browser dependency."""
from pathlib import Path
import re

colors = dict(re.findall(r"--color-([a-z0-9-]+):\s*(#[a-fA-F0-9]{6})", Path("app/globals.css").read_text()))

def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in rgb]
    return sum(x * weight for x, weight in zip(linear, [0.2126, 0.7152, 0.0722]))

for foreground, background in [("base-content", "paper"), ("secondary", "paper"), ("primary", "paper"), ("base-content", "base-200"), ("secondary", "base-200"), ("primary-content", "primary"), ("neutral-content", "neutral"), ("base-content", "base-100")]:
    dark, light = sorted([luminance(colors[foreground]), luminance(colors[background])])
    ratio = (light + 0.05) / (dark + 0.05)
    assert ratio >= 4.5, (foreground, background, ratio)
    print(f"{foreground}/{background}: {ratio:.2f}:1")
