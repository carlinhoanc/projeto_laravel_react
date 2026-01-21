// ASCII file - normalized encoding
import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Alert, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register, setAuthToken } from '../auth';

export default function Register({ onRegister }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await register(name, email, password);
      setAuthToken(response.token);
      onRegister(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar');
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: 480 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Criar Conta
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Nome" fullWidth required value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
          <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mt: 2 }} />
          <TextField label="Senha" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mt: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" type="submit">
              Registrar
            </Button>
            <Button variant="text" onClick={() => navigate('/login')}>
              Ja tem conta?
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
