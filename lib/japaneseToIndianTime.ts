const days = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
];
function jpnToInd(
  day: string,
  time24: string,
  time: true,
): { day: number; hour: number; minute: number };

function jpnToInd(day: string, time24: string, time?: false): string;
function jpnToInd(day: string, time24: string, time = false) {
  let [h, m] = time24.split(":").map(Number);

  // subtract 3h 30m
  m -= 30;
  if (m < 0) {
    m += 60;
    h -= 1;
  }

  h -= 3;

  let dayIndex = days.indexOf(day);

  if (h < 0) {
    h += 24;
    dayIndex = (dayIndex - 1 + 7) % 7;
  }
  if (time)
    return {
      day: dayIndex,
      hour: h,
      minute: m,
    };

  return (
    days[dayIndex] +
    ` at ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} IST`
  );
}

export default jpnToInd;
