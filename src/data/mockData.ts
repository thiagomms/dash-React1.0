import { 
  Prospect, 
  Customer, 
  Call, 
  ServiceMetric, 
  Conversion, 
  NpsData, 
  Purchase 
} from '../types';

// Generate dates within a range
const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Current date for reference
const currentDate = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

// Mock prospects data
export const mockProspects: Prospect[] = Array.from({ length: 85 }, (_, i) => ({
  id: `pros-${i + 1}`,
  date: getRandomDate(sixMonthsAgo, currentDate),
  source: ['Website', 'Referral', 'Social Media', 'Direct', 'Partner'][Math.floor(Math.random() * 5)],
  status: ['new', 'contacted', 'qualified', 'converted', 'lost'][Math.floor(Math.random() * 5)] as Prospect['status'],
}));

// Mock purchases for use in customer data
const generatePurchases = (count: number): Purchase[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `purchase-${Math.random().toString(36).substring(2, 9)}`,
    date: getRandomDate(sixMonthsAgo, currentDate),
    product: ['Course A', 'Course B', 'Mentorship', 'Workshop', 'Premium Package'][Math.floor(Math.random() * 5)],
    offer: ['Summer Special', 'Black Friday', 'Standard', 'Bundle Deal', 'Flash Sale'][Math.floor(Math.random() * 5)],
    amountPaid: Math.floor(Math.random() * 5000) + 500,
    authenticValue: Math.floor(Math.random() * 6000) + 600,
  }));
};

// Mock customer data
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    since: '2022-03-15',
    averageTicket: 1850,
    purchases: generatePurchases(4),
  },
  {
    id: 'cust-2',
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    since: '2021-11-03',
    averageTicket: 2300,
    purchases: generatePurchases(6),
  },
  {
    id: 'cust-3',
    name: 'Carlos Santos',
    cpf: '456.789.123-00',
    since: '2023-01-22',
    averageTicket: 1200,
    purchases: generatePurchases(2),
  },
  {
    id: 'cust-4',
    name: 'Ana Beatriz',
    cpf: '654.321.987-00',
    since: '2022-07-08',
    averageTicket: 3500,
    purchases: generatePurchases(5),
  },
  {
    id: 'cust-5',
    name: 'Lucas Mendes',
    cpf: '789.123.456-00',
    since: '2023-05-30',
    averageTicket: 900,
    purchases: generatePurchases(1),
  },
];

// All purchases for revenue table
export const mockPurchases: Purchase[] = mockCustomers.flatMap(customer => customer.purchases);

// Mock calls data
export const mockCalls: Call[] = Array.from({ length: 120 }, (_, i) => ({
  id: `call-${i + 1}`,
  date: getRandomDate(sixMonthsAgo, currentDate),
  agent: ['Ana', 'Pedro', 'Julia', 'Carlos', 'Mariana'][Math.floor(Math.random() * 5)],
  duration: Math.floor(Math.random() * 20) + 1,
  outcome: ['successful', 'unsuccessful', 'callback', 'voicemail'][Math.floor(Math.random() * 4)] as Call['outcome'],
}));

// Mock service metrics
export const mockServiceMetrics: ServiceMetric = {
  conversationsWorked: {
    total: 324,
    bySeller: [
      { name: 'Ana', count: 87 },
      { name: 'Pedro', count: 65 },
      { name: 'Julia', count: 92 },
      { name: 'Carlos', count: 45 },
      { name: 'Mariana', count: 35 },
    ],
  },
  conversationsReceived: 412,
  messagesReceived: 1845,
  conversationsFinished: 305,
  averageResponseTime: 4.3, // minutes
};

// Mock conversion data
export const mockConversion: Conversion = {
  rate: 28.5,
  totalEnrollments: 64,
  totalProspects: 224,
};

// Mock NPS data for the last 6 months
export const mockNpsData: NpsData[] = [
  { month: 'Jan', score: 65, detractors: 15, neutrals: 20, promoters: 65 },
  { month: 'Feb', score: 68, detractors: 12, neutrals: 22, promoters: 66 },
  { month: 'Mar', score: 72, detractors: 10, neutrals: 18, promoters: 72 },
  { month: 'Apr', score: 75, detractors: 8, neutrals: 17, promoters: 75 },
  { month: 'May', score: 70, detractors: 14, neutrals: 16, promoters: 70 },
  { month: 'Jun', score: 78, detractors: 7, neutrals: 15, promoters: 78 },
];

// Helper function to get data for current month
export const getCurrentMonthData = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    prospects: mockProspects.filter(p => new Date(p.date) >= startOfMonth),
    calls: mockCalls.filter(c => new Date(c.date) >= startOfMonth),
    purchases: mockPurchases.filter(p => new Date(p.date) >= startOfMonth),
    npsData: mockNpsData[mockNpsData.length - 1],
  };
};

// Helper function to get data for last month
export const getLastMonthData = () => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  return {
    prospects: mockProspects.filter(p => {
      const date = new Date(p.date);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }),
    calls: mockCalls.filter(c => {
      const date = new Date(c.date);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }),
    purchases: mockPurchases.filter(p => {
      const date = new Date(p.date);
      return date >= startOfLastMonth && date <= endOfLastMonth;
    }),
    npsData: mockNpsData[mockNpsData.length - 2],
  };
};

// Helper function to get data for custom date range
export const getCustomRangeData = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return {
    prospects: mockProspects.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    }),
    calls: mockCalls.filter(c => {
      const date = new Date(c.date);
      return date >= start && date <= end;
    }),
    purchases: mockPurchases.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    }),
    // For NPS, we'll return the closest month's data
    npsData: mockNpsData.find(n => {
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(n.month);
      return monthIndex === start.getMonth() || monthIndex === end.getMonth();
    }) || mockNpsData[mockNpsData.length - 1],
  };
};