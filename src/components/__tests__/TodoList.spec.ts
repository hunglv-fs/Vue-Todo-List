import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TodoList from '../TodoList.vue'
import { useTodosStore } from '../../stores/todos'

describe('TodoList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders select all button', () => {
    const wrapper = mount(TodoList)
    const buttons = wrapper.findAll('button')
    const selectAllBtn = buttons.find(btn => btn.text() === 'Select All')
    expect(selectAllBtn).toBeTruthy()
  })

  it('renders deselect all button', () => {
    const wrapper = mount(TodoList)
    const buttons = wrapper.findAll('button')
    const deselectAllBtn = buttons.find(btn => btn.text() === 'Deselect All')
    expect(deselectAllBtn).toBeTruthy()
  })

  it('renders delete selected button', () => {
    const wrapper = mount(TodoList)
    const buttons = wrapper.findAll('button')
    const deleteSelectedBtn = buttons.find(btn => btn.text() === 'Delete Selected')
    expect(deleteSelectedBtn).toBeTruthy()
  })

  it('calls selectAll when select all button is clicked', async () => {
    const wrapper = mount(TodoList)
    const store = useTodosStore()
    store.todos.length = 0 // Clear sample data
    store.addTodo('Test todo')
    await wrapper.vm.$nextTick()
    
    const buttons = wrapper.findAll('button')
    const selectAllBtn = buttons.find(btn => btn.text() === 'Select All')
    await selectAllBtn!.trigger('click')
    
    expect(store.completedTodos).toHaveLength(1)
  })

  it('calls deselectAll when deselect all button is clicked', async () => {
    const wrapper = mount(TodoList)
    const store = useTodosStore()
    store.todos.length = 0 // Clear sample data
    store.addTodo('Test todo')
    store.selectAll()
    await wrapper.vm.$nextTick()
    
    const buttons = wrapper.findAll('button')
    const deselectAllBtn = buttons.find(btn => btn.text() === 'Deselect All')
    await deselectAllBtn!.trigger('click')
    
    expect(store.completedTodos).toHaveLength(0)
  })

  it('calls deleteSelected when delete selected button is clicked', async () => {
    const wrapper = mount(TodoList)
    const store = useTodosStore()
    store.todos.length = 0 // Clear sample data
    store.addTodo('Test todo')
    store.selectAll()
    await wrapper.vm.$nextTick()
    
    const buttons = wrapper.findAll('button')
    const deleteSelectedBtn = buttons.find(btn => btn.text() === 'Delete Selected')
    await deleteSelectedBtn!.trigger('click')
    
    expect(store.todos).toHaveLength(0)
  })

  it('disables delete selected button when no todos are selected', () => {
    const wrapper = mount(TodoList)
    const store = useTodosStore()
    store.addTodo('Test todo')
    
    const buttons = wrapper.findAll('button')
    const deleteSelectedBtn = buttons.find(btn => btn.text() === 'Delete Selected')
    expect(deleteSelectedBtn!.attributes('disabled')).toBeDefined()
  })
})