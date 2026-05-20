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

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('urbanoma_user', JSON.stringify(userData));
  };

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

    saveUser(data);

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

  const uploadProfileImage = async (file) => {
    if (!user?.token) {
      throw new Error('Please login first.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/auth/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Could not upload profile image.');
    }

    const updatedUser = {
      ...user,
      ...data,
      token: user.token,
    };

    saveUser(updatedUser);

    return updatedUser;
  };

  const updateUser = (newData) => {
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...newData,
      token: user.token,
    };

    saveUser(updatedUser);

    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('urbanoma_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        uploadProfileImage,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}