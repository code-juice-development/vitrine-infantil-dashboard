import React, { HTMLProps, useState, useEffect, useCallback } from 'react';
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
  open: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditStore: React.FC<ModalEditStore> = ({
  store,
  open,
  onSubmit,
  onClose,
}) => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [commission, setCommission] = useState<number>();
  const [link, setLink] = useState<string>();
  const [api, setApi] = useState<string>();

  useEffect(() => {
    if (store) {
      setId(store.id);
      setName(store.name);
      setCommission(store.commission);
      setLink(store.link);
      setApi(store.api);
    }
  }, [store]);

  const onSubmitModal = useCallback(async () => {
    const data = {
      name,
      commission,
      link,
      api,
    };

    if (id) {
      await axios.put(`stores/${id}`, data);
    } else {
      await axios.post('stores', { id, ...data });
    }

    await onSubmit();
  }, [id, name, commission, link, api, onSubmit]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <StoreIcon />
          <Box component="span" ml={2}>
            Loja
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input
                id="name"
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
                value={commission}
                onChange={(event) => setCommission(Number(event.target.value))}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="link">Link</InputLabel>
              <Input
                id="link"
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
                value={api}
                onChange={(event) => setApi(event.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          autoFocus
          onClick={onSubmitModal}
        >
          Salvar
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditStore;
