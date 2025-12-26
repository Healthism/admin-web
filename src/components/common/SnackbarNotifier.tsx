import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../../redux/slices/notificationSlice';

const SnackbarNotifier: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: any) => state.notification || {});

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={!!open}
      autoHideDuration={4500}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      // offset slightly so it doesn't overlap the app's topbar
      sx={{ top: 88, right: 16 }}
    >
      <Alert onClose={handleClose} severity={severity || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotifier;
