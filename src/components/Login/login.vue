<template>
  <div class="fundo">
    <div class="imagem-container">
      <img src="../../assets/11.png" alt="Imagem">
      <div class="Login">
        <div class="grupo g1">
          <h1>Login</h1>
          <p class="label">Preencha os campos abaixo com seus dados de acesso.</p>
        </div>
        <div class="grupo">
          <p class="label">Email:</p>
          <input class="campo" type="email" v-model="email">
        </div>
        <div class="grupo">
          <p class="label">Senha:</p>
          <input class="campo" type="password" v-model="senha">
        </div>
        <div class="btns">
          <button @click="login" name="Entrar" id="Entrar">Entrar</button>
          <button @click="criarConta" name="Criar" id="Criar">Criar Conta</button>
        </div>
      </div>
    </div>
    <AlertaMensagem v-if="mostrarAlerta" :mensagem="mensagemAlerta" :sucesso="false" @fechar="fecharAlerta" />
  </div>
</template>

<script>
import AlertaMensagem from '../alert/Alerta.vue';
import {login} from '../../services.js'

export default {
  name: 'LoginInit',
  components: {
    AlertaMensagem
  },
  data() {
    return {
      email: '',
      senha: '',
      mostrarAlerta: false,
      mensagemAlerta: ''
    };
  },
  methods: {
    async login() {
      try {
        const userData = await login(this.email, this.senha);
        localStorage.setItem('userData', JSON.stringify(userData));
        this.$router.push({ name: 'Home' });
      } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        this.mostrarAlerta = true;
        this.mensagemAlerta = 'Erro ao tentar realizar o login, confira as informações de email e senha e tente novamente!';
      }
    },
    criarConta() {
      this.$router.push({ name: 'Registro' });
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
  justify-content: center;
  align-items: center;
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

.Login {
  position: absolute;
  width: 435px;
  height: 560px;
  border-radius: 15px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: baseline;
  justify-content: space-around;
}

.grupo {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
}

.campo {
  width: 100%;
  border-radius: 15px;
  height: 30px;
  box-shadow: none;
  border: solid 1.5px;
  font-size: 18px;
  padding-left: 7px;
}

.h1 {
  font-size: 50px;
  font-weight: bold;
}

.label {
  font-size: 20px;
}

.btns {
  margin-bottom: 50px;
  margin-top: 50px;
  display: flex;
  align-items: flex-start;
  width: 100%;
  justify-content: space-evenly;
}

#Entrar {
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

#Entrar:hover {
  background-color: #039A89;
}

#Criar {
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
</style>