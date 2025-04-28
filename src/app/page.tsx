import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import Navbar from '@/components/Navbar';
import SupportLogo from '@/components/SupportLogo';
import FeatureCardSection from '@/components/FeatureCardSection';
import AlurKerjaSection from '@/components/AlurKerjaSection';
import TestiomonialSection from '@/components/TestiomonialSection';
import FooterSection from '@/components/FooterSection';
import TopHotelSection from '@/components/TopHotelSection';

export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <AboutSection/>
      <SupportLogo/>
      <FeatureCardSection/>
      <AlurKerjaSection/>
      <TopHotelSection/>
      <TestiomonialSection/>
      <FooterSection/>
    </>
  );
}
