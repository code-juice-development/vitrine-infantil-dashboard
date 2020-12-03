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
import { Category as CategoryIcon } from '@material-ui/icons';

import Category from '../../../../types/Category';

import axios from '../../../../services/api';

interface ModalEditCategoryProps
  extends HTMLProps<PaletteProps & SpacingProps> {
  category?: Category;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditCategory: React.FC<ModalEditCategoryProps> = ({
  category,
  onSubmit,
  onClose,
}) => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [keywords, setKeywords] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (category) {
      setId(category.id);
      setName(category.name);
      setDescription(category.description);
      setKeywords(category.keywords);
    }
  }, [category]);

  const onSubmitModal = useCallback(
    async (event) => {
      event.preventDefault();

      const data = {
        name,
        description,
        keywords,
      };

      try {
        if (!id) {
          const response = await axios.post('categories', { ...data });

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
          const response = await axios.put(`categories/${id}`, data);

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
    },
    [name, description, keywords, id, onSubmit, enqueueSnackbar],
  );

  return (
    <Dialog onClose={onClose} open fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <CategoryIcon />
          <Box component="span" ml={2}>
            Categoria
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
                <InputLabel htmlFor="keywords">Palavras-chave</InputLabel>
                <Input
                  id="keywords"
                  required
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
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

export default ModalEditCategory;
