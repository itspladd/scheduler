import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  // Resets the information fields
  const reset = () => {
    setInterviewer(null);
    setError("")
    setName("");
  }

  // Cancel handler - call reset and onCancel from props
  const cancel = () => {

    console.log("NAME:", name)
    reset();
    props.onCancel();
  };

  const handleSubmit = () => {
    if(!name) {
      setError("Student name cannot be blank");
      return;
    }
    if(!interviewer) {
      setError("You must select an interviewer!")
      return;
    }
    setError("");
    props.onSave(name, interviewer);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            data-testid = "student-name-input"
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={handleSubmit}>Save</Button>
        </section>
      </section>
    </main>
  );
}