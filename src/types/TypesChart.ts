import type { ChartData as ChartJSData } from 'chart.js';
export type ChartTab = 'pendapatan' | 'okupansi';
export type ChartData = ChartJSData<'line', number[], string>;