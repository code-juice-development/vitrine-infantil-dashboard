import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import DataTable, { MUIDataTableState } from 'mui-datatables';

import Promotion from '../../../types/Promotion';

import axios from '../../../services/api';

import columns from './columns';

import ModalDelete from '../../../components/ModalDelete';
import ModalEditPromotions from './ModalEditPromotions';

const DataTablePromotions: React.FC = () => {
  /** Status */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  /** Table Data */
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [count, setCount] = useState<number>(0);

  /** For Search */
  const [page, setPage] = useState<number>(0);
  const [name, setName] = useState<string | null>();

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get<Promotion[]>('promotions', {
      params: { page: page + 1, name },
    });

    if (response.data) {
      const { 'x-total-count': total } = response.headers;

      setCount(total);
      setPromotions(response.data);
    }

    setSelectedPromotion(undefined);
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
    if (selectedPromotion) {
      await axios.delete(`promotions/${selectedPromotion.id}`);
      await refreshData();
      setOpenModalDelete(false);
    }
  }, [refreshData, selectedPromotion]);

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
          const promotion =
            promotions[
              Number(Object.keys(tableState.selectedRows.lookup).pop())
            ];
          setSelectedPromotion(promotion);
        }
      }
    },
    [promotions],
  );

  const customToolbar = useCallback(() => {
    return (
      <>
        <Tooltip title="Adicionar Promoção">
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
        <Tooltip title="Editar Pomoção">
          <IconButton color="inherit" onClick={() => setOpenModalEdit(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar Promoção">
          <IconButton color="inherit" onClick={() => setOpenModalDelete(true)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }, []);

  return (
    <>
      <ModalEditPromotions
        open={openModalAdd}
        onSubmit={onSubmitModalAdd}
        onClose={onCloseModalAdd}
      />
      <ModalEditPromotions
        promotion={selectedPromotion}
        open={openModalEdit}
        onSubmit={onSubmitModalEdit}
        onClose={onCloseModalEdit}
      />
      <ModalDelete
        open={openModalDelete}
        onSubmit={onSubmitModalDelete}
        onClose={onCloseModalDelete}
      />
      <DataTable
        // eslint-disable-next-line prettier/prettier
        title={(
          <Typography variant="h6">
            Promoções
            {isLoading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: 'relative', top: 4 }}
              />
            )}
          </Typography>
          // eslint-disable-next-line prettier/prettier
      )}
        data={promotions}
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

export default DataTablePromotions;
