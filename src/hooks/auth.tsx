import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import User from '../types/User';

import api from '../services/api';

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
  const [token, setToken] = useState<string>(
    String(localStorage.getItem('@VIDashboard:token')),
  );
  const [user, setUser] = useState<User | null>(
    JSON.parse(String(localStorage.getItem('@VIDashboard:user'))),
  );

  useEffect(() => {
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
    }
  }, [token, user]);

  const signIn = useCallback(async ({ email, password }: Credentials): Promise<
    void
  > => {
    const response = await api.post('sessions', {
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
    const response = await api.get<User>(`users/${user?.id}`);

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
