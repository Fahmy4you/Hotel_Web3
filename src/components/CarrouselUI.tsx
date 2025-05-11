'use client'
import { useState, useEffect } from 'react'
import UiButton from './UiButton';

const CarouselUI = () => {
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const images = [
        '/api/placeholder/800/400',
        '/api/placeholder/800/400',
        '/api/placeholder/800/400',
    ]
    
    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex((currentIndex) => (currentIndex + 1) % images.length);
    }
    
    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 700);
        
        return () => clearTimeout(timer);
    }, [index]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isTransitioning]);
    
    return (
        <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg">
            <div 
                className="flex transition-transform duration-700 ease-in-out h-64"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="min-w-full flex-shrink-0 relative">
                        <img 
                            src={img} 
                            alt={`Slide ${idx + 1}`} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                            <div className="p-4 text-white">
                                <h3 className="text-xl font-bold">Client {idx + 1}</h3>
                                <p className="text-sm">Client testimonial or description</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <UiButton text="Prev" click={handlePrev} />
            <button 
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                onClick={handlePrev}
                disabled={isTransitioning}
            >
                ←
            </button>
            <button 
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                onClick={handleNext}
                disabled={isTransitioning}
            >
                →
            </button>
            
            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isTransitioning) return;
                            setIsTransitioning(true);
                            setIndex(idx);
                        }}
                        className={`w-3 h-3 rounded-full ${
                            idx === index ? 'bg-amber-500' : 'bg-white bg-opacity-50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default CarouselUI