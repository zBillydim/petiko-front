<template>
  <div class="register-form">
    <h2>Registro</h2>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nome</label>
        <input type="text" id="name" v-model="name" />
        <span class="error" v-if="errors.name">{{ errors.name }}</span>
      </div>
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
      <button type="submit">Registrar</button>
    </form>
    <p @click="switchToLogin">Já tem uma conta? Faça login</p>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'

export default defineComponent({
  name: 'RegisterForm',
  setup(_, { emit }) {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const errors = ref({})
    const { register } = useAuth()
    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email('Email inválido').required('Email é obrigatório'),
      password: yup.string().required('Senha é obrigatória')
    })

    const validate = async () => {
      try {
        await schema.validate(
          { name: name.value, email: email.value, password: password.value },
          { abortEarly: false }
        )
        errors.value = {}
        return true
      } catch (err) {
        errors.value = {}
        err.inner.forEach((e) => {
          errors.value[e.path] = e.message
        })
        return false
      }
    }

    const handleSubmit = async () => {
      if (await validate()) {
        await register({ email: email.value, password: password.value, name: name.value })
      }
    }

    const switchToLogin = () => {
      emit('switchToLogin')
    }

    return {
      name,
      email,
      password,
      errors,
      handleSubmit,
      switchToLogin
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
.register-form {
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
  .register-form {
    padding: 0rem;
  }
}
input {
  min-width: 200px;
  min-height: 25px;
  border-radius: 5px;
}
.form-group {
  gap: 0.5rem;
  padding: 0.25rem;
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

p {
  cursor: pointer;
  color: blue;
  text-align: center;
  margin-top: 15px;
}
</style>
