
const FeatureCardSection = () => {
    const features = [
        {
            path: "/image/feature/booking.svg",
            text: "Booking Hotel",
            desk: "Anda bisa membooking hotel di platform kami secara desentralise, pesanan anda akan dicatat di blockchain sebelum H-3 reservasi"
        },
        
        {
            path: "/image/feature/pembayaran.svg",
            text: "Stable Coin",
            desk: "Anda bisa membooking hotel di platform kami dan membayar dengan stable coin IDRX yang beridiri di jaringan LISK ETHERIUM"
        },
        
        {
            path: "/image/feature/topup.svg",
            text: "Top Up IDRX",
            desk: "Jika anda tidak memiliki token dan anda memegang fiat. Anda bisa menggunakan fitur Top Up yang kami sediakan untuk menambah saldo"
        },
        
        {
            path: "/image/feature/swapcrypto.svg",
            text: "Swap Crypto",
            desk: "Jika anda tidak memiliki stable coin IDRX dan anda memiliki cyrpto. Anda bisa menggunnakan fitur Swap Crypto untuk tukarkan crypto anda"
        }
        
    ]

  return (
    <section id="fitur" className="w-full mt-20 px-5 md:px-10">
      <div className="mx-auto grid grid-4-cols">
        {features.map((feature, index) => (
            <div className="card-border timeline-card rounded-xl p-8 flex flex-col gap-4" key={index}>
                <div className="size-20 flex items-center justify-center rounded-full">
                    <img src={feature.path} alt={feature.text} />
                </div>
                <h3 className="text-white text-2xl font-semibold mt-2">{feature.text}</h3>
                <p className="text-white-50 md:text-lg text-[14px]">{feature.desk}</p>
            </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureCardSection
