import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Label } from 'recharts';

const COLORS = ['#34d399', '#fbbf24', '#ef4444', '#60a5fa', '#a78bfa', '#f472b6', '#f87171'];

interface DonutData {
  name: string;
  value: number;
}

interface RevenueDonutChartsProps {
  dataStatus: DonutData[];
  dataPagamento: DonutData[];
  dataDiasSemana: DonutData[];
}

// Função customizada para label
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value === 0) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      stroke="#23293a"
      strokeWidth={0.5}
    >
      {value}
    </text>
  );
};

const RevenueDonutCharts: React.FC<RevenueDonutChartsProps> = ({ dataStatus, dataPagamento, dataDiasSemana }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    {/* Vendas por Status */}
    <div className="bg-[#23293a] rounded-xl shadow p-4">
      <h3 className="text-white font-semibold mb-2">Vendas por Status</h3>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie data={dataStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} label={renderCustomLabel} labelLine={false}>
            {dataStatus.map((entry, index) => (
              <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    {/* Formas de Pagamento */}
    <div className="bg-[#23293a] rounded-xl shadow p-4">
      <h3 className="text-white font-semibold mb-2">Formas de Pagamento</h3>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie data={dataPagamento} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} label={renderCustomLabel} labelLine={false}>
            {dataPagamento.map((entry, index) => (
              <Cell key={`cell-pagamento-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    {/* Vendas por Dias da Semana */}
    <div className="bg-[#23293a] rounded-xl shadow p-4">
      <h3 className="text-white font-semibold mb-2">Vendas por Dias da Semana</h3>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie data={dataDiasSemana} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55} label={renderCustomLabel} labelLine={false}>
            {dataDiasSemana.map((entry, index) => (
              <Cell key={`cell-dia-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RevenueDonutCharts; 