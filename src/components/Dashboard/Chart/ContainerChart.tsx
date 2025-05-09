'use client';
import React, { useState } from 'react';
import RevenueChart from './RevenueChart';
import OccupancyChart from './OccupancyChart';
import { ChartData, ChartTab } from '../../../../types/TypesChart';

const ChartContainer = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>('pendapatan');

  // Data contoh dengan type safety
  const revenueData: ChartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'Pendapatan Harian',
      data: [1200000, 1900000, 1500000, 2000000, 1800000, 2200000, 2500000],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const occupancyData: ChartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'Okupansi Kamar',
      data: [65, 72, 78, 80, 76, 85, 90],
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      borderColor: 'rgba(124, 58, 237, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    }],
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1D] p-6 rounded-xl shadow-sm border dark:border-gray-800 border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Statistik</h2>
          <p className="text-gray-500 text-sm">Performa hotel minggu ini</p>
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'pendapatan' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('pendapatan')}
          >
            Pendapatan
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'okupansi' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('okupansi')}
          >
            Okupansi
          </button>
        </div>
      </div>

      {activeTab === 'pendapatan' ? (
        <div className="relative">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
            <span>Pendapatan Harian (Rp)</span>
            <span className="font-medium text-blue-600">
              Total: {formatRupiah(12100000)}
            </span>
          </div>
          <RevenueChart data={revenueData} />
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
            <span>Okupansi Kamar (%)</span>
            <span className="font-medium text-purple-600">
              Rata-rata: 75.7%
            </span>
          </div>
          <OccupancyChart data={occupancyData} />
        </div>
      )}
    </div>
  );
};

export default ChartContainer;