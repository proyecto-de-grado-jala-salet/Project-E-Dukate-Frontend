export const genderColors = {
  M: '#1976d2', // Azul para Masculino
  F: '#ff4081', // Rosa para Femenino
};

export const ageRangeColors = {
  '0-18': '#4caf50', // Verde
  '19-30': '#2196f3', // Azul
  '31-45': '#ff9800', // Naranja
  '46-60': '#f44336', // Rojo
  '61+': '#9c27b0', // Púrpura
};

export const formatGenderLabel = (gender: string): string =>
  gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : gender;