<template>
  <div class="alternativas-container">
    <h1>Administrar Alternativas</h1>
    
    <!-- Filtro de preguntas -->
    <div class="filtro-container">
      <label for="filtro-pregunta">Filtrar por pregunta:</label>
      <select 
        id="filtro-pregunta" 
        v-model="preguntaFiltro" 
        @change="aplicarFiltro"
        class="select-filtro"
      >
        <option value="">Todas las preguntas</option>
        <option 
          v-for="pregunta in preguntasUnicas" 
          :key="pregunta.id" 
          :value="pregunta.id"
        >
          {{ pregunta.texto || `Pregunta ID: ${pregunta.id}` }}
          (Categoría: {{ pregunta.categoria }} - Nivel: {{ pregunta.nivel }})
        </option>
      </select>
    </div>
    
    <div v-if="loading" class="loading-message">
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>Error: {{ error }}</p>
      <button @click="cargarDatos" class="btn-reintentar">Reintentar</button>
    </div>
    
    <div v-else>
      <div v-if="alternativasFiltradas.length === 0" class="no-data">
        <p>No hay alternativas disponibles para la selección actual</p>
      </div>
      
      <div v-else>
        <div v-for="grupo in alternativasFiltradas" :key="grupo.id_pregunta" class="pregunta-group">
          <h2>
            {{ grupo.texto_pregunta || `Pregunta ID: ${grupo.id_pregunta}` }}
            <span class="categoria-nivel" v-if="grupo.categoria && grupo.nivel">
              (Categoría: {{ grupo.categoria }} - Nivel: {{ grupo.nivel }})
            </span>
          </h2>
          
          <div v-for="alternativa in grupo.items" :key="alternativa.id" class="alternativa-card">
            <div class="alternativa-header">
              <span class="alternativa-id">ID: {{ alternativa.id }}</span>
              <span class="alternativa-correcta" v-if="alternativa.es_correcta">✓ Correcta</span>
            </div>
            <div class="alternativa-content">
              <p>{{ alternativa.texto }}</p>
            </div>
            <div class="alternativa-actions">
              <button @click="editarAlternativa(alternativa)" class="btn-editar">Editar</button>
              <button @click="confirmarEliminar(alternativa.id)" class="btn-eliminar">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <p>¿Estás seguro que deseas eliminar esta alternativa?</p>
        <div class="modal-actions">
          <button @click="eliminarAlternativa" class="btn-confirmar">Confirmar</button>
          <button @click="cancelarEliminar" class="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/styles/EditarAlternativas.css'
import { ref, computed, onMounted } from 'vue'
import alternativasData from '../api/apialter.js'
import preguntasData from '../api/api.js'

export default {
  name: 'EditarAlternativas',
  setup() {
    const alternativas = ref([])
    const preguntas = ref([])
    const loading = ref(true)
    const error = ref(null)
    const mostrarModal = ref(false)
    const alternativaAEliminar = ref(null)
    const preguntaFiltro = ref('')

    // Obtener preguntas únicas para el filtro
    const preguntasUnicas = computed(() => {
      return preguntas.value.filter((pregunta, index, self) =>
        index === self.findIndex(p => p.id === pregunta.id)
      )
    })

    // Agrupa alternativas por pregunta y añade info de la pregunta
    const alternativasAgrupadas = computed(() => {
      const grupos = {}
      
      alternativas.value.forEach(alt => {
        if (!grupos[alt.id_pregunta]) {
          const pregunta = preguntas.value.find(p => p.id === alt.id_pregunta) || {}
          grupos[alt.id_pregunta] = {
            id_pregunta: alt.id_pregunta,
            texto_pregunta: pregunta.texto,
            categoria: pregunta.categoria,
            nivel: pregunta.nivel,
            items: []
          }
        }
        grupos[alt.id_pregunta].items.push(alt)
      })
      
      return Object.values(grupos)
    })

    // Alternativas filtradas según la selección
    const alternativasFiltradas = computed(() => {
      if (!preguntaFiltro.value) return alternativasAgrupadas.value
      
      return alternativasAgrupadas.value.filter(
        grupo => grupo.id_pregunta == preguntaFiltro.value
      )
    })

    // Métodos para acciones
    const editarAlternativa = (alternativa) => {
      console.log('Editar alternativa:', alternativa)
      // Implementar lógica de edición aquí
    }

    const confirmarEliminar = (id) => {
      alternativaAEliminar.value = id
      mostrarModal.value = true
    }

    const cancelarEliminar = () => {
      alternativaAEliminar.value = null
      mostrarModal.value = false
    }

    const eliminarAlternativa = async () => {
      try {
        await alternativasData.deleteAlternativa(alternativaAEliminar.value)
        alternativas.value = alternativas.value.filter(alt => alt.id !== alternativaAEliminar.value)
        mostrarModal.value = false
      } catch (err) {
        console.error('Error eliminando alternativa:', err)
        error.value = 'No se pudo eliminar la alternativa'
        mostrarModal.value = false
      }
    }

    const aplicarFiltro = () => {
      // El filtro se aplica automáticamente a través de la propiedad computada
    }

    const cargarDatos = async () => {
      loading.value = true
      error.value = null
      try {
        const [resAlternativas, resPreguntas] = await Promise.all([
          alternativasData.getAlternativas(),
          preguntasData.getPreguntas()
        ])
        
        alternativas.value = resAlternativas.data || []
        preguntas.value = resPreguntas.data || []
        
        if (!resAlternativas.success || !resPreguntas.success) {
          throw new Error('Error en la respuesta de la API')
        }
      } catch (err) {
        console.error("Error cargando datos:", err)
        error.value = err.message || 'Error al cargar los datos'
      } finally {
        loading.value = false
      }
    }

    onMounted(cargarDatos)

    return {
      alternativas,
      preguntas,
      loading,
      error,
      alternativasAgrupadas,
      alternativasFiltradas,
      preguntasUnicas,
      preguntaFiltro,
      mostrarModal,
      editarAlternativa,
      confirmarEliminar,
      cancelarEliminar,
      eliminarAlternativa,
      aplicarFiltro,
      cargarDatos
    }
  }
}
</script>

<style scoped>
.filtro-container {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.filtro-container label {
  margin-right: 10px;
  font-weight: bold;
}

.select-filtro {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 300px;
  font-size: 16px;
}

.alternativa-correcta {
  color: green;
  font-weight: bold;
  margin-left: 10px;
}
</style>