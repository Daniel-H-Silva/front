import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login/login.vue';
import Registro from './components/Registro/registro.vue';
import Home from './components/Telas/home.vue';
import Inicio from './components/Telas/paginas/inicioPagina.vue';
import MinhasTarefas from './components/Telas/paginas/tarefaPagina.vue';
import Projetos from './components/Telas/paginas/projetoPagina.vue';
import Relatorios from './components/Telas/paginas/relatorioPagina.vue';
import DetalhesProjeto from './components/Telas/paginas/projeto/DetalhesProjeto.vue';
import DetalhesPercurso from './components/Telas/paginas/projeto/DetalhesPercurso.vue';

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
        { path: '', name: 'InicioPagina', component: Inicio },
        { path: 'minhas-tarefas', name: 'tarefaPagina', component: MinhasTarefas },
        { path: 'projetos', name: 'projetoPagina', component: Projetos },
        { path: 'relatorios', name: 'RelatorioPagina', component: Relatorios },
        { path: 'projeto/:nomeProjeto', name: 'DetalhesProjeto', component: DetalhesProjeto, props: true },
        { path: 'projeto/:nomeProjeto/:nomePercurso', name: 'DetalhesPercurso', component: DetalhesPercurso, props: true },
      ]
    }
  ]
});

const app = createApp(App);
app.use(router);
app.mount('#app');