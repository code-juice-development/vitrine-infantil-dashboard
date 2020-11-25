import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Login from '../pages/Login';
import Main from '../pages/Main';
import Stores from '../pages/Stores';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Promotions from '../pages/Promotions';
import Logs from '../pages/Logs';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />

      <Route path="/main" isPrivate component={Main} />
      <Route path="/stores" isPrivate component={Stores} />
      <Route path="/categories" isPrivate component={Categories} />
      <Route path="/products" isPrivate component={Products} />
      <Route path="/promotions" isPrivate component={Promotions} />
      <Route path="/logs" isPrivate component={Logs} />
    </Switch>
  );
};

export default Routes;
