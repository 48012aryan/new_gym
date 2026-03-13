import React, { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Dumbbell, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      setAuthToken(response.data.token);
      setUser(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="text-center mb-5">
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: 0 }}
            className="d-inline-block p-4 glass rounded-circle text-primary mb-4"
          >
            <Dumbbell size={48} strokeWidth={2.5} />
          </motion.div>
          <h1 className="fw-bold mb-2">
            <span className="text-gradient">GYM PRO</span>
          </h1>
          <p className="text-muted fw-medium fs-5">Administrative Control</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Alert variant="danger" className="glass border-danger border-opacity-25 text-danger fw-bold rounded-pill text-center mb-4 py-2">
              {error}
            </Alert>
          </motion.div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4 position-relative">
            <Form.Label className="small fw-bold text-uppercase letter-spacing-1 ps-2">Email Address</Form.Label>
            <div className="position-relative">
              <Mail className="position-absolute translate-middle-y top-50 ms-3 text-muted" size={18} />
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@gympro.com"
                className="glass ps-5 py-3 rounded-pill border-0 shadow-sm"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-5 position-relative">
            <Form.Label className="small fw-bold text-uppercase letter-spacing-1 ps-2">Password</Form.Label>
            <div className="position-relative">
              <Lock className="position-absolute translate-middle-y top-50 ms-3 text-muted" size={18} />
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="glass ps-5 py-3 rounded-pill border-0 shadow-sm"
              />
            </div>
          </Form.Group>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-premium btn-primary-gradient w-100 py-3 rounded-pill shadow-lg border-0 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <ShieldCheck size={20} />
                <span className="fw-bold">SECURE LOGIN</span>
              </>
            )}
          </motion.button>
        </Form>

        <div className="text-center mt-5">
          <div className="glass d-inline-block px-4 py-2 rounded-pill small text-muted">
            <span className="fw-bold text-primary">DEMO:</span> admin@gym.com / admin123
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

