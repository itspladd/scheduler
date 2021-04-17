import {useState, useEffect } from "react"
import axios from "axios";

export default function useApplicationData() {
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

  const adjustSlots = (day, difference) => {
    const days = [...(state.days)];
    const currentDay = days.find(day => day.name === state.day);
    currentDay.spots += difference;
    return days;
  };

  const bookInterview = (apptID, interview) => {
    const appointment = {
      ...state.appointments[apptID],
      interview: {...interview}
    };

    const appointments = {
      ...state.appointments,
      [apptID]: appointment
    };

    // Update number of slots
    const days = adjustSlots(state.day, -1);


    return axios.put(`/api/appointments/${apptID}`, appointment)
      .then(res => setState({
        ...state,
        appointments,
        days: days
      }))
  };

  const cancelInterview = (apptID) => {
    const appointment = state.appointments[apptID];
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [apptID]: appointment
    };
    const days = adjustSlots(state.day, 1);
    
    return axios.delete(`/api/appointments/${apptID}`)
    .then(res => {
      setState({
        ...state,
        appointments,
        days
      });
    })
  };

  return { 
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};