const userId = 'user-commentsuserknownetdev';

const mockPost = {
  _id: 'post-e2e-1',
  content: 'E2E test post content',
  authorId: { _id: userId, name: 'Comments User' },
  likes: [],
  savedBy: [],
  comments: [],
  userTags: [],
  aiTags: [],
  createdAt: new Date().toISOString(),
};

describe('comments', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.intercept('GET', '/api/posts*', { posts: [mockPost], total: 1 }).as('getPosts');
    cy.login('comments-user@knownet.dev', 'password');
    cy.wait('@getPosts');
  });

  it('can open comments section', () => {
    cy.intercept('GET', '/api/posts/post-e2e-1/comments', []).as('getComments');

    cy.get('[data-testid="post-comments-btn"]').first().click();
    cy.wait('@getComments');

    cy.contains('No comments yet').should('be.visible');
  });

  it('can add a comment', () => {
    cy.intercept('GET', '/api/posts/post-e2e-1/comments', []).as('getComments');
    const updatedPost = {
      ...mockPost,
      comments: [
        {
          _id: 'comment-1',
          userId,
          content: 'Great E2E comment!',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    cy.intercept('POST', '/api/posts/post-e2e-1/comment', updatedPost).as('addComment');

    cy.get('[data-testid="post-comments-btn"]').first().click();
    cy.wait('@getComments');

    cy.get('input[placeholder="Write a comment..."]').type('Great E2E comment!');
    cy.contains('button', 'Post').click();
    cy.wait('@addComment');
  });

  it('renders loaded comments', () => {
    const existingComment = {
      _id: 'comment-1',
      userId,
      userName: 'Comments User',
      content: 'This is an existing comment',
      createdAt: new Date().toISOString(),
    };
    cy.intercept('GET', '/api/posts/post-e2e-1/comments', [existingComment]).as('getComments');

    cy.get('[data-testid="post-comments-btn"]').first().click();
    cy.wait('@getComments');

    cy.contains('This is an existing comment').should('be.visible');
  });
});
