import React, { useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Dashboard,
  Store,
  Category,
  ShoppingBasket,
  AttachMoney,
  Update,
} from '@material-ui/icons';

const DrawerItems: React.FC = () => {
  const location = useLocation();

  const isSelected = useCallback(
    (path: string): boolean => {
      return location.pathname === path;
    },
    [location],
  );

  return (
    <>
      <ListItem
        button
        component={Link}
        to="/main"
        selected={isSelected('/main')}
      >
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/stores"
        selected={isSelected('/stores')}
      >
        <ListItemIcon>
          <Store />
        </ListItemIcon>
        <ListItemText primary="Lojas" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/categories"
        selected={isSelected('/categories')}
      >
        <ListItemIcon>
          <Category />
        </ListItemIcon>
        <ListItemText primary="Categorias" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/products"
        selected={isSelected('/products')}
      >
        <ListItemIcon>
          <ShoppingBasket />
        </ListItemIcon>
        <ListItemText primary="Produtos" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/promotions"
        selected={isSelected('/promotions')}
      >
        <ListItemIcon>
          <AttachMoney />
        </ListItemIcon>
        <ListItemText primary="Promoções" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/logs"
        selected={isSelected('/logs')}
      >
        <ListItemIcon>
          <Update />
        </ListItemIcon>
        <ListItemText primary="Atualizações" />
      </ListItem>
    </>
  );
};

export default DrawerItems;
