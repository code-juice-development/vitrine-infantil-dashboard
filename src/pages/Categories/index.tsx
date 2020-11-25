import React from 'react';

import Dashboard from '../../components/Dashboard';

import DataTableCategories from './DataTableCategories';

const Categories: React.FC = () => {
  return (
    <Dashboard>
      <DataTableCategories />
    </Dashboard>
  );
};

export default Categories;
