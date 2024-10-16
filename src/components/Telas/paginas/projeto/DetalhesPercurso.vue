<template>
  <div class="detalhes-projeto">
    <div>
      <div class="header">
        <h2 class="titulos">
          <button @click="voltar" class="voltar">Voltar</button>
          {{ percurso.nome }}
          <SvgIcon type="mdi" :path="path" @click="abrirModalInfo" class="icon"></SvgIcon>
        </h2>
      </div>
      <div class="acoes">
        <div class="botoes">
          <div >
            <button class="btnAcao" @click="openNovaTarefa" :disabled="percurso.status === 'Fechado'" :class="{fechado: percurso.status === 'Fechado' }">
              <div class="plus">
                <SvgIcon class="icomplus" type="mdi" :path="plus" />
              </div>
              <span class="info">Tarefa</span>
            </button>
          </div>
          <div>
            <button class="btnAcao" @click="openModal" :disabled="percurso.status === 'Fechado'" :class="{fechado: percurso.status === 'Fechado' }">
              <div class="plus">
                <SvgIcon class="icomplus" type="mdi" :path="plus"  />
              </div>
              <span class="info">Grupo</span>
            </button>
          </div>
        </div>
        <div class="campoFiltro">
          <label for="nome">Filtros:</label>
          <div class="filtros">
            <div class="linha1">
              <div class="campoName">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" v-model="filtro.nome" @input="aplicarFiltro">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grupos-container">
      <draggable v-model="grupos" group="groups" @end="onEnd" class="grupoBord" >
        <template #item="{ element }">
          <div class="group">
            <h3>
              <span>{{ element.name }}</span>
              <svg-icon type="mdi" :path="edit"  class="edita" @click="openModalEditGrupo(element.id)" />
            </h3>
            <draggable v-model="element.tasks" group="tasks" @end="onEnd">
              <template #item="{ element }">
                <div class="task" v-if="tarefaVisivel(element)">
                  <span class="nomeTarefa">{{ element.name }}</span>
                  <button class="btnEntrar" @click="entraTarefa(element.id)" >Entrar</button>
                </div>
              </template>
            </draggable>
          </div>
        </template>
      </draggable>
    </div>

    <ModalTarefa 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      v-bind:idProjeto="idProjeto"
      v-bind:idPercurso="idPercurso"
      ref="NovaTarefa"
      @NovaTarefa-fechado="buscarGrupos"
    />

    <ModalNovogrupo 
      v-bind:idProjeto="idProjeto"
      v-bind:idPercurso="idPercurso"
      ref="NovoGrupo" 
      @novoGrupo-fechado="buscarGrupos" 
    />
   
    <EditarGrupo 
      v-bind:idProjeto="idProjeto"
      v-bind:idPercurso="idPercurso"
      ref="editar" 
      @editarGrupo-fechado="buscarGrupos" 
    />

    <ModalInfoPercurso 
      v-bind:idPercurso="idPercurso"
      ref="InforPercurso"  
      @InfoPercurso-fechado="buscarNomePercurso"
    />

    <TarefaDetalheModal 
      v-bind:usuarioId="userData.id" 
      v-bind:usuarioNome="userData.nome" 
      :taskId="selectedTaskId" 
      ref="taskDetalhe" 
      @detalhe-fechado="buscarGrupos"
    />

  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiInformationSymbol, mdiPlusThick, mdiPencil } from '@mdi/js';
import draggable from 'vuedraggable';
import ModalTarefa from '../../../modais/ModalTarefaPercurso.vue';
import ModalNovogrupo from '../../../modais/NovoGrupo.vue';
import ModalInfoPercurso from '../../../modais/InforPercurso.vue';
import EditarGrupo from '../../../modais/EditarGrupo.vue';
import TarefaDetalheModal from '../../../modais/ModalDealheTarefa.vue';
import {getGrupos, getTarefasQuadro, getNomePercurso, updateGruposService, updateTarefasService} from '../../../../services.js';

export default {
  components: {
    SvgIcon,
    ModalTarefa,
    ModalNovogrupo,
    ModalInfoPercurso,
    EditarGrupo,
    TarefaDetalheModal,
    draggable
  },
  props: ['idProjeto', 'nomeProjeto', 'idPercurso',  'idGestor'],
  data() {
    return {
      percurso: {
        nome: '',
        status: ''
      },
      filtro: {
        nome: '',
      },
      grupos: [],
      path: mdiInformationSymbol,
      plus: mdiPlusThick,
      edit: mdiPencil,
      userData: {},
      grupoeditado: '',
      selectedTaskId: ''
    };
  },
  async created() {
    this.userData = JSON.parse(localStorage.getItem('userData')) || {};
    await this.buscarNomePercurso();
    await this.buscarGrupos();
  },
  methods: {
    async buscarNomePercurso() {
      try {
        const response = await getNomePercurso(this.idPercurso);
        const percurso = response.data;
        this.percurso.nome = percurso.nomePercurso;
        this.percurso.status = percurso.status;
      } catch (error) {
        console.error('Erro ao buscar nome do projeto PERCURSO:', error.message);
      }
    },
    voltar() {
      if(this.idGestor == this.userData.id){
        this.$router.push({ 
          name: 'DetalhesProjeto', 
          params: { 
            id: this.idProjeto, 
            nomeProjeto: this.nomeProjeto 
          },
        });

      }else{
        this.$router.push({ name: 'projetoPagina' });
      }
    },
    async buscarTarefas(idQuadro) {
      try {
        const response = await getTarefasQuadro(idQuadro);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error.message);
        return [];
      }
    },

    async buscarGrupos() {
      this.selectedTaskId = '';
      try {
        const response = await getGrupos(this.idPercurso);
        const quadros = response.data;

        const grupos = await Promise.all(quadros.map(async (quadro) => {
          const tarefas = await this.buscarTarefas(quadro.idQuadro);
          return {
            id: quadro.idQuadro,
            name: quadro.nomeTabela,
            sequencia: quadro.sequencia,
            tasks: tarefas.map(tarefa => ({
              id: tarefa.idTarefa,
              name: tarefa.nomeTarefa,
              sequencia: tarefa.sequencia
            }))
          };
        }));
        
        this.grupos = grupos;
      } catch (error) {
        console.error('Erro ao buscar grupos:', error.message);
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
    abrirModalInfo() {
      this.$refs.InforPercurso.openModal();
    },
    openNovaTarefa() {
      this.$refs.NovaTarefa.openModal();
    },
    openModal() {
      this.$refs.NovoGrupo.openModal();
    },
    async openModalEditGrupo(idGrupo) {
      this.$refs.editar.openModal(idGrupo);
    },
    async updateTarefas() {
        const updates = [];
        for (const grupo of this.grupos) {
            for (let i = 0; i < grupo.tasks.length; i++) {
                const tarefa = grupo.tasks[i];
                updates.push({
                    idTarefa: tarefa.id,
                    idQuadro: grupo.id,
                    sequencia: i + 1
                });
            }
        }
        try {
            await updateTarefasService(updates);
        } catch (error) {
            console.error('Erro ao atualizar tarefas:', error.message);
        }
    },
    async updateGrupos() {
        const updates = this.grupos.map((grupo, index) => ({
            idQuadro: grupo.id,
            sequencia: index + 1
        }));
        try {
            await updateGruposService(updates);
        } catch (error) {
            console.error('Erro ao atualizar grupos:', error.message);
        }
    },
   async onEnd() {
      if (this.percurso.status === 'Fechado') {
        alert(`Movimentação de tarefas não permitida: Percurso fechado. \nMovimentação não salva!`);
        return;
      }
      else{
        await this.updateTarefas();
        await this.updateGrupos();
      }
    },
    tarefaVisivel(tarefa) {
      const filtroNome = this.filtro.nome.toLowerCase();
      return tarefa.name.toLowerCase().includes(filtroNome);
    }
  },
  watch: {
    'filtro.nome': 'aplicarFiltro'
  }
};
</script>




  
<style scoped>
.detalhes-projeto {
  display: flex;
  width: 90%;
  margin-top: 20px;
  flex-direction: column;
}

.header {
  margin-left: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.titulos {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  background-color: #D9D9D9;
  border-radius: 50%;
  cursor: pointer;
}

.usuarios {
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

.btnEntrar {
  background-color: #005B51;
  color: white;
  width: 90px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}

.btnEntrar:hover {
  background-color: #039A89;
}

.acoes {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.botoes {
  display: flex;
  margin-left: 90px;
  gap: 30px;
  margin-bottom: 20px;
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

.campoFiltro {
  font-size: 18px;
  font-family: arial;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 180px;
  margin-right: 50px;
}

.filtros {
  background-color: #D9D9D9;
  display: flex;
  gap: 10px;
  flex-direction: column;
  border-radius: 10px;
  padding: 15px;
  justify-content: space-evenly;
  width: 90%;
}

.filtros label {
  margin-right: 5px;
}

.filtros input[type="text"] {
  font-size: 16px;
  margin-right: 10px;
  background-color: #B9B9B9;
  border: none;
  border-radius: 10px;
  height: 25px;
  width: 250px;
  padding-left: 5px;
}


.linha1 {
  display: flex;
  justify-content: space-evenly;
}

.campoName {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#nome {
  width: 300px;
}

.grupos-container {
  width: 100%;
  overflow-x: auto;
  display: flex;
}

.group {
  width: 300px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  overflow-y: auto;
  margin-right: 10px;
}

.group h3 {
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task {
  display: flex;
  height: 50px;
  margin-top: 10px;
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
}

.grupoBord {
  height: 510px;
  display: flex;
  margin-left: 15px;
  margin-right: 5px;
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

.edita{
  cursor: pointer;
}

.fechado{
  background-color: #aeaeaed7;
}

.nomeTarefa{
  width: 200px;
}

</style>