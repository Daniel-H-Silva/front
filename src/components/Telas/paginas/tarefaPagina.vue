<template>
    <div class="pagi">
        <div class="topGurp">
            <div class="botoes">
                <div>
                    <button class="btnAcao" @click="openTaskModal">
                        <div class="plus">
                            <SvgIcon class="icomplus" type="mdi" :path="plus" />
                        </div>
                        <span class="info">Tarefa</span>
                    </button>
                </div>
            </div>
            <div class="Filtro">
                <span>Filtro:</span>
                <div class="filt">
                    <div class="nome">
                        <span class="nomeTarefa" >Nome:</span>
                        <input type="text" class="filtnome" v-model="filterNome">
                    </div>
                    <div class="checkbox-group">
                        <div>Status:</div>
                        <div class="options">
                            <input type="checkbox" id="aberto" value="Aberto" v-model="filterStatus"
                                :disabled="filterStatus.length === 1 && filterStatus[0] === 'Aberto'">
                            <label for="aberto">Aberto</label>
                            <input type="checkbox" id="fechado" value="Fechado" v-model="filterStatus"
                                :disabled="filterStatus.length === 1 && filterStatus[0] === 'Fechado'">
                            <label for="fechado">Fechado</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grupos">
            <h4>Minhas Tarefas:</h4>
            <table class="subgrup">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <transition :name="transitionName" mode="out-in">
                    <tbody key="page-{{ currentPage }}" class="list">
                        <tr v-for="tarefa in paginatedTarefas" :key="tarefa.nome" class="item">
                            <td class="n1">{{ tarefa.nome }}</td>
                            <td :class="{ ativo: tarefa.status === 'Aberto', fechado: tarefa.status === 'Fechado' }">{{ tarefa.status }}</td>
                            <td>
                                <button class="btnEntrar"  @click="entraTarefa(tarefa.id)"  v-if="tarefa.status === 'Aberto'">ENTRAR</button>
                                <button class="btnBloqueado"  v-else>BOQUEADO</button>
                            </td>
                        </tr>
                        <tr v-if="paginatedTarefas.length === 0">
                            <td colspan="3">Nenhuma tarefa encontrada.</td>
                        </tr>
                    </tbody>
                </transition>
            </table>
            <div class="pagination" v-if="paginatedTarefas.length !== 0">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
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
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlusThick } from '@mdi/js';
import NovoTarefaModal from '../../modais/NovoTarefaModal.vue';
import TarefaDetalheModal from '../../modais/ModalDealheTarefa.vue';
import { getTarefasUsuario } from '../../../services.js';

export default {
    name: 'TarefaPagina',
    components: {
        SvgIcon,
        NovoTarefaModal,
        TarefaDetalheModal
    },
    data() {
        return {
            plus: mdiPlusThick,
            filterNome: '',
            filterStatus: ['Aberto', 'Fechado'],
            tarefas: [],
            userData: {},
            currentPage: 1,
            itemsPerPage: 7,
            transitionName: 'slide-left',
            selectedTaskId: ''
        };
    },
    computed: {
        filteredTarefas() {
            return this.tarefas.filter(tarefa => {
                return (
                    (!this.filterNome || tarefa.nome.toLowerCase().includes(this.filterNome.toLowerCase())) &&
                    (this.filterStatus.includes(tarefa.status))
                );
            });
        },
        paginatedTarefas() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.filteredTarefas.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredTarefas.length / this.itemsPerPage);
        }
    },
    methods: {
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
        async entraTarefa(idTarefa) {
            if (idTarefa) {
                this.selectedTaskId = idTarefa;
                await this.$nextTick();
                this.$refs.taskDetalhe.openModal();
            } else {
                console.error("ID da tarefa não fornecido.");
            }
        },
        openTaskModal() {
            this.$refs.taskModal.openModal();
        },
        fetchTarefas() {
            this.selectedTaskId = '';
            const userId = this.userData.id;
            getTarefasUsuario(userId)
                .then(response => {
                    this.tarefas = response.data.map(tarefa => ({
                        id: tarefa.idTarefa,
                        nome: tarefa.nomeTarefa,
                        status: tarefa.status
                    }));
                })
                .catch(error => {
                    console.error('Erro ao buscar tarefas do usuário:', error.message);
                });
        }
    },
    created() {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.fetchTarefas();
    }
};
</script>


<style scoped>
.pagi{
    /* Define margem superior, largura total, e usa flexbox para organizar o conteúdo em coluna */
    margin-top: 35px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
}

/* Parte superior */

.topGurp{
    /* Usa flexbox para organizar o conteúdo com espaçamento igual entre os itens */
    display: flex;
    gap: 50px;
    justify-content: space-evenly;
}

/* Botão */
.botoes {
    /* Organiza os botões com margem e espaçamento entre eles */
    display: flex;
    margin-left: 50px;
    gap: 30px;
    margin-bottom: 20px;
}

.filt{
    /* Estiliza o contêiner de filtro com bordas arredondadas, altura e largura fixas, cor de fundo e borda */
    border-radius: 10px;
    height: 108px;
    width: 650px;
    background-color: #D9D9D9;
    border: 1px solid #000000;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.btnAcao:hover {
    /* Muda a cor de fundo do botão quando o cursor passa por cima */
    background-color: #aeaeaed7;
}

.btnAcao {
    /* Estiliza o botão com cor, dimensões, borda, bordas arredondadas, usa flexbox para centralizar o conteúdo e define o cursor como ponteiro */
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
    /* Estiliza o ícone de adição com cor de fundo, bordas arredondadas e centraliza o conteúdo */
    display: flex;
    background-color: white;
    border-radius: 50%;
    height: 65px;
    width: 66px;
    align-items: center;
    justify-content: center;
}

.icomplus{
    /* Define o tamanho do ícone */
    height: 36px;
    width: 36px;
}
.info{
    /* Define o tamanho e peso da fonte do texto do botão */
    font-size: 17px;
    font-weight: bold;
}

.btnAcao .plus {
    /* Adiciona margem direita ao ícone dentro do botão */
    margin-right: 5px;
}

.nome{
    /* Organiza os elementos do filtro por nome em coluna com espaçamento */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
}

.Filtro {
    /* Estiliza o contêiner de filtro com margens e define a direção da coluna */
    display: flex;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    font-size: 17px;
    font-weight: bold;
}

.filtnome {
    /* Estiliza o campo de input do filtro por nome com margem, preenchimento, borda, cor de fundo e tamanho da fonte */
    margin-left: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #B9B9B9;
    width: 360px;
    font-size: 16px;
}

.checkbox-group {
    /* Organiza os checkboxes em coluna com espaçamento */
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
}

.options{
    /* Organiza os checkboxes horizontalmente com espaçamento entre eles */
    display: flex;
    gap: 7px;
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


.checkbox-group input[type="checkbox"]:checked+label:before {
    /* Estiliza o círculo dos checkboxes quando estão selecionados */
    background-color: #005B51;
    border: 2px solid #005B51;
}


.checkbox-group input[type="checkbox"] {
    /* Esconde o checkbox padrão */
    display: none;
}

.checkbox-group input[type="checkbox"]+label {
    /* Estiliza o label dos checkboxes, adicionando preenchimento e cursor de ponteiro */
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    user-select: none;
}

.checkbox-group input[type="checkbox"]+label:before {
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

.ativo {
    width: 250px;
    margin-left: 22px;
    color: #028E10;
}
.fechado{
    width: 250px;
    margin-left: 23px;
    color: #930000;
}

.pagi table {
    width: 100%;
    border-collapse: collapse; /* Usar 'collapse' é mais comum para tabelas */
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

.pagi .pagination button:hover {
    background-color: #039A89;
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


.n1{
    text-transform: uppercase;
}

.nomeTarefa{
  text-transform: capitalize;
}
</style>