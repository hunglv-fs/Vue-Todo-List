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
  
  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

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

  // Action: Initialize with sample data
  const initializeSampleData = () => {
    if (todos.value.length === 0) {
      const sampleTodos = Array.from({ length: 30 }, (_, i) => ({
        id: nextId.value++,
        text: `Sample todo item ${i + 1}`,
        completed: Math.random() > 0.7,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      }))
      todos.value.push(...sampleTodos)
    }
  }

  // Pagination actions
  const setPage = (page: number) => {
    currentPage.value = page
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // Getters: Computed properties
  const completedTodos = computed(() => todos.value.filter(t => t.completed))
  const pendingTodos = computed(() => todos.value.filter(t => !t.completed))
  const totalTodos = computed(() => todos.value.length)
  
  // Pagination getters
  const totalPages = computed(() => Math.ceil(todos.value.length / itemsPerPage.value))
  const paginatedTodos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return todos.value.slice(start, end)
  })

  return {
    todos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    completedTodos,
    pendingTodos,
    totalTodos,
    initializeSampleData,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedTodos,
    setPage,
    nextPage,
    prevPage
  }
})