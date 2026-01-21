// ASCII file - normalized encoding
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth';

export default function Dashboard({ user }: any) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {user.name}!
      </Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Nivel de Acesso: {user.access_level}</Typography>

      <Box sx={{ mt: 3 }}>
        {user.access_level === 'admin' && (
          <Button variant="contained" onClick={() => navigate('/users')} sx={{ mr: 2 }}>
            Ver Usuarios
          </Button>
        )}
      </Box>
    </Paper>
  );
}
