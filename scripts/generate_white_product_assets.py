import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = os.path.abspath('apps/web/public/design/products')
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 720, 440

def create_base_canvas():
    # Pure white canvas (RGB 255, 255, 255)
    return Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 255))

def add_soft_shadow(draw, cx, cy, rx, ry, opacity=65, blur_steps=18):
    """Generates a realistic multi-layer Gaussian ambient contact shadow underneath equipment"""
    # 1. Broad soft ambient shadow
    for i in range(blur_steps, 0, -1):
        cur_rx = rx * (1 + (i / blur_steps) * 0.48)
        cur_ry = ry * (1 + (i / blur_steps) * 0.48)
        cur_alpha = int(opacity * (1 - i / (blur_steps + 1))**1.4)
        bbox = [cx - cur_rx, cy - cur_ry, cx + cur_rx, cy + cur_ry]
        draw.ellipse(bbox, fill=(15, 23, 42, cur_alpha))

    # 2. Dense contact occlusion shadow directly under equipment footprint
    tight_rx = rx * 0.82
    tight_ry = ry * 0.58
    for i in range(8, 0, -1):
        cur_rx = tight_rx * (1 + (i / 8) * 0.18)
        cur_ry = tight_ry * (1 + (i / 8) * 0.18)
        cur_alpha = int(95 * (1 - i / 9)**1.3)
        bbox = [cx - cur_rx, cy - cur_ry + 2, cx + cur_rx, cy + cur_ry + 2]
        draw.ellipse(bbox, fill=(10, 18, 30, cur_alpha))

def save_webp(img, filename):
    out_path = os.path.join(OUTPUT_DIR, filename)
    # Flatten strictly onto pure white RGB
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, (0, 0), img)
    bg.save(out_path, 'WEBP', quality=95)
    print(f"Generated unique asset: {filename}")

# ------------------------------------------------------------------------------
# 1. CATL TENER 6.25 MWh (Flagship 20ft Container)
# ------------------------------------------------------------------------------
def draw_tener_6250():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 270, 26, opacity=60)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Container 3D Isometric Faces
    front = [(150, 140), (510, 125), (510, 320), (150, 330)]
    right = [(510, 125), (610, 150), (610, 305), (510, 320)]
    roof = [(150, 140), (250, 120), (610, 105), (510, 125)]

    draw.polygon(front, fill=(248, 250, 253), outline=(218, 226, 236), width=2)
    draw.polygon(right, fill=(212, 220, 230), outline=(190, 200, 212), width=2)
    draw.polygon(roof, fill=(255, 255, 255), outline=(225, 232, 240), width=2)

    # HVAC rooftop chillers
    draw.rectangle([260, 95, 410, 122], fill=(225, 232, 242), outline=(180, 192, 205), width=2)
    draw.rectangle([420, 90, 540, 115], fill=(215, 222, 234), outline=(180, 192, 205), width=2)
    for fx in range(280, 395, 30):
        draw.ellipse([fx, 100, fx + 20, 110], fill=(160, 175, 190))

    # Door corrugated lines
    for x in range(190, 500, 42):
        draw.line([(x, 138), (x, 322)], fill=(228, 235, 244), width=3)
        draw.line([(x + 2, 138), (x + 2, 322)], fill=(255, 255, 255), width=1)

    # Glowing Blue Seam
    for w in range(6, 0, -1):
        draw.line([(150, 235), (510, 225)], fill=(0, 120, 255, int(45 / w)), width=w * 2)
    draw.line([(150, 235), (510, 225)], fill=(0, 140, 255), width=3)
    draw.line([(510, 225), (610, 232)], fill=(0, 120, 255), width=3)

    # Door lock bars on right
    draw.line([(560, 138), (560, 312)], fill=(160, 172, 186), width=3)
    draw.line([(585, 142), (585, 308)], fill=(160, 172, 186), width=3)

    # Digital Telemetry & Labels
    draw.rectangle([455, 160, 490, 190], fill=(20, 32, 48), outline=(0, 102, 255), width=2)
    draw.rectangle([460, 165, 485, 185], fill=(0, 190, 255))
    draw.text((170, 175), "CATL TENER", fill=(0, 91, 255))
    draw.text((170, 195), "6.25 MWh · ZERO DEGRADATION 5Y", fill=(71, 85, 105))
    draw.text((170, 210), "20ft HIGH-DENSITY UTILITY BESS", fill=(100, 116, 139))
    return canvas

# ------------------------------------------------------------------------------
# 2. CATL TENER H (9.008 MWh Extra High-Density Container)
# ------------------------------------------------------------------------------
def draw_tener_h():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 290, 28, opacity=65)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(15))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Extra elongated high-density container
    front = [(110, 130), (520, 115), (520, 330), (110, 340)]
    right = [(520, 115), (630, 145), (630, 310), (520, 330)]
    roof = [(110, 130), (220, 105), (630, 95), (520, 115)]

    draw.polygon(front, fill=(244, 246, 250), outline=(210, 220, 232), width=2)
    draw.polygon(right, fill=(205, 214, 226), outline=(180, 192, 206), width=2)
    draw.polygon(roof, fill=(255, 255, 255), outline=(220, 230, 240), width=2)

    # Double-decker HVAC modules
    draw.rectangle([210, 75, 380, 108], fill=(220, 228, 238), outline=(175, 188, 202), width=2)
    draw.rectangle([390, 70, 560, 100], fill=(210, 218, 230), outline=(175, 188, 202), width=2)

    # Corrugations
    for x in range(150, 510, 35):
        draw.line([(x, 128), (x, 332)], fill=(225, 232, 242), width=3)

    # Dual Blue/Cyan Accent Lines (indicating H version)
    draw.line([(110, 215), (520, 205)], fill=(0, 180, 255), width=3)
    draw.line([(110, 225), (520, 215)], fill=(0, 102, 255), width=3)

    draw.text((135, 160), "CATL TENER H", fill=(0, 91, 255))
    draw.text((135, 180), "9.008 MWh · MAXIMUM CAPACITY", fill=(15, 23, 42))
    return canvas

# ------------------------------------------------------------------------------
# 3. CATL TENER S (6.25 MWh Compact Utility)
# ------------------------------------------------------------------------------
def draw_tener_s():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 260, 24, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    front = [(160, 140), (500, 125), (500, 320), (160, 330)]
    right = [(500, 125), (595, 150), (595, 305), (500, 320)]
    roof = [(160, 140), (255, 120), (595, 105), (500, 125)]

    draw.polygon(front, fill=(247, 249, 252), outline=(215, 225, 235), width=2)
    draw.polygon(right, fill=(210, 218, 228), outline=(188, 198, 210), width=2)
    draw.polygon(roof, fill=(255, 255, 255), outline=(225, 232, 240), width=2)

    # Silver/Teal Accent
    draw.line([(160, 240), (500, 230)], fill=(0, 200, 180), width=4)

    draw.text((185, 175), "CATL TENER S", fill=(0, 91, 255))
    draw.text((185, 195), "6.25 MWh · STRING ARCHITECTURE", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 4. CATL TENER STACK (Multi-Container Megawatt Station)
# ------------------------------------------------------------------------------
def draw_tener_stack():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 290, 28, opacity=60)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(15))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Bottom container
    draw.polygon([(140, 220), (490, 210), (490, 335), (140, 345)], fill=(240, 244, 248), outline=(205, 215, 228), width=2)
    draw.polygon([(490, 210), (590, 230), (590, 320), (490, 335)], fill=(205, 215, 225), outline=(180, 190, 205), width=2)

    # Top container stacked
    draw.polygon([(140, 105), (490, 95), (490, 210), (140, 220)], fill=(248, 250, 253), outline=(215, 225, 235), width=2)
    draw.polygon([(490, 95), (590, 115), (590, 230), (490, 210)], fill=(215, 225, 235), outline=(185, 195, 210), width=2)
    draw.polygon([(140, 105), (240, 85), (590, 75), (490, 95)], fill=(255, 255, 255), outline=(225, 235, 245), width=2)

    # Interconnecting electrical duct
    draw.rectangle([300, 205, 340, 225], fill=(50, 65, 85))

    # Glow lines on both tiers
    draw.line([(140, 165), (490, 155)], fill=(0, 102, 255), width=3)
    draw.line([(140, 280), (490, 270)], fill=(0, 102, 255), width=3)

    draw.text((160, 125), "CATL TENER STACK", fill=(0, 91, 255))
    draw.text((160, 142), "MULTI-MEGAWATT POWER HUB", fill=(100, 116, 139))
    return canvas

# ------------------------------------------------------------------------------
# 5. CATL EnerC Plus (3.727 MWh)
# ------------------------------------------------------------------------------
def draw_enerc_plus():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 270, 25, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    front = [(150, 135), (510, 120), (510, 320), (150, 330)]
    right = [(510, 120), (600, 145), (600, 305), (510, 320)]
    roof = [(150, 135), (240, 115), (600, 100), (510, 120)]

    draw.polygon(front, fill=(245, 248, 252), outline=(215, 225, 235), width=2)
    draw.polygon(right, fill=(210, 218, 228), outline=(188, 198, 210), width=2)
    draw.polygon(roof, fill=(255, 255, 255), outline=(225, 232, 240), width=2)

    # Emerald Green eco line for EnerC
    draw.line([(150, 230), (510, 220)], fill=(16, 185, 129), width=4)

    draw.text((170, 175), "CATL EnerC Plus", fill=(16, 185, 129))
    draw.text((170, 195), "3.727 MWh · LIQUID-COOLED BESS", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 6. CATL EnerD (5.0 MWh)
# ------------------------------------------------------------------------------
def draw_enerd_5000():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 270, 25, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    front = [(150, 135), (510, 120), (510, 320), (150, 330)]
    right = [(510, 120), (600, 145), (600, 305), (510, 320)]
    roof = [(150, 135), (240, 115), (600, 100), (510, 120)]

    draw.polygon(front, fill=(242, 245, 250), outline=(212, 222, 232), width=2)
    draw.polygon(right, fill=(208, 216, 226), outline=(185, 195, 208), width=2)
    draw.polygon(roof, fill=(255, 255, 255), outline=(225, 232, 240), width=2)

    # Sapphire blue line
    draw.line([(150, 230), (510, 220)], fill=(2, 132, 199), width=4)

    draw.text((170, 175), "CATL EnerD", fill=(2, 132, 199))
    draw.text((170, 195), "5.0 MWh · UTILITY ESS CONTAINER", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 7. CATL EnerOne Plus (Outdoor Modular Cabinet)
# ------------------------------------------------------------------------------
def draw_enerone_plus():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 180, 22, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Front Face
    draw.rounded_rectangle([250, 80, 430, 335], radius=14, fill=(248, 250, 253), outline=(215, 224, 234), width=2)
    # Right Side Face
    right_pts = [(430, 80), (495, 110), (495, 315), (430, 335)]
    draw.polygon(right_pts, fill=(215, 225, 236), outline=(195, 205, 218))
    # Top Face
    top_pts = [(250, 80), (315, 60), (495, 110), (430, 80)]
    draw.polygon(top_pts, fill=(255, 255, 255), outline=(225, 232, 240))

    # Front Door Inset (dark sleek industrial finish)
    draw.rounded_rectangle([268, 100, 412, 318], radius=10, fill=(30, 40, 55), outline=(48, 62, 80))

    # Digital Telemetry Screen
    draw.rounded_rectangle([290, 125, 390, 195], radius=8, fill=(12, 20, 32), outline=(0, 102, 255), width=2)
    draw.arc([315, 135, 365, 185], start=135, end=405, fill=(0, 210, 140), width=4)
    draw.text((326, 152), "99%", fill=(255, 255, 255))
    draw.text((308, 178), "CATL EnerOne", fill=(100, 180, 255))

    # Louvers
    for ly in range(215, 290, 12):
        draw.rounded_rectangle([290, ly, 390, ly + 5], radius=2, fill=(18, 26, 38))
        draw.line([(291, ly + 2), (389, ly + 2)], fill=(0, 102, 255, 160), width=1)

    # Exposed liquid cooling pipes on side
    for py in [150, 190, 230, 270]:
        draw.line([(440, py), (485, py + 14)], fill=(35, 45, 60), width=6)
        draw.line([(440, py), (485, py + 14)], fill=(0, 150, 255), width=2)

    draw.text((275, 84), "CATL EnerOne Plus", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 8. CATL EnerOne 372.7 kWh (Modular Cabinet)
# ------------------------------------------------------------------------------
def draw_enerone_372():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 180, 22, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Dual front doors
    draw.rounded_rectangle([250, 80, 430, 335], radius=14, fill=(245, 248, 252), outline=(215, 224, 234), width=2)
    right_pts = [(430, 80), (495, 110), (495, 315), (430, 335)]
    draw.polygon(right_pts, fill=(212, 222, 234), outline=(195, 205, 218))
    top_pts = [(250, 80), (315, 60), (495, 110), (430, 80)]
    draw.polygon(top_pts, fill=(255, 255, 255), outline=(225, 232, 240))

    # Dual Door split
    draw.line([(340, 100), (340, 320)], fill=(180, 195, 210), width=2)
    draw.rounded_rectangle([265, 100, 335, 318], radius=6, fill=(35, 45, 62))
    draw.rounded_rectangle([345, 100, 415, 318], radius=6, fill=(35, 45, 62))

    draw.text((275, 84), "CATL EnerOne 372.7", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 9. CATL UniC 1.0 MW / 2.0 MWh
# ------------------------------------------------------------------------------
def draw_unic_1000():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 220, 24, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Wide commercial cabinet with integrated PCS section
    draw.rounded_rectangle([200, 95, 460, 330], radius=12, fill=(245, 248, 252), outline=(210, 220, 232), width=2)
    right_pts = [(460, 95), (530, 120), (530, 310), (460, 330)]
    draw.polygon(right_pts, fill=(210, 218, 228), outline=(190, 200, 212))

    # Dual bays: Battery Bay + PCS Bay
    draw.line([(330, 95), (330, 330)], fill=(190, 202, 216), width=2)
    draw.text((220, 120), "BATTERY BAY (2 MWh)", fill=(100, 116, 139))
    draw.text((345, 120), "PCS BAY (1 MW)", fill=(0, 102, 255))

    # Ventilation & Status Screen
    draw.rectangle([345, 145, 440, 195], fill=(20, 30, 45), outline=(0, 120, 255), width=2)
    draw.text((355, 160), "ALL-IN-ONE C&I", fill=(255, 255, 255))

    draw.text((220, 100), "CATL UniC 1000", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 10. C&I Peak Shaving System 250 kW / 500 kWh
# ------------------------------------------------------------------------------
def draw_ci_peak_shaving():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 200, 22, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([220, 95, 440, 330], radius=12, fill=(246, 249, 252), outline=(212, 222, 234), width=2)
    right_pts = [(440, 95), (510, 120), (510, 310), (440, 330)]
    draw.polygon(right_pts, fill=(212, 220, 230), outline=(190, 200, 212))

    # Dynamic Peak Shaving icon/graph on front
    draw.rounded_rectangle([245, 135, 415, 225], radius=8, fill=(18, 28, 42))
    # Peak line curve in amber
    draw.line([(260, 200), (300, 160), (340, 150), (380, 195)], fill=(255, 170, 0), width=3)
    # Shaved flat blue line
    draw.line([(260, 180), (380, 180)], fill=(0, 210, 255), width=2)

    draw.text((245, 105), "CATL C&I PEAK SHAVING", fill=(0, 91, 255))
    draw.text((245, 240), "250 kW / 500 kWh · TARIFF OPTIMIZER", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 11. C&I Solar+Storage Integrated Solution 500 kW / 1.5 MWh
# ------------------------------------------------------------------------------
def draw_ci_solar_storage():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 220, 24, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([200, 95, 460, 330], radius=12, fill=(247, 249, 253), outline=(215, 224, 235), width=2)
    right_pts = [(460, 95), (530, 120), (530, 310), (460, 330)]
    draw.polygon(right_pts, fill=(215, 223, 234), outline=(190, 200, 212))

    # Solar PV + Battery Icon Graphic
    draw.rounded_rectangle([230, 135, 430, 225], radius=8, fill=(20, 32, 48))
    # Sun icon
    draw.ellipse([250, 150, 280, 180], fill=(255, 200, 0))
    # Battery icon
    draw.rectangle([340, 150, 390, 180], fill=(16, 185, 129))

    draw.text((220, 105), "CATL SOLAR + STORAGE", fill=(0, 91, 255))
    draw.text((220, 245), "500 kW / 1.5 MWh · PV FIRMING", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 12. Industrial Microgrid ESS 500 kW / 1000 kWh
# ------------------------------------------------------------------------------
def draw_ci_microgrid():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 210, 23, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([210, 95, 450, 330], radius=12, fill=(246, 249, 252), outline=(212, 222, 234), width=2)
    right_pts = [(450, 95), (520, 120), (520, 310), (450, 330)]
    draw.polygon(right_pts, fill=(212, 220, 232), outline=(190, 200, 212))

    draw.rounded_rectangle([240, 135, 420, 220], radius=8, fill=(18, 28, 42))
    draw.text((260, 160), "ISLANDED / ON-GRID", fill=(0, 230, 255))
    draw.text((260, 180), "AUTO-TRANSFER (ATS)", fill=(16, 185, 129))

    draw.text((230, 105), "CATL MICROGRID ESS", fill=(0, 91, 255))
    draw.text((230, 245), "500 kW / 1000 kWh · RESILIENCE", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 13. Microgrid Station 500 kW / 1000 kWh
# ------------------------------------------------------------------------------
def draw_microgrid_station():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 230, 24, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.polygon([(170, 150), (470, 135), (470, 325), (170, 335)], fill=(245, 248, 252), outline=(215, 224, 235), width=2)
    draw.polygon([(470, 135), (550, 155), (550, 310), (470, 325)], fill=(215, 223, 234), outline=(190, 200, 212))
    draw.polygon([(170, 150), (250, 130), (550, 115), (470, 135)], fill=(255, 255, 255), outline=(225, 232, 240))

    draw.line([(170, 240), (470, 230)], fill=(245, 158, 11), width=4) # Amber Microgrid line
    draw.text((195, 175), "CATL MICROGRID STATION", fill=(245, 158, 11))
    draw.text((195, 195), "500 kW / 1000 kWh · TURNKEY SKID", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 14. CATL Residential PR-15 (15 kWh)
# ------------------------------------------------------------------------------
def draw_residential_pr15():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 350, 140, 18, opacity=45)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Elegant sleek home battery casing
    draw.rounded_rectangle([280, 65, 440, 335], radius=22, fill=(255, 255, 255), outline=(220, 228, 238), width=2)
    draw.rounded_rectangle([275, 68, 281, 332], radius=4, fill=(185, 195, 208))
    draw.rounded_rectangle([439, 68, 445, 332], radius=4, fill=(185, 195, 208))

    # Glowing Halo Ring
    halo = [325, 125, 395, 195]
    for w in range(6, 0, -1):
        draw.ellipse([halo[0] - w, halo[1] - w, halo[2] + w, halo[3] + w], fill=(0, 220, 180, int(45 / w)))
    draw.ellipse(halo, outline=(0, 230, 190), width=4)
    draw.text((342, 150), "100%", fill=(15, 30, 50))
    draw.text((338, 168), "READY", fill=(0, 180, 140))

    draw.text((335, 285), "CATL PR-15", fill=(0, 91, 255))
    draw.text((330, 302), "15 kWh LFP", fill=(120, 135, 155))
    return canvas

# ------------------------------------------------------------------------------
# 15. CATL Residential PR-30 (30 kWh)
# ------------------------------------------------------------------------------
def draw_residential_pr30():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 355, 160, 20, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Double height/width PR-30 unit
    draw.rounded_rectangle([260, 55, 460, 340], radius=24, fill=(255, 255, 255), outline=(220, 228, 238), width=2)
    draw.rounded_rectangle([255, 58, 261, 337], radius=4, fill=(185, 195, 208))
    draw.rounded_rectangle([459, 58, 465, 337], radius=4, fill=(185, 195, 208))

    # Center divide line
    draw.line([(360, 70), (360, 325)], fill=(235, 240, 248), width=2)

    # Dual Halo Rings
    for cx in [310, 410]:
        draw.ellipse([cx - 25, 130, cx + 25, 180], outline=(0, 230, 190), width=4)
        draw.text((cx - 14, 148), "15k", fill=(15, 30, 50))

    draw.text((320, 280), "CATL PR-30", fill=(0, 91, 255))
    draw.text((310, 298), "30 kWh CAPACITY", fill=(120, 135, 155))
    return canvas

# ------------------------------------------------------------------------------
# 16. Residential All-In-One Solar+Storage 10 kW / 15 kWh
# ------------------------------------------------------------------------------
def draw_home_hybrid():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 350, 150, 20, opacity=45)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Top Inverter Section (Dark gray)
    draw.rounded_rectangle([270, 60, 450, 140], radius=14, fill=(40, 50, 65), outline=(60, 75, 95), width=2)
    draw.text((290, 85), "10 kW HYBRID INVERTER", fill=(0, 220, 255))
    draw.text((290, 105), "MPPT DUAL CHANNEL", fill=(150, 170, 190))

    # Bottom Battery Section (Sleek white)
    draw.rounded_rectangle([270, 145, 450, 335], radius=14, fill=(255, 255, 255), outline=(220, 228, 238), width=2)
    draw.ellipse([335, 200, 385, 250], outline=(16, 185, 129), width=4)
    draw.text((345, 220), "15kWh", fill=(15, 30, 50))

    draw.text((300, 290), "CATL ALL-IN-ONE", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 17. Residential High-Voltage Stack 20.48 kWh
# ------------------------------------------------------------------------------
def draw_home_hv_stack():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 355, 150, 20, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # 4 Stacked horizontal battery modules
    for i in range(4):
        my = 120 + i * 50
        draw.rounded_rectangle([280, my, 440, my + 44], radius=8, fill=(250, 252, 255), outline=(215, 224, 236), width=2)
        draw.ellipse([295, my + 18, 303, my + 26], fill=(0, 210, 140))
        draw.text((315, my + 16), f"MODULE {i+1} · 5.12 kWh", fill=(71, 85, 105))

    # Top BMS Controller
    draw.rounded_rectangle([280, 65, 440, 110], radius=8, fill=(35, 45, 60), outline=(50, 65, 85), width=2)
    draw.text((300, 80), "HV MASTER BMS", fill=(0, 210, 255))

    draw.text((300, 335), "HV STACK 20.48 kWh", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 18. CATL LFP Prismatic Cell 314Ah (Iconic Blue Cell)
# ------------------------------------------------------------------------------
def draw_cell_314ah():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 160, 20, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # 3D Cell body
    front = [(250, 120), (430, 105), (430, 330), (250, 340)]
    right = [(430, 105), (490, 130), (490, 310), (430, 330)]
    top = [(250, 120), (310, 100), (490, 105), (430, 105)]

    draw.polygon(front, fill=(0, 102, 235), outline=(0, 80, 195), width=2)
    draw.polygon(right, fill=(0, 78, 185), outline=(0, 60, 150), width=2)
    draw.polygon(top, fill=(235, 242, 250), outline=(200, 210, 224), width=2)

    # Terminals
    # Positive (+) Copper
    draw.ellipse([290, 100, 320, 114], fill=(225, 110, 50), outline=(180, 70, 30), width=2)
    # Negative (-) Aluminum
    draw.ellipse([385, 95, 415, 109], fill=(210, 222, 235), outline=(160, 175, 190), width=2)
    # Explosion Vent
    draw.ellipse([342, 98, 365, 108], fill=(160, 175, 190), outline=(120, 135, 150))

    # White label on front
    draw.rectangle([275, 155, 405, 260], fill=(255, 255, 255, 235))
    draw.text((290, 165), "CATL LFP", fill=(0, 91, 255))
    draw.text((290, 185), "3.2V 314Ah", fill=(15, 23, 42))
    draw.text((290, 205), "1005 Wh · 0.5C", fill=(71, 85, 105))
    draw.text((290, 225), "12 000 CYCLES", fill=(16, 185, 129))
    return canvas

# ------------------------------------------------------------------------------
# 19. CATL LFP Prismatic Cell 280Ah (Cyan Body)
# ------------------------------------------------------------------------------
def draw_cell_280ah():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 160, 20, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    front = [(250, 120), (430, 105), (430, 330), (250, 340)]
    right = [(430, 105), (490, 130), (490, 310), (430, 330)]
    top = [(250, 120), (310, 100), (490, 105), (430, 105)]

    draw.polygon(front, fill=(2, 132, 199), outline=(3, 105, 161), width=2)
    draw.polygon(right, fill=(3, 105, 161), outline=(2, 80, 130), width=2)
    draw.polygon(top, fill=(235, 242, 250), outline=(200, 210, 224), width=2)

    draw.ellipse([290, 100, 320, 114], fill=(225, 110, 50), outline=(180, 70, 30), width=2)
    draw.ellipse([385, 95, 415, 109], fill=(210, 222, 235), outline=(160, 175, 190), width=2)

    draw.rectangle([275, 155, 405, 260], fill=(255, 255, 255, 235))
    draw.text((290, 165), "CATL LFP", fill=(2, 132, 199))
    draw.text((290, 185), "3.2V 280Ah", fill=(15, 23, 42))
    draw.text((290, 205), "896 Wh · 1C/1C", fill=(71, 85, 105))
    draw.text((290, 225), "BENCHMARK CELL", fill=(100, 116, 139))
    return canvas

# ------------------------------------------------------------------------------
# 20. CATL Ultra LFP Prismatic Cell 587Ah Next-Gen (Deep Sapphire & Gold)
# ------------------------------------------------------------------------------
def draw_cell_587ah():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 180, 22, opacity=60)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Wider form factor cell
    front = [(230, 110), (450, 95), (450, 335), (230, 345)]
    right = [(450, 95), (515, 120), (515, 315), (450, 335)]
    top = [(230, 110), (295, 90), (515, 95), (450, 95)]

    draw.polygon(front, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
    draw.polygon(right, fill=(10, 15, 30), outline=(20, 30, 45), width=2)
    draw.polygon(top, fill=(240, 245, 255), outline=(210, 220, 235), width=2)

    # Gold terminals
    draw.ellipse([275, 92, 310, 108], fill=(234, 179, 8), outline=(202, 138, 4), width=2)
    draw.ellipse([400, 87, 435, 103], fill=(234, 179, 8), outline=(202, 138, 4), width=2)

    draw.rectangle([255, 150, 425, 265], fill=(255, 255, 255, 240))
    draw.text((275, 162), "CATL ULTRA", fill=(217, 119, 6))
    draw.text((275, 185), "3.2V 587Ah", fill=(15, 23, 42))
    draw.text((275, 208), "1878 Wh ULTRA DENSITY", fill=(71, 85, 105))
    draw.text((275, 230), "NEXT-GEN LFP", fill=(0, 102, 255))
    return canvas

# ------------------------------------------------------------------------------
# 21. CATL 1500V DC High-Voltage Battery Rack
# ------------------------------------------------------------------------------
def draw_rack_1500v():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 355, 140, 18, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rectangle([270, 65, 450, 345], fill=(30, 38, 50), outline=(60, 75, 95), width=2)

    # 10 Module slots
    for i in range(10):
        my = 85 + i * 24
        draw.rounded_rectangle([280, my, 440, my + 19], radius=3, fill=(242, 246, 252), outline=(190, 205, 220))
        draw.ellipse([355, my + 7, 360, my + 12], fill=(0, 220, 120))

    # Top High Voltage Controller
    draw.rectangle([280, 68, 440, 82], fill=(15, 22, 32))
    draw.text((315, 70), "1500V DC BPU", fill=(255, 180, 0))
    draw.text((305, 325), "CATL HV RACK", fill=(100, 180, 255))
    return canvas

# ------------------------------------------------------------------------------
# 22. CATL 1P52S Liquid-Cooled Battery Module
# ------------------------------------------------------------------------------
def draw_module_1p52s():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 200, 22, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Horizontal module tray
    draw.rounded_rectangle([200, 150, 520, 285], radius=10, fill=(245, 248, 252), outline=(210, 220, 234), width=2)
    # Quick connect cooling fluid ports on front
    draw.ellipse([220, 200, 240, 220], fill=(0, 120, 255), outline=(0, 90, 200), width=2)
    draw.ellipse([220, 230, 240, 250], fill=(0, 120, 255), outline=(0, 90, 200), width=2)

    # Battery cells visible in tray
    for cx in range(260, 490, 16):
        draw.line([(cx, 165), (cx, 265)], fill=(0, 91, 255), width=10)

    draw.text((270, 180), "CATL 1P52S MODULE", fill=(255, 255, 255))
    draw.text((270, 200), "166.4V · 52.2 kWh", fill=(255, 255, 255))
    return canvas

# ------------------------------------------------------------------------------
# 23. CATL PCS 1250 kW Bidirectional Inverter
# ------------------------------------------------------------------------------
def draw_pcs_1250kw():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 200, 22, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rectangle([210, 110, 510, 325], fill=(242, 246, 250), outline=(205, 215, 228), width=2)
    draw.line([(360, 110), (360, 325)], fill=(195, 205, 220), width=2)

    # Digital Touchscreen
    draw.rectangle([240, 135, 330, 185], fill=(15, 25, 40), outline=(0, 102, 255), width=2)
    draw.text((250, 150), "1250 kW", fill=(0, 220, 255))
    draw.text((250, 168), "GRID FORMING", fill=(16, 185, 129))

    # Ventilation grilles
    for ly in range(210, 300, 10):
        draw.line([(240, ly), (330, ly)], fill=(180, 195, 210), width=2)
        draw.line([(390, ly), (480, ly)], fill=(180, 195, 210), width=2)

    draw.text((390, 140), "CATL PCS 1250", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 24. CATL Central PCS Skid 2.5 MW / 1500V
# ------------------------------------------------------------------------------
def draw_central_pcs_skid():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 240, 24, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Heavy Duty Skid Frame
    draw.polygon([(170, 315), (550, 305), (580, 325), (200, 335)], fill=(50, 60, 75))

    # 3 Inverter bays
    draw.rectangle([190, 120, 530, 315], fill=(240, 245, 250), outline=(200, 212, 225), width=2)
    draw.line([(300, 120), (300, 315)], fill=(185, 198, 214), width=2)
    draw.line([(415, 120), (415, 315)], fill=(185, 198, 214), width=2)

    draw.text((210, 140), "BAY 1", fill=(100, 116, 139))
    draw.text((325, 140), "BAY 2", fill=(100, 116, 139))
    draw.text((435, 140), "BAY 3", fill=(100, 116, 139))

    draw.text((230, 260), "CATL CENTRAL PCS 2.5 MW / 1500V", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 25. CATL String Inverter PCS 125 kW / 400V
# ------------------------------------------------------------------------------
def draw_string_pcs_125():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 340, 160, 20, opacity=45)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Wall mount string inverter
    draw.rounded_rectangle([250, 100, 470, 320], radius=16, fill=(248, 250, 253), outline=(215, 225, 235), width=2)
    # Cooling fins on top
    for fx in range(270, 450, 15):
        draw.line([(fx, 80), (fx, 100)], fill=(170, 185, 200), width=3)

    # Front display
    draw.rounded_rectangle([290, 150, 430, 230], radius=8, fill=(20, 30, 45), outline=(0, 102, 255))
    draw.text((310, 175), "125 kW / 400V", fill=(0, 220, 255))
    draw.text((310, 195), "C&I STRING PCS", fill=(16, 185, 129))

    draw.text((290, 270), "CATL STRING PCS", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 26. CATL Industrial 3-Tier BMS
# ------------------------------------------------------------------------------
def draw_bms_industrial():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 180, 20, opacity=45)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([210, 130, 510, 290], radius=8, fill=(25, 35, 48), outline=(50, 70, 95), width=2)
    # 3 Tiers indicators
    draw.text((230, 155), "TIER 1: CELL LEVEL (BMU)", fill=(0, 220, 140))
    draw.text((230, 185), "TIER 2: RACK LEVEL (BCU)", fill=(0, 200, 255))
    draw.text((230, 215), "TIER 3: SYSTEM LEVEL (BAU)", fill=(255, 180, 0))

    # Activity LEDs
    for i in range(8):
        draw.ellipse([450, 150 + i * 15, 458, 158 + i * 15], fill=(0, 220, 120))

    draw.text((230, 255), "CATL INDUSTRIAL 3-TIER BMS", fill=(255, 255, 255))
    return canvas

# ------------------------------------------------------------------------------
# 27. CATL Smart EMS & SCADA Controller Platform
# ------------------------------------------------------------------------------
def draw_smart_ems_scada():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 190, 22, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Server rack enclosure
    draw.rounded_rectangle([230, 80, 490, 330], radius=10, fill=(30, 40, 55), outline=(60, 80, 105), width=2)
    # Dual LCD Monitoring consoles
    draw.rectangle([250, 110, 470, 180], fill=(10, 20, 32), outline=(0, 102, 255))
    draw.text((270, 130), "SCADA DISPATCH CONSOLE", fill=(0, 220, 255))
    draw.text((270, 150), "TELEMETRY 100ms · IEC 61850", fill=(16, 185, 129))

    # Rack mount servers
    for i in range(4):
        sy = 195 + i * 28
        draw.rectangle([250, sy, 470, sy + 22], fill=(20, 28, 40))
        draw.ellipse([260, sy + 7, 268, sy + 15], fill=(0, 220, 120))

    draw.text((250, 305), "CATL SMART EMS & SCADA", fill=(255, 255, 255))
    return canvas

# ------------------------------------------------------------------------------
# 28. CATL Smart Cloud EMS Controller
# ------------------------------------------------------------------------------
def draw_ems_smartcloud():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 335, 160, 20, opacity=45)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([240, 110, 480, 300], radius=12, fill=(245, 248, 252), outline=(210, 220, 235), width=2)
    # Antenna
    draw.line([(450, 55), (450, 110)], fill=(80, 95, 115), width=4)
    draw.ellipse([446, 50, 454, 58], fill=(60, 75, 95))

    # Cloud Graphic
    draw.rounded_rectangle([270, 140, 450, 220], radius=8, fill=(18, 28, 42))
    draw.text((290, 165), "CLOUD GATEWAY 5G/4G", fill=(0, 210, 255))
    draw.text((290, 185), "REALTIME AI DISPATCH", fill=(16, 185, 129))

    draw.text((270, 255), "CATL SMART CLOUD EMS", fill=(0, 91, 255))
    return canvas

# ------------------------------------------------------------------------------
# 29. CATL Intelligent Liquid Cooling Chiller Unit (40/60 kW)
# ------------------------------------------------------------------------------
def draw_liquid_cooling_chiller():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 210, 24, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle([200, 90, 520, 330], radius=12, fill=(246, 249, 253), outline=(205, 216, 230), width=2)

    # Twin High-Airflow Fans
    for fx in [280, 440]:
        draw.ellipse([fx - 55, 115, fx + 55, 225], fill=(30, 42, 58), outline=(0, 102, 255), width=2)
        for a in range(0, 360, 45):
            rad = math.radians(a)
            draw.line([(fx, 170), (int(fx + 42 * math.cos(rad)), int(170 + 42 * math.sin(rad)))], fill=(90, 110, 135), width=4)

    # Temperature status
    draw.rectangle([230, 250, 330, 305], fill=(15, 25, 40), outline=(0, 102, 255))
    draw.text((245, 262), "18.5°C", fill=(0, 230, 255))
    draw.text((245, 280), "PUMP FLOW 120L/M", fill=(0, 220, 140))

    draw.text((360, 260), "CATL LIQUID CHILLER", fill=(0, 91, 255))
    draw.text((360, 280), "40 kW / 60 kW HIGH EFFICIENCY", fill=(71, 85, 105))
    return canvas

# ------------------------------------------------------------------------------
# 30. CATL Multi-Stage Fire Suppression & Safety Unit (Novec 1230)
# ------------------------------------------------------------------------------
def draw_fire_suppression():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 350, 160, 20, opacity=50)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Dual Cylinders
    for cx in [290, 430]:
        draw.rounded_rectangle([cx - 50, 105, cx + 50, 335], radius=18, fill=(220, 38, 38), outline=(180, 28, 28), width=2)
        # Valve & Gauge
        draw.rectangle([cx - 15, 75, cx + 15, 105], fill=(180, 190, 205), outline=(130, 145, 160))
        draw.ellipse([cx - 12, 55, cx + 12, 79], fill=(245, 250, 255), outline=(100, 115, 130), width=2)
        draw.line([(cx, 67), (cx + 6, 62)], fill=(220, 30, 30), width=2)

        # Yellow Hazard Band
        draw.rectangle([cx - 50, 175, cx + 50, 210], fill=(250, 204, 21))
        draw.text((cx - 38, 186), "NOVEC 1230", fill=(0, 0, 0))

    # Interconnecting manifold pipe
    draw.line([(290, 90), (430, 90)], fill=(180, 190, 205), width=6)

    draw.text((285, 260), "CATL FIRE SAFETY", fill=(255, 255, 255))
    draw.text((275, 280), "NFPA 855 CERTIFIED", fill=(255, 255, 255))
    return canvas

# ------------------------------------------------------------------------------
# 31. CATL MV Step-Up Transformer Station 10/35 kV (TMG 2500 kVA)
# ------------------------------------------------------------------------------
def draw_mv_transformer():
    canvas = create_base_canvas()
    s_layer = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_layer)
    add_soft_shadow(s_draw, 360, 345, 220, 24, opacity=55)
    s_layer = s_layer.filter(ImageFilter.GaussianBlur(13))
    canvas.alpha_composite(s_layer)

    draw = ImageDraw.Draw(canvas)
    # Transformer Tank
    draw.rectangle([220, 140, 500, 330], fill=(215, 224, 234), outline=(180, 192, 206), width=2)

    # Cooling Radiator Fins Left & Right
    for fy in range(165, 310, 10):
        draw.line([(180, fy), (220, fy)], fill=(165, 178, 192), width=3)
        draw.line([(500, fy), (540, fy)], fill=(165, 178, 192), width=3)

    # Oil Conservator Cylindrical Tank
    draw.rounded_rectangle([290, 85, 430, 125], radius=12, fill=(230, 238, 248), outline=(185, 195, 208), width=2)

    # 3 High Voltage Bushings (3-Phase)
    for bx in [280, 360, 440]:
        draw.polygon([(bx - 10, 140), (bx + 10, 140), (bx + 5, 80), (bx - 5, 80)], fill=(185, 105, 65))
        for ry in range(85, 135, 10):
            draw.line([(bx - 9, ry), (bx + 9, ry)], fill=(155, 75, 40), width=2)
        # Copper Terminal Top
        draw.rectangle([bx - 3, 70, bx + 3, 80], fill=(220, 160, 60))

    draw.text((260, 200), "CATL MV STEP-UP SUBSTATION", fill=(0, 91, 255))
    draw.text((260, 225), "0.69 / 10(35) kV · TMG 2500 kVA", fill=(30, 41, 59))
    return canvas

# ------------------------------------------------------------------------------
# DISPATCH TABLE MAPPING EVERY PRODUCT ID TO ITS DEDICATED GENERATOR
# ------------------------------------------------------------------------------
ASSET_GENERATORS = {
    'catl-tener-6250.webp': draw_tener_6250,
    'catl-tener-h.webp': draw_tener_h,
    'catl-tener-s.webp': draw_tener_s,
    'catl-tener-stack.webp': draw_tener_stack,
    'catl-enerc-plus.webp': draw_enerc_plus,
    'catl-enerd-5000.webp': draw_enerd_5000,
    'catl-enerone-plus.webp': draw_enerone_plus,
    'catl-enerone-372.webp': draw_enerone_372,
    'catl-unic-1000.webp': draw_unic_1000,
    'catl-ci-peak-shaving-250.webp': draw_ci_peak_shaving,
    'catl-ci-solar-storage-turnkey.webp': draw_ci_solar_storage,
    'catl-ci-microgrid-500.webp': draw_ci_microgrid,
    'catl-microgrid-500.webp': draw_microgrid_station,
    'catl-residential-pr15.webp': draw_residential_pr15,
    'catl-residential-pr30.webp': draw_residential_pr30,
    'catl-home-solar-hybrid-backup.webp': draw_home_hybrid,
    'catl-home-high-voltage-20.webp': draw_home_hv_stack,
    'catl-cell-314ah.webp': draw_cell_314ah,
    'catl-lfp-cell-280ah.webp': draw_cell_280ah,
    'catl-lfp-cell-587ah.webp': draw_cell_587ah,
    'catl-bess-rack-1500v.webp': draw_rack_1500v,
    'catl-battery-module-1p52s.webp': draw_module_1p52s,
    'catl-pcs-1250kw.webp': draw_pcs_1250kw,
    'catl-central-pcs-skid.webp': draw_central_pcs_skid,
    'catl-string-pcs-125.webp': draw_string_pcs_125,
    'catl-mv-transformer-station.webp': draw_mv_transformer,
    'catl-bms-industrial.webp': draw_bms_industrial,
    'catl-smart-ems-scada.webp': draw_smart_ems_scada,
    'catl-ems-smartcloud.webp': draw_ems_smartcloud,
    'catl-liquid-cooling-chiller.webp': draw_liquid_cooling_chiller,
    'catl-fire-suppression-system.webp': draw_fire_suppression,
}

def main():
    print(f"Generating 31 INDIVIDUALLY UNIQUE white-background assets with custom drop shadows...")
    for filename, generator_func in ASSET_GENERATORS.items():
        img = generator_func()
        save_webp(img, filename)
    print("Done! All 31 product images successfully created with seamless white backgrounds and custom ambient drop shadows.")

if __name__ == '__main__':
    main()
