import { FaChartBar, FaMoneyBillWave, FaBoxOpen, FaPercent, FaSmile, FaBullseye, FaTicketAlt } from "react-icons/fa";

export default function BentoTailwindDashboard() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Volume de Vendas</h2>
            <p className="text-2xl font-bold">1.234</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaMoneyBillWave size={32} className="text-green-400" />
          <div>
            <div className="text-xs text-zinc-400">Total em Vendas</div>
            <div className="text-2xl font-bold">R$ 53.000</div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaPercent size={32} className="text-purple-400" />
          <div>
            <div className="text-xs text-zinc-400">Ticket Médio</div>
            <div className="text-2xl font-bold">R$ 2.400</div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaBoxOpen size={32} className="text-yellow-400" />
          <div>
            <div className="text-xs text-zinc-400">Produtos Vendidos</div>
            <div className="text-2xl font-bold">320</div>
          </div>
        </div>
        {/* Card 5 */}
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-lg">
          <FaSmile size={32} className="text-pink-400" />
          <div>
            <div className="text-xs text-zinc-400">Lucro Médio</div>
            <div className="text-2xl font-bold">R$ 1.200</div>
          </div>
        </div>
        {/* Card grande para gráfico */}
        <div className="bg-zinc-800 rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center shadow-lg">
          <div className="text-lg font-semibold mb-2">Gráfico de Vendas</div>
          <div className="w-full h-40 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500">
            [Gráfico]
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <CardFaturamento />
        <CardMeta />
        <CardTicketMedio />
        <CardVolumeVendas />
        <CardTotalVendas />
        <CardProdutosVendidos />
      </div>
    </div>
  );
}

export function CardVolumeVendas({ volume = 0 }: { volume?: number }) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaChartBar size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Volume de Vendas</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">{volume.toLocaleString('pt-BR')}</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-green-200 text-sm font-semibold">▲ 12%</span>
        <span className="text-white/70 text-xs">vs. mês anterior</span> */}
      </div>
    </div>
  );
}

export function CardTotalVendas({ total = 0 }: { total?: number }) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaMoneyBillWave size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Total em Vendas</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-green-200 text-sm font-semibold">▲ 8%</span>
        <span className="text-white/70 text-xs">vs. mês anterior</span> */}
      </div>
    </div>
  );
}

export function CardProdutosVendidos({ produtos = 0 }: { produtos?: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaBoxOpen size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Produtos Vendidos</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">{produtos.toLocaleString('pt-BR')}</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-green-200 text-sm font-semibold">▲ 5%</span>
        <span className="text-white/70 text-xs">vs. mês anterior</span> */}
      </div>
    </div>
  );
}

export function CardFaturamento({ faturamento = 0 }: { faturamento?: number }) {
  return (
    <div className="bg-gradient-to-br from-purple-700 to-purple-500 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaMoneyBillWave size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Faturamento</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">{faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-green-200 text-sm font-semibold">▲ 54%</span>
        <span className="text-white/70 text-xs">vs. ano anterior</span> */}
      </div>
    </div>
  );
}

export function CardMeta() {
  return (
    <div className="bg-gradient-to-br from-pink-600 to-pink-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaBullseye size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Atingimento Meta</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">84,5%</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-red-200 text-sm font-semibold">▼ 28%</span>
        <span className="text-white/70 text-xs">vs. ano anterior</span> */}
      </div>
    </div>
  );
}

export function CardTicketMedio({ ticket = 0 }: { ticket?: number }) {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <FaTicketAlt size={28} className="text-white" />
        </div>
        <span className="text-white text-lg font-semibold">Ticket Médio</span>
      </div>
      <div className="text-2xl font-bold text-white mt-2">{ticket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      <div className="flex items-center gap-2 mt-1">
        {/* <span className="text-green-200 text-sm font-semibold">▲ 16%</span>
        <span className="text-white/70 text-xs">vs. ano anterior</span> */}
      </div>
    </div>
  );
} 