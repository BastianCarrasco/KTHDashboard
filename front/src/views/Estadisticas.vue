<template>
  <div>
    <h1>Historial de Evaluaciones</h1>
    
    <!-- Filtro por nombre -->
    <div class="filters">
      <input
        v-model="searchName"
        type="text"
        placeholder="Buscar por nombre..."
        class="search-input"
      />
      <select v-model="selectedUserId" class="user-select">
        <option value="">Todos los usuarios</option>
        <option v-for="user in uniqueUsers" :key="user.id" :value="user.id">
          {{ user.nombre }} ({{ user.email }})
        </option>
      </select>
    </div>
    
    <!-- Estado de carga -->
    <div v-if="loading" class="loading">Cargando datos...</div>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">{{ error }}</div>
    

<div
  v-if="selectedUserId && filteredHistorial.length > 0"
  class="charts-wrapper"
>
  <div
    v-for="(evaluation, index) in filteredHistorial"
    :key="evaluation.id"
    class="chart-card"
  >
    <h3>{{ formatFechaCorta(evaluation.fecha) }}</h3>
    <RadarChart :evaluations="[evaluation]" :size="200" />
  </div>
</div>
    
    <!-- Tabla de resultados -->
    <div v-if="filteredHistorial.length > 0" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
           
            <th>Usuario</th>
            <th>Email</th>
            <th>Fecha Evaluación</th>
            <th>CRL</th>
            <th>TRL</th>
            <th>TEAM</th>
            <th>BRL</th>
            <th>FRL</th>
            <th>IPRL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredHistorial" :key="item.id">
           
            <td>{{ item.nombre }}</td>
            <td>{{ item.email }}</td>
            <td>{{ formatFecha(item.fecha) }}</td>
            <td :class="getScoreClass(item.crl)">{{ item.crl }}</td>
            <td :class="getScoreClass(item.trl)">{{ item.trl }}</td>
            <td :class="getScoreClass(item.team)">{{ item.team }}</td>
            <td :class="getScoreClass(item.brl)">{{ item.brl }}</td>
            <td :class="getScoreClass(item.frl)">{{ item.frl }}</td>
            <td :class="getScoreClass(item.iprl)">{{ item.iprl }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="!loading" class="no-data">
      No se encontraron registros de evaluaciones
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apifuncions from '@/api/apifuncions';
import '../assets/styles/Estadisticas.css';
import RadarChart from '@/components/RadarChart.vue';

// Datos reactivos
const historial = ref([]);
const loading = ref(true);
const error = ref(null);
const searchName = ref('');
const selectedUserId = ref('');

// Obtener usuarios únicos
const uniqueUsers = computed(() => {
  const usersMap = new Map();
  historial.value.forEach(item => {
    if (!usersMap.has(item.id_user)) {
      usersMap.set(item.id_user, {
        id: item.id_user,
        nombre: item.nombre,
        email: item.email
      });
    }
  });
  return Array.from(usersMap.values());
});

// Filtrar historial por nombre y usuario seleccionado
const filteredHistorial = computed(() => {
  let filtered = historial.value;
  
  if (searchName.value) {
    const searchTerm = searchName.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.nombre.toLowerCase().includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm)
    );
  }
  
  if (selectedUserId.value) {
    filtered = filtered.filter(item => item.id_user == selectedUserId.value);
  }
  
  return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

// Datos para el gráfico histórico
const userHistoryChart = computed(() => {
  if (!selectedUserId.value) return [];
  
  const chartData = [];
  const userHistory = filteredHistorial.value;
  
  userHistory.forEach(item => {
    const date = new Date(item.fecha);
    const dateStr = date.toLocaleDateString('es-CL');
    const dateShort = `${date.getDate()}/${date.getMonth() + 1}`;
    
    chartCategories.forEach(category => {
      chartData.push({
        category: category.label,
        categoryKey: category.key,
        value: item[category.key],
        date: dateStr,
        dateShort: dateShort,
        color: getCategoryColor(category.key)
      });
    });
  });
  
  return chartData;
});

// Categorías para el gráfico
const chartCategories = [
  { key: 'crl', label: 'CRL' },
  { key: 'trl', label: 'TRL' },
  { key: 'team', label: 'TEAM' },
  { key: 'brl', label: 'BRL' },
  { key: 'frl', label: 'FRL' },
  { key: 'iprl', label: 'IPRL' }
];

// Colores por categoría
const getCategoryColor = (category) => {
  const colors = {
    crl: '#4CAF50',
    trl: '#2196F3',
    team: '#FFC107',
    brl: '#9C27B0',
    frl: '#FF5722',
    iprl: '#607D8B'
  };
  return colors[category] || '#000';
};

// Formatear fecha legible
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Clases CSS según puntaje
const getScoreClass = (score) => {
  if (score >= 7) return 'high-score';
  if (score >= 4) return 'medium-score';
  return 'low-score';
};

// Obtener datos al montar el componente
onMounted(async () => {
  try {
    loading.value = true;
    const response = await apifuncions.getHistoria();
    historial.value = response.data || [];
  } catch (err) {
    error.value = 'Error al cargar el historial de evaluaciones';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});
const formatFechaCorta = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-CL');
};

</script>

<style scoped>
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
  justify-content: center;
}

.chart-card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background: #f9f9f9;
  width: 220px;
  text-align: center;
}

</style>