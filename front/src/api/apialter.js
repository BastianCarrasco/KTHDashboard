import axios from 'axios';

const API_BASE = 'https://kth2025backend-production.up.railway.app';

export default {
  // ... (métodos existentes para preguntas y categorías)

  // Obtener todas las alternativas
  async getAlternativas() {
    const response = await axios.get(`${API_BASE}/alternativas`);
    return response.data;
  },

  // Obtener una alternativa por ID
  async getAlternativaById(id) {
    const response = await axios.get(`${API_BASE}/alternativas/${id}`);
    return response.data;
  },

  // Obtener alternativas por pregunta
  async getAlternativasByPregunta(id_pregunta) {
    const response = await axios.get(`${API_BASE}/alternativas/pregunta/${id_pregunta}`);
    return response.data;
  },

  // Crear una nueva alternativa
  async createAlternativa(texto, id_pregunta) {
    const response = await axios.post(`${API_BASE}/alternativas`, {
      texto,
      id_pregunta
    });
    return response.data;
  },

  // Actualizar una alternativa existente
  async updateAlternativa(id, texto, id_pregunta) {
    const response = await axios.put(`${API_BASE}/alternativas/${id}`, {
      texto,
      id_pregunta
    });
    return response.data;
  },

  // Eliminar una alternativa
  async deleteAlternativa(id) {
    const response = await axios.delete(`${API_BASE}/alternativas/${id}`);
    return response.data;
  }
};