// dateUtils.js
// Parse input date (YYYY-MM-DD or MM/DD/YYYY) as local date
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;

  // Handle YYYY-MM-DD (from <input type="date">)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed
  }

  // Handle MM/DD/YYYY (custom input)
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [month, day, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  throw new Error(`Invalid date format: ${dateStr}`);
}

// Format date for display or export (MM/DD/YYYY)
export function formatLocalDate(date) {
  if (!(date instanceof Date) || isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}
