<template>
  <div class="todo-container">
    <div class="todo-form">
      <form @submit.prevent="handleSubmit">
        <h2>{{ isEditing ? 'Edit Todo' : 'Add Todo' }}</h2>
        <div class="form-group">
          <input v-model="form.task_title" placeholder="Title" />
        </div>
        <div class="form-group">
          <textarea v-model="form.task_description" placeholder="Description"></textarea>
        </div>
        <div class="form-group">
          <input v-model="form.due_date" type="date" :min="today" placeholder="Due Date" />
        </div>
        <div class="form-group">
          <select v-model="form.status">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="form.priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
        <button v-if="isEditing" @click.prevent="resetForm" class="add-todo-button">
          Add Todo
        </button>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
    <div class="todos">
      <h2>To-do List</h2>
      <TodoItem
        v-for="todo in paginatedTodos"
        :key="todo.id"
        :todo="todo"
        :onDelete="deleteTodo"
        :onEdit="editTodo"
        :onView="viewTodo"
      />
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Task Details</h3>
        <p><strong>Title:</strong> {{ selectedTodo?.task_title }}</p>
        <p><strong>Description:</strong> {{ selectedTodo?.task_description }}</p>
        <p><strong>Due Date:</strong> {{ selectedTodo?.due_date }}</p>
        <p><strong>Status:</strong> {{ selectedTodo?.status }}</p>
        <p><strong>Priority:</strong> {{ selectedTodo?.priority }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import TodoItem from './TodoItem.vue'
import { useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/@types/todo'

export default defineComponent({
  name: 'TodoList',
  components: { TodoItem },
  props: {
    initialTodos: {
      type: Array as () => Todo[],
      required: true
    }
  },
  setup(props) {
    const { todos, addTodo, deleteTodo, updateTodo, error, successMessage, fetchTodos } = useTodos()

    const form = ref<Omit<Todo, 'id'>>({
      task_title: '',
      task_description: '',
      due_date: '',
      status: 'pending',
      priority: 'low'
    })
    const isEditing = ref(false)
    const currentTodoId = ref<number | null>(null)
    const today = computed(() => {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })

    const currentPage = ref(1)
    const itemsPerPage = 5
    const showModal = ref(false)
    const selectedTodo = ref<Todo | null>(null)

    watch(
      () => props.initialTodos,
      (newTodos) => {
        todos.value = newTodos
        currentPage.value = 1
      },
      { immediate: true }
    )

    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }

    const handleSubmit = async () => {
      form.value.due_date = formatDate(form.value.due_date)
      if (isEditing.value) {
        if (currentTodoId.value !== null) {
          await updateTodo(currentTodoId.value, form.value)
        }
      } else {
        await addTodo(form.value)
        resetForm()
      }
      resetForm()
      await fetchTodos()
    }

    const editTodo = (id: number) => {
      const todo = todos.value.find((todo) => todo.id === id)
      if (todo) {
        form.value = { ...todo, due_date: formatDate(todo.due_date) }
        currentTodoId.value = id
        isEditing.value = true
      }
    }

    const viewTodo = (id: number) => {
      const todo = todos.value.find((todo) => todo.id === id)
      if (todo) {
        selectedTodo.value = todo
        showModal.value = true
      }
    }

    const closeModal = () => {
      showModal.value = false
      selectedTodo.value = null
    }

    const resetForm = () => {
      form.value = {
        task_title: '',
        task_description: '',
        due_date: '',
        status: 'pending',
        priority: 'low'
      }
      isEditing.value = false
      currentTodoId.value = null
    }

    const paginatedTodos = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return todos.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(todos.value.length / itemsPerPage)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    return {
      form,
      isEditing,
      handleSubmit,
      deleteTodo,
      editTodo,
      viewTodo,
      error,
      resetForm,
      successMessage,
      today,
      paginatedTodos,
      nextPage,
      previousPage,
      currentPage,
      totalPages,
      showModal,
      selectedTodo,
      closeModal
    }
  }
})
</script>

<style scoped>
.todo-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.todo-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.todo-form h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.todo-form input,
.todo-form textarea,
.todo-form select {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.todo-form input[type='date'] {
  padding: 0.5rem;
}

.todo-form textarea {
  resize: vertical;
}

.todo-form button {
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.todo-form button:hover {
  background-color: #0056b3;
}

.add-todo-button {
  background-color: #28a745;
}

.add-todo-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 1rem;
}

.todos {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>
