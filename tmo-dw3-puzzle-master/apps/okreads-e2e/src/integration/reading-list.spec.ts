describe('When: I use the reading list feature', () => {
  let readingItemsCount = 0;
  beforeEach(() => {
    cy.startAt('/');
    readingItemsCount = cy.$$('[data-testing="reading-list-item"]').length;

  });

  it('should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('should be able to add and undo added book from reading list', () => {
    cy.get('input[type="search"]').type('store');
    cy.get('form').submit();
    cy.get('[data-testing="add-item"]:enabled').first().click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingItemsCount + 1);

    //undo add to reading list
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingItemsCount);

  });

  it('should be able to remove and undo removed book from reading list', () => {
    cy.get('input[type="search"]').type('java');
    cy.get('form').submit();
    cy.get('[data-testing="add-item"]:enabled').first().click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-book"]:enabled').first().click();
    cy.get('[data-testing="reading-list-close-cta"]').click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingItemsCount);

    //undo remove from reading list
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', readingItemsCount + 1);
  });
});