/** Blocky decorative pieces shared across sections. */

export function PixelCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 40" className={className} aria-hidden>
      <g fill="#ffffff">
        <rect x="16" y="16" width="80" height="16" />
        <rect x="8" y="24" width="96" height="16" />
        <rect x="32" y="8" width="40" height="8" />
        <rect x="40" y="0" width="24" height="8" />
      </g>
    </svg>
  )
}

export function PixelSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      {/* rays */}
      <g fill="#f2cc60" opacity="0.55">
        <rect x="44" y="0" width="8" height="14" />
        <rect x="44" y="82" width="8" height="14" />
        <rect x="0" y="44" width="14" height="8" />
        <rect x="82" y="44" width="14" height="8" />
        <rect x="12" y="12" width="10" height="10" />
        <rect x="74" y="12" width="10" height="10" />
        <rect x="12" y="74" width="10" height="10" />
        <rect x="74" y="74" width="10" height="10" />
      </g>
      {/* body */}
      <rect x="28" y="22" width="40" height="52" fill="#f2cc60" />
      <rect x="22" y="28" width="52" height="40" fill="#f2cc60" />
      <rect x="34" y="28" width="28" height="34" fill="#f7df8b" />
      <rect x="28" y="34" width="34" height="22" fill="#f7df8b" />
    </svg>
  )
}

/** A four-pointed sparkle particle. */
export function Sparkle({
  className,
  color = '#f2cc60',
  style,
}: {
  className?: string
  color?: string
  style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 12 12" className={className} style={style} aria-hidden>
      <g fill={color}>
        <rect x="5" y="0" width="2" height="12" />
        <rect x="0" y="5" width="12" height="2" />
        <rect x="3" y="3" width="2" height="2" />
        <rect x="7" y="3" width="2" height="2" />
        <rect x="3" y="7" width="2" height="2" />
        <rect x="7" y="7" width="2" height="2" />
      </g>
    </svg>
  )
}

/** Blocky stepped hill silhouettes for the hero parallax. */
export function Hills({
  className,
  fill,
  variant = 'back',
}: {
  className?: string
  fill: string
  variant?: 'back' | 'front'
}) {
  const points =
    variant === 'back'
      ? '0,200 0,120 80,120 80,80 200,80 200,40 320,40 320,80 440,80 440,120 560,120 560,60 700,60 700,100 820,100 820,140 980,140 980,90 1100,90 1100,130 1240,130 1240,100 1360,100 1360,150 1440,150 1440,200'
      : '0,200 0,150 120,150 120,110 260,110 260,150 420,150 420,90 580,90 580,130 760,130 760,160 920,160 920,110 1080,110 1080,150 1220,150 1220,120 1440,120 1440,200'
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <polygon points={points} fill={fill} />
    </svg>
  )
}

/** A tiling strip of grass-and-dirt pixels used as a section divider. */
export function GrassStrip({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className="block h-8 w-full"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={flip ? 'grass-tile-flip' : 'grass-tile'} width="64" height="32" patternUnits="userSpaceOnUse">
          {/* grass top row */}
          <rect x="0" y="0" width="8" height="8" fill="#5aa94a" />
          <rect x="8" y="0" width="8" height="8" fill="#6db85b" />
          <rect x="16" y="0" width="8" height="8" fill="#57a447" />
          <rect x="24" y="0" width="8" height="8" fill="#79c465" />
          <rect x="32" y="0" width="8" height="8" fill="#5aa94a" />
          <rect x="40" y="0" width="8" height="8" fill="#63b153" />
          <rect x="48" y="0" width="8" height="8" fill="#57a447" />
          <rect x="56" y="0" width="8" height="8" fill="#6db85b" />
          {/* grass-to-dirt transition */}
          <rect x="0" y="8" width="8" height="8" fill="#4c9440" />
          <rect x="8" y="8" width="8" height="8" fill="#8a5a38" />
          <rect x="16" y="8" width="8" height="8" fill="#4c9440" />
          <rect x="24" y="8" width="8" height="8" fill="#54a046" />
          <rect x="32" y="8" width="8" height="8" fill="#8a5a38" />
          <rect x="40" y="8" width="8" height="8" fill="#4c9440" />
          <rect x="48" y="8" width="8" height="8" fill="#54a046" />
          <rect x="56" y="8" width="8" height="8" fill="#8a5a38" />
          {/* dirt rows */}
          <rect x="0" y="16" width="8" height="8" fill="#8a5a38" />
          <rect x="8" y="16" width="8" height="8" fill="#7a5230" />
          <rect x="16" y="16" width="8" height="8" fill="#96653f" />
          <rect x="24" y="16" width="8" height="8" fill="#8a5a38" />
          <rect x="32" y="16" width="8" height="8" fill="#7a5230" />
          <rect x="40" y="16" width="8" height="8" fill="#8a5a38" />
          <rect x="48" y="16" width="8" height="8" fill="#96653f" />
          <rect x="56" y="16" width="8" height="8" fill="#7a5230" />
          <rect x="0" y="24" width="8" height="8" fill="#7a5230" />
          <rect x="8" y="24" width="8" height="8" fill="#8a5a38" />
          <rect x="16" y="24" width="8" height="8" fill="#7a5230" />
          <rect x="24" y="24" width="8" height="8" fill="#96653f" />
          <rect x="32" y="24" width="8" height="8" fill="#8a5a38" />
          <rect x="40" y="24" width="8" height="8" fill="#7a5230" />
          <rect x="48" y="24" width="8" height="8" fill="#8a5a38" />
          <rect x="56" y="24" width="8" height="8" fill="#96653f" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${flip ? 'grass-tile-flip' : 'grass-tile'})`} />
    </svg>
  )
}

/** Dark stone strip with glinting ores, used above the footer. */
export function StoneStrip() {
  return (
    <svg className="block h-10 w-full" aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id="stone-tile" width="96" height="40" patternUnits="userSpaceOnUse">
          <rect width="96" height="40" fill="#3a362e" />
          <rect x="0" y="0" width="8" height="8" fill="#443f36" />
          <rect x="24" y="8" width="8" height="8" fill="#312d26" />
          <rect x="48" y="0" width="8" height="8" fill="#443f36" />
          <rect x="72" y="8" width="8" height="8" fill="#312d26" />
          <rect x="8" y="24" width="8" height="8" fill="#312d26" />
          <rect x="40" y="24" width="8" height="8" fill="#443f36" />
          <rect x="80" y="28" width="8" height="8" fill="#443f36" />
          <rect x="60" y="16" width="8" height="8" fill="#312d26" />
          {/* ores */}
          <rect x="16" y="12" width="6" height="6" fill="#6fd7d2" />
          <rect x="66" y="30" width="6" height="6" fill="#f2cc60" />
          <rect x="88" y="6" width="6" height="6" fill="#d95f5f" />
          <rect x="34" y="32" width="6" height="6" fill="#8fd97f" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stone-tile)" />
    </svg>
  )
}

type IconName = 'layers' | 'cube' | 'shield' | 'undo' | 'coin'

const ICONS: Record<IconName, [number, number][]> = {
  // 10x10 pixel grids, [x, y] filled cells
  layers: [
    [3, 1], [4, 1], [5, 1], [6, 1],
    [2, 2], [7, 2],
    [1, 4], [2, 4], [7, 4], [8, 4],
    [0, 5], [9, 5],
    [1, 7], [2, 7], [7, 7], [8, 7],
    [0, 8], [3, 8], [4, 8], [5, 8], [6, 8], [9, 8],
  ],
  cube: [
    [4, 0], [5, 0],
    [2, 1], [3, 1], [6, 1], [7, 1],
    [0, 2], [1, 2], [8, 2], [9, 2],
    [0, 3], [4, 3], [5, 3], [9, 3],
    [0, 4], [4, 4], [5, 4], [9, 4],
    [0, 5], [4, 5], [5, 5], [9, 5],
    [0, 6], [4, 6], [5, 6], [9, 6],
    [0, 7], [1, 7], [8, 7], [9, 7],
    [2, 8], [3, 8], [6, 8], [7, 8],
    [4, 9], [5, 9],
  ],
  shield: [
    [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0],
    [1, 1], [8, 1],
    [1, 2], [4, 2], [5, 2], [8, 2],
    [1, 3], [3, 3], [6, 3], [8, 3],
    [1, 4], [3, 4], [6, 4], [8, 4],
    [2, 5], [4, 5], [5, 5], [7, 5],
    [2, 6], [7, 6],
    [3, 7], [6, 7],
    [4, 8], [5, 8],
  ],
  undo: [
    [3, 0],
    [2, 1],
    [1, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
    [1, 4], [8, 4],
    [2, 5], [9, 5],
    [3, 6], [9, 6],
    [9, 7],
    [8, 8], [7, 8], [6, 8], [5, 8],
  ],
  coin: [
    [3, 0], [4, 0], [5, 0], [6, 0],
    [1, 1], [2, 1], [7, 1], [8, 1],
    [0, 2], [4, 2], [5, 2], [9, 2],
    [0, 3], [3, 3], [9, 3],
    [0, 4], [3, 4], [4, 4], [5, 4], [9, 4],
    [0, 5], [6, 5], [9, 5],
    [0, 6], [4, 6], [5, 6], [9, 6],
    [1, 7], [2, 7], [7, 7], [8, 7],
    [3, 8], [4, 8], [5, 8], [6, 8],
  ],
}

export function PixelIcon({
  name,
  className,
  color = '#211e16',
}: {
  name: IconName
  className?: string
  color?: string
}) {
  return (
    <svg viewBox="0 0 10 10" className={className} aria-hidden>
      {ICONS[name].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={color} />
      ))}
    </svg>
  )
}

/** Inventory-slot chip that frames a pixel icon, used on feature cards. */
export function IconChip({ name, bg }: { name: IconName; bg: string }) {
  return (
    <span
      className="mc-slot flex h-11 w-11 shrink-0 items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <PixelIcon name={name} className="h-5 w-5" />
    </span>
  )
}

/** Isometric voxel cube in brand greens. */
export function VoxelCube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon points="16,2 29,9 16,16 3,9" fill="#79c465" />
      <polygon points="3,9 16,16 16,30 3,23" fill="#3d7d31" />
      <polygon points="29,9 16,16 16,30 29,23" fill="#4e9e3f" />
    </svg>
  )
}
