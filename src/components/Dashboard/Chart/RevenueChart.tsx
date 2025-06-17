import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  borderDash?: [number, number];
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      tension?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
    }[];
  };
}

const RevenueChart = ({ data, borderDash = [5, 5] }: RevenueChartProps) => {
  const rechartsData = data.labels.map((label, index) => {
    const dataPoint: { name: string; value?: number } = { name: label };
    data.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.data[index] !== undefined) {
        dataPoint.value = dataset.data[index];
      }
    });
    return dataPoint;
  });

  const maxValue = Math.max(
    ...data.datasets.flatMap(dataset => dataset.data),
    0
  ) * 1.2;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={rechartsData}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            stroke="rgba(0, 0, 0, 0.1)"
          />
          <XAxis
            dataKey="name"
            tickMargin={10}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={true}
          />
          <YAxis
            domain={[0, maxValue]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickFormatter={(value) => `${value.toLocaleString('id-ID')}`}
            axisLine={{ stroke: '#e5e7eb' }}
            width={15}
          />
          <Tooltip
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`]}
            labelFormatter={(label) => `Periode: ${label}`}
            contentStyle={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }}
          />
          {data.datasets.map((dataset, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey="value"
              name={dataset.label || 'Total Pendapatan'}
              stroke={dataset.borderColor || 'rgba(59, 130, 246, 1)'}
              fill={dataset.backgroundColor || 'rgba(59, 130, 246, 0.7)'}
              strokeWidth={dataset.borderWidth || 1.2}
              activeDot={{
                r: dataset.pointHoverRadius || 5,
                strokeWidth: 1,
                stroke: dataset.borderColor || 'rgba(59, 130, 246, 1)',
                fill: '#ffffff',
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;