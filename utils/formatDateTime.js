import moment from "moment";

export const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE', options).replace(' ', 'T').replace(/-/g, '-').replace(/\./g, ':').replace('T', ' ');
  }; // like 'YYYY-MM-DDTHH:mm:ss'
  
  export const dateTimeToShow = (dateString) => {
    return moment(dateString).format('DD MMM YYYY, hh:mm A');
  };
  export function convertUtcToLocalTime(utcTime) {
    // Parse the UTC time
    const utcDate = moment.utc(utcTime);
    
    // Convert to local time
    const localTime = utcDate.local();
    
    // Return as a JavaScript Date object
    return localTime.toDate();
}
  