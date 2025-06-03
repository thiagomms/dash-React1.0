import express from 'express';
import axios from 'axios';
import cors from 'cors';
import clintApi from '@api/clint-api';

const app = express();
const PORT = 3001;

const TOKEN = '';

app.use(cors());

app.get('/api/contatos', async (req, res) => {
  try {
    const { cursor, doc, name } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/contacts';
    const params = [];
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (doc) params.push(`doc=${encodeURIComponent(doc)}`);
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contatos', details: error.message });
  }
});

app.get('/api/contatos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://digitalmanager.guru/api/v2/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/api/contatos/:id/transactions', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://digitalmanager.guru/api/v2/contacts/${id}/transactions`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/api/clint/contatos', async (req, res) => {
  try {
    const result = await clintApi.getContacts({
      limit: '200',
      offset: '0',
      page: '1',
      'api-token': ''
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contatos da Clint', details: err.message });
  }
});

app.get('/api/guru/vendas', async (req, res) => {
  try {
    const { cursor, status, start_date, end_date, ordered_at_ini, ordered_at_end, confirmed_at_ini, confirmed_at_end } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (start_date) params.push(`start_date=${encodeURIComponent(start_date)}`);
    if (end_date) params.push(`end_date=${encodeURIComponent(end_date)}`);
    if (ordered_at_ini) params.push(`ordered_at_ini=${encodeURIComponent(ordered_at_ini)}`);
    if (ordered_at_end) params.push(`ordered_at_end=${encodeURIComponent(ordered_at_end)}`);
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    params.push('per_page=100');
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendas', details: error.message });
  }
});

app.get('/api/guru/faturamento', async (req, res) => {
  try {
    const { ordered_at_ini, ordered_at_end, confirmed_at_ini, confirmed_at_end, cursor } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (ordered_at_ini) params.push(`ordered_at_ini=${encodeURIComponent(ordered_at_ini)}`);
    if (ordered_at_end) params.push(`ordered_at_end=${encodeURIComponent(ordered_at_end)}`);
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    params.push('per_page=100');
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const aprovadas = (response.data.data || []).filter(t => t.status === 'approved');

    const faturamento = aprovadas.flatMap(trans => 
      (trans.items || []).map(item => ({
        status: trans.status,
        pagamento: trans.payment?.method || '',
        valorVenda: trans.payment?.total || 0,
        valorProdutos: item.total_value || 0,
        nomeProduto: item.name,
        data: trans.dates?.confirmed_at 
          ? new Date(trans.dates.confirmed_at * 1000).toISOString() 
          : (trans.date || trans.created_at || new Date().toISOString())
      }))
    );

    res.json(faturamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturamento', details: error.message });
  }
});

app.get('/api/guru/taxas', async (req, res) => {
  try {
    const { confirmed_at_ini, confirmed_at_end, cursor } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    params.push('status=approved');
    params.push('per_page=100');
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    // Filtra transações cujo product.name contém 'TAXA'
    const taxas = (response.data.data || []).filter(
      t => t.product && t.product.name && t.product.name.toUpperCase().includes('TAXA')
    );

    // Retorna também o next_cursor e has_more_pages para o front poder buscar a próxima página
    res.json({
      data: taxas,
      next_cursor: response.data.next_cursor,
      has_more_pages: response.data.has_more_pages
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar taxas', details: error.message });
  }
});

app.get('/api/guru/taxas/:productId', async (req, res) => {
  try {
    const { confirmed_at_ini, confirmed_at_end, cursor } = req.query;
    const { productId } = req.params;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    params.push('status=approved');
    params.push('per_page=100');
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    // Filtra transações aprovadas do produto específico
    const taxas = (response.data.data || []).filter(
      t => (t.items || []).some(item => item.id === productId)
    );

    res.json(taxas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar taxas por produto', details: error.message });
  }
});

app.get('/api/guru/produtos', async (req, res) => {
  try {
    const response = await axios.get('https://digitalmanager.guru/api/v2/products', {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    // Filtrar produtos por marketplace_name
    const produtos = (response.data.data || []).filter(
      p => p.marketplace_name === 'maxipago' || p.marketplace_name === 'pagarme'
    );
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

app.get('/api/guru/vendas/taxa', async (req, res) => {
  try {
    const { confirmed_at_ini, confirmed_at_end, cursor } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    params.push('status=approved');
    params.push('per_page=100');
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    // Filtra transações aprovadas cujo nome do produto contém 'TAXA'
    const taxas = (response.data.data || []).filter(
      t => t.product && t.product.name && t.product.name.toUpperCase().includes('TAXA')
    );

    res.json(taxas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar taxas', details: error.message });
  }
});

app.get('/api/guru/vendas/por-marketplace', async (req, res) => {
  try {
    const { confirmed_at_ini, confirmed_at_end, marketplace_ids, cursor } = req.query;
    let url = 'https://digitalmanager.guru/api/v2/transactions';
    const params = [];
    if (confirmed_at_ini) params.push(`confirmed_at_ini=${encodeURIComponent(confirmed_at_ini)}`);
    if (confirmed_at_end) params.push(`confirmed_at_end=${encodeURIComponent(confirmed_at_end)}`);
    params.push('status=approved');
    params.push('per_page=100');
    if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
    if (params.length) url += '?' + params.join('&');

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const defaultIds = [
      '1721746502','1726068602','1743451600','1732641226','1731595262','1731595493','1721746968','1729019851','1732640886','1731595613','1721746891','1726068787','1732640961','1739535900','1714670037','1711547085'
    ];
    const ids = (marketplace_ids ? marketplace_ids.split(',').map(id => id.trim()) : defaultIds);

    // Novo filtro: busca em t.product.marketplace_id
    const filtradas = (response.data.data || []).filter(
      t => t.product && ids.includes(String(t.product.marketplace_id))
    );

    res.json(filtradas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendas por marketplace_id', details: error.message });
  }
});

app.get('/api/guru/admin/transactions', async (req, res) => {
  try {
    const { confirmed_at_ini, confirmed_at_end } = req.query;
    // products pode vir como string separada por vírgula, array ou ambos
    let products = [];
    if (Array.isArray(req.query.products)) {
      // Se vier como products[]=1&products[]=2
      products = req.query.products;
    } else if (typeof req.query.products === 'string') {
      // Se vier como products=1,2,3
      products = req.query.products.split(',').map(id => id.trim());
    }
    const url = 'https://digitalmanager.guru/api/admin/transactions';
    const params = {
      affiliation_option: 'all',
      is_group: false,
      tracking_option: 'all',
      date_field: 'confirmed_at',
      confirmed_at_ini,
      confirmed_at_end,
      // products[] é aceito pela API do Guru
      ...(products.length > 0 ? { products } : {})
    };
    const response = await axios.get(url, { params, headers: { Authorization: `Bearer ${TOKEN}` } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy rodando em http://localhost:${PORT}`);
}); 