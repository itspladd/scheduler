import React from "react";

export default function DayList(props) {
  const { days, day, setDay } = props;

  
  return(
    <li>
      {props.spots} spots remaining
    </li>
  ) 
}