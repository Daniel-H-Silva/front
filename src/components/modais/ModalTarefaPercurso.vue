<template>
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3 class="Titulo">Nova Tarefa</h3>
        <form @submit.prevent="submitForm" class="formulario">
          <div class="campo">
            <label for="nome" class="label">Nome:</label>
            <input class="preencher" type="text" v-model="nome" maxlength="40" id="nome" required />
          </div>
          <div class="campo">
            <label for="informacoes" class="label">Informações da Tarefa:</label>
            <textarea v-model="informacoes" id="informacoes" class="preencher" required></textarea>
          </div>
          <div class="campo2">
            <div>
                <label for="projeto" class="label">Projeto:</label>
                <select v-model="projeto.idProjeto" @change="handleProjectChange" id="projeto" required class="preencher2" disabled>
                    <option v-if="projeto.idProjeto" :value="projeto.idProjeto">{{ projeto.nome }}</option>
                </select>
            </div>
            <div>
                <label for="percurso" class="label">Percurso:</label>
                <select v-model="percurso.idPercurso" disabled id="percurso" required class="preencher2" @change="updateTabelaOptions">
                    <option v-if="percurso.idPercurso" :value="percurso.idPercurso">{{ percurso.nome }}</option>
                </select>
            </div>
            <div>
              <label for="tabela" class="label">Grupo:</label>
              <select v-model="tabela" id="tabela" required class="preencher2">
                <option value="">Selecione uma grupo</option>
                <option v-for="tabela in tabelas" :key="tabela.idQuadro" :value="tabela.idQuadro">{{ tabela.nomeTabela }}</option>
              </select>
            </div>
          </div>
          <div class="campo">
            <label for="designado" class="label1">Designado:</label>
            <label for="designado" @click="designarParaMim" class="designar-label">Designar para mim</label>
            <select v-model="designado" id="designado" required class="preencher3 opção">
              <option value="">Selecione uma pessoa</option>
              <option v-for="pessoa in pessoas" :key="pessoa" :value="pessoa.id" class="opção">{{ pessoa.nome }}</option>
            </select>
          </div>
          <div class="botoes">
            <button type="button" @click="closeModal" class="btn" id="voltar">Cancelar</button>
            <button type="submit" class="btn" id="criar">Criar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  
  import {getMembrosProjet, getGruposQuadro, postTarefa, getNomesPercursos} from '../../services.js';
  
  export default {
    name: 'NovoTarefaModal',
    props: ['usuarioId', 'usuarioNome', 'idProjeto', 'idPercurso'],
    data() {
      return {
        isModalOpen: false,
        nome: '',
        informacoes: '',
        projeto: {
            nome: '',
            idProjeto: null,
            idGestor: null
        },
        percurso: {
            nome: '',
            idPercurso: null
        },
        tabela: '',
        designado: '',
        tabelas: [],
        pessoas: []
      };
    },
    methods: {
      async openModal() {
        this.isModalOpen = true;
        await this.loadTaskDetails();
      },
      closeModal() {
        this.$emit('NovaTarefa-fechado');
        this.isModalOpen = false;
        this.resetForm();
      },
      async loadTaskDetails() {
      try {
        const response = await getNomesPercursos(this.idProjeto, this.idPercurso);
        const taskDetails = response.data;
        this.projeto = {
          nome: taskDetails.nomeProjeto,
          idProjeto: this.idProjeto,
          idGestor: taskDetails.IdGestor
        };
        this.percurso = {
          nome: taskDetails.nomePercurso,
          idPercurso: this.idPercurso
        };
        await this.updateDesignadoOptions(); 
        this.updateTabelaOptions();
      } catch (error) {
        console.error('Erro ao buscar informações do percurso para essa tarefa:', error);
      }
      },
      async updateDesignadoOptions(){
        if (this.projeto.idProjeto) {
          try {
            let isGestor = '';
            if(this.usuarioId === this.projeto.idGestor){
              isGestor = this.usuarioId;
            }
            if (isGestor) {
              const membersResponse = await getMembrosProjet(this.projeto.idProjeto);
              this.pessoas = membersResponse.data.map(member => ({ id: member.id, nome: member.nome }));
            } else {
              this.pessoas = [{ id: this.usuarioId, nome: this.usuarioNome }];
            }
          } catch (error) {
            console.error('Erro ao buscar membros do projeto:', error);
          }
        }
      },
      async updateTabelaOptions() {
        if (this.projeto.idProjeto && this.percurso.idPercurso) {
          try {
            const response = await getGruposQuadro(this.projeto.idProjeto, this.percurso.idPercurso);
            this.tabelas = response.data;
          } catch (error) {
            console.error('Erro ao buscar tabelas do percurso:', error);
          }
        }
      },
      designarParaMim() {
        if (this.pessoas.length > 0) {
          this.designado = this.pessoas[0].id;
        }
      },
      async submitForm() {
        try {
          const response = postTarefa(
            this.nome,
            this.informacoes,
            this.projeto.idProjeto,
            this.percurso.idPercurso,
            this.tabela,
            this.designado
          );
  
          if (response.status === 201) {
            alert('Tarefa criada com sucesso!');
          } else {
            alert('Erro ao criar tarefa.');
          }
        } catch (error) {
          console.error('Erro ao criar tarefa:', error);
          alert('Erro ao criar tarefa.');
        }
        
        this.closeModal();
      },
      resetForm() {
        this.nome = '';
        this.informacoes = '';
        this.projeto = '';
        this.percurso = '';
        this.tabela = '';
        this.designado = '';
      }
    }
  };
</script>
  
  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    display: flex;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 950px;
    flex-direction: column;
    align-items: center;
  }
  
  .Titulo{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  
  .formulario{
    width: 90%;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    align-items: center;
  }
  
  .campo{
    display: flex;
    width: 100%;
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
  
  #informacoes{
    height: 140px;
    padding-top: 5px;
    padding-bottom: 10px;
  }
  
  .Import{
    font-size: 16px;
    font-family: Arial;
  }
  
  .file-list {
    margin-top: 10px;
    background-color: #D9D9D9;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 10px;
    padding-top: 10px;
    border: solid 1px black;
  }
  
  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .file-item button {
    background: #930000;;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    padding: 5px 10px;
  }
  
  .file-limit {
    color: #930000;;
  }
  
  .campo2{
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    gap: 70px;
  }
  
  .preencher2{
    width: 186px;
    height: 35px;
    border: solid 1px black;
    border-radius: 8px;
    background-color: #D9D9D9;
    color: black;
    padding-left: 10px;
    font-size: 16px;
    font-family: Arial;
  }
  
  .label1{
    display: flex;
    margin-bottom: 5px;
    gap: 2px;
    margin-bottom: -10px;
  }
  
  .preencher3{
    height: 35px;
    border: solid 1px black;
    border-radius: 8px;
    background-color: #D9D9D9;
    color: black;
    padding-left: 10px;
    font-size: 16px;
    font-family: Arial;
    width: 50%;
  }
  
  
  .designar-label {
    color: #014341;
    text-decoration: underline;
    cursor: pointer;
    margin-bottom: 5px;
    font-size: 14px;
    display: flex;
    width: 50%;
    justify-content: flex-end;
  }
  
  .designar-label:hover{
    color:#039A89;
  }
  
  .botoes{
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
  .opção{
    text-transform: uppercase;
  }
  
</style>