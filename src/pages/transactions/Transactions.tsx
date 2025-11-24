import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import CustomChip from '../../components/common/CustomChip';
import HTable from '../../components/common/HTable';
import CustomSelect from '../../components/common/CustomSelect';

const transactionRows = [
  {
    id: 'APT001',
    type: 'Consultation',
    patient: 'John Doe',
    provider: 'Dr. Sarah Smith',
    status: 'completed',
    paymentStatus: 'paid',
    amount: '$150',
  },
  {
    id: 'APT002',
    type: 'Lab Test',
    patient: 'Jane Wilson',
    provider: 'City Lab',
    status: 'pending',
    paymentStatus: 'pending',
    amount: '$85',
  },
  {
    id: 'APT003',
    type: 'Pharmacy',
    patient: 'Mike Johnson',
    provider: 'HealthCare Pharmacy',
    status: 'completed',
    paymentStatus: 'paid',
    amount: '$45',
  },
  {
    id: 'APT004',
    type: 'Consultation',
    patient: 'Sarah Brown',
    provider: 'Dr. Michael Brown',
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: '$120',
  }, {
    id: 'APT005',
    type: 'Consultation',
    patient: 'Sarah Brown',
    provider: 'Dr. Michael Brown',
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: '$120',
  }, {
    id: 'APT006',
    type: 'Consultation',
    patient: 'Sarah Brown',
    provider: 'Dr. Michael Brown',
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: '$120',
  },
];

const columns: any = [
  { id: 'id', label: 'Appointment ID', minWidth: 120 },
  { id: 'type', label: 'Type', minWidth: 120 },
  { id: 'patient', label: 'Patient', minWidth: 120 },
  { id: 'provider', label: 'Provider', minWidth: 150 },

  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    render: (value: string) => (
      <CustomChip
        label={value}
        color={
          value === 'completed'
            ? 'success'
            : value === 'cancelled'
              ? 'error'
              : value === 'pending'
                ? 'warning'
                : 'default'
        }
        variant="filled"
        size="small"
        style={{ textTransform: 'capitalize' }}
      />
    ),
  },

  {
    id: 'paymentStatus',
    label: 'Payment Status',
    minWidth: 100,
    render: (value: string) => (
      <CustomChip
        label={value}
        color={
          value === 'paid'
            ? 'success'
            : value === 'refunded'
              ? 'info'
              : value === 'pending'
                ? 'warning'
                : 'default'
        }
        variant="filled"
        size="small"
        style={{ textTransform: 'capitalize' }}
      />
    ),
  },

  { id: 'amount', label: 'Amount', minWidth: 60 },

  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    render: (_: any, row: any) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small">View</Button>

        {row.paymentStatus === 'paid' && (
          <Button variant="contained" color="error" size="small">Refund</Button>
        )}
      </Box>
    ),
  },
];

const Transactions: React.FC = () => {
  const [dateRange, setDateRange] = React.useState('');
  const [type, setType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [payment, setPayment] = React.useState('');

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />

        <Box sx={{ flexGrow: 1, padding: 2, paddingTop: '105px', bgcolor: '#f5f5f5' }}>
          <Typography fontWeight={600} fontSize={22}>Transactions</Typography>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <TextField
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                bgcolor: '#fff',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  fontSize: 15,
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00A5A5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00A5A5',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px 14px',
                },
              }}
            />

            <CustomSelect
              value={type}
              onChange={setType}
              placeholder="Select Type"
              width={150}
              options={[
                { label: "All Types", value: "All Types" },
                { label: "Consultation", value: "Consultation" },
                { label: "Lab Test", value: "Lab Test" },
                { label: "Pharmacy", value: "Pharmacy" },
              ]}
            />

            <CustomSelect
              value={status}
              onChange={setStatus}
              placeholder="Select Status"
              width={150}
              options={[
                { label: "All Status", value: "All Status" },
                { label: "Completed", value: "completed" },
                { label: "Pending", value: "pending" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />

            <CustomSelect
              value={payment}
              onChange={setPayment}
              placeholder="Select Payments"
              width={150}
              options={[
                { label: "All Payments", value: "All Payments" },
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
                { label: "Refunded", value: "refunded" },
              ]}
            />
          </Box>

          {/* Table */}
          <HTable columns={columns} rows={transactionRows} defaultRowsPerPage={5} />
        </Box>
      </Box>
    </Box>
  );
};

export default Transactions;
