import { motion } from 'motion/react'
import { VoxelCube } from './Pixel'

const links = [
  { label: 'Editing', href: '#editing' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Features', href: '#features' },
  { label: 'Posts', href: '#posts' },
  { label: 'Install', href: '#install' },
]

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-card shadow-[inset_0_-3px_0_0_rgba(33,30,22,0.12),inset_0_2px_0_0_rgba(255,255,255,0.9)]"
    >
      <nav className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="group flex items-center gap-2.5">
          <VoxelCube className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6" />
          <span className="font-display text-[18px] font-bold tracking-tight">Minedit</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-[14px] font-semibold text-stone transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-0 after:bg-grass after:transition-all after:duration-200 hover:text-ink hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/Angais/minedit"
          target="_blank"
          rel="noreferrer"
          className="mc-btn flex items-center gap-2 bg-grass px-4 py-2 text-[13.5px] font-bold text-white"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          GitHub
        </a>
      </nav>
    </motion.header>
  )
}
