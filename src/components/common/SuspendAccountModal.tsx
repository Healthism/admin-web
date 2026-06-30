import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import CustomChip from './CustomChip';

const SUSPENSION_REASONS = [
  'Policy Violation',
  'Inactive Account',
  'Fraudulent Activity',
  'Payment Issues',
  'Temporary Investigation',
  'Fake Information Submitted',
  'Customer Complaints',
  'KYC Verification Failed',
  'Legal Compliance Issue',
  'Admin Decision',
  'Other',
];

const SUSPEND_DURATIONS = [
  { label: '7 Days', value: '7_days' },
  { label: '14 Days', value: '14_days' },
  { label: '30 Days', value: '30_days' },
  { label: '60 Days', value: '60_days' },
  { label: '90 Days', value: '90_days' },
  { label: 'Permanent', value: 'permanent' },
];

interface SuspendAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { reasons: string[]; duration: string }) => void;
  user: {
    name: string;
    role: string;
    registeredOn: string;
    subscription?: string;
    activeOrders?: number;
    pendingOrders?: number;
  } | null;
}

const SuspendAccountModal: React.FC<SuspendAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
  user,
}) => {
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [duration, setDuration] = React.useState('');
  const [otherReason, setOtherReason] = React.useState('');

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleConfirm = () => {
    const reasons = selectedReasons.includes('Other') && otherReason.trim()
      ? [...selectedReasons.filter((r) => r !== 'Other'), otherReason.trim()]
      : selectedReasons;
    onConfirm({ reasons, duration });
    setSelectedReasons([]);
    setDuration('');
    setOtherReason('');
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setDuration('');
    setOtherReason('');
    onClose();
  };

  if (!user) return null;

  const reasonDisplay = selectedReasons.length > 0 ? selectedReasons.join(', ') : '—';
  const durationDisplay =
    duration ? SUSPEND_DURATIONS.find((d) => d.value === duration)?.label || '—' : '—';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 0, pt: 2.5, px: 3 }}>
        <Box
          sx={{
            bgcolor: '#FFF3E0',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberIcon sx={{ color: '#E65100', fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Suspend Account
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Suspend {user.role} access temporarily.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2 }}>
        {/* User Info Card */}
        <Box
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            p: 2,
            mb: 3,
            mt: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight={600} fontSize={16} color="text.secondary">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize={16}>
              {user.name}
            </Typography>
            <CustomChip label={user.role} color="info" variant="filled" size="small" />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, mt: 1.5, flexWrap: 'wrap' }}>
            <Box>
              <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                Registered
              </Typography>
              <Typography fontSize={13} fontWeight={600}>
                {user.registeredOn}
              </Typography>
            </Box>
            {user.subscription && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Subscription
                </Typography>
                <Typography fontSize={13} fontWeight={600} color="primary">
                  {user.subscription}
                </Typography>
              </Box>
            )}
            {user.activeOrders !== undefined && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Active Orders
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {user.activeOrders}
                </Typography>
              </Box>
            )}
            {user.pendingOrders !== undefined && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Pending Orders
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {user.pendingOrders}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Reason for Suspension */}
        <Typography fontWeight={600} fontSize={14} mb={1}>
          Reason for Suspension <span style={{ color: '#d32f2f' }}>*</span>
        </Typography>
        <FormGroup sx={{ mb: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {SUSPENSION_REASONS.map((reason) => (
              <FormControlLabel
                key={reason}
                control={
                  <Checkbox
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    size="small"
                  />
                }
                label={<Typography fontSize={14}>{reason}</Typography>}
              />
            ))}
          </Box>
          {selectedReasons.includes('Other') && (
            <TextField
              fullWidth
              size="small"
              placeholder="Please specify the reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 14 } }}
            />
          )}
        </FormGroup>

        {/* Suspend For */}
        <Typography fontWeight={600} fontSize={14} mb={1}>
          Suspend For <span style={{ color: '#d32f2f' }}>*</span>
        </Typography>
        <FormControl fullWidth sx={{ mb: 0.5 }}>
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            displayEmpty
            size="small"
            sx={{ borderRadius: 2, fontSize: 14 }}
            renderValue={(val) => (val ? SUSPEND_DURATIONS.find((d) => d.value === val)?.label : 'Select duration')}
          >
            {SUSPEND_DURATIONS.map((d) => (
              <MenuItem key={d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography fontSize={12} color="text.secondary" mb={2}>
          Suspension expiry will be calculated automatically.
        </Typography>

        {/* Suspension Notice Preview */}
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            p: 2,
            mb: 2,
            borderLeft: '4px solid #bdbdbd',
          }}
        >
          <Typography fontSize={12} fontWeight={700} color="text.secondary" mb={1} textTransform="uppercase">
            Account Suspension Notice
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography fontSize={13} mb={0.5}>
            Your account has been temporarily suspended by Healthizm Admin.
          </Typography>
          <Typography fontSize={13}>
            <strong>Reason:</strong> {reasonDisplay}
          </Typography>
          <Typography fontSize={13} mb={1}>
            <strong>Duration:</strong> {durationDisplay}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            For assistance, please contact support.
          </Typography>
        </Box>

        {/* Important Warning */}
        <Box
          sx={{
            bgcolor: '#FFF3E0',
            border: '1px solid #FFCC80',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
          }}
        >
          <ErrorOutlineIcon sx={{ color: '#E65100', fontSize: 20, mt: 0.25 }} />
          <Box>
            <Typography fontSize={13} fontWeight={700} color="#E65100">
              Important
            </Typography>
            <Typography fontSize={12} color="#BF360C">
              Existing orders will remain visible. New bookings and transactions will be blocked
              until the suspension is removed.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={selectedReasons.length === 0 || !duration}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          Confirm Suspension
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendAccountModal;
