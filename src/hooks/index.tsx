import React from 'react';
import { SnackBarCustomProvider } from './snackbar';
import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => {
  return (
    <SnackBarCustomProvider>
      <AuthProvider>{children}</AuthProvider>
    </SnackBarCustomProvider>
  );
};

export default AppProvider;
