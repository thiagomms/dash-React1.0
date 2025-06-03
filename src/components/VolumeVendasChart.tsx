import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface VolumeVendasChartProps {
  data: { date: string; vendas: number }[];
}

export default function VolumeVendasChart({ data }: VolumeVendasChartProps) {
  return (
    <div className="bg-[#23293a] rounded-2xl shadow-lg p-6 w-full">
      <h3 className="font-semibold text-lg mb-4 text-white">Volume de Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444857" />
          <XAxis dataKey="date" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} />
          <YAxis stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} />
          <Tooltip />
          <Bar dataKey="vendas" fill="#a259f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TopEstadosChartProps {
  data: { estado: string; total: number }[];
}

export function TopEstadosChart({ data }: TopEstadosChartProps) {
  return (
    <div className="bg-[#23293a] rounded-2xl shadow-lg p-6 w-full">
      <h3 className="font-semibold text-lg mb-4 text-white">Top Estados com Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#444857" />
          <XAxis type="number" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} />
          <YAxis dataKey="estado" type="category" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} width={60} />
          <Tooltip />
          <Bar dataKey="total" fill="#a259f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 