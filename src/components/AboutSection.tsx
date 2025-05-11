"use client";
import { useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const kenapaRef = useRef(null);
  const visiRef = useRef(null);
  const misiRef = useRef(null);

  useGSAP(() => {
    const cards = [kenapaRef.current, visiRef.current, misiRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(card, {
        y: 50, 
        opacity:0
      }, {
        y: 0, 
        opacity: 1,
        delay: 0.3 * (index + 1),
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100'
        }
      })
    });

    gsap.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
  }, [])



  return (
    <section ref={sectionRef} id="about" className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/* LEFT */}
          <div className="first-project-wrapper" ref={kenapaRef}>
            <div className="image-wrapper">
              <Image src="/image/kenapa.jpeg" alt="Kenapa Harus FK Hotel" width={500} height={500} className="object-cover" />
              {/* <img src="/image/kenapa.jpeg" alt="Kenapa Harus FK Hotel" /> */}
            </div>
            <div className="text-content">
              <h2>Kenapa Harus FK Hotel</h2>
              <p className="text-gray-800 dark:text-white-50 md:text-[15px] text-[12px]">
                FK Hotel hadir bukan sekadar hotel biasa. Di era Web3, kami menawarkan konsep hotel digital terdesentralisasi pertama, di mana setiap orang bisa jadi bagian dari kepemilikan, pengembangan, hingga pembagian hasilnya. Lewat teknologi blockchain, semua transaksi, booking, dan reward komunitas terekam transparan tanpa perantara. Dan untuk para orang dari luar negri dengan mata uang berbeda, mereka tidak harus ke money changer. Dikarenakan kita menyediakan pembayaran menggunakan token IDRX Stable Coin Indonesia, bisa exchange dengan Cryptomu seperti BTC, ETH, SOL, Dan lain sebagainya
              </p>
            </div>
          </div>
          {/* RIGHT */}
          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={visiRef}>
              <div className="image-wrapper">
                {/* <Image src="/image/visi.jpeg" alt="Visi Image" width={500} height={500} className="object-cover" /> */}
                <img src="/image/visi.jpeg" alt="Visi Image" />
                <h2>VISI</h2>
                <p className="text-gray-800 dark:text-white-50 md:text-[15px] text-[12px]">
                  Mewujudkan ekosistem hotel digital global berbasis Web3 yang transparan, adil, dan memberdayakan komunitas.
                </p>
              </div>
            </div>
            <div className="project" ref={misiRef}>
              <div className="image-wrapper">
                <Image src="/image/misi.jpeg" alt="Misi Image" width={500} height={500} className="object-cover" />
                {/* <img src="/image/misi.jpeg" alt="Misi Image" /> */}
                <h2>MISI</h2>
                <p className="text-gray-800 dark:text-white-50 md:text-[15px] text-[12px]">
                Membuka peluang kepemilikan hotel bagi semua orang, menggabungkan dunia real dan virtual hospitality dalam satu ekosistem blockchain yang aman dan transparan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
