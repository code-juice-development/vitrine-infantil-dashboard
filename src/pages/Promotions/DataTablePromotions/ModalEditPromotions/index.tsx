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
  Select,
  MenuItem,
} from '@material-ui/core';
import { AttachMoney } from '@material-ui/icons';

import Promotion from '../../../../types/Promotion';
import Store from '../../../../types/Store';

import axios from '../../../../services/api';

interface ModalEditPromotionsProps
  extends HTMLProps<PaletteProps & SpacingProps> {
  promotion?: Promotion;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditPromotions: React.FC<ModalEditPromotionsProps> = ({
  promotion,
  onSubmit,
  onClose,
}) => {
  const [stores, setStores] = useState<Store[]>();

  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [coupon, setCoupon] = useState<string>();
  const [link, setLink] = useState<string>();
  const [storeId, setStoreId] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const response = await axios.get<Store[]>('stores');

      if (response.data) {
        setStores(response.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (promotion) {
      setId(promotion.id);
      setName(promotion.name);
      setDescription(promotion.description);
      setCoupon(promotion.coupon);
      setLink(promotion.link);
      setStoreId(promotion.store.id);
    }
  }, [promotion]);

  const onSubmitModal = useCallback(
    async (event) => {
      event.preventDefault();

      const data = {
        name,
        description,
        coupon,
        link,
        store_id: storeId,
      };

      try {
        if (!id) {
          const response = await axios.post('promotions', { ...data });

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
          const response = await axios.put(`promotions/${id}`, data);

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
    [id, name, description, coupon, link, storeId, onSubmit, enqueueSnackbar],
  );

  return (
    <Dialog onClose={onClose} open fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <AttachMoney />
          <Box component="span" ml={2}>
            Promoção
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
                <InputLabel htmlFor="description">Descrição</InputLabel>
                <Input
                  id="description"
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="coupon">Cupom</InputLabel>
                <Input
                  id="coupon"
                  required
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
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
                <InputLabel htmlFor="storeId">Loja</InputLabel>
                <Select
                  id="storeId"
                  required
                  value={storeId}
                  onChange={(event) => setStoreId(String(event.target.value))}
                >
                  {stores &&
                    stores.map((store: Store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                </Select>
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

export default ModalEditPromotions;
