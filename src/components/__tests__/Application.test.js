import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  queryByText,
  getByRole,
  getAllByTestId,
  getAllByRole,
  getByPlaceholderText,
 } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    
    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Crimbleton Scrumbley III")).toBeInTheDocument();
    
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Englebert Humperdinck"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByRole(appointment, "button", {name: /add/i}));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Raandy Johnston" }
    });

    fireEvent.click(getAllByRole(appointment, "button", {name: /interviewer/i})[0]);

    fireEvent.click(getByText(appointment, "Save"))

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Raandy Johnston"));

    expect(queryByText(appointment, "Saving")).not.toBeInTheDocument();

    const mondayNode = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"))

    expect(queryByText(mondayNode, /no spots remaining/i)).toBeInTheDocument();

    const appAfter = render(<Application />)
  })

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Englebert Humperdinck"));
  
    // 3. Click the "Add" button on the first empty appointment.
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    // 5. Click the first interviewer in the list.
    // 6. Click the "Save" button on that same appointment.
    // 7. Check that the element with the text "Saving" is displayed.
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
  });
})

