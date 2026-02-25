export {};
const searchUserId = 'user-searchuserknownetdev';

const mockSearchPost = {
  _id: 'post-e2e-search-1',
  content: 'E2E semantic search result content',
  authorId: { _id: searchUserId, name: 'Search User' },
  likes: [],
  savedBy: [],
  comments: [],
  userTags: [],
  aiTags: [],
  tags: [],
  createdAt: new Date().toISOString(),
  _score: 0.95,
};

const mockSearchProfile = {
  _id: searchUserId,
  email: 'search-user@knownet.dev',
  name: 'Search User',
  bio: '',
  major: '',
  graduationYear: '',
  profileImageUrl: undefined,
  joinedDate: new Date().toISOString(),
};

describe('semantic search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/posts*', { posts: [], total: 0 }).as('getPosts');
    cy.intercept('GET', `/api/users/${searchUserId}`, mockSearchProfile).as('getProfile');
    cy.intercept('GET', '/api/posts/tags', []).as('getTags');
    cy.login('search-user@knownet.dev', 'password');
    cy.wait('@getPosts');
  });

  it('can search and show no results (stubbed)', () => {
    cy.intercept('GET', '/api/posts/search*', {
      results: [],
      expandedTags: [],
      queryWords: [],
    }).as('search');

    cy.visit('/semantic-search');
    cy.get('[data-testid="semantic-search-input"]').type('study spots{enter}');

    cy.wait('@search');
    cy.contains('h3', 'No results found').should('be.visible');
  });

  it('shows result cards when results returned', () => {
    cy.intercept('GET', '/api/posts/search*', {
      results: [mockSearchPost],
      expandedTags: [],
      queryWords: ['study'],
    }).as('searchWithResults');

    cy.visit('/semantic-search');
    cy.get('[data-testid="semantic-search-input"]').type('study spots{enter}');

    cy.wait('@searchWithResults');
    cy.contains('E2E semantic search result content').should('be.visible');
  });
});
