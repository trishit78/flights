'use client';

import Link from 'next/link';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between font-sans">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <span className="font-medium text-xl text-gray-800">Flights</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/flights" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
            Explore
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
             Trips
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-none rounded-sm px-4">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
