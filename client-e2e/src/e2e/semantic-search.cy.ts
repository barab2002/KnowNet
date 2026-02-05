describe('semantic search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 }).as('getPosts');
    cy.login('search-user@knownet.dev', 'password');
    cy.wait('@getPosts');
  });

  it('can search and show no results (stubbed)', () => {
    cy.intercept('GET', '/api/posts/search*', []).as('search');

    cy.visit('/semantic-search');
    cy.get('input[placeholder^="Ask anything"]').type('study spots{enter}');

    cy.wait('@search');
    cy.contains('h3', 'No results found').should('be.visible');
  });
});
