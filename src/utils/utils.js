export const formatDateUTC = (date) => {
  const dateStr = date;
  const dateUTC = new Date(dateStr);

  // Get the month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[dateUTC.getMonth()];

  // Get the day of the month
  const day = dateUTC.getDate();

  // Get the year
  const year = dateUTC.getFullYear();

  // Get the hours and minutes in UTC
  const hours = dateUTC.getUTCHours();
  const minutes = dateUTC.getUTCMinutes();

  // Format the date string
  const formattedDate = `${monthName} ${day}, ${year}, ${hours}:${minutes} UTC`;

  return formattedDate;
};
