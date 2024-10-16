<template>
    <div class="pagi">
        <div class="topGurp">
            <div class="botoes">
                <div>
                    <button class="btnAcao" @click="openProjetoModal">
                        <div class="plus">
                            <SvgIcon class="icomplus" type="mdi" :path="plus" />
                        </div>
                        <span class="info">Projeto</span>
                    </button>
                </div>
            </div>
            <div class="Filtro">
                <span>Filtro:</span>
                <div class="filt">
                    <div class="nome">
                        <span>Nome do Projeto:</span>
                        <input type="text" class="filtnome" v-model="filterNome">
                    </div>
                    <div class="nome">
                        <span>Nome do Gestor:</span>
                        <input type="text" class="filtnome" v-model="filterGestor">
                    </div>
                </div>
            </div>
        </div>

        <div class="grupos">
            <h4>Projetos:</h4>
            <table class="subgrup">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Gestor</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <transition :name="transitionName" mode="out-in">
                    <tbody key="page-{{ currentPage }}" class="list">
                        <tr v-for="projeto in paginatedProjetos" :key="projeto.idProjeto" class="item">
                            <td class="nomeProjeto">{{ projeto.nomeProjeto }}</td>
                            <td :class="{ ativo: projeto.idGestor === userData.id, fechado: projeto.idGestor !== userData.id }">{{ projeto.nomeGestor }}</td>
                            <td>
                                <button class="btnEntrar" @click="entrarProjeto(projeto)">ENTRAR</button>
                            </td>
                        </tr>
                        <tr v-if="paginatedProjetos.length === 0">
                            <td colspan="3">Nenhum projeto encontrado.</td>
                        </tr>
                    </tbody>
                </transition>
            </table>
            <div class="pagination" v-if="paginatedProjetos.length !== 0">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
            </div>
        </div>
        <NovoProjetoModal v-bind:usuarioId="userData.id" v-bind:usuarioNome="userData.nome" ref="projetoModal" @projeto-fechado="fetchProjetos" />
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlusThick } from '@mdi/js';
import NovoProjetoModal from '../../modais/NovoProjetoModal.vue';
import {getPercursoAberto, getProjetoUsuario} from '../../../services.js';


export default {
    name: 'ProjetoPagina',
    components: {
        SvgIcon,
        NovoProjetoModal
    },
    data() {
        return {
            plus: mdiPlusThick,
            filterNome: '',
            filterGestor: '',
            projetos: [],
            userData: {},
            currentPage: 1,
            itemsPerPage: 7,
            transitionName: 'slide-left'
        };
    },
    created() {
        this.userData = JSON.parse(localStorage.getItem('userData')) || {};
        this.fetchProjetos();
    },
    computed: {
        filteredProjetos() {
            return this.projetos.filter(projeto => {
                return (
                    (!this.filterNome || projeto.nomeProjeto.toLowerCase().includes(this.filterNome.toLowerCase())) &&
                    (!this.filterGestor || projeto.nomeGestor.toLowerCase().includes(this.filterGestor.toLowerCase()))
                );
            });
        },
        paginatedProjetos() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.filteredProjetos.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredProjetos.length / this.itemsPerPage);
        }
    },
    methods: {
        fetchProjetos() {
            const userId = this.userData.id;
            getProjetoUsuario(userId)
                .then(response => {
                    this.projetos = response.data;
                })
                .catch(error => {
                    console.error('Erro ao buscar projetos do usuário:', error.message);
                });
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
        entrarProjeto(projeto) {
            if (projeto && projeto.idProjeto) {
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
        openProjetoModal() {
            this.$refs.projetoModal.openModal();
        }
    },
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
    height: 158px;
    width: 450px;
    background-color: #D9D9D9;
    border: 1px solid #000000;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
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


.ativo {
    width: 250px;
    margin-left: 22px;
    color: #028E10;
    text-transform: uppercase;
}

.fechado{
    width: 250px;
    margin-left: 23px;
    text-transform: uppercase;
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

.nomeProjeto{
  text-transform: uppercase;
}
</style>