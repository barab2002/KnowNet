export {};
describe('auth — register form validation', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit('/register');
  });

  it('register page renders all fields', () => {
    cy.get('input#name').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('input#confirmPassword').should('be.visible');
    cy.contains('button', 'Create Account').should('be.visible');
  });

  it('shows "Name is required" on empty submit', () => {
    cy.contains('button', 'Create Account').click();
    cy.contains('Name is required').should('be.visible');
  });

  it('shows password length error', () => {
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('abc');
    cy.get('input#confirmPassword').type('abc');
    cy.contains('button', 'Create Account').click();
    cy.contains('at least 6 characters').should('be.visible');
  });

  it('shows "Passwords do not match"', () => {
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('input#confirmPassword').type('differentpassword');
    cy.contains('button', 'Create Account').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('shows email validation error', () => {
    cy.get('input#name').type('Test User');
    cy.get('input#email').type('not-a-valid-email');
    cy.get('input#password').type('password123');
    cy.get('input#confirmPassword').type('password123');
    cy.contains('button', 'Create Account').click();
    cy.contains('valid email').should('be.visible');
  });
});
