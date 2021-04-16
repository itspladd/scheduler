import React from "react";
import "./styles.scss";

// Sub-components
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Error from "./Error";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

// Cusomt hooks
import useVisualMode from "../../hooks/useVisualMode"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  const initialState = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initialState);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(res => transition(SHOW));
  }

  const deleteInterview = () => {
    transition(DELETING)
    props.cancelInterview(props.id)
    .then(res => transition(EMPTY))
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} /> }
      { mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      { mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onCancel={back}
          onConfirm={deleteInterview}
        />
      )}
      { mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={back}
          onSave={save}
        />
      )}
      { mode === EDIT && (
        <Form 
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      { mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      { mode === DELETING && (
        <Status
          message="Deleting"
        />
      )}
    </article>
  );
}