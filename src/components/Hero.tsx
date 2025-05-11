"use client";
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import { RiSecurePaymentFill } from 'react-icons/ri'
import { TbEyeCheck } from 'react-icons/tb'
import {IoArrowBackCircle} from "react-icons/io5"
import MyButton from '@/components/MyButton';
import HeroModel from '@/components/HeroModel';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimatedCardCounter from './AnimatedCardCounter';
import Image from 'next/image';

const Hero = () => {
    useGSAP(() => {
        gsap.fromTo('.hero-text h1', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.inOut'
        })
    })
    const classNameIcon = "xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-gray-800 text-gray-300 dark:bg-white-50 dark:text-gray-900";
    const words = [
        {'text' : "Decentralize", 'icon' : <HiOutlineGlobeAlt className={classNameIcon}/>},
        {'text' : "Transparan", 'icon' : <TbEyeCheck className={classNameIcon}/>},
        {'text' : "Aman", 'icon' : <RiSecurePaymentFill className={classNameIcon}/>},
    ];

  return (
    <section id='hero' className='relative overflow-hidden'>
        <div className="absolute top-0 left-0 z-10">
            <img src={'image/bg-partikels.png'} alt='Bg Partikels'/>
        </div>
        <div className="absolute bottom-24 right-0 z-10">
            <img src={'image/bg-partikels.png'} alt='Bg Partikels'/>
        </div>

        <div className="hero-layout">
            {/* LEFT HERO CONTENT */}
            <header className='flex flex-col justify-center md:w-full w-screen md:px-20 px-5'>
                <div className="flex flex-col gap-7">
                    <div className="hero-text">
                        <h1>
                            Hotel 
                            <span className='slide'>
                                <span className='wrapper'>
                                    {words.map((word, index) => (
                                        <span key={index} className='flex items-center md:gap-3 gap-1 pb-2'>
                                            {word.icon}
                                            <span>{word.text}</span>
                                        </span>
                                    ))}
                                </span>
                            </span>
                        </h1>
                        <h1>Booking Mudah</h1>
                        <h1>Pembayaran IDRX</h1>
                    </div>
                    <p className='text-gray-900 dark:text-white-50 md:text-[15px] text-[10px] relative z-10 pointer-events-none pr-2 md:pr-0'><span className='font-semibold'>FK HOTEL </span> Adalah Sebuah Platform Untuk Menyediakan Hotel Terdesentralisasi Di Indonesia</p>
                    <MyButton className="md:w-80 md:h-16 w-60 h-12" id="counter" text="Reservasi" icon={IoArrowBackCircle}/>
                </div>
            </header>

            {/* RIGHT HERO CONTENT */}
            <figure>
                <div className="hero-3d-layout">
                    <HeroModel/>
                </div>
            </figure>
        </div>
        <AnimatedCardCounter/>
    </section>
  )
}

export default Hero
