import React from 'react';

import Dashboard from '../../components/Dashboard';

import DataTablePromotions from './DataTablePromotions';

const Promotions: React.FC = () => {
  return (
    <Dashboard>
      <DataTablePromotions />
    </Dashboard>
  );
};

export default Promotions;
