import { Modal, ModalBody, ModalContent, ModalHeader, Tooltip } from '@heroui/react';
import React, { useState, useEffect } from 'react';
import { GoSidebarCollapse, GoLock } from 'react-icons/go';
import { LuUserRoundCog } from "react-icons/lu";
import { CiPalette } from "react-icons/ci";
import { BiGlobe } from "react-icons/bi";
import { IoFileTrayOutline } from "react-icons/io5";
import { RiCustomerServiceLine } from "react-icons/ri";
import { ModalProps } from '../../../types/TypesPropModal';
import { TbBellCog } from "react-icons/tb";
import MyProfileSection from '@/components/Section/Setting/MyProfileSection';
import SettingTampilanSection from '@/components/Section/Setting/SettingTampilanSection';
import SettingBahasaSection from '@/components/Section/Setting/SettingBahasaSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { toggleSettingSidebar, setMobileSidebar } from '../../../../libs/slices/sidebarSlices';
import BantuanPage from '@/components/Section/Setting/SettingBantuan';
import SettingKeamanan from '@/components/Section/Setting/SettingKeamanan';

const Modalsetting = ({ isOpen, onClose }: ModalProps) => {
  const [activeMenu, setActiveMenu] = useState(1);
  const menuItems = [
    { id: 1, label: 'Profil Pengguna', icon: <LuUserRoundCog /> },
    { id: 2, label: 'Notifikasi', icon: <TbBellCog /> },
    { id: 3, label: 'Keamanan', icon: <GoLock /> },
    { id: 4, label: 'Tampilan', icon: <CiPalette /> },
    { id: 5, label: 'Bahasa', icon: <BiGlobe /> },
    { id: 6, label: 'Data', icon: <IoFileTrayOutline/>},
    { id: 7, label: 'Bantuan', icon: <RiCustomerServiceLine />},
  ];

  const handleMenuChange = (menuId: number) => {
    setActiveMenu(menuId);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 1:
        return <MyProfileSection />;
      case 2:
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Pengaturan Notifikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifikasi</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifikasi Push</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifikasi Aktivitas</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifikasi Pembaruan</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <SettingKeamanan />
        );
      case 4:
        return <SettingTampilanSection />;
      case 5:
        return <SettingBahasaSection />;
      case 7:
        return <BantuanPage />;
      default:
        return <div>Pilih menu di samping</div>;
    }
  };

  const settingSidebarCollapsed = useSelector((state: RootState) => state.sidebar.settingSidebarCollapsed);
  const mobileCollapsed = useSelector((state: RootState) => state.sidebar.mobileCollapsed);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setMobileSidebar(true));
      } else {
        dispatch(setMobileSidebar(false));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <Modal
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalContent>
        <ModalHeader className="flex bg-gray-50 transition-all duration-300 ease-in-out dark:bg-black-50 items-center">
          <span className="text-xl font-bold">Pengaturan</span>
          <Tooltip content={`${settingSidebarCollapsed ? 'Expand' : 'Collapse'}`} showArrow={true}>
            <button
              onClick={() => {
                dispatch(toggleSettingSidebar());
                if (window.innerWidth < 768 && mobileCollapsed) {
                  dispatch(setMobileSidebar(false));
                }
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            >
              <GoSidebarCollapse size={20} />
            </button>
          </Tooltip>
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="flex h-full">
            <aside
              className={`
                ${mobileCollapsed && window.innerWidth < 768 ? 'hidden transition-all duration-300' : 'block transition-all duration-300'}
                ${settingSidebarCollapsed ? 'w-20 transition-all duration-300' : 'w-0 transition-all duration-300 hidden md:block md:w-64'}
                overflow-y-auto 
                transition-all 
                duration-300 
                ease-in-out 
                bg-gray-100 
                h-full 
                dark:bg-black-50 
                p-4 
                border-r 
                dark:border-neutral-800 
                border-gray-300
              `}
            >
              <div className="flex flex-col">
                {settingSidebarCollapsed ? (
                  <div className="flex flex-col items-center space-y-6">
                    {menuItems.map((item) => (
                      <Tooltip key={item.id} content={item.label} showArrow={true}>
                        <button
                          key={item.id}
                          className={`p-2 rounded-md text-xl ${activeMenu === item.id ? 'bg-gray-900 shadow-sm  text-white dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                          onClick={() => handleMenuChange(item.id)}
                        >
                          {item.icon}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        className={`flex items-center p-2 rounded-lg w-full ${activeMenu === item.id
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                          }`}
                        onClick={() => handleMenuChange(item.id)}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
            <div className="flex-1 dark:bg-[#151515] p-3 bg-gray-50 transition-all duration-300 ease-in-out overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Modalsetting;