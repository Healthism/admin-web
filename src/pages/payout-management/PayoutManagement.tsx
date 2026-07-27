import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, InputBase } from "@mui/material";
import { FileDownloadOutlined as ExportIcon } from "@mui/icons-material";
import Sidebar from "../../components/dashboard/Sidebar";
import TopBar from "../../components/dashboard/Topbar";
import CustomChip from "../../components/common/CustomChip";
import HTable from "../../components/common/HTable";
import CustomSelect from "../../components/common/CustomSelect";
import OverviewCards from "../../components/dashboard/OverviewCard";
import PaymentDetailsDrawer from "./PaymentDetailsDrawer";
import {
  FaWallet,
  FaMoneyCheckAlt,
  FaHourglassHalf,
  FaCalendarDay,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayouts,
  getPayoutsSummary,
  getRazorpaySettlements,
  exportPayouts,
  exportRazorpaySettlements,
} from "../../redux/sagas/payouts/payoutsSagaAction";

const formatAmount = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(Number(value)))
    return "0.00";
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const statusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "completed":
    case "settled":
    case "success":
    case "processed":
    case "paid":
      return "success";
    case "processing":
    case "created":
      return "info";
    case "pending":
    case "payable":
      return "warning";
    case "failed":
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const PayoutManagement: React.FC = () => {
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const { payouts, summary, razorpaySettlements } = useSelector(
    (state: any) => state.payouts,
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const filters: any = {};
    if (status && status !== "All") filters.status = status;
    if (provider && provider !== "All") filters.provider = provider;
    if (startDate) filters.from = startDate;
    if (endDate) filters.to = endDate;
    if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();

    dispatch(getPayouts(filters));
  }, [dispatch, status, provider, startDate, endDate, debouncedSearch]);

  useEffect(() => {
    dispatch(getPayoutsSummary());
    dispatch(getRazorpaySettlements({ count: 50 }));
  }, [dispatch]);

  const handleRowClick = (row: any) => {
    setSelectedPayout(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const columns: any = [
    { id: "pharmacy_name", label: "Pharmacy", minWidth: 130 },
    { id: "type", label: "Type", minWidth: 80 },
    { id: "order_count", label: "Orders", minWidth: 60 },
    {
      id: "gross_amount",
      label: "Gross",
      minWidth: 90,
      render: (value: number) => (
        <Typography>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "net_payable",
      label: "Net Payable",
      minWidth: 90,
      render: (value: number) => (
        <Typography fontWeight={500}>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "paid_amount",
      label: "Paid",
      minWidth: 70,
      render: (value: number) => (
        <Typography>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "pending_amount",
      label: "Pending",
      minWidth: 70,
      render: (value: number) => (
        <Typography color={Number(value) > 0 ? "error" : "inherit"}>
          ₹{formatAmount(value)}
        </Typography>
      ),
    },
    {
      id: "settle_date",
      label: "Settle Date",
      minWidth: 90,
      render: (value: string) => (
        <Typography>
          {value
            ? new Date(value).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })
            : "—"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 90,
      render: (value: string) => (
        <CustomChip
          label={value}
          color={statusColor(value)}
          variant="filled"
          size="small"
          style={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 80,
      render: (_: any, row: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleRowClick(row)}
          sx={{
            textTransform: "none",
            borderColor: "#00a6bb",
            color: "#00a6bb",
            "&:hover": {
              borderColor: "#008a9a",
              bgcolor: "rgba(0,166,187,0.08)",
            },
          }}
        >
          Payment
        </Button>
      ),
    },
  ];

  const razorpayColumns: any = [
    { id: "id", label: "Settlement ID", minWidth: 110 },
    {
      id: "amount",
      label: "Amount",
      minWidth: 90,
      render: (value: number) => (
        <Typography fontWeight={500}>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "fees",
      label: "Fees",
      minWidth: 60,
      render: (value: number) => (
        <Typography>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "tax",
      label: "Tax",
      minWidth: 60,
      render: (value: number) => (
        <Typography>₹{formatAmount(value)}</Typography>
      ),
    },
    {
      id: "utr",
      label: "UTR",
      minWidth: 110,
      render: (value: string) => <Typography>{value || "—"}</Typography>,
    },
    {
      id: "settled_at",
      label: "Settled At",
      minWidth: 110,
      render: (value: string) => (
        <Typography>
          {value
            ? new Date(value).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })
            : "—"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 90,
      render: (value: string) => (
        <CustomChip
          label={value}
          color={statusColor(value)}
          variant="filled"
          size="small"
          style={{ textTransform: "capitalize" }}
        />
      ),
    },
  ];

  const overviewData = [
    {
      title: "Total Earnings",
      value: `₹${formatAmount(summary.total_earnings)}`,
      subtitle: `${summary.total_orders || 0} Orders`,
      icon: <FaWallet />,
    },
    {
      title: "Total Amount Paid",
      value: `₹${formatAmount(summary.total_amount_paid)}`,
      subtitle: `Across ${summary.payouts_count || 0} payouts`,
      icon: <FaMoneyCheckAlt />,
    },
    {
      title: "Pending Settlement",
      value: `₹${formatAmount(summary.pending_settlement)}`,
      subtitle: "Yet to settle",
      icon: <FaHourglassHalf />,
    },
    {
      title: "Today's Payout",
      value: `₹${formatAmount(summary.todays_payout)}`,
      subtitle: `${summary.todays_pharmacy_count || 0} Pharmacies`,
      icon: <FaCalendarDay />,
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />

        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            paddingTop: "105px",
            bgcolor: "#f5f5f5",
          }}
        >
          <Typography fontWeight={700} fontSize={22}>
            Payout Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Razorpay settlements for Pharmacies.
          </Typography>

          <OverviewCards data={overviewData} />

          {/* Filters */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1.5,
              bgcolor: "#fff",
              borderRadius: "14px",
              border: "1px solid #f3f3f3",
              boxShadow: "0 2px 8px 0 rgba(16, 30, 54, 0.04)",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <InputBase
                placeholder="Pharmacy name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  fontSize: 15,
                  border: "1px solid #e5e7eb",
                  width: 260,
                }}
              />

              <CustomSelect
                value={status}
                onChange={setStatus}
                placeholder="Status: All"
                options={[
                  { label: "All", value: "All" },
                  { label: "Pending", value: "pending" },
                  { label: "Processing", value: "processing" },
                  { label: "Completed", value: "completed" },
                ]}
              />

              <TextField
                type="date"
                value={startDate}
                label="From"
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 1,
                  width: 140,
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: 15,
                    "& fieldset": { borderColor: "#e5e7eb" },
                    "&:hover fieldset": { borderColor: "#00A5A5" },
                    "&.Mui-focused fieldset": { borderColor: "#00A5A5" },
                  },
                  "& .MuiOutlinedInput-input": { padding: "8px 14px" },
                }}
              />

              <TextField
                type="date"
                value={endDate}
                label="To"
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 1,
                  width: 140,
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: 15,
                    "& fieldset": { borderColor: "#e5e7eb" },
                    "&:hover fieldset": { borderColor: "#00A5A5" },
                    "&.Mui-focused fieldset": { borderColor: "#00A5A5" },
                  },
                  "& .MuiOutlinedInput-input": { padding: "8px 14px" },
                }}
              />

              {/* <CustomSelect
                value={provider}
                onChange={setProvider}
                placeholder="Provider: All"
                options={[
                  { label: 'All', value: 'All' },
                  { label: 'Lab', value: 'lab' },
                  { label: 'Pharmacy', value: 'pharmacy' },
                ]}
              /> */}
            </Box>

            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={() => dispatch(exportPayouts())}
              sx={{
                bgcolor: "#00a6bb",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                "&:hover": { bgcolor: "#008a9a" },
              }}
            >
              Export
            </Button>
          </Box>

          {/* Payouts Table */}
          <HTable
            columns={columns}
            rows={payouts}
            rowKey="pharmacy_id"
            defaultRowsPerPage={10}
            responsive
          />

          {/* Razorpay Settlements */}
          <Box sx={{ mt: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Box>
                <Typography fontWeight={600} fontSize={17}>
                  Razorpay Settlements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Funds settled from Razorpay into the company account.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<ExportIcon />}
                onClick={() => dispatch(exportRazorpaySettlements())}
                sx={{
                  bgcolor: "#00a6bb",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  "&:hover": { bgcolor: "#008a9a" },
                }}
              >
                Export
              </Button>
            </Box>
            <HTable
              columns={razorpayColumns}
              rows={razorpaySettlements}
              rowKey="id"
              defaultRowsPerPage={5}
              responsive
            />
          </Box>
        </Box>
      </Box>

      <PaymentDetailsDrawer
        open={drawerOpen}
        payout={selectedPayout}
        onClose={handleCloseDrawer}
      />
    </Box>
  );
};

export default PayoutManagement;
