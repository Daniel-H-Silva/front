<template>
  <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <h3 class="Titulo">Adicionar Membro</h3>
      <div class="modal-content">
        <div class="form-group">
          <label class="t1" for="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            v-model="filterNome"
            maxlength="40"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label class="t1" for="nome">Email:</label>
          <input
            type="text"
            id="email"
            v-model="filterEmail"
            maxlength="40"
            class="form-control"
          />
        </div>
        <button class="btnPesquisa" @click="searchMembros">
          <SvgIcon class="icon" type="mdi" :path="path" />
        </button>
      </div>
      <div class="grupos">
        <table class="subgrup">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ação</th>
            </tr>
          </thead>
          <transition :name="transitionName" mode="out-in">
            <tbody key="page-{{ currentPage }}" class="list">
              <tr v-for="membro in paginatedMembros" :key="membro.id" class="item">
                <td class="nomeMembro">{{ membro.nome }}</td>
                <td class="email">{{ membro.email }}</td>
                <td>
                  <button
                    v-if="membro.id === userData.id"
                    class="btnGestor"
                  >
                    Gestor
                  </button>
                  <button
                    v-else-if="membroInProjeto(membro.id)"
                    class="btnRemover"
                    @click="confirmRemove(membro)"
                  >
                    Remover
                  </button>
                  <button
                    v-else
                    class="btnAdicionar"
                    @click="AdicionarMembro(membro)"
                  >
                    Adicionar
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedMembros.length === 0">
                <td colspan="3">
                  Nenhum Usuario Encontrado.
                  Refaça a busca!
                </td>
              </tr>
            </tbody>
          </transition>
        </table>
        <div class="pagination" v-if="paginatedMembros.length !== 0">
          <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="closeModal" class="btn" id="voltar">Voltar</button>
      </div>
    </div>
    <!-- Modal de Confirmação -->
    <div v-if="isConfirmModalOpen" class="modal-backdrop" @click.self="closeConfirmModal">
      <div class="modal alteracaoModal">
        <h3 class="Titulo">Confirmação</h3>
        <div class="modal-confirmar">
          <span class="mensagemConfirma">Tem certeza que você quer remover esse membro?</span>
          <span class="mensagem">(Todas as atividades designada a ele será designada ao gestor do projeto)</span>
          <div class="modal-actions">
            <button @click="removeMembro" class="btnRemover">Remover</button>
            <button @click="closeConfirmModal" class="btnCancelar">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiMagnify } from '@mdi/js';
  import {updateTarefaModalDesignado, postMembro, postBuscarMembro, getMembro, removerMembro} from '../../services.js';

  export default {
    props: ['IdProjeto'],
    components:{
      SvgIcon
    },
    data() {
      return {
        isModalOpen: false,
        isConfirmModalOpen: false,
        filterNome: '',
        filterEmail: '',
        membros: [],
        membrosProje: [],
        userData: {},
        currentPage: 1,
        itemsPerPage: 7,
        transitionName: 'slide-left',
        membroToRemove: null,
        path: mdiMagnify,
      };
    },
    computed: {
      paginatedMembros() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.membros.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.membros.length / this.itemsPerPage);
      }
    },
    methods: {
      async openModal() {
        this.userData = JSON.parse(localStorage.getItem('userData')) || {};
        this.isModalOpen = true;
        this.fetchMembros();
        this.fetchMembrosPrimeiraPagi();
      },
      closeModal() {
        this.$emit('adicionarMembro-fechado');
        this.isModalOpen = false;
        this.filterNome= '';
        this.filterEmail= '';
      },
      confirmRemove(membro) {
        this.membroToRemove = membro;
        this.isConfirmModalOpen = true;
      },
      closeConfirmModal() {
        this.isConfirmModalOpen = false;
        this.membroToRemove = null;
        this.fetchMembros();
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.transitionName = 'slide-right';
          this.currentPage--;
        }
      },
      membroInProjeto(id) {
        return this.membrosProje.some(membro => membro.id === id);
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.transitionName = 'slide-left';
          this.currentPage++;
        }
      },
      async removeMembro() {
        if (this.membroToRemove) {
          removerMembro(this.membroToRemove.id)
            .then(async response => {
              console.log('Membro removido:', response);
              await this.alterarTarefas();
              this.closeConfirmModal();
            })
            .catch(error => {
              console.error('Erro ao remover membro:', error.message);
            });
        }
      },
      async alterarTarefas() {
        if (this.membroToRemove) {
          await updateTarefaModalDesignado(this.membroToRemove.id, this.userData.id )
          .then(response => {
            console.log('Tarefas Alteradas:', response);
          })
          .catch(error => {
            console.error('Erro ao alterar tarefas:', error.message);
          });
        }
      },
      async AdicionarMembro(membro) {
        await postMembro( this.IdProjeto, membro.id )
        .then(response => {
          console.log('Usuário adicionado ao projeto:', response.data);
          this.fetchMembros();
        })
        .catch(error => {
          console.error('Erro ao adicionar usuário ao projeto:', error.message);
        });
      },
      async fetchMembros() {
        await getMembro(this.IdProjeto)
          .then(response => {
            this.membrosProje = response.data;
          })
          .catch(error => {
            console.error('Erro ao buscar projetos do usuário:', error.message);
          });
      },
      async searchMembros() {
        if(this.filterNome || this.filterEmail){
          await postBuscarMembro(this.filterNome, this.filterEmail, this.IdProjeto)
          .then(response => {
            this.membros = response.data;
            this.currentPage = 1;
          })
          .catch(error => {
            console.error('Erro ao buscar membros:', error.message);
          });
        }
        else{
          this.fetchMembrosPrimeiraPagi();
        }
      },
      async fetchMembrosPrimeiraPagi() {
        await getMembro(this.IdProjeto)
          .then(response => {
            this.membros = response.data;
          })
          .catch(error => {
            console.error('Erro ao buscar projetos do usuário:', error.message);
          });
      },
    },
  };
</script>


<style scoped>
.modal-backdrop {
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

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Titulo{
  width: 100%;
  display: flex;
}

.modal-content {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  background-color: #D9D9D9;
  border-radius: 10px;
  padding: 10px;
  align-items: flex-end;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
}

.t1{
  display: flex;
  width: 90%;
}

.form-control {
  width: 90%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 10px;
  border: none;
  background-color: #B9B9B9;
  font-size: 16px;
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.btn {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 15px;
  width: 100px;
  height: 35px;
  font-size: 16px;
  font-weight: bold;
}

#voltar {
  background-color: #656565;
  color: white;
  cursor: pointer;
}

.grupos{
  /* Define a largura, usa flexbox para organizar o conteúdo em coluna e adiciona margem esquerda */
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
}

.modal table {
  width: 100%;
  border-collapse: collapse;
}

.modal thead th {
  padding-bottom: 10px;
}

.modal tbody td {
  padding: 10px 0;
}



.modal tbody tr {
  background-color: #D9D9D9;
  border: 1px solid #000000;
  border-radius: 10px;
  margin-bottom: 10px;
  height: 53px;
}

.modal .pagination button:hover {
  background-color: #039A89;
}

.modal .pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal .pagination button {
  padding: 5px 10px;
  background-color: #005B51;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.modal .pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal .pagination span {
  align-self: center;
}

.modal .list {
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

.nomeMembro{
text-transform: capitalize;
}

.btnRemover{
  background-color: #930000;
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

.btnRemover:hover {
  background-color: #5B0000;
}

.btnGestor{
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

.btnAdicionar{
  background-color: #039A89;
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

.btnAdicionar:hover {
  background-color: #005B51;
}

.btnCancelar{
  background-color: #B9B9B9;
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

.btnCancelar:hover{
background-color: #656565;
}

.modal-confirmar{
display: flex;
width: 100%;
flex-direction: column;
font-size: 18px;
}

.alteracaoModal{
width: 550px;
}

.mensagemConfirma{
display: flex;
width: 100%;
}

.mensagem{
display: flex;
width: 100%;
font-size: 16px;
}

.btnPesquisa{
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: solid 1px black;
  height: 38px;
  cursor: pointer;
}

.btnPesquisa:hover{
  background-color: #B9B9B9;
}
</style>