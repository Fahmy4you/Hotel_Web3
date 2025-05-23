'use client';
import { useState, useEffect } from 'react';
import AddKamarModals from '@/components/Modals/Kamar/AddKamarModals';
import { closeModals, openModals } from '../../../../libs/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { formatRupiah } from '@/utils/RupiahFormater';
import { FaBed } from 'react-icons/fa6';
import {
  Users,
  Calendar,
  DollarSign,
  Bell,
  Home,
  Bed,
  BookOpen,
  Clock,
  BellRing,
  ArrowRight
} from 'lucide-react';
import InfoCard from '@/components/Dashboard/InfoCard';
import ChartContainer from '@/components/Dashboard/Chart/ContainerChart';
import { useManageKamar } from '@/hooks/useManageKamar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';    
import AllKamarModals from '@/components/Modals/Kamar/AllKamarModals';
import CardListKamar, { typeResponseListKamar } from '@/components/Card/CardListKamar';
import ShowAllKategoriModal from '@/components/Modals/Kategori/ShowAllKategoriModal';
import NotificationModal from '@/components/Modals/NotificationModal';
import { Button } from '@heroui/react';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useMyData } from '@/hooks/useMyData';
import ModalAllTransaction from '@/components/Modals/Transaction/ModalAllTransaction';

type RoomStatus = 'check-in' | 'check-out' | 'booked' | 'cancelled' | 'completed' | 'occupied' | 'available' | 'cleaning';


const notificationData = [
  { id: 1, type: 'upcoming', message: 'Familia Nur akan check-in besok', time: '15 menit yang lalu' },
  { id: 2, type: 'checkout', message: 'Kamar 205 akan kosong pukul 12:00', time: '1 jam yang lalu' },
  { id: 3, type: 'request', message: 'Permintaan tambahan bantal di kamar 103', time: '2 jam yang lalu' },
  { id: 4, type: 'upcoming', message: 'Rudi Sulaiman akan check-in hari ini', time: '5 jam yang lalu' }
];

const revenueData = [
  { name: 'Sen', revenue: 1200000 },
  { name: 'Sel', revenue: 900000 },
  { name: 'Rab', revenue: 1500000 },
  { name: 'Kam', revenue: 1800000 },
  { name: 'Jum', revenue: 2200000 },
  { name: 'Sab', revenue: 2500000 },
  { name: 'Min', revenue: 2000000 }
];

const occupancyData = [
  { name: 'Sen', occupancy: 65 },
  { name: 'Sel', occupancy: 58 },
  { name: 'Rab', occupancy: 72 },
  { name: 'Kam', occupancy: 78 },
  { name: 'Jum', occupancy: 85 },
  { name: 'Sab', occupancy: 92 },
  { name: 'Min', occupancy: 80 }
];

const StatusBadge = ({ status }: { status: 'check-in' | 'check-out' | 'booked' | 'cancelled' | 'completed' | 'occupied' | 'available' | 'cleaning' }) => {
  const statusStyles = {
    'check-in': 'bg-green-100 text-green-800',
    'check-out': 'bg-blue-100 text-blue-800',
    'booked': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800',
    'occupied': 'bg-green-100 text-green-800',
    'available': 'bg-blue-100 text-blue-800',
    'cleaning': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default function DashboardHome() {
    const dispatch = useDispatch();
    const {user} = useHooksUser();
    //Data Booking
    const {transactions} = useMyData(user?.id ?? 0);
    console.log(transactions);
  console.log(user);
  const modalState = useSelector((state : RootState) => state.modals);
  const userId = useSelector((state : RootState) => state.users.id) || 0;
  const {totalKamar,kamars} = useManageKamar(userId)
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <InfoCard title="Jumlah Kamar" value={totalKamar} icon={FaBed} iconClassName="text-blue-600" anotherInfo="23 Kosong" type="success"/>
        <InfoCard title="Tamu Hari Ini" value="120" icon={Users} iconClassName="text-purple-600" anotherInfo="+8 Hari Ini" type="warning"/>
        <InfoCard title="Pemesanan Hari Ini" value="14" icon={Calendar} iconClassName="text-amber-600" anotherInfo="5 Check-in" type="success"/>
        <InfoCard title="Pendapatan" value={formatRupiah(12500000)} icon={DollarSign} iconClassName="text-green-600" anotherInfo="+18%" type="success"/>
      </div>
        
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <ChartContainer />
          {/* Recent Bookings */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Booking Terbaru</h2>
                <p className="text-gray-500 text-sm">Daftar pemesanan terbaru</p>
              </div>
              <Button onPress={() => dispatch(openModals('allTransaction'))} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800">
                Lihat Semua
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Nama Tamu</th>
                    <th className="pb-3 font-medium">Tipe Kamar</th>
                    <th className="pb-3 font-medium">Check-in</th>
                    <th className="pb-3 font-medium">Check-out</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="border-b transition-all duration-250 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-900">
                      <td className="py-4 font-medium">{booking.pemesan}</td>
                      <td className="py-4 text-gray-600">{booking.tipe_kamar}</td>
                      <td className="py-4 text-gray-600">{booking.check_in}</td>
                      <td className="py-4 text-gray-600">{booking.check_out}</td>
                      {/* <td className="py-4"><StatusBadge status={booking.status} /></td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div><Button color="primary">Export Laporan ke Pdf</Button></div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white transition-all duration-300 ease-in dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-200 dark:bg-neutral-800 rounded-xl hover:bg-blue-500/65 transition-all duration-300 ease-in">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-300 rounded-full mb-2">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">Tambah Booking</span>
              </button>
              
              <button onClick={() => dispatch(openModals('detail'))} className="flex flex-col items-center justify-center p-4 bg-purple-200 dark:bg-neutral-800 rounded-xl hover:bg-purple-500/65 transition-all duration-300 ease-in">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-300 rounded-full mb-2">
                  <Home size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">Kategori Kamar</span>
              </button>
              
              <button onClick={() => dispatch(openModals('add'))} className="flex flex-col items-center justify-center p-4 bg-amber-200 dark:bg-neutral-800 rounded-xl hover:bg-amber-500/65 transition-all duration-300 ease-in">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-300 rounded-full mb-2">
                  <Bed size={20} className="text-amber-600" />
                </div>
                <span className="text-sm font-medium text-amber-700">Tambah Kamar</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-green-200 dark:bg-neutral-800 rounded-xl hover:bg-green-500/65 transition-all duration-300 ease-in">
                <div className="w-10 h-10 flex items-center justify-center bg-green-300 rounded-full mb-2">
                  <Calendar size={20} className="text-green-600 dark:text-green-700" />
                </div>
                <span className="text-sm font-medium text-green-700">Semua Booking</span>
              </button>
            </div>
          </div>

          {/* Room List */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Daftar Kamar</h2>
              <button onClick={() => dispatch(openModals('allKamar'))} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800">
                Lihat Semua
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {kamars.map((room) => room.id && (
                <CardListKamar
                  key={room.id}
                  kamar={room as typeResponseListKamar}
                />
              ))}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifikasi</h2>
              <button onClick={() => dispatch(openModals('notification'))} className="flex cursor-pointer items-center justify-center p-1 bg-gray-100 rounded-md hover:bg-gray-200">
                <BellRing size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {notificationData.map((notification) => (
                <div key={notification.id} className="flex gap-3">
                  <div className={`mt-1 p-2 rounded-full ${
                    notification.type === 'upcoming' ? 'bg-blue-100' : 
                    notification.type === 'checkout' ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    {notification.type === 'upcoming' ? (
                      <Calendar size={16} className="text-blue-600" />
                    ) : notification.type === 'checkout' ? (
                      <Clock size={16} className="text-green-600" />
                    ) : (
                      <Bell size={16} className="text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Region Modals */}
      <AddKamarModals isOpen={modalState.add} onClose={() => dispatch(closeModals('add'))} />
        <AllKamarModals isOpen={modalState.allKamar} onClose={() => dispatch(closeModals('allKamar'))}/>
          <ShowAllKategoriModal isOpen={modalState.detail} onClose={() => dispatch(closeModals('detail'))}/>
            <NotificationModal isOpen={modalState.notification} onClose={() => dispatch(closeModals('notification'))}/>
                <ModalAllTransaction isOpen={modalState.allTransaction} onClose={() => dispatch(closeModals('allTransaction'))}/>
    </div>
  );
}