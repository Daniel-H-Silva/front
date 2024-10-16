<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <form @submit.prevent="alterarProjeto()" class="formulario">
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
          <div class="dados">
            <div class="info">
                <div class="form-info">
                    <label for="gestor">Quantidade de percursos:</label>
                    <input type="text" id="nPercursos" v-model="numeroPercurso" readonly disabled/>
                </div>
                <div class="form-info">
                    <label for="gestor">Numero de membros:</label>
                    <input type="text" id="nMembros" v-model="numeroMembro" readonly disabled />
                </div>
            </div>
            <div class="form-group gest">
                <label for="gestor">Gestor:</label>
                <input type="text" id="gestor" v-model="gestor" readonly disabled/>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn" @click="fecharModal" id="voltar">Voltar</button>
            <button type="submit" class="btn" id="criar" >Alterar</button>
          </div>
        </form>
      </div>
    </div>
</template>
  
<script>
  import {updateProjeto, getInfoProjeto} from '../../services.js';

  export default {
    name: 'NovoProjetoModal',
    props: ['idProjet', 'GestorNome'],
    data() {
      return {
        isOpen: false,
        nome: '',
        objetivo: '',
        informacoes: '',
        gestor: this.GestorNome, 
        numeroPercurso: '',
        numeroMembro: '',
      };
    },
    methods: {
      openModal() {
        this.isOpen = true;
        this.editarProjeto();
      },
      fecharModal() {
        this.isOpen = false;
        this.limparCampos();
        this.$emit('projetoInfo-fechado');
      },
      async editarProjeto() {
        try {
        const response = await getInfoProjeto(this.idProjet);
        const projetoDetalhes = response.data;
        this.nome = projetoDetalhes.nomeProjeto;
        this.objetivo = projetoDetalhes.objetivoProjeto;
        this.informacoes = projetoDetalhes.informacoesProjeto;
        this.numeroPercurso = projetoDetalhes.numPercursos;
        this.numeroMembro = projetoDetalhes.numMembros;
        } catch (error) {
            console.error('Erro ao buscar detalhes da tarefa:', error);
        }
      },
      async alterarProjeto(){
        try {
            const response = await updateProjeto(this.idProjet,
              this.nome,
              this.objetivo,
              this.informacoes
            );

            if (response.status === 200) {
            alert('Projeto alterada com sucesso!');
            } else {
            alert('Erro ao alterar projeto.');
            }
        } catch (error) {
            console.error('Erro ao alterar projeto:', error);
            alert('Erro ao alterar projeto.');
        }

        this.fecharModal();
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
    width: 50%;
    flex-direction: column;
    align-items: center;
  }

  .Titulo{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .formulario{
    margin-top: 14px;
    display: flex;
    width: 90%;
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
    width: 100%;
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

   .form-info{
    gap: 15px;
    display: flex;
    margin-bottom: 15px;
    align-items: center;
    justify-content: space-between;
   }

  .form-info label {
    display: flex;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 18px;
  }

   #nPercursos{
    padding: 8px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: #D9D9D9;
    font-size: 16px;
    width: 50px;
    display: flex;
    text-transform: uppercase;
   }

   #nMembros{
    padding: 8px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: #D9D9D9;
    font-size: 16px;
    width: 50px;
    display: flex;
    text-transform: uppercase;
   }

   .dados{
    display: flex;
    justify-content: space-between;
   }

   .info{
    display: flex;
    flex-direction: column;
   }

   .gest{
    width: 300px;
    margin-right: 20px;
   }

</style>