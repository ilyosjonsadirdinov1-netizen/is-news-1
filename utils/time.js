import {
  format,
  differenceInMinutes,
  differenceInHours,
  parseISO,
} from "date-fns";

export function formatRelativeOrClock(iso) {
  if (!iso) return "";
  const date = typeof iso === "string" ? parseISO(iso) : iso;
  const mins = differenceInMinutes(new Date(), date);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hours = differenceInHours(new Date(), date);
  if (hours < 24) return `${hours} hours ago`;
  return format(date, "HH:mm, MMM d");
}
