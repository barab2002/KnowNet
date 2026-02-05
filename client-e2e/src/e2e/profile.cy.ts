const makeUserId = (email: string) =>
  'user-' + email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

describe('profile', () => {
  it('allows editing profile fields (stubbed backend)', () => {
    const email = 'profile-user@knownet.dev';
    const userId = makeUserId(email);

    const updated = {
      _id: userId,
      email,
      name: 'E2E Updated Name',
      bio: 'Hello from Cypress',
      major: 'Computer Science',
      graduationYear: '2026',
      profileImageUrl: undefined,
      joinedDate: new Date().toISOString(),
      postsCount: 0,
      likesReceived: 0,
      aiSummariesCount: 0,
    };

    cy.viewport(1280, 900);

    // FeedPage request
    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 });

    cy.intercept('GET', `/api/users/${userId}`, updated).as('getProfile');
    cy.intercept('GET', `/api/posts/user/${userId}`, []).as('getMyPosts');
    cy.intercept('GET', `/api/posts/liked/${userId}`, []).as('getLikedPosts');
    cy.intercept('GET', `/api/posts/saved/${userId}`, []).as('getSavedPosts');
    cy.intercept('GET', `/api/posts/user/${userId}/total-likes`, { totalLikes: 0 }).as(
      'getTotalLikes',
    );
    cy.intercept('PUT', `/api/users/${userId}`, updated).as('putProfile');

    cy.login(email, 'password');

    cy.get('[data-testid="navbar-profile-link"]').click();
    cy.location('pathname').should('eq', '/user-profile');

    cy.contains('button', 'Edit Profile').click();
    cy.contains('h2', 'Edit Profile').should('be.visible');

    cy.get('input#name')
      .scrollIntoView()
      .clear({ force: true })
      .type(updated.name, { force: true });
    cy.get('textarea#bio')
      .scrollIntoView()
      .clear({ force: true })
      .type(updated.bio, { force: true });
    cy.get('input#major')
      .scrollIntoView()
      .clear({ force: true })
      .type(updated.major, { force: true });
    cy.get('input#graduationYear')
      .scrollIntoView()
      .clear({ force: true })
      .type(updated.graduationYear, { force: true });

    cy.contains('button', 'Save Changes').click();
    cy.wait('@putProfile');

    cy.wait('@getProfile');
    cy.contains('h2', updated.name).should('be.visible');
  });
});
