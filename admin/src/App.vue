<template>
  <Navbar v-if="isAuthenticated" />
  <router-view />
</template>

<script>
import Navbar from './components/Navbar.vue'
import authService from './services/auth'

export default {
  components: { Navbar },
  computed: {
    isAuthenticated() {
      return authService.isAuthenticated()
    }
  }
}
</script>

<style>
/* Estilos globales */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>