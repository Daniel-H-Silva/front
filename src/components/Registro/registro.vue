<template>
  <div class="fundo">
    <div class="imagem-container">
      <img src="../../assets/11.png" alt="Imagem">
      <div class="Login">
        <div class="grupo g1">
          <h1>Registro</h1>
          <p class="label">Preencha os campos abaixo com seus dados de acesso.</p>
        </div>
        <div class="grupo">
          <p class="label">Nome:</p>
          <input class="campo" type="text" v-model="nome">
        </div>
        <div class="grupo">
          <p class="label">Email:</p>
          <input class="campo" type="email" v-model="email">
        </div>
        <div class="grupo">
          <p class="label">Senha:</p>
          <input class="campo" type="password" v-model="senha">
          <p class="senha-requisitos">A senha deve conter pelo menos 1 número, 1 letra maiúscula.</p>
        </div>
        <div class="btns">
          <button @click="voltar" name="Voltar" id="Voltar">Voltar</button>
          <button @click="registrar" name="Criar" id="Criar">Criar Conta</button>
        </div>
      </div>
    </div>
    <AlertaMensagem v-if="mostrarAlerta" :mensagem="mensagemAlerta" :sucesso="sucesso" @fechar="fecharAlerta" />
  </div>
</template>

<script>
import AlertaMensagem from '../alert/Alerta.vue';
import {registerUserService} from '../../services.js'

export default {
  name: 'RegistroPage',
  components: {
    AlertaMensagem
  },
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      mostrarAlerta: false,
      mensagemAlerta: '',
      sucesso: false
    };
  },
  methods: {
    async voltar() {
      this.$router.push({ name: 'Login' });
    },
    async registrar() {
      const validacao = this.validar();
      if (!validacao.sucesso) {
        this.mostrarAlerta = true;
        this.mensagemAlerta = validacao.mensagem;
        this.sucesso = false;
        return;
      }
      try {
        const response = await registerUserService(this.nome, this.email, this.senha);
        console.log(response.data);
        this.nome = '';
        this.email = '';
        this.senha = '';
        this.mostrarAlerta = true;
        this.mensagemAlerta = 'Dados registrados com sucesso';
        this.sucesso = true;
        this.voltar();
      } catch (error) {
        console.error(error);
        this.mostrarAlerta = true;
        this.mensagemAlerta = 'Erro ao registrar usuário';
        this.sucesso = false;
      }
    },
    validar() {
      let mensagem = '';
      if (this.nome.length < 5 || this.nome.length > 50) {
        mensagem += 'O nome deve ter entre 5 e 50 caracteres.<br>';
      }
      if (!this.validarEmail(this.email)) {
        mensagem += 'Email inválido, tente novamente!<br>';
      }
      
      console.log('Senha:', this.senha); 
      if (!this.senha.match(/[A-Z]/)) {
        console.log('A senha não contém letra maiúscula'); 
      }
      if (!this.senha.match(/[0-9]/)) {
        console.log('A senha não contém número'); 
      }
      if (!this.senha.match(/[A-Z]/) || !this.senha.match(/[0-9]/)) {
        mensagem += 'Senha inválida, tente novamente!<br>';
      }

      return {
        sucesso: mensagem === '',
        mensagem: mensagem.trim()
      };
    },
    validarEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    fecharAlerta() {
      this.mostrarAlerta = false;
    }
  }
};
</script>

<style scoped>
.fundo {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  background: linear-gradient(#008A71, #010D1C);
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
}
.Login {
  position: absolute;
  display: flex;
  width: 435px;
  height: 610px;
  border-radius: 15px;
  background-color: aliceblue;
  align-items: center;
  flex-wrap: wrap;
  align-content: baseline;
  justify-content: space-around;
}
.imagem-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.imagem-container img {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.g1 {
  margin-bottom: -15px;
}
.grupo {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
}
.campo {
  width: 100%;
  border-radius: 10px;
  height: 30px;
  box-shadow: none;
  border: solid 1.5px;
  font-size: 18px;
  padding-left: 7px;
}
.senha-requisitos {
  font-size: 12px;
  color: #656565;
  margin-top: 5px;
}
.h1 {
  font-size: 50px;
  font-weight: bold;
}
.label {
  font-size: 20px;
}
.btns {
  margin-top: 25px;
  display: flex;
  align-items: flex-start;
  width: 100%;
  justify-content: space-evenly;
}
#Criar {
  font-weight: bold;
  font-size: 18px;
  width: 140px;
  height: 40px;
  border-radius: 15px;
  box-shadow: none;
  border: none;
  background-color: #008A71;
  color: white;
  cursor: pointer;
}
#Voltar {
  font-size: 18px;
  width: 140px;
  height: 40px;
  border-radius: 15px;
  box-shadow: none;
  border: solid 2px #008A71;
  font-weight: bold;
  color: #008A71;
  cursor: pointer;
}
#Criar:hover {
  background-color: #039A89;
}
</style>