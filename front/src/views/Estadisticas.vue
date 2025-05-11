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
    
    <!-- Gráfico histórico (solo cuando se filtra por usuario) -->
    <div v-if="selectedUserId && filteredHistorial.length > 0" class="chart-container">
      <h2>Evolución Histórica</h2>
      <div class="chart">
        <div 
          v-for="(result, index) in userHistoryChart" 
          :key="index"
          class="chart-bar"
          :style="{ height: `${result.value * 10}%`, backgroundColor: result.color }"
          :title="`${result.category}: ${result.value} (${result.date})`"
        >
          <span class="chart-value">{{ result.value }}</span>
        </div>
      </div>
      <div class="chart-labels">
        <div v-for="(result, index) in userHistoryChart" :key="index" class="chart-label">
          {{ result.dateShort }}
        </div>
      </div>
      <div class="chart-legend">
        <div v-for="category in chartCategories" :key="category.key">
          <span class="legend-color" :style="{ backgroundColor: getCategoryColor(category.key) }"></span>
          {{ category.label }}
        </div>
      </div>
    </div>
    
    <!-- Tabla de resultados -->
    <div v-if="filteredHistorial.length > 0" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
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
            <td>{{ item.id }}</td>
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
</script>

<style scoped>
.loading {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.error-message {
  padding: 1rem;
  color: #d32f2f;
  background-color: #fde0e0;
  border-radius: 4px;
  margin: 1rem 0;
}

.no-data {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
  max-width: 300px;
}

.user-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th, .data-table td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

/* Estilos para puntajes */
.high-score {
  color: #2e7d32;
  background-color: #e8f5e9;
}

.medium-score {
  color: #f57c00;
  background-color: #fff3e0;
}

.low-score {
  color: #c62828;
  background-color: #ffebee;
}

/* Estilos para el gráfico */
.chart-container {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}

.chart {
  display: flex;
  height: 300px;
  align-items: flex-end;
  gap: 2px;
  margin-bottom: 1rem;
  position: relative;
}

.chart-bar {
  flex: 1;
  min-width: 20px;
  position: relative;
  transition: height 0.3s ease;
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
}

.chart-value {
  position: absolute;
  top: -25px;
  font-size: 0.8rem;
  font-weight: bold;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.chart-label {
  flex: 1;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 3px;
}
</style>