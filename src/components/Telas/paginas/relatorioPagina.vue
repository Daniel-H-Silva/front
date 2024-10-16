<template>
  <div class="pagi">
    <div class="topGurp">
      <div class="botoes">
        <div>
          <button class="btnAcao" @click="openModal">
            <div class="plus">
              <SvgIcon class="icomplus" type="mdi" :path="plus" />
            </div>
            <span class="info">Relatório</span>
          </button>
        </div>
      </div>
      <div class="Filtro">
        <span>Filtro:</span>
        <div class="filt">
          <div class="filtrocamposSuperior">
            <div class="nome">
              <span>Nome:</span>
              <input type="text" class="filtnome" v-model="filterNome">
            </div>
            <div class="nome">
              <span>Data:</span>
              <input type="date" class="filtdata" v-model="filterData">
            </div>
          </div>
          <div class="filtroInferior">
            <div class="nome">
              <span>Projeto:</span>
              <select class="filtselect" v-model="filterProjetoId">
                <option value="">Todos</option>
                <option v-for="projeto in projetos" :key="projeto.id" :value="projeto.id">{{ projeto.nome }}</option>
              </select>
            </div>
            <button class="btnLimpar" @click="clearFilters">Limpar Filtros</button>
          </div>
        </div>
      </div>
    </div>
    <div class="grupos">
      <h4>Histórico de Relatório:</h4>
      <table class="subgrup">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Projeto</th>
            <th>Data</th>
          </tr>
        </thead>
        <transition :name="transitionName" mode="out-in">
          <tbody key="page-{{ currentPage }}" class="list">
            <tr v-for="relatorio in paginatedRelatorios" :key="relatorio.nome" class="item">
              <td>{{ relatorio.nome }}</td>
              <td :class="fechado">{{ relatorio.projeto.nome }}</td>
              <td>{{ formatDateForDisplay(relatorio.data) }}</td>
            </tr>
            <tr v-if="paginatedRelatorios.length === 0">
              <td colspan="4">Nenhuma relatorio encontrada.</td>
            </tr>
          </tbody>
        </transition>
      </table>
      <div class="pagination" v-if="paginatedRelatorios.length !== 0">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
      </div>
    </div>
    <Modal v-bind:usuarioId="userData.id" v-bind:usuarioNome="userData.nome" ref="modal" @relatorio-fechado="fetchRelatorios"/>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlusThick } from '@mdi/js';
import Modal from '../../modais/NovoRelatorioModal.vue';
import {getProjetoGestorUsuario, getRelatorioUsuario} from '../../../services.js';

export default {
  name: 'RelatorioPagina',
  components: {
    SvgIcon,
    Modal
  },
  data() {
    return {
      plus: mdiPlusThick,
      filterNome: '',
      filterData: '',
      filterProjetoId: '',
      projetos: [],
      relatorios: [],
      currentPage: 1,
      itemsPerPage: 7,
      transitionName: 'slide-left',
      userData: {}
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem('userData')) || {};
    this.fetchRelatorios();
    this.fetchProjetos();
  },
  computed: {
    filteredRelatorios() {
      return this.relatorios.filter(relatorio => {
        const filterNomeMatch = relatorio.nome.toLowerCase().includes(this.filterNome.toLowerCase());
        const filterDataMatch = !this.filterData || this.formatDateForFilter(relatorio.data) === this.filterData;
        const filterProjetoMatch = !this.filterProjetoId || relatorio.projeto.id === this.filterProjetoId;
        return filterNomeMatch && filterDataMatch && filterProjetoMatch;
      });
    },
    paginatedRelatorios() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredRelatorios.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredRelatorios.length / this.itemsPerPage);
    }
  },
  methods: {
    formatDateForDisplay(date) {
      const [day, month, year] = date.split('-');
      return `${day}-${month}-${year}`;
    },
    formatDateForFilter(date) {
      const [day, month, year] = date.split('-');
      return `${year}-${month}-${day}`;
    },
    openModal() {
      this.$refs.modal.openModal();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.transitionName = 'slide-right';
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.transitionName = 'slide-left';
        this.currentPage++;
      }
    },
    clearFilters() {
      this.filterNome = '';
      this.filterData = '';
      this.filterProjetoId = '';
    },
    fetchRelatorios() {
      const userId = this.userData.id;
      getRelatorioUsuario(userId)
        .then(response => {
          this.relatorios = response.data.map(relatorio => ({
            nome: relatorio.nomeRelatorio,
            data: this.formatDateFromDatabase(relatorio.dataRelatorio),
            projeto: relatorio.idProjeto ? { id: relatorio.idProjeto, nome: relatorio.nomeProjeto } : { id: '', nome: '' }
          }));
        })
        .catch(error => {
          console.error('Erro ao buscar relatórios do usuário:', error.message);
        });
    },
    formatDateFromDatabase(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    fetchProjetos() {
      const userId = this.userData.id;
      getProjetoGestorUsuario(userId)
        .then(response => {
          this.projetos = response.data.map(projeto => ({
            id: projeto.idProjeto,
            nome: projeto.nomeProjeto
          }));
        })
        .catch(error => {
          console.error('Erro ao buscar projetos do usuário gestor:', error.message);
        });
    }
  }
};
</script>

<style scoped>
.pagi {
  margin-top: 35px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  font-family: Arial;
}

/* Parte superior */

.topGurp {
  display: flex;
  gap: 50px;
  justify-content: space-evenly;
}

/* Botão */
.botoes {
  display: flex;
  margin-left: 50px;
  gap: 30px;
  margin-bottom: 20px;
}

.filt {
  padding-left: 15px;
  border-radius: 10px;
  height: 158px;
  width: 520px;
  background-color: #D9D9D9;
  border: 1px solid #000000;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}

.btnAcao:hover {
  background-color: #aeaeaed7;
}

.btnAcao {
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

.plus {
  display: flex;
  background-color: white;
  border-radius: 50%;
  height: 65px;
  width: 66px;
  align-items: center;
  justify-content: center;
}

.icomplus {
  height: 36px;
  width: 36px;
}

.info {
  font-size: 17px;
  font-weight: bold;
}

.nome {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.Filtro {
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: bold;
}

.filtnome {
  margin-left: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #B9B9B9;
  width: 300px;
  font-size: 16px;
}

.filtdata {
  margin-left: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #B9B9B9;
  width: 130px;
  font-size: 16px;
  height: 18px;
}

.filtroInferior {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filtselect {
  margin-left: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #B9B9B9;
  width: 230px;
  font-size: 16px;
}

.filtselect option {
  background-color: #f0f0f0;
  color: #333;
}

.btnLimpar {
  padding: 5px 10px;
  background-color: #005B51;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  font-size: 16px;
  height: 40px;
  margin-top: 15px;
  margin-right: 40px;
}

.btnLimpar:hover {
  background-color: #039A89;
}

.checkbox-group {
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.options {
  display: flex;
  gap: 7px;
}

.grupos {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 120px;
  font-weight: bold;
  font-size: 18px;
}

.checkbox-group input[type="checkbox"]:checked+label:before {
  background-color: #005B51;
  border: 2px solid #005B51;
}

.checkbox-group input[type="checkbox"] {
  display: none;
}

.checkbox-group input[type="checkbox"]+label {
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  user-select: none;
}

.checkbox-group input[type="checkbox"]+label:before {
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

.ativo {
  width: 250px;
  margin-left: 22px;
  color: #028E10;
}

.fechado {
  width: 250px;
  margin-left: 23px;
}

.pagi table {
  width: 100%;
  border-collapse: collapse;
}

.pagi thead th {
  padding-bottom: 10px;
}

.pagi tbody td {
  padding: 10px 0;
}

.pagi tbody tr {
  background-color: #D9D9D9;
  border: 1px solid #000000;
  border-radius: 10px;
  margin-bottom: 10px;
  height: 53px;
}

.pagi .pagination button:hover {
  background-color: #039A89;
}

.pagi .pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagi .pagination button {
  padding: 5px 10px;
  background-color: #005B51;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.pagi .pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagi .pagination span {
  align-self: center;
}

.pagi .list {
  margin-top: 50px;
  width: 100%;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-left-leave,
.slide-left-enter-to {
  transform: translateX(0);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-right-leave,
.slide-right-enter-to {
  transform: translateX(0);
}

.btnEntrar {
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

.filtrocamposSuperior {
  display: flex;
  gap: 15px;
}
</style>
