export const dayTranslationToEnglish: { [key: string]: string } = {
  "Lunes": "Monday",
  "Martes": "Tuesday", 
  "Miércoles": "Wednesday",
  "Miercoles": "Wednesday",
  "Jueves": "Thursday",
  "Viernes": "Friday",
  "Sábado": "Saturday",
  "Sabado": "Saturday",
  "Domingo": "Sunday"
};

export const dayTranslationToSpanish: { [key: string]: string } = {
  "Monday": "Lunes",
  "Tuesday": "Martes",
  "Wednesday": "Miércoles", 
  "Thursday": "Jueves",
  "Friday": "Viernes",
  "Saturday": "Sábado",
  "Sunday": "Domingo"
};

export const translateDayToEnglish = (spanishDay: string): string => {
  const normalizedDay = spanishDay
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  
  const translation = dayTranslationToEnglish[spanishDay] || 
                     dayTranslationToEnglish[normalizedDay];
  
  if (!translation) {
    console.warn(`❌ No se pudo traducir el día: "${spanishDay}"`);
    return "Monday";
  }
  
  return translation;
};

export const translateDayToSpanish = (englishDay: string): string => {
  return dayTranslationToSpanish[englishDay] || englishDay;
};