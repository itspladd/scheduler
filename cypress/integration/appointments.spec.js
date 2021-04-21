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
    // 2. Change the name 
    // 3. Change the interviewer
    // 4. Click the save button
    // 5. See a booked appt

  });
  it("should delete an interview", () => {
    // 1. Click on the "Delete" button in an existing appt
    // 2. Click the Confirm button
    // 3. See the slot is empty

  });
});