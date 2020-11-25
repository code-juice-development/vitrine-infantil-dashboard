import React from 'react';

import Dashboard from '../../components/Dashboard';

import DataTableStores from './DataTableStores';

const Stores: React.FC = () => {
  return (
    <Dashboard>
      <DataTableStores />
    </Dashboard>
  );
};

export default Stores;
