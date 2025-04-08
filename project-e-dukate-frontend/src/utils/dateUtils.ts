// "use client";

// import { Dayjs } from "dayjs";

// export const calculateAge = (dateOfBirth: Dayjs): number => {
//   const today = new Date();
//   const birth = dateOfBirth.toDate();
//   let age = today.getFullYear() - birth.getFullYear();
//   if (
//     today.getMonth() < birth.getMonth() ||
//     (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
//   ) {
//     age--;
//   }
//   return age;
// };