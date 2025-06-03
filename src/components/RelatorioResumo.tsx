import { FaChartLine, FaUsers, FaMoneyBillWave } from "react-icons/fa";

export default function RelatorioResumo() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Relatório Resumido</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaUsers size={32} className="text-blue-400" />
          <div>
            <div className="text-xs text-zinc-400">Novos Clientes</div>
            <div className="text-2xl font-bold">320</div>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaMoneyBillWave size={32} className="text-green-400" />
          <div>
            <div className="text-xs text-zinc-400">Receita</div>
            <div className="text-2xl font-bold">R$ 45.000</div>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaChartLine size={32} className="text-purple-400" />
          <div>
            <div className="text-xs text-zinc-400">Crescimento</div>
            <div className="text-2xl font-bold">+12%</div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-800 rounded-xl p-8 shadow-lg flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-lg font-semibold mb-4">Gráfico de Área</div>
        <div className="w-full h-48 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500">
          [Gráfico de área aqui]
        </div>
      </div>
    </div>
  );
} 