'use client';
import { registerChartJS } from '@/utils/chartConfig';
import { useEffect } from 'react';

export default function ChartJSInitializer() {
  useEffect(() => {
    registerChartJS();
  }, []);

  return null;
}