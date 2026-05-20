import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('urbanoma_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('urbanoma_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = users.find((u) => u.email === email);
    if (!found || password.length < 4) {
      throw new Error('Invalid email or password.');
    }
    const sessionUser = { ...found, token: 'fake-jwt-token' };
    setUser(sessionUser);
    localStorage.setItem('urbanoma_user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const signup = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    if (!data.email || !data.password || data.password.length < 6) {
      throw new Error('Please fill all required fields. Password must be at least 6 characters.');
    }
    const newUser = {
      _id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      profilePic: '',
      isAdmin: false,
      token: 'fake-jwt-token',
    };
    setUser(newUser);
    localStorage.setItem('urbanoma_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('urbanoma_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
