import React, { useState } from 'react';
import { PeriodFilter } from '../types';


interface DashboardHeaderProps {
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return null;
};

export default DashboardHeader;