export function formatDateToReadable(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
