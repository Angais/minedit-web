import { Reveal } from './Reveal'
import { IconChip } from './Pixel'

const stages = [
  'Foundation & frame',
  'Walls & openings',
  'Roof & vertical access',
  'Interior & lighting',
  'Exterior & landscaping',
  'Corrections & polish',
]

const smallCards = [
  {
    icon: 'shield' as const,
    bg: '#a9d8a1',
    title: 'Sandboxed execution',
    body: 'Generated code runs in a restricted JavaScript sandbox with no Java, no filesystem and no network access. Capped at 500k block operations and 30 seconds per run.',
  },
  {
    icon: 'undo' as const,
    bg: '#e8d7a8',
    title: 'Five levels of undo',
    body: '/reset build restores the world snapshot from before each of your last five builds or edits.',
  },
  {
    icon: 'coin' as const,
    bg: '#d9c9f2',
    title: 'Costs in plain sight',
    body: 'Token counts and estimated cost are printed in chat after every generation, so you always know what a build cost you.',
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative px-4 py-24 md:py-36"
      style={{
        backgroundColor: '#332f28',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-pixel text-[11px] tracking-wide text-[#8fd97f] uppercase">
            ⛏ Under the hood
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-bold tracking-[-0.02em] text-[#f5f1e6]">
            A builder, not a <span className="text-[#8fd97f]">schematic library</span>.
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-[#b5af9f]">
            Nothing is pre-made. The model writes compact builder code on the
            fly, and Minedit runs it safely inside your world.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-12">
          {/* Staged builds — large card */}
          <Reveal className="md:col-span-7">
            <div className="mc-dark-raised h-full p-8">
              <div className="flex items-center gap-4">
                <IconChip name="layers" bg="#f2c9cf" />
                <h3 className="font-display text-[22px] font-bold text-[#f5f1e6]">
                  Staged builds
                </h3>
              </div>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#b5af9f]">
                For ambitious structures,{' '}
                <span className="font-mono text-[13.5px] font-medium text-[#8fd97f]">
                  /build stages
                </span>{' '}
                splits the work into six focused passes, each one a separate
                model call that sees what came before.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {stages.map((s, i) => (
                  <div key={s} className="mc-dark-slot px-3.5 py-3">
                    <div className="font-pixel text-[11px] text-[#8fd97f]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="mt-1 text-[13px] leading-snug font-medium text-[#e6e1d3]">
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Providers */}
          <Reveal delay={0.1} className="md:col-span-5">
            <div className="mc-dark-raised flex h-full flex-col p-8">
              <div className="flex items-center gap-4">
                <IconChip name="cube" bg="#c7e6f2" />
                <h3 className="font-display text-[22px] font-bold text-[#f5f1e6]">
                  Bring any model
                </h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[#b5af9f]">
                Model-agnostic by design. Use hundreds of models through
                OpenRouter, or run a local bridge and let Codex or Cursor
                agents draft, preview, and revise before a single block is
                placed.
              </p>
              <div className="mt-auto space-y-2.5 pt-8">
                {[
                  ['/provider openrouter', 'any OpenRouter model'],
                  ['/provider codex-local', 'Codex agent via local bridge'],
                  ['/provider cursor', 'Cursor agent via local bridge'],
                ].map(([cmd, desc]) => (
                  <div key={cmd} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[13px] font-medium text-[#8fd97f]">
                      {cmd}
                    </span>
                    <span className="text-[12.5px] text-[#9a9384]">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {smallCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08} className="md:col-span-4">
              <div className="mc-dark-raised h-full p-7 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center gap-3.5">
                  <IconChip name={card.icon} bg={card.bg} />
                  <h3 className="font-display text-[18px] font-bold text-[#f5f1e6]">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#b5af9f]">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
