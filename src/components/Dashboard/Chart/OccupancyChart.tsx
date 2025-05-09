import { Line } from 'react-chartjs-2';
import type { ChartData } from '../../../../types/TypesChart';
import type { ChartOptions } from 'chart.js';

interface OccupancyChartProps {
  data: ChartData;
}

const OccupancyChart = ({ data }: OccupancyChartProps) => {
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
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      }
    },
  };

  return <Line data={data} options={options} />;
};

export default OccupancyChart;