'use client';
import React, { useState, useEffect } from 'react';
import RevenueChart from './RevenueChart';
import OccupancyAreaChart from './OccupancyChart';
import { ChartTab } from '../../../types/TypesChart';
import { useMyData } from '@/hooks/useMyData';
import { useHooksUser } from '@/hooks/useHooksUser';

interface RevenueData {
  revenue: string;
  name: string;
}

const ChartContainer = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>('pendapatan');
  const { user } = useHooksUser();
  const { revenueData } = useMyData(user?.id || 0);

  const [revenueChartData, setRevenueChartData] = useState({
    labels: [] as string[],
    datasets: [{
      label: 'Total Pendapatan',
      data: [] as number[],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1.2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    }],
  });

  const occupancyChartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'Okupansi Kamar',
      data: [65, 72, 78, 80, 76, 85, 90],
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      borderColor: 'rgba(124, 58, 237, 1)',
      borderWidth: 1,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    }],
  };

  useEffect(() => {
    if (revenueData?.length) {
      setRevenueChartData({
        labels: revenueData.map(item => item.name),
        datasets: [{
          label: 'Total Pendapatan',
          data: revenueData.map(item => Number(item.revenue) || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1.2,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        }],
      });
    }
  }, [revenueData]);

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = revenueData?.reduce(
    (sum, item) => sum + (Number(item.revenue) || 0), 
    0
  ) || 0;

  const averageOccupancy = (
    occupancyChartData.datasets[0].data.reduce((a, b) => a + b, 0) / 
    occupancyChartData.datasets[0].data.length
  ).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#1A1A1D] p-6 rounded-xl shadow-sm border dark:border-gray-800 border-gray-100 h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Statistik</h2>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Grafik Performa Bulan {new Date().toLocaleString('id', { month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'pendapatan' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('pendapatan')}
          >
            Pendapatan
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'okupansi' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('okupansi')}
          >
            Okupansi
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-60px)]">
        {activeTab === 'pendapatan' ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Grafik Pendapatan Bulanan (IDR)</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Total: {formatRupiah(totalRevenue)}
              </span>
            </div>
            <div className="flex-1 pt-1">
              <RevenueChart data={revenueChartData} borderDash={[5, 5]} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Okupansi Kamar (%)</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Rata-rata: {averageOccupancy}%
              </span>
            </div>
            <div className="flex-1">
              {/* <OccupancyAreaChart data={occupancyChartData} borderDash={[5, 5]} /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;