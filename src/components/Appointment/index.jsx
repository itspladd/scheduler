import React from "react";
import "./styles.scss";

// Sub-components
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Error from "./Error";

export default function Appointment(props) {

  return (
    <article className="appointment">
      <Header time={props.time} />
      {
        props.interview
        ? <Show 
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        : <Empty />
      }
    </article>
  );
}