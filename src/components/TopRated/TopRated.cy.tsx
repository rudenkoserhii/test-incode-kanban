import TopRated from './TopRated';
import { BASE_URL_TOP } from 'constants/constants';

describe('Component TopRated testing', () => {
  it('renders', () => {
    cy.mount(<TopRated />);
  });

  it('fetching', () => {
    cy.mount(<TopRated />);

    cy.intercept('GET', BASE_URL_TOP).as('topRatedFetch');

    cy.wait('@topRatedFetch').then((xhr) => {
      expect(xhr.response?.statusCode).to.equal(200);
    });

    cy.get('.ant-dropdown-trigger').trigger('mouseover');
    cy.get('.ant-dropdown-menu-item').should('have.length', 15);
  });

  //----works only if remove app.message.info(`Link to repo ${spanFirst.toString()} copied to the ClipBoard!`); from TopRated and as second it-test--//
  // it('copying', () => {
  //   cy.mount(<TopRated />);

  //   cy.intercept('GET', BASE_URL_TOP).as('topRatedFetch');

  //   cy.wait('@topRatedFetch').then((xhr) => {
  //     expect(xhr.response?.statusCode).to.equal(200);
  //   });

  //   cy.get('.ant-dropdown-trigger').trigger('mouseover');

  //   const first = cy.get('.ant-dropdown-menu-item').first();
  //   const expectedLink = first.find('span').last().invoke('text');
  //   let link = '';

  //   expectedLink.then((linkText) => {
  //     link = linkText;
  //     cy.contains('.ant-dropdown-menu-item', linkText).click();
  //   });

  //   cy.window().then((win) => {
  //     cy.stub(win, 'confirm').returns(true);
  //   });

  //   cy.window().then(() => {
  //     cy.document().then(() => {
  //       navigator.clipboard.readText().then((clipboardContent) => {
  //         expect(clipboardContent).to.equal(link);
  //       });
  //     });
  //   });
  // });
});
