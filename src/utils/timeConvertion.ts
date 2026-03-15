import { ApiError } from "./ApiError";

export const timeToMinute = (timeStr: string): number => {
  console.log(timeStr);
  const [hour, minute] = timeStr.split(":").map((t: string) => Number(t));
  console.log(hour, minute);

  if ((!hour && hour !== 0) || (!minute && minute !== 0)) {
    throw new ApiError("Please provide the required fields", 400);
  }

  return hour * 60 + minute;
};

export const minuteToTime = (totalMin: number): string => {
  const hour = Math.floor(totalMin / 60)
    .toString()
    .padStart(2, "0");
  const minute = (totalMin % 60).toString().padStart(2, "0");

  return `${hour}:${minute}`;
};
