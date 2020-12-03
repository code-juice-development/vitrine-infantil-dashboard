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

import Category from '../../../types/Category';

import axios from '../../../services/api';

import columns from './columns';

import ModalDelete from '../../../components/ModalDelete';
import ModalEditCategory from './ModalEditCategory';

const DataTableCategories: React.FC = () => {
  /** Status */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  /** Table Data */
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [count, setCount] = useState<number>(0);

  /** For Search */
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string | null>();

  const { enqueueSnackbar } = useSnackbar();

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get<Category[]>('categories', {
      params: { page: page + 1, name },
    });

    if (response.data) {
      const { 'x-total-count': total } = response.headers;

      setCount(Number(total));
      setCategories(response.data);
    }

    setSelectedCategory(undefined);
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
    if (selectedCategory) {
      try {
        const response = await axios.delete(
          `categories/${selectedCategory.id}`,
        );

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
  }, [refreshData, selectedCategory, enqueueSnackbar]);

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
          const category =
            categories[
              Number(Object.keys(tableState.selectedRows.lookup).pop())
            ];
          setSelectedCategory(category);
        }
      }
    },
    [categories],
  );

  const customToolbar = useCallback(() => {
    return (
      <>
        <Tooltip title="Adicionar Categoria">
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
        <Tooltip title="Editar Categoria">
          <IconButton color="inherit" onClick={() => setOpenModalEdit(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar Categoria">
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
        <ModalEditCategory
          onSubmit={onSubmitModalAdd}
          onClose={onCloseModalAdd}
        />
      )}

      {openModalEdit && (
        <ModalEditCategory
          category={selectedCategory}
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
            Categorias
            {isLoading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: 'relative', top: 4 }}
              />
            )}
          </Typography>
          // eslint-disable-next-line prettier/prettier
      )}
        data={categories}
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

export default DataTableCategories;
