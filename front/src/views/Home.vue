<template>
  <div class="dashboard-container">
    <!-- Sección de bienvenida -->
    <div class="welcome-card glow-card">
      <h1>Bienvenido, <span class="user-name">{{ user.nombre }}</span></h1>
      <p class="user-email">📧 {{ user.email }}</p>
      <div class="user-actions">
        <button class="edit-profile-btn" @click="navigateTo('/perfil')">
          ✏️ Editar Perfil
        </button>
      </div>
    </div>

    <!-- Panel de navegación -->
    <nav class="navigation-panel glow-panel">
      <div class="nav-description">
        <h2>Panel de Control</h2>
        <p>Selecciona una sección para administrar el sistema</p>
      </div>
      
      <div class="nav-links">
        <router-link 
          to="/" 
          class="nav-link"
          data-tooltip="Página principal del sistema">
          🏠 Inicio
        </router-link>
        
        <router-link 
          to="/editar-formulario" 
          class="nav-link"
          data-tooltip="Editar preguntas y respuestas del formulario">
          📝 Preguntas
        </router-link>
        
        <router-link 
          to="/estadisticas" 
          class="nav-link"
          data-tooltip="Ver gráficos y análisis de resultados">
          📊 Estadísticas
        </router-link>
        
        <router-link 
          to="/usuarios" 
          class="nav-link"
          data-tooltip="Administrar usuarios del sistema">
          👥 Usuarios
        </router-link>
        
        <router-link 
          to="/inventos" 
          class="nav-link"
          data-tooltip="Gestionar inventos y proyectos">
          💡 Inventos
        </router-link>
        
        <router-link 
          to="/alternativas" 
          class="nav-link"
          data-tooltip="Administrar alternativas de respuestas">
          🔘 Alternativas
        </router-link>
        
        <button 
          @click="handleLogout" 
          class="logout-btn"
          data-tooltip="Cerrar tu sesión actual">
          🚪 Cerrar Sesión
        </button>
      </div>
    </nav>

    <!-- Sección explicativa -->
    <div class="info-section">
      <div class="info-card">
        <h3>📝 Edición de Contenido</h3>
        <p>En la sección de <strong>Preguntas</strong> podrás:</p>
        <ul>
          <li>Crear y modificar preguntas del formulario</li>
          <li>Establecer alternativas de respuesta</li>
          <li>Organizar por categorías</li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>📊 Análisis de Datos</h3>
        <p>En <strong>Estadísticas</strong> encontrarás:</p>
        <ul>
          <li>Gráficos interactivos de resultados</li>
          <li>Comparativas entre usuarios</li>
          <li>Evolución temporal</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth'
import '../assets/main.css'

export default {
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.user = authService.getUser() || {}
  },
  methods: {
    handleLogout() {
      authService.logout()
      this.$router.push('/login')
    },
    navigateTo(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Tarjeta de bienvenida */
.welcome-card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glow-card:hover {
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.3);
  transition: box-shadow 0.3s ease;
}

.user-name {
  color: #2c3e50;
  font-weight: 600;
}

.user-email {
  color: #7f8c8d;
  margin: 0.5rem 0 1.5rem;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.edit-profile-btn {
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.edit-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* Panel de navegación */
.navigation-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.nav-description {
  margin-bottom: 1.5rem;
}

.nav-description h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.nav-description p {
  color: #7f8c8d;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  min-height: 60px;
  text-align: center;
}

.nav-link:hover {
  background: #42b983;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(66, 185, 131, 0.2);
}

.nav-link:after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.nav-link:hover:after {
  opacity: 1;
  margin-bottom: 10px;
}

.router-link-exact-active {
  background: #42b983 !important;
  color: white !important;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #ff6b6b;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: span 2;
  min-height: 60px;
}

.logout-btn:hover {
  background: #ff4444;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(255, 107, 107, 0.2);
}

/* Sección informativa */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-card ul {
  padding-left: 1.5rem;
  color: #7f8c8d;
}

.info-card li {
  margin-bottom: 0.5rem;
}

/* Efectos de brillo */
.glow-panel:hover {
  box-shadow: 0 0 20px rgba(66, 185, 131, 0.1);
  transition: box-shadow 0.3s ease;
}

.body{
  background-color: #2c3e50;
}

@media (max-width: 768px) {
  .nav-links {
    grid-template-columns: 1fr 1fr;
  }
  
  .logout-btn {
    grid-column: span 2;
  }
}
</style>