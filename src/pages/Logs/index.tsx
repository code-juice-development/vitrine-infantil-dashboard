import React from 'react';

import Dashboard from '../../components/Dashboard';

import DataTableLogs from './DataTableLogs';

const Logs: React.FC = () => {
  return (
    <Dashboard>
      <DataTableLogs />
    </Dashboard>
  );
};

export default Logs;
