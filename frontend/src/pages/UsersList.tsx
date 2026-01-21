// ASCII file - normalized encoding
import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsers, updateUser, deleteUser } from '../auth';
import type { User } from '../auth';
import UserEditDialog from '../components/UserEditDialog';
import ConfirmDialog from '../components/ConfirmDialog';

const norm = (c: any) => (c && c.default ? c.default : c);

function renderIconSafe(c: any, props: any = {}) {
  const comp = norm(c);
  if (typeof comp === 'function' || (typeof comp === 'object' && comp !== null)) {
    try {
      return React.createElement(comp, props);
    } catch (e) {
      console.error('Failed to create icon element', e, comp);
      return null;
    }
  }
  console.warn('Icon is not a component, skipping', { c, comp });
  return null;
}

console.log('UsersList: component types', {
  EditIcon: typeof EditIcon,
  normEdit: typeof norm(EditIcon),
  DeleteIcon: typeof DeleteIcon,
  normDelete: typeof norm(DeleteIcon),
  UserEditDialog: typeof UserEditDialog,
  ConfirmDialog: typeof ConfirmDialog,
});
export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (u: User) => {
    setSelected(u);
    setEditOpen(true);
  };

  const handleSave = async (payload: any) => {
    if (!selected) return;
    await updateUser(selected.id, payload);
    await load();
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteUser(selected.id);
    setConfirmOpen(false);
    setSelected(null);
    await load();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lista de Usuarios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.access_level}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleString('pt-BR')}</TableCell>
                <TableCell>
                  <Box>
                    <IconButton onClick={() => handleEdit(u)} title="Editar">
                      {renderIconSafe(EditIcon)}
                    </IconButton>
                    <IconButton onClick={() => { setSelected(u); setConfirmOpen(true); }} title="Excluir">
                      {renderIconSafe(DeleteIcon, { color: 'error' })}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserEditDialog open={editOpen} user={selected} onClose={() => setEditOpen(false)} onSave={handleSave} isAdmin />
      <ConfirmDialog open={confirmOpen} title="Confirmar exclusao" message={`Deseja excluir ${selected?.name}?`} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
    </Paper>
  );
}
