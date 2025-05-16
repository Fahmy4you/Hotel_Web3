import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import React, { useState } from 'react'
import { ModalProps } from '../../../../types/TypesPropModal'
import MyProfileSection from '@/components/Section/Setting/MyProfileSection'
import SettingTampilanSection from '@/components/Section/Setting/SettingTampilanSection'
import SettingBahasaSection from '@/components/Section/Setting/SettingBahasaSection'

const Modalsetting = ({ isOpen, onClose }: ModalProps) => {
  // State untuk menu yang aktif
  const [activeMenu, setActiveMenu] = useState(1)

  // Data menu pengaturan
  const menuItems = [
    { id: 1 , label: 'Profil Pengguna', icon: '👤' },
    { id: 2, label: 'Notifikasi', icon: '🔔' },
    { id: 3, label: 'Keamanan', icon: '🔒' },
    { id: 4, label: 'Tampilan', icon: '🎨' },
    { id: 5, label: 'Bahasa', icon: '🌐' },
  ]

  // Fungsi untuk mengubah menu yang aktif
  const handleMenuChange = (menuId : number) => {
    setActiveMenu(menuId)
  }

  // Render konten berdasarkan menu yang aktif
  const renderContent = () => {
    switch (activeMenu) {
      case 1:
        return (
            <MyProfileSection/>
        )
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
        )
      case 3:
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Keamanan Akun</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password Lama</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Ubah Password</button>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Autentikasi Dua Faktor</h4>
                <div className="flex items-center justify-between">
                  <span>Aktifkan 2FA</span>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <SettingTampilanSection/>
        )
      case 5:
        return (
          <SettingBahasaSection/>
        )
      default:
        return <div>Pilih menu di samping</div>
    }
  }

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
        <ModalHeader className="flex bg-gray-100 transition-all duration-300 ease-in-out dark:bg-neutral-900 justify-between items-center">
          <span className="text-xl font-bold">Pengaturan</span>
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="flex h-full">
            {/* Sidebar menu */}
            <aside className="w-64 overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 h-screen dark:bg-neutral-900 p-4 border-r dark:border-neutral-800 border-gray-300">
              <ul className="space-y-2">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded flex items-center space-x-2 ${
                        activeMenu === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                      }`}
                      onClick={() => handleMenuChange(item.id)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            
            {/* Content area */}
            <div className="flex-1 dark:bg-body p-3 bg-white transition-all duration-300 ease-in-out overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default Modalsetting