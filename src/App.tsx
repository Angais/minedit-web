import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { EditingSlider } from './components/EditingSlider'
import { Showcase } from './components/Showcase'
import { Features } from './components/Features'
import { Posts } from './components/Posts'
import { Install, Footer } from './components/Install'

function App() {
  return (
    <div className="relative">
      <Nav />
      <main>
        <Hero />
        <EditingSlider />
        <Showcase />
        <Features />
        <Posts />
        <Install />
      </main>
      <Footer />
    </div>
  )
}

export default App
