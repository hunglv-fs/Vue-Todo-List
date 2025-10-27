<template>
  <div class="mx-auto p-6 bg-white rounded-lg shadow-lg" style="max-width: 1000px;">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Todo List</h2>
    
    <!-- Add new todo form -->
    <form @submit.prevent="handleAddTodo" class="mb-6">
      <div class="flex gap-2">
        <input
          v-model="newTodoText"
          type="text"
          placeholder="Add a new todo..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
    </form>

    <!-- Todo statistics and bulk actions -->
    <div class="mb-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Total: {{ todosStore.totalTodos }} | 
        Pending: {{ todosStore.pendingTodos.length }} | 
        Completed: {{ todosStore.completedTodos.length }}
      </div>
      <div class="flex gap-2">
        <button
          @click="todosStore.selectAll()"
          class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Select All
        </button>
        <button
          @click="todosStore.deselectAll()"
          class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Deselect All
        </button>
        <button
          @click="todosStore.deleteSelected()"
          :disabled="todosStore.completedTodos.length === 0"
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Selected
        </button>
      </div>
    </div>

    <!-- Todo items list -->
    <div class="space-y-2">
      <div
        v-for="todo in todosStore.paginatedTodos"
        :key="todo.id"
        class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <!-- Toggle completion checkbox -->
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="todosStore.toggleTodo(todo.id)"
          class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        
        <!-- Todo text (editable or display) -->
        <div class="flex-1">
          <input
            v-if="editingId === todo.id"
            v-model="editText"
            @blur="saveEdit(todo.id)"
            @keyup.enter="saveEdit(todo.id)"
            @keyup.escape="cancelEdit"
            class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref="editInput"
          />
          <span
            v-else
            @dblclick="startEdit(todo.id, todo.text)"
            :class="[
              'cursor-pointer',
              todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
            ]"
          >
            {{ todo.text }}
          </span>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-2">
          <button
            v-if="editingId !== todo.id"
            @click="startEdit(todo.id, todo.text)"
            class="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
          <button
            @click="todosStore.deleteTodo(todo.id)"
            class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="todosStore.totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <button
        @click="todosStore.prevPage()"
        :disabled="todosStore.currentPage === 1"
        class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <span class="px-4 py-1 text-sm text-gray-600">
        Page {{ todosStore.currentPage }} of {{ todosStore.totalPages }}
      </span>
      
      <button
        @click="todosStore.nextPage()"
        :disabled="todosStore.currentPage === todosStore.totalPages"
        class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="todosStore.todos.length === 0" class="text-center py-8 text-gray-500">
      No todos yet. Add one above to get started!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useTodosStore } from '../stores/todos'

// Store instance
const todosStore = useTodosStore()

// Initialize sample data on component mount
onMounted(() => {
  todosStore.initializeSampleData()
})

// Form state
const newTodoText = ref('')

// Edit state
const editingId = ref<number | null>(null)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

// Add new todo
const handleAddTodo = () => {
  if (newTodoText.value.trim()) {
    todosStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}

// Start editing a todo
const startEdit = async (id: number, text: string) => {
  editingId.value = id
  editText.value = text
  await nextTick()
  editInput.value?.focus()
}

// Save edit
const saveEdit = (id: number) => {
  if (editText.value.trim()) {
    todosStore.updateTodo(id, editText.value)
  }
  cancelEdit()
}

// Cancel edit
const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
}
</script>