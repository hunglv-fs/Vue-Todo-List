describe('Todo List E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds new todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('New todo item{enter}')
    cy.contains('New todo item').should('be.visible')
  })

  it('toggles todo completion', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Toggle test{enter}')
    cy.get('input[type="checkbox"]').first().check()
    cy.get('span').contains('Toggle test').should('have.class', 'line-through')
  })

  it('deletes todo via context menu', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Delete test{enter}')
    cy.get('button').contains('svg').click()
    cy.contains('Delete').click()
    cy.contains('Delete test').should('not.exist')
  })

  it('hides export button when no todos selected', () => {
    cy.get('[data-testid="export-csv"]').should('not.exist')
  })

  it('shows export button when todos selected', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Export test{enter}')
    cy.get('input[type="checkbox"]').first().check()
    cy.get('[data-testid="export-csv"]').should('be.visible')
  })

  it('uses bulk actions', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Bulk test 1{enter}')
    cy.get('input[placeholder="Add a new todo..."]').type('Bulk test 2{enter}')
    
    cy.contains('Select All').click()
    cy.get('[data-testid="export-csv"]').should('be.visible')
    
    cy.contains('Deselect All').click()
    cy.get('[data-testid="export-csv"]').should('not.exist')
  })

  it('exports CSV when button clicked', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('CSV export test{enter}')
    cy.get('input[type="checkbox"]').first().check()
    
    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('mock-url')
      cy.stub(win.document, 'createElement').returns({
        href: '',
        download: '',
        click: cy.stub()
      })
    })
    
    cy.get('[data-testid="export-csv"]').click()
  })
})