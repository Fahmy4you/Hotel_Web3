import { Line } from 'react-chartjs-2';
import type { ChartData } from '../../../types/TypesChart';
import type { ChartOptions } from 'chart.js';

interface OccupancyChartProps {
  data: ChartData;
}

const OccupancyAreaChart = ({ data }: OccupancyChartProps) => {
  // Configure datasets for area chart (add fill property)
  const areaData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: true, // This enables the area fill
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Semi-transparent fill color
      borderColor: 'rgba(75, 192, 192, 1)', // Line color
    }))
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              return `${value}%`;
            }
            return value;
          }
        },
        border: {
          display: false,
        },
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      },
      line: {
        tension: 0.4,
      }
    },
  };
  return <Line data={areaData} options={options} />;
};

export default OccupancyAreaChart;