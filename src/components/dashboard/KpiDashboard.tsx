interface KpiDashboardProps {
  totalVendas: number;
  totalLiquido: number;
  percentualLiquido: number;
  produtosVendidos: number;
  ticketMedio: number;
  lucroMedio: number;
}

export default function KpiDashboard({
  totalVendas,
  totalLiquido,
  percentualLiquido,
  produtosVendidos,
  ticketMedio,
  lucroMedio,
}: KpiDashboardProps) {
  return (
    <div className="bg-zinc-100 rounded-2xl flex flex-row justify-between items-center p-4 mb-8 gap-2">
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Total em Vendas</span>
        <span className="text-xl text-indigo-600 font-semibold">{totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Total Líquido</span>
        <span className="text-xl text-indigo-600 font-semibold">{totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Líquido</span>
        <span className="text-xl text-indigo-600 font-semibold">{percentualLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Produtos Vendidos</span>
        <span className="text-xl text-indigo-600 font-semibold">{produtosVendidos}</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Ticket Médio</span>
        <span className="text-xl text-indigo-600 font-semibold">{ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-xs text-zinc-600 font-medium">Lucro Médio</span>
        <span className="text-xl text-indigo-600 font-semibold">{lucroMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
} 