<template>
  <div class="pagi">
    <div class="botoes">
      <div>
        <button class="btnAcao" @click="openTaskModal">
          <div class="plus">
            <SvgIcon class="icomplus" type="mdi" :path="plus" />
          </div>
          <span class="info">Tarefa</span>
        </button>
      </div>
      <div>
        <button class="btnAcao" @click="openProjetoModal">
          <div class="plus">
            <SvgIcon class="icomplus" type="mdi" :path="plus" />
          </div>
          <span class="info">Projeto</span>
        </button>
      </div>
      <div>
        <button class="btnAcao" @click="openModal">
          <div class="plus">
            <SvgIcon class="icomplus" type="mdi" :path="plus" />
          </div>
          <span class="info">Relatório</span>
        </button>
      </div>
    </div>
    <div class="grupos">
      <h4>Minhas Tarefas:</h4>
      <div class="subgrup">
        <div class="header">
          <h4 class="n1">Nome</h4>
          <h4 class="n2">Status</h4>
          <h4>Ação</h4>
        </div>
        <div class="pequenos">
          <div class="list" v-if="tarefas.length>0">
            <div v-for="tarefa in tarefas" :key="tarefa.idTarefa" class="item">
              <h4 class="nomeProjeto">{{ tarefa.nomeTarefa }}</h4>
              <h4 class="g1" :class="{ ativo: tarefa.status === 'Aberto', fechado: tarefa.status === 'Fechado' }">{{ tarefa.status }}</h4>
              <button class="btnEntrar"  @click="entraTarefa(tarefa.idTarefa)"  v-if="tarefa.status === 'Aberto'" >ENTRAR</button>
              <button class="btnBloqueado"  v-else>BOQUEADO</button>
            </div>
          </div>
          <div v-else-if="!tarefas.length>0">
            <div class="nada">
              Não possui nenhuma tarefa.
            </div>
          </div>
          <div class="divflooter">
            <div class="footer" @click="pagiTarefa" >
              <span>OUTRAS TAREFAS</span>
              <SvgIcon class="icon" type="mdi" :path="path" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grupos">
      <h4>Projetos:</h4>
      <div class="subgrup">
        <div class="header">
          <h4 class="n1">Nome</h4>
          <h4 class="n2">Gestor</h4>
          <h4>Ação</h4>
        </div>
        <div class="pequenos">
          <div class="list" v-if="projetos.length>0">
            <div v-for="projeto in projetos" :key="projeto.idProjeto" class="item">
              <h4 class="nomeProjeto">{{ projeto.nomeProjeto }}</h4>
              <h4 class="g1" :class="{ ativo: projeto.idGestor === userData.id, normal: projeto.idGestor !== userData.id }">{{ projeto.nomeGestor }}</h4>
              <button class="btnEntrar" @click="entrarProjeto(projeto)">ENTRAR</button>
            </div>
          </div>
          <div v-else-if="!projetos.length>0">
            <div class="nada">
              Não está participando de nenhum projeto.
            </div>
          </div>
          <div class="divflooter">
            <div class="footer" @click="pagiProjeto">
              <span>OUTROS PROJETOS</span>
              <SvgIcon class="icon" type="mdi" :path="path" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <TarefaDetalheModal 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      :taskId="selectedTaskId" 
      ref="taskDetalhe" 
      @detalhe-fechado="fetchTarefas"
    />
    <NovoTarefaModal 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      ref="taskModal" 
      @tarefa-fechado="fetchTarefas"
    />
    <NovoProjetoModal 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      ref="projetoModal" 
      @projeto-fechado="fetchProjetos" 
    />
    <Modal 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      ref="modal"
    />
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout, mdiPlusThick } from '@mdi/js';
import Modal from '../../modais/NovoRelatorioModal.vue';
import NovoTarefaModal from '../../modais/NovoTarefaModal.vue';
import NovoProjetoModal from '../../modais/NovoProjetoModal.vue';
import TarefaDetalheModal from '../../modais/ModalDealheTarefa.vue';
import {getPercursoAberto, getProjeto, getTarefas} from '../../../services.js';

export default {
  name: 'InicioPagina',
  components: {
    SvgIcon,
    Modal,
    NovoTarefaModal,
    NovoProjetoModal,
    TarefaDetalheModal
  },
  data() {
    return {
      tarefas: [],
      projetos: [],
      userData: {},
      path: mdiLogout,
      plus: mdiPlusThick,
      selectedTaskId: ''
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (this.userData.id) {
      this.fetchTarefas(this.userData.id);
      this.fetchProjetos(this.userData.id);
    }
  },
  methods: {
    fetchTarefas(userId = this.userData.id) {
      this.selectedTaskId = '';
      getTarefas(userId)
        .then(response => {
          this.tarefas = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar tarefas:', error.message);
        });
    },
    fetchProjetos(userId = this.userData.id) {
      getProjeto(userId)
        .then(response => {
          this.projetos = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar projetos:', error.message);
        });
    },
    pagiTarefa() {
      this.$emit('update-navigation', 'tarefaPagina');
      this.$router.push({ name: 'tarefaPagina' });
      localStorage.setItem('Aba', 'tarefaPagina');
    },
    pagiProjeto() {
      this.$emit('update-navigation', 'projetoPagina');
      this.$router.push({ name: 'projetoPagina' });
      localStorage.setItem('Aba', 'projetoPagina');
    },
    openModal() {
      this.$refs.modal.openModal();
    },
    openTaskModal() {
      this.$refs.taskModal.openModal();
    },
    async entraTarefa(idTarefa) {
      if (idTarefa) {
        this.selectedTaskId = idTarefa;
        await this.$nextTick();
        this.$refs.taskDetalhe.openModal();
      } else {
        console.error("ID da tarefa não fornecido.");
      }
    },
    openProjetoModal() {
      this.$refs.projetoModal.openModal();
    },
    entrarProjeto(projeto) {
      if (projeto && projeto.idProjeto) {
        this.$emit('update-navigation', 'projetoPagina');
          if (projeto.idGestor === this.userData.id) {
              this.$router.push({ 
                  name: 'DetalhesProjeto', 
                  params: { 
                      id: projeto.idProjeto, 
                      nomeProjeto: projeto.nomeProjeto },
              });
          } else {
              this.PercursoAberto(projeto);
          }
      } else {
          console.error("O projeto não possui um ID válido.");
      }
    },
    async PercursoAberto(projeto){
            try {
                const response = await getPercursoAberto(projeto.idProjeto);
                const data = response.data;
                if (data.idPercurso) {
                    this.$router.push({ 
                        name: 'DetalhesPercurso', 
                        params: { 
                            idProjeto: projeto.idProjeto, 
                            nomeProjeto: data.nomeProjeto,
                            idPercurso: data.idPercurso,
                            nomePercurso: data.nomePercurso,
                            idGestor: projeto.idGestor
                        },
                    });
                }
            } catch (error) {
            console.error('Erro ao buscar percurso aberto:', error);
            }
    },
  }
};
</script>

<style scoped>
.pagi{
    margin-top: 35px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
}

.botoes{
    display: flex;
    margin-left: 90px;
    gap: 30px;
    margin-bottom: 20px;
}

.grupos{
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 120px;
    font-weight: bold;
    font-size: 18px;
}

.subgrup{
    width: 90%;
    margin-left: 50px;
}

.pequenos{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.list{
    gap: 15px;
    width: 100%;
}


.header, .item {
    display: flex;
    justify-content: space-between;
}

.header {
    height: 40px;
    margin-left: 25px;
    margin-right: 45px;
    font-weight: bold;
}

.item {
    align-items: center;
    gap: 15px;
    background-color: #D9D9D9;
    border: 1px solid #000000;
    height: 53px;
    border-radius: 10px;
    margin-top: 15px;
    padding-left: 15px;
}

.ativo {
  text-transform: uppercase;
    margin-left: 22px;
    color: #028E10;
}
.fechado{
    margin-left: 23px;
    color: #930000;
    text-transform: uppercase;
}
.normal{
    margin-left: 23px;
    text-transform: uppercase;
}

.footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: flex-end;
  font-size: 16px;
  font-weight: bold;
}



.btnEntrar{
    background-color: #005B51;
    color: white;
    border: none;
    width: 105px;
    border-radius: 15px;
    cursor: pointer;
    height: 35px;
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
    padding-top: 2px;
}

.btnEntrar:hover {
    background-color: #039A89;
}

.icon{
    margin-left: 5px;
}

.footer:hover{
    color: #039A89;
}

.btnAcao:hover{
    background-color: #aeaeaed7;
}

.btnAcao{
    color: #005B51;
    display: flex;
    height: 130px;
    width: 127px;
    background-color: #D9D9D9;
    border: 1px solid #000000;
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
}
.plus{
    display: flex;
    background-color: white;
    border-radius: 50%;
    height: 65px;
    width: 66px;
    align-items: center;
    justify-content: center;
}
.info{
    font-size: 17px;
    font-weight: bold;
}
.icomplus{
    height: 36px;
    width: 36px;
}

.nomeProjeto{
  display: flex;
  width: 200px;
  text-transform: uppercase;
}

.nada{
  display: flex;
  align-items: center;
    gap: 15px;
    background-color: #D9D9D9;
    border: 1px solid #000000;
    height: 53px;
    border-radius: 10px;
    margin-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
}

.divflooter{
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.n1{
  display: flex;
  width: 200px;
}

.n2{
  width: 200px;
}

.g1{
  margin-left: none;
  width: 250px;
}

.btnBloqueado{
    background-color: #B9B9B9;
    color: white;
    border: none;
    width: 105px;
    border-radius: 15px;
    height: 35px;
    font-size: 16px;
    font-weight: bold;
    margin-right: 15px;
    padding-top: 2px;
}

</style>