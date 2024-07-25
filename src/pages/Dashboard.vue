<template>
  <div>
    <Header />
    <TodoList :initialTodos="todos" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import TodoList from '@/components/TodoList.vue'
import { apiWithAuth } from '@/services/apiWithAuth'

export default {
  components: {
    Header,
    TodoList
  },
  setup() {
    const todos = ref([])

    onMounted(async () => {
      try {
        const response = await apiWithAuth.get('task')
        todos.value = response.data.data.data
      } catch (error) {
        console.error('Failed to fetch todos:', error)
      }
    })

    return {
      todos
    }
  }
}
</script>
