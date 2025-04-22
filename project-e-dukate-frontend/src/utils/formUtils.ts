export const mapGenderToRadioValue = (
  gender: string
): "Femenino" | "Masculino" => {
  return gender === "F" ? "Femenino" : "Masculino";
};

export const mapRadioValueToGender = (
  radioValue: "Femenino" | "Masculino"
): string => {
  return radioValue === "Femenino" ? "F" : "M";
};
