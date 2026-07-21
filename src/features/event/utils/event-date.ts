import { EventStatus } from "../types/event";

/**
 * Formats an ISO date string to a clear Indian-friendly format (e.g., "10 July 2026")
 */
export const formatEventDate = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

/**
 * Formats a date range or a single date.
 * If start and end are on the same day, returns a single date.
 * If they are in the same month, returns "10 to 12 July 2026".
 * If they are in different months, returns "30 June to 2 July 2026".
 */
export const formatEventDateRange = (startStr: string, endStr?: string): string => {
  if (!endStr) return formatEventDate(startStr);
  
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return formatEventDate(startStr);

    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString("en-IN", { month: "long" });
    const startYear = start.getFullYear();

    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString("en-IN", { month: "long" });
    const endYear = end.getFullYear();

    // Same day
    if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
      return formatEventDate(startStr);
    }

    // Same month and year
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay} to ${endDay} ${startMonth} ${startYear}`;
    }

    // Same year, different month
    if (startYear === endYear) {
      return `${startDay} ${startMonth} to ${endDay} ${endMonth} ${startYear}`;
    }

    // Different year
    return `${startDay} ${startMonth} ${startYear} to ${endDay} ${endMonth} ${endYear}`;
  } catch (e) {
    return formatEventDate(startStr);
  }
};

/**
 * Calculates the dynamic status of an event based on its dates and the current system time.
 */
export const getEventStatus = (startsAt: string, endsAt?: string): EventStatus => {
  try {
    const now = new Date();
    const start = new Date(startsAt);
    
    // If start is invalid, default to Upcoming (or handle as needed)
    if (isNaN(start.getTime())) return "Upcoming";

    // If there is an end date, we can check Ongoing
    if (endsAt) {
      const end = new Date(endsAt);
      if (!isNaN(end.getTime())) {
        if (now < start) return "Upcoming";
        if (now >= start && now <= end) return "Ongoing";
        return "Past";
      }
    }

    // If no end date, we treat the start date (end of the day) as the cutoff for "Past".
    // Alternatively, just do simple logic:
    // This allows single-day events to be Ongoing on their day, or Past if the day has ended.
    // For simplicity, we can just say if now > start + 24 hours, it's past.
    // Let's use start + 24 hours as a proxy for "end" of a single-day event.
    const approximateEnd = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    
    if (now < start) return "Upcoming";
    if (now >= start && now <= approximateEnd) return "Ongoing";
    return "Past";
    
  } catch (e) {
    return "Upcoming";
  }
};
