export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.filter(elem => elem.name === day)
  if (dayObj.length === 0) {
    return [];
  }
  
  const apptIDs = dayObj[0].appointments;
  const appointments = apptIDs.map(id => state.appointments[id])
  
  return appointments;

}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerID = interview.interviewer;
  const interviewerObj = state.interviewers[interviewerID]

  return ({...interview, interviewer: interviewerObj})
}