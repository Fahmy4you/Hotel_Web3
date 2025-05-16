"use client";
import { useRef } from "react";
import Link from "next/link";
import { potongText } from "@/utils/Helper";

type TypeCard = {
    data: {
      image?: string,
      nama: string,
      bintang?: number,
      url: string,
      buttonText?: string
    },
    index: number,
    children: React.ReactNode,
    showBintang?: boolean
}

const HotelCard = ({data, index, children, showBintang = true}: TypeCard) => {
    const cardRef = useRef<HTMLDivElement[]>([]);
    
    const handleMouseMove = (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current[index];
        if(!card) return;

        const rect = card.getBoundingClientRect();

        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
        angle = (angle + 360) % 360;

        card.style.setProperty('--start', (angle + 60).toString());
    }

    return (
        <div ref={(el) => {
            if(el) cardRef.current[index] = el;
        }} onMouseMove={handleMouseMove(index)} className="card card-border timeline-card rounded-xl p-3 mb-5">
            <div className="glow"/>
            <div className="w-full h-[200px]">
                <img src={data.image} alt={data.image} className="object-cover w-full h-full rounded" />
            </div>
            <div className="px-5 mt-5">
                <h3 className="md:text-xl text-lg text-gray-900 dark:text-white-50 font-bold">{potongText(data.nama, 15)}</h3>
                {children}

                {showBintang && (
                    <div className="flex items-center gap-1 my-3">
                        {Array.from({ length: 5 }, (_, i) => (
                            <img 
                            src="/image/star.png" 
                            key={i} 
                            alt="Star" 
                            className={`size-5 filter ${i < (data.bintang ?? 0) ? 'brightness-100' : 'opacity-40 dark:opacity-100 brightness-0'}`} 
                            />
                        ))}
                    </div>
                )}


            </div>
            <div className="flex justify-end">
                <Link href={data.url} className="border-1 mb-3 flex justify-center items-center rounded hover:bg-gray-500 dark:hover:bg-white-50 bg-transparent hover:text-white-50 dark:hover:text-black-50 transition ease-in-out border-gray-500 dark:border-white-50 p-2 contact-btn group">
                    <span>{data.buttonText ? data.buttonText : "Booking Sekarang"}</span>
                </Link>
            </div>
        </div>
      )
}

export default HotelCard
