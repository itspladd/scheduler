import React from "react";

export default function Empty(props) {
  // { onAdd }
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        role="button"
        name="add"
        onClick={props.onAdd}
      />
    </main>
  );
}