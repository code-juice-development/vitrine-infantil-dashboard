import React, { createContext, useState, useCallback, useContext } from 'react';

import User from '../types/User';

import axios from '../services/api';

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  token: string;
  signIn(credentials: Credentials): Promise<void>;
  signOut(): void;
  refreshUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>(() => {
    const storedToken = String(localStorage.getItem('@VIDashboard:token'));

    if (storedToken) {
      axios.defaults.headers.authorization = `Bearer ${storedToken}`;
    }

    return storedToken;
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = JSON.parse(
      String(localStorage.getItem('@VIDashboard:user')),
    );

    return storedUser;
  });

  const signIn = useCallback(async ({ email, password }: Credentials): Promise<
    void
  > => {
    const response = await axios.post('sessions', {
      email,
      password,
    });

    localStorage.setItem('@VIDashboard:token', response.data.token);
    localStorage.setItem(
      '@VIDashboard:user',
      JSON.stringify(response.data.user),
    );

    setUser(response.data.user);
    setToken(response.data.token);
  }, []);

  const signOut = useCallback((): void => {
    localStorage.removeItem('@VIDashboard:token');
    localStorage.removeItem('@VIDashboard:user');

    setUser(null);
    setToken('');
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    const response = await axios.get<User>(`users/${user?.id}`);

    if (response.data) {
      localStorage.setItem('@VIDashboard:user', JSON.stringify(response.data));

      setUser(response.data);
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};
