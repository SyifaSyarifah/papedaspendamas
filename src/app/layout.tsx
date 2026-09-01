import type { Metadata } from 'next';
import './globals.css';
import { TripPlannerProvider } from '../context/TripPlannerContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BottomNav } from '../components/common/BottomNav';

export const metadata: Metadata = {
  title: 'GATRA — AI Travel Planner Gresik',
  description:
    'Asisten perencanaan perjalanan wisata personal di Kabupaten Gresik berbasis AI. Temukan destinasi, kuliner, dan susun jadwal perjalanan impianmu dengan mudah.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
        <TripPlannerProvider>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
          <BottomNav />
        </TripPlannerProvider>
      </body>
    </html>
  );
}

