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

  // Get the hours and minutes
  const hours = ("0" + dateUTC.getHours()).slice(-2);
  const minutes = ("0" + dateUTC.getMinutes()).slice(-2);

  // Format the date string
  const formattedDate = `${monthName} ${day}, ${year}, ${hours}:${minutes} UTC`;

  return formattedDate;
};
