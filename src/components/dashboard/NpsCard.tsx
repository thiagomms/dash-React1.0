import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlehoxkfbdrosttbkkud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWhveGtmYmRyb3N0dGJra3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTI1MTIsImV4cCI6MjA2MTc2ODUxMn0.2_Ssf9SZT7_8-Yq1gSf8GFmfWXaKpesaMVj0aqzu5Xs';
const supabase = createClient(supabaseUrl, supabaseKey);

// Faixas de cor: vermelho (0-50), laranja (50-75), verde (75-100)
const GAUGE_SEGMENTS = [
  { name: 'Ruim', value: 50, color: '#ef4444' },
  { name: 'Regular', value: 25, color: '#fbbf24' },
  { name: 'Bom', value: 25, color: '#34d399' },
];

const NpsCard: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNps() {
      setLoading(true);
      const { data, error } = await supabase
        .from('nps_dash')
        .select('nota_utilidade, consultora, avaliacao_atendimento');
      if (!error && data) {
        setDados(data);
      }
      setLoading(false);
    }
    fetchNps();
  }, []);

  // Processamento dos dados NPS
  const total = dados.length;
  const promotores = dados.filter(d => d.nota_utilidade >= 9).length;
  const neutros = dados.filter(d => d.nota_utilidade >= 7 && d.nota_utilidade <= 8).length;
  const detratores = dados.filter(d => d.nota_utilidade <= 6).length;
  const nps = total > 0 ? Math.round(((promotores - detratores) / total) * 100) : 0;

  // Ponteiro do velocímetro
  const renderNeedle = ({ cx, cy, radius, nps }: { cx: number, cy: number, radius: number, nps: number }) => {
    // Ângulo: -90 (esq) até +90 (dir)
    const angle = (-90 + (nps / 100) * 180) * (Math.PI / 180);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return (
      <g>
        {/* Ponteiro */}
        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#3b82f6" strokeWidth={6} strokeLinecap="round" />
        {/* Círculo central */}
        <circle cx={cx} cy={cy} r={12} fill="#60a5fa" stroke="#23293a" strokeWidth={3} />
      </g>
    );
  };

  return (
    <div className="bg-[#23272F] rounded-2xl shadow p-6 mt-3 mb-8 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">NPS - Net Promoter Score</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-[180px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-gray-300 text-lg">Respostas</span>
            <span className="text-3xl font-bold text-white">{total}</span>
          </div>
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-green-400 text-lg font-semibold">Promotor</span>
            <span className="text-3xl font-bold text-green-400">{promotores}</span>
          </div>
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-yellow-400 text-lg font-semibold">Neutro</span>
            <span className="text-3xl font-bold text-yellow-400">{neutros}</span>
          </div>
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-red-500 text-lg font-semibold">Detrator</span>
            <span className="text-3xl font-bold text-red-500">{detratores}</span>
          </div>
          <div className="flex flex-col items-center min-w-[260px]">
            <span className="text-gray-300 mb-2">NPS</span>
            <div className="relative w-[220px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GAUGE_SEGMENTS}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="100%"
                    innerRadius={70}
                    outerRadius={100}
                    stroke="none"
                    label={false}
                  >
                    {GAUGE_SEGMENTS.map((entry, idx) => (
                      <Cell key={`cell-nps-segment-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* Ponteiro/agulha */}
                  <svg width="220" height="140" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    {renderNeedle({ cx: 110, cy: 140, radius: 85, nps })}
                  </svg>
                </PieChart>
              </ResponsiveContainer>
              {/* Texto central */}
              <span className="absolute left-0 right-0 top-[40px] text-center text-3xl font-bold text-gray-700 select-none">NPS</span>
              <span className="absolute left-0 right-0 top-[80px] text-center text-5xl font-extrabold text-white select-none drop-shadow-lg">{nps}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NpsCard;