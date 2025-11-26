import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router';

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
}).required();

const Login = () => {
  const { login } = useAuth(); // Lấy hàm login từ Context
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      
      // Backend trả về: { token, user }
      const { token, user } = response.data;
      
      // Gọi hàm login của Context để lưu trạng thái
      login(token, user);
      
      alert('Đăng nhập thành công!');
      navigate('/'); // Chuyển về trang chủ
    } catch (error) {
      alert(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div style={{ marginBottom: 15 }}>
          <label>Email</label>
          <input {...register("email")} type="email" style={{ width: '100%', padding: 8, marginTop: 5 }} />
          <p style={{ color: 'red', fontSize: 12 }}>{errors.email?.message}</p>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Mật khẩu</label>
          <input {...register("password")} type="password" style={{ width: '100%', padding: 8, marginTop: 5 }} />
          <p style={{ color: 'red', fontSize: 12 }}>{errors.password?.message}</p>
        </div>

        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Đăng Nhập
        </button>
      </form>
      <p style={{ marginTop: 15, textAlign: 'center' }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default Login;