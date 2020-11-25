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
  open: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalEditPromotions: React.FC<ModalEditPromotionsProps> = ({
  product,
  open,
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

  const onSubmitModal = useCallback(async () => {
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

    if (id) {
      await axios.put(`products/${id}`, data);
    } else {
      await axios.post('products', { id, ...data });
    }

    await onSubmit();
  }, [
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
    id,
    onSubmit,
  ]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <ShoppingBasket />
          <Box component="span" ml={2}>
            Produto
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
              <InputLabel htmlFor="image">Link Image</InputLabel>
              <Input
                id="image"
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
                value={categoryId}
                onChange={(event) => setCategoryId(String(event.target.value))}
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

export default ModalEditPromotions;
