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
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const initialState = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initialState);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(res => transition(ERROR_SAVE, true));
  }

  const deleteInterview = () => {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(res => transition(EMPTY))
    .catch(res => transition(ERROR_DELETE, true));
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
      { mode === ERROR_SAVE && (
        <Error
          onClose={back}
          message="Could not save appointment."
        />
      )}
      { mode === ERROR_DELETE && (
        <Error
          onClose={back}
          message="Could not cancel appointment."
        />
      )}
    </article>
  );
}