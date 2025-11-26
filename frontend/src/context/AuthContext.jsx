import axiosClient from '@/api/axiosClient';
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập khi F5 trang
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Gọi API /users/me để lấy thông tin user từ token
          const response = await axiosClient.get('/users/me');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token hết hạn hoặc lỗi:", error);
          logout(); // Nếu token lỗi thì logout luôn
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook custom để dùng nhanh context
export const useAuth = () => useContext(AuthContext);