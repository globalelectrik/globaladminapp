// Helper function to get current YYMM format
export const getCurrentYYMM = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  return year + month; // e.g., "2512" for December 2025
};

// Generate month options from November 2025 to current month
export const generateMonthOptions = () => {
  const options = [];
  const startDate = new Date(2025, 10, 1); // November 2025 (month is 0-indexed)
  const currentDate = new Date();
  
  let date = new Date(startDate);
  while (date <= currentDate) {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const value = year + month;
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    options.push({ value, label });
    
    // Move to next month
    date.setMonth(date.getMonth() + 1);
  }
  
  return options.reverse(); // Most recent first
};