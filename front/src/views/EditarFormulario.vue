<template>
  <div class="formulario-container">
    <h1 class="titulo-principal">Administrador de Preguntas</h1>
    
    <!-- Mensajes de error/éxito -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Botón para nueva pregunta (solo visible cuando no estamos editando) -->
    <div class="nueva-pregunta-btn" v-if="!modoEdicion">
      <button @click="mostrarFormulario" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nueva Pregunta
      </button>
    </div>

    <!-- Formulario para crear/editar (ahora ocultable) -->
    <div class="formulario-edicion" v-if="mostrarFormularioEdicion">
      <h2>{{ modoEdicion ? 'Editar Pregunta' : 'Nueva Pregunta' }}</h2>
      <form @submit.prevent="guardarPregunta">
        <div class="form-group">
          <label for="texto">Texto de la pregunta:</label>
          <textarea 
            id="texto" 
            v-model="preguntaActual.texto" 
            required
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categoria">Categoría:</label>
            <select 
              id="categoria" 
              v-model="preguntaActual.categoria" 
              required
              class="form-control"
            >
              <option value="">Seleccione una categoría</option>
              <option 
                v-for="categoria in categorias" 
                :key="categoria.id" 
                :value="categoria.id"
              >
                {{ categoria.nombre }} ({{ categoria.id }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="nivel">Nivel (1-9):</label>
            <input 
              id="nivel" 
              v-model.number="preguntaActual.nivel" 
              type="number" 
              min="1" 
              max="9" 
              required
              class="form-control"
            >
          </div>
        </div>

        <div class="botones-accion">
          <button type="submit" class="btn btn-primary">
            {{ modoEdicion ? 'Actualizar' : 'Crear' }}
          </button>
          <button 
            type="button" 
            @click="cancelarEdicion"
            class="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de preguntas -->
    <div class="lista-preguntas">
      <h2>Listado de Preguntas</h2>
      <div class="tabla-container">
        <table class="tabla-preguntas">
          <thead>
            <tr>
              <th>Texto</th>
              <th>Categoría</th>
              <th>Nivel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="preguntas.length === 0 && !loading">
              <td colspan="5" class="text-center">No hay preguntas disponibles</td>
            </tr>
            <tr v-else-if="loading">
              <td colspan="5" class="text-center">Cargando preguntas...</td>
            </tr>
            <tr v-for="pregunta in preguntas" :key="pregunta.id">
              <td>{{ pregunta.texto }}</td>
              <td>
                {{ obtenerNombreCategoria(pregunta.categoria) || pregunta.categoria }}
              </td>
              <td>{{ pregunta.nivel }}</td>
              <td class="acciones">
                <button @click="editarPregunta(pregunta)" class="btn btn-sm btn-edit">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="confirmarEliminar(pregunta)" class="btn btn-sm btn-delete">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api.js';
import "../assets/styles/EditarPreguntas.css"

export default {
  name: 'EditarFormulario',
  data() {
    return {
      preguntas: [],
      categorias: [],
      loading: true,
      error: null,
      successMessage: null,
      modoEdicion: false,
      mostrarFormularioEdicion: false, // Nuevo estado para controlar la visibilidad
      preguntaActual: {
        id: null,
        texto: '',
        categoria: '',
        nivel: 1
      }
    }
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        this.loading = true;
        
        // Obtener preguntas
        const preguntasResponse = await api.getPreguntas();
        this.preguntas = preguntasResponse.data || [];
        
        // Obtener categorías
        const categoriasResponse = await api.getCategorias();
        this.categorias = categoriasResponse.data || [];
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        this.error = "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.";
      } finally {
        this.loading = false;
      }
    },
    
    obtenerNombreCategoria(idCategoria) {
      const categoria = this.categorias.find(c => c.id === idCategoria);
      return categoria ? categoria.nombre : null;
    },
    
    mostrarFormulario() {
      this.mostrarFormularioEdicion = true;
      this.modoEdicion = false;
      this.resetFormulario();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    editarPregunta(pregunta) {
      this.preguntaActual = { ...pregunta };
      this.modoEdicion = true;
      this.mostrarFormularioEdicion = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    cancelarEdicion() {
      this.mostrarFormularioEdicion = false;
      this.resetFormulario();
    },
    
    resetFormulario() {
      this.preguntaActual = {
        id: null,
        texto: '',
        categoria: '',
        nivel: 1
      };
      this.modoEdicion = false;
    },
    
    async guardarPregunta() {
      try {
        this.error = null;
        this.successMessage = null;
        
        // Validar nivel
        if (this.preguntaActual.nivel < 1 || this.preguntaActual.nivel > 9) {
          throw new Error('El nivel debe estar entre 1 y 9');
        }
        
        if (this.modoEdicion) {
          // Actualizar pregunta existente
          await api.updatePregunta(
            this.preguntaActual.id,
            this.preguntaActual.texto,
            this.preguntaActual.categoria,
            this.preguntaActual.nivel
          );
          this.successMessage = 'Pregunta actualizada correctamente';
        } else {
          // Crear nueva pregunta
          await api.createPregunta(
            this.preguntaActual.texto,
            this.preguntaActual.categoria,
            this.preguntaActual.nivel
          );
          this.successMessage = 'Pregunta creada correctamente';
        }
        
        await this.cargarDatos();
        this.mostrarFormularioEdicion = false;
        this.resetFormulario();
        
      } catch (error) {
        console.error('Error al guardar pregunta:', error);
        this.error = error.message || 'Error al procesar la solicitud';
      }
    },
    
    confirmarEliminar(pregunta) {
      if (confirm(`¿Estás seguro de que deseas eliminar la pregunta "${pregunta.texto}"?`)) {
        this.eliminarPregunta(pregunta.id);
      }
    },
    
    async eliminarPregunta(id) {
      try {
        this.error = null;
        await api.deletePregunta(id);
        this.successMessage = 'Pregunta eliminada correctamente';
        await this.cargarDatos();
      } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        this.error = 'Error al eliminar la pregunta';
      }
    }
  }
}
</script>