'use client';
import React, { useEffect } from 'react';
import { BiWallet, BiSolidWallet } from "react-icons/bi";
import LoadingName from '@/components/AtomsComponent/LoadingName';
import Avatar from 'react-avatar';
import { RiDashboardHorizontalLine, RiDashboardHorizontalFill } from "react-icons/ri";
import { RiUserSettingsLine, RiUserSettingsFill } from "react-icons/ri";
import { TiArrowMaximise, TiArrowMinimise } from "react-icons/ti";
import { LuLayers } from "react-icons/lu";
import { IoLayers } from "react-icons/io5";
import { RiHotelBedLine, RiHotelBedFill } from "react-icons/ri";
import { RiHotelLine, RiHotelFill } from "react-icons/ri";
import { RiHistoryLine, RiHistoryFill } from "react-icons/ri";
import MenuSidebar from '@/components/AtomsComponent/menuSidebar';
import { toggleSidebar } from '../../../libs/slices/sidebarSlices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';
import { setUser } from '../../../libs/slices/userSlice';
import ButtonWallet from '@/components/Button/ButtonWallet';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = React.useState(true);
    const users = useSelector((state: RootState) => state.users);
    const isCollapsed = useSelector((state: RootState) => state.sidebar.isColapsed);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUserLogged = async () => {
          try {
            const res = await fetch('/api/me');
            if (res.status !== 200) {
                //window.location.href = '/'; 
              return;
            }
            const user = await res.json();
            setLoading(false);
            console.log(user.role_id);
            dispatch(setUser(user));
          } catch (err) {
            console.error(err);
          }
        };
        getUserLogged();
      }, [3000]);

      
      const menuItems = [
        {
          active: "dashboard",
          name: "Dashboard",
          href: "/dashboard",
          iconInActive: RiDashboardHorizontalLine,
          iconActive: RiDashboardHorizontalFill,
          roles: [1, 2, 3],
        },
        {
          active: "riwayat",
          name: "Riwayat",
          href: "/dashboard",
          iconInActive: RiHistoryLine,
          iconActive: RiHistoryFill,
          roles: [1, 2, 3],
        },
        {
          active: "menu-user",
          name: "Menu User",
          href: "/dashboard/admin/users",
          iconInActive: RiUserSettingsLine,
          iconActive: RiUserSettingsFill,
          roles: [3],
        },
        {
          active: "hotels",
          name: "Hotel",
          href: "/dashboard/hotel",
          iconInActive: RiHotelLine,
          iconActive: RiHotelFill,
          roles: [2, 3],
        },
        {
          active: "kategori",
          name: "Kategori",
          href: "/dashboard/kategori",
          iconInActive: LuLayers,
          iconActive: IoLayers,
          roles: [2, 3],
        },
        {
          active: "kamar",
          name: "Kamar",
          href: "/dashboard/kamar",
          iconInActive: RiHotelBedLine,
          iconActive: RiHotelBedFill,
          roles: [2, 3],
        },
        {
          active: "top-up",
          name: "Top Up",
          href: "/dashboard/top-up",
          iconInActive: BiWallet,
          iconActive: BiSolidWallet,
          roles: [1, 2, 3],
        },
      ];
      

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={`bg-gray-100 dark:text-white-50 text-gray-900 dark:bg-black-100 p-4 h-screen flex flex-col ${isCollapsed ? 'w-64' : 'w-20'} transition-all duration-300`}>
                <div className="flex flex-col h-full">
                    <div className="flex gap-2 justify-between mb-4">
                        <h2 className="text-2xl transition-all duration-300 font-bold"> {isCollapsed ? 'FK HOTEL' : 'FK'}</h2>
                        <button
                            className='mb-4 dark:text-white-50 text-gray-900 text-2xl'
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            {isCollapsed ? <TiArrowMinimise /> : <TiArrowMaximise />}
                        </button>
                    </div>

                    <nav className="flex-grow overflow-y-auto">
                        <div className='flex flex-col gap-5'>
                            {users.role_id != null && menuItems.filter((item) => item.roles.includes(Number(users.role_id))).map((item) => (
                                <MenuSidebar
                                key={item.active}
                                active={item.active}
                                name={item.name}
                                href={item.href}
                                iconInActive={item.iconInActive}
                                iconActive={item.iconActive} />
                            ))}
                        </div>
                    </nav>
                    <div className="flex-none mt-auto">
                        <ButtonWallet isCollapsed={isCollapsed}/>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className='dark:bg-black-100 bg-gray-100 p-4 transition-bg shadow flex items-center justify-between flex-none'>
                    {loading?  <LoadingName /> :
                    <h2 className='dark:text-white-50 text-gray-900 text-medium font-bold transition-component'>Selamat Datang, {users.nama}!</h2>
                    }
                    <div className="flex items-center space-x-4">
                            <Avatar  name={`${users.nama}`} size="35" className='cursor-pointer rounded-md' textSizeRatio={1.75} onClick={() => {
                            window.location.href = '/dashboard/profile';
                        }}/>
                    </div>
                </header>

                <main className='flex-1 p-6 dark:bg-body bg-white transition-bg overflow-y-auto'>
                    {children}
                </main>
            </div>
        </div>
    );
}
