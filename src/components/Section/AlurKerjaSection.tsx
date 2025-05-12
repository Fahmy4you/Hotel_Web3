"use client";
import TitleHeader from '@/components/TitleHeader';
import GlowCard from '@/components/Card/GlowCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AlurKerjaSection = () => {
    useGSAP(() => {
      gsap.utils.toArray('.timeline-card').forEach((card) => {
        const el = card as HTMLDivElement;
        gsap.from(el, {
          xPercent: -100,
          opacity: 0,
          transformOrigin: 'left left',
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%'
          }
        })

      });

      gsap.to('.timeline', {
        transformOrigin: 'bottom bottom',
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top center',
          end: '70% center',
          onUpdate: (self) => {
            gsap.to('.timeline', {
              scaleY: 1 - self.progress
            })
          }
        }
      });

      gsap.utils.toArray('.expText').forEach((text) => {
        const el = text as HTMLDivElement;
        gsap.from(el, {
          xPercent: 0,
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 60%'
          }
        })

      });

    }, [])


    const alurKerja = [
        {
          review: "Di alur awal anda membooking kamar di hotel seperti biasanya, jadi kami design ini agar anda juga familiar dengan fitur kami",
          logoPath: "/image/logo1.svg",
          title: "1. Booking Kamar Kamu",
          responsibilities: [
            "Anda memilih kamar yang akan di booking memilih tanggal check-in dan check-out",
            "Anda membayar menggunakan token IDRX sesuai dengan nominal tersebut",
            "Dan mendapatkan struk pembayaran dari kami",
          ],
        },
        {
          review: "Disini sebenarnya yang membedakan platform kami dengan yang lain, jadi jika tanggal waktu booking anda sudah pas ataupun lebih dengan tanggal batal booking yang sudah ditentukan hotel, maka kami simpan data di blockchain, tidak bisa dihapus dan dipalsukan",
          logoPath: "/image/logo2.svg",
          title: "2. Penyimpanan Transaksi Anda",
          responsibilities: [
            "Setelah anda melakukan pembayaran maka pembayaran anda kami simpan dahulu didatabse",
            "Kenapa tidak di blockchain ? dikarenakan jika sewaktu waktu anda ingin membatalkan booking dikarenakan ada acara mendadak",
            "Tetapi jika anda membooking sudah pas atau melebihi dengan batas waktu batal booking yang telah ditentukan hotel maka kami simpan langsung ke blockchain dan tidak bisa dibatalkan lagi",
            "Jadi meskipun data anda hilang atau transaksi hilang saat hari H booking, data anda masih tersimpan di blockchain secara permanen, jadi tidak bisa dipalsukan",
          ],
        },
        {
          review: "Disinilah tanggal berakhirnya, anda liburan atau menikmati waktu istirahat tanpa harus bingung kehilangan data, bukti struk, atau pemalsuan data yang dilakukan hotel, dikarenakan data anda kami simpan di blockchain",
          logoPath: "/image/logo3.svg",
          title: "3. Hari H Booking",
          responsibilities: [
            "Disini anda tinggal datang ke Hotel ditempat anda booking",
            "Jika anda mengalami kehilangan data, atau pemilik hotel memalsukan data anda, maka berikan saja bukti transaksi yang kami sediakan fiturnya melihat data transaksi blockchain anda",
            "Selamat menikmati liburan dan kesenangan hari anda 😊🙏",
          ],
        },
      ];

  return (
    <section id="alur" className="w-full md:mt-40 mt-20 section-padding xl:px-0">
        <div className="w-full h-full md:px-20 px-5">
            <TitleHeader title="Alur Kerja Pemesanan" sub="Bagaimanakah alur system hotel desentralize 🤔"/>

            <div className="mt-32 relative">
                <div className="relative z-50 xl:space-y-32 space-y-10">
                    {alurKerja.map((alur, index) => (
                        <div key={index} className="exp-card-wrapper">
                            <div className="xl:w-2/6">
                                <GlowCard card={{review: alur.review}} index={index}>
                                  <div className='flex items-center gap-3'>
                                      <div className='size-10 rounded-full'>
                                          <img src="/image/users/founder.jpg" alt="Foto Founder FK Hotel" className='w-full h-full rounded-full' />
                                      </div>
                                      <div>
                                          <p className='font-bold'>Fahmy Bima Az Zukhruf</p>
                                          <p className='text-gray-800 dark:text-white-50'>Founder FK Hotel</p>
                                      </div>
                                  </div>
                                </GlowCard>
                            </div>
                            <div className="xl:w-4/6">
                                <div className="flex items-center">
                                    <div className="timeline-wrapper">
                                        <div className="timeline"/>
                                        <div className="gradient-line w-1 h-full"/>
                                    </div>
                                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                                      <div className="timeline-logo">
                                        <img src={alur.logoPath} alt={alur.logoPath} />
                                      </div>
                                      <div>
                                        <h1 className='font-semibold text-3xl '>{alur.title}</h1>
                                        <ul className='list-disc ms-5 mt-5 flex flex-col gap-5 text-gray-800 dark:text-white-50'>
                                          {alur.responsibilities.map((res, i) => (
                                            <li key={i} className='text-lg'>
                                              {res}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}

export default AlurKerjaSection
