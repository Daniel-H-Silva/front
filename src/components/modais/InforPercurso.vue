<template>
    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3 class="Titulo">Percurso</h3>
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
                class="form-control imputdata"
                disabled
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
            <button @click="AlterarPercurso" class="btn" id="criar">Alterar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {updatePercurso, getInfoPercurso} from '../../services.js';
  
  export default {
    props: ['idPercurso'],
    data() {
      return {
        isModalOpen: false,
        nome: '',
        dataInicial: '',
        dataFinal: '',
        selectedPercurso: '',
        minDate: new Date().toISOString().split('T')[0],
      };
    },
    methods: {
      async openModal() {
        await this.fechPercurso();
        this.isModalOpen = true;
      },
      closeModal() {
        this.$emit('InfoPercurso-fechado');
        this.isModalOpen = false;
      },
      async fechPercurso() {
        try {
          const response = await getInfoPercurso(this.idPercurso);
          const percurso = response.data;
  
          this.nome = percurso.nomePercurso;
          this.dataInicial = this.formatDate(percurso.dataInicio);
          this.dataFinal = this.formatDate(percurso.dataFinal);
        } catch (error) {
          console.error('Erro ao buscar o percurso:', error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      async AlterarPercurso() {
        try {
            const response = await updatePercurso(this.idPercurso, this.nome, this.dataFinal);

            if (response.status === 200) {
            alert('Percurso alterada com sucesso!');
            } else {
            alert('Erro ao alterar percurso.');
            }
        } catch (error) {
            console.error('Erro ao alterar percurso:', error);
            alert('Erro ao alterar percurso.');
        }

        this.closeModal();
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