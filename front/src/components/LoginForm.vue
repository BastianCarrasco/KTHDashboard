<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          placeholder="maria@ejemplo.com"
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="SuContraseñaSecreta123"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import authService from '../services/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''
      
      const result = await authService.login(this.email, this.password)
      
      if (result.success) {
        this.$router.push('/')
      } else {
        this.error = result.message || 'Credenciales incorrectas'
      }
      
      this.loading = false
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>