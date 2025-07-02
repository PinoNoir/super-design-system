'use client';

import { ThemeProvider, type ThemeTypes } from 'sds-ui';
import { useEffect, useState } from 'react';

function ClientThemeProvider({
  children,
  defaultTheme,
}: Readonly<{
  children: React.ReactNode;
  defaultTheme: ThemeTypes;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the ThemeProvider once the component has mounted on the client
  if (!isMounted) {
    // Return a minimal placeholder during server-side rendering
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }
  return <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>;
}

export default ClientThemeProvider;
