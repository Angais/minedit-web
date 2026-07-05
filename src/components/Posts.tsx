import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { Sparkle } from './Pixel'

declare global {
  interface Window {
    twttr?: {
      widgets: { load: (el?: HTMLElement) => void }
    }
  }
}

const posts = [
  {
    id: '2064422677264154749',
    url: 'https://x.com/Angaisb_/status/2064422677264154749',
    note: '“a wooden house”, the demo that went viral',
    views: '1.5M views',
  },
  {
    id: '2063781165291405611',
    url: 'https://x.com/Angaisb_/status/2063781165291405611',
    note: 'A wizard tower built in six stages',
    views: null,
  },
  {
    id: '2063397034485235936',
    url: 'https://x.com/Angaisb_/status/2063397034485235936',
    note: 'Live editing, demonstrated',
    views: null,
  },
]

function useTwitterWidgets(ref: React.RefObject<HTMLElement | null>) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only load the widgets script once the section approaches the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()

        if (window.twttr) {
          window.twttr.widgets.load(el)
          setLoaded(true)
          return
        }
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.onload = () => setLoaded(true)
        document.body.appendChild(script)
      },
      { rootMargin: '600px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return loaded
}

export function Posts() {
  const sectionRef = useRef<HTMLElement>(null)
  useTwitterWidgets(sectionRef)

  return (
    <section id="posts" ref={sectionRef} className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-pixel text-[11px] tracking-wide text-grass-dark uppercase">
            ✦ From the timeline
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-bold tracking-[-0.02em]">
            The internet <span className="text-grass">watched it build</span>.
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-stone">
            Over 1.5 million people watched a model raise a wooden house from
            three words. These are the original posts, videos included.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          {/* Featured viral post */}
          <Reveal className="lg:sticky lg:top-28">
            <div className="relative">
              <Sparkle className="sparkle absolute -top-5 -right-4 z-10 w-5" />
              <div className="mc-raised -rotate-[0.5deg] p-4 transition-transform duration-300 hover:rotate-0 sm:p-6">
                <div className="mb-4 flex items-center justify-between px-1">
                  <span className="text-[13.5px] font-bold">{posts[0].note}</span>
                  <span className="font-pixel border-2 border-ink bg-gold px-2 py-1 text-[10px] shadow-[2px_2px_0_0_#211e16]">
                    {posts[0].views}
                  </span>
                </div>
                <blockquote className="twitter-tweet" data-theme="light" data-dnt="true">
                  <a href={posts[0].url}>View the post on X</a>
                </blockquote>
              </div>
            </div>
          </Reveal>

          {/* Secondary posts */}
          <div className="space-y-10">
            {posts.slice(1).map((post, i) => (
              <Reveal key={post.id} delay={0.1 + i * 0.08}>
                <div
                  className={`mc-raised p-4 transition-transform duration-300 hover:rotate-0 sm:p-6 ${i % 2 === 0 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'}`}
                >
                  <div className="mb-4 px-1 text-[13.5px] font-bold">{post.note}</div>
                  <blockquote className="twitter-tweet" data-theme="light" data-dnt="true">
                    <a href={post.url}>View the post on X</a>
                  </blockquote>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
