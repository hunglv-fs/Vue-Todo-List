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
          v-if="todosStore.completedTodos.length > 0"
          @click="exportToCSV"
          data-testid="export-csv"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Export CSV
        </button>
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
        v-for="(todo, index) in todosStore.paginatedTodos"
        :key="todo.id"
        class="relative"
      >
        <!-- Drop zone indicator -->
        <div 
          v-if="dragOverIndex === index && draggedIndex !== null && draggedIndex !== index"
          class="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10"
        ></div>
        
        <div
          @dragover="handleDragOver($event)"
          @drop="handleDrop($event, index)"
          @dragenter="dragOverIndex = index"
          @dragleave="handleDragLeave($event)"
          class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          :class="{ 
            'border-blue-400 bg-blue-50 shadow-md': dragOverIndex === index && draggedIndex !== null,
            'opacity-50 scale-95': draggedIndex === index
          }"
        >
          <!-- Drag handle icon -->
          <div 
            :draggable="true"
            @dragstart="handleDragStart($event, index)"
            class="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
          </div>
          
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

          <!-- Context menu button -->
          <div class="relative">
            <button
              @click="toggleMenu(todo.id)"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
            
            <!-- Context menu -->
            <div
              v-if="activeMenuId === todo.id"
              class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-32"
            >
              <button
                @click="selectTodo(todo.id)"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Select
              </button>
              <button
                @click="startEdit(todo.id, todo.text)"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom drop zone for last position -->
      <div 
        v-if="draggedIndex !== null"
        @dragover="handleDragOver($event)"
        @drop="handleDrop($event, todosStore.paginatedTodos.length)"
        @dragenter="dragOverIndex = todosStore.paginatedTodos.length"
        @dragleave="handleDragLeave($event)"
        class="h-8 flex items-center justify-center border-2 border-dashed border-transparent rounded-lg transition-colors"
        :class="{ 'border-blue-400 bg-blue-50': dragOverIndex === todosStore.paginatedTodos.length }"
      >
        <span v-if="dragOverIndex === todosStore.paginatedTodos.length" class="text-sm text-blue-600 font-medium">
          Drop here to move to end
        </span>
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
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useTodosStore } from '../stores/todos'

const todosStore = useTodosStore()
const newTodoText = ref('')
const editingId = ref<number | null>(null)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const activeMenuId = ref<number | null>(null)

const handleAddTodo = () => {
  if (newTodoText.value.trim()) {
    todosStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}

const startEdit = async (id: number, text: string) => {
  editingId.value = id
  editText.value = text
  await nextTick()
  editInput.value?.focus()
}

const saveEdit = (id: number) => {
  if (editText.value.trim()) {
    todosStore.updateTodo(id, editText.value)
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
}

const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragLeave = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    dragOverIndex.value = null
  }
}

const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault()
  
  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    const actualFromIndex = (todosStore.currentPage - 1) * todosStore.itemsPerPage + draggedIndex.value
    let actualToIndex = (todosStore.currentPage - 1) * todosStore.itemsPerPage + dropIndex
    
    if (dropIndex >= todosStore.paginatedTodos.length) {
      actualToIndex = Math.min(
        (todosStore.currentPage - 1) * todosStore.itemsPerPage + todosStore.paginatedTodos.length - 1,
        todosStore.todos.length - 1
      )
    }
    
    todosStore.reorderTodos(actualFromIndex, actualToIndex)
  }
  
  draggedIndex.value = null
  dragOverIndex.value = null
}

const toggleMenu = (todoId: number) => {
  activeMenuId.value = activeMenuId.value === todoId ? null : todoId
}

const selectTodo = (todoId: number) => {
  todosStore.toggleTodo(todoId)
  activeMenuId.value = null
}

const deleteTodo = (todoId: number) => {
  todosStore.deleteTodo(todoId)
  activeMenuId.value = null
}

const exportToCSV = () => {
  const selectedTodos = todosStore.completedTodos
  if (selectedTodos.length === 0) return

  const headers = ['ID', 'Text', 'Completed', 'Created At']
  const csvContent = [
    headers.join(','),
    ...selectedTodos.map(todo => [
      todo.id,
      `"${todo.text.replace(/"/g, '""')}"`,
      todo.completed,
      todo.createdAt.toISOString()
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `selected-todos-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeMenuId.value = null
  }
}

onMounted(() => {
  todosStore.initializeSampleData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>