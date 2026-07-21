const currentYear = new Date().getFullYear();
export const RAVENSHAW_BATCHES = Array.from({ length: 70 }, (_, i) => {
  return (currentYear + 5 - i).toString();
});
