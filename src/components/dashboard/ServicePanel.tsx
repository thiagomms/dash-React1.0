import React from 'react';
import { ServiceMetric } from '../../types';
import { MessageSquare, Clock, Users, CheckSquare } from 'lucide-react';

interface ServicePanelProps {
  metrics: ServiceMetric;
}

const ServicePanel: React.FC<ServicePanelProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Painel de Atendimento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-teal-100 p-2 rounded-full">
              <MessageSquare size={20} className="text-teal-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-600">Conversas Trabalhadas</h3>
              <p className="text-2xl font-bold text-teal-700">{metrics.conversationsWorked.total}</p>
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="text-xs text-gray-500 mb-2">Por Vendedor</h4>
            <div className="space-y-2">
              {metrics.conversationsWorked.bySeller.map((seller, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{seller.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-800">{seller.count}</span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-teal-500 h-1.5 rounded-full"
                        style={{ width: `${(seller.count / metrics.conversationsWorked.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users size={20} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-600">Conversas Recebidas</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-blue-700">{metrics.conversationsReceived}</p>
                <p className="ml-2 text-sm text-gray-500">/ {metrics.messagesReceived} mensagens</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <CheckSquare size={20} className="text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-600">Conversas Finalizadas</h3>
              <p className="text-2xl font-bold text-purple-700">{metrics.conversationsFinished}</p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg flex items-center">
            <div className="bg-amber-100 p-2 rounded-full">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-600">Tempo de Resposta Médio</h3>
              <p className="text-2xl font-bold text-amber-700">{metrics.averageResponseTime} min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePanel;