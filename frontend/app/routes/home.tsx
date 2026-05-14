import { Suspense, lazy } from "react";
import Hero from "../components/Hero";
import BentoMenu from "../components/BentoMenu";
import HomePopup from "../components/HomePopup";

// Lazy load non-critical sections
const Programs = lazy(() => import("../components/Programs"));
const About = lazy(() => import("../components/About"));
const News = lazy(() => import("../components/News"));

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <BentoMenu />
      <HomePopup />
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50 dark:bg-gray-900 rounded-3xl m-10"></div>}>
        <Programs />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50 dark:bg-gray-900 rounded-3xl m-10"></div>}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50 dark:bg-gray-900 rounded-3xl m-10"></div>}>
        <News />
      </Suspense>
    </main>
  );
}
