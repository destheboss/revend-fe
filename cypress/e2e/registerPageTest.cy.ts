describe('Register Page', () => {
    beforeEach(() => {
      // Setting up the intercept before visiting the page
      cy.intercept('POST', 'http://localhost:8080/users', {
        statusCode: 201,
        body: {
          userId: 1,
        },
      }).as('registerUser');
    });
  
    it('should register a new user successfully', () => {
      cy.visit('http://localhost:3000/register');
  
      cy.get('[data-testid="first-name"]').type('John');
      cy.get('[data-testid="last-name"]').type('Doe');
      cy.get('[data-testid="email"]').type('john.doe@example.com');
      cy.get('[data-testid="password"]').type('password');
      cy.get('[data-testid="confirm-password"]').type('password');
      // Ensure the file exists in the fixtures folder
      // cy.get('[data-testid="file-input"]').attachFile('profile-picture.jpg'); 
  
      cy.get('[data-testid="register-button"]').click();
  
      cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
  
      // Ensure the user is redirected to the login page
      cy.url().should('include', '/login');
    });
  
    it('should show an error message if passwords do not match', () => {
      cy.visit('http://localhost:3000/register');
  
      cy.get('[data-testid="first-name"]').type('John');
      cy.get('[data-testid="last-name"]').type('Doe');
      cy.get('[data-testid="email"]').type('john.doe@example.com');
      cy.get('[data-testid="password"]').type('password');
      cy.get('[data-testid="confirm-password"]').type('differentpassword');
  
      cy.get('[data-testid="register-button"]').click();
  
      cy.get('[data-testid="error-message"]').should('contain', 'Passwords do not match');
    });
  });