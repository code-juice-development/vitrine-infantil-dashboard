import React, { HTMLProps } from 'react';
import { PaletteProps, SpacingProps } from '@material-ui/system';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

interface ModalDelete extends HTMLProps<PaletteProps & SpacingProps> {
  open: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}

const ModalDelete: React.FC<ModalDelete> = ({ open, onSubmit, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <DialogContentText>
          Deseja realmente deletar o registro?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Sim
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
