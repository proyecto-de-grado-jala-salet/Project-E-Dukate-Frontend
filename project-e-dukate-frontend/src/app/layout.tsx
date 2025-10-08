import type { Metadata } from 'next';
import ClientWrapper from '@/components/client/layout/ClientWrapper';
import { NavigationProvider } from '@/contexts/NavigationContext';

export const metadata: Metadata = {
  title: {
    template: '%s | E-Dukate',
    default: 'E-Dukate - Sistema de Gestión Educativa',
  },
  description: 'Sistema integral de gestión para instituciones educativas',
  icons: {
    icon: '/E-Dukate_Logo.webp',
    apple: '/E-Dukate_Logo.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NavigationProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </NavigationProvider>
      </body>
    </html>
  );
}