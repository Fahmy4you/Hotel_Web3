"use client";
import { useEffect, useState } from "react"
import ConnectWalletButton from "@/components/ConnectWalletButton";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        }

        handleScroll();
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const navbarLink = [
        {
            name: "Home",
            link: "#hero"
        },
        {
            name: "About",
            link: "#about"
        },
        {
            name: "Alur Kerja",
            link: "#alur"
        },
        {
            name: "Top Hotel",
            link: "#tophotel"
        },
        {
            name: "Testimoni",
            link: "#testimoni"
        },
    ]

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
        <div className="inner">
            <a className="logo" href="#hero">FK Hotel | Web3</a>

            <nav className="desktop">
                <ul>
                    {navbarLink.map((item, index) => (
                        <li key={index} className="group">
                            <a href={item.link}>
                                <span>{item.name}</span>
                                <span className="underline"/>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <ConnectWalletButton/>
        </div>
    </header>
  )
}

export default Navbar
