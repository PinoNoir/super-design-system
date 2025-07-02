import React from 'react';

export interface User {
  id: number;
  name: string;
  profilePic?: string;
  isLoggedIn: boolean;
}

export const UserContext = React.createContext<User | undefined>(undefined);

export function useUserContext() {
  const user = React.useContext(UserContext);
  if (user === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return user;
}
