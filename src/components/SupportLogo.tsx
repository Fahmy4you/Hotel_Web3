import Image from "next/image";

const LogoIcon = ({icon}: {icon: string}) => {
    return (
        <div className="flex-none flex-center marquee-item">
            <img src={icon} alt={icon} className="grayscale brightness-75 hover:brightness-100 transition" />
        </div>
    )
}

const SupportLogo = () => {
    const logoSupport = [
        {
            path: 'image/supportinglogo/hotel1.png'
        },
        {
            path: 'image/supportinglogo/hotel2.png'
        },
        {
            path: 'image/supportinglogo/hotel3.png'
        },
        {
            path: 'image/supportinglogo/hotel4.png'
        },
        {
            path: 'image/supportinglogo/hotel5.png'
        },
        {
            path: 'image/supportinglogo/hotel6.png'
        },
        {
            path: 'image/supportinglogo/hotel1.png'
        },
        {
            path: 'image/supportinglogo/hotel2.png'
        },
        {
            path: 'image/supportinglogo/hotel3.png'
        },
        {
            path: 'image/supportinglogo/hotel4.png'
        },
        {
            path: 'image/supportinglogo/hotel5.png'
        },
        {
            path: 'image/supportinglogo/hotel6.png'
        }
    ];

    
  return (
    <div className="md:my-0 my-10 relative">
        <div className="gradient-edge"></div>
        <div className="gradient-edge"></div>

        <div className="marquee h-52">
            <div className="marquee-box md:gap-12 gap-5">
                {logoSupport.map((logo, index) => (
                    <LogoIcon icon={logo.path} key={index} />
                ))}
                {logoSupport.map((logo, index) => (
                    <LogoIcon icon={logo.path} key={index} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default SupportLogo
