describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset")
    cy.visit("/")
      .contains("Monday")
  })
  it("should book an interview", () => {
    // 1. Click on the "Add" button in the second appt
    cy.get("[alt=Add]")
      .first()
      .click()

    // 2. Enter a name
    cy.get('[data-testid=student-name-input]')
      .type('Rosenford Gerald-Krantz III')

    // 3. Choose an interviewer
    cy.get("[alt='Sylvia Palmer']")
      .click()

    // 4. Click the save button
    cy.contains("Save")
      .click()

    // 5. See a booked appt
    cy.contains(".appointment__card--show", "Rosenford Gerald-Krantz III")
      .contains(".appointment__card--show", "Sylvia Palmer")
  });
  it("should edit an interview", () => {
    // 1. Click on the "Edit" button in an existing appt
    cy.contains(".appointment__card--show", "Archie Cohen")
      .get("[alt=Edit]")
      .click({force:true})

    // 2. Change the name 
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type('Smillerton Frunglebuns')

    // 3. Change the interviewer
    cy.get("[alt='Tori Malcolm']")
      .click()

    // 4. Click the save button
    cy.contains("Save")
      .click()

    // 5. See the updated appt
    cy.contains(".appointment__card--show", "Smillerton Frunglebuns")
      .contains(".appointment__card--show", "Tori Malcolm")

  });
  it("should delete an interview", () => {
    // 1. Click on the "Delete" button in an existing appt
    cy.contains(".appointment__card--show", "Archie Cohen")
    .get("[alt=Delete]")
    .click({force:true})

    // 2. Click the Confirm button
    cy.contains("Confirm")
    .click()

    // 3. See the slot is empty
    cy.contains("Deleting")

    cy.contains("Deleting").should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist")
  });
});