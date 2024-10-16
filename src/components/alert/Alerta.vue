<template>
  <div class="alerta" :class="{ 'sucesso': sucesso, 'erro': !sucesso }">
    <p v-html="mensagem"></p> 
    <span class="fechar" @click="$emit('fechar')">X</span>
  </div>
</template>

<script>
export default {
  name: 'AlertaMensagem',
  props: {
    mensagem: String,
    sucesso: Boolean
  },
  mounted() {
    setTimeout(() => {
      this.$emit('fechar');
    }, 5000);
  }
};
</script>

<style scoped>
.alerta {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: fixed;
  top: 20px; /* distance from the top of the screen */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* ensures it's above other elements */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.sucesso {
  background-color: #6fcf97;
}
.erro {
  background-color: #eb5757;
}
.fechar {
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 10px;
}
</style>
