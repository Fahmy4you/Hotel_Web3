"use client";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../libs/store";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { Sling as Hamburger } from 'hamburger-react';

const Navbar = () => {
    const activeMenu = useSelector((state: RootState) => state.activeMenu.activeLink);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

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
    <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}  ${open && 'active'}`}>
        <a className="logo" href="#hero">FK Hotel | Web3</a>

        <Hamburger toggled={open} toggle={setOpen}/>

        <nav className={`menu ${open && 'active'}`}>
            <div>
                {navbarLink.map((item, index) => (
                    <a key={index} href={item.link}>
                        <span>{item.name}</span>
                        <span className="underline"/>
                    </a>
                ))}
            </div>
            <ConnectWalletButton/>
        </nav>
    </header>
  )
}

export default Navbar
