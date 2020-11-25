import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

const useStyles = makeStyles(() => ({
  success: { backgroundColor: '#E6FFFA' },
  error: { backgroundColor: '#FDDEDE' },
  warning: { backgroundColor: '#FEF5D7' },
  info: { backgroundColor: '#EBF8FF' },
}));

/**
 * @todo PUTA QUE ME PARIU
 * @param param
 */
export const SnackBarCustomProvider: React.FC = ({ children, ...props }) => {
  const { success, error, warning, info } = useStyles();

  return (
    <SnackbarProvider
      classes={{
        variantSuccess: success,
        variantError: error,
        variantWarning: warning,
        variantInfo: info,
      }}
      {...props}
    >
      {children}
    </SnackbarProvider>
  );
};
