import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, googleAuthUser, getMe, updateUser } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('agtech_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('agtech_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getMe();
        setUser(data);
        setToken(storedToken);
      } catch {
        // Token is invalid/expired — clear it
        localStorage.removeItem('agtech_token');
        localStorage.removeItem('agtech_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const saveAuth = useCallback((userData) => {
    const { token: jwt, ...userInfo } = userData;
    localStorage.setItem('agtech_token', jwt);
    localStorage.setItem('agtech_user', JSON.stringify(userInfo));
    setToken(jwt);
    setUser(userInfo);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    saveAuth(data);
    return data;
  }, [saveAuth]);

  const register = useCallback(async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    saveAuth(data);
    return data;
  }, [saveAuth]);

  const googleLogin = useCallback(async (credential) => {
    const { data } = await googleAuthUser(credential);
    saveAuth(data);
    return data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('agtech_token');
    localStorage.removeItem('agtech_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUserProfile = useCallback(async (userData) => {
    const { data } = await updateUser(userData);
    saveAuth(data);
    return data;
  }, [saveAuth]);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
