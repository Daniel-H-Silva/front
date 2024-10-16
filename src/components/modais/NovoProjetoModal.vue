<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <h3 class="Titulo">Novo Projeto</h3>
        <form @submit.prevent="criarProjeto" class="formulario">
          <div class="form-group">
            <label for="nome">Nome do Projeto:</label>
            <input type="text" id="nome" v-model="nome" required />
          </div>
          <div class="form-group">
            <label for="objetivo">Objetivo do Projeto:</label>
            <textarea id="objetivo" v-model="objetivo" required></textarea>
          </div>
          <div class="form-group">
            <label for="informacoes">Informações do Projeto:</label>
            <textarea id="informacoes" v-model="informacoes" required></textarea>
          </div>
          <div class="form-group">
            <label for="gestor">Gestor:</label>
            <input type="text" id="gestor" v-model="gestor" readonly />
          </div>
          <div class="form-actions">
            <button type="button" class="btn" @click="fecharModal" id="voltar">Voltar</button>
            <button type="submit" class="btn" id="criar" >Criar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import {postProjeto} from '../../services.js';

  export default {
    name: 'NovoProjetoModal',
    props: ['usuarioId', 'usuarioNome'],
    data() {
      return {
        isOpen: false,
        nome: '',
        objetivo: '',
        informacoes: '',
        gestor: this.usuarioNome,
        idUsuario: this.usuarioId
      };
    },
    methods: {
      openModal() {
        this.isOpen = true;
      },
      fecharModal() {
        this.isOpen = false;
        this.limparCampos();
        this.$emit('projeto-fechado');
      },
      async criarProjeto() {
        await postProjeto( this.nome, this.idUsuario, this.objetivo, this.informacoes)
        .then(response => {
          console.log('Projeto criado com sucesso!', response);
          this.fecharModal();
        })
        .catch(error => {
          console.error('Erro ao criar projeto:', error);
        });
      },
      limparCampos() {
        this.nome = '';
        this.objetivo = '';
        this.informacoes = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    display: flex;
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 70%;
    flex-direction: column;
    align-items: center;
  }

  .Titulo{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .formulario{
    display: flex;
    width: 80%;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: flex;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 18px;
  }
  .form-group input,
  .form-group textarea{
    width: 100%;
    padding: 8px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: #D9D9D9;
    font-size: 16px;
  }

  #informacoes{
    height: 150px;
  }

  #gestor{
    width: 40%;
    display: flex;
    text-transform: uppercase;
  }
  
  .form-actions {
    display: flex;
    width: 100%;
    flex-direction: row;
    margin-bottom: 14px;
    justify-content: flex-end;
    margin-right: 15px;
    height: 35px;
    gap: 10px;
  }
  .btn {
    font-weight: bold;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 95px;
    display: flex;
    justify-content: center;
   }

   #criar {
    background-color: #008A71;
    color: white;
   }
   #criar:hover{
    background-color: #039A89;
   }
   #voltar {
    background: #656565;
    color: white;
   }
   #voltar:hover{
    background: #aeaeaed7;
   }
  </style>