import React from 'react';
import { Box, Toolbar } from '@material-ui/core';

import DrawerAside from './DrawerAside';
import ToolbarTop from './ToolbarTop';

const Dashboard: React.FC = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <ToolbarTop />
      <Box display="flex">
        <Box component="aside">
          <DrawerAside />
        </Box>
        <Box
          component="main"
          flexGrow={1}
          p={3}
          display="flex"
          flexDirection="column"
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
