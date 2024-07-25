<template>
  <header class="header">
    <h1 class="title">Petiko</h1>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 99.2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #333;
  color: white;
  z-index: 1000;
}

.title {
  font-size: 24px;
}
</style>
