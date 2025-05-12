<template>
  <div class="construction-container">
    <h1>🚧 Página en Construcción 🚧</h1>
    <p>Estamos trabajando en esta sección. ¡Vuelve pronto!</p>
  </div>
</template>

<script>
export default {
  name: 'EditarFormulario'
}
</script>

<style scoped>
.construction-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  background-color: #f8f8f8;
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 2rem;
  color: #555;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
}
</style>
