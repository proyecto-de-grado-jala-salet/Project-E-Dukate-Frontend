import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { Button } from '../Button';
import { FaRegUserCircle } from 'react-icons/fa';
import { LiaUserNurseSolid } from 'react-icons/lia';

interface RoleSelectorProps {
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const router = useRouter();
  
  useEffect(() => {
    router.prefetch('/dashboard/usuarios/agregar/administrador');
    router.prefetch('/dashboard/usuarios/agregar/especialista');
  }, [router]);

  const handleRoleSelect = (role: string) => {
    onRoleSelect(role);
    const rolePath = role === 'Administrator' ? 'administrador' : 'especialista';
    router.push(`/dashboard/usuarios/agregar/${rolePath}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        width: '100%',
        mb: 3,
      }}
    >
      <Button
        label="Administrador"
        startIcon={<FaRegUserCircle size={37} />}
        variant={selectedRole === 'Administrator' ? 'contained' : 'outlined'}
        onClick={() => handleRoleSelect('Administrator')}
        sx={{
          flex: 1,
          bgcolor: selectedRole === 'Administrator' ? '#04633c' : '#fff',
          color: selectedRole === 'Administrator' ? 'white' : 'black',
          borderColor: '#04633c',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 4,
          py: 1.5,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '30px',
        }}
      />
      <Button
        label="Especialista"
        startIcon={<LiaUserNurseSolid size={45} />}
        variant={selectedRole === 'Specialist' ? 'contained' : 'outlined'}
        onClick={() => handleRoleSelect('Specialist')}
        sx={{
          flex: 1,
          bgcolor: selectedRole === 'Specialist' ? '#04633c' : '#fff',
          color: selectedRole === 'Specialist' ? 'white' : 'black',
          borderColor: '#04633c',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 4,
          py: 1.5,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '30px',
        }}
      />
    </Box>
  );
};