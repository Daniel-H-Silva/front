<template>
  <div class="container">
    <img src="../../../assets/10.png" alt="Imagem" >

    <div class="grupo">
      <p><b>{{ userData.nome.toUpperCase() }}</b></p>
      <div class="icon">
        <div class="letra">{{ userData.nome.charAt(0).toUpperCase() }}</div>
      </div>
      <SvgIcon class="logout" type="mdi" :path="path" @click="logout" />
    </div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout } from '@mdi/js';

export default {
  name: 'topBar',
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiLogout,
      userData: {}
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem('userData')) || {};
  },
  methods: {
    logout() {
      localStorage.removeItem('userData');
      localStorage.removeItem('Aba');
      this.$router.push({ path: '/', replace: true });
    }
  }
}
</script>

<style scoped>
.container {
  height: 9%;
  display: flex;
  background: linear-gradient(to right, #005B51, #00C1AC);
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 20px;
  margin-left: 5%;
  color: white;
}
.grupo {
  font-size: 18px;
  margin-right: 5%;
  display: flex;
  color: white;
  gap: 10px;
  align-items: center;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: white;
  color: #005B51;
  font-size: 24px;
  line-height: 45px;
  font-weight: bold;
}
.letra {
  margin-right: 2px;
}
.logout {
  cursor: pointer;
}
</style>