export const genderColors = {
  M: '#1976d2',
  F: '#ff4081',
};

export const ageRangeColors = {
  '0-18': '#4caf50',
  '19-30': '#2196f3',
  '31-45': '#ff9800',
  '46-60': '#f44336',
  '61+': '#9c27b0',
};

export const formatGenderLabel = (gender: string): string =>
  gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : gender;