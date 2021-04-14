export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.filter(elem => elem.name === day)
  if (dayObj.length === 0) {
    return [];
  }
  
  const apptIDs = dayObj[0].appointments;
  const appointments = Object.values(state.appointments).filter(appt => apptIDs.includes(appt.id));
  
  return appointments;

}