<template>
  <div class="login-form">
    <h2>Login</h2>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" />
        <span class="error" v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" />
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit">Login</button>
    </form>
    <span
      >Não tem uma conta?
      <a @click="switchToRegister">Registre-se</a>
    </span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'

export default defineComponent({
  name: 'LoginForm',
  setup(_, { emit }) {
    const email = ref('')
    const password = ref('')
    const errors = ref<Record<string, any>>({})
    const { signIn } = useAuth()

    const schema = yup.object().shape({
      email: yup.string().email('Email inválido').required('Email é obrigatório'),
      password: yup.string().required('Senha é obrigatória')
    })

    const validate = async () => {
      try {
        await schema.validate(
          { email: email.value, password: password.value },
          { abortEarly: false }
        )
        errors.value = {}
        return true
      } catch (err: any) {
        errors.value = {}
        err.inner.forEach((e: any) => {
          errors.value[e.path] = e.message
        })
        return false
      }
    }

    const handleSubmit = async () => {
      if (await validate()) {
        await signIn({ email: email.value, password: password.value })
      }
    }

    const switchToRegister = () => {
      emit('switchToRegister')
    }

    return {
      email,
      password,
      errors,
      handleSubmit,
      switchToRegister
    }
  }
})
</script>

<style scoped>
.form {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1rem;
}
.login-form {
  border: 1px solid #333;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  align-self: center;
}

@media (max-width: 768px) {
  .login-form {
    padding: 0rem;
  }
}

input {
  min-width: 200px;
  min-height: 25px;
  border-radius: 5px;
}

.form-group {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.error {
  color: red;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
}

a {
  cursor: pointer;
  gap: 1rem;
  color: blue;
  text-align: center;
  margin-top: 15px;
}
</style>
