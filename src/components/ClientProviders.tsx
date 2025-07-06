// src/components/ClientProviders.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import ServiceWorkerRegister from './ServiceWorkerRegister';
import SWRProvider from './SWRProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRProvider>
        <ServiceWorkerRegister />
        {children}
      </SWRProvider>
    </SessionProvider>
  );
}
