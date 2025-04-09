// src/services/specialtyService.ts

export const API_URL = "http://localhost:8080/api/Specialties";

export const fetchSpecialties = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las especialidades");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const addSpecialty = async (specialtyData: { typeOfSpecialty: string }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(specialtyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al añadir la especialidad");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};