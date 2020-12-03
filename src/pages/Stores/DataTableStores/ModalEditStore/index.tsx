import React, { HTMLProps, useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { PaletteProps, SpacingProps } from '@material-ui/system';
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Input,
} from '@material-ui/core';
import { Store as StoreIcon } from '@material-ui/icons';

import Store from '../../../../types/Store';

import axios from '../../../../services/api';

interface ModalEditStore extends HTMLProps<PaletteProps & SpacingProps> {
  store?: Store;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditStore: React.FC<ModalEditStore> = ({
  store,
  onSubmit,
  onClose,
}) => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [commission, setCommission] = useState<number>();
  const [link, setLink] = useState<string>();
  const [api, setApi] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (store) {
      setId(store.id);
      setName(store.name);
      setCommission(store.commission);
      setLink(store.link);
      setApi(store.api);
    }
  }, [store]);

  const onSubmitModal = useCallback(
    async (event) => {
      event.preventDefault();

      const data = {
        name,
        commission,
        link,
        api,
      };

      try {
        if (!id) {
          const response = await axios.post('stores', { ...data });

          if (response && response.status === 201) {
            enqueueSnackbar('O registro foi inserido com sucesso', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar('Houve um erro ao inserir o registro', {
              variant: 'warning',
            });
          }
        } else {
          const response = await axios.put(`stores/${id}`, data);

          if (response && response.status === 204) {
            enqueueSnackbar('O registro foi atualizado com sucesso', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar('Houve um erro ao atualizar o registro', {
              variant: 'warning',
            });
          }
        }

        await onSubmit();
      } catch (error) {
        enqueueSnackbar('Houve um erro ao fazer a requisição', {
          variant: 'error',
        });
      }

      await onSubmit();
    },
    [name, commission, link, api, onSubmit, id, enqueueSnackbar],
  );

  return (
    <Dialog onClose={onClose} open fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <StoreIcon />
          <Box component="span" ml={2}>
            Loja
          </Box>
        </Box>
      </DialogTitle>
      <form onSubmit={onSubmitModal}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="name">Nome</InputLabel>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="comission">Comissão (%)</InputLabel>
                <Input
                  id="comission"
                  type="number"
                  required
                  value={commission}
                  onChange={
                    (event) => setCommission(Number(event.target.value))
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="link">Link</InputLabel>
                <Input
                  id="link"
                  required
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="api">API</InputLabel>
                <Input
                  id="api"
                  required
                  value={api}
                  onChange={(event) => setApi(event.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary" autoFocus>
            Salvar
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalEditStore;
