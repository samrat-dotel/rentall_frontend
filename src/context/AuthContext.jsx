import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://127.0.0.1:8000';

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
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Invalid email or password.');
    }

    setUser(data);
    localStorage.setItem('urbanoma_user', JSON.stringify(data));

    return data;
  };

  const signup = async (formData) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        password: formData.password,
        confirm: formData.confirm,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.detail ||
          'Please fill all required fields. Password must be at least 6 characters.'
      );
    }

    // Important:
    // Do NOT set user here.
    // Do NOT save user to localStorage here.
    // Signup only creates the account.
    return data;
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