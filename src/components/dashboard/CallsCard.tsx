import React from 'react';
import { Call } from '../../types';
import { Phone, ExternalLink } from 'lucide-react';

interface CallsCardProps {
  calls: Call[];
}

const CallsCard: React.FC<CallsCardProps> = ({ calls }) => {
  const totalCalls = calls.length;
  const successfulCalls = calls.filter(call => call.outcome === 'successful').length;
  const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Ligações</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{totalCalls}</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-full">
          <Phone size={24} className="text-indigo-600" />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Taxa de Sucesso</span>
          <span className="font-medium">{successRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Duração média</p>
          <p className="font-semibold text-gray-800">
            {Math.round(calls.reduce((sum, call) => sum + call.duration, 0) / (calls.length || 1))} min
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Callbacks</p>
          <p className="font-semibold text-gray-800">
            {calls.filter(call => call.outcome === 'callback').length}
          </p>
        </div>
      </div>
      
      <a
        href="https://dashboard.clint.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
      >
        <span>Dashboard Clint</span>
        <ExternalLink size={16} className="ml-2" />
      </a>
    </div>
  );
};

export default CallsCard;