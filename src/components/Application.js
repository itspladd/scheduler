import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment"
import { getAppointmentsForDay,
         getInterviewersForDay,
         getInterview } from "../helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(allRes => allRes.map(res => res.data))
      .then(all => setState(prev => (
        {...prev, 
          days: all[0], 
          appointments: all[1],
          interviewers: all[2]
        })));
  }, [])

  const setDay = newDay => setState({...state, day: newDay});

  const bookInterview = (apptID, interview) => {
    const appointment = {
      ...state.appointments[apptID],
      interview: {...interview}
    };

    const appointments = {
      ...state.appointments,
      [apptID]: appointment
    };

    return axios.put(`/api/appointments/${apptID}`, appointment)
      .then(res => setState({
        ...state,
        appointments
      }))
      .catch(err => console.error(err))
  };

  const cancelInterview = (apptID) => {
    const appointment = state.appointments[apptID];
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [apptID]: appointment
    };
    
    return axios.delete(`/api/appointments/${apptID}`)
    .then(res => console.log("api updated"))
    .then(res => {
      setState({
        ...state,
        appointments});
    })
    .catch(err => console.error(err))
  };

  const dailyAppointments = getAppointmentsForDay(state, state.day);


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {dailyAppointments.map(appt => {
          const interview = getInterview(state, appt.interview);
          const interviewers = getInterviewersForDay(state, state.day)
          
          return (
          <Appointment
            key={appt.id}
            {...appt}
            interview={interview}
            interviewers={interviewers}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />
        )})}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

  );
}
