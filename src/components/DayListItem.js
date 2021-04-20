import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss";


export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  const dayListItemClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": !spots,
  }) 

  const formatSpots = spots => {
    return `${ spots || "no"} spot${ spots === 1 ? "" : "s" }`
  };

  return(
    <li 
      className = {dayListItemClass}
      onClick = {() => setDay(name)}
      data-testid="day"
    >
      <h2>{props.name}</h2>
      <h3>{formatSpots(spots)} remaining</h3>
    </li>
  ) 
}