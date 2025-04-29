'use client';
import React from 'react';
import { Avatar } from '@heroui/react';
import { FiSun } from "react-icons/fi";
import { LuMoon } from "react-icons/lu";

import { Input } from '@heroui/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { toggleSidebar } from '../../../libs/slices/sidebarSlices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isColapsed);
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen">
      <aside className={`bg-gray-800 text-white p-4 sidebar ${isCollapsed ? 'w-64' : 'w-16'} transition-width duration-300`}>
        <button
          className="mb-4 text-orange-400 hover:text-white"
          onClick={() => dispatch(toggleSidebar())}
        >
          Toggle Sidebar – {isCollapsed ? 'Expand' : 'Collapse'}
        </button>

        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2 justify-between h-screen">
            <div className='flex flex-col space-y-2'>
          <Link href="/dashboard" className="hover:text-orange-400">Beranda</Link>
          <Link href="/dashboard/users" className="hover:text-orange-400">User</Link>
          <Link href="/dashboard/artikel" className="hover:text-orange-400">Artikel</Link>
            </div>
            <div>
            <Link href="/" className="hover:text-orange-400">Logout</Link>
            </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-black p-4 shadow flex items-center justify-between">
          <h1 className="text-xl text-black font-semibold">FK HOTEL</h1>
          <Input
          isClearable
      className="max-w-2/3"
      startContent={<FaMagnifyingGlass className="text-gray-500" />}
      placeholder="Enter your password"
      type="text"
      variant="bordered"/>
      <div className="flex items-center space-x-4">
      {isDarkMode ? 
      <FiSun className="text-gray-500 cursor-pointer" onClick={() => setIsDarkMode(false)} /> :
      <LuMoon className="text-gray-500 cursor-pointer" onClick={() => setIsDarkMode(true)} />}
          <Avatar isBordered radius="sm" src="https://i.pravatar.cc/150?u=a04258a2462d826712d"  />
      </div>
        </header>
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
