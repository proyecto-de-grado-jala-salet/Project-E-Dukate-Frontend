import { SpecialistDataForBackend } from "../types/specialist";

const API_URL = "http://localhost:8080/api/Specialists";

export const registerSpecialist = async (specialistData: SpecialistDataForBackend) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(specialistData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar el especialista");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};