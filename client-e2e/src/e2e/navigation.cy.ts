describe('navigation', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);

    const email = 'nav-user@knownet.dev';
    const userId = 'user-' + email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 }).as('getPosts');

    const profile = {
      _id: userId,
      email,
      name: 'Nav User',
      bio: 'Hello from Cypress',
      major: 'Computer Science',
      graduationYear: '2026',
      profileImageUrl: undefined,
      joinedDate: new Date().toISOString(),
      postsCount: 0,
      likesReceived: 0,
      aiSummariesCount: 0,
    };

    cy.intercept('GET', `/api/users/${userId}`, profile).as('getProfile');
    cy.intercept('GET', `/api/posts/user/${userId}/total-likes`, {
      totalLikes: 0,
    }).as('getTotalLikes');
    cy.intercept('GET', `/api/posts/user/${userId}`, []).as('getMyPosts');
    cy.intercept('GET', `/api/posts/liked/${userId}`, []).as('getLikedPosts');
    cy.intercept('GET', `/api/posts/saved/${userId}`, []).as('getSavedPosts');

    cy.login(email, 'password');
    cy.wait('@getPosts');
  });

  it('shows the navbar avatar and navigates to profile', () => {
    cy.get('[data-testid="navbar-profile-link"]').should('be.visible').click();
    cy.location('pathname').should('eq', '/user-profile');
    cy.contains('button', 'Edit Profile').should('be.visible');
  });

  it('navigates to semantic search and settings from sidebar', () => {
    cy.contains('a', 'Search').click();
    cy.location('pathname').should('eq', '/semantic-search');
    cy.contains('h1', 'How can we help you today?').should('be.visible');

    cy.contains('a', 'Settings').click();
    cy.location('pathname').should('eq', '/settings');
    cy.contains('h2', 'Settings').should('be.visible');
  });
});
