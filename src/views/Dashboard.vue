<template>
  <Navbar/>
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages></ToastMessages>
    <router-view v-if="status"/>
  </div>
</template>

<script>
import emitter from '@/methods/eventBus';
import ToastMessages from '@/components/ToastMessages.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  components: { Navbar, ToastMessages },
  data() {
    return {
      status: false,
    };
  },
  provide() {
    return {
      emitter,
    };
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = `${token}`;
    const api = `${import.meta.env.VITE_API}/api/user/check`;
    this.$http.post(api)
      .then((response) => {
        this.$httpMessageState(response, '登入');
        this.status = true;
      }).catch((error) => {
        this.$router.push('/');
        this.$httpMessageState(error.response, '錯誤訊息');
      });
  },
};
</script>
