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
import { ShoppingBasket } from '@material-ui/icons';

import Product from '../../../../types/Product';
import Category from '../../../../types/Category';
import Store from '../../../../types/Store';

import axios from '../../../../services/api';

interface ModalEditPromotionsProps
  extends HTMLProps<PaletteProps & SpacingProps> {
  product?: Product;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditPromotions: React.FC<ModalEditPromotionsProps> = ({
  product,
  onSubmit,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>();
  const [stores, setStores] = useState<Store[]>();

  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState<string>();
  const [link, setLink] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>();
  const [storeId, setStoreId] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const storesResponse = await axios.get<Store[]>('stores');

      if (storesResponse.data) {
        setStores(storesResponse.data);
      }

      const categoriesResponse = await axios.get<Category[]>('categories');

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (product) {
      setId(product.id);
      setName(product.name);
      setDescription(product.description);
      setImage(product.image);
      setLink(product.link);
      setPrice(product.price);
      setSize(product.size);
      setColor(product.color);
      setGender(product.gender);
      setCategoryId(product.category.id);
      setStoreId(product.store.id);
    }
  }, [product]);

  const onSubmitModal = useCallback(
    async (event) => {
      event.preventDefault();

      const data = {
        name,
        description,
        image,
        link,
        price,
        size,
        color,
        gender,
        category_id: categoryId,
        store_id: storeId,
      };

      try {
        if (!id) {
          const response = await axios.post('products', { ...data });

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
          const response = await axios.put(`products/${id}`, data);

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
    [
      name,
      description,
      image,
      link,
      price,
      size,
      color,
      gender,
      categoryId,
      storeId,
      onSubmit,
      id,
      enqueueSnackbar,
    ],
  );

  return (
    <Dialog onClose={onClose} open fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <ShoppingBasket />
          <Box component="span" ml={2}>
            Produto
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
                <InputLabel htmlFor="image">Link Image</InputLabel>
                <Input
                  id="image"
                  required
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
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
                <InputLabel htmlFor="price">Preço</InputLabel>
                <Input
                  id="price"
                  required
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="size">Tamanho</InputLabel>
                <Input
                  id="size"
                  required
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="color">Cor</InputLabel>
                <Input
                  id="color"
                  required
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="gender">Gênero</InputLabel>
                <Input
                  id="gender"
                  required
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="categoryId">Categoria</InputLabel>
                <Select
                  id="categoryId"
                  required
                  value={categoryId}
                  onChange={
                    (event) => setCategoryId(String(event.target.value))
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  {categories &&
                    categories.map((category: Category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
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
