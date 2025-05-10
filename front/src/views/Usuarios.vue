<template>
  <div>
    <h1>Editar Formulario</h1>
    
    <!-- Mostrar mensaje de carga -->
    <div v-if="loading">Cargando datos...</div>
    
    <!-- Mostrar error si lo hay -->
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <!-- Mostrar los datos cuando estén disponibles -->
    <div v-if="data">
      <pre>{{ data }}</pre> <!-- Esto muestra los datos en formato JSON -->
      
      <!-- O si prefieres mostrar los datos de forma más estructurada: -->
      <div v-for="(item, index) in data" :key="index">
        <!-- Ajusta esto según la estructura de tus datos -->
        <p>ID: {{ item.id }}</p>
        <p>Nombre: {{ item.nombre }}</p>
        <!-- Agrega más campos según necesites -->
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarFormulario',
  data() {
    return {
      data: null,
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('https://kth2025backend-production.up.railway.app/data');
        this.data = response.data;
      } catch (err) {
        this.error = 'Error al cargar los datos: ' + (err.response?.data?.message || err.message);
        console.error('Error fetching data:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
</style>