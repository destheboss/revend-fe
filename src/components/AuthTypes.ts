export type User = {
  id: any;
  email: string;
  firstName: string;
  lastName: string;
  imageData?: string;
  roles: string[];
};
  
  export type AuthContextType = {
    user: User | null;
    logout: () => void;
    setLogin: (accessToken: string, refreshToken: string) => void;
  };