<template>
  <div>
    <h1>Bienvenido, {{ user.nombre }}</h1>
    <p>Email: {{ user.email }}</p>
  </div>
</template>

<script>
import authService from '../services/auth'

export default {
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.user = authService.getUser() || {}
  }
}
</script>