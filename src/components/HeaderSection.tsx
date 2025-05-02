
const HeaderSection = ({src = "/image/kenapa.jpeg", children}: {src?: string, placeholder?: string, children: React.ReactNode}) => {
  return (
    <div className="h-60 relative">
        <div className="absolute top-0 w-full h-full left-0 bg-black/65 z-[2]"/>
        <img src={src} alt="Header Image" className="absolute z-[1] top-0 left-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-body via-body/20 to-transparent z-[3]"/>
        <div className="z-[3] absolute top-0 left-0 flex justify-center items-center w-full h-full flex-col px-5">
            {children}
        </div>
    </div>
  )
}

export default HeaderSection
