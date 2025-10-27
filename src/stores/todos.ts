import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Todo interface for type safety
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodosStore = defineStore('todos', () => {
  // State: reactive array of todos
  const todos = ref<Todo[]>([])
  const nextId = ref(1)

  // Action: Add new todo
  const addTodo = (text: string) => {
    if (text.trim()) {
      todos.value.push({
        id: nextId.value++,
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      })
    }
  }

  // Action: Toggle todo completion status
  const toggleTodo = (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  // Action: Update todo text
  const updateTodo = (id: number, newText: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo && newText.trim()) {
      todo.text = newText.trim()
    }
  }

  // Action: Delete todo
  const deleteTodo = (id: number) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  // Getters: Computed properties
  const completedTodos = computed(() => todos.value.filter(t => t.completed))
  const pendingTodos = computed(() => todos.value.filter(t => !t.completed))
  const totalTodos = computed(() => todos.value.length)

  return {
    todos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    completedTodos,
    pendingTodos,
    totalTodos
  }
})