describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });
  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });
  it('I should be able to mark the book as finished', () => {
    cy.get('input[type="search"]').type('net');

    cy.get('form').submit();

    cy.get('[data-testing="add-item"]:enabled').first().click();

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="finish-read-book-btn"]:enabled').first().click();

    cy.get('[data-testing="finished-reading-date"]').first().should('contain.text', 'Completed reading');

    // removing book from the list
    cy.get('[data-testing="remove-book-btn"]:enabled').last().should('exist').click();

    //closing reading list
    cy.get('[data-testing="close-reading-list"]').click();

    //again add item 
    cy.get('[data-testing="add-item"]:enabled').first().should('exist').click();

    //open the reading list
    cy.get('[data-testing="toggle-reading-list"]').click();

    // For the same book, finish button should be visible
    cy.get('.reading-list-item').last().find('.finish-read-button-icon').should('exist');
  });
});