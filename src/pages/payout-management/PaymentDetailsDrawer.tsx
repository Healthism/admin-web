import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CustomChip from '../../components/common/CustomChip';
import { useDispatch, useSelector } from 'react-redux';
import {
  payPayout,
  updatePayoutStatus,
} from '../../redux/sagas/payouts/payoutsSagaAction';

interface PaymentDetailsDrawerProps {
  open: boolean;
  payout: any;
  onClose: () => void;
}

const formatAmount = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0.00';
  return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: 14,
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#00A5A5' },
    '&.Mui-focused fieldset': { borderColor: '#00A5A5' },
  },
};

const PaymentDetailsDrawer: React.FC<PaymentDetailsDrawerProps> = ({ open, payout, onClose }) => {
  const dispatch = useDispatch();
  const adminProfile = useSelector((state: any) => state.profile?.adminProfile);
  const adminName = adminProfile?.personal_info?.full_name || 'Admin';

  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [utrReference, setUtrReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (payout) {
      setAmountPaid(payout.pending_amount ?? payout.net_payable ?? '');
      setPaymentMethod('bank_transfer');
      setUtrReference('');
      setPaymentDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [payout]);

  if (!payout) return null;

  const handleMarkAsFailed = () => {
    // dispatch(updatePayoutStatus({
    //   payoutId: payout.settlement_id,
    //   status: 'failed',
    //   utr_reference: utrReference || undefined,
    // }));
    onClose();
  };

  const handleSavePayment = () => {
    dispatch(payPayout({
      pharmacyId: payout.pharmacy_id,
      utr_reference: utrReference,
      amount: amountPaid ? Number(amountPaid) : undefined,
    }));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 24,
          transform: 'translateY(-50%)',
          width: 380,
          maxHeight: '92vh',
          bgcolor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(16,30,54,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          pb: 1.5,
        }}>
          <Typography fontWeight={700} fontSize={18}>Settlement Details</Typography>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f3f4f6' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2.5, pb: 2.5 }}>
          {/* Summary card */}
          <Box sx={{
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            p: 2,
            mb: 2,
          }}>
            <Box sx={{ display: 'flex' }}>
              <CustomChip
                label={payout.settlement_id || payout.pharmacy_id || '—'}
                color="info"
                variant="filled"
                size="small"
              />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Provider</Typography>
            <Typography fontWeight={700} fontSize={16} mb={1.5}>
              {payout.pharmacy_name || '—'}{payout.type ? ` (${payout.type})` : ''}
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Total Earnings</Typography>
                <Typography fontWeight={600} fontSize={15}>₹{formatAmount(payout.gross_amount)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">RazorPay Commission</Typography>
                <Typography fontWeight={600} fontSize={15}>₹{formatAmount(payout.razorpay_fee)}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary" display="block">Net Payable</Typography>
                <Typography fontWeight={700} fontSize={15} color="primary">₹{formatAmount(payout.net_payable)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', display: 'inline-block' }} />
                Already Paid <Box component="span" fontWeight={700} color="#22c55e" ml={0.5}>₹{formatAmount(payout.paid_amount)}</Box>
              </Typography>
              <Typography variant="body2">
                Pending <Box component="span" fontWeight={700} ml={0.5}>₹{formatAmount(payout.pending_amount)}</Box>
              </Typography>
            </Box>
          </Box>

          {/* Bank Details */}
          <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '14px', p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <AccountBalanceIcon sx={{ color: '#00a6bb', fontSize: 20 }} />
              <Typography fontWeight={700} fontSize={13} letterSpacing={0.3}>BANK DETAILS</Typography>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Account Holder</Typography>
                <Typography fontWeight={600} fontSize={14}>{payout.bank?.account_holder_name || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Account Number</Typography>
                <Typography fontWeight={600} fontSize={14}>{payout.bank?.account_number || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">IFSC Code</Typography>
                <Typography fontWeight={600} fontSize={14}>{payout.bank?.ifsc_code || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Bank Name</Typography>
                <Typography fontWeight={600} fontSize={14}>{payout.bank?.bank_name || '—'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Manual Payment Entry */}
          <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '14px', p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <ReceiptLongIcon sx={{ color: '#00a6bb', fontSize: 20 }} />
              <Typography fontWeight={700} fontSize={13} letterSpacing={0.3}>MANUAL PAYMENT ENTRY</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Record a manual payment
            </Typography>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} mb={1.5}>
              <TextField
                label="Amount Paid *"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                size="small"
                type="number"
                placeholder="Enter amount"
                sx={fieldSx}
              />
              <TextField
                select
                label="Payment Method *"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                size="small"
                sx={fieldSx}
              >
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </TextField>
            </Box>

            <TextField
              label="Transaction ID / UTR *"
              value={utrReference}
              onChange={(e) => setUtrReference(e.target.value)}
              size="small"
              fullWidth
              placeholder="Enter UTR / ID"
              sx={{ ...fieldSx, mb: 1.5 }}
            />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} mb={1.5}>
              <TextField
                label="Payment Date *"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                label="Paid By"
                value={adminName}
                size="small"
                disabled
                sx={fieldSx}
              />
            </Box>

            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={2}
              placeholder="Add notes (optional)"
              sx={fieldSx}
            />
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{
          display: 'flex',
          gap: 1.5,
          p: 2.5,
          pt: 0,
        }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            disabled={!utrReference || !amountPaid || !paymentDate}
            onClick={handleSavePayment}
            sx={{
              bgcolor: '#16a34a',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { bgcolor: '#15803d' },
            }}
          >
            Save Payment
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<CloseIcon />}
            disabled={!payout.settlement_id}
            onClick={handleMarkAsFailed}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Mark as Failed
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentDetailsDrawer;
