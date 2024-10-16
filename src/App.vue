<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login/login.vue';
import Registro from './components/Registro/registro.vue';
import Home from './components/Telas/home.vue';
import Inicio from './components/Telas/paginas/inicioPagina.vue';
import MinhasTarefas from './components/Telas/paginas/tarefaPagina.vue';
import Projetos from './components/Telas/paginas/projetoPagina.vue';
import Relatorios from './components/Telas/paginas/relatorioPagina.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Login', component: Login },
    { path: '/registro', name: 'Registro', component: Registro },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        { path: 'inicio', name: 'InicioPagina', component: Inicio },
        { path: 'minhas-tarefas', name: 'tarefaPagina', component: MinhasTarefas },
        { path: 'projetos', name: 'projetoPagina', component: Projetos },
        { path: 'relatorios', name: 'RelatorioPagina', component: Relatorios }
      ]
    }
  ]
});

export default {
  name: 'App',
  router
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>