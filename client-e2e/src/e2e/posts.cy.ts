export {};
const userId = 'user-postsuserknownetdev';

const mockPost = {
  _id: 'post-e2e-1',
  content: 'E2E test post content',
  authorId: { _id: userId, name: 'Posts User' },
  likes: [],
  savedBy: [],
  comments: [],
  userTags: [],
  aiTags: [],
  createdAt: new Date().toISOString(),
};

const mockProfile = {
  _id: userId,
  email: 'posts-user@knownet.dev',
  name: 'Posts User',
  bio: '',
  major: '',
  graduationYear: '',
  profileImageUrl: undefined,
  joinedDate: new Date().toISOString(),
};

describe('posts', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    // Stub posts feed
    cy.intercept('GET', '/api/posts*', { posts: [mockPost], total: 1 }).as('getPosts');
    // Stub profile hydration so AuthContext doesn't fire a real network request
    cy.intercept('GET', `/api/users/${userId}`, mockProfile).as('getProfile');
    cy.login('posts-user@knownet.dev', 'password');
    cy.wait('@getPosts');
  });

  it('renders posts from the feed', () => {
    cy.contains('E2E test post content').should('be.visible');
  });

  it('shows "No posts yet" when feed is empty', () => {
    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 }).as('getEmptyPosts');
    cy.visit('/');
    cy.wait('@getEmptyPosts');
    cy.contains('h3', 'No posts yet').should('be.visible');
  });

  it('can like a post', () => {
    const updatedPost = { ...mockPost, likes: [userId] };
    cy.intercept('POST', '/api/posts/post-e2e-1/like', updatedPost).as('likePost');

    cy.get('[data-testid="post-like-btn"]').first().click();
    cy.wait('@likePost');
  });

  it('can save a post', () => {
    const updatedPost = { ...mockPost, savedBy: [userId] };
    cy.intercept('POST', '/api/posts/post-e2e-1/save', updatedPost).as('savePost');

    cy.get('[data-testid="post-save-btn"]').first().click();
    cy.wait('@savePost');
  });

  it('can delete own post (confirm modal)', () => {
    cy.intercept('DELETE', '/api/posts/post-e2e-1', { statusCode: 200 }).as('deletePost');

    cy.get('[title="Delete Post"]').first().click();
    cy.contains('button', 'Yes, Delete').click();
    cy.wait('@deletePost');
  });

  it('can create a post', () => {
    const newPost = {
      ...mockPost,
      _id: 'post-e2e-new',
      content: 'New post from E2E',
    };
    cy.intercept('POST', '/api/posts', newPost).as('createPost');

    cy.get('[data-testid="rich-text-editor"] [contenteditable="true"]')
      .first()
      .click()
      .type('New post from E2E');
    cy.get('[data-testid="create-post-submit"]')
      .should('not.be.disabled')
      .click();
    cy.wait('@createPost');
  });
});
