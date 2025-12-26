import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error';

interface NotificationState {
  open: boolean;
  message: string | null;
  severity: NotificationSeverity;
}

const initialState: NotificationState = {
  open: false,
  message: null,
  severity: 'info',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<{ message: string; severity?: NotificationSeverity }>) {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
    },
    hideNotification(state) {
      state.open = false;
      state.message = null;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
