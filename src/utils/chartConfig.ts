import { 
  Chart as ChartJS,
  CategoryScale,    // Untuk sumbu X (kategori)
  LinearScale,      // Untuk sumbu Y (angka)
  BarElement,      // Untuk bar chart
  PointElement,    // Untuk titik di line chart
  LineElement,     // Untuk garis di line chart
  Title,           // Judul chart
  Tooltip,         // Tooltip saat hover
  Legend           // Legenda
} from 'chart.js';

export function registerChartJS() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
}