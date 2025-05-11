<template>
  <nav>
    <router-link to="/">Inicio</router-link>
    <router-link to="/editar-formulario">Preguntas</router-link>
    <router-link to="/estadisticas">Estadísticas</router-link>
    <router-link to="/usuarios">Usuarios</router-link>
    <router-link to="/inventos">Inventos</router-link>
    <button @click="handleLogout">Cerrar Sesión</button>
  </nav>
</template>

<script>
import authService from '../services/auth'

export default {
  methods: {
    handleLogout() {
      authService.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
}

button {
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>