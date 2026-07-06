import { Reveal } from './Reveal'

// Answers mirror the facts in the mod's README. The same text is duplicated
// in the FAQPage structured data in index.html; keep both in sync.
export const faqs = [
  {
    q: 'Is Minedit free?',
    a: 'The mod itself is free and open source under the MIT license. What can cost money are the AI calls: OpenRouter bills your API key per request, and the Codex or Cursor bridge consumes your existing plan limits. Minedit prints token usage and estimated cost in chat after every generation, so nothing is hidden.',
  },
  {
    q: 'Does it work with any AI model?',
    a: 'Mostly, yes. Through OpenRouter you can pick from hundreds of models and switch at any time with the /model command. You can also run the local bridge and let Codex or Cursor agents handle the build using your existing login, without a separate API key.',
  },
  {
    q: 'What Minecraft version does it need?',
    a: 'Current releases target Minecraft 26.1.2 with NeoForge 26.1.2.73. Download the matching jar from the GitHub releases page and drop it into your mods folder.',
  },
  {
    q: 'Can the AI edit builds I made by hand?',
    a: 'Yes. The /edit command reads whatever blocks are inside your selection, generated or handmade, and asks the model for changes based on what is actually there. Quick edit sends a compact snapshot so small requests come back as small patches instead of a rebuild.',
  },
  {
    q: 'What if a build ruins my world?',
    a: 'You can undo it. /reset build restores the world snapshot from before the build, and Minedit keeps your last five snapshots, so you can step further back. Generated code also runs in a restricted sandbox with no Java, filesystem or network access, capped at 500k block operations and 30 seconds per run. It is still experimental software though, so back up your world before large builds.',
  },
  {
    q: 'Does it work in multiplayer?',
    a: 'Yes, Minedit is server-aware. It runs on dedicated servers, operators can cancel any player\u2019s generation, and when several players build at once the block placement budget is shared between them instead of processing one build at a time.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-pixel text-center text-[11px] tracking-wide text-grass-dark uppercase">
            ✦ FAQ
          </p>
          <h2 className="font-display mt-4 text-center text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-bold tracking-[-0.02em]">
            Questions, <span className="text-grass">answered</span>.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-5">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <details className="mc-raised group p-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[17px] font-bold sm:text-[19px]">
                    {item.q}
                  </h3>
                  <span
                    aria-hidden
                    className="font-pixel shrink-0 text-[14px] text-grass-dark transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 text-[15px] leading-relaxed text-stone">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
