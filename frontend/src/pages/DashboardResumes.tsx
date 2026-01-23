import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  IconButton, 
  Box, 
  Button,
  Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import * as resumesApi from '../api/resumes';

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
  return null;
}

export default function DashboardResumes({ user }: { user: any }) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumesApi.listResumes();
      setResumes(data.data || []);
    } catch (e: any) {
      console.error('Failed to load resumes', e);
      alert('Erro ao carregar curriculos: ' + (e.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/resumes/${id}`);
  };

  const handleDelete = (id: number) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!toDelete) return;
    try {
      await resumesApi.deleteResume(toDelete);
      setConfirmOpen(false);
      setToDelete(null);
      await loadResumes();
    } catch (e) {
      console.error('Delete failed', e);
      alert('Falha ao excluir');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Lista de Curriculos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={renderIconSafe(AddIcon)}
          onClick={() => navigate('/resumes/new')}
        >
          Criar Novo
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Habilidades</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : resumes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum curriculo encontrado
                </TableCell>
              </TableRow>
            ) : (
              resumes.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{r.personal_info?.name || '-'}</TableCell>
                  <TableCell>{r.personal_info?.email || '-'}</TableCell>
                  <TableCell>{r.personal_info?.city || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {r.skills?.slice(0, 3).map((skill: string, idx: number) => (
                        <Chip key={idx} label={skill} size="small" />
                      ))}
                      {r.skills?.length > 3 && (
                        <Chip label={`+${r.skills.length - 3}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{r.user?.name || '-'}</TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Box>
                      <IconButton onClick={() => handleEdit(r.id)} title="Editar">
                        {renderIconSafe(EditIcon)}
                      </IconButton>
                      <IconButton onClick={() => handleDelete(r.id)} title="Excluir">
                        {renderIconSafe(DeleteIcon, { color: 'error' })}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir curriculo"
        message="Deseja realmente excluir este curriculo?"
        onConfirm={performDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Paper>
  );
}
