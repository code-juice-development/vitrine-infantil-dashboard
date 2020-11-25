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
import { SupervisedUserCircle } from '@material-ui/icons';

import { useAuth } from '../../../../hooks/auth';

import axios from '../../../../services/api';

interface ModalEditCategoryProps
  extends HTMLProps<PaletteProps & SpacingProps> {
  open: boolean;
  onClose: () => void;
}

const ModalEditUser: React.FC<ModalEditCategoryProps> = ({ open, onClose }) => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (user) {
      setId(user.id);
      setName(user.name);
      setEmail(user.email);
      setImageUrl(user.image_url);
    }
  }, [user]);

  const onSubmitModal = useCallback(async () => {
    const data = {
      name,
      email,
      image_url: imageUrl,
    };

    await axios.put(`users/${id}`, data);

    refreshUser();

    onClose();
  }, [id, name, email, imageUrl, refreshUser, onClose]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <SupervisedUserCircle />
          <Box component="span" ml={2}>
            Usuário
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
              <InputLabel htmlFor="email">E-mail</InputLabel>
              <Input
                id="description"
                value={email}
                type="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="imageurl">URL da Imagem</InputLabel>
              <Input
                id="imageurl"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
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

export default ModalEditUser;
