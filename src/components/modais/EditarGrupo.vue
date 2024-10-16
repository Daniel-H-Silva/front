<template>
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3>Editar Grupo</h3>
        <div class="modal-content">
          <div class="campo">
            <label for="nome" class="label">Nome:</label>
            <input class="preencher" type="text" v-model="nomeTabela" maxlength="30" id="nome" required />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeModal" class="btn" id="voltar">Voltar</button>
          <button @click="createReport" class="btn" id="baixar">Criar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {updateGrupo, getNomeGrupo} from '../../services.js';
  
  export default {
    props: ['idProjeto', 'idPercurso'],
    data() {
      return {
        isModalOpen: false,
        nomeTabela: '',
        grupoId: null,
      };
    },
    methods: {
      openModal(idGrupo) {
        this.grupoId = idGrupo; 
        this.isModalOpen = true;
        this.Carregargrupo();
      },
      closeModal() {
        this.$emit('editarGrupo-fechado');
        this.isModalOpen = false;
        this.nomeTabela = '';
      },
      async Carregargrupo() {
        const response = await getNomeGrupo(this.grupoId);
        const quadros = response.data;
        this.nomeTabela = quadros.nomeTabela;
      },
      async createReport() {
        try {
            const response = await updateGrupo(this.grupoId, this.nomeTabela);

            if (response.status === 200) {
            alert('Grupo alterada com sucesso!');
            } else {
            alert('Erro ao alterar grupo.');
            }
        } catch (error) {
            console.error('Erro ao alterar grupo:', error);
            alert('Erro ao alterar grupo.');
        }

        this.closeModal();
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
      width: 500px;
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
    .campo{
        display: flex;
        width: 300px;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 15px;
    }
    .label{
        display: flex;
        margin-bottom: 5px;
        gap: 2px;
    }
    .preencher{
        height: 26px;
        border: solid 1px black;
        border-radius: 10px;
        background-color: #D9D9D9;
        color: black;
        padding-left: 10px;
        font-size: 16px;
        font-family: Arial;
    }
        
    </style>