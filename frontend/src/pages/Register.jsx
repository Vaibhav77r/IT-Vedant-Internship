import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');

    try {
      const res = await API.post("/api/auth/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // Save user + token
      login(
        {
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role
        },
        res.data.token
      );

      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register for IMS access</p>

        {serverError && <div style={styles.error}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              placeholder="John Doe"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && <span style={styles.fieldError}>{errors.fullName.message}</span>}
          </div>

          {/* Email */}
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

          {/* Role */}
          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              {...register('role', { required: 'Role is required' })}
            >
              <option value="">-- Select Role --</option>
              <option value="ADMIN">Admin</option>
              <option value="SALESPERSON">Salesperson</option>
            </select>
            {errors.role && <span style={styles.fieldError}>{errors.role.message}</span>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Min. 6 characters"
              {...register('password', {
                required: 'Password required',
                minLength: { value: 6, message: 'Min 6 characters' }
              })}
            />
            {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Re-enter password"
              {...register('confirm', {
                required: 'Please confirm password',
                validate: val =>
                  val === watch('password') || 'Passwords do not match'
              })}
            />
            {errors.confirm && <span style={styles.fieldError}>{errors.confirm.message}</span>}
          </div>

          {/* Submit */}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// 🎨 Simple styling
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5'
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px'
  },
  title: {
    margin: '0 0 4px',
    fontSize: '1.6rem',
    color: '#1a1a2e'
  },
  subtitle: {
    margin: '0 0 1.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  field: { marginBottom: '1rem' },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontWeight: '600'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  fieldError: {
    color: '#dc2626',
    fontSize: '0.8rem',
    marginTop: '2px',
    display: 'block'
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.9rem'
  }
};