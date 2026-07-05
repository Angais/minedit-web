import { Reveal } from './Reveal'
import { GrassStrip, StoneStrip, VoxelCube, Sparkle } from './Pixel'

const steps = [
  {
    title: 'Drop it in your mods folder',
    body: 'Grab the jar from GitHub Releases and copy it into your Minecraft mods folder. Requires NeoForge.',
    code: null,
  },
  {
    title: 'Point it at a model',
    body: 'Add your OpenRouter key and pick a model, or wire up the local bridge for Codex and Cursor.',
    code: ['/apikey <your-openrouter-key>', '/model openai/gpt-5.5'],
  },
  {
    title: 'Select an area and build',
    body: 'Right-click two corners with a stick to set the footprint, then describe what you want.',
    code: ['/build a detailed medieval blacksmith'],
  },
]

export function Install() {
  return (
    <section id="install" className="relative overflow-hidden">
      <GrassStrip flip />
      <div className="bg-[#dcedd2] px-4 py-24 md:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-pixel text-[11px] tracking-wide text-grass-dark uppercase">
              ✦ Get started
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-bold tracking-[-0.02em]">
              Building in <span className="text-grass">three steps</span>.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="mc-raised flex h-full flex-col p-7 transition-transform duration-200 hover:-translate-y-1">
                  <div className="mc-slot font-pixel flex h-10 w-10 items-center justify-center text-[13px] text-grass-dark">
                    {i + 1}
                  </div>
                  <h3 className="font-display mt-4 text-[19px] font-bold">{step.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-stone">{step.body}</p>
                  {step.code && (
                    <div className="mt-auto space-y-2 pt-6">
                      {step.code.map((c) => (
                        <div
                          key={c}
                          className="no-scrollbar overflow-x-auto border-2 border-black/50 bg-[#211e16] px-3.5 py-2.5 font-mono text-[12.5px] whitespace-nowrap text-[#f0ede2] shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.4)]"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <Sparkle className="sparkle absolute -top-4 -left-7 w-4" />
              <Sparkle
                className="sparkle absolute -right-6 -bottom-3 w-3"
                color="#79c465"
                style={{ animationDelay: '1s' }}
              />
              <a
                href="https://github.com/Angais/minedit/releases"
                target="_blank"
                rel="noreferrer"
                className="mc-btn inline-block bg-grass px-9 py-4.5 text-[16px] font-bold text-white"
              >
                Download the latest release
              </a>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-stone">
              Experimental software, use it at your own risk. Back up your
              worlds before large builds. API usage is billed by your provider,
              and you are responsible for any costs it generates.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative">
      <GrassStrip />
      <div className="bg-[#4a3521] px-4 pt-10 pb-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 pb-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <VoxelCube className="h-5 w-5" />
            <span className="text-[14px] text-[#d9cbb8]">
              Minedit is MIT licensed. Made by{' '}
              <a
                href="https://x.com/Angaisb_"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-white transition-colors duration-200 hover:text-leaf"
              >
                Angel
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6 text-[14px] text-[#d9cbb8]">
            <a
              href="https://github.com/Angais/minedit"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://x.com/Angaisb_"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-white"
            >
              X
            </a>
            <a
              href="https://github.com/Angais/minedit/releases"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-white"
            >
              Releases
            </a>
          </div>
        </div>
      </div>
      {/* bedrock */}
      <StoneStrip />
    </footer>
  )
}
