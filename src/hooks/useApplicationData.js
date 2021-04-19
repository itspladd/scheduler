import {useReducer, useEffect } from "react"
import axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

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

    const updateSpots = (state, id) => {
      const newState = { ...state }
      const currentDay = newState.days.find(day => day.appointments.includes(id));
      const nullAppts = currentDay.appointments.filter(apptID => newState.appointments[apptID].interview === null)
      currentDay.spots = nullAppts.length;
      return newState;
    }

    const setInterview = ({ id, interview }) => {
      const appointment = {...(state.appointments[id]), interview};
  
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      const newState = { ...state, appointments};
      const stateUpdatedSpots = updateSpots(newState, id);
      return { ...stateUpdatedSpots, appointments};
    }



    const actions = {
      [SET_APPLICATION_DATA]: setAppData,
      [SET_DAY]: setDay,
      [SET_INTERVIEW]: setInterview
    }
    
    return actions[action.type]({ ...action })
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  // After everything has rendered originally, get all our data from the API. 
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.onopen = function(event) {
      ws.send("ping");
    }

    ws.onmessage = function(event) {
      const data = JSON.parse(event.data)
      if (data.type) {
        dispatch(data);
      }
    }

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
    // Check: are we booking a new interview or editing an existing one? Set the increment appropriately.
    const increment = state.appointments[id].interview ? 0 : 1;

    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));

  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  };

  const setDay = newDay => dispatch({ type: SET_DAY, newDay })


  return { 
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};