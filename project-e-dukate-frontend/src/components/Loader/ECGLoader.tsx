// components/ECGLoader.tsx
"use client";

import React from 'react';
import Box from '@mui/material/Box';

interface ECGLoaderProps {
  message?: string;
}

const ECGLoader: React.FC<ECGLoaderProps> = ({ message = "Cargando" }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
          padding: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid #00593B',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 120,
            position: 'relative',
            marginBottom: 3,
          }}
        >
          <Box
            component="svg"
            className="heartbeat"
            viewBox="0 0 400 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              width: '100%',
              height: 80,
              strokeDasharray: 800,
              strokeDashoffset: 800,
              animation: 'draw 3s linear infinite, heartbeat 1.2s linear infinite',
              filter: 'drop-shadow(0 0 5px #F4A601)',
              '@keyframes draw': {
                '0%': { strokeDashoffset: 800 },
                '50%': { strokeDashoffset: 0 },
                '100%': { strokeDashoffset: -800 },
              },
              '@keyframes heartbeat': {
                '0%, 50%, 100%': { transform: 'scale(1)' },
                '25%': { transform: 'scale(1.05)' },
                '75%': { transform: 'scale(0.95)' },
              },
            }}
          >
            <path
              d="M0,40 L50,40 L60,10 L70,70 L80,40 L130,40 L140,10 L150,70 L160,40 L210,40 L220,10 L230,70 L240,40 L290,40 L300,10 L310,70 L320,40 L400,40"
              stroke="#00593B"
              strokeWidth="4"
              fill="none"
              strokeLinejoin="round"
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            margin: '20px 0',
          }}
        >
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              className="dot"
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#00593B',
                animation: 'pulse 1.5s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 0.7,
                  },
                  '50%': {
                    transform: 'scale(1.5)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>

        <Box
          component="p"
          className="loading-text"
          sx={{
            color: '#00593B',
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '1px',
            marginTop: '15px',
            '&::after': {
              content: '""',
              animation: 'dots 1.5s steps(5, end) infinite',
            },
            '@keyframes dots': {
              '0%, 20%': { content: '"."' },
              '40%': { content: '".."' },
              '60%, 100%': { content: '"..."' },
            },
          }}
        >
          {message}
        </Box>
      </Box>
    </Box>
  );
};

export default ECGLoader;