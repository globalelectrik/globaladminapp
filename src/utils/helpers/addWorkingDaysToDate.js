

export function addWorkingDays(startDate, workingDays) {
  const result = new Date(startDate);
  let addedDays = 0;

  while (addedDays < workingDays) {
    result.setDate(result.getDate() + 1);

    // Skip Saturday (6) and Sunday (0)
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }

  return result;
}