import { Middleware } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';
import { showNotification } from '../slices/notificationSlice';

// Middleware inspects action types and shows success/error notifications.
const notificationMiddleware: Middleware = (store) => (next) => (action: any) => {
  // Let the action proceed first
  const result = next(action);

  try {
    const type: string = (action?.type as string) || '';

    // If the saga handles showing notifications itself (e.g. PROMO_CODES) or if
    // the action is related to DASHBOARD, skip middleware to avoid unwanted snackbars
    // for dashboard actions which are not user-facing operations.
    if (type.includes('_PROMO_CODES_') || type.includes('_DASHBOARD_')) {
      return result;
    }

    // Errors: if action ends with _FAIL show an error toast
    if (type.endsWith('_FAIL')) {
      const payload: any = action.payload;
      const message = (payload && (payload.message || payload)) || type;
      store.dispatch(showNotification({ message: String(message), severity: 'error' }));
      return result;
    }

    // Success: show messages for create/update-like actions: SEND, CREATE, UPDATE, PATCH
    if (type.endsWith('_SUCCESS')) {
      const payload: any = action.payload;

      // If API returned a message, show it.
      if (payload && (payload.message || payload.msg)) {
        const message = payload.message || payload.msg;
        store.dispatch(showNotification({ message: String(message), severity: 'success' }));
        return result;
      }

      // Otherwise, if this is a SEND/CREATE/UPDATE/PATCH action show a generic success message
      if (/(SEND|CREATE|UPDATE|PATCH)/i.test(type)) {
        store.dispatch(showNotification({ message: 'Operation completed successfully', severity: 'success' }));
        return result;
      }

      // Optional: show login success if present in type
      if (/LOGIN/i.test(type)) {
        const username = payload?.username || '';
        const message = payload?.message || (username ? `Welcome back ${username}` : 'Login successful');
        store.dispatch(showNotification({ message: String(message), severity: 'success' }));
        return result;
      }
    }
  } catch (e) {
    // ignore middleware errors
    // console.error('notification middleware failure', e);
  }

  return result;
};

export default notificationMiddleware;
