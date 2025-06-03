import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Grid, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardHeader from './components/DashboardHeader';
import AverageTicketCard from './components/dashboard/AverageTicketCard';
import RevenueTable from './components/dashboard/RevenueTable';
import RevenueDonutCharts from './components/dashboard/RevenueDonutCharts';
import { createClient } from '@supabase/supabase-js';
import { format, getDay } from 'date-fns';
import VolumeVendasChart, { TopEstadosChart } from './components/VolumeVendasChart';
import KpiDashboard from './components/dashboard/KpiDashboard';
import BentoTailwindDashboard from './components/BentoTailwindDashboard';
import { FaChartBar, FaMoneyBillWave, FaBoxOpen, FaPercent, FaSmile } from "react-icons/fa";
import { CardFaturamento, CardMeta, CardTicketMedio, CardVolumeVendas, CardTotalVendas, CardProdutosVendidos } from './components/BentoTailwindDashboard';
import RelatorioResumo from './components/RelatorioResumo';
import CustomerInsights from './components/CustomerInsights';
import NpsCard from './components/dashboard/NpsCard';

import { PeriodFilter } from './types';
import { 
  mockProspects, 
  mockCustomers, 
  mockCalls, 
  mockServiceMetrics, 
  mockConversion, 
  mockNpsData,
  mockPurchases,
  getCurrentMonthData,
  getLastMonthData,
  getCustomRangeData
} from './data/mockData';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BarChart, Bar } from 'recharts';

// Defina um tipo para venda
type Venda = {
  id: number;
  data_criada?: string;
  data_aprovada?: string;
  payload?: {
    status?: string;
    payment?: { method?: string };
    product?: {
      name?: string;
      marketplace_id?: string;
      total_value?: number;
      unit_value?: number;
      qty?: number;
    };
  };
};

const supabaseUrl = 'https://nlehoxkfbdrosttbkkud.supabase.co';
const supabaseKey = '';
const supabase = createClient(supabaseUrl, supabaseKey);

const drawerWidth = 220;

function TopToolbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#23272F',
        color: '#fff',
        boxShadow: 3,
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          height: 56,
          minHeight: 56,
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dashboard Comercial
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 600 }}>Overview</Button>
          <Button color="inherit" component={Link} to="/ticket-medios" sx={{ fontWeight: 600 }}>Ticket Médios</Button>
          <Button color="inherit" component={Link} to="/faturamentos" sx={{ fontWeight: 600 }}>Faturamentos</Button>
        </Box>
        {/* Aqui você pode colocar avatar, search, etc */}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [period, setPeriod] = useState<PeriodFilter>({ type: 'currentMonth' });
  const [filteredData, setFilteredData] = useState({
    prospects: mockProspects,
    calls: mockCalls,
    purchases: mockPurchases,
    npsData: mockNpsData,
    currentMonthNps: mockNpsData[mockNpsData.length - 1]
  });
  const [vendas, setVendas] = useState<Venda[]>([]);
  
  useEffect(() => {
    // Filter data based on selected period
    let data;
    
    switch (period.type) {
      case 'currentMonth':
        data = getCurrentMonthData();
        break;
      case 'lastMonth':
        data = getLastMonthData();
        break;
      case 'custom':
        if (period.startDate && period.endDate) {
          data = getCustomRangeData(period.startDate, period.endDate);
        }
        break;
      default:
        data = getCurrentMonthData();
    }
    
    if (data) {
      setFilteredData({
        prospects: data.prospects,
        calls: data.calls,
        purchases: data.purchases,
        npsData: mockNpsData,
        currentMonthNps: data.npsData
      });
    }
  }, [period]);

  useEffect(() => {
    async function fetchVendas() {
      const { data, error } = await supabase.from('vendas_guru').select('*');
      if (!error && data) {
        setVendas(data as Venda[]);
        console.log('Total vendas:', data.length);
        console.log('Aprovadas:', data.filter((v: any) => v.payload?.status === 'approved').length);
        console.log('Soma aprovadas:', data.filter((v: any) => v.payload?.status === 'approved').reduce((acc: number, v: any) => acc + (v.payload?.product?.total_value || 0), 0));
      }
    }
    fetchVendas();
  }, []);
  
  // Funções auxiliares para extrair os campos
  function getStatus(venda: Venda): keyof typeof statusMap | '-' {
    const status = venda.payload?.status;
    if (status && statusMap.hasOwnProperty(status)) return status as keyof typeof statusMap;
    return '-';
  }
  function getPagamento(venda: Venda): keyof typeof pagamentoMap | '-' {
    const metodo = venda.payload?.payment?.method;
    if (metodo && pagamentoMap.hasOwnProperty(metodo)) return metodo as keyof typeof pagamentoMap;
    return '-';
  }
  function getMarketplace(venda: Venda) {
    return venda.payload?.product?.marketplace_id || '-';
  }

  // Montar os arrays para os gráficos
  const statusLabels = ['Aprovada', 'Expirada', 'Cancelada', 'Boleto Impresso', 'Ag. Pagamento', 'Reembolsada'];
  const statusMap = {
    approved: 'Aprovada',
    expired: 'Expirada',
    canceled: 'Cancelada',
    billet_printed: 'Boleto Impresso',
    waiting_payment: 'Ag. Pagamento',
    refunded: 'Reembolsada',
  };

  const dataStatus = statusLabels.map(label => ({
    name: label,
    value: vendas.filter(v => {
      const status = getStatus(v);
      return status !== '-' && statusMap[status] === label;
    }).length,
  }));

  const pagamentoLabels = ['Pix', 'Cartão de Crédito', 'Boleto Bancário'];
  const pagamentoMap = {
    pix: 'Pix',
    credit_card: 'Cartão de Crédito',
    billet: 'Boleto Bancário',
  };
  const dataPagamento = pagamentoLabels.map(label => ({
    name: label,
    value: vendas.filter(v => {
      const metodo = getPagamento(v);
      return metodo !== '-' && pagamentoMap[metodo] === label;
    }).length,
  }));

  // Vendas por Dias da Semana
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dataDiasSemana = diasSemana.map((dia, idx) => ({
    name: dia,
    value: vendas.filter(v => {
      const data = v.data_criada ? new Date(v.data_criada) : (v.data_aprovada ? new Date(v.data_aprovada) : null);
      if (!data) return false;
      const d = new Date(data);
      return getDay(d) === idx;
    }).length,
  }));

  // Agrupa vendas por dia
  const vendasPorDia: { [date: string]: number } = {};
  vendas.forEach((v) => {
    const data = v.data_criada ? new Date(v.data_criada) : (v.data_aprovada ? new Date(v.data_aprovada) : null);
    if (!data || isNaN(data.getTime())) return;
    const dia = data.toLocaleDateString('pt-BR');
    vendasPorDia[dia] = (vendasPorDia[dia] || 0) + 1;
  });
  const chartData = Object.entries(vendasPorDia).map(([date, vendas]) => ({ date, vendas }));
  chartData.sort((a, b) => {
    const [d1, m1, y1] = a.date.split('/');
    const [d2, m2, y2] = b.date.split('/');
    return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
  });

  const vendasAprovadasPeriodo = vendas.filter(v => v.payload?.status === 'approved');
  const totalPeriodo = vendasAprovadasPeriodo.reduce((acc, v) => acc + (v.payload?.product?.total_value || 0), 0);

  const vendasAprovadasGeral = vendas.filter(v => v.payload?.status === 'approved');
  const totalGeral = vendasAprovadasGeral.reduce((acc, v) => acc + (v.payload?.product?.total_value || 0), 0);

  const totalLiquido = vendasAprovadasPeriodo.reduce((acc, v) => acc + (v.payload?.product?.unit_value || 0), 0);
  const produtosVendidos = vendasAprovadasPeriodo.reduce((acc, v) => acc + (v.payload?.product?.qty || 0), 0);
  const ticketMedio = produtosVendidos ? totalPeriodo / produtosVendidos : 0;
  const lucroMedio = produtosVendidos ? totalLiquido / produtosVendidos : 0;

  // Exemplo de produtos para tabela (mock)
  const topProducts = vendasAprovadasGeral.slice(0, 5).map((v, idx) => ({
    name: v.payload?.product?.name || `Produto ${idx + 1}`,
    category: v.payload?.product?.marketplace_id || 'Categoria',
    qty: v.payload?.product?.qty || 0,
    revenue: v.payload?.product?.total_value || 0,
  }));

  // Exemplo de dados mockados
  const data = [
    { name: 'Jan', vendas: 400 },
    { name: 'Fev', vendas: 300 },
    { name: 'Mar', vendas: 500 },
    { name: 'Abr', vendas: 200 },
    { name: 'Mai', vendas: 600 },
  ];

  // Adicionar dados dos top estados
  const topEstadosData = [
    { estado: 'SP', total: 130 },
    { estado: 'MG', total: 70 },
    { estado: 'PR', total: 43 },
    { estado: 'SC', total: 39 },
    { estado: 'RJ', total: 37 },
    { estado: 'RS', total: 25 },
    { estado: 'BA', total: 20 },
    { estado: 'MT', total: 12 },
    { estado: 'GO', total: 11 },
  ];

  // Dados mockados de prospecção do comercial
  const prospeccaoComercial = [
    { nome: 'DENISE', total: 9 },
    { nome: 'THAIS', total: 2 },
    { nome: 'GISLAYNE', total: 0 },
  ];

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', bgcolor: '#181C23', minHeight: '100vh' }}>
        <CssBaseline />
        <TopToolbar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: '#181C23', minHeight: '100vh' }}>
          <Toolbar sx={{ minHeight: 56 }} />
          <Routes>
            <Route path="/ticket-medios" element={<AverageTicketCard />} />
            <Route path="/faturamentos" element={
              <div className="w-full flex flex-col items-center">
                <RevenueTable />
              </div>
            } />
            <Route path="/dashboard" element={<BentoTailwindDashboard />} />
            <Route path="/relatorio-resumo" element={<RelatorioResumo />} />
            <Route path="/customer-insights" element={<CustomerInsights />} />
            <Route path="/" element={
              <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
                <NpsCard />
                {/* Gráfico de Prospecção Comercial */}
                <div style={{ margin: '32px 0' }}>
                  <Paper sx={{ p: 3, bgcolor: '#23272F', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Prospecção Comercial</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={prospeccaoComercial} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#444857" />
                        <XAxis type="number" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} allowDecimals={false} />
                        <YAxis dataKey="nome" type="category" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} width={90} />
                        <Tooltip contentStyle={{ background: 'black', color: '#00E676', border: 'none', borderRadius: 8 }} />
                        <Bar dataKey="total" fill="#00E676" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: 32 }}>
                  {/* Card Faturamento */}
                  <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px] flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <FaMoneyBillWave size={28} className="text-white" />
                      </div>
                      <span className="text-white text-lg font-semibold">Faturamento</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <span className="text-white/70 text-xs">Total geral aprovado</span>
                  </div>
                  {/* Card Vendas */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px] flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <ShoppingCartIcon sx={{ color: '#fff', fontSize: 28 }} />
                      </div>
                      <span className="text-white text-lg font-semibold">Vendas</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{vendas.length}</div>
                    <span className="text-white/70 text-xs">Total de vendas</span>
                  </div>
                  {/* Card Produtos Vendidos */}
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px] flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <BarChartIcon sx={{ color: '#fff', fontSize: 28 }} />
                      </div>
                      <span className="text-white text-lg font-semibold">Produtos Vendidos</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{produtosVendidos}</div>
                    <span className="text-white/70 text-xs">Unidades aprovadas</span>
                  </div>
                  {/* Card Ticket Médio */}
                  <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-xl p-6 shadow-lg flex flex-col gap-2 min-w-[220px] flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <BarChartIcon sx={{ color: '#fff', fontSize: 28 }} />
                      </div>
                      <span className="text-white text-lg font-semibold">Ticket Médio</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <span className="text-white/70 text-xs">Por venda</span>
                  </div>
                </div>
                {/* Gráfico Top Estados */}
                <div style={{ marginBottom: 32 }}>
                  <TopEstadosChart data={topEstadosData} />
                </div>
                
                <RevenueDonutCharts
                  dataStatus={dataStatus}
                  dataPagamento={dataPagamento}
                  dataDiasSemana={dataDiasSemana}
                />
                <VolumeVendasChart data={chartData} />
                <Paper sx={{ p: 3, bgcolor: '#23272F', color: '#fff', mt: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Top Produtos</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#aaa' }}>Produtos</TableCell>
                          <TableCell sx={{ color: '#aaa' }}>Categoria</TableCell>
                          <TableCell sx={{ color: '#aaa' }}>Unidades vendidas</TableCell>
                          <TableCell sx={{ color: '#aaa' }}>Valores</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProducts.map((prod, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ color: '#fff' }}>{prod.name}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{prod.category}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{prod.qty}</TableCell>
                            <TableCell sx={{ color: '#fff' }}>{prod.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            } />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;