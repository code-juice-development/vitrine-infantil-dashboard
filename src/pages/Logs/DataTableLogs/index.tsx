import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { LayersClear, SystemUpdateAltOutlined } from '@material-ui/icons';
import DataTable, { MUIDataTableState } from 'mui-datatables';

import Log from '../../../types/Log';

import axios from '../../../services/api';

import columns from './columns';

const DataTableLogs: React.FC = () => {
  /** Status */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** Table Data */
  const [logs, setLogs] = useState<Log[]>([]);
  const [count, setCount] = useState<number>(0);

  /** For Search */
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string | null>();

  const { enqueueSnackbar } = useSnackbar();

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get<Log[]>('logs', {
      params: { page: page + 1, name },
    });

    if (response.data) {
      const { 'x-total-count': total } = response.headers;

      setCount(total);
      setLogs(response.data);
    }

    setIsLoading(false);
  }, [name, page]);

  useEffect(() => {
    (async () => {
      await refreshData();
    })();
  }, [refreshData]);

  const onClickClearLogs = useCallback(async () => {
    try {
      const response = await axios.delete('logs');

      if (response.status === 204) {
        enqueueSnackbar('Os registros foram excluídos com sucesso', {
          variant: 'success',
        });
        await refreshData();
      } else {
        enqueueSnackbar('Houve um erro ao excluir seus registros', {
          variant: 'warning',
        });
      }
    } catch (error) {
      enqueueSnackbar('Houve um erro ao fazer a requisição', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, refreshData]);

  const onClickUpdateProducts = useCallback(async () => {
    try {
      const response = await axios.get('products-update');

      if (response.status === 201) {
        enqueueSnackbar('Iniciada atualização dos produtos', {
          variant: 'success',
        });
        await refreshData();
      } else {
        enqueueSnackbar('Houve um erro ao iniciar a atualização', {
          variant: 'warning',
        });
      }
    } catch (error) {
      enqueueSnackbar('Houve um erro ao fazer a requisição', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, refreshData]);

  const onTableChange = useCallback(
    (action: string, tableState: MUIDataTableState) => {
      if (action === 'changePage') {
        setPage(tableState.page);
      }
      if (action === 'search') {
        setName(tableState.searchText);
      }
    },
    [],
  );

  const customToolbar = useCallback(() => {
    return (
      <>
        <Tooltip title="Limpar Logs">
          <IconButton color="inherit" onClick={onClickClearLogs}>
            <LayersClear />
          </IconButton>
        </Tooltip>
        <Tooltip title="Atualizar Produtos">
          <IconButton color="inherit" onClick={onClickUpdateProducts}>
            <SystemUpdateAltOutlined />
          </IconButton>
        </Tooltip>
      </>
    );
  }, [onClickClearLogs, onClickUpdateProducts]);

  return (
    <DataTable
      // eslint-disable-next-line prettier/prettier
      title={(
        <Typography variant="h6">
          Atualizações
          {isLoading && (
            <CircularProgress
              size={24}
              style={{ marginLeft: 15, position: 'relative', top: 4 }}
            />
          )}
        </Typography>
        // eslint-disable-next-line prettier/prettier
      )}
      data={logs}
      columns={columns}
      options={{
        download: false,
        elevation: 1,
        filter: false,
        print: false,
        rowsPerPageOptions: [10],
        serverSide: true,
        onTableChange,
        customToolbar,
        count,
        page,
      }}
    />
  );
};

export default DataTableLogs;
