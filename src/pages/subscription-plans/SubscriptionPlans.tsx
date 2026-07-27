import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteIcon,
  WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/dashboard/Sidebar";
import TopBar from "../../components/dashboard/Topbar";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanAnalytics,
} from "../../redux/sagas/plans/plansSagaAction";

interface PlanFormState {
  _id?: string;
  name: string;
  planType: string;
  description: string;
  price: string;
  maxOrdersAllowed: string;
  unlimitedOrders: boolean;
  durationDays: string;
  currency: string;
  isActive: boolean;
  features: string[];
}

const EMPTY_PLAN_FORM: PlanFormState = {
  name: "",
  planType: "monthly",
  description: "",
  price: "",
  maxOrdersAllowed: "",
  unlimitedOrders: false,
  durationDays: "30",
  currency: "INR",
  isActive: true,
  features: [],
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: 14,
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#00a6bb" },
    "&.Mui-focused fieldset": { borderColor: "#00a6bb" },
  },
};

const getDurationLabel = (durationDays: string): string => {
  const days = Number(durationDays);
  if (!days || days <= 0) return "";

  if (days % 365 === 0) {
    const years = days / 365;
    return years === 1 ? "1 Year" : `${years} Years`;
  }
  if (days % 30 === 0) {
    const months = days / 30;
    return months === 1 ? "1 Month" : `${months} Months`;
  }
  return days === 1 ? "1 Day" : `${days} Days`;
};

const formatChangePercent = (changePercent: number | undefined): string | null => {
  if (changePercent === undefined || changePercent === null) return null;
  const sign = changePercent > 0 ? "+" : "";
  return `${sign}${changePercent}%`;
};

const toFormState = (apiPlan: any): PlanFormState => ({
  _id: apiPlan._id,
  name: apiPlan.name || "",
  planType: apiPlan.plan_type || "monthly",
  description: apiPlan.description || "",
  price: apiPlan.price?.toString() ?? "",
  maxOrdersAllowed: apiPlan.max_orders_allowed === -1 ? "" : apiPlan.max_orders_allowed?.toString() ?? "",
  unlimitedOrders: apiPlan.max_orders_allowed === -1,
  durationDays: apiPlan.duration_days?.toString() ?? "30",
  currency: apiPlan.currency || "INR",
  isActive: apiPlan.is_active ?? true,
  features: Array.isArray(apiPlan.features) ? apiPlan.features : [],
});

const ANALYTICS_PERIODS = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 1 Year", value: "1y" },
  { label: "Custom Range", value: "custom" },
];

const SubscriptionPlans: React.FC = () => {
  const dispatch = useDispatch();
  const { plans, analytics } = useSelector((state: any) => state.plans);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [form, setForm] = useState<PlanFormState>(EMPTY_PLAN_FORM);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getPlans());
  }, [dispatch]);

  useEffect(() => {
    if (analyticsPeriod === "custom") {
      if (customFrom && customTo) {
        dispatch(getPlanAnalytics({ from: customFrom, to: customTo }));
      }
      return;
    }
    dispatch(getPlanAnalytics({ period: analyticsPeriod }));
  }, [dispatch, analyticsPeriod, customFrom, customTo]);

  useEffect(() => {
    if (!isCreatingNew && plans.length > 0) {
      const index = Math.min(activeIndex, plans.length - 1);
      setForm(toFormState(plans[index]));
    }
  }, [plans, isCreatingNew]);

  const handleSelectTab = (index: number) => {
    setIsCreatingNew(false);
    setActiveIndex(index);
    setForm(toFormState(plans[index]));
  };

  const handleAddNewPlanClick = () => {
    setIsCreatingNew(true);
    setForm(EMPTY_PLAN_FORM);
  };

  const handleDeletePlan = () => {
    if (!form._id) return;
    setDeleteDialogOpen(true);
  };

  const confirmDeletePlan = () => {
    if (form._id) {
      dispatch(deletePlan({ _id: form._id }));
      setActiveIndex(0);
    }
    setDeleteDialogOpen(false);
  };

  const updateForm = (patch: Partial<PlanFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleAddFeature = () => {
    updateForm({ features: [...form.features, ""] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    updateForm({
      features: form.features.map((f, i) => (i === index ? value : f)),
    });
  };

  const handleDeleteFeature = (index: number) => {
    updateForm({ features: form.features.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    const payload: any = {
      name: form.name,
      plan_type: form.planType,
      price: Number(form.price) || 0,
      max_orders_allowed: form.unlimitedOrders ? -1 : (Number(form.maxOrdersAllowed) || 0),
      features: form.features,
      description: form.description,
    };

    if (form.durationDays) {
      payload.duration_days = Number(form.durationDays);
    }

    if (isCreatingNew || !form._id) {
      dispatch(createPlan(payload));
      setIsCreatingNew(false);
    } else {
      dispatch(updatePlan({ _id: form._id, ...payload }));
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />

        <Box sx={{ flexGrow: 1, padding: 3, paddingTop: "105px", bgcolor: "#f5f5f5" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography fontWeight={700} fontSize={22}>Subscription Plans</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and customize all subscription plans.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Left column */}
            <Box sx={{ flex: "1 1 640px", minWidth: 340 }}>
              {/* Tabs + Add New Plan */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    p: 0.5,
                    gap: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  {plans.length === 0 && !isCreatingNew && (
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1.5, py: 1 }}>
                      No plans yet
                    </Typography>
                  )}
                  {plans.map((p: any, index: number) => (
                    <Button
                      key={p._id || index}
                      onClick={() => handleSelectTab(index)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        borderRadius: "8px",
                        px: 2,
                        py: 0.75,
                        minWidth: 0,
                        color: !isCreatingNew && activeIndex === index ? "#fff" : "#475569",
                        bgcolor: !isCreatingNew && activeIndex === index ? "#00a6bb" : "transparent",
                        "&:hover": {
                          bgcolor: !isCreatingNew && activeIndex === index ? "#008a9a" : "rgba(0,166,187,0.08)",
                        },
                      }}
                    >
                      {p.name}
                    </Button>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNewPlanClick}
                  sx={{
                    bgcolor: "#00a6bb",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    "&:hover": { bgcolor: "#008a9a" },
                  }}
                >
                  Add New Plan
                </Button>
              </Box>

              {/* Plan Details card */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #f3f3f3",
                  boxShadow: "0 2px 8px 0 rgba(16, 30, 54, 0.04)",
                  p: 3,
                  mb: 3,
                }}
              >
                <Typography fontWeight={700} fontSize={16} mb={2}>
                  {isCreatingNew ? "New Plan Details" : "Plan Details"}
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5, mb: 2.5 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Plan Name</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      sx={fieldSx}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>
                      Price (₹)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={form.price}
                      onChange={(e) => updateForm({ price: e.target.value })}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Billing Cycle</Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={form.planType}
                      onChange={(e) => updateForm({ planType: e.target.value })}
                      sx={fieldSx}
                    >
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Duration (Days)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={form.durationDays}
                      onChange={(e) => updateForm({ durationDays: e.target.value })}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                      <Typography variant="body2" fontWeight={500}>Max Orders Allowed</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={form.unlimitedOrders}
                            onChange={(e) => updateForm({ unlimitedOrders: e.target.checked })}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#00a6bb" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                bgcolor: "#00a6bb",
                              },
                            }}
                          />
                        }
                        label={<Typography variant="caption" color="text.secondary">Unlimited</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      disabled={form.unlimitedOrders}
                      placeholder={form.unlimitedOrders ? "Unlimited" : ""}
                      value={form.unlimitedOrders ? "" : form.maxOrdersAllowed}
                      onChange={(e) => updateForm({ maxOrdersAllowed: e.target.value })}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Description</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      minRows={2}
                      value={form.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      sx={fieldSx}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Currency</Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={form.currency}
                      onChange={(e) => updateForm({ currency: e.target.value })}
                      sx={fieldSx}
                    >
                      <MenuItem value="INR">INR (₹)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500} mb={0.75}>Status</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isActive}
                          onChange={(e) => updateForm({ isActive: e.target.checked })}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#00a6bb" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              bgcolor: "#00a6bb",
                            },
                          }}
                        />
                      }
                      label={form.isActive ? "Active" : "Inactive"}
                      sx={{ ml: 0 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Features card */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #f3f3f3",
                  boxShadow: "0 2px 8px 0 rgba(16, 30, 54, 0.04)",
                  p: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                  <Typography fontWeight={700} fontSize={16}>Features</Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={handleAddFeature}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#00a6bb",
                      "&:hover": { bgcolor: "rgba(0,166,187,0.08)" },
                    }}
                  >
                    Add Feature
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Add key features for this plan. These will be shown to users.
                </Typography>

                {form.features.length > 0 && (
                  <Box sx={{ display: "flex", fontSize: 12, fontWeight: 700, color: "text.secondary", px: 1.5, mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>Feature</Box>
                    <Box>Actions</Box>
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {form.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        p: "2px 4px 2px 12px",
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        placeholder="Type a feature"
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        sx={{ "& .MuiInputBase-input": { fontSize: 14, py: 1 } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFeature(idx)}
                        sx={{ color: "#ef4444" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {form.features.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      No features added yet.
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                {!isCreatingNew && form._id && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeletePlan}
                    sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}
                  >
                    Delete Plan
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#00a6bb",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4,
                    "&:hover": { bgcolor: "#008a9a" },
                  }}
                >
                  {isCreatingNew ? "Create Plan" : "Save Changes"}
                </Button>
              </Box>
            </Box>

            {/* Right column */}
            <Box sx={{ flex: "0 1 300px", minWidth: 280 }}>
              {/* Edit Plan Preview */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #f3f3f3",
                  boxShadow: "0 2px 8px 0 rgba(16, 30, 54, 0.04)",
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Typography fontWeight={700} fontSize={15} mb={1.5}>Edit Plan Preview</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderBottom: "2px solid #00a6bb",
                    mb: 2,
                  }}
                >
                  <Typography
                    fontWeight={600}
                    fontSize={13}
                    color="#00a6bb"
                    sx={{ pb: 1 }}
                  >
                    Preview
                  </Typography>
                </Box>

                {!form.name && !form.price ? (
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Fill in the plan details to see a live preview here.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: "relative",
                      border: "1.5px solid #00a6bb",
                      borderRadius: "16px",
                      p: 2.5,
                      pt: 4,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "#00a6bb",
                        color: "#fff",
                        borderRadius: "999px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        py: 0.85,
                        px: 2.5,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {form.name}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                      <Typography fontWeight={700} fontSize={15} color="#1e293b">
                        {getDurationLabel(form.durationDays)}
                      </Typography>
                      <Typography fontWeight={700} fontSize={20} color="#1e293b">
                        ₹{form.price}/-
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                      {form.features.map((feature, idx) => (
                        <Box key={`${feature}-${idx}`} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: "#22c55e" }} />
                          <Typography fontSize={14} color="#334155">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: "#00a6bb",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: "999px",
                        py: 1.1,
                        "&:hover": { bgcolor: "#008a9a" },
                      }}
                    >
                      Upgrade Now
                    </Button>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
                  Changes you make will be reflected in real time in the preview.
                </Typography>
              </Box>

              {/* Plan Analytics */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #f3f3f3",
                  boxShadow: "0 2px 8px 0 rgba(16, 30, 54, 0.04)",
                  p: 2.5,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                  <Typography fontWeight={700} fontSize={15}>Plan Analytics</Typography>
                  <TextField
                    select
                    size="small"
                    value={analyticsPeriod}
                    onChange={(e) => setAnalyticsPeriod(e.target.value)}
                    sx={{
                      minWidth: 140,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        fontSize: 12,
                        bgcolor: "#f3f4f6",
                        "& fieldset": { border: "none" },
                      },
                    }}
                  >
                    {ANALYTICS_PERIODS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {analyticsPeriod === "custom" && (
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      type="date"
                      size="small"
                      label="From"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      type="date"
                      size="small"
                      label="To"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>
                )}

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Total Subscribers
                    </Typography>
                    <Typography fontWeight={700} fontSize={18}>
                      {analytics?.total_subscribers?.value ?? "—"}
                    </Typography>
                    {formatChangePercent(analytics?.total_subscribers?.change_percent) && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: analytics.total_subscribers.change_percent >= 0 ? "#22c55e" : "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {formatChangePercent(analytics.total_subscribers.change_percent)}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Total Revenue
                    </Typography>
                    <Typography fontWeight={700} fontSize={18}>
                      {analytics?.total_revenue?.value !== undefined ? `₹${analytics.total_revenue.value}` : "—"}
                    </Typography>
                    {formatChangePercent(analytics?.total_revenue?.change_percent) && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: analytics.total_revenue.change_percent >= 0 ? "#22c55e" : "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {formatChangePercent(analytics.total_revenue.change_percent)}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Conversion Rate
                    </Typography>
                    <Typography fontWeight={700} fontSize={18}>
                      {analytics?.conversion_rate?.value !== undefined ? `${analytics.conversion_rate.value}%` : "—"}
                    </Typography>
                    {formatChangePercent(analytics?.conversion_rate?.change_percent) && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: analytics.conversion_rate.change_percent >= 0 ? "#22c55e" : "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {formatChangePercent(analytics.conversion_rate.change_percent)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 0, pt: 2.5, px: 3 }}>
          <Box
            sx={{
              bgcolor: "#fee2e2",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ color: "#dc2626", fontSize: 22 }} />
          </Box>
          <Typography fontWeight={700} fontSize={18}>
            Delete Plan
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{form.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeletePlan}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlans;
