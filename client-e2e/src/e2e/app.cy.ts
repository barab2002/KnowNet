describe('client-e2e smoke', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.get('input#email', { timeout: 15000 }).should('be.visible');
  });

  it('renders the login form', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.get('input#email').should('be.visible').type('e2e-user@knownet.dev');
    cy.get('input#password').should('be.visible').type('password', { log: false });
    cy.contains('button', 'Sign In').should('be.enabled');
  });

  it('allows login and shows the feed header', () => {
    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 }).as('getPosts');
    cy.login('e2e-user@knownet.dev', 'password');
    cy.wait('@getPosts');
    cy.contains('h1', 'Welcome back').should('be.visible');
  });
});
