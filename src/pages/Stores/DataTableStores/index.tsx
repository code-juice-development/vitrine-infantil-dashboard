import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import DataTable, { MUIDataTableState } from 'mui-datatables';

import Store from '../../../types/Store';

import axios from '../../../services/api';

import columns from './columns';

import ModalDelete from '../../../components/ModalDelete';
import ModalEditStore from './ModalEditStore';

const DataTableStores: React.FC = () => {
  /** Status */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  /** Table Data */
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [count, setCount] = useState<number>(0);

  /** For Search */
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string | null>();

  const { enqueueSnackbar } = useSnackbar();

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get<Store[]>('stores', {
      params: { page: page + 1, name },
    });

    if (response.data) {
      const { 'x-total-count': total } = response.headers;

      setCount(Number(total));
      setStores(response.data);
    }

    setSelectedStore(undefined);
    setIsLoading(false);
  }, [name, page]);

  useEffect(() => {
    (async () => {
      await refreshData();
    })();
  }, [refreshData]);

  /** Add Action */
  const onCloseModalAdd = useCallback(async () => {
    setOpenModalAdd(false);
  }, []);

  const onSubmitModalAdd = useCallback(async () => {
    await refreshData();
    setOpenModalAdd(false);
  }, [refreshData]);

  /** Edit Action */
  const onSubmitModalEdit = useCallback(async () => {
    await refreshData();
    setOpenModalEdit(false);
  }, [refreshData]);

  const onCloseModalEdit = useCallback(async () => {
    setOpenModalEdit(false);
  }, []);

  /** Delete Action */
  const onCloseModalDelete = useCallback(async () => {
    setOpenModalDelete(false);
  }, []);

  const onSubmitModalDelete = useCallback(async () => {
    if (selectedStore) {
      try {
        const response = await axios.delete(`stores/${selectedStore.id}`);

        if (response.status === 204) {
          enqueueSnackbar('O registro foi excluido com sucesso', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar('Houve um erro ao excluir o registro', {
            variant: 'warning',
          });
        }

        await refreshData();
      } catch (error) {
        enqueueSnackbar('Houve um erro ao fazer a requisição', {
          variant: 'error',
        });
      }
      setOpenModalDelete(false);
    }
  }, [enqueueSnackbar, refreshData, selectedStore]);

  const onTableChange = useCallback(
    (action: string, tableState: MUIDataTableState) => {
      if (action === 'changePage') {
        setPage(tableState.page);
      }
      if (action === 'search') {
        setName(tableState.searchText);
      }
      if (action === 'rowSelectionChange') {
        if (tableState.selectedRows.lookup) {
          const store =
            stores[Number(Object.keys(tableState.selectedRows.lookup).pop())];
          setSelectedStore(store);
        }
      }
    },
    [stores],
  );

  const customToolbar = useCallback(() => {
    return (
      <>
        <Tooltip title="Adicionar Loja">
          <IconButton color="inherit" onClick={() => setOpenModalAdd(true)}>
            <Add />
          </IconButton>
        </Tooltip>
      </>
    );
  }, []);

  const customToolbarSelect = useCallback(() => {
    return (
      <Box mr={1}>
        <Tooltip title="Editar Loja">
          <IconButton color="inherit" onClick={() => setOpenModalEdit(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar Loja">
          <IconButton color="inherit" onClick={() => setOpenModalDelete(true)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }, []);

  return (
    <>
      {openModalAdd && (
        <ModalEditStore onSubmit={onSubmitModalAdd} onClose={onCloseModalAdd} />
      )}

      {openModalEdit && (
        <ModalEditStore
          store={selectedStore}
          onSubmit={onSubmitModalEdit}
          onClose={onCloseModalEdit}
        />
      )}

      {openModalDelete && (
        <ModalDelete
          onSubmit={onSubmitModalDelete}
          onClose={onCloseModalDelete}
        />
      )}

      <DataTable
        // eslint-disable-next-line prettier/prettier
        title={(
          <Typography variant="h6">
            Lojas
            {isLoading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: 'relative', top: 4 }}
              />
            )}
          </Typography>
          // eslint-disable-next-line prettier/prettier
      )}
        data={stores}
        columns={columns}
        options={{
          download: false,
          elevation: 1,
          filter: false,
          print: false,
          rowsPerPageOptions: [],
          selectableRows: 'single',
          serverSide: true,
          onTableChange,
          customToolbar,
          customToolbarSelect,
          count,
          page,
        }}
      />
    </>
  );
};

export default DataTableStores;
