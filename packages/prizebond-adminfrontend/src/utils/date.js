export function veryNextFifth() {
  const date = new Date();
  const dt = date.getDate();
  date.setDate(5);
  if (dt >= 5) {
    date.setMonth(date.getMonth() + 1);
  }

  return date.setHours(23, 59, 59, 0);
}
