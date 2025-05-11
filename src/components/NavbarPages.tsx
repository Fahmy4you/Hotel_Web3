"use client"
import Link from "next/link"
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useEffect, useState } from "react";
import { Sling as Hamburger } from 'hamburger-react';

const NavbarPages = ({isHeaderSection}: {isHeaderSection?: boolean}) => {
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
            link: "/"
        },
        {
            name: "List Hotel",
            link: "/hotel"
        },
        {
            name: "List Kategori",
            link: "/kategori"
        },
    ]

  return (
    <header className={`navbar ${isHeaderSection && 'page'} ${scrolled ? 'scrolled' : 'not-scrolled'}  ${open && 'active'}`}>
        <a className="logo" href="#hero">FK Hotel | Web3</a>

        <Hamburger toggled={open} toggle={setOpen}/>

        <nav className={`menu ${open && 'active'}`}>
            <div className="w-[100px]"></div>
            <div>
                {navbarLink.map((item, index) => (
                    <Link key={index} href={item.link}>
                        <span>{item.name}</span>
                        <span className="underline"/>
                    </Link>
                ))}
            </div>
            <ConnectWalletButton/>
        </nav>
    </header>
  )
}

export default NavbarPages
