import React, { useEffect, useState } from 'react';
import { Paper, TextField, Typography, Button, Box, Alert } from '@mui/material';
import { getCurrentUser, updateProfile } from '../auth';

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getCurrentUser();
      if (res) {
        setUser(res.user);
        setName(res.user.name);
        setEmail(res.user.email);
      }
    })();
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateProfile({ name, email, password: password || undefined });
      setUser(updated);
      setPassword('');
      setSuccess('Perfil atualizado');
    } catch (e: any) {
      setError(e.message || 'Erro');
    }
  };

  if (!user) return <Typography>Carregando...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Meu Perfil</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Senha (deixe em branco para manter)" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </Box>
      </Box>
    </Paper>
  );
}
