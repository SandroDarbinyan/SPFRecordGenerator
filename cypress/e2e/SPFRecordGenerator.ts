import { SPFRecordGeneratorPage } from 'Pages/Platform/Tools/SPF/SPFRecordGeneratorPage';

describe('SPF record generator test', () => {

  const Chance = require('chance');
  const chance = new Chance();
  let validDomainName: string;
  let invalidDomainName: string;
  const validIncludes = ["_spf.google.com", "spf.protection.outlook.com", "mail.zendesk.com", "amazonses.com"];
  validDomainName = chance.domain();
  invalidDomainName = chance.string();

  beforeEach(() => {
    cy.intercept("/tools/spf-record-generator").as("spfRecordGenerator");
    SPFRecordGeneratorPage.visit();
    cy.wait("@spfRecordGenerator");
    SPFRecordGeneratorPage.assertPageHeading();
    cy.url().should("include", SPFRecordGeneratorPage.pageUrl);
  })

  it('Should verify that the page is loaded correctly', () => {

    SPFRecordGeneratorPage.getAnEmbedBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().should("be.visible").and('have.attr', 'placeholder', 'e.g domain.com');

    SPFRecordGeneratorPage.chooseSourceValuesRadioBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.includeInputFiled.getElement().should("be.visible").and('have.attr', 'placeholder', 'Start typing Email Sender name or include value');

    SPFRecordGeneratorPage.deleteBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.includeBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.ipv4Btn.getElement().should("be.visible");

    SPFRecordGeneratorPage.showMoreBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().should("be.visible").and('contain.text', 'SoftFail');

    SPFRecordGeneratorPage.selectFailurePolicyInfoIcon.getElement().should("be.visible");

    SPFRecordGeneratorPage.learnMoreBtn.getElement().should("be.visible");

    SPFRecordGeneratorPage.generateBtn.getElement().should("be.visible").and('be.disabled');

  });

  it('should verify SPF record is being saved correctly with valid domain and valid include value', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[0]);

    // Verifies in case of 'SoftFail' policy
    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().should("be.visible").and('contain.text', 'SoftFail');

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultSectionHeader.getElement().should('contain.text', validDomainName);

    SPFRecordGeneratorPage.resultValidStatus.getElement().contains("Valid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('exist');

    SPFRecordGeneratorPage.resultEmailSenders.getElement().should('have.text', "1")

    SPFRecordGeneratorPage.spfRecordHost.getElement().contains(validDomainName);

    SPFRecordGeneratorPage.spfRecordType.getElement().should("have.text", "TXT")

    SPFRecordGeneratorPage.spfRecordValue.getElement().invoke('text').then((text) => {
        // Clean up the text
        const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
        expect(cleanedText).to.equal('v=spf1 include:_spf.google.com ~all');
      });
  });

  it('should verify that SPF record is being saved correctly in case of valid domain and empty include value and include field shows error', () => {

    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultSectionHeader.getElement().should('contain.text', validDomainName);

    SPFRecordGeneratorPage.resultValidStatus.getElement().contains("Valid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('exist');

    SPFRecordGeneratorPage.resultEmailSenders.getElement().should('have.text', "?")

    SPFRecordGeneratorPage.spfRecordHost.getElement().contains(validDomainName);

    SPFRecordGeneratorPage.spfRecordType.getElement().should("have.text", "TXT")

    SPFRecordGeneratorPage.spfRecordValue.getElement().invoke('text').then((text) => {
        // Clean up the text
        const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
        expect(cleanedText).to.equal('v=spf1  ~all');
      });

    SPFRecordGeneratorPage.includeInputFiled.getElement().should("have.class", "parsley-error")
  });

  it('should verify if domain value is being removed after typing domain and include values Generate button becomes inactive', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[1]);

    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().clear();

    SPFRecordGeneratorPage.generateBtn.getElement().should("be.disabled");
  });

  it('should verify error message is appearing in case of invalid domain name', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(invalidDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[1]);

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.domainFieldErrorMessage.getElement().should('be.visible').and('have.text', "Please provide a valid domain")
  });

  it('should verify that error is being detected correctly when inlcude value is invalid', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(chance.string());

    SPFRecordGeneratorPage.generateBtn.getElement().should('not.be.disabled').click();

    SPFRecordGeneratorPage.resultInvalidStatus.getElement().contains("Invalid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('not.exist');

    SPFRecordGeneratorPage.resultEmailSenders.getElement().should('have.text', "1").and('have.class', 'text-danger');

    SPFRecordGeneratorPage.checkOutErrorBtn.getElement().should('exist').click();

    SPFRecordGeneratorPage.errorContainer.getElement().invoke('text').then((text) => {
      // Clean up the text
      const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
      expect(cleanedText).to.equal('The value in include element should be a valid domain name.');
    });
  });   
  
  it('should verify error message is being shown in case of "None" policy', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[0]);

    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().click();

    SPFRecordGeneratorPage.PolicyOptions.getElement().contains('None').click();

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultInvalidStatus.getElement().contains("Invalid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('not.exist');

    SPFRecordGeneratorPage.checkOutErrorBtn.getElement().should('exist').click();

    SPFRecordGeneratorPage.errorContainer.getElement().invoke('text').then((text) => {
      // Clean up the text
      const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
      expect(cleanedText).to.equal("The 'all' tag is missing from the record which is equivalent to '?all' (neutral) or the absence of an SPF record. Ensure the mechanism is either '-all' (hard fail) or '~all' (soft fail). and update your record.");
    });
  }); 

  it('should verify SPF record is being generated correctly in case of "Fail" policy', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[0]);

    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().click();

    SPFRecordGeneratorPage.PolicyOptions.getElement().contains('Fail').click();

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultValidStatus.getElement().contains("Valid");

    SPFRecordGeneratorPage.resultEmailSenders.getElement().should('have.text', "1")

    SPFRecordGeneratorPage.spfRecordValue.getElement().invoke('text').then((text) => {
      // Clean up the text
      const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
      expect(cleanedText).to.equal('v=spf1 include:_spf.google.com -all');
    });
  }); 

  it('should verify spf record is being generated correctly in case of "Neutral" policy, and warning exists', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[0]);

    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().click();

    SPFRecordGeneratorPage.PolicyOptions.getElement().contains('Neutral').click();

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultValidStatus.getElement().contains("Valid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('exist');

    SPFRecordGeneratorPage.spfRecordValue.getElement().invoke('text').then((text) => {
      // Clean up the text
      const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
      expect(cleanedText).to.equal('v=spf1 include:_spf.google.com ?all');
    });

    SPFRecordGeneratorPage.checkOutErrorBtn.getElement().should('exist').click();
    SPFRecordGeneratorPage.warningContainer.getElement().invoke('text').then((text) => {
      // Clean up the text
      const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
      expect(cleanedText).to.equal("To have maximum security, ensure the mechanism is either '~all' (soft fail) or '-all' (hard fail) and update your record");
    });
  }); 

  it('should verify SPF record is being saved correctly with valid domain and valid multipe include values', () => {
    SPFRecordGeneratorPage.enterYourDomainInputField.getElement().type(validDomainName);
    // Checks that Generate button becomes active
    SPFRecordGeneratorPage.generateBtn.getElement().should("not.be.disabled");

    SPFRecordGeneratorPage.includeInputFiled.getElement().type(validIncludes[0]);

    for(let i = 1; i < validIncludes.length; i++) {
      SPFRecordGeneratorPage.includeBtn.getElement().click();
      SPFRecordGeneratorPage.includeInputFiled.getElement().eq(i).should('exist').type(validIncludes[i]);
    }

    // Verifies in case of 'SoftFail' policy
    SPFRecordGeneratorPage.selectFailurePolicyDropDown.getElement().should("be.visible").and('contain.text', 'SoftFail');

    SPFRecordGeneratorPage.generateBtn.getElement().click();

    SPFRecordGeneratorPage.resultSectionHeader.getElement().should('contain.text', validDomainName);

    SPFRecordGeneratorPage.resultValidStatus.getElement().contains("Valid");

    SPFRecordGeneratorPage.spfRecordConatiner.getElement().should('exist');

    SPFRecordGeneratorPage.resultEmailSenders.getElement().should('have.text', "4")

    SPFRecordGeneratorPage.spfRecordHost.getElement().contains(validDomainName);

    SPFRecordGeneratorPage.spfRecordType.getElement().should("have.text", "TXT")

    SPFRecordGeneratorPage.spfRecordValue.getElement().invoke('text').then((text) => {
        // Clean up the text
        const cleanedText = text.replace(/&nbsp;/g, ' ').trim();
        expect(cleanedText).to.equal('v=spf1 include:_spf.google.com include:spf.protection.outlook.com include:mail.zendesk.com include:amazonses.com ~all');
      });
  });
})