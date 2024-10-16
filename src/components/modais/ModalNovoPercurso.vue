<template>
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3 class="Titulo">Novo Percurso</h3>
        <div class="modal-content">
          <div class="form-group">
            <label for="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              v-model="nome"
              maxlength="40"
              class="form-control"
            />
          </div>
          <div class="datas">
            <div class="form-group">
              <label for="dataInicial">Data Inicial:</label>
              <input
                type="date"
                id="dataInicial"
                v-model="dataInicial"
                :min="minDate"
                class="form-control imputdata "
              />
            </div>
            <div class="form-group">
              <label for="dataFinal">Data Final:</label>
              <input
                :disabled="!dataInicial"
                type="date"
                id="dataFinal"
                v-model="dataFinal"
                :min="dataInicial"
                class="form-control imputdata"
              />
            </div>
          </div>
        <div class="modal-actions">
          <button @click="closeModal" class="btn" id="voltar">Voltar</button>
          <button @click="createPercurso" class="btn" id="criar">Criar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { postPercurso } from '../../services.js';
  
  export default {
    props: ['IdProjeto'],
    data() {
      return {
        isModalOpen: false,
        nome: '',
        dataInicial: '',
        dataFinal: '',
        clonarPercurso: false,
        selectedPercurso: '',
        minDate: new Date().toISOString().split('T')[0],
      };
    },
    methods: {
      async openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.$emit('novoPercurso-fechado');
        this.isModalOpen = false;
      },
      async createPercurso() {
        const { nome, dataInicial, dataFinal} = this;

        if (!nome || !dataInicial || !dataFinal) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        try {
          await postPercurso(nome, this.IdProjeto, dataInicial, dataFinal);
          alert('Percurso registrado com sucesso.');
          this.closeModal();
        } catch (error) {
          console.error('Erro ao registrar percurso:', error.message);
          alert('Erro ao registrar percurso. Por favor, tente novamente.');
        }
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
    max-width: 400px;
    width: 100%;
  }

  .Titulo{
    display: flex;
  }
  
  .modal-content {
    margin-left: 25px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
    display: flex;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: bold;
  }
  
  .form-control {
    width: 90%;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 10px;
    border: solid 1px black;
    background-color: #D9D9D9;
    font-size: 16px;
  }

  .datas{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 10%;
  }

  .imputdata{
    width: 150px;
  }

  .modal-actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    margin-right: 25px;
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
    cursor: pointer;
  }
  
  #voltar {
    background-color: #656565;
    color: white;
  }
  
  #criar {
    background-color: #008A71;
    color: white;
  }
  </style>