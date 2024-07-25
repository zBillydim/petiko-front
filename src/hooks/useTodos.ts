import { ref } from 'vue'
import { apiWithAuth } from '@/services/apiWithAuth'
import type { Todo } from '@/@types/todo'

interface CreateTodoData {
  task_title: string
  task_description: string
  due_date: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface UpdateTodoData {
  task_title?: string
  task_description?: string
  due_date?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const fetchTodos = async (page: number = 1) => {
    try {
      const response = await apiWithAuth.get(`task?page=${page}`)
      todos.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
    } catch (err) {
      error.value = 'Failed to fetch todos'
      console.error(err)
    }
  }

  const addTodo = async (todo: CreateTodoData) => {
    try {
      todo.due_date = todo.due_date.replaceAll('-', '/')
      const response = await apiWithAuth.post('task/create', todo)
      todos.value.push({ ...todo, id: response.data.id })
      successMessage.value = response.data.message
    } catch (err) {
      error.value = 'Failed to add todo'
      console.error(err)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await apiWithAuth.delete(`task/${id}`)
      todos.value = todos.value.filter((todo) => todo.id !== id)
      successMessage.value = response.data.message
    } catch (err) {
      error.value = 'Failed to delete todo'
      console.error(err)
    }
  }

  const updateTodo = async (id: number, updatedTodo: UpdateTodoData) => {
    try {
      const response = await apiWithAuth.put(`task/${id}`, updatedTodo)
      const index = todos.value.findIndex((todo) => todo.id === id)
      if (index !== -1) {
        todos.value[index] = { ...todos.value[index], ...updatedTodo }
      }
      successMessage.value = response.data.message
    } catch (err) {
      error.value = 'Failed to update todo'
      console.error(err)
    }
  }

  return {
    todos,
    error,
    successMessage,
    fetchTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    currentPage,
    totalPages
  }
}
