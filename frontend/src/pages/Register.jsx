import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router';

// 1. Validate Schema
const schema = yup.object({
  username: yup.string().required('Vui lòng nhập tên người dùng'),
  channelName: yup.string().required('Vui lòng nhập tên kênh'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu phải từ 6 ký tự').required('Vui lòng nhập mật khẩu'),
}).required();

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // Gọi API Register
      await axiosClient.post('/auth/register', data);
      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Đăng Ký Kênh</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div style={{ marginBottom: 15 }}>
          <label>Tên người dùng</label>
          <input {...register("username")} style={{ width: '100%', padding: 8, marginTop: 5 }} />
          <p style={{ color: 'red', fontSize: 12 }}>{errors.username?.message}</p>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Tên Kênh (Channel Name)</label>
          <input {...register("channelName")} style={{ width: '100%', padding: 8, marginTop: 5 }} />
          <p style={{ color: 'red', fontSize: 12 }}>{errors.channelName?.message}</p>
        </div>

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

        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Đăng Ký
        </button>
      </form>
      <p style={{ marginTop: 15, textAlign: 'center' }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default Register;