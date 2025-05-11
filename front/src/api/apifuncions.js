// src/api.js
import axios from 'axios';

const API_BASE = 'https://kth2025backend-production.up.railway.app';

export default {
  // Obtener todas las preguntas
  async getHistoria() {
    const response = await axios.get(`${API_BASE}/historia`);
    return response.data;
  },}