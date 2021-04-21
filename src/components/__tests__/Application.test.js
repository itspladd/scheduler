import React from "react";
import axios from "../../__mocks__/axios";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  queryByText,
  queryByAltText,
  getByRole,
  getByAltText,
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
    const { container } = render(<Application />);
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
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Raandy Johnston" is displayed.
    await waitForElement(() => getByText(container, "Raandy Johnston"));

    // 3. Save a booked appt
    const appointment = getAllByTestId(container, "appointment")
      .find(appt => queryByText(appt, "Raandy Johnston"));

    // 4. Click the "Delete" button on the appt
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 5. Check that the confirm message is shown
    expect(getByText(appointment, /Are you sure you want to delete?/i)).toBeInTheDocument();

    // 6. Click the confirm button on the confirmation window
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 8. Wait until the "Add" button is displayed
    await waitForElement(() => getByRole(appointment, "button", {name: /add/i}));
    expect(queryByText(container, "Raandy Johnston")).toBeNull();

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const mondayNode = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"))
    expect(queryByText(mondayNode, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Englebert Humperdinck" is displayed and save it.
    const appointment = await waitForElement(() => {
      return getAllByTestId(container, "appointment")
        .find(appt => queryByText(appt, "Englebert Humperdinck"))
    });

    // 3. Click the edit button
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Confirm that the name shows up in the form field
    const form = getByPlaceholderText(appointment, "Enter Student Name");

    // 5. Change the name
    fireEvent.change(form, {
      target: { value: "Trapezius Stoneglutes" }
    });

    // 6. Change the interviewer
    fireEvent.click(getAllByRole(appointment, "button", {name: /interviewer/i})[1]);

    // 7. Select save and check for "Saving"
    fireEvent.click(getByText(appointment, "Save"))

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait for the updated appointment
    await waitForElement(() => getByText(appointment, "Trapezius Stoneglutes"));

    // 9. Check that saving is gone and the interviewer updated
    expect(queryByText(appointment, "Saving")).not.toBeInTheDocument();
    expect(queryByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 10. Check that the spots didn't change
    const mondayNode = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"))

    expect(queryByText(mondayNode, /1 spot remaining/i)).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    // Create our mock rejection
    axios.put.mockRejectedValueOnce();

    // 1. Render the application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Englebert Humperdinck" is displayed and save it.
    const appointment = await waitForElement(() => {
      return getAllByTestId(container, "appointment")
        .find(appt => queryByText(appt, "Trapezius Stoneglutes"))
    });
    
    // 3. Click the edit button
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Wait for form to load
    await waitForElement(() => {
      return getByPlaceholderText(appointment, "Enter Student Name");
    });

    // 5. Click the save button
    fireEvent.click(getByText(appointment, "Save"))

    // 6. Confirm that we get an error.
    await waitForElement(() => getByText(appointment, "Could not save appointment."));

    expect(getByText(appointment, "Error")).toBeInTheDocument();

  });
  it("shows the delete error when failing to cancel an appointment", async () => {
    // Create our mock rejection
    axios.delete.mockRejectedValueOnce();

    // 1. Render the application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Englebert Humperdinck" is displayed and save it.
    const appointment = await waitForElement(() => {
      return getAllByTestId(container, "appointment")
        .find(appt => queryByText(appt, "Trapezius Stoneglutes"))
    });
    
    // 4. Click the "Delete" button on the appt
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 5. Check that the confirm message is shown
    expect(getByText(appointment, /Are you sure you want to delete?/i)).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    await waitForElement(() => getByText(appointment, "Could not cancel appointment."));

    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });
})

