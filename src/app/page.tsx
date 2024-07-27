// src/app/page.tsx
'use client'; // Marca este archivo como componente de cliente

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página de login al cargar la raíz
    router.push('/login');
  }, [router]);

  return null; // No renderiza nada
}
