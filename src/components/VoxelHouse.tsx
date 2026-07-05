import { useEffect, useRef } from 'react'
import { BLOCKS, TEXTURES } from './house-data'

// Isometric cell metrics (world units)
const HW = 10 // half-width of a cell's top diamond
const HH = 5 // half-height of a cell's top diamond
const VH = 10 // vertical height of a cell

const SCALE = 3 // canvas pixels per world unit

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

type Textures = (HTMLImageElement | { t: HTMLImageElement; f: HTMLImageElement; r: HTMLImageElement })[]

let texturesPromise: Promise<Textures> | null = null

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function loadTextures(): Promise<Textures> {
  texturesPromise ??= Promise.all(
    TEXTURES.map(async (name) => {
      if (name.endsWith('_s')) return loadImage(`/textures/baked/${name}.png`)
      const [t, f, r] = await Promise.all(
        ['t', 'f', 'r'].map((face) => loadImage(`/textures/baked/${name}_${face}.png`)),
      )
      return { t, f, r }
    }),
  )
  return texturesPromise
}

// Maps a 16x16 texture onto the parallelogram at origin o with edges u, v
function face(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  ox: number, oy: number,
  ux: number, uy: number,
  vx: number, vy: number,
) {
  const k = SCALE
  ctx.setTransform(
    (k * ux) / 16, (k * uy) / 16,
    (k * vx) / 16, (k * vy) / 16,
    k * (ox - bounds.minX), k * (oy - bounds.minY),
  )
  ctx.drawImage(img, 0, 0)
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  b: (typeof BLOCKS)[number],
  tex: Textures[number],
  lift: number,
) {
  const [bx, by, bz, , si] = b

  if (tex instanceof HTMLImageElement) {
    // billboard sprite standing on the cell floor; lanterns are smaller
    const w = (TEXTURES[b[3]] === 'lantern_s' ? 1.15 : 1.7) * HW
    const cx = px(bx, bz)
    const cy = py(bx + 0.5, bz + 0.5, by) + lift
    face(ctx, tex, cx - w / 2, cy - w, w, 0, 0, w)
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
  face(ctx, tex.t,
    px(x0, z0), py(x0, z0, y1) + lift,
    dx * HW, dx * HH,
    -dz * HW, dz * HH)
  // right (+x)
  face(ctx, tex.r,
    px(x1, z0), py(x1, z0, y1) + lift,
    -dz * HW, dz * HH,
    0, h * VH)
  // front (+z)
  face(ctx, tex.f,
    px(x0, z1), py(x0, z1, y1) + lift,
    dx * HW, dx * HH,
    0, h * VH)
}

export function VoxelHouse({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let disposed = false

    loadTextures().then((textures) => {
      if (disposed) return
      let start = performance.now()
      let holdDrawn = false

      const redraw = (cycleT: number) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.imageSmoothingEnabled = false
        for (let i = 0; i < BLOCKS.length; i++) {
          const b = BLOCKS[i]
          const d = delayOf(b)
          if (cycleT < d) continue
          const p = Math.min(1, (cycleT - d) / APPEAR_MS)
          const ease = 1 - (1 - p) ** 3
          ctx.globalAlpha = p
          drawBlock(ctx, b, textures[b[3]], (1 - ease) * -14)
        }
        ctx.globalAlpha = 1
      }

      const frame = (now: number) => {
        const cycleT = (now - start) % (BUILD_MS + HOLD_MS + FADE_MS)

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
        raf = requestAnimationFrame(frame)
      }

      canvas.style.transition = `opacity ${FADE_MS}ms ease`
      start = performance.now()
      raf = requestAnimationFrame(frame)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={Math.round(bounds.w * SCALE)}
      height={Math.round(bounds.h * SCALE)}
      className={className}
      style={{ aspectRatio: `${bounds.w} / ${bounds.h}` }}
      aria-hidden
    />
  )
}
