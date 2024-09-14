export default class CypressElement {
    innerSelector: string;
  
    parent?: CypressElement;

    get selector(): string {
      return (this.parent?.selector ? `${this.parent?.selector} ` : "") + this.innerSelector;
    }
  
    getElement(): Cypress.Chainable<JQuery<HTMLElement>> {
      return cy.get(this.selector);
    }
  
    shouldBeVisible(visibility = true): void {
      this.getElement().should(`${visibility ? "" : "not."}be.visible`);
    }
  
    constructor(innerSelector: string, parent?: CypressElement) {
      this.innerSelector = innerSelector;
      this.parent = parent;
    }
  }
  