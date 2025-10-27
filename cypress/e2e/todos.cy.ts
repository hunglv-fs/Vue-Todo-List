describe('Todo List', () => {
  beforeEach(() => {
    cy.visit('/todos')
  })

  it('displays todo list page', () => {
    cy.contains('h2', 'Todo List')
    cy.get('input[placeholder="Add a new todo..."]').should('be.visible')
    cy.get('button').contains('Add').should('be.visible')
  })

  it('adds a new todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Learn Cypress')
    cy.get('button').contains('Add').click()
    cy.contains('Learn Cypress').should('be.visible')
    cy.contains('Total: 1').should('be.visible')
  })

  it('toggles todo completion', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Test todo')
    cy.get('button').contains('Add').click()
    
    cy.get('input[type="checkbox"]').click()
    cy.contains('Test todo').should('have.class', 'line-through')
    cy.contains('Completed: 1').should('be.visible')
  })

  it('edits a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Original todo')
    cy.get('button').contains('Add').click()
    
    cy.get('button').contains('Edit').click()
    cy.get('input').last().clear()
    cy.get('input').last().type('Updated todo')
    cy.get('input').last().blur()
    cy.contains('Updated todo').should('be.visible')
  })

  it('deletes a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Todo to delete')
    cy.get('button').contains('Add').click()
    
    cy.get('button').contains('Delete').click()
    cy.contains('Todo to delete').should('not.exist')
    cy.contains('No todos yet').should('be.visible')
  })

  it('manages multiple todos', () => {
    const todos = ['First todo', 'Second todo', 'Third todo']
    
    todos.forEach(todo => {
      cy.get('input[placeholder="Add a new todo..."]').type(todo)
      cy.get('button').contains('Add').click()
    })
    
    cy.contains('Total: 3').should('be.visible')
    cy.get('input[type="checkbox"]').first().click()
    cy.contains('Completed: 1').should('be.visible')
    cy.contains('Pending: 2').should('be.visible')
  })
})
