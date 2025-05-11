// src/api.js
import axios from 'axios';

const API_BASE = 'https://kth2025backend-production.up.railway.app';

export default {
  // Obtener todas las preguntas
  async getPreguntas() {
    const response = await axios.get(`${API_BASE}/preguntas`);
    return response.data;
  },

  // Obtener una pregunta por ID
  async getPreguntaById(id) {
    const response = await axios.get(`${API_BASE}/preguntas/${id}`);
    return response.data;
  },

  // Crear una nueva pregunta
  async createPregunta(texto, categoria, nivel) {
    const response = await axios.post(`${API_BASE}/preguntas`, {
      texto,
      categoria,
      nivel
    });
    return response.data;
  },

  // Actualizar una pregunta existente
  async updatePregunta(id, texto, categoria, nivel) {
    const response = await axios.put(`${API_BASE}/preguntas/${id}`, {
      texto,
      categoria,
      nivel
    });
    return response.data;
  },

  // Eliminar una pregunta
  async deletePregunta(id) {
    const response = await axios.delete(`${API_BASE}/preguntas/${id}`);
    return response.data;
  },

  // Obtener todas las categorías (manteniendo este método que ya tenías)
  async getCategorias() {
    const response = await axios.get(`${API_BASE}/categorias`);
    return response.data;
  }
};