export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isPast(date: Date | string): boolean {
  return new Date(date).getTime() < new Date().getTime();
}

export function isFuture(date: Date | string): boolean {
  return new Date(date).getTime() > new Date().getTime();
}
