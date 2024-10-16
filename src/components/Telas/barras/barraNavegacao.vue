<template>
  <div class="navegacao">
    <button class="btn" :class="{ 'active': activeButton === 'InicioPagina' }" @click="loadComponent('InicioPagina')"><b>Início</b></button>
    <button class="btn" :class="{ 'active': activeButton === 'tarefaPagina' }" @click="loadComponent('tarefaPagina')"><b>Minhas Tarefas</b></button>
    <button class="btn" :class="{ 'active': activeButton === 'projetoPagina' }" @click="loadComponent('projetoPagina')"><b>Projetos</b></button>
    <button class="btn" :class="{ 'active': activeButton === 'RelatorioPagina' }" @click="loadComponent('RelatorioPagina')"><b>Relatórios</b></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeButton: 'InicioPagina',
    };
  },
  created() {
    const storedTab = localStorage.getItem('Aba');
    if (storedTab) {
      this.activeButton = storedTab;
      this.$router.push({ name: storedTab });
    } else {
      localStorage.setItem('Aba', 'InicioPagina');
      this.$router.push({ name: 'InicioPagina' });
    }
  },
  methods: {
    loadComponent(componentName) {
      this.activeButton = componentName;
      localStorage.setItem('Aba', componentName);
      this.$router.push({ name: componentName });
    }
  }
}
</script>





<style scoped>
.navegacao {
  background-color: #B9B9B9;
  width: 10%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
}
.btn {
  font-weight: bold;
  font-size: 20px;
  height: 78px;
  box-shadow: none;
  border: none;
  background-color: #B9B9B9;
  cursor: pointer;
}
.btn.active {
  background-color: #D9D9D9;
}
</style>