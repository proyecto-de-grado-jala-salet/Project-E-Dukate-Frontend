import { Login } from '@/pages/Login';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <Link href="/dashboard/especialidades" prefetch={true} style={{ display: 'none' }} />
      <Login />
    </>
  );
}