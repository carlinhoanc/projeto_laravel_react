import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

export default function UserEditDialog({ open, user, onClose, onSave, isAdmin }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState<'user'|'admin'>('user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAccess(user.access_level || 'user');
      setPassword('');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ name, email, password: password || undefined, access_level: isAdmin ? access : undefined });
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'grid', gap: 2 }}>
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Senha (deixe em branco para manter)" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          {isAdmin && (
            <FormControl fullWidth>
              <InputLabel id="access-label">Nivel</InputLabel>
              <Select labelId="access-label" value={access} label="Nivel" onChange={(e) => setAccess(e.target.value as any)}>
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
