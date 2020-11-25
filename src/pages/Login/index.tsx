import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useAuth } from '../../hooks/auth';

import logo from '../../assets/logo.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { signIn } = useAuth();

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        await signIn({ email, password });

        history.push('/main');
      } catch (error) {
        enqueueSnackbar(
          'Erro ao fazer login, verifique seu e-mail e/ou sua senha',
          { variant: 'warning' },
        );
      }
    },
    [signIn, email, password, history, enqueueSnackbar],
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        mt={10}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <img src={logo} alt="Logo" width="280px" />
        <Box mt={2} mb={2}>
          <Typography component="h1" variant="h5">
            Fazer Login
          </Typography>
        </Box>
        <form onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label="Endereço de E-mail"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Senha"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Entrar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
