<template>
  <div class="todo-item">
    <div class="todo-content">
      <span class="todo-title">{{ todo.task_title }}</span>
      <span class="todo-status">{{ todo.status }}</span>
      <span class="todo-priority">{{ todo.priority }}</span>
    </div>
    <div class="todo-actions">
      <button @click="editTodo">Edit</button>
      <button @click="deleteTodo">Delete</button>
      <button @click="viewTodo">View</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Todo } from '@/@types/todo'

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true
    },
    onDelete: {
      type: Function as PropType<(id: number) => Promise<void>>,
      required: true
    },
    onEdit: {
      type: Function as PropType<(id: number) => void>,
      required: true
    },
    onView: {
      type: Function as PropType<(id: number) => void>,
      required: true
    }
  },
  methods: {
    deleteTodo() {
      this.onDelete(this.todo.id)
    },
    editTodo() {
      this.onEdit(this.todo.id)
    },
    viewTodo() {
      this.onView(this.todo.id)
    }
  }
})
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 1rem;
}

.todo-title {
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.todo-status,
.todo-priority {
  color: #666;
}

.todo-actions {
  display: flex;
  flex-direction: column;
}

.todo-actions button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}

.todo-actions button:hover {
  background-color: #0056b3;
}

.todo-actions button:nth-child(2) {
  background-color: #dc3545;
}

.todo-actions button:nth-child(2):hover {
  background-color: #c82333;
}

.todo-actions button:nth-child(3) {
  background-color: #28a745;
}

.todo-actions button:nth-child(3):hover {
  background-color: #218838;
}
</style>
