import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodosStore } from '../todos'

describe('Todos Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a new todo', () => {
    const store = useTodosStore()
    store.addTodo('Test todo')
    
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0]!.text).toBe('Test todo')
    expect(store.todos[0]!.completed).toBe(false)
  })

  it('toggles todo completion', () => {
    const store = useTodosStore()
    store.addTodo('Test todo')
    const todoId = store.todos[0]!.id
    
    store.toggleTodo(todoId)
    expect(store.todos[0]!.completed).toBe(true)
    
    store.toggleTodo(todoId)
    expect(store.todos[0]!.completed).toBe(false)
  })

  it('updates todo text', () => {
    const store = useTodosStore()
    store.addTodo('Original text')
    const todoId = store.todos[0]!.id
    
    store.updateTodo(todoId, 'Updated text')
    expect(store.todos[0]!.text).toBe('Updated text')
  })

  it('deletes a todo', () => {
    const store = useTodosStore()
    store.addTodo('Test todo')
    const todoId = store.todos[0]!.id
    
    store.deleteTodo(todoId)
    expect(store.todos).toHaveLength(0)
  })

  it('computes completed and pending todos', () => {
    const store = useTodosStore()
    store.addTodo('Todo 1')
    store.addTodo('Todo 2')
    store.toggleTodo(store.todos[0]!.id)
    
    expect(store.completedTodos).toHaveLength(1)
    expect(store.pendingTodos).toHaveLength(1)
    expect(store.totalTodos).toBe(2)
  })

  it('handles pagination', () => {
    const store = useTodosStore()
    store.initializeSampleData()
    
    expect(store.totalPages).toBeGreaterThan(1)
    expect(store.paginatedTodos).toHaveLength(10)
    
    store.nextPage()
    expect(store.currentPage).toBe(2)
    
    store.prevPage()
    expect(store.currentPage).toBe(1)
  })

  it('selects all todos', () => {
    const store = useTodosStore()
    store.addTodo('Todo 1')
    store.addTodo('Todo 2')
    store.addTodo('Todo 3')
    
    store.selectAll()
    
    expect(store.completedTodos).toHaveLength(3)
    expect(store.pendingTodos).toHaveLength(0)
    store.todos.forEach(todo => {
      expect(todo.completed).toBe(true)
    })
  })

  it('deselects all todos', () => {
    const store = useTodosStore()
    store.addTodo('Todo 1')
    store.addTodo('Todo 2')
    store.toggleTodo(store.todos[0]!.id)
    store.toggleTodo(store.todos[1]!.id)
    
    store.deselectAll()
    
    expect(store.completedTodos).toHaveLength(0)
    expect(store.pendingTodos).toHaveLength(2)
    store.todos.forEach(todo => {
      expect(todo.completed).toBe(false)
    })
  })

  it('deletes selected todos', () => {
    const store = useTodosStore()
    store.addTodo('Todo 1')
    store.addTodo('Todo 2')
    store.addTodo('Todo 3')
    store.toggleTodo(store.todos[0]!.id)
    store.toggleTodo(store.todos[2]!.id)
    
    store.deleteSelected()
    
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0]!.text).toBe('Todo 2')
    expect(store.completedTodos).toHaveLength(0)
  })
})