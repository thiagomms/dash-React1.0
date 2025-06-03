import React, { useState } from 'react';
import { Search, User, Clock, CreditCard } from 'lucide-react';

interface Purchase {
  id: string;
  product: string;
  offer: string;
  amountPaid: number;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  cpf: string;
  averageTicket: number;
  since: string;
  purchases: Purchase[];
  ultimaCompra: string;
}

interface AverageTicketCardProps {
  className?: string;
}

const AverageTicketCard: React.FC<AverageTicketCardProps> = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setErrorMessage('Digite um CPF ou nome para buscar');
      setShowResults(false);
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setShowResults(false);
    setSearchResults(null);
    try {
      const param = /\d{11}/.test(searchTerm.replace(/\D/g, '')) ? `doc=${encodeURIComponent(searchTerm)}` : `name=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(`http://localhost:3001/api/contatos?${param}`);
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const cliente = data.data[0];
        // Buscar histórico de compras do cliente
        const transRes = await fetch(`http://localhost:3001/api/contatos/${cliente.id}/transactions`);
        const transData = await transRes.json();
        // Filtrar apenas transações aprovadas
        const aprovadas = (transData.data || []).filter((t: any) => (t.status || '').toLowerCase() === 'approved');
        // Calcular ticket médio
        const ticketMedio = aprovadas.length > 0 ? aprovadas.reduce((acc: number, t: any) => acc + (t.payment?.total || 0), 0) / aprovadas.length : 0;
        // Extrair datas das compras aprovadas
        const datasCompras = aprovadas.map((t: any) => {
          if (t.dates?.confirmed_at) return new Date(t.dates.confirmed_at * 1000);
          if (t.date) return new Date(t.date);
          if (t.created_at) return new Date(t.created_at);
          return new Date();
        });
        let since = cliente.created_at || new Date().toISOString();
        if (datasCompras.length > 0) {
          // Pega a menor data (primeira compra)
          const primeiraCompra = new Date(Math.min(...datasCompras.map((d: Date) => d.getTime())));
          // Pega a maior data (última compra)
          const ultimaCompra = new Date(Math.max(...datasCompras.map((d: Date) => d.getTime())));
          since = primeiraCompra.toISOString();
          setSearchResults({
            id: cliente.id,
            name: cliente.name,
            cpf: cliente.doc,
            averageTicket: ticketMedio,
            since: since,
            purchases: aprovadas.map((t: any) => ({
              id: t.id,
              product: t.product?.name || (t.items && t.items[0]?.name) || 'Produto',
              offer: t.product?.offer?.name || (t.items && t.items[0]?.offer?.name) || '',
              amountPaid: t.payment?.total || 0,
              date: t.dates?.confirmed_at ? new Date(t.dates.confirmed_at * 1000).toISOString() : (t.date || t.created_at || new Date().toISOString()),
            })),
            ultimaCompra: ultimaCompra.toISOString(),
          });
        } else {
          setSearchResults({
            id: cliente.id,
            name: cliente.name,
            cpf: cliente.doc,
            averageTicket: ticketMedio,
            since: since,
            purchases: [],
            ultimaCompra: new Date().toISOString(),
          });
        }
        setShowResults(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Cliente não encontrado');
        setShowResults(false);
      }
    } catch (err) {
      setErrorMessage('Erro ao buscar cliente');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

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

  const calculateTimeAsCustomer = (sinceDate: string, endDate?: string) => {
    const startDate = new Date(sinceDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays} dias`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} meses`;
    }
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center py-4"
    >
      <div className="flex flex-col justify-start items-center w-full px-2">
        <h1 className="text-4xl font-bold mb-2 text-center w-full">Ticket Médio de Compras</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-xl w-full">Busque clientes por nome ou CPF para ver o ticket médio e tempo de relacionamento.</p>
        <div className="w-full max-w-3xl mb-12">
          <div className="bg-zinc-800 rounded-xl flex items-center px-6 py-4 shadow-md">
            <Search className="text-zinc-400 mr-3" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF"
              className="bg-transparent text-zinc-200 flex-1 outline-none placeholder:text-zinc-400 text-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={handleSearch}
              disabled={loading}
            >
              Buscar
            </button>
          </div>
          {loading && <p className="text-purple-400 text-sm mt-4">Buscando...</p>}
          {errorMessage && <p className="text-red-400 text-sm mt-4">{errorMessage}</p>}
        </div>
        {showResults && searchResults && (
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">Detalhes do Cliente</h2>
            <div className="flex flex-col gap-4 text-zinc-300 text-lg mb-8">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>Nome</span>
                <span className="text-white font-semibold">{searchResults.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>CPF</span>
                <span className="text-white font-semibold">{searchResults.cpf}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>Ticket Médio</span>
                <span className="text-white font-semibold">{formatCurrency(searchResults.averageTicket)}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>Tempo como Cliente</span>
                <span className="text-white font-semibold">{calculateTimeAsCustomer(searchResults.since, searchResults.ultimaCompra)}</span>
              </div>
              <div className="flex justify-between">
                <span>Compras Realizadas</span>
                <span className="text-white font-semibold">{searchResults.purchases.length}</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Histórico de Compras</h3>
            <div className="bg-zinc-800 rounded-xl p-4">
              {searchResults.purchases.length === 0 && (
                <p className="text-zinc-400">Nenhuma compra encontrada.</p>
              )}
              {searchResults.purchases.map((purchase, index) => (
                <div
                  key={purchase.id}
                  className={`flex justify-between items-center p-3 rounded-md mb-2 ${index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'}`}
                >
                  <div>
                    <p className="font-medium text-gray-100">{purchase.product}</p>
                    <p className="text-sm text-gray-400">{purchase.offer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-400">{formatCurrency(purchase.amountPaid)}</p>
                    <p className="text-xs text-gray-400">{formatDate(purchase.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!showResults && !loading && (
          <div className="mt-8 mb-8 text-center text-gray-400">
            <Search size={24} className="mx-auto mb-2 text-gray-500" />
            <p>Digite um CPF ou nome do cliente para ver suas informações</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AverageTicketCard;