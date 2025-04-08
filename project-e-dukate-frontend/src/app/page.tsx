// "use client";

// import { PatientRegistration } from "../pages/PatientRegistration";

// // import { SpecialistRegistration } from "../pages/SpecialistRegistration";

// export default function Home() {
//   return <PatientRegistration />;
//   // return <SpecialistRegistration />;
// }


"use client";

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}