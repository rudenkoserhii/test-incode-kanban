/// <reference types="cypress" />

describe('issues app', () => {
  beforeEach(() => {
    cy.wait(5000);

    cy.visit('https://issueban.vercel.app/');
    // cy.visit('http://localhost:3000/');
  });

  it('displays no issues items by default', () => {
    cy.get('.ant-list.todo li').should('have.length', 0);
    cy.get('.ant-list.inprogress li').should('have.length', 0);
    cy.get('.ant-list.done li').should('have.length', 0);
  });

  it('displays top rated repos', () => {
    cy.wait(5000);

    cy.get('.ant-dropdown-trigger').trigger('mouseover');
    cy.get('.ant-dropdown-menu-item').should('have.length', 15);
  });

  it('can input repo for issues searching', () => {
    cy.get('.input-one__button').should('have.attr', 'disabled', 'disabled');

    cy.get('.ant-input')
      .type('https://github.com/facebook/react')
      .should('have.value', 'https://github.com/facebook/react');

    cy.get('.input-one__button').should('not.have.attr', 'disabled');

    cy.get('.input-one__button').click();

    cy.get('.ant-input').should('have.value', '');
  });

  it('isuues after searching are present', () => {
    cy.get('.ant-input').type('https://github.com/facebook/react');

    cy.get('.input-one__button').click();

    cy.get('.ant-list.todo li').should('have.length.above', 0);
    cy.get('.ant-list.inprogress li').should('have.length.above', 0);
    cy.get('.ant-list.done li').should('have.length.above', 0);
  });

  it('title with links after searching are present', () => {
    cy.get('.ant-input').type('https://github.com/facebook/react');

    cy.get('.input-one__button').click();

    cy.wait(5000);

    cy.get('.title__text--profile').should('have.text', 'Facebook');
    cy.get('.title__text--repo').should('have.text', 'React');

    cy.get('.title__link--profile').should('have.attr', 'href', 'https://github.com/facebook');
    cy.get('.title__link--repo').should('have.attr', 'href', 'https://github.com/facebook/react');
  });

  it('rote with stars after searching are present', () => {
    cy.get('.ant-input').type('https://github.com/facebook/react');

    cy.get('.input-one__button').click();

    cy.get('.stars').should('contain.text', 'stars');
  });
});
