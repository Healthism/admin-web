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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

interface SuspensionHistoryEntry {
  date: string;
  action: 'Suspended' | 'Unsuspended';
  admin: string;
  reason: string;
}

interface RestoreAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { reasons: string[]; duration: string }) => void;
  user: {
    name: string;
    role: string;
    suspension?: {
      reason?: string;
      duration_days?: number;
      suspended_at?: string;
      suspended_until?: string;
      admin_notes?: string | null;
    } | null;
    suspensionHistory?: SuspensionHistoryEntry[];
  } | null;
}

const DURATION_DAYS_TO_VALUE: Record<number, string> = {
  0: 'permanent',
  7: '7_days',
  14: '14_days',
  30: '30_days',
  60: '60_days',
  90: '90_days',
};

const RestoreAccountModal: React.FC<RestoreAccountModalProps> = ({
  open,
  onClose,
  onConfirm,
  user,
}) => {
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [duration, setDuration] = React.useState('');

  React.useEffect(() => {
    if (open && user?.suspension) {
      const s = user.suspension;

      if (s.reason) {
        const apiReasons = s.reason.split(',').map((r) => r.trim());
        const matched = apiReasons.filter((r) => SUSPENSION_REASONS.includes(r));
        const unmatched = apiReasons.filter((r) => !SUSPENSION_REASONS.includes(r));
        if (unmatched.length > 0 && !matched.includes('Other')) {
          matched.push('Other');
        }
        setSelectedReasons(matched);
      }

      if (s.duration_days !== undefined) {
        setDuration(DURATION_DAYS_TO_VALUE[s.duration_days] || '');
      }

    }
  }, [open, user]);

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleConfirm = () => {
    onConfirm({ reasons: selectedReasons, duration });
    setSelectedReasons([]);
    setDuration('');
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setDuration('');
    onClose();
  };

  if (!user) return null;

  const history = user.suspensionHistory || [];
  const suspension = user.suspension;

  const suspendedOn = suspension?.suspended_at
    ? new Date(suspension.suspended_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : undefined;

  const suspensionReason = suspension?.reason || undefined;

  const suspensionDuration = suspension?.duration_days !== undefined
    ? suspension.duration_days === 0 ? 'Permanent' : `${suspension.duration_days} Days`
    : undefined;

  const remaining = (() => {
    if (!suspension?.suspended_until) return undefined;
    const until = new Date(suspension.suspended_until);
    const now = new Date();
    const diffMs = until.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${days} days`;
  })();

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
            bgcolor: '#E8F5E9',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: '#2E7D32', fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            Restore Account Access
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Reactivate this {user.role} account.
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
                bgcolor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography fontWeight={600} fontSize={16} color="#2E7D32">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize={16}>
              {user.name}
            </Typography>
            <CustomChip label={user.role} color="info" variant="filled" size="small" />
          </Box>
          <Box sx={{ display: 'flex', gap: 4, mt: 1.5, flexWrap: 'wrap' }}>
            {suspendedOn && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Suspended On
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {suspendedOn}
                </Typography>
              </Box>
            )}
            {suspensionReason && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Reason
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {suspensionReason}
                </Typography>
              </Box>
            )}
            {suspensionDuration && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Duration
                </Typography>
                <Typography fontSize={13} fontWeight={600}>
                  {suspensionDuration}
                </Typography>
              </Box>
            )}
            {remaining && (
              <Box>
                <Typography fontSize={11} color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Remaining
                </Typography>
                <Typography fontSize={13} fontWeight={600} color="#2E7D32">
                  {remaining}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Reason for Suspension (read-only context) */}
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

        {/* Restoration Notice */}
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            p: 2,
            mb: 2,
            borderLeft: '4px solid #4CAF50',
          }}
        >
          <Typography fontSize={12} fontWeight={700} color="text.secondary" mb={1} textTransform="uppercase">
            Account Restored Successfully
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography fontSize={13} mb={0.5}>
            Your account has been reactivated by Healthizm Admin.
          </Typography>
          <Typography fontSize={13} mb={0.5}>
            You may now continue using all services without restrictions.
          </Typography>
          <Typography fontSize={13}>
            Thank you.
          </Typography>
        </Box>

        {/* Previous Suspension History */}
        {history.length > 0 && (
          <>
            <Typography fontWeight={700} fontSize={14} mb={1} textTransform="uppercase">
              Previous Suspension History
            </Typography>
            <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f9fafb' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Admin</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: 13 }}>{entry.date}</TableCell>
                      <TableCell>
                        <CustomChip
                          label={entry.action}
                          color={entry.action === 'Suspended' ? 'error' : 'success'}
                          variant="filled"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{entry.admin}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{entry.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}

        {/* Success Info Banner */}
        <Box
          sx={{
            bgcolor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
          <Typography fontSize={12} color="#1B5E20">
            Account access and services will be restored immediately after confirmation.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          sx={{ borderRadius: 2, textTransform: 'none', px: 3, color: '#fff' }}
        >
          Confirm Restoration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreAccountModal;
