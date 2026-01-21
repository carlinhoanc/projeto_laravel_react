import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onClose }: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirmar'}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>Excluir</Button>
      </DialogActions>
    </Dialog>
  );
}
