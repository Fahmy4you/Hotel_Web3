'use client';
import { useState, useEffect } from 'react';
import { TbFilterCog } from "react-icons/tb";
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
import InfoCard from '@/components/Card/DasboardInfoCard';
import ChartContainer from '@/components/Dashboard/Chart/ContainerChart';
import { useManageKamar } from '@/hooks/useManageKamar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import AllKamarModals from '@/components/Modals/Kamar/AllKamarModals';
import CardListKamar, { typeResponseListKamar } from '@/components/Card/CardListKamar';
import ShowAllKategoriModal from '@/components/Modals/Kategori/ShowAllKategoriModal';
import NotificationModal from '@/components/Modals/NotificationModal';
import { Button, Select, SelectItem, Skeleton } from '@heroui/react';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useMyData } from '@/hooks/useMyData';
import ModalAllTransaction from '@/components/Modals/Transaction/ModalAllTransaction';
import GenericRow from '@/components/TableAtom/GenericRow';

const notificationData = [
  { id: 1, type: 'upcoming', message: 'Familia Nur akan check-in besok', time: '15 menit yang lalu' },
  { id: 2, type: 'checkout', message: 'Kamar 205 akan kosong pukul 12:00', time: '1 jam yang lalu' },
  { id: 3, type: 'request', message: 'Permintaan tambahan bantal di kamar 103', time: '2 jam yang lalu' },
  { id: 4, type: 'upcoming', message: 'Rudi Sulaiman akan check-in hari ini', time: '5 jam yang lalu' }
];

const columnsRecentBooking = ['pemesan', 'kamar', 'check_in', 'check_out'];

export default function DashboardHome() {
  const dispatch = useDispatch();
  const { user } = useHooksUser();
  //Data Booking
  const { transactions, loading } = useMyData(user?.id ?? 0);
  const modalState = useSelector((state: RootState) => state.modals);
  const userId = useSelector((state: RootState) => state.users.id) || 0;
  const { totalKamar, kamars } = useManageKamar(userId)
  return (
    <div>
      <div className='flex items-center mb-4 flex-wrap'>
      <h2 className="font-bold text-2xl">Dashboard Owner</h2>
      <button title="Filter" className="bg-slate-100 border-gray-300 border-1 transition-all duration-300 ease-in-out cursor-pointer dark:bg-[#1A1A1D] p-2 dark:border-gray-800 hover:bg-gray-300  text-white rounded ml-4">
        <TbFilterCog className='dark:text-white text-neutral-900' size={20} />
      </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <InfoCard title="Jumlah Kamar" value={totalKamar} icon={FaBed} iconClassName="text-blue-600" anotherInfo="23 Kosong" type="success" />
        <InfoCard title="Tamu Hari Ini" value="120" icon={Users} iconClassName="text-purple-600" anotherInfo="+8 Hari Ini" type="warning" />
        <InfoCard title="Pemesanan Hari Ini" value="14" icon={Calendar} iconClassName="text-amber-600" anotherInfo="5 Check-in" type="success" />
        <InfoCard title="Pendapatan" value={formatRupiah(12500000)} icon={DollarSign} iconClassName="text-green-600" anotherInfo="+18%" type="success" />
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
                <h2 className="text-lg font-bold">Reservasi Hari Ini</h2>
                <p className="text-gray-500 text-sm">Daftar reservasi masuk hari ini</p>
              </div>
              <Button onPress={() => dispatch(openModals('allTransaction'))} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800">
                Lihat Semua
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-400 dark:divide-gray-800">
                <thead>
                  <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                    {columnsRecentBooking.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column === 'pemesan' ? 'Pemesan' :
                          column === 'kamar' ? 'Kamar' :
                            column === 'check_in' ? 'Check-in' :
                              column === 'check_out' ? 'Check-out' : column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        {columnsRecentBooking.map((col, idx) => (
                          <td key={idx} className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-full rounded-md" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    transactions.slice(0, 5).map((booking) => (
                      <GenericRow
                        key={booking.id}
                        columns={columnsRecentBooking}
                        data={booking}
                        showActionsCol={false} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!transactions.length && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada reservasi masuk hari ini!</p>
              </div>
            )}
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
                  <div className={`mt-1 p-2 rounded-full ${notification.type === 'upcoming' ? 'bg-blue-100' :
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
      <AllKamarModals isOpen={modalState.allKamar} onClose={() => dispatch(closeModals('allKamar'))} />
      <ShowAllKategoriModal isOpen={modalState.detail} onClose={() => dispatch(closeModals('detail'))} />
      <NotificationModal isOpen={modalState.notification} onClose={() => dispatch(closeModals('notification'))} />
      <ModalAllTransaction isOpen={modalState.allTransaction} onClose={() => dispatch(closeModals('allTransaction'))} />
    </div>
  );
}