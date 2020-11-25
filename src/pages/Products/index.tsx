import React from 'react';

import Dashboard from '../../components/Dashboard';

import DataTableProduct from './DataTableProducts';

const Products: React.FC = () => {
  return (
    <Dashboard>
      <DataTableProduct />
    </Dashboard>
  );
};

export default Products;
