import CypressElement from "Helpers/CypressElement";

export class SPFRecordGeneratorPage {
    static readonly pageUrl = "/tools/spf-record-generator";
  
    static pageHeading = new CypressElement("h1.text-headline");

    static enterYourDomainInputField = new CypressElement("input#domain");

    static chooseSourceValuesRadioBtn = new CypressElement("label.eas-toggle-switcher");

    static includeInputFiled = new CypressElement("input[data-name='include']");

    static deleteBtn = new CypressElement("div.d-flex div.eas-button");

    static includeBtn = new CypressElement("div.d-lg-flex span[data-option-name='Include']");

    static ipv4Btn = new CypressElement("div.d-lg-flex span[data-option-name='IPv4']");

    static showMoreBtn = new CypressElement("span.show-more-text");

    static showLessBtn = new CypressElement("span.show-less-text");

    static selectFailurePolicyDropDown = new CypressElement("button#dropdownMenuButton");

    static selectFailurePolicyInfoIcon = new CypressElement("div[class*='eas-phishing-url'] span[data-placement='top']");

    static learnMoreBtn = new CypressElement("a[data-target='#faq-section']");

    static generateBtn = new CypressElement("button[class*='submit-form-btn']");

    static getAnEmbedBtn = new CypressElement("a[data-target='#embed-widget-customisation-modal']");

    static resultSectionHeader = new CypressElement("h2.text-headline:first");

    static resultValidStatus = new CypressElement("div.d-flex.row > div:first span.text-success");

    static resultInvalidStatus = new CypressElement("div.d-flex.row > div:first span.text-danger");

    static resultEmailSenders = new CypressElement("div.d-flex.row > div:nth-of-type(3) span[class*='font-weight']");

    static spfRecordHost = new CypressElement("span#spf-host");

    static spfRecordType = new CypressElement("span#spf-type");

    static spfRecordValue = new CypressElement("span#generated-spf-record");

    static domainFieldErrorMessage = new CypressElement("li.parsley-extractDomain");

    static checkOutErrorBtn = new CypressElement("span.text-baby-blue");

    static errorContainer = new CypressElement("div.error-container");

    static warningContainer = new CypressElement("div.warning-container");

    static PolicyOptions = new CypressElement("ul.dropdown-menu li");

    static spfRecordConatiner = new CypressElement("div.block");

    static visit(): void {
       cy.visit(this.pageUrl);
    }
  
    static getPageHeading(): Cypress.Chainable<JQuery<HTMLElement>> {
      return this.pageHeading.getElement();
    }

    static assertPageHeading(): void {
        this.getPageHeading().should("be.visible").and("contain.text", "SPF Record Generator");
      }
  }