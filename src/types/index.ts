export interface Prospect {
  id: string;
  date: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  since: string;
  averageTicket: number;
  purchases: Purchase[];
}

export interface Purchase {
  id: string;
  date: string;
  product: string;
  offer: string;
  amountPaid: number;
  authenticValue: number;
}

export interface Call {
  id: string;
  date: string;
  agent: string;
  duration: number;
  outcome: 'successful' | 'unsuccessful' | 'callback' | 'voicemail';
}

export interface ServiceMetric {
  conversationsWorked: {
    total: number;
    bySeller: {
      name: string;
      count: number;
    }[];
  };
  conversationsReceived: number;
  messagesReceived: number;
  conversationsFinished: number;
  averageResponseTime: number; // in minutes
}

export interface Conversion {
  rate: number;
  totalEnrollments: number;
  totalProspects: number;
}

export interface NpsData {
  month: string;
  score: number;
  detractors: number;
  neutrals: number;
  promoters: number;
}

export interface PeriodFilter {
  type: 'currentMonth' | 'lastMonth' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface DashboardState {
  period: PeriodFilter;
  prospects: Prospect[];
  serviceMetrics: ServiceMetric;
  conversion: Conversion;
  npsData: NpsData[];
  revenue: Purchase[];
}