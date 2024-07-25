<template>
  <div id="app">
    <HeaderComponent />
    <router-view />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
export default {
  name: 'App',
  components: {
    HeaderComponent
  }
}
</script>

<style>
body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
</style>
