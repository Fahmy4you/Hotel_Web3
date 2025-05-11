import Hero from '@/components/Hero';
import AboutSection from '@/components/Section/AboutSection';
import Navbar from '@/components/Navbar';
import SupportLogo from '@/components/Section/SupportLogo';
import FeatureCardSection from '@/components/Section/FeatureCardSection';
import AlurKerjaSection from '@/components/Section/AlurKerjaSection';
import TestiomonialSection from '@/components/Section/TestiomonialSection';
import FooterSection from '@/components/Section/FooterSection';
import TopHotelSection from '@/components/Section/TopHotelSection';

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
