<template>
  <div class="escoped">
    <TopBar></TopBar>
    <div class="pagina">
      <barraNavegacao ref="barraNavegacao"></barraNavegacao>
      <router-view @update-navigation="updateNavigation"></router-view>
    </div>
  </div>
</template>

<script>
import TopBar from './barras/topbar.vue';
import barraNavegacao from './barras/barraNavegacao.vue';

export default {
  name: 'HomePag',
  components: {
    TopBar,
    barraNavegacao
  },
  methods: {
    updateNavigation(activeButton) {
      this.$refs.barraNavegacao.activeButton = activeButton;
      localStorage.setItem('Aba', activeButton);
    }
  }
};
</script>



<style scoped>
.pagina{
    display: flex;
    height: 91%;
}
.escoped{
    height: 100%;
}
</style>