'use client';

import { useState, useEffect } from 'react';

export function useAuthApp() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    setToken(savedToken);
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  };


  return { token, login };
}
