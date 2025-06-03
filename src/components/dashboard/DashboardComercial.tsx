import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChartCard } from '../components/widgets/ChartCard';
import { DollarSign, ShoppingCart, Package, CreditCard } from 'lucide-react';

// Dados mockados para os gráficos
const npsData = {
  respostas: 77,
  promotor: 77,
  neutro: 0,
  detrator: 0,
  score: 100
};

const prospeccaoData = {
  labels: ['DENISE', 'THAIS', 'GISLAYNE'],
  datasets: [{
    label: 'Prospecções',
    data: [10, 3, 0],
    backgroundColor: '#10B981'
  }]
};

const statsCards = [
  {
    title: 'Faturamento',
    value: 'R$ 58.722,22',
    description: 'Total geral aprovado',
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  {
    title: 'Vendas',
    value: '1000',
    description: 'Total de vendas',
    icon: ShoppingCart,
    color: 'bg-blue-500'
  },
  {
    title: 'Produtos Vendidos',
    value: '391',
    description: 'Unidades aprovadas',
    icon: Package,
    color: 'bg-violet-500'
  },
  {
    title: 'Ticket Médio',
    value: 'R$ 150,18',
    description: 'Por venda',
    icon: CreditCard,
    color: 'bg-emerald-500'
  }
];

const topEstadosData = {
  labels: ['SP', 'PR', 'RJ', 'BA', 'GO'],
  datasets: [{
    label: 'Vendas por Estado',
    data: [135, 70, 45, 25, 15],
    backgroundColor: '#A855F7'
  }]
};

const vendasStatusData = {
  labels: ['Aprovada', 'Expirada', 'Cancelada', 'Boleto Impresso', 'Ag. Pagamento', 'Reembolsada'],
  datasets: [{
    data: [380, 70, 22, 137, 280, 0],
    backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899']
  }]
};

const formasPagamentoData = {
  labels: ['Pix', 'Cartão de Crédito', 'Boleto Bancário'],
  datasets: [{
    data: [541, 152, 190],
    backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
  }]
};

const vendasSemanaData = {
  labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  datasets: [{
    data: [15, 96, 666, 160, 63, 15, 0],
    backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1']
  }]
};

const volumeVendasData = {
  labels: ['12/05', '13/05', '14/05', '18/05', '19/05', '20/05', '21/05', '22/05', '25/05', '26/05', '27/05', '28/05'],
  datasets: [{
    label: 'Volume de Vendas',
    data: [0, 0, 0, 0, 50, 100, 75, 0, 50, 600, 50, 0],
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)'
  }]
};

const topProdutos = [
  {
    nome: '[WORKBOOK] - ALFABETIZAÇÃO SEM SEGREDOS',
    categoria: '1718820054',
    unidades: 1,
    valor: 'R$ 27,00'
  },
  {
    nome: 'TESOURANDO - GUIA DE ESTIMULAÇÃO DO USO DA TESOURA NA EDUCAÇÃO INFANTIL',
    categoria: '1721994531',
    unidades: 1,
    valor: 'R$ 27,00'
  },
  {
    nome: '[E-BOOK] - ESTIMULANDO A CONSCIÊNCIA FONOLÓGICA: RIMA',
    categoria: '1721826295',
    unidades: 1,
    valor: 'R$ 27,00'
  },
  {
    nome: '[INGRESSO NEUROAULA] - NA10',
    categoria: '1748017441',
    unidades: 1,
    valor: 'R$ 27,00'
  },
  {
    nome: '[CURSO] - DO SOM À LETRA: DECIFRANDO A CONSCIÊNCIA FONOLÓGICA',
    categoria: '1717434704',
    unidades: 1,
    valor: 'R$ 197,00'
  }
];

export const DashboardComercial: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* NPS Card */}
        <Card>
          <CardHeader>
            <CardTitle>NPS - Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Respostas</p>
                <p className="text-2xl font-bold">{npsData.respostas}</p>
              </div>
              <div>
                <p className="text-sm text-green-500">Promotor</p>
                <p className="text-2xl font-bold text-green-500">{npsData.promotor}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-500">Neutro</p>
                <p className="text-2xl font-bold text-yellow-500">{npsData.neutro}</p>
              </div>
              <div>
                <p className="text-sm text-red-500">Detrator</p>
                <p className="text-2xl font-bold text-red-500">{npsData.detrator}</p>
              </div>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-green-500" style={{ width: `${npsData.score}%` }}></div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-2xl font-bold">{npsData.score}</span>
            </div>
          </CardContent>
        </Card>

        {/* Prospecção Comercial */}
        <Card>
          <CardHeader>
            <CardTitle>Prospecção Comercial</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartCard
              title=""
              chartData={prospeccaoData}
              type="bar"
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Estados com Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartCard
                title=""
                chartData={topEstadosData}
                type="bar"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chartData={vendasStatusData}
                  type="doughnut"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chartData={formasPagamentoData}
                  type="doughnut"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendas por Dias da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chartData={vendasSemanaData}
                  type="doughnut"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Volume de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartCard
              title=""
              chartData={volumeVendasData}
              type="line"
            />
          </CardContent>
        </Card>

        {/* Top Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4">Produtos</th>
                    <th className="text-left py-3 px-4">Categoria</th>
                    <th className="text-left py-3 px-4">Unidades vendidas</th>
                    <th className="text-left py-3 px-4">Valores</th>
                  </tr>
                </thead>
                <tbody>
                  {topProdutos.map((produto, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="py-3 px-4">{produto.nome}</td>
                      <td className="py-3 px-4">{produto.categoria}</td>
                      <td className="py-3 px-4">{produto.unidades}</td>
                      <td className="py-3 px-4">{produto.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};