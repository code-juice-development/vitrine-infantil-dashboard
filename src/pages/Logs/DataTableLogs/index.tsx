import React, { useState, useEffect, useCallback } from 'react';
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
    const response = await axios.delete('logs');

    if (response.status === 204) {
      // addToast({
      //   title: 'Registros Excluídos',
      //   description: 'Os registros foram excluídos com sucesso',
      //   type: 'sucess',
      // });
      await refreshData();
    } else {
      // addToast({
      //   title: 'Registros não Excluídos',
      //   description: 'Houve um erro ao excluir seus registros',
      //   type: 'error',
      // });
    }
  }, [refreshData]);

  const onClickUpdateProducts = useCallback(async () => {
    const response = await axios.get('products-update');

    if (response.status === 201) {
      // addToast({
      //   title: 'Iniciada Atualização',
      //   description: 'Iniciada atualização dos produtos',
      //   type: 'information',
      // });
    }
  }, []);

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
