import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await API.post('/auth/login', data);
      login(
        { fullName: res.data.fullName, email: res.data.email, role: res.data.role },
        res.data.token
      );
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>IMS Login</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {serverError && <div style={styles.error}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span style={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f0f2f5'
  },
  card: {
    background: '#fff', padding: '2rem', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px'
  },
  title: { margin: '0 0 4px', fontSize: '1.6rem', color: '#1a1a2e' },
  subtitle: { margin: '0 0 1.5rem', color: '#666', fontSize: '0.9rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box',
    outline: 'none'
  },
  button: {
    width: '100%', padding: '12px', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer',
    marginTop: '0.5rem', fontWeight: '600'
  },
  error: {
    background: '#fee2e2', color: '#dc2626', padding: '10px 12px',
    borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'
  },
  fieldError: { color: '#dc2626', fontSize: '0.8rem', marginTop: '2px', display: 'block' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }
};