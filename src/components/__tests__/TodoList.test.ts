import { describe, it, expect, vi } from 'vitest'
import { useTodosStore } from '../../stores/todos'
import { createPinia, setActivePinia } from 'pinia'

describe('TodoList CSV Export', () => {
  it('store shows completed todos correctly', () => {
    setActivePinia(createPinia())
    const store = useTodosStore()
    
    store.addTodo('Test todo')
    store.toggleTodo(1)
    
    expect(store.completedTodos.length).toBe(1)
    expect(store.completedTodos[0].completed).toBe(true)
  })

  it('store hides export when no completed todos', () => {
    setActivePinia(createPinia())
    const store = useTodosStore()
    
    store.addTodo('Test todo')
    
    expect(store.completedTodos.length).toBe(0)
  })

  it('CSV export function works', () => {
    const mockCreateObjectURL = vi.fn(() => 'mock-url')
    const mockClick = vi.fn()
    
    global.URL = { createObjectURL: mockCreateObjectURL, revokeObjectURL: vi.fn() }
    global.document = {
      createElement: () => ({ click: mockClick, href: '', download: '' }),
      body: { appendChild: vi.fn(), removeChild: vi.fn() }
    }

    setActivePinia(createPinia())
    const store = useTodosStore()
    store.addTodo('Test todo')
    store.toggleTodo(1)
    
    const selectedTodos = store.completedTodos
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
    
    expect(csvContent).toContain('Test todo')
    expect(csvContent).toContain('ID,Text,Completed,Created At')
  })
})