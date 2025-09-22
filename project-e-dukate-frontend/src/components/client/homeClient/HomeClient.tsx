"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function HomeClient() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return null;
}