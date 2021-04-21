describe("Appointments", () => {
  it("should book an interview", () => {
    cy.visit("/")
      .contains("Monday")
    // 1. Click on the "Add" button in the second appt
    // 2. Enter a name
    // 3. Choose an interviewer
    // 4. Click the save button
    // 5. See a booked appt
  });
  it("should edit an interview", () => {
    cy.visit("/")
      .contains("Monday")
    // 1. Click on the "Edit" button in an existing appt
    // 2. Change the name 
    // 3. Change the interviewer
    // 4. Click the save button
    // 5. See a booked appt

  });
  it("should delete an interview", () => {
    cy.visit("/")
      .contains("Monday")
    // 1. Click on the "Delete" button in an existing appt
    // 2. Click the Confirm button
    // 3. See the slot is empty

  });
});