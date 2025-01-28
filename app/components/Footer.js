'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-background text-foreground h-16 flex items-center justify-center">
      <p className="text-sm">
        &copy; {currentYear} Paint for Fun. All rights reserved.
      </p>
    </footer>
  );
}
