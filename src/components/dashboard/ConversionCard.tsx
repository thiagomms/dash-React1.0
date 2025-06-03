import React, { useEffect, useRef } from 'react';
import { Conversion } from '../../types';
import { TrendingUp } from 'lucide-react';
import Chart from 'chart.js/auto';

interface ConversionCardProps {
  conversion: Conversion;
}

const ConversionCard: React.FC<ConversionCardProps> = ({ conversion }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Create doughnut chart
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Convertidos', 'Não Convertidos'],
            datasets: [
              {
                data: [conversion.totalEnrollments, conversion.totalProspects - conversion.totalEnrollments],
                backgroundColor: ['#10B981', '#E5E7EB'],
                borderWidth: 0,
                borderRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = conversion.totalProspects;
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [conversion]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Conversão</h2>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{conversion.rate}%</p>
        </div>
        <div className="bg-emerald-100 p-3 rounded-full">
          <TrendingUp size={24} className="text-emerald-600" />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Matrículas</p>
          <p className="text-xl font-bold text-gray-800">{conversion.totalEnrollments}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Prospecções</p>
          <p className="text-xl font-bold text-gray-800">{conversion.totalProspects}</p>
        </div>
      </div>

      <div className="h-32 mt-2">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ConversionCard;