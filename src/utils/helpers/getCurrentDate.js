/**
 * Returns the current date in YYYY-MM-DD format
 * @returns {string} Current date formatted as YYYY-MM-DD
 */
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};