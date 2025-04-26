"use client"
import { IconType } from "react-icons"

type MyButtonProps = {
  text: string
  className?: string
  id?: string
  icon: IconType
}

const MyButton: React.FC<MyButtonProps> = ({ text, className = "", id = "", icon: Icon }) => {
  return (
    <a onClick={(e) => {
      e.preventDefault();

      const target = document.getElementById(id);
      if(target && id) {
        const offset = window.innerHeight * 0.15;

        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({top, behavior: 'smooth'})
      }
    }} className={`cta-wrapper ${className}`}>
      <div className="cta-button group">
        <div className="bg-circle"/>
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="image/arrow-down.svg" alt="" />
        </div>
      </div>
    </a>
  )
}

export default MyButton
