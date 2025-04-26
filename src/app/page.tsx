import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import Navbar from '@/components/Navbar';
import SupportLogo from '@/components/SupportLogo';

export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <AboutSection/>
      <SupportLogo/>
    </>
  );
}
