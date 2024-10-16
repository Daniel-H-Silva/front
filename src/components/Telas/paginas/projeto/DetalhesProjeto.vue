<template>
  <div class="detalhes-projeto">
    <div>
      <div class="header">
        <h2 class="titulos">
          <button @click="voltar" class="voltar">Voltar</button>
          {{ projeto.nome }} 
          <svg-icon type="mdi" :path="path" @click="abrirModalInfo" class="icon"></svg-icon>
        </h2>
        <div class="usuarios">
          <div class="membros" @click="abrirModalMembros">
            <div v-for="(membro, index) in membros" :key="index" class="membro">
              {{ membro.iniciais }}
            </div>
            <svg-icon type="mdi" :path="v" class="icon"></svg-icon>
          </div>
          <button @click="abrirModalAdicionarMembro" class="btnEntrar">Adicionar Membro</button>
        </div>
      </div>
      <div class="acoes">
          <div class="botoes">
            <div>
              <button class="btnAcao" @click="openNovoPercursoModal">
                <div class="plus">
                  <SvgIcon class="icomplus" type="mdi" :path="plus" />
                </div>
                <span class="info">Percurso</span>
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
          <div class="campoFiltro">
            <label for="nome">Filtros:</label>
            <div class="filtros">
              <div class="linha1">
                <div class="campoName">
                  <label for="nome">Nome:</label>
                  <input type="text" id="nome" v-model="filtro.nome">
                </div>
                 <div class="campoRadio">
                <label for="status">Status:</label>
                <div class="options">
                  <input type="checkbox" id="aberto" value="Aberto" v-model="filtro.statusAberto"
                    :disabled="filtro.statusFechado === false && filtro.statusEspera === false">
                  <label for="aberto" :class="{ active: filtro.statusAberto }">Aberto</label>
                  <input type="checkbox" id="fechado" value="Fechado" v-model="filtro.statusFechado"
                    :disabled="filtro.statusAberto === false && filtro.statusEspera === false">
                  <label for="fechado" :class="{ active: filtro.statusFechado }">Fechado</label>
                  <input type="checkbox" id="espera" value="espera" v-model="filtro.statusEspera"
                    :disabled="filtro.statusAberto === false && filtro.statusFechado === false">
                  <label for="espera" :class="{ active: filtro.statusEspera }">Em Espera</label>
                </div>
              </div>
              </div>
              <div>
                <label for="data-inicial">Data Inicial:</label>
                <input type="date" id="data-inicial" v-model="filtro.dataInicial">
                <label for="data-final">Data Final:</label>
                <input type="date" id="data-final" v-model="filtro.dataFinal">
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="grupos">
      <h4>Percursos:</h4>
      <table class="subgrup">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data Inicial</th>
            <th>Data Final</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <transition :name="transitionName" mode="out-in">
          <tbody key="page-{{ currentPage }}" class="list">
            <tr v-for="(percurso, index) in paginatedPercursos" :key="index" class="item">
              <td>{{ percurso.nome }}</td>
              <td>{{ percurso.dataInicial }}</td>
              <td>{{ percurso.dataFinal }}</td>
              <td :class="{ 'aberto': percurso.status === 'Aberto', 'fechado': percurso.status === 'Fechado' }">
                {{ percurso.status }}
              </td>
              <td>
                <button class="Entrar" @click="entrarPercurso(percurso)">Entrar</button>
              </td>
            </tr>
            <tr v-if="paginatedPercursos.length === 0">
              <td colspan="5">Nenhum percurso encontrado.</td>
            </tr>
          </tbody>
        </transition>
      </table>
      <div class="pagination" v-if="paginatedPercursos.length !== 0">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
      </div>
    </div>



    <!-- Modals -->
    <div v-if="mostrarModalInfo" class="modal">
      <div class="modal-content">
        <span class="close" @click="fecharModalInfo">&times;</span>
        <p>Informações do Projeto</p>
      </div>
    </div>
    <div v-if="mostrarModalMembros" class="modal">
      <div class="modal-content">
        <span class="close" @click="fecharModalMembros">&times;</span>
        <p>Detalhes dos Membros</p>
      </div>
    </div>


    <ModalMembroNovo 
      v-bind:IdProjeto="id" 
      ref="modal"  
      @adicionarMembro-fechado="buscarMembrosProjeto"
    />


    <ModalMembro 
      v-bind:IdProjeto="id" 
      ref="modalMembro"  
      @membro-fechado="buscarMembrosProjeto"
    />

    <ModalNovoPercurso 
      v-bind:IdProjeto="id" 
      ref="novoPercurso"  
      @novoPercurso-fechado="fetchPercursos"
    />

    <Modal
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      v-bind:idProj="id" 
      ref="modalRelatorio"
    />

    <ModalInfoProjeto
      v-bind:GestorNome="userData.nome" 
      v-bind:idProjet="id" 
      @projetoInfo-fechado="buscarNomeProjeto"
      ref="modalInfoProjeto"
    />
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiInformationSymbol, mdiChevronDown, mdiPlusThick } from '@mdi/js';
import ModalMembroNovo from '../../../modais/ModalMembroNovo.vue';
import ModalNovoPercurso from '../../../modais/ModalNovoPercurso.vue';
import ModalMembro from '../../../modais/ModalMembros.vue';
import Modal from '../../../modais/NovoRelatorioModal.vue';
import ModalInfoProjeto from '../../../modais/ModalDetalheProjeto.vue';
import { getNomeProjeto, getMembrosProjetos, getPercurso } from '../../../../services.js';


export default {
  components: {
    SvgIcon,
    ModalMembroNovo,
    ModalNovoPercurso,
    ModalMembro,
    Modal,
    ModalInfoProjeto
  },
  props: ['id'],
  data() {
    return {
      projeto: {
        nome: ''
      },
      membros: [],
      percursos: [],
      filtro: {
        nome: '',
        statusAberto: true,
        statusFechado: true,
        statusEspera: true,
        dataInicial: '',
        dataFinal: '',
      },
      mostrarModalInfo: false,
      mostrarModalMembros: false,
      mostrarModalAdicionarMembro: false,
      path: mdiInformationSymbol,
      v: mdiChevronDown,
      plus: mdiPlusThick,
      currentPage: 1,
      itemsPerPage: 7,
      transitionName: 'slide-left',
      userData: {}
    };
  },
  async created() {
    this.userData = JSON.parse(localStorage.getItem('userData')) || {};
    await this.buscarMembrosProjeto();
    await this.fetchPercursos();
    await this.buscarNomeProjeto();
  },
  computed: {
    percursosFiltrados() {
      return this.percursos.filter((percurso) => {
        const nomeMatch = percurso.nome.toLowerCase().includes(this.filtro.nome.toLowerCase());
        const statusMatch =
          (!this.filtro.statusAberto && !this.filtro.statusFechado && !this.filtro.statusEspera) ||
          (this.filtro.statusAberto && percurso.status === 'Aberto') ||
          (this.filtro.statusFechado && percurso.status === 'Fechado') ||
          (this.filtro.statusEspera && percurso.status === 'Em Espera');

        const filtroDataInicial = this.filtro.dataInicial
          ? this.filtro.dataInicial.split('-').reverse().join('-')
          : '';
        const filtroDataFinal = this.filtro.dataFinal
          ? this.filtro.dataFinal.split('-').reverse().join('-')
          : '';

        const dataInicialMatch = !filtroDataInicial || percurso.dataInicial == filtroDataInicial;
        const dataFinalMatch = !filtroDataFinal || percurso.dataFinal == filtroDataFinal;

        return nomeMatch && statusMatch && dataInicialMatch && dataFinalMatch;
      });
    },
    paginatedPercursos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.percursosFiltrados.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.percursosFiltrados.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchPercursos() {
      await getPercurso(this.id)
        .then(response => {
          this.percursos = response.data.map(percurso => ({
              id: percurso.idPercurso,
              nome: percurso.nomePercurso,
              dataInicial: percurso.dataInicio,
              dataFinal: percurso.dataFinal,
              status: percurso.status
          }));
          const percursoAberto = this.percursos.find(percurso => percurso.status === 'Aberto');
          if (percursoAberto) {
          const index = this.percursos.indexOf(percursoAberto);
          if (index !== -1) {
            this.percursos.splice(index, 1);
            this.percursos.unshift(percursoAberto);
          }
          }
        })
        .catch(error => {
          console.error('Erro ao buscar tarefas:', error.message);
        });
    },
    async buscarMembrosProjeto() {
      try {
        const response = await getMembrosProjetos(this.id);
        this.membros = response.data.map(membro => ({
          iniciais: membro.nome.charAt(0)
        })).slice(0, 3);
      } catch (error) {
        console.error('Erro ao buscar membros da equipe:', error.message);
      }
    },
    async buscarNomeProjeto() {
      try {
        const projeto = await getNomeProjeto(this.id);
        this.projeto.nome = projeto.nomeProjeto;
      } catch (error) {
        console.error('Erro ao buscar nome do projeto:', error.message);
      }
    },
    voltar() {
      this.$router.push({ name: 'projetoPagina' });
    },
    abrirModalInfo() {
      this.$refs.modalInfoProjeto.openModal();
    },
    abrirModalMembros() {
      this.$refs.modalMembro.openModal();
    },
    abrirModalAdicionarMembro() {
      this.$refs.modal.openModal();
    },
    openNovoPercursoModal() {
      this.$refs.novoPercurso.openModal();
    },
    openModal() {
      this.$refs.modalRelatorio.openModal();
    },
    entrarPercurso(percurso) {
      this.$router.push({ 
          name: 'DetalhesPercurso', 
          params: { 
              idProjeto: this.id, 
              nomeProjeto: this.projeto.nome,
              idPercurso: percurso.id,
              nomePercurso: percurso.nome,
              idGestor: this.userData.id
          },
      });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
.detalhes-projeto {
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-direction: column;
}
.header {
  margin-left: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.titulos{
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon{
  background-color: #D9D9D9;
  border-radius: 50%;
  cursor: pointer;
}

.usuarios{
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.membros {
  cursor: pointer;
  font-weight: bold;
  display: flex;
  position: relative;
  background-color: #D9D9D9;
  padding: 5px;
  padding-left: 15px;
  border-radius: 50px;
  align-items: center;
  color: #005B51;
}


.membro {
  text-transform: capitalize;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 1px solid #005B51;
  color: #005B51;
}


.btnEntrar{
  background-color: #005B51;
  color: white;
  width: 170px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  height: 30px;
  font-size: 16px;
  font-weight: bold;
}

.btnEntrar:hover {
    background-color: #039A89;
}

.acoes{
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 5px;
  align-items: center;
}

.botoes{
    display: flex;
    margin-left: 90px;
    gap: 30px;
    margin-bottom: 20px;
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

.icomplus{
    height: 36px;
    width: 36px;
}

.info{
    font-size: 17px;
    font-weight: bold;
}


.campoFiltro{
  font-size: 18px;
  font-family: arial;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 759px;
  height: 180px;
}

.filtros {
  background-color: #D9D9D9;
  display: flex;
  gap: 10px;
  flex-direction: column;
  border-radius: 10px;
  padding: 15px;
  height: 100%;
  justify-content: space-evenly;
  width: 90%;
}


.filtros label {
  margin-right: 5px;
}


.filtros input[type="text"]{
  font-size: 16px;
  margin-right: 10px;
  background-color: #B9B9B9;
  border: none;
  border-radius: 10px;
  height: 25px;
  width: 250px;
  padding-left: 5px;
}

.filtros input[type="date"]{
  margin-right: 10px;
  background-color: #B9B9B9;
  border: none;
  border-radius: 10px;
  height: 27px;
  width: 125px;
  padding-left: 10px;
  font-size: 16px;
}

.linha1{
  display: flex;
  justify-content: space-evenly;
}

.campoName{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#nome{
  width: 300px;
}

.campoRadio{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



.grupos{
    /* Define a largura, usa flexbox para organizar o conteúdo em coluna e adiciona margem esquerda */
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 120px;
    font-weight: bold;
    font-size: 18px;
}

.detalhes-projeto .list {
    margin-top: 50px;
    width: 100%;
}

.Entrar{
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

.Entrar:hover {
    background-color: #039A89;
}
.detalhes-projeto table {
    width: 100%;
    border-collapse: collapse;
}
.detalhes-projeto thead th {
    padding-bottom: 10px;
}
.detalhes-projeto tbody td {
    padding: 10px 0;
}
.detalhes-projeto tbody tr {
    background-color: #D9D9D9;
    border: 1px solid #000000;
    border-radius: 10px;
    margin-bottom: 10px;
    height: 53px;
}
.detalhes-projeto .pagination button:hover {
    background-color: #039A89;
}
.detalhes-projeto .pagination {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.detalhes-projeto .pagination button {
    padding: 5px 10px;
    background-color: #005B51;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}
.detalhes-projeto .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
.detalhes-projeto .pagination span {
    align-self: center;
}
.aberto {
  color: green;
}
.fechado {
  color: red;
}
.voltar{
  color: #005B51;
  display: flex;
  height: 35px;
  width: 70px;
  background-color: #D9D9D9;
  border: 1px solid #000000;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
  font-size: 17px;
  font-weight: bold;
}
.voltar:hover {
    background-color: #aeaeaed7;
}
.campoRadio input[type="checkbox"]:checked+label:before {
  background-color: #005B51;
  border: 2px solid #005B51;
}
.campoRadio input[type="checkbox"] {
    /* Esconde o checkbox padrão */
    display: none;
}
.campoRadio input[type="checkbox"]+label {
    /* Estiliza o label dos checkboxes, adicionando preenchimento e cursor de ponteiro */
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    user-select: none;
}
.campoRadio input[type="checkbox"]+label:before {
    /* Estiliza o círculo dos checkboxes não selecionados */
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #B9B9B9;
    background-color: transparent;
}
/* ------------------- */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

</style>