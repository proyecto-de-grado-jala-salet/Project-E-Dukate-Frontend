/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { apiRequest, setAuthToken } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  token: string;
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<LoginResponse>('login', 'POST', {
        email,
        password,
      });
      const { token } = response;
      setAuthToken(token);
      setAuth(token);
      router.push('/dashboard');
    } catch (err: any) {
      const errorData = err.response?.data || {};
      const errorMessage = typeof errorData === 'string' ? errorData : (errorData.Error || 'Error al iniciar sesión');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-130px',
          left: '-100px',
          width: '500px',
          height: '500px',
          backgroundColor: '#013c28',
          borderRadius: '50%',
          border: '30px solid #f5c71a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/E-Dukate_Logo_Auth.png"
          alt="E-Dukate Logo"
          style={{ width: 250 }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '-130px',
          right: '-100px',
          width: '500px',
          height: '500px',
          backgroundColor: '#013c28',
          borderRadius: '50%',
          border: '30px solid #f5c71a',
        }}
      />

      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: '20px',
          py: 10,
          px: 10,
          width: '100%',
          maxWidth: 600,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#333', mb: 7 }}
        >
          Bienvenido de nuevo
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#666', mb: 5, textAlign: 'center' }}
        >
          Ingresa tu correo electrónico y contraseña para continuar.
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          sx={{ mb: 2, width: '100%' }}
          error={!!error}
        />
        <TextField
          label="Contraseña"
          value={password}
          onChange={setPassword}
          type="password"
          showToggle
          required
          autoComplete="current-password"
          sx={{ mb: 3, width: '100%' }}
          error={!!error}
        />
        {error && (
          <Typography
            variant="body2"
            sx={{ color: 'red', mb: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
        <Button
          label={loading ? 'Iniciando...' : 'Iniciar sesión'}
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            bgcolor: '#013c28',
            color: 'white',
            width: '100%',
            py: 1.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#025c3f' },
          }}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        />
      </Box>
    </Box>
  );
};

export default Login;