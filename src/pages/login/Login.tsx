import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router';
import { postLoginAdmin } from '../../redux/sagas/auth/authSagaAction';
import { useDispatch, useSelector } from 'react-redux';
const PRIMARY_COLOR = '#00A8B9';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state: any) => state.auth?.error);
  const token = useSelector((state: any) => state.auth?.token);

  useEffect(() => {
    if (token && loading) {
      setLoading(false);
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [token, loading, email, navigate]);

  useEffect(() => {
    if (authError && loading) {
      setLoading(false);
      setError(authError);
    }
  }, [authError, loading]);

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    dispatch(postLoginAdmin({ username: email, password }));
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              width: '100%',
              borderRadius: 2,
              borderTop: `4px solid ${PRIMARY_COLOR}`,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: PRIMARY_COLOR,
                  borderRadius: '50%',
                  padding: 1.5,
                  marginBottom: 2,
                  boxShadow: `0 4px 12px rgba(0, 168, 185, 0.3)`,
                }}
              >
                <LockIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: PRIMARY_COLOR,
                }}
              >
                Admin Portal
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 0.5 }}
              >
                Sign in to your account
              </Typography>
            </Box>

            {/* Alerts */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 2,
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                severity="success"
                sx={{
                  marginBottom: 2,
                  '& .MuiAlert-icon': {
                    color: PRIMARY_COLOR,
                  },
                }}
              >
                {success}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                placeholder="admin@example.com"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: PRIMARY_COLOR,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  marginTop: 1,
                  backgroundColor: PRIMARY_COLOR,
                  '&:hover': {
                    backgroundColor: '#008A99',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              sx={{
                marginTop: 3,
                color: PRIMARY_COLOR,
                fontWeight: 500,
              }}
            >
              © 2025 Admin Portal. All rights reserved.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}