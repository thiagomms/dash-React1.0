import React, { useState } from 'react';
import { FaChartBar, FaShoppingCart } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const menu = [
  { label: 'Dashboards', icon: <FaChartBar size={20} />, path: '/' },
  { label: 'Ticket Médios', icon: <FaShoppingCart size={20} />, path: '/ticket-medios' },
  { label: 'Faturamentos', icon: <FaChartBar size={20} />, path: '/faturamentos' },
];

interface SidebarKpisProps {
  totalRevenue?: number;
  ticketMedio?: number;
  vendas?: number;
  somaAprovadasFiltradas?: number;
}

interface SidebarProps extends SidebarKpisProps {}

const Sidebar: React.FC<SidebarProps> = ({ totalRevenue, ticketMedio, vendas, somaAprovadasFiltradas }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={`h-screen bg-[#09090b] text-white flex flex-col justify-between fixed left-0 top-0 z-40 shadow-lg transition-all duration-300 ${isHovered ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 px-2 py-8 font-bold text-xl min-h-[56px]">
        <span className="bg-[#2d3650] text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg">DC</span>
        {isHovered && <span className="text-white text-lg font-bold ml-2 transition-opacity duration-300">Dashboard Comercial</span>}
      </div>
      <nav className="flex-1 px-1 flex flex-col gap-1">
        {menu.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors font-medium text-base w-full
              ${location.pathname === item.path
                ? 'text-zinc-200 hover:bg-[#0037d5] text-white shadow'
                : 'text-zinc-200 hover:bg-[#0037d5] hover:text-white'}
            `}
            style={{ outline: 'none', border: 'none' }}
          >
            {item.icon}
            {isHovered && <span className="ml-2 transition-opacity duration-300">{item.label}</span>}
          </button>
        ))}
      </nav>
      {/* KPIs de Faturamento - só exibe se as props existirem e sidebar expandida */}
      {isHovered && typeof totalRevenue === 'number' && typeof ticketMedio === 'number' && typeof vendas === 'number' && typeof somaAprovadasFiltradas === 'number' && (
        <div className="px-6 py-4 mb-0 bg-[#2d3344] rounded-xl flex flex-col gap-3">
          <div>
            <div className="text-white text-xs text-zinc-500 font-medium">Faturamento</div>
            <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className="text-xs text-zinc-400">Total do período</div>
          </div>
          <div>
            <div className="text-xs text-purple-500 font-medium">Ticket Médio</div>
            <div className="text-2xl font-bold text-purple-700">{ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className="text-xs text-purple-400">Por venda</div>
          </div>
          <div>
            <div className="text-xs text-blue-500 font-medium">Vendas</div>
            <div className="text-2xl font-bold text-[#5096e8]">{vendas}</div>
            <div className="text-xs text-blue-400">Vendas registradas</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-medium">Soma das Compras Aprovadas (com filtros)</div>
            <div className="text-xl font-semibold text-white">{somaAprovadasFiltradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 