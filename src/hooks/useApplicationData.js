import {useReducer, useEffect } from "react"
import axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SLOTS = "SET_SLOTS";

  const initialState = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  };

  function reducer(state, action) {
    const setAppData = ({ days, appointments, interviewers }) => {
      return { ...state, days, appointments, interviewers }
    };

    const setDay = ({ newDay }) => {
      return { ...state, day: newDay };
    };

    const setSlots = ({ id, increment }) => {
      // "id" is the ID of the appointment being added or canceled.
      const days = [...(state.days)];
      const currentDay = days.find(day => day.appointments.includes(id));
      currentDay.spots += increment;

      return { ...state, days };
    };

    const setInterview = ({ id, interview }) => {
      const appointment = {...(state.appointments[id]), interview};
  
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      return { ...state, appointments};
    }

    const actions = {
      [SET_APPLICATION_DATA]: setAppData,
      [SET_DAY]: setDay,
      [SET_SLOTS]: setSlots,
      [SET_INTERVIEW]: setInterview
    }
    
    return actions[action.type]({ ...action })
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  // After everything has rendered originally, get all our data from the API. 
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(allRes => allRes.map(res => res.data))
      .then(all => dispatch({ 
          type: SET_APPLICATION_DATA,
          days: all[0], 
          appointments: all[1],
          interviewers: all[2]
        })
      );
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }))
      .then(() => dispatch({ type: SET_SLOTS, id, increment: -1 }));

  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }))
      .then(() => dispatch({ type: SET_SLOTS, id, increment: 1 }));
  };

  const setDay = newDay => dispatch({ type: SET_DAY, newDay })


  return { 
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};