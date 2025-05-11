"use client";

import { useRef } from "react";

type TypeCard = {
    card: {
      review: string,
      bintang?: number
    },
    children: React.ReactNode,
    index: number
}

const GlowCard = ({card, children, index}: TypeCard) => {
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
    }} onMouseMove={handleMouseMove(index)} className="card card-border timeline-card rounded-xl p-10 mb-5 break-inside-avoid-column">
      <div className="glow"/>
      <div className="flex items-center gap-1 mb-5">
        {(card.bintang && (
          Array.from({length: card.bintang}, (_, i) => (
            <img src="/image/star.png" key={i} alt="Star" className="size-5 filter brightness-40 dark:brightness-100" />
          ))
        ))}
      </div>

      <div className="mb-5">
        <p className="text-gray-800 dark:text-white-50 text-lg">{card.review}</p>
      </div>
        {children}
    </div>
  )
}

export default GlowCard
