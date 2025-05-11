"use client";
import CountUp from "react-countup";

const AnimatedCardCounter = () => {
    const counterItems = [
        {value: 15, suffix: "+", label: "Pengguna Platform"},
        {value: 15, suffix: "+", label: "Hotel Yang Terdaftar"},
        {value: 150, suffix: "+", label: "Transaksi Yang Terjadi"},
        {value: 5, suffix: "+", label: "Rating Hotel"}
    ];
  return (
    <div id="counter" className="px-5 md:px-10 xl:mt-0 mt-32">
        <div className="mx-auto grid-4-cols">   
            {counterItems.map((item, index) => (
                <div key={index} className="bg-gray-300 dark:bg-zinc-900 rounded-lg p-10 flex flex-col justify-center">
                    <div className="counter-number text-gray-900 dark:text-white text-5xl font-bold mb-2">
                        <CountUp suffix={item.suffix} end={item.value}/>
                    </div>
                    <div className="text-gray-900 dark:text-white-50 text-lg">{item.label}</div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AnimatedCardCounter
