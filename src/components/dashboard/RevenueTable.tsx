import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, CheckCircle, AlertTriangle, XCircle, CreditCard, Barcode, QrCode, Ban } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

const supabaseUrl = 'https://nlehoxkfbdrosttbkkud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWhveGtmYmRyb3N0dGJra3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTI1MTIsImV4cCI6MjA2MTc2ODUxMn0.2_Ssf9SZT7_8-Yq1gSf8GFmfWXaKpesaMVj0aqzu5Xs'; // Pegue no painel do Supabase (Project Settings > API > anon key)
export const supabase = createClient(supabaseUrl, supabaseKey);

const RevenueTable: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [sortField, setSortField] = useState<string>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [purchases, setPurchases] = useState<any[]>([]);
  // Pega os últimos 7 dias por padrão
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 6);
  const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(formatDateInput(seteDiasAtras));
  const [endDate, setEndDate] = useState(formatDateInput(hoje));
  const [loading, setLoading] = useState(false);
  const [filtroProduto, setFiltroProduto] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState<{ value: string, label: string }[]>([]);
  const [showFiltros, setShowFiltros] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [pagamentoFiltro, setPagamentoFiltro] = useState('');
  const [produtoFiltro, setProdutoFiltro] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [modalStartDate, setModalStartDate] = useState('');
  const [modalEndDate, setModalEndDate] = useState('');
  const [modalStatusFiltro, setModalStatusFiltro] = useState('');
  const [modalPagamentoFiltro, setModalPagamentoFiltro] = useState('');
  const [modalProdutoFiltro, setModalProdutoFiltro] = useState<string[]>([]);
  const [produtoBusca, setProdutoBusca] = useState('');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedPurchases = [...purchases].sort((a, b) => {
    if (["data", "status", "pagamento", "nomeProduto"].includes(sortField)) {
      const aValue = (a[sortField] ?? '').toString();
      const bValue = (b[sortField] ?? '').toString();
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc'
        ? Number(a[sortField] ?? 0) - Number(b[sortField] ?? 0)
        : Number(b[sortField] ?? 0) - Number(a[sortField] ?? 0);
    }
  });
  
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = sortedPurchases.slice(startIndex, startIndex + itemsPerPage);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Faturamento e ticket médio considerando apenas vendas aprovadas
  const vendasAprovadas = purchases.filter(p => p.status === 'Aprovado');
  const totalRevenue = vendasAprovadas.reduce((sum, purchase) => sum + (purchase.valorProdutos || purchase.total_value || 0), 0);
  const ticketMedio = vendasAprovadas.length ? (totalRevenue / vendasAprovadas.length) : 0;
  
  const filteredPurchases = purchases.filter(p => {
    return (
      (!statusFiltro || p.status === traduzirStatus(statusFiltro)) &&
      (!pagamentoFiltro || p.pagamento === traduzirMetodoPagamento(pagamentoFiltro)) &&
      (!produtoFiltro || p.nomeProduto.toLowerCase().includes(produtoFiltro.toLowerCase())) &&
      (startDate ? new Date(p.data) >= new Date(startDate) : true) &&
      (endDate ? new Date(p.data) <= new Date(endDate) : true)
    );
  });
  
  // Soma de vendas por pessoa do comercial (prospecção)
  const nomesComercial = ['DENISE', 'THAIS', 'GISLAYNE'];
  const vendasPorComercial = nomesComercial.map(nome => ({
    nome,
    total: filteredPurchases.filter(p => (p.offerName || '').toUpperCase().includes(nome)).length
  }));
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="ml-1" />
    ) : (
      <ArrowDown size={14} className="ml-1" />
    );
  };

  const fetchFaturamento = async (
    filtroDataInicio = '',
    filtroDataFim = '',
    filtroStatus = '',
    filtroPagamento = '',
    filtroProduto = ''
  ) => {
    setLoading(true);
    try {
      let query = supabase.from('vendas_guru').select('*').range(0, 9999).order('data_criada', { ascending: false });

      const filtroDataInicioCompleto = filtroDataInicio ? toUTCStringLocal(filtroDataInicio) : '';
      const filtroDataFimCompleto = filtroDataFim ? toUTCStringLocal(filtroDataFim, true) : '';

      if (filtroDataInicioCompleto) query = query.gte('data_criada', filtroDataInicioCompleto);
      if (filtroDataFimCompleto) query = query.lte('data_criada', filtroDataFimCompleto);
      if (filtroStatus) {
        query = query.eq('payload->>status', filtroStatus);
      }
      if (filtroPagamento) query = query.eq('payload->payment->>method', filtroPagamento);
      if (filtroProduto) query = query.ilike('payload->product->>name', `%${filtroProduto}%`);

      if (modalProdutoFiltro.length > 0) {
        query = query.in('payload->product->>name', modalProdutoFiltro);
      }

      console.log('Parâmetros enviados:', filtroDataInicio, filtroDataFim, filtroStatus, filtroPagamento, filtroProduto);

      const { data, error } = await query;

      console.log('Dados retornados:', data, 'Erro:', error);

      if (error) {
        setPurchases([]);
        setShowMetrics(true);
        toast.error('Erro ao carregar dados!');
        return;
      }

      // Mapeia os dados para o formato esperado pela tabela      
      const mapped = (data || []).map((item: any) => {
        const product = item.payload?.product || {};
        const status = item.payload?.status || '-';
        const metodo = item.payload?.payment?.method || '-';
        return {
          id: item.id,
          status: traduzirStatus(status),
          pagamento: traduzirMetodoPagamento(metodo),
          nomeProduto: product.name || '-',
          offerName: item.offer_name || '-',
          valorVenda: product.unit_value ?? null,
          valorProdutos: product.total_value ?? null,
          tipo: product.type || '-',
          data: item.data_criada ? new Date(item.data_criada).toISOString() : null,
          dataAtualizada: item.data_aprovada ? new Date(item.data_aprovada).toISOString() : null,
          quantidade: product.qty ?? null,
          marketplace_id: product.marketplace_id || '-',
          name: item.name || '-',
        };
      })
      // Filtra para não mostrar Expirado SEMPRE
      .filter((item: any) => item.status !== 'Expirado');

      setPurchases(mapped);
      setShowMetrics(true);
      toast.success('Dados carregados com sucesso!');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      const mapped = json.map((row: any) => ({
        status: row.status || row.Status || '',
        pagamento: row.pagamento || row.Pagamento || '',
        valorVenda: Number(row.valorVenda || row['Valor Venda'] || row.valor || row.Valor || 0),
        valorProdutos: Number(row.valorProdutos || row['Valor Produtos'] || 0),
        nomeProduto: row.nomeProduto || row['Nome Produto'] || '',
        data: row.data ? new Date(row.data).toISOString() : null,
        amountPaid: Number(row.valorVenda || row['Valor Venda'] || row.valor || row.Valor || 0),
        name: row.name || row['Nome Contato'] || '',
      }));
      setPurchases(mapped);
    };
    reader.readAsArrayBuffer(file);
  };

  const opcoesProdutos = purchases.map((p) => ({
    value: p.marketplace_id,
    label: `${p.nomeProduto} (${p.marketplace_id})`
  }));

  // Soma das compras aprovadas considerando os filtros aplicados
  const comprasAprovadasFiltradas = filteredPurchases.filter(p => p.status === 'Aprovado');
  const somaAprovadasFiltradas = comprasAprovadasFiltradas.reduce((sum, purchase) => sum + (purchase.valorVenda || 0), 0);

  useEffect(() => {
    fetchFaturamento(formatDateInput(seteDiasAtras), formatDateInput(hoje));
  }, []);

  useEffect(() => {
    if (showFiltros) {
      setModalStartDate('');
      setModalEndDate('');
      setModalStatusFiltro(statusFiltro);
      setModalPagamentoFiltro(pagamentoFiltro);
      setModalProdutoFiltro(produtoFiltro ? [produtoFiltro] : []);
    }
    // eslint-disable-next-line
  }, [showFiltros]);

  const aplicarFiltros = async () => {
    setStartDate(modalStartDate);
    setEndDate(modalEndDate);
    setStatusFiltro(modalStatusFiltro);
    setPagamentoFiltro(modalPagamentoFiltro);
    setProdutoFiltro(produtoBusca);

    await fetchFaturamento(
      modalStartDate,
      modalEndDate,
      modalStatusFiltro || '',
      modalPagamentoFiltro || '',
      produtoBusca || ''
    );
    setShowFiltros(false);
  };

  return (
    <div className={`min-h-screen text-white flex flex-col items-center py-12 ${className}`}>
      {/* KPIs no topo */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Card Faturamento */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl p-4 flex flex-col items-start shadow-md">
          <span className="text-sm text-white font-medium">Faturamento</span>
          <span className="text-2xl font-bold text-white">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span className="text-xs text-white/70 mt-1">Total do período</span>
        </div>
        {/* Card Ticket Médio */}
        <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-xl p-4 flex flex-col items-start shadow-md">
          <span className="text-sm text-white font-medium">Ticket Médio</span>
          <span className="text-2xl font-bold text-white">{ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span className="text-xs text-white/70 mt-1">Por venda</span>
        </div>
        {/* Card Vendas */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl p-4 flex flex-col items-start shadow-md">
          <span className="text-sm text-white font-medium">Vendas</span>
          <span className="text-2xl font-bold text-white">{purchases.length}</span>
          <span className="text-xs text-white/70 mt-1">Vendas registradas</span>
        </div>
        {/* Card Soma das Compras Aprovadas */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-400 rounded-xl p-4 flex flex-col items-start shadow-md">
          <span className="text-sm text-white font-medium">Soma das Compras Aprovadas (com filtros)</span>
          <span className="text-xl font-semibold text-white">{somaAprovadasFiltradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        {/* Card Prospecção Comercial */}
        {vendasAprovadas.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-xl p-4 flex flex-col items-start shadow-md col-span-1 md:col-span-4">
            <span className="text-sm text-white font-medium mb-2">Prospecção Comercial</span>
            <div className="flex gap-6 flex-wrap">
              {vendasPorComercial.map((v, idx) => (
                <span key={v.nome} className="text-white text-base font-semibold flex items-center gap-2">
                  {v.nome}: <span className="text-lg font-bold text-yellow-200">{v.total}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Filtro de produtos */}
      {/* <div className="mb-4 w-full" style={{ minWidth: 300 }}>
        <Select
          isMulti
          options={opcoesProdutos}
          value={produtosSelecionados}
          onChange={(newValue) => setProdutosSelecionados(newValue as { value: string; label: string }[])}
          placeholder="Selecione produtos..."
          closeMenuOnSelect={false}
        />
      </div> */}
      {/* Botão Filtros */}
      <button
        className="border border-purple-400 text-purple-600 rounded-full px-4 py-1 flex items-center gap-2 mb-4"
        onClick={() => setShowFiltros(true)}
        style={{ alignSelf: 'flex-start' }}
      >
        <svg width="16" height="16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/></svg>
        Filtros
      </button>
      {/* Tabela + Paginação Centralizadas */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full  mx-auto">
          <table className="min-w-full rounded-xl overflow-hidden" style={{ background: '#23293a' }}>
            <thead style={{ background: '#23293a' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Status/Pagamento</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Data Criada</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Valor Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-[#2d3344]">Oferta</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPurchases.map((purchase, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-[#23293a] min-h-[64px]" : "bg-[#1b2030] hover:bg-[#23293a] min-h-[64px]"}>
                  {/* Status e Pagamento juntos */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2 justify-center align-middle h-full">
                    {purchase.status === 'Aprovado' && <span title="Aprovado"><CheckCircle size={18} className="text-green-400" /></span>}
                    {purchase.status === 'Aguardando Pagamento' && <span title="Aguardando Pagamento"><AlertTriangle size={18} className="text-orange-400" /></span>}
                    {purchase.status === 'Cancelado' && <span title="Cancelado"><XCircle size={18} className="text-red-500" /></span>}
                    {purchase.status === 'Abandonado' && (<span title="Abandonado"><XCircle size={18} className="text-red-500" /></span>)}
                    {purchase.pagamento === 'Cartão de Crédito' && <span title="Cartão de Crédito"><CreditCard size={18} className="text-blue-400" /></span>}
                    {purchase.pagamento === 'Pix' && <span title="Pix"><QrCode size={18} className="text-green-400" /></span>}
                    {purchase.pagamento === 'Boleto' && <span title="Boleto"><Barcode size={18} className="text-yellow-400" /></span>}
                  </td>
                  {/* Nome do contato */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{purchase.name || '-'}</td>
                  {/* Produto + quantidade */}
                  <td className="px-6 py-4 whitespace-normal break-all text-sm text-gray-200">
                    {purchase.nomeProduto} {purchase.quantidade ? <span className="text-xs text-green-400">x{purchase.quantidade}</span> : null}
                  </td>
                  {/* Data criada */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{purchase.data ? new Date(purchase.data).toLocaleDateString('pt-BR') : '-'}</td>
                  {/* Valor total */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">
                    {purchase.valorProdutos !== undefined && purchase.valorProdutos !== null
                      ? purchase.valorProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : '-'}
                  </td>
                  {/* Oferta */}
                  <td className="px-6 py-4 whitespace-normal break-all text-sm text-gray-200">{purchase.offerName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex flex-col items-center border-t border-gray-200 px-4 py-3 sm:px-6 mt-4 overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full justify-center">
                <div>
                  <p className="text-white text-gray-700">
                    Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, sortedPurchases.length)}
                    </span>{' '}
                    de <span className="font-medium">{sortedPurchases.length}</span> resultados
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center w-full">
                  <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {/* Paginação compacta */}
                    {(() => {
                      const pages = [];
                      const maxPagesToShow = 3;
                      const showLeftDots = currentPage > maxPagesToShow + 1;
                      const showRightDots = currentPage < totalPages - maxPagesToShow;
                      // Primeiras páginas
                      for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
                        pages.push(i);
                      }
                      // Páginas do meio
                      let start = Math.max(currentPage - 1, maxPagesToShow + 1);
                      let end = Math.min(currentPage + 1, totalPages - maxPagesToShow);
                      if (showLeftDots) pages.push('left-dots');
                      for (let i = start; i <= end; i++) {
                        if (i > maxPagesToShow && i < totalPages - maxPagesToShow + 1) pages.push(i);
                      }
                      if (showRightDots) pages.push('right-dots');
                      // Últimas páginas
                      for (let i = Math.max(totalPages - maxPagesToShow + 1, maxPagesToShow + 1); i <= totalPages; i++) {
                        if (i > maxPagesToShow) pages.push(i);
                      }
                      return pages.map((page, idx) => {
                        if (page === 'left-dots' || page === 'right-dots') {
                          return <span key={page + idx} className="px-2 text-white text-lg">...</span>;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(Number(page))}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              currentPage === page
                                ? 'bg-purple-600 text-white'
                                : 'text-white hover:bg-purple-600'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-white hover:bg-purple-600'
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                  <select
                    value={itemsPerPage}
                    onChange={e => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1 ml-2 bg-[#2d3344] text-white"
                  >
                    {[5, 10, 20, 50, 100].map(opt => (
                      <option key={opt} value={opt}>{opt} por página</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        {showFiltros && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-[#2d3344] text-black rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowFiltros(false)}
              >X</button>
              <h3 className="bg-[#2d3344] text-white font-semibold mb-4">Filtros Avançados</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Data Inicial */}
                <div>
                  <label className="block text-white font-medium">Data Inicial</label>
                  <input type="date" value={modalStartDate} onChange={e => setModalStartDate(e.target.value)} className="border rounded px-5 py-1 w-full" />
                </div>
                {/* Data Final */}
                <div>
                  <label className="block text-white font-medium">Data Final</label>
                  <input type="date" value={modalEndDate} onChange={e => setModalEndDate(e.target.value)} className="border rounded px-5 py-1 w-full" />
                </div>
                {/* Status */}
                <div>
                  <label className="text-white block text-sm font-medium">Status</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={modalStatusFiltro}
                    onChange={e => setModalStatusFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="approved">Aprovado</option>
                    <option value="waiting_payment">Aguardando Pagamento</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </div>
                {/* Formas de Pagamento */}
                <div>
                  <label className="text-white block text-sm font-medium">Forma de Pagamento</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={modalPagamentoFiltro}
                    onChange={e => setModalPagamentoFiltro(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="pix">Pix</option>
                    <option value="billet">Boleto</option>
                  </select>
                </div>
                {/* Produtos */}
                <div className="col-span-2 md:col-span-4">
                  <label className="text-white block text-sm font-medium mb-1">Produtos</label>
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={produtoBusca}
                    onChange={e => setProdutoBusca(e.target.value)}
                    className="border rounded px-2 py-1 w-full mb-2"
                  />
                  <div className="max-h-32 overflow-y-auto bg-[#23293a] rounded p-2">
                    {Array.from(new Set(purchases.map(p => p.nomeProduto)))
                      .filter(produto => produto.toLowerCase().includes(produtoBusca.toLowerCase()))
                      .map(produto => (
                        <label key={produto} className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={modalProdutoFiltro.includes(produto)}
                            onChange={e => {
                              if (e.target.checked) {
                                setModalProdutoFiltro([...modalProdutoFiltro, produto]);
                              } else {
                                setModalProdutoFiltro(modalProdutoFiltro.filter(p => p !== produto));
                              }
                            }}
                          />
                          {produto}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 px-4 py-2 rounded"
                  onClick={e => {
                    e.preventDefault();
                    setModalStartDate('');
                    setModalEndDate('');
                    setModalStatusFiltro('');
                    setModalPagamentoFiltro('');
                    setModalProdutoFiltro([]);
                    setProdutoBusca('');
                  }}
                >
                  Limpar Filtros
                </button>
                <button
                  type="button"
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                  onClick={aplicarFiltros}
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2 items-center mt-2">
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setModalStartDate('');
              setModalEndDate('');
              fetchFaturamento('', '', '', '', '');
            }}
            className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
          >
            Ver tudo
          </button>
        </div>
      </div>
      <ToastContainer />
      {loading && <ClipLoader color="#7C3AED" size={40} />}
    </div>
  );
};

function traduzirStatus(status: string) {
  switch (status) {
    case 'approved':
      return 'Aprovado';
    case 'waiting_payment':
      return 'Aguardando Pagamento';
    case 'abandoned':
      return 'Abandonado';
    case 'billet_printed':
      return 'Boleto Impresso';    
    case 'refunded':
      return 'Reembolsado';
    case 'expired':
      return 'Expirado';
      case 'pending':
        return 'Pendente';    
      case 'canceled':
        return 'Cancelado';    
      default:
      return status || '-';
  }
}

function traduzirMetodoPagamento(metodo: string) {
  switch (metodo) {
    case 'credit_card':
      return 'Cartão de Crédito';
    case 'pix':
      return 'Pix';
    case 'billet':
      return 'Boleto';
    case 'other':
      return 'Outros';
    default:
      return metodo || '-';
  }
}

function toUTCStringLocal(date: string, isEnd = false) {
  if (!date) return '';
  // Cria a data no fuso de Brasília
  const [year, month, day] = date.split('-').map(Number);
  let d;
  if (isEnd) {
    d = new Date(year, month - 1, day, 23, 59, 59, 999); // Inclui o dia inteiro
  } else {
    d = new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  return d.toISOString();
}

export default RevenueTable;