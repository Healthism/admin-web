import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Divider,
  InputBase,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import CustomChip from '../../components/common/CustomChip';
import HTable from '../../components/common/HTable';
import CustomSelect from '../../components/common/CustomSelect';
import { getExport, getInvoice, getTransactions } from '../../redux/sagas/transactions/transactionsSagaAction';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const Transactions: React.FC = () => {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [type, setType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [payment, setPayment] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const dispatch = useDispatch();
  const { transactions, invoice } = useSelector((state: any) => state.transactions);

  // Use ref to track if initial load has happened
  const initialLoadDone = useRef(false);

  const handleView = (row: any) => {
    dispatch(getInvoice({ orderId: row.appointment_id }));
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  // Define columns inside component so it can access handleView
  const columns: any = [
    { id: 'appointment_id', label: 'Appointment ID', minWidth: 110 },
    { id: 'date', label: 'Date', minWidth: 90 },
    { id: 'type', label: 'Type', minWidth: 110 },
    { id: 'patient', label: 'Patient', minWidth: 110 },
    { id: 'provider', label: 'Provider', minWidth: 140 },

    {
      id: 'payment_status',
      label: 'Payment Status',
      minWidth: 110,
      render: (value: string) => (
        <CustomChip
          label={value}
          color={
            value === 'Paid'
              ? 'success'
              : value === 'Pending'
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
      id: 'amount', label: 'Amount', minWidth: 70,
      render: (value: string) => (
        <Typography fontWeight={500}>₹{value}</Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 110,
      render: (_: any, row: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => handleView(row)}>
            View
          </Button>
        </Box>
      ),
    },
  ];

  // Function to fetch transactions with filters
  const fetchTransactionsWithFilters = () => {
    const filters: any = {};

    if (startDate) filters.date_from = startDate;
    if (endDate) filters.date_to = endDate;
    if (type && type !== 'All Types') filters.type = type;
    if (payment && payment !== 'All Payments') filters.payment_status = payment;
    if (search.trim()) {
      filters.search = search.trim();
    }
    dispatch(getTransactions(filters));
  };

  // Initial load - only once on mount
  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchTransactionsWithFilters();
      initialLoadDone.current = true;
    }
  }, []);

  // Fetch when filters change - but skip on initial mount
  useEffect(() => {
    if (initialLoadDone.current) {
      fetchTransactionsWithFilters();
    }
  }, [startDate, endDate, type, status, payment, search]);

  const handleExport = () => {
    dispatch(getExport());
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />

        <Box sx={{ flexGrow: 1, padding: 2, paddingTop: '105px', bgcolor: '#f5f5f5' }}>
          <Typography fontWeight={600} fontSize={22}>Transactions</Typography>

          {/* Filters */}
          <Box display={'flex'} justifyContent='space-between' alignItems='center' mb={1}>
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <TextField
                type="date"
                value={startDate}
                label='Start Date'
                placeholder='Start Date'
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 1,
                  width: 140,
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

              <TextField
                type="date"
                value={endDate}
                label='End Date'
                placeholder='End Date'
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: '#fff',
                  width: 140,
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
                width={135}
                options={[
                  { label: "All Types", value: "All Types" },
                  { label: "Consultation", value: "consultation" },
                  { label: "Subscription", value: "subscription" },
                  { label: "Order", value: "order" },
                ]}
              />

              <CustomSelect
                value={payment}
                onChange={setPayment}
                placeholder="Select Payments"
                width={135}
                options={[
                  { label: "All Payments", value: "All Payments" },
                  { label: "Paid", value: "Paid" },
                  { label: "Pending", value: "Pending" },
                  { label: "Refunded", value: "refunded" },
                ]}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputBase
                placeholder="Search Transactions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ px: 2, py: 0.5, bgcolor: '#fff', borderRadius: 2, fontSize: 15, border: '1px solid #e5e7eb', width: 470 }}
              />
              <Button variant='contained' color="primary" onClick={handleExport} sx={{ ml: 2 , mr:1}}>Export</Button>
            </Box>
          </Box>

          {/* Table */}
          <HTable columns={columns} rows={transactions} defaultRowsPerPage={10} />
        </Box>
      </Box>

      {/* Invoice Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="invoice-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto',
        }}>
          {/* Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Typography variant="h5" fontWeight={600}>
              Invoice Details
            </Typography>
            <Button
              onClick={handleCloseModal}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <CloseIcon />
            </Button>
          </Box>

          {/* Invoice Content */}
          {invoice && (
            <Box sx={{ pt: 2, px: 3, pb: 2 }}>
              {/* Invoice ID and Date */}
              <Grid container spacing={2} >
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Invoice ID</Typography>
                  <Typography variant="body1" fontWeight={500}>{invoice.invoice_id}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Issued Date</Typography>
                  <Typography variant="body1" fontWeight={500}>{invoice.issued_date}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box >
                <Typography fontWeight={600} >Billing To</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">User ID</Typography>
                    <Typography variant="body1">{invoice.billing_to?.user_id}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">User Type</Typography>
                    <Typography variant="body1">{invoice.billing_to?.user_type}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Plan Details */}
              <Box>
                <Typography fontWeight={600} >Plan Details</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">Plan Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{invoice.plan_details?.plan_name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Price</Typography>
                    <Typography variant="body1">₹{invoice.plan_details?.price}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Validity</Typography>
                    <Typography variant="body2">
                      {invoice.plan_details?.validity?.start_date && formatDate(invoice.plan_details.validity.start_date)}
                      {' to '}
                      {invoice.plan_details?.validity?.end_date && formatDate(invoice.plan_details.validity.end_date)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Usage */}
              <Box>
                <Typography fontWeight={600} >Usage</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Orders Used</Typography>
                    <Typography variant="body1">{invoice.usage?.orders_used}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Max Orders Allowed</Typography>
                    <Typography variant="body1">{invoice.usage?.max_orders_allowed}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Payment Status */}
              <Box>
                <Typography fontWeight={600}>Payment</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <CustomChip
                      label={invoice.payment?.status}
                      color={invoice.payment?.status === 'paid' ? 'success' : 'warning'}
                      variant="filled"
                      size="small"
                      style={{ textTransform: 'capitalize', marginTop: '2px' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Auto Renew</Typography>
                    <Typography variant="body1">
                      {invoice.payment?.auto_renew ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Summary */}
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography fontWeight={600}>Summary</Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{invoice.summary?.subtotal}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">₹{invoice.summary?.tax}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" fontWeight={600}>Total Amount</Typography>
                  <Typography variant="body1" fontWeight={600}>₹{invoice.summary?.total_amount}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Footer Actions */}
          <Box sx={{
            p: 2,
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}>
            <Button variant="outlined" onClick={handleCloseModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Transactions;