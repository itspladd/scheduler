import React, { useEffect } from "react";
import "./styles.scss";

// Sub-components
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Error from "./Error";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

// Custom hook
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

  // useVisualMode controls what the component currently displays.
  // We start at SHOW if we have an interview.
  const initialState = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initialState);

  // Error control: if we've somehow ended up in the wrong state
  // (i.e. EMPTY but there's an interview, or SHOW but there's no interview)
  // then change to the proper state.
  useEffect(() => {
    props.interview && mode === EMPTY && transition(SHOW);
    !props.interview && mode === SHOW && transition(EMPTY);
  }, [props.interview, transition, mode]);

  // Book an interview for this appointment slot.
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
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} /> }
      { mode === SHOW && props.interview && (
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