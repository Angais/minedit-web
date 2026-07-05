import { useEffect, useRef } from 'react'
import { ATLAS, TILE } from './atlas-data'
import { BLOCKS, TEXTURES } from './house-data'

// Isometric cell metrics (world units)
const HW = 10 // half-width of a cell's top diamond
const HH = 5 // half-height of a cell's top diamond
const VH = 10 // vertical height of a cell

// shape index -> horizontal inset (cells) and height (cells)
// 2 = billboard sprite (flowers, lanterns)
const SHAPES = [
  { inset: 0, h: 1 },
  { inset: 0, h: 0.5 },
  { inset: 0, h: 1 },
  { inset: 0.32, h: 1 },
  { inset: 0, h: 0.09 },
]

const px = (x: number, z: number) => (x - z) * HW
const py = (x: number, z: number, y: number) => (x + z) * HH - y * VH

// Reveal delay: bottom layers first, sweeping across each layer
const delayOf = (b: (typeof BLOCKS)[number]) => (b[1] + 2) * 185 + (b[0] + b[2]) * 4

const APPEAR_MS = 220
const BUILD_MS = Math.max(...BLOCKS.map(delayOf)) + APPEAR_MS + 100
const HOLD_MS = 4200
const FADE_MS = 550

const PAD = 10
const bounds = (() => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const [x, y, z] of BLOCKS) {
    minX = Math.min(minX, px(x, z + 1))
    maxX = Math.max(maxX, px(x + 1, z))
    minY = Math.min(minY, py(x, z, y + 1) - VH) // sprite headroom
    maxY = Math.max(maxY, py(x + 1, z + 1, y))
  }
  return { minX: minX - PAD, minY: minY - PAD, w: maxX - minX + PAD * 2, h: maxY - minY + PAD * 2 }
})()

// atlas tile offsets per TEXTURES entry: sprite tile, or one tile per face
type Tex = [number, number] | { t: [number, number]; f: [number, number]; r: [number, number] }

const TEXTURE_TILES: Tex[] = TEXTURES.map((name) =>
  name.endsWith('_s')
    ? ATLAS[name]
    : { t: ATLAS[`${name}_t`], f: ATLAS[`${name}_f`], r: ATLAS[`${name}_r`] },
)

let atlasPromise: Promise<HTMLImageElement> | null = null

function loadAtlas() {
  atlasPromise ??= new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = '/textures/atlas.png'
  })
  return atlasPromise
}

// Maps a 16x16 atlas tile onto the parallelogram at origin o with edges u, v
// k = canvas pixels per world unit
function face(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tile: [number, number],
  k: number,
  ox: number, oy: number,
  ux: number, uy: number,
  vx: number, vy: number,
) {
  ctx.setTransform(
    (k * ux) / TILE, (k * uy) / TILE,
    (k * vx) / TILE, (k * vy) / TILE,
    k * (ox - bounds.minX), k * (oy - bounds.minY),
  )
  ctx.drawImage(img, tile[0], tile[1], TILE, TILE, 0, 0, TILE, TILE)
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  b: (typeof BLOCKS)[number],
  img: HTMLImageElement,
  k: number,
  lift: number,
) {
  const [bx, by, bz, ti, si] = b
  const tex = TEXTURE_TILES[ti]

  if (Array.isArray(tex)) {
    // billboard sprite standing on the cell floor; lanterns are smaller
    const w = (TEXTURES[ti] === 'lantern_s' ? 1.15 : 1.7) * HW
    const cx = px(bx, bz)
    const cy = py(bx + 0.5, bz + 0.5, by) + lift
    face(ctx, img, tex, k, cx - w / 2, cy - w, w, 0, 0, w)
    return
  }

  const { inset, h } = SHAPES[si]
  const x0 = bx + inset
  const x1 = bx + 1 - inset
  const z0 = bz + inset
  const z1 = bz + 1 - inset
  const y1 = by + h
  const dx = x1 - x0
  const dz = z1 - z0

  // top
  face(ctx, img, tex.t, k,
    px(x0, z0), py(x0, z0, y1) + lift,
    dx * HW, dx * HH,
    -dz * HW, dz * HH)
  // right (+x)
  face(ctx, img, tex.r, k,
    px(x1, z0), py(x1, z0, y1) + lift,
    -dz * HW, dz * HH,
    0, h * VH)
  // front (+z)
  face(ctx, img, tex.f, k,
    px(x0, z1), py(x0, z1, y1) + lift,
    dx * HW, dx * HH,
    0, h * VH)
}

const CYCLE_MS = BUILD_MS + HOLD_MS + FADE_MS

export function VoxelHouse({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let disposed = false
    let atlas: HTMLImageElement | null = null
    canvas.width = 0 // don't draw until sized to the layout

    // Blocks whose appear animation has finished are baked into an offscreen
    // canvas once per reveal layer, so each frame only draws the few blocks
    // that are still animating instead of all ~2k of them.
    const settled = document.createElement('canvas')
    const sctx = settled.getContext('2d')!
    let settledUpTo = -1 // cycle time the settled layer was baked at
    let k = 1 // canvas pixels per world unit

    // Match the internal resolution to the displayed size (the old fixed
    // resolution was ~5x the CSS size on phones, all wasted fill rate)
    let cssW = 0
    const resize = () => {
      if (!cssW) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(cssW * dpr)
      if (w === canvas.width) return
      canvas.width = w
      canvas.height = Math.round((w * bounds.h) / bounds.w)
      settled.width = canvas.width
      settled.height = canvas.height
      k = canvas.width / bounds.w
      settledUpTo = -1
    }
    const ro = new ResizeObserver((entries) => {
      cssW = entries[0].contentRect.width
    })
    ro.observe(canvas)

    const bakeSettled = (cycleT: number) => {
      sctx.setTransform(1, 0, 0, 1, 0, 0)
      sctx.clearRect(0, 0, settled.width, settled.height)
      sctx.imageSmoothingEnabled = false
      for (const b of BLOCKS) {
        if (delayOf(b) + APPEAR_MS <= cycleT) drawBlock(sctx, b, atlas!, k, 0)
      }
      settledUpTo = cycleT
    }

    const redraw = (cycleT: number) => {
      if (settledUpTo < 0 || cycleT < settledUpTo || cycleT - settledUpTo > 185) {
        bakeSettled(cycleT)
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(settled, 0, 0)
      for (const b of BLOCKS) {
        const d = delayOf(b)
        if (d > cycleT || d + APPEAR_MS <= settledUpTo) continue
        const p = Math.min(1, (cycleT - d) / APPEAR_MS)
        const ease = 1 - (1 - p) ** 3
        ctx.globalAlpha = p
        drawBlock(ctx, b, atlas!, k, (1 - ease) * -14)
      }
      ctx.globalAlpha = 1
    }

    let start = performance.now()
    let pausedAt: number | null = null
    let holdDrawn = false

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      resize()
      if (!canvas.width) return
      const cycleT = (now - start) % CYCLE_MS

      if (cycleT < BUILD_MS) {
        canvas.style.opacity = '1'
        holdDrawn = false
        redraw(cycleT)
      } else if (cycleT < BUILD_MS + HOLD_MS) {
        if (!holdDrawn) {
          holdDrawn = true
          redraw(cycleT)
        }
      } else {
        canvas.style.opacity = '0'
      }
    }

    // Freeze the animation entirely while the hero is offscreen or the tab
    // is hidden; it was burning CPU during the whole page scroll on mobile
    const pause = () => {
      if (pausedAt !== null) return
      pausedAt = performance.now()
      cancelAnimationFrame(raf)
      raf = 0
    }
    const resume = () => {
      if (pausedAt === null || disposed || !atlas) return
      start += performance.now() - pausedAt
      pausedAt = null
      raf = requestAnimationFrame(frame)
    }

    let onScreen = true
    const syncRunning = () => {
      if (onScreen && !document.hidden) resume()
      else pause()
    }
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting)
      syncRunning()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', syncRunning)

    loadAtlas().then((img) => {
      if (disposed) return
      atlas = img
      canvas.style.transition = `opacity ${FADE_MS}ms ease`
      start = performance.now()
      if (pausedAt === null) raf = requestAnimationFrame(frame)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', syncRunning)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ aspectRatio: `${bounds.w} / ${bounds.h}` }}
      aria-hidden
    />
  )
}
