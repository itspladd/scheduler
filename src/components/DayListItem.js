import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";


export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  const dayListItemClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": !spots,
  }) 

  return(
    <li 
      className = {dayListItemClass}
      onClick = {() => setDay(name)}
    >
      <h2>{props.name}</h2>
      <h3>{ spots || "no"} spot{ spots !== 1 && "s" } remaining</h3>
    </li>
  ) 
}