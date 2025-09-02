/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { apiRequest } from '@/services/api';
import { setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface LoginResponse {
  token: string;
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setIsRedirecting(true);

    try {
      const response = await apiRequest<LoginResponse>('login', 'POST', {
        email,
        password,
      });
      
      const { token } = response;
      setAuthToken(token);
      setAuth(token);
      
      await Promise.all([
        fetch('/api/some-critical-data').catch(() => {}),
        new Promise(resolve => setTimeout(resolve, 100))
      ]);
      
      router.push('/dashboard/especialidades');
      
    } catch (err: any) {
      setIsRedirecting(false);
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
        <Image
          src="/E-Dukate_Logo_Auth.webp"
          alt="E-Dukate Logo"
          width={250}
          height={80}
          loading="lazy"
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
          label={loading ? 'Iniciando...' : (isRedirecting ? 'Cargando...' : 'Iniciar sesión')}
          variant="contained"
          onClick={handleLogin}
          disabled={loading || isRedirecting}
          sx={{
            bgcolor: '#013c28',
            color: 'white',
            width: '100%',
            py: 1.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#025c3f' },
            '&:disabled': { bgcolor: '#cccccc' },
          }}
          startIcon={(loading || isRedirecting) ? <CircularProgress size={20} /> : undefined}
        />
      </Box>
    </Box>
  );
};

export default Login;