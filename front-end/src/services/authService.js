import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    // Espera-se que o backend retorne o token 
    if (response.data.token) {
      localStorage.setItem('finfreela_token', response.data.token);
    }
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('finfreela_token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem('finfreela_token');
  },

  async getCurrentUser() {
    // caso meu backend tenha uma rota para validar o token e retornar o usuário logado
    const response = await api.get('/auth/me');
    return response.data;
  }
};