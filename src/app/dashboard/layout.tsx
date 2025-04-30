'use client';
import React from 'react';
import { Avatar } from '@heroui/react';
import { FiSun } from "react-icons/fi";
import { RiDashboardHorizontalLine, RiDashboardHorizontalFill } from "react-icons/ri";
import { RiUserSettingsLine, RiUserSettingsFill } from "react-icons/ri";
import { TiArrowMaximise, TiArrowMinimise } from "react-icons/ti";
import { LuLayers } from "react-icons/lu";
import { IoLayers } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import { RiHotelBedLine, RiHotelBedFill } from "react-icons/ri";
import { RiHotelLine, RiHotelFill } from "react-icons/ri";
import { RiHistoryLine, RiHistoryFill } from "react-icons/ri";
import { LuMoon } from "react-icons/lu";
import MenuSidebar from '@/components/menuSidebar';
import { Input } from '@heroui/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { toggleSidebar } from '../../../libs/slices/sidebarSlices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';
import { toggleTheme } from '../../../libs/slices/themeSlices';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const isCollapsed = useSelector((state: RootState) => state.sidebar.isColapsed);
    const dispatch = useDispatch();

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={`${ darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'} p-4 h-screen flex flex-col ${isCollapsed ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    <div className="flex gap-2 justify-between mb-4">
                        <h2 className="text-2xl font-bold"> {isCollapsed ? 'FK HOTEL' : 'FK'}</h2>
                        <button
                            className={`mb-4 ${darkMode ? 'text-white-50' : 'text-gray-900'} text-2xl transition-component`}
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            {isCollapsed ? <TiArrowMinimise /> : <TiArrowMaximise />}
                        </button>
                    </div>
                    
                    <nav className="flex-grow overflow-y-auto">
                        <div className='flex flex-col gap-5'>
                            <MenuSidebar active="dashboard" name="Dashboard" href="/dashboard" iconInActive={RiDashboardHorizontalLine} iconActive={RiDashboardHorizontalFill} />
                            <MenuSidebar active="riwayat" name="Riwayat" href="/dashboard" iconInActive={RiHistoryLine} iconActive={RiHistoryFill} />
                            <MenuSidebar active="menu-user" name="Menu User" href="/dashboard" iconInActive={RiUserSettingsLine} iconActive={RiUserSettingsFill} />
                            <MenuSidebar active="kategori" name="Kategori" href="/dashboard" iconInActive={LuLayers} iconActive={IoLayers} />
                            <MenuSidebar active="hotels" name="Hotel" href="/dashboard" iconInActive={RiHotelLine} iconActive={RiHotelFill} />
                            <MenuSidebar active="kamar" name="Kamar" href="/dashboard" iconInActive={RiHotelBedLine} iconActive={RiHotelBedFill} />
                        </div>
                    </nav>
                    <div className="flex-none mt-auto">
                        <MenuSidebar active="logout" name="Logout" href="/dashboard" iconInActive={BiLogOutCircle} iconActive={BiLogOutCircle} />
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className={` ${ darkMode ? 'bg-black-100' : 'bg-gray-100'} p-4 transition-bg shadow flex items-center justify-between flex-none`}>
                    <Input
                        isClearable
                        className={` ${darkMode ? 'text-white-50' : 'text-gray-900'} max-w-2/3`}
                        startContent={<FaMagnifyingGlass className={`${ darkMode ? 'text-white-50' : 'text-gray-900'}`} />}
                        placeholder="Search..."
                        size="md"
                        type="text"
                        variant="bordered" />
                    <div className="flex items-center space-x-4">
                        {darkMode ?
                            <FiSun className="text-white-50 text-xl transition-component cursor-pointer" onClick={() => dispatch(toggleTheme())} /> :
                            <LuMoon className="text-gray-900 text-xl transition-component cursor-pointer" onClick={() => dispatch(toggleTheme())} />}
                        <Avatar isBordered radius="sm" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                    </div>
                </header>
                
                <main className={`flex-1 p-6 ${darkMode ? 'bg-body' : 'bg-white'} transition-bg overflow-y-auto`}>
                    {children}
                </main>
            </div>
        </div>
    );
}