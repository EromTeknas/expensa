// src/features/auth/AuthProvider.tsx
import React, {useEffect} from 'react';

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  useEffect(() => {
    // Optional: Restore session logic
    // e.g. auto-login if token exists
  }, []);

  return children;
};

export default AuthProvider;
