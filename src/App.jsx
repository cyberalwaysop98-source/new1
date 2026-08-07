import { useEffect } from 'react';
import Overlays from './components/Overlays';
import Nav from './components/Nav';
import Rail from './components/Rail';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import AmbientBreak from './sections/AmbientBreak';
import Method from './sections/Method';
import Selection from './sections/Selection';
import Room from './sections/Room';
import Reserve from './sections/Reserve';
import Footer from './sections/Footer';
import { initSmoothScroll } from './lib/smoothScroll';
import { initAnimations } from './lib/animations';
import { ambient } from './assets/manifest';
import './App.css';

function App() {
  useEffect(() => {
    // Both are singletons and survive StrictMode's mount → cleanup → mount cycle
    // on their own. Killing ScrollTriggers in a cleanup here actively broke the
    // reveals: the teardown removed the triggers while the re-run's tweens
    // re-asserted their start values, so the hero never left its masked offset.
    initSmoothScroll();
    initAnimations();
  }, []);

  return (
    <>
      <Overlays />
      <Nav />
      <Rail />

      <main className="page-content">
        <Hero />
        <Manifesto />

        <AmbientBreak
          id="ma"
          media={ambient.ma}
          variant="ma"
          height="100svh"
          marquee
          caption="間 — the interval. Not empty space, but the pause that gives the next thing its weight. We build the room around it."
          captionAlign="left"
        />

        <Method />

        <AmbientBreak
          id="roast"
          media={ambient.roast}
          variant="roast"
          height="70svh"
          caption="Binchōtan. Twelve minutes. By ear."
          captionAlign="right"
        />

        <Selection />
        <Room />
        <Reserve />
      </main>

      <Footer />
    </>
  );
}

export default App;
