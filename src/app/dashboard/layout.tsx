'use client';
import React, { useEffect, useState } from 'react';
import { openModals, closeModals } from '../../../libs/slices/modalSlice';
import { BiWallet, BiSolidWallet } from "react-icons/bi";
import LoadingName from '@/components/AtomsComponent/LoadingName';
import { RiDashboardHorizontalLine, RiDashboardHorizontalFill,
   RiHotelLine, RiHotelFill, RiHotelBedLine, RiHotelBedFill, RiUserSettingsLine,
    RiUserSettingsFill, RiHistoryLine, RiHistoryFill } from "react-icons/ri";
import { TiArrowMaximise, TiArrowMinimise } from "react-icons/ti";
import { LuLayers, LuSettings } from "react-icons/lu";
import { IoLayers } from "react-icons/io5";
import MenuSidebar from '@/components/AtomsComponent/menuSidebar';
import MenuSidebarSkeleton from '@/components/AtomsComponent/MenuSidebarSkeleton';
import { toggleSidebar } from '../../../libs/slices/sidebarSlices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';
import ButtonWallet from '@/components/Button/ButtonWallet';
import Modalsetting from '@/components/Modals/Settings/Modalsetting';
import { useHooksUser } from '@/hooks/useHooksUser';
import { Avatar, Skeleton } from '@heroui/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const modal = useSelector((state: RootState) => state.modals);
    const {user, loading} = useHooksUser();
    const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
    const [menuLoading, setMenuLoading] = useState(true);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setMenuLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }, []);
    
    const menuItems = [
        {
          active: "dashboard-admin",
          name: "Dashboard",
          href: "/dashboard/admin",
          iconInActive: RiDashboardHorizontalLine,
          iconActive: RiDashboardHorizontalFill,
          roles: [3],
        },
        {
          active: "dashboard-owner",
          name: "Dashboard",
          href: "/dashboard/owner",
          iconInActive: RiDashboardHorizontalLine,
          iconActive: RiDashboardHorizontalFill,
          roles: [2],
        },
        {
          active: "dashboard-user",
          name: "Dashboard",
          href: "/dashboard/user",
          iconInActive: RiDashboardHorizontalLine,
          iconActive: RiDashboardHorizontalFill,
          roles: [1],
        },
        {
          active: "riwayat-user",
          name: "Riwayat",
          href: "/dashboard/riwayat/user",
          iconInActive: RiHistoryLine,
          iconActive: RiHistoryFill,
          roles: [1],
        },
        {
          active: "riwayat-owner",
          name: "Riwayat",
          href: "/dashboard/riwayat/owner",
          iconInActive: RiHistoryLine,
          iconActive: RiHistoryFill,
          roles: [2],
        },
        {
          active: "riwayat-admin",
          name: "Riwayat",
          href: "/dashboard/riwayat/admin",
          iconInActive: RiHistoryLine,
          iconActive: RiHistoryFill,
          roles: [3],
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
            <aside className={`bg-gray-100 border-r-1 shadow-md dark:border-gray-900 border-gray-200 dark:text-white-50 text-gray-900 dark:bg-black-100 p-4 h-screen flex flex-col ${isCollapsed ? 'w-64' : 'w-20'} transition-all duration-300`}>
                <div className="flex flex-col h-full">
                    <div className="flex gap-2 justify-between mb-4">
                        {loading ? (
                          <Skeleton className="h-8 w-28 rounded-md" />
                        ) : (
                          <h2 className="text-2xl transition-all duration-300 font-bold"> {isCollapsed ? 'FK HOTEL' : 'FK'}</h2>
                        )}
                        <button
                            className='mb-4 dark:text-white-50 text-gray-900 text-2xl'
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            {isCollapsed ? <TiArrowMinimise /> : <TiArrowMaximise />}
                        </button>
                    </div>

                    <nav className="flex-grow overflow-y-auto">
                        <div className='flex flex-col gap-5'>
                            {menuLoading || loading ? (
                              Array(5).fill(0).map((_, index) => (
                                <MenuSidebarSkeleton key={index} isCollapsed={isCollapsed} />
                              ))
                            ) : (
                              user?.role_id != null && menuItems
                                .filter((item) => item.roles.includes(Number(user?.role_id)))
                                .map((item) => (
                                  <MenuSidebar
                                    key={item.active}
                                    active={item.active}
                                    name={item.name}
                                    href={item.href}
                                    iconInActive={item.iconInActive}
                                    iconActive={item.iconActive} 
                                  />
                                ))
                            )}
                        </div>
                    </nav>
                    <div className="flex-none mt-auto">
                        {menuLoading || loading ? (
                          <div className="flex items-center gap-3 p-2">
                            {isCollapsed && <Skeleton className="w-full h-8 rounded-md" />}
                          </div>
                        ) : (
                          <ButtonWallet isCollapsed={isCollapsed}/>
                        )}
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className='dark:bg-black-100 border-b-1 dark:border-gray-900 border-gray-200 bg-gray-100 p-4 transition-bg shadow-sm flex items-center justify-between flex-none'>
                    {loading ? <LoadingName /> :
                    <h2 className='dark:text-white-50 text-gray-900 text-medium font-bold transition-component'>Selamat Datang, {user?.nama_user}!</h2>
                    }
                    <div className="flex items-center space-x-4">
                      {loading ? (
                        <Skeleton className="w-10 h-10 rounded-full" />
                      ) : user?.profile_pict ? (
                        <Avatar radius="full" isBordered src={`/uploads/profile_pict/${user?.profile_pict}`}/>
                      ) : (
                        <Avatar radius="full" isBordered name={user?.nama_user}/>
                      )}
                      <LuSettings onClick={() => dispatch(openModals('setting'))} className='cursor-pointer dark:text-white-50 text-gray-900 text-2xl'/>
                    </div>
                </header>

                <main className='flex-1 p-6 dark:bg-body bg-white transition-bg overflow-y-auto'>
                    {children}
                </main>
                <Modalsetting isOpen={modal.setting} onClose={() => dispatch(closeModals('setting'))} /> 
            </div>
        </div>
    );
}