import Link from "next/link"
import ConnectWalletButton from '@/components/ConnectWalletButton';

const NavbarPages = () => {
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
    <header className={`navbar scrolled`}>
        <div className="inner">
            <a className="logo" href="#hero">FK Hotel | Web3</a>

            <nav className="desktop">
                <ul>
                    {navbarLink.map((item, index) => (
                        <li key={index} className="group">
                            <Link href={item.link}>
                                <span>{item.name}</span>
                                <span className="underline"/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <ConnectWalletButton/>
        </div>
    </header>
  )
}

export default NavbarPages
