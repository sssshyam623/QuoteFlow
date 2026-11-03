import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from './QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'QuoteFlow — Daily Quotes App',
  description: 'Discover and share powerful quotes from great minds.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
