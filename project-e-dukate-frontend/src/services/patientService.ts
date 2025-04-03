import { PatientDataForBackend } from "../types/patient";

const API_URL = "http://localhost:8080/api/Patients";

export const registerPatient = async (patientData: PatientDataForBackend) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar el paciente");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};