import React, { useCallback } from 'react';
import {
  Redirect,
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  const redirectRoute = useCallback(
    (props) => {
      if (isPrivate) {
        if (user) {
          return <Component {...props} />;
        }

        return (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        );
      }

      return <Component {...props} />;
    },
    [Component, isPrivate, user],
  );

  return (
    <ReactDOMRoute
      {...rest}
      render={(props) => {
        return redirectRoute(props);
      }}
    />
  );
};

export default Route;
