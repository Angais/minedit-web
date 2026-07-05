# Bakes the raw Minecraft block textures (extracted from the local game jar)
# into pre-shaded, pre-tinted face textures for the isometric hero render:
#   <id>_t.png  top face
#   <id>_f.png  front face (+z, the door side), slightly shaded
#   <id>_r.png  right face (+x), darkest
#   <id>_s.png  billboard sprites (flowers, lanterns)
#
# Run: python3 scripts/bake_textures.py

import os
from PIL import Image

SRC = 'public/textures'
OUT = 'public/textures/baked'
SIZE = 16  # native resolution; the canvas upscales with nearest-neighbor

FRONT_SHADE = 0.80
RIGHT_SHADE = 0.62

GRASS_TINT = (124, 191, 93)
LEAF_TINT = (89, 174, 48)


def load(name):
    img = Image.open(f'{SRC}/{name}.png').convert('RGBA')
    if img.height > img.width:  # animation strip: take the first frame
        img = img.crop((0, 0, img.width, img.width))
    return img


def tint(img, rgb):
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            px[x, y] = (r * rgb[0] // 255, g * rgb[1] // 255, b * rgb[2] // 255, a)
    return out


def shade(img, f):
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            px[x, y] = (round(r * f), round(g * f), round(b * f), a)
    return out


def save(img, name):
    img.resize((SIZE, SIZE), Image.NEAREST).save(f'{OUT}/{name}.png')


os.makedirs(OUT, exist_ok=True)

grass_top = tint(load('grass_block_top'), GRASS_TINT)
grass_side = load('grass_block_side')
grass_side.alpha_composite(tint(load('grass_block_side_overlay'), GRASS_TINT))

glass = Image.new('RGBA', (16, 16), (168, 208, 226, 255))
glass.alpha_composite(load('glass'))

oak_planks = load('oak_planks')

# id -> (top texture, front texture, right texture)
blocks = {
    'grass_block': (grass_top, grass_side, grass_side),
    'dirt': (load('dirt'),) * 3,
    'stone': (load('stone'),) * 3,
    'cobblestone': (load('cobblestone'),) * 3,
    'stone_bricks': (load('stone_bricks'),) * 3,
    'spruce_planks': (load('spruce_planks'),) * 3,
    'oak_planks': (oak_planks,) * 3,
    'spruce_log': (load('spruce_log_top'), load('spruce_log'), load('spruce_log')),
    'glass': (glass,) * 3,
    'oak_door_top': (oak_planks, load('oak_door_top'), load('oak_door_top')),
    'oak_door_bottom': (oak_planks, load('oak_door_bottom'), load('oak_door_bottom')),
    'oak_leaves': (tint(load('oak_leaves'), LEAF_TINT),) * 3,
    # interior blocks, visible while the house is still roofless
    'barrel': (load('barrel_top'), load('barrel_side'), load('barrel_side')),
    'furnace': (load('furnace_top'), load('furnace_front'), load('furnace_side')),
    'smoker': (load('smoker_top'), load('smoker_front'), load('smoker_side')),
    'crafting_table': (load('crafting_table_top'), load('crafting_table_front'), load('crafting_table_front')),
    'cauldron': (load('cauldron_top'), load('cauldron_side'), load('cauldron_side')),
    'bookshelf': (oak_planks, load('bookshelf'), load('bookshelf')),
    'loom': (load('loom_top'), load('loom_front'), load('loom_front')),
    'red_wool': (load('red_wool'),) * 3,
    'white_wool': (load('white_wool'),) * 3,
    'light_blue_wool': (load('light_blue_wool'),) * 3,
    'campfire': (load('campfire_log_lit'),) * 3,
}

for name, (top, front, right) in blocks.items():
    save(top, f'{name}_t')
    save(shade(front, FRONT_SHADE), f'{name}_f')
    save(shade(right, RIGHT_SHADE), f'{name}_r')

# Billboard sprites: crop to content, pad square, keep transparency.
# Note: lantern.png must be the *item* icon from textures/item/, because the
# block texture is a UV atlas for the 3D model, not a drawable sprite.
for name in ['poppy', 'oxeye_daisy', 'azure_bluet', 'lantern']:
    img = load(name)
    box = img.getbbox()
    img = img.crop(box)
    side = max(img.width, img.height)
    padded = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    padded.paste(img, ((side - img.width) // 2, side - img.height))
    save(padded, f'{name}_s')

print('Baked', len(blocks) * 3 + 4, 'textures into', OUT)
