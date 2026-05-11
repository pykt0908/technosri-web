import Hero from "../components/Hero";
import BentoMenu from "../components/BentoMenu";
import Programs from "../components/Programs";
import About from "../components/About";
import News from "../components/News";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <BentoMenu />
      <Programs />
      <About />
      <News />
    </main>
  );
}
