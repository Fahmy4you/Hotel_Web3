import { Bar } from 'react-chartjs-2';
import type { ChartData } from '../../../../types/TypesChart';
import type { ChartOptions } from 'chart.js';

interface RevenueChartProps {
  borderDash?: [number, number];
  data: ChartData;
}

const RevenueChart = ({ data, borderDash = [5, 5] }: RevenueChartProps) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { 
      legend: { 
        display: false 
      } 
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              return `Rp ${value.toLocaleString('id-ID')}`;
            }
            return value;
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderDash: borderDash, // garis putus-putus
          drawTicks: false //garis grid putus-putus
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false // tampilkan semua label
        }
      }
    },
    barPercentage: 0.9 // lebar bar
  };

  return <Bar data={data} options={options} />;
};

export default RevenueChart;