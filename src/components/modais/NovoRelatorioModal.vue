<template>
  <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <h3>Novo Relatório</h3>
      <div class="modal-content">
        <div class="selec">
          <label for="projeto">Projeto:</label>
          <select id="projeto" v-model="selectedProjeto" @change="fetchPercursos" class="custom-select" :disabled="idProj">
            <option value="">Selecione um Projeto</option>
            <option v-for="projeto in projetos" :key="projeto.id" :value="projeto">{{ projeto.nome }}</option>
          </select>
        </div>
        <div class="selec">
          <label for="percurso">Percurso:</label>
          <select id="percurso" v-model="selectedPercurso" :disabled="!selectedProjeto" class="custom-select">
            <option value="">Selecione um Percurso</option>
            <option v-for="percurso in percursos" :key="percurso.id" :value="percurso">{{ percurso.nome }}</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="closeModal" class="btn" id="voltar">Voltar</button>
        <button @click="createReport" class="btn" id="baixar">Baixar</button>
      </div>
    </div>
  </div>
</template>

<script>

import {postRelatorio, getProjetoGestorUsuario, getModalPercurso} from '../../services.js';

export default {
  props: ['usuarioId', 'usuarioNome', 'idProj'],
  data() {
    return {
      isModalOpen: false,
      selectedProjeto: '',
      selectedPercurso: '',
      projetos: [],
      percursos: [],
      nomeRelatorio: ''
    };
  },
  methods: {
    async openModal() {
      this.isModalOpen = true;
      await this.fetchProjetos();
      if (this.idProj) {
        const projetoSelecionado = this.projetos.find(projeto => projeto.id === parseInt(this.idProj));
        if (projetoSelecionado) {
          this.selectedProjeto = projetoSelecionado;
          await this.fetchPercursos();
        } else {
          console.error('Projeto com ID fornecido não encontrado:', this.idProj);
        }
      }
    },
    closeModal() {
      this.$emit('relatorio-fechado');
      this.isModalOpen = false;
    },
    async fetchProjetos() {
      const userId = this.usuarioId;
      try {
        const response = await getProjetoGestorUsuario(userId);
        this.projetos = response.data.map(projeto => ({
          id: projeto.idProjeto,
          nome: projeto.nomeProjeto
        }));
      } catch (error) {
        console.error('Erro ao buscar projetos do usuário gestor:', error.message);
      }
    },
    async fetchPercursos() {
      const projetoId = this.selectedProjeto.id;
      if (projetoId) {
        try {
          const response = await getModalPercurso(projetoId);
          this.percursos = response.data.map(percurso => ({
            id: percurso.idPercurso,
            nome: percurso.nomePercurso
          }));
        } catch (error) {
          console.error('Erro ao buscar percursos do projeto:', error.message);
        }
      } else {
        this.percursos = [];
      }
    },
    async createReport() {
      if (this.selectedProjeto && this.selectedPercurso) {
        const idUsuario = this.usuarioId;
        const idProjeto = this.selectedProjeto.id;
        const nomeRelatorio = `${this.selectedProjeto.nome}-${this.selectedPercurso.nome}`;
        const nomeProjeto = this.selectedProjeto.nome;
        const idPercurso = this.selectedPercurso.id

        try {
          window.open(`https://backorganic.onrender.com/relatorio-Percurso?idProjeto=${idProjeto}&idPercurso=${idPercurso}&nomeProjeto=${encodeURIComponent(nomeRelatorio)}`);

          await postRelatorio( idUsuario, idProjeto, nomeRelatorio, nomeProjeto );

          alert(`Relatório "${nomeRelatorio}" criado com sucesso`);
          this.closeModal();
        } catch (error) {
          console.error('Erro ao criar relatório:', error.message);
          alert('Erro ao criar relatório. Por favor, tente novamente.');
        }
      } else if (this.selectedProjeto) {
        const idUsuario = this.usuarioId;
        const idProjeto = this.selectedProjeto.id;
        const nomeRelatorio = this.selectedProjeto.nome;
        const nomeProjeto = this.selectedProjeto.nome;

        try {
          window.open(`https://backorganic.onrender.com/relatorio?idProjeto=${idProjeto}&nomeProjeto=${encodeURIComponent(nomeRelatorio)}`);

          await postRelatorio( idUsuario, idProjeto, nomeRelatorio, nomeProjeto);

          alert(`Relatório "${nomeRelatorio}" criado com sucesso`);
          this.closeModal();
        } catch (error) {
          console.error('Erro ao criar relatório:', error.message);
          alert('Erro ao criar relatório. Por favor, tente novamente.');
        }
      } else {
        alert('Por favor, selecione um projeto e um percurso.');
      }
    }
  },
};
</script>
  
<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal {
    font-size: 18px;
    font-weight: bold;
    background: #FFFFFF;
    padding: 20px;
    border-radius: 10px;
    width: 600px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .modal-content {
    display: flex;
    margin-bottom: 20px;
    gap: 15px;
    width: 100%;
    justify-content: center;
  }
  .modal-actions {
    width: 93%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 15px;
  }
  .btn {
    font-weight: bold;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 90px;
  }
  .selec{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .custom-select option {
    background-color: #f0f0f0;
    color: #333;
  }
  #projeto{
    font-size: 16px;
    height: 40px;
    width: 250px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #B9B9B9;
  }

  #percurso{
    font-size: 16px;
    height: 40px;
    width: 250px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #B9B9B9;
  }

  #baixar {
    background-color: #008A71;
    color: white;
  }
  #voltar {
    background: #656565;
    color: white;
  }

  #baixar:hover {
    background-color: #039A89;
  }
  #voltar:hover {
    background: #aeaeaed7;
  }

  </style>