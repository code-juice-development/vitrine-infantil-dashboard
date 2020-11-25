import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { People, ExitToApp, ExpandMore } from '@material-ui/icons';

import { useAuth } from '../../../hooks/auth';

import useStyles from './styles';

import ModalEditUser from './ModalEditUser';

import logo from '../../../assets/logo.svg';

const ToolbarTop: React.FC = () => {
  const [
    anchorElementMenu,
    setAnchorElementMenu,
  ] = useState<null | HTMLElement>(null);
  const [openModalUser, setOpenModalUser] = useState<boolean>(false);

  const history = useHistory();
  const { user, signOut } = useAuth();
  const { appBar } = useStyles();

  const onCloseMenu = useCallback(() => {
    setAnchorElementMenu(null);
  }, []);

  const onClickProfile = useCallback(() => {
    setOpenModalUser(true);
    onCloseMenu();
  }, [onCloseMenu]);

  const onClickExit = useCallback(() => {
    signOut();
    onCloseMenu();
    history.push('/');
  }, [signOut, onCloseMenu, history]);

  return (
    <AppBar position="fixed" color="primary" className={appBar}>
      <Toolbar>
        <Link to="/" style={{ flexGrow: 1 }}>
          <Box display="flex" ml={5}>
            <img src={logo} alt="Logo" width="90px" />
          </Box>
        </Link>
        <Box>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={(event) => setAnchorElementMenu(event.currentTarget)}
          >
            <Avatar alt="Profile Picture" src={user?.image_url} />
            <Box ml={2} mr={1}>
              <Typography>{user?.name}</Typography>
            </Box>
            <ExpandMore />
          </IconButton>
          <Menu
            id="menu-appbar"
            keepMounted
            anchorEl={anchorElementMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={anchorElementMenu !== null}
            onClose={onCloseMenu}
          >
            <MenuItem onClick={onClickProfile}>
              <ListItemIcon>
                <People fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </MenuItem>
            <MenuItem onClick={onClickExit}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </MenuItem>
          </Menu>
          <ModalEditUser
            open={openModalUser}
            onClose={() => setOpenModalUser(false)}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarTop;
