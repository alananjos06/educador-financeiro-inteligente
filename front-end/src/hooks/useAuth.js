import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('finfreela_token');
    if (token) {
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  async function register(name, email, password) {
    try {
      const data = await authService.register(name, email, password);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao criar conta.');
    }
  }

  async function login(email, password) {
    try {
      const data = await authService.login(email, password);
      setUser(data.user || { email });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'E-mail ou senha inválidos.');
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return { user, loading, register, login, logout };
}