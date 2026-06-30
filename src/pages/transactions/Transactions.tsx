import React, { useEffect } from 'react';
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
  const [payment, setPayment] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const dispatch = useDispatch();
  const { transactions, invoice } = useSelector((state: any) => state.transactions);

  const handleView = (row: any) => {
    dispatch(getInvoice({ orderId: row.appointment_id }));
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  // Define columns inside component so it can access handleView
  const columns: any = [
    { id: 'appointment_id', label: 'Transaction ID', minWidth: 110 },
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

  useEffect(() => {
    const filters: any = {};

    if (startDate) filters.date_from = startDate;
    if (endDate) filters.date_to = endDate;
    if (type && type !== 'All Types') filters.type = type;
    if (payment && payment !== 'All Payments') filters.payment_status = payment;
    if (search.trim()) {
      filters.search = search.trim();
    }
    dispatch(getTransactions(filters));
  }, [dispatch, startDate, endDate, type, payment, search]);

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
                  // { label: "Consultation", value: "consultation" },
                  { label: "Subscription", value: "subscription" },
                  { label: "Order", value: "order" },
                  { label: "Broadcast", value: "broadcast" },
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
                  // { label: "Pending", value: "Pending" },
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
              <Grid container spacing={2}>
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

              {/* Order Details (pharmacy/lab orders, broadcast) */}
              {invoice.order_details && (
                <>
                  <Box>
                    <Typography fontWeight={600}>Order Details</Typography>
                    <Grid container spacing={2}>
                      {invoice.order_details.patient_name && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Patient</Typography>
                          <Typography variant="body1">{invoice.order_details.patient_name}</Typography>
                        </Grid>
                      )}
                      {invoice.order_details.health_id && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Health ID</Typography>
                          <Typography variant="body1">{invoice.order_details.health_id}</Typography>
                        </Grid>
                      )}
                      {invoice.order_details.doctor_name && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Doctor</Typography>
                          <Typography variant="body1">{invoice.order_details.doctor_name}</Typography>
                        </Grid>
                      )}
                      {invoice.order_details.pharmacy_name && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Pharmacy</Typography>
                          <Typography variant="body1">{invoice.order_details.pharmacy_name}</Typography>
                        </Grid>
                      )}
                      {invoice.order_details.lab_name && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Lab</Typography>
                          <Typography variant="body1">{invoice.order_details.lab_name}</Typography>
                        </Grid>
                      )}
                      {invoice.order_details.status && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <CustomChip
                            label={invoice.order_details.status}
                            color={invoice.order_details.status === 'delivered' ? 'success' : invoice.order_details.status === 'cancelled' ? 'error' : 'warning'}
                            variant="filled"
                            size="small"
                            style={{ textTransform: 'capitalize', marginTop: '2px' }}
                          />
                        </Grid>
                      )}
                      {invoice.order_details.delivery_address && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Delivery Address</Typography>
                          <Typography variant="body1">{invoice.order_details.delivery_address}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Items Table (pharmacy/lab orders) */}
              {invoice.items && invoice.items.length > 0 && (
                <>
                  <Box>
                    <Typography fontWeight={600} mb={1}>Items</Typography>
                    <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', bgcolor: '#f9fafb', px: 2, py: 1 }}>
                        <Typography variant="body2" fontWeight={600}>Name</Typography>
                        <Typography variant="body2" fontWeight={600} textAlign="center">Qty</Typography>
                        <Typography variant="body2" fontWeight={600} textAlign="right">Price</Typography>
                        <Typography variant="body2" fontWeight={600} textAlign="right">Total</Typography>
                      </Box>
                      {invoice.items.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', px: 2, py: 0.75, borderTop: '1px solid #f0f0f0' }}>
                          <Typography variant="body2">{item.name}{item.dosage ? ` (${item.dosage})` : ''}</Typography>
                          <Typography variant="body2" textAlign="center">{item.qty}</Typography>
                          <Typography variant="body2" textAlign="right">₹{item.price}</Typography>
                          <Typography variant="body2" textAlign="right">₹{item.total}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Billing To (subscription invoices) */}
              {invoice.billing_to && (
                <>
                  <Box>
                    <Typography fontWeight={600}>Billing To</Typography>
                    <Grid container spacing={2}>
                      {invoice.billing_to.name && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Name</Typography>
                          <Typography variant="body1">{invoice.billing_to.name}</Typography>
                        </Grid>
                      )}
                      {invoice.billing_to.provider && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Provider</Typography>
                          <Typography variant="body1">{invoice.billing_to.provider}</Typography>
                        </Grid>
                      )}
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">User ID</Typography>
                        <Typography variant="body1">{invoice.billing_to.user_id}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">User Type</Typography>
                        <Typography variant="body1">{invoice.billing_to.user_type}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Plan Details (subscription invoices) */}
              {invoice.plan_details && (
                <>
                  <Box>
                    <Typography fontWeight={600}>Plan Details</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">Plan Name</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {invoice.plan_details.plan_name}
                          {invoice.plan_details.plan_type ? ` (${invoice.plan_details.plan_type})` : ''}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Price</Typography>
                        <Typography variant="body1">₹{invoice.plan_details.price}</Typography>
                      </Grid>
                      {invoice.plan_details.validity?.start_date && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Validity</Typography>
                          <Typography variant="body2">
                            {formatDate(invoice.plan_details.validity.start_date)}
                            {' to '}
                            {invoice.plan_details.validity?.end_date && formatDate(invoice.plan_details.validity.end_date)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Usage (subscription invoices) */}
              {invoice.usage && (
                <>
                  <Box>
                    <Typography fontWeight={600}>Usage</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Orders Used</Typography>
                        <Typography variant="body1">{invoice.usage.orders_used}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Max Orders Allowed</Typography>
                        <Typography variant="body1">{invoice.usage.max_orders_allowed === -1 ? 'Unlimited' : invoice.usage.max_orders_allowed}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Payment */}
              {invoice.payment && (
                <>
                  <Box>
                    <Typography fontWeight={600}>Payment</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <CustomChip
                          label={invoice.payment.payment_status || invoice.payment.status}
                          color={
                            (invoice.payment.payment_status || invoice.payment.status) === 'paid' ? 'success'
                            : (invoice.payment.payment_status || invoice.payment.status) === 'refunded' ? 'error'
                            : 'warning'
                          }
                          variant="filled"
                          size="small"
                          style={{ textTransform: 'capitalize', marginTop: '2px' }}
                        />
                      </Grid>
                      {invoice.payment.razorpay_order_id && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Razorpay Order ID</Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{invoice.payment.razorpay_order_id}</Typography>
                        </Grid>
                      )}
                      {(invoice.payment.payment_id || invoice.payment.razorpay_payment_id) && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Payment ID</Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{invoice.payment.payment_id || invoice.payment.razorpay_payment_id}</Typography>
                        </Grid>
                      )}
                      {invoice.payment.auto_renew !== undefined && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Auto Renew</Typography>
                          <Typography variant="body1">{invoice.payment.auto_renew ? 'Yes' : 'No'}</Typography>
                        </Grid>
                      )}
                      {invoice.payment.coupon_applied && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Coupon Applied</Typography>
                          <Typography variant="body1">{invoice.payment.coupon_applied}</Typography>
                        </Grid>
                      )}
                      {invoice.payment.transaction_date && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Transaction Date</Typography>
                          <Typography variant="body1">{formatDate(invoice.payment.transaction_date)}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Summary */}
              {invoice.summary && (
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <Typography fontWeight={600}>Summary</Typography>
                  {(invoice.summary.subtotal !== undefined || invoice.summary.base_price !== undefined) && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{invoice.summary.base_price !== undefined ? 'Base Price' : 'Subtotal'}</Typography>
                      <Typography variant="body2">₹{invoice.summary.subtotal ?? invoice.summary.base_price}</Typography>
                    </Box>
                  )}
                  {(invoice.summary.gst_amount !== undefined || invoice.summary.tax !== undefined) && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{invoice.summary.gst_amount !== undefined ? 'GST' : 'Tax'}</Typography>
                      <Typography variant="body2">₹{invoice.summary.gst_amount ?? invoice.summary.tax}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={600}>Total Amount</Typography>
                    <Typography variant="body1" fontWeight={600}>₹{invoice.summary.total_amount}</Typography>
                  </Box>
                </Box>
              )}
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