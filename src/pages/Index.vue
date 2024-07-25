<template>
  <div class="auth-page">
    <HeaderComponent />
    <div class="form-container">
      <LoginForm v-if="isLogin" @switchToRegister="handleSwitchToRegister" />
      <RegisterForm v-else @switchToLogin="handleSwitchToLogin" />
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import RegisterForm from '@/components/Auth/RegisterForm.vue'

export default {
  name: 'AuthPage',
  components: {
    HeaderComponent,
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      isLogin: true
    }
  },
  methods: {
    handleSwitchToRegister() {
      this.isLogin = false
    },
    handleSwitchToLogin() {
      this.isLogin = true
    }
  }
}
</script>

<style>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0.25rem;
  margin-top: 100px;
}

.form-container {
  display: flex;
  flex-direction: column;
}
</style>
