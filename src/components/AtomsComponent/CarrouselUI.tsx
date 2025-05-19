'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CarouselUI = ({ images = ['/default-room-image.jpg'] }) => {
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Use provided images or fallback to placeholders
    const carouselImages = images && images.length > 0 ? images : [
        '/api/placeholder/800/400',
        '/api/placeholder/800/400',
        '/api/placeholder/800/400',
    ];

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex((currentIndex) => (currentIndex + 1) % carouselImages.length);
    }
    
    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex((currentIndex) => (currentIndex - 1 + carouselImages.length) % carouselImages.length);
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
                {carouselImages.map((img, idx) => (
                    <div key={idx} className="min-w-full flex-shrink-0 relative">
                        <img 
                            src={`uploads/kamars/${img}`}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/image/empty-image.png';
                            }}
                        />
                        <div className="absolute inset-0 flex items-end">
                            <div className="p-4 text-white">
                                <h3 className="text-xl font-bold">Room View {idx + 1}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Minimalist arrow buttons */}
            <button 
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/30 hover:bg-opacity-50 text-black p-1 rounded-full transition-all duration-300"
                onClick={handlePrev}
                disabled={isTransitioning}
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} className="text-white" />
            </button>
            <button 
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/30 hover:bg-opacity-50 text-black p-1 rounded-full transition-all duration-300"
                onClick={handleNext}
                disabled={isTransitioning}
                aria-label="Next slide"
            >
                <ChevronRight size={24} className="text-white" />
            </button>
            
            {/* Modern minimal indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/20 px-3 py-1 rounded-full">
                {carouselImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isTransitioning) return;
                            setIsTransitioning(true);
                            setIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === index 
                              ? 'bg-white w-4' 
                              : 'bg-white bg-opacity-50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default CarouselUI