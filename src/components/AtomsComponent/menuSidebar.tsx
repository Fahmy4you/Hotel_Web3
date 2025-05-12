import Link from 'next/link';
import React, { useRef, useEffect } from 'react';
import { IconType } from 'react-icons';
import { Tooltip } from '@heroui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../libs/store';
import { setActiveMenu } from '../../../libs/slices/activeMenuSlice';
import gsap from 'gsap';

interface MenuSidebarProps {
  active: string;
  href: string;
  name: string;
  iconActive: IconType;
  iconInActive: IconType;
}

const MenuSidebar = ({ active, href, name, iconActive, iconInActive }: MenuSidebarProps) => {
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isColapsed);
  const dispatch = useDispatch();
  const activeMenu = useSelector((state: RootState) => state.activeMenu.activeMenu);
  const isActive = activeMenu === active;

  const Icon = isActive ? iconActive : iconInActive;

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current || !iconRef.current || !textRef.current) return;

    gsap.killTweensOf([menuRef.current, iconRef.current, textRef.current]);

    if (isActive) {
      gsap.to(menuRef.current, {
        backgroundColor: '#2b1b5a',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 12px rgba(43, 27, 90, 0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(iconRef.current, { scale: 1.2, duration: 0.3, ease: 'back.out' });
      gsap.to(textRef.current, { fontWeight: 600, duration: 0.3 });
    } else {
      gsap.to(menuRef.current, {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(iconRef.current, { scale: 1, duration: 0.3 });
      gsap.to(textRef.current, { fontWeight: 400, duration: 0.3 });
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!isActive && hoverRef.current && iconRef.current && textRef.current) {
      gsap.to(hoverRef.current, { width: '100%', opacity: 0.2, duration: 0.3 });
      gsap.to(iconRef.current, { y: -2, scale: 1.1, duration: 0.3 });
      gsap.to(textRef.current, { x: 3, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (!isActive && hoverRef.current && iconRef.current && textRef.current) {
      gsap.to(hoverRef.current, { width: '0%', opacity: 0, duration: 0.3 });
      gsap.to(iconRef.current, { y: 0, scale: 1, duration: 0.3 });
      gsap.to(textRef.current, { x: 0, duration: 0.3 });
    }
  };

  const handleClick = () => {
    dispatch(setActiveMenu({ activeMenu: active, activeLink: href }));
    if (menuRef.current) {
      gsap.timeline()
        .to(menuRef.current, { scale: 0.95, duration: 0.1 })
        .to(menuRef.current, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
    }
  };

  return (
    <div
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative cursor-pointer transition-colors duration-300 ${
        isActive ? 'text-white' : 'text-gray-400'
      }`}
    >
      <div
        ref={hoverRef}
        className="absolute left-0 top-0 h-full w-0 rounded-xl bg-purple-300 opacity-0 -z-10"
      />

      <Link
        href={href}
        className={`flex items-center gap-3 ${isCollapsed ? 'p-3' : 'p-0 justify-center ms-3'} font-medium`}
      >
        <div
          ref={iconRef}
          className={`flex items-center justify-center ${isCollapsed ? '' : 'w-12 h-12'} transition-transform duration-300`}
        >
          <Icon className="text-xl" />
        </div>

        <div className="overflow-hidden">
          {isCollapsed ? (
            <span
              ref={textRef}
              className="whitespace-nowrap transition-all duration-300 ease-in-out"
            >
              {name}
            </span>
          ) : (
            <>
              <Tooltip
                key={'right-end'}
                color="secondary"
                content={name}
                placement={'right-end'}
                isDisabled={isCollapsed}
              >
                <span className="sr-only" ref={textRef}>
                  {name}
                </span>
              </Tooltip>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MenuSidebar;
