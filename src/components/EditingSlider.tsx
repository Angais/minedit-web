import { useCallback, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { Sparkle } from './Pixel'

export function EditingSlider() {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      updateFromClientX(e.clientX)
    },
    [updateFromClientX],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updateFromClientX(e.clientX)
    },
    [updateFromClientX],
  )

  const stopDragging = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <section id="editing" className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-pixel text-[11px] tracking-wide text-grass-dark uppercase">
            ✦ Editing
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-bold tracking-[-0.02em]">
            Builds you can <span className="text-grass">talk to</span>.
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-stone">
            Minedit reads the blocks already in your selection and asks the
            model for small changes instead of a rebuild. This pink house was
            built by hand, then edited with one casual sentence. Drag the
            handle to compare.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          {/* Capped near the screenshots' native width; 2x sources keep retina sharp */}
          <div className="relative mx-auto max-w-[1024px]">
            <Sparkle className="sparkle absolute -top-5 -left-5 z-10 w-5" />
            <Sparkle
              className="sparkle absolute -right-4 -bottom-6 z-10 w-4"
              color="#79c465"
              style={{ animationDelay: '1.2s' }}
            />
            <div className="mc-raised p-2">
              <div
                ref={containerRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stopDragging}
                onPointerLeave={stopDragging}
                className="relative touch-none overflow-hidden border-2 border-ink/20 select-none"
                style={{ cursor: 'ew-resize' }}
              >
                {/* After image (base layer) */}
                <img
                  src="/media/edit-after.webp"
                  srcSet="/media/edit-after.webp 1024w, /media/edit-after@2x.webp 2048w"
                  sizes="(max-width: 1064px) 100vw, 1004px"
                  alt="Pink house after AI editing: windows, doors, chimney and flower planters added"
                  className="block w-full"
                  draggable={false}
                />
                {/* Before image (clipped layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                >
                  <img
                    src="/media/edit-before.webp"
                    srcSet="/media/edit-before.webp 1024w, /media/edit-before@2x.webp 2048w"
                    sizes="(max-width: 1064px) 100vw, 1004px"
                    alt="Plain pink house before AI editing"
                    className="block h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Divider */}
                <div
                  className="absolute inset-y-0 z-10 w-[3px] bg-ink"
                  style={{ left: `${pos}%`, transform: 'translateX(-1.5px)' }}
                >
                  <div className="mc-raised-sm absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M7 5 3 10l4 5M13 5l4 5-4 5" strokeLinecap="square" />
                    </svg>
                  </div>
                </div>

                {/* Labels */}
                <div className="pointer-events-none absolute top-4 left-4 border-2 border-black/50 bg-[#211e16]/92 px-3 py-2 font-mono text-[11.5px] tracking-wide text-[#f0ede2]">
                  <span className="font-pixel mr-2 text-[9px] text-[#8a877a]">BEFORE</span>
                  built by hand
                </div>
                <div className="pointer-events-none absolute top-4 right-4 border-2 border-black/50 bg-[#211e16]/92 px-3 py-2 font-mono text-[11.5px] tracking-wide text-leaf">
                  <span className="font-pixel mr-2 text-[9px] text-[#8a877a]">AFTER</span>
                  /edit make the house look better
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick-edit chain from README examples */}
        <div className="mt-28 grid gap-14 md:grid-cols-2 md:items-center">
          <Reveal>
            <h3 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] leading-tight font-bold tracking-[-0.02em]">
              Small changes, small patches.
            </h3>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-stone">
              Quick edit sends a compact snapshot of your build, so the model
              answers with a few precise operations instead of regenerating
              everything. It's fast, cheap, and the rest of your build stays
              untouched.
            </p>
            <div className="mt-8 space-y-3.5">
              {[
                'make the walls red please',
                'can you change the wood for stone? a cool one',
                "don't really like those plants outside, remove them",
              ].map((cmd, i) => (
                <div
                  key={cmd}
                  className="mc-raised-sm flex items-baseline gap-3 px-4 py-3.5 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span className="font-pixel shrink-0 text-[10px] text-grass-dark">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="shrink-0 font-mono text-[13px] font-medium text-grass-dark">
                    /edit quick
                  </span>
                  <span className="font-mono text-[13px] text-ink/80">{cmd}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative pb-14">
              <div className="mc-raised rotate-1 p-1.5 transition-transform duration-300 hover:rotate-0">
                <img
                  src="/media/example-edit-stone.png"
                  alt="Cute house with wooden details swapped to stone by a quick edit"
                  className="block w-full border-2 border-ink/15"
                  loading="lazy"
                />
              </div>
              <div className="mc-raised float-slow absolute bottom-0 left-4 w-[46%] -rotate-2 p-1.5">
                <img
                  src="/media/example-edit-red.png"
                  alt="The same house with walls changed to red"
                  className="block w-full border-2 border-ink/15"
                  loading="lazy"
                />
              </div>
              <Sparkle className="sparkle absolute right-6 bottom-24 w-4" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
