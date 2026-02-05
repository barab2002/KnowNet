/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): Chainable<void>;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  const userId = 'user-' + email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const authPayload = {
    user: {
      _id: userId,
      email,
      name: email.split('@')[0] || 'user',
    },
    token: `mock-jwt-token-${Date.now()}`,
  };

  // Seed auth *before* the app bootstraps to avoid the ProtectedRoute redirect race.
  cy.visit('/', {
    onBeforeLoad(win) {
      const auth = JSON.stringify(authPayload);
      win.localStorage.setItem('knownet_remember_me', 'true');
      win.localStorage.setItem('knownet_auth', auth);
      win.sessionStorage.setItem('knownet_auth', auth);
    },
  });

  cy.location('pathname', { timeout: 15000 }).should('eq', '/');

  cy.window({ log: false }).then((win) => {
    const errors = (win as any).__e2eConsoleErrors as string[] | undefined;
    if (errors && errors.length > 0) {
      throw new Error(`Runtime errors detected:\n${errors.slice(0, 10).join('\n')}`);
    }
  });

  cy.window({ log: false }).then((win) => {
    const remember = win.localStorage.getItem('knownet_remember_me');
    const rawAuth = win.localStorage.getItem('knownet_auth');
    expect(remember, 'knownet_remember_me').to.eq('true');
    expect(rawAuth, 'knownet_auth exists').to.be.a('string').and.not.be.empty;
    expect(rawAuth!, 'knownet_auth contains email').to.contain(email);
  });

  cy.get('#root', { timeout: 15000 }).should(($root) => {
    expect($root.children().length, '#root has children').to.be.greaterThan(0);
  });

  cy.contains('p', 'Loading...', { timeout: 15000 }).should('not.exist');

  cy.get('[data-testid="navbar-profile-link"]', { timeout: 15000 }).should(
    'be.visible',
  );
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
