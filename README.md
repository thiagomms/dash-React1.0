![](https://github.com/thiagomms/dash-React1.0/blob/main/dash.gif)
# Dash2 – Dashboard Comercial

## Visão Geral

Este projeto é um dashboard comercial moderno, responsivo e visualmente atraente, desenvolvido em React + TypeScript, com integração ao Supabase para gestão de dados em tempo real. O sistema apresenta KPIs, gráficos, tabelas, filtros avançados e relatórios, focando em performance e experiência do usuário.

## Funcionalidades Principais
- **Dashboard de Vendas**: KPIs de faturamento, ticket médio, volume de vendas, produtos vendidos, etc.
- **Tabela de Faturamento**: Listagem detalhada de vendas, filtros avançados, exportação para Excel.
- **Gráficos**: Donut, barras, linhas e área para análise visual dos dados.
- **Relatórios Resumidos**: Cards de resumo e gráficos para visão rápida.
- **Customer Insights**: Página dedicada a análise de clientes, com busca e métricas.
- **Sidebar interativa**: Recolhível ao passar o mouse, com ícones e navegação.
- **Filtros Avançados**: Por data, status, pagamento e produto.
- **Integração Supabase**: CRUD em tempo real com a tabela `vendas_guru`.

## Estrutura do Projeto
```
/src
  |-- App.tsx                # Roteamento e layout principal
  |-- components/
      |-- Sidebar.tsx         # Menu lateral interativo
      |-- DashboardHeader.tsx # Cabeçalho do dashboard
      |-- BentoTailwindDashboard.tsx # Cards e KPIs
      |-- VolumeVendasChart.tsx      # Gráfico de barras
      |-- RelatorioResumo.tsx        # Relatório resumido
      |-- CustomerInsights.tsx       # Página de insights de clientes
      |-- dashboard/
          |-- RevenueTable.tsx       # Tabela de faturamento
          |-- AverageTicketCard.tsx  # Card de ticket médio
          |-- RevenueDonutCharts.tsx # Gráficos donut
          |-- KpiDashboard.tsx       # KPIs
          |-- ...
  |-- data/                 # Mock de dados
  |-- types/                # Tipos TypeScript
  |-- supabase/             # Funções edge e helpers
```

## Principais Bibliotecas Utilizadas
- **React**: Framework principal
- **TypeScript**: Tipagem estática
- **Supabase**: Backend as a Service (BaaS) para autenticação e banco de dados
- **TailwindCSS**: Utilitários de estilização rápida
- **lucide-react**: Ícones modernos SVG
- **react-icons**: Ícones adicionais (FontAwesome, etc)
- **recharts**: Gráficos de barras, linhas, donuts, área
- **chart.js + react-chartjs-2**: Gráficos avançados
- **react-select**: Selects customizados
- **xlsx**: Exportação de dados para Excel
- **date-fns**: Manipulação de datas

## Como rodar localmente
1. **Pré-requisitos:** Node.js 18+, npm
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com/)
   - Configure a tabela `vendas_guru` conforme o modelo do projeto
   - Adicione as chaves no arquivo `.env` ou diretamente no código (veja `App.tsx`)
4. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
5. **Acesse:**
   - Dashboard: `http://localhost:5173/`
   - Faturamentos: `/faturamentos`
   - Ticket Médio: `/ticket-medios`
   - Relatório Resumido: `/relatorio-resumo`
   - Customer Insights: `/customer-insights`

## Exemplos de Telas
- **Dashboard com KPIs e gráficos**
- **Tabela de faturamento com ícones de status**
- **Sidebar recolhível**
- **Relatório Resumido e Customer Insights**

## Observações
- O projeto é totalmente responsivo e pode ser customizado facilmente.
- Para produção, proteja as chaves do Supabase e configure variáveis de ambiente.
- Sinta-se à vontade para contribuir!

---

> Projeto desenvolvido com foco em boas práticas, performance e experiência do usuário. 
