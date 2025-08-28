import { Login } from '../../pages/Login';
import Link from 'next/link';

// Precarga la ruta /dashboard para navegación más rápida
export default function LoginPage() {
  return (
    <>
      <Link href="/dashboard" prefetch={true} style={{ display: 'none' }} />
      <Login />
    </>
  );
}