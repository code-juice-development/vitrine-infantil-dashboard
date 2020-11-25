import React from 'react';
import { Drawer, Box, Toolbar } from '@material-ui/core';

import DrawerItems from '../DrawerItems';

import useStyles from './styles';

const DrawerAside: React.FC = () => {
  const { drawer, drawerPaper, drawerContainer } = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={drawer}
      classes={{ paper: drawerPaper }}
    >
      <Toolbar />
      <Box className={drawerContainer}>
        <DrawerItems />
      </Box>
    </Drawer>
  );
};

export default DrawerAside;
