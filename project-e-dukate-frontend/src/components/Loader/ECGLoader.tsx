"use client";

import React from 'react';
import Box from '@mui/material/Box';
import { FaHeartPulse } from "react-icons/fa6";
import { TbStethoscope } from "react-icons/tb";

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
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
          padding: 3,
          background: '#ffffff',
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
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: '#000000',
              borderRadius: '2px',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, #F4A601, transparent)',
                animation: 'ecgMove 2s linear infinite',
              },
            }}
          />
          
          <Box
            component="svg"
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
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#00593B',
                animation: 'pulse 1.5s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>

        <Box
          component="p"
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
          }}
        >
          {message}
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '25px',
            opacity: 0.8,
          }}
        >
          <Box
            sx={{
              color: '#00593B',
              fontSize: '28px',
              animation: 'float 3s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaHeartPulse />
          </Box>
          
          <Box
            sx={{
              color: '#00593B',
              fontSize: '28px',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ⚕
          </Box>
          
          <Box
            sx={{
              color: '#00593B',
              fontSize: '28px',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TbStethoscope />
          </Box>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes ecgMove {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        @keyframes draw {
          0% {
            stroke-dashoffset: 800;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -800;
          }
        }
        
        @keyframes heartbeat {
          0%, 50%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05);
          }
          75% {
            transform: scale(0.95);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        
        @keyframes dots {
          0%, 20% { content: "."; }
          40% { content: ".."; }
          60%, 100% { content: "..."; }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          .loader-container {
            padding: 20px;
          }
          
          .ecg-loader {
            height: 100px;
            margin-bottom: 20px;
          }
          
          .heartbeat {
            height: 60px;
          }
          
          .loading-text {
            font-size: 18px;
          }
          
          .symbol {
            font-size: 24px;
          }
        }
        
        @media (max-width: 400px) {
          .loader-container {
            padding: 15px;
          }
          
          .ecg-loader {
            height: 80px;
          }
          
          .heartbeat {
            height: 50px;
          }
          
          .loading-text {
            font-size: 16px;
          }
          
          .symbol {
            font-size: 20px;
          }
        }
      `}</style>
    </Box>
  );
};

export default ECGLoader;