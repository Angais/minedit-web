import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { GrassStrip, Hills, PixelCloud, PixelSun, Sparkle } from './Pixel'
import { VoxelHouse } from './VoxelHouse'

const prompts = [
  'a detailed medieval blacksmith',
  'a cute house with a garden',
  'a wizard tower with a library',
  'a cozy cliffside cabin',
]

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          setText(word.slice(0, text.length + (deleting ? -1 : 1)))
        },
        deleting ? 28 : 55,
      )
    }
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words])

  return text
}

function useStarCount() {
  const [stars, setStars] = useState<string | null>(null)
  useEffect(() => {
    fetch('https://api.github.com/repos/Angais/minedit')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.stargazers_count === 'number') {
          setStars(
            d.stargazers_count >= 1000
              ? `${(d.stargazers_count / 1000).toFixed(1)}k`
              : String(d.stargazers_count),
          )
        }
      })
      .catch(() => {})
  }, [])
  return stars
}

const springUp = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.25 + i * 0.14,
      type: 'spring' as const,
      stiffness: 320,
      damping: 22,
    },
  }),
}

export function Hero() {
  const typed = useTypewriter(prompts)
  const stars = useStarCount()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const hillsBackY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const hillsFrontY = useTransform(scrollYProgress, [0, 1], [0, 45])
  const houseY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const skyY = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Sky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #aeddf0 0%, #c7e6f2 38%, #e8f0e2 78%, #f5f1e6 100%)',
        }}
      />

      <motion.div aria-hidden style={{ y: skyY }} className="pointer-events-none absolute inset-0">
        <PixelSun className="absolute top-[10%] right-[7%] w-24 md:w-32" />
        <PixelCloud className="drift absolute top-[16%] left-[5%] w-28 opacity-95 md:w-40" />
        <PixelCloud className="drift-slower absolute top-[30%] right-[18%] w-20 opacity-80 md:w-32" />
        <PixelCloud className="drift absolute top-[8%] left-[42%] w-16 opacity-60 md:w-24" />
        <PixelCloud className="drift-slower absolute top-[44%] left-[14%] hidden w-20 opacity-50 lg:block" />
        <Sparkle className="sparkle absolute top-[22%] left-[30%] w-3" />
        <Sparkle className="sparkle absolute top-[14%] right-[30%] w-4" style={{ animationDelay: '0.9s' }} />
        <Sparkle className="sparkle absolute top-[38%] right-[8%] w-3" color="#ffffff" style={{ animationDelay: '1.6s' }} />
      </motion.div>

      {/* Parallax terrain */}
      <motion.div aria-hidden style={{ y: hillsBackY }} className="pointer-events-none absolute inset-x-0 bottom-0">
        <Hills variant="back" fill="#a8d494" className="block h-40 w-full md:h-56" />
      </motion.div>
      <motion.div aria-hidden style={{ y: hillsFrontY }} className="pointer-events-none absolute inset-x-0 bottom-0">
        <Hills variant="front" fill="#7cbd68" className="block h-28 w-full md:h-40" />
      </motion.div>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-14 px-4 pt-36 pb-32 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8 lg:pt-32 lg:pb-36">
        {/* Copy */}
        <div className="flex flex-col items-center lg:items-start">
          <h1 className="font-display text-center text-[clamp(3.2rem,8vw,5.6rem)] leading-[0.96] font-bold tracking-[-0.03em] lg:text-left">
            <motion.span variants={springUp} initial="hidden" animate="show" custom={1} className="block">
              Describe it.
            </motion.span>
            <motion.span
              variants={springUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="relative block text-grass"
            >
              Watch it rise.
              <Sparkle className="sparkle absolute -top-2 -right-8 hidden w-5 md:block" />
            </motion.span>
          </h1>

          <motion.p
            variants={springUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-7 max-w-xl text-center text-[17px] leading-relaxed text-stone lg:text-left"
          >
            Minedit lets AI models build and edit Minecraft structures for you.
            Select an area, type what you want, and watch it appear. Then keep
            refining it with plain words.
          </motion.p>

          {/* Command bar, styled like the in-game chat */}
          <motion.div
            variants={springUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mc-dark-raised mt-10 w-full max-w-xl bg-[#211e16]!"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="font-mono text-[14.5px] text-leaf">/build</span>
              <span className="min-w-0 flex-1 truncate text-left font-mono text-[14.5px] text-[#f0ede2]">
                {typed}
                <span className="blink-caret ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-leaf" />
              </span>
              <kbd className="font-pixel hidden shrink-0 text-[11px] text-[#8a877a] sm:block">
                ENTER
              </kbd>
            </div>
          </motion.div>

          <motion.div
            variants={springUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-9 flex flex-col items-center gap-5 sm:flex-row"
          >
            <a
              href="https://github.com/Angais/minedit/releases"
              target="_blank"
              rel="noreferrer"
              className="mc-btn bg-grass px-8 py-4 text-[15px] font-bold text-white"
            >
              Download the mod
            </a>
            <a
              href="https://github.com/Angais/minedit"
              target="_blank"
              rel="noreferrer"
              className="mc-btn flex items-center gap-2.5 bg-card px-8 py-4 text-[15px] font-bold"
            >
              <span className="text-[#cf9a2c]" aria-hidden>★</span>
              Star on GitHub
              {stars && (
                <span className="font-pixel ml-1 border-2 border-ink/60 bg-gold px-2 py-0.5 text-[10px]">
                  {stars}
                </span>
              )}
            </a>
          </motion.div>

          <motion.p
            variants={springUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 max-w-md text-center text-[12.5px] leading-relaxed text-stone/80 lg:text-left"
          >
            Experimental software, use it at your own risk. API usage is billed
            by your provider.
          </motion.p>
        </div>

        {/* The wooden house from the demo, building itself */}
        <motion.div
          style={{ y: houseY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="pointer-events-none relative mx-auto w-full max-w-[420px] lg:max-w-[560px]"
        >
          <div className="mc-dark-raised absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 bg-[#211e16]! px-4 py-2.5">
            <span className="font-mono text-[12.5px] whitespace-nowrap text-leaf">/build</span>
            <span className="font-mono text-[12.5px] whitespace-nowrap text-[#f0ede2]">a wooden house</span>
          </div>
          <VoxelHouse className="w-full" />
        </motion.div>
      </div>

      {/* Ground */}
      <div className="relative">
        <GrassStrip />
      </div>
    </section>
  )
}
