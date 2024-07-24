import { Suspense } from "react";
import Hero from "../components/landing_page/hero/Hero";
import Works from "../components/landing_page/works/Works";
import Navbar from "../components/navbar/Navbar";

const LandingPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <header>
          <Navbar />
        </header>
        <main>
          <Hero />
          <Works />
        </main>
      </Suspense>
    </>
  );
};

export default LandingPage;
