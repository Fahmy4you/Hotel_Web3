'use client';
import { useState } from 'react';
import { formatRupiah } from '@/utils/RupiahFormater';
import { FaBed } from 'react-icons/fa6';
import {
  BarChart,
  LineChart,
  Activity,
  Users,
  Calendar,
  DollarSign,
  Plus,
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

// Sample data
interface Booking {
  id: number;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: RoomStatus;
}

const bookingData: Booking[] = [
  { 
    id: 1, 
    guestName: 'Ahmad Saputra', 
    roomType: 'Deluxe King', 
    checkIn: '2025-05-09', 
    checkOut: '2025-05-12', 
    status: 'check-in' 
  },
  { 
    id: 2, 
    guestName: 'Siti Rahayu', 
    roomType: 'Suite', 
    checkIn: '2025-05-10', 
    checkOut: '2025-05-15', 
    status: 'booked' 
  },
  { 
    id: 3, 
    guestName: 'Budi Santoso', 
    roomType: 'Twin Room', 
    checkIn: '2025-05-08', 
    checkOut: '2025-05-09', 
    status: 'check-out' 
  },
  { 
    id: 4, 
    guestName: 'Dewi Putri', 
    roomType: 'Standard Queen', 
    checkIn: '2025-05-09', 
    checkOut: '2025-05-11', 
    status: 'booked' 
  },
  { 
    id: 5, 
    guestName: 'Rudi Hartono', 
    roomType: 'Family Room', 
    checkIn: '2025-05-09', 
    checkOut: '2025-05-13', 
    status: 'check-in' 
  }
];

type RoomStatus = 'check-in' | 'check-out' | 'booked' | 'cancelled' | 'completed' | 'occupied' | 'available' | 'cleaning';

const roomData = [
  { id: 101, type: 'Deluxe King', status: 'occupied' as RoomStatus, lastUpdated: '2025-05-08' },
  { id: 102, type: 'Suite', status: 'available' as RoomStatus, lastUpdated: '2025-05-08' },
  { id: 103, type: 'Twin Room', status: 'cleaning' as RoomStatus, lastUpdated: '2025-05-09' },
  { id: 104, type: 'Standard Queen', status: 'available' as RoomStatus, lastUpdated: '2025-05-09' },
  { id: 105, type: 'Family Room', status: 'occupied' as RoomStatus, lastUpdated: '2025-05-09' }
];

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

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <InfoCard title="Jumlah Kamar" value="85" icon={FaBed} iconClassName="text-blue-600" anotherInfo="23 Kosong" type="success"/>
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
              <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800">
                Lihat Semua
                <ArrowRight size={16} />
              </button>
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
                  {bookingData.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4 font-medium">{booking.guestName}</td>
                      <td className="py-4 text-gray-600">{booking.roomType}</td>
                      <td className="py-4 text-gray-600">{booking.checkIn}</td>
                      <td className="py-4 text-gray-600">{booking.checkOut}</td>
                      <td className="py-4"><StatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-neutral-800 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mb-2">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">Tambah Booking</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-neutral-800 rounded-xl hover:bg-purple-100 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full mb-2">
                  <Home size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">Kategori Kamar</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-neutral-800 rounded-xl hover:bg-amber-100 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-full mb-2">
                  <Bed size={20} className="text-amber-600" />
                </div>
                <span className="text-sm font-medium text-amber-700">Tambah Kamar</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-neutral-800 rounded-xl hover:bg-green-100 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mb-2">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-700">Semua Booking</span>
              </button>
            </div>
          </div>

          {/* Room List */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Daftar Kamar</h2>
              <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800">
                Lihat Semua
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {roomData.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 dark:bg-neutral-800 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <Bed size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Kamar {room.id}</p>
                      <p className="text-xs text-gray-500">{room.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={room.status} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white dark:bg-[#1A1A1D] dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifikasi</h2>
              <button className="flex items-center justify-center p-1 bg-gray-100 rounded-md hover:bg-gray-200">
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
    </div>
  );
}