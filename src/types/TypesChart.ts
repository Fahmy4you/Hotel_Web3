export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

export type ChartTab = 'pendapatan' | 'okupansi';