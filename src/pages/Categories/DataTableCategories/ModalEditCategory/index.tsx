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
import { Category as CategoryIcon } from '@material-ui/icons';

import Category from '../../../../types/Category';

import axios from '../../../../services/api';

interface ModalEditCategoryProps
  extends HTMLProps<PaletteProps & SpacingProps> {
  category?: Category;
  open: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditCategory: React.FC<ModalEditCategoryProps> = ({
  category,
  open,
  onSubmit,
  onClose,
}) => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [keywords, setKeywords] = useState<string>();

  useEffect(() => {
    if (category) {
      setId(category.id);
      setName(category.name);
      setDescription(category.description);
      setKeywords(category.keywords);
    }
  }, [category]);

  const onSubmitModal = useCallback(async () => {
    const data = {
      name,
      description,
      keywords,
    };

    if (id) {
      await axios.put(`categories/${id}`, data);
    } else {
      await axios.post('categories', { id, ...data });
    }

    await onSubmit();
  }, [id, name, description, keywords, onSubmit]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <CategoryIcon />
          <Box component="span" ml={2}>
            Categoria
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
              <InputLabel htmlFor="description">Descrição</InputLabel>
              <Input
                id="description"
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
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
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

export default ModalEditCategory;
