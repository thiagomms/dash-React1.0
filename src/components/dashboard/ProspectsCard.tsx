import React, { useEffect, useRef } from 'react';
import { Prospect } from '../../types';
import { BarChart } from 'lucide-react';
import Chart from 'chart.js/auto';

interface ProspectsCardProps {
  prospects: Prospect[];
}

const ProspectsCard: React.FC<ProspectsCardProps> = ({ prospects }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Group prospects by date
      const prospectsByDate = prospects.reduce<Record<string, number>>((acc, prospect) => {
        const date = prospect.date;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});

      // Sort dates
      const sortedDates = Object.keys(prospectsByDate).sort();
      
      // Get the last 7 days if we have enough data, otherwise use all available dates
      const displayDates = sortedDates.length > 7 ? sortedDates.slice(-7) : sortedDates;
      
      // Format dates for display
      const formattedDates = displayDates.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      });

      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: formattedDates,
            datasets: [
              {
                label: 'Prospecções',
                data: displayDates.map(date => prospectsByDate[date]),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [prospects]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Prospecções</h2>
          <p className="text-3xl font-bold text-blue-600 mt-1">{prospects.length}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <BarChart size={24} className="text-blue-600" />
        </div>
      </div>
      <div className="h-48 mt-2">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ProspectsCard;