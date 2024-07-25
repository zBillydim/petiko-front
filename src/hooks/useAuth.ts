import type { iSignup, iUser, iUserResponse } from '@/@types/api-response'
import { api } from '@/services/api'
import { apiWithAuth } from '@/services/apiWithAuth'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface SignInData {
  email: string
  password: string
}

const getUserData = async (
  userRef: { value: iUser | null },
  isAuthenticatedRef: { value: boolean }
) => {
  const { petiko: token } = parseCookies()
  if (token) {
    try {
      const response = await apiWithAuth.get<iUserResponse>('user')
      if (response.status === 200) {
        userRef.value = response.data.user
        isAuthenticatedRef.value = true
      }
    } catch (error) {
      userRef.value = null
      isAuthenticatedRef.value = false
      console.error('Failed to fetch user data:', error)
    }
  }
}

export function useAuth() {
  const isAuthenticated = ref(false)
  const errors = ref<Record<string, string> | null>(null)
  const user = ref<iUser | null>(null)
  const router = useRouter()

  const signIn = async (data: SignInData) => {
    try {
      const response = await api.post<iUserResponse>('login', data)
      if (response.status === 200) {
        const { token, user: userData } = response.data
        setCookie(undefined, 'petiko', token, { path: '/' })
        await getUserData(user, isAuthenticated)
        router.push('/dashboard')
        console.log('User signed in and data fetched.')
      }
    } catch (error: any) {
      errors.value = error.response?.data || 'An error occurred'
      console.error('Sign-in error:', error)
    }
  }

  const register = async (data: iSignup) => {
    try {
      const { name, email, password } = data
      const response = await api.post<iUserResponse>('register', { name, email, password })
      if (response.status === 201) {
        const { token, user: userData } = response.data
        setCookie(undefined, 'petiko', token, { path: '/' })
        await getUserData(user, isAuthenticated)
        router.push('/dashboard')
      }
    } catch (error: any) {
      errors.value = error.response?.data || 'An error occurred'
      console.error('Sign-in error:', error)
    }
  }

  const logout = () => {
    destroyCookie(undefined, 'petiko')
    user.value = null
    isAuthenticated.value = false
    console.log('User logged out.')
  }

  return {
    user,
    isAuthenticated,
    errors,
    signIn,
    register,
    logout
  }
}
