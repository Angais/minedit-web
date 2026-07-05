// Voxelizes the real "a wooden house" build script (the viral demo build)
// into flat render data for the hero animation. Interior blocks that can't
// be seen from outside are dropped via an exterior flood fill.
//
// Run: node scripts/generate-house.mjs

import { writeFileSync } from 'node:fs'

// ---------------------------------------------------------------- mini api

const grid = new Map()
const key = (x, y, z) => `${x},${y},${z}`

const api = {
  set(x, y, z, name) {
    if (name === 'air') grid.delete(key(x, y, z))
    else grid.set(key(x, y, z), name)
  },
  fill(x1, y1, z1, x2, y2, z2, name) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
        for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
          api.set(x, y, z, name)
  },
}

// ------------------------------------------------- the user's build script

function build(api) {
  var i, x, z, h

  function log(x1, y1, z1, x2, y2, z2, axis) {
    api.fill(x1, y1, z1, x2, y2, z2, 'spruce_log', { axis: axis })
  }
  function winFrontBack(x1, x2, y1, y2, z) {
    api.fill(x1, y1, z, x2, y2, z, 'glass_pane')
  }
  function winSide(x, z1, z2, y1, y2) {
    api.fill(x, y1, z1, x, y2, z2, 'glass_pane')
  }
  function torch(x, y, z, face) {
    api.set(x, y, z, 'wall_torch', { facing: face })
  }

  api.fill(0, 0, 0, 17, 0, 21, 'grass_block')
  api.fill(2, 0, 2, 15, 0, 19, 'cobblestone')
  api.fill(3, 0, 3, 14, 0, 18, 'spruce_planks')

  api.fill(2, 1, 2, 15, 8, 2, 'oak_planks')
  api.fill(2, 1, 19, 15, 8, 19, 'oak_planks')
  api.fill(2, 1, 3, 2, 8, 18, 'oak_planks')
  api.fill(15, 1, 3, 15, 8, 18, 'oak_planks')

  log(2, 4, 3, 2, 4, 18, 'z')
  log(15, 4, 3, 15, 4, 18, 'z')
  log(2, 4, 2, 15, 4, 2, 'x')
  log(2, 4, 19, 15, 4, 19, 'x')
  log(2, 1, 2, 2, 8, 2, 'y')
  log(15, 1, 2, 15, 8, 2, 'y')
  log(2, 1, 19, 2, 8, 19, 'y')
  log(15, 1, 19, 15, 8, 19, 'y')
  log(2, 1, 11, 2, 8, 11, 'y')
  log(15, 1, 11, 15, 8, 11, 'y')
  log(7, 1, 2, 7, 3, 2, 'y')
  log(10, 1, 2, 10, 3, 2, 'y')

  api.fill(3, 4, 3, 14, 4, 18, 'oak_planks')
  api.fill(3, 4, 5, 4, 4, 7, 'air')

  for (x = 3; x <= 14; x++) {
    h = Math.min(x - 1, 16 - x)
    if (h >= 2) {
      api.fill(x, 9, 2, x, 7 + h, 2, 'oak_planks')
      api.fill(x, 9, 19, x, 7 + h, 19, 'oak_planks')
      api.fill(x, 8, 11, x, 7 + h, 11, 'oak_planks')
    }
  }
  api.fill(3, 5, 11, 14, 7, 11, 'oak_planks')

  for (i = 0; i < 7; i++) {
    api.fill(1 + i, 8 + i, 1, 1 + i, 8 + i, 20, 'spruce_stairs')
    api.fill(16 - i, 8 + i, 1, 16 - i, 8 + i, 20, 'spruce_stairs')
  }
  api.fill(8, 14, 1, 9, 14, 20, 'oak_planks')
  api.fill(8, 15, 1, 8, 15, 20, 'spruce_stairs')
  api.fill(9, 15, 1, 9, 15, 20, 'spruce_stairs')

  log(3, 8, 5, 14, 8, 5, 'x')
  log(3, 8, 9, 14, 8, 9, 'x')
  log(3, 8, 13, 14, 8, 13, 'x')
  log(3, 8, 17, 14, 8, 17, 'x')

  winFrontBack(4, 5, 2, 3, 2)
  winFrontBack(12, 13, 2, 3, 2)
  winFrontBack(5, 6, 5, 6, 2)
  winFrontBack(11, 12, 5, 6, 2)
  winFrontBack(8, 9, 10, 11, 2)
  winFrontBack(4, 5, 2, 3, 19)
  winFrontBack(5, 6, 5, 6, 19)
  winFrontBack(11, 12, 5, 6, 19)
  winFrontBack(8, 9, 10, 11, 19)
  winSide(2, 9, 10, 2, 3)
  winSide(2, 14, 15, 2, 3)
  winSide(2, 5, 6, 5, 6)
  winSide(2, 9, 10, 5, 6)
  winSide(15, 5, 6, 2, 3)
  winSide(15, 9, 10, 2, 3)
  winSide(15, 5, 6, 5, 6)
  winSide(15, 14, 15, 5, 6)

  api.fill(8, 1, 2, 9, 2, 2, 'air')
  api.set(8, 1, 2, 'oak_door')
  api.set(8, 2, 2, 'oak_door')
  api.set(9, 1, 2, 'oak_door')
  api.set(9, 2, 2, 'oak_door')
  api.fill(7, 3, 1, 10, 3, 1, 'spruce_stairs')
  api.set(7, 2, 1, 'lantern')
  api.set(10, 2, 1, 'lantern')

  api.fill(3, 1, 6, 4, 1, 6, 'oak_planks')
  api.fill(3, 1, 7, 4, 2, 7, 'oak_planks')
  api.fill(3, 1, 5, 4, 1, 5, 'spruce_stairs')
  api.fill(3, 2, 6, 4, 2, 6, 'spruce_stairs')
  api.fill(3, 3, 7, 4, 3, 7, 'spruce_stairs')
  api.fill(5, 5, 4, 5, 5, 7, 'oak_fence')
  api.fill(3, 5, 4, 4, 5, 4, 'oak_fence')

  api.fill(11, 1, 19, 13, 4, 19, 'stone_bricks')
  api.fill(11, 0, 18, 13, 0, 18, 'stone_bricks')
  api.set(11, 1, 18, 'stone_bricks')
  api.set(13, 1, 18, 'stone_bricks')
  api.set(12, 1, 18, 'campfire')
  api.fill(11, 2, 18, 13, 2, 18, 'stone_brick_slab')

  api.set(14, 1, 13, 'barrel')
  api.set(14, 1, 14, 'furnace')
  api.set(14, 1, 15, 'smoker')
  api.set(14, 1, 16, 'crafting_table')
  api.set(14, 1, 17, 'cauldron')
  api.set(14, 1, 18, 'barrel')

  api.set(8, 1, 9, 'oak_fence')
  api.set(8, 1, 10, 'oak_fence')
  api.set(8, 2, 9, 'oak_pressure_plate')
  api.set(8, 2, 10, 'oak_pressure_plate')
  api.set(7, 1, 9, 'spruce_stairs')
  api.set(7, 1, 10, 'spruce_stairs')
  api.set(9, 1, 9, 'spruce_stairs')
  api.set(9, 1, 10, 'spruce_stairs')

  api.set(6, 1, 3, 'spruce_stairs')
  api.set(7, 1, 3, 'spruce_stairs')
  api.fill(3, 1, 12, 3, 2, 13, 'bookshelf')
  api.fill(6, 1, 12, 9, 1, 15, 'red_carpet')
  api.set(4, 1, 18, 'chest')
  api.set(3, 1, 18, 'barrel')
  api.set(3, 2, 18, 'lantern')

  torch(3, 3, 8, 'east')
  torch(3, 3, 16, 'east')
  torch(14, 3, 8, 'west')
  torch(6, 3, 18, 'north')
  torch(10, 3, 3, 'south')

  api.fill(8, 5, 11, 8, 6, 11, 'air')
  api.set(8, 5, 11, 'spruce_door')
  api.set(8, 6, 11, 'spruce_door')

  api.set(12, 5, 3, 'red_bed')
  api.set(12, 5, 4, 'red_bed')
  api.set(13, 5, 3, 'barrel')
  api.set(13, 6, 3, 'lantern')
  api.set(14, 5, 3, 'loom')
  api.fill(14, 5, 7, 14, 6, 8, 'bookshelf')
  api.set(13, 5, 10, 'crafting_table')
  api.fill(7, 5, 5, 10, 5, 8, 'light_blue_carpet')
  torch(8, 6, 3, 'south')
  torch(14, 6, 4, 'west')
  torch(6, 6, 10, 'north')

  api.set(3, 5, 14, 'white_bed')
  api.set(4, 5, 14, 'white_bed')
  api.set(3, 5, 16, 'white_bed')
  api.set(4, 5, 16, 'white_bed')
  api.set(14, 5, 17, 'chest')
  api.set(14, 5, 18, 'barrel')
  api.fill(14, 5, 12, 14, 6, 13, 'bookshelf')
  api.fill(7, 5, 13, 10, 5, 16, 'red_carpet')
  api.set(3, 5, 18, 'barrel')
  api.set(3, 6, 18, 'lantern')
  torch(8, 6, 12, 'south')
  torch(8, 6, 18, 'north')
  torch(14, 6, 17, 'west')

  api.fill(12, 0, 20, 12, 13, 20, 'cobblestone')
  api.set(12, 14, 20, 'cobblestone_wall')

  api.fill(8, 0, 0, 9, 0, 1, 'cobblestone')
  api.fill(5, 1, 1, 5, 2, 1, 'spruce_fence')
  api.set(5, 3, 1, 'lantern')
  api.fill(12, 1, 1, 12, 2, 1, 'spruce_fence')
  api.set(12, 3, 1, 'lantern')

  api.set(1, 1, 3, 'oak_leaves')
  api.set(1, 1, 16, 'oak_leaves')
  api.set(16, 1, 3, 'oak_leaves')
  api.set(16, 1, 16, 'oak_leaves')

  var flowers = [
    [0, 5, 'poppy'], [0, 11, 'oxeye_daisy'], [0, 18, 'azure_bluet'],
    [17, 7, 'poppy'], [17, 14, 'oxeye_daisy'], [17, 2, 'azure_bluet'],
    [3, 0, 'poppy'], [14, 0, 'oxeye_daisy'], [6, 21, 'poppy'],
    [11, 21, 'azure_bluet'], [16, 20, 'oxeye_daisy'], [1, 20, 'poppy'],
  ]
  for (i = 0; i < flowers.length; i++) {
    api.set(flowers[i][0], 1, flowers[i][1], flowers[i][2])
  }
}

build(api)

// -------------------------------------------------------------- processing

// Torches sit on walls; drawn as floating sprites they'd read as a bug
const SKIP = /^(wall_torch|torch)$/
for (const [k, name] of grid) if (SKIP.test(name)) grid.delete(k)

const SIZE = { x: [0, 17], y: [0, 15], z: [0, 21] }

// Keep every block: the interior is on show while the house is roofless
// during the build animation, and the painter's order hides it afterwards.
const visible = []
for (const [k, name] of grid) {
  const [x, y, z] = k.split(',').map(Number)
  visible.push({ x, y, z, name })
}

// Mirror z so the porch and front door face the camera
const maxZ = SIZE.z[1]
for (const b of visible) b.z = maxZ - b.z

// A couple of tapered dirt/stone rims under the grass so the model reads
// as a floating island chunk instead of a paper-thin slab.
for (let x = SIZE.x[0]; x <= SIZE.x[1]; x++)
  for (let z = 0; z <= maxZ; z++) {
    const onRim = x === SIZE.x[0] || x === SIZE.x[1] || z === 0 || z === maxZ
    if (onRim) visible.push({ x, y: -1, z, name: 'dirt' })
    const onRim2 =
      (x === SIZE.x[0] + 1 || x === SIZE.x[1] - 1 || z === 1 || z === maxZ - 1) &&
      x > SIZE.x[0] && x < SIZE.x[1] && z > 0 && z < maxZ
    if (onRim2) visible.push({ x, y: -2, z, name: 'stone' })
  }

// ------------------------------------------------------- textures & shapes

// block name -> baked texture id (public/textures/baked/<id>_{t,f,r}.png),
// or a billboard sprite (<id>_s.png)
const TEX = {
  grass_block: 'grass_block',
  dirt: 'dirt',
  stone: 'stone',
  cobblestone: 'cobblestone',
  cobblestone_wall: 'cobblestone',
  spruce_planks: 'spruce_planks',
  spruce_stairs: 'spruce_planks',
  spruce_door: 'spruce_planks',
  spruce_fence: 'spruce_planks',
  oak_planks: 'oak_planks',
  oak_fence: 'oak_planks',
  oak_pressure_plate: 'oak_planks',
  spruce_log: 'spruce_log',
  glass_pane: 'glass',
  stone_bricks: 'stone_bricks',
  stone_brick_slab: 'stone_bricks',
  oak_leaves: 'oak_leaves',
  lantern: 'lantern_s',
  poppy: 'poppy_s',
  oxeye_daisy: 'oxeye_daisy_s',
  azure_bluet: 'azure_bluet_s',
  // interior
  barrel: 'barrel',
  chest: 'barrel',
  furnace: 'furnace',
  smoker: 'smoker',
  crafting_table: 'crafting_table',
  cauldron: 'cauldron',
  bookshelf: 'bookshelf',
  loom: 'loom',
  campfire: 'campfire',
  red_bed: 'red_wool',
  white_bed: 'white_wool',
  red_carpet: 'red_wool',
  light_blue_carpet: 'light_blue_wool',
}

const texOf = (b) => {
  if (b.name === 'oak_door') {
    // door half: top if the block below is also a door
    const below = visible.some(
      (o) => o.name === 'oak_door' && o.x === b.x && o.z === b.z && o.y === b.y - 1,
    )
    return below ? 'oak_door_top' : 'oak_door_bottom'
  }
  return TEX[b.name]
}

// shape indices, mirrored in VoxelHouse:
// 0 full, 1 slab, 2 sprite, 3 post, 4 thin layer (carpets, plates)
const SHAPE = {
  stone_brick_slab: 1,
  red_bed: 1,
  white_bed: 1,
  campfire: 1,
  lantern: 2,
  poppy: 2,
  oxeye_daisy: 2,
  azure_bluet: 2,
  oak_fence: 3,
  spruce_fence: 3,
  cobblestone_wall: 3,
  red_carpet: 4,
  light_blue_carpet: 4,
  oak_pressure_plate: 4,
}

const missing = new Set(
  visible.map((b) => b.name).filter((n) => n !== 'oak_door' && !TEX[n]),
)
if (missing.size) {
  console.error('No texture for:', [...missing].join(', '))
  process.exit(1)
}

// Painter's order for this projection: ascending x+y+z never occludes wrong
visible.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.y - b.y)

const names = [...new Set(visible.map(texOf))]
const blocks = visible.map((b) => [b.x, b.y, b.z, names.indexOf(texOf(b)), SHAPE[b.name] ?? 0])

const out = `// Generated by scripts/generate-house.mjs — do not edit by hand.
// The real "a wooden house" build from the viral demo, exterior shell only.

export type HouseBlock = [x: number, y: number, z: number, texture: number, shape: number]

export const TEXTURES: string[] = ${JSON.stringify(names)}

export const BLOCKS: HouseBlock[] = ${JSON.stringify(blocks)}
`

writeFileSync(new URL('../src/components/house-data.ts', import.meta.url), out)
console.log(`Wrote ${blocks.length} visible blocks (${grid.size} placed total)`)
