import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import CustomChip from '../../components/common/CustomChip';
import HTable from '../../components/common/HTable';
import PromoCodeAutocomplete from '../../components/autocomplete/PromoCodeAutocomplete';

const promoRows = [
  {
    id: 1,
    code: "HEALTH20",
    discount: "20%",
    usage: "45 / 100",
    expiry: "15/01/2024",
    status: "Active",
  },
  {
    id: 2,
    code: "HEALTH30",
    discount: "10%",
    usage: "45 / 200",
    expiry: "15/01/2024",
    status: "Inactive",
  },
  {
    id: 3,
    code: "HEALTH40",
    discount: "15%",
    usage: "45 / 500",
    expiry: "15/01/2024",
    status: "Active",
  },
];

const columns: any = [
  { id: "code", label: "Code", minWidth: 120 },
  { id: "discount", label: "Discount %", minWidth: 120 },
  { id: "usage", label: "Usage Count", minWidth: 150 },
  { id: "expiry", label: "Expiry", minWidth: 150 },

  {
    id: "status",
    label: "Status",
    minWidth: 100,
    render: (value: string) => (
      <CustomChip
        label={value}
        color={value === "Active" ? "success" : "warning"}
        variant="filled"
        size="small"
      />
    ),
  },

  {
    id: "actions",
    label: "Actions",
    minWidth: 150,
    render: (_: any, ) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          size="small"
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <EditIcon sx={{ fontSize: "18px" }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            color: "#d32f2f",
            "&:hover": { backgroundColor: "#ffebee" },
          }}
        >
          <DeleteIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>
    ),
  },
];

interface FormData {
  code: string;
  discountType: string;
  discountValue: string;
  minOrderValue: string;
  maxUsers: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

type UserType = { id: number; name: string };

const PromoCodes: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    code: "",
    discountType: "",
    discountValue: "",
    minOrderValue: "",
    maxUsers: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      code: "",
      discountType: "",
      discountValue: "",
      minOrderValue: "",
      maxUsers: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    handleCloseModal();
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Top Bar */}
        <TopBar />

        {/* Body */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            paddingTop: "110px",
            bgcolor: "#f5f5f5",
          }}
        >

          {/* Title + Button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography fontWeight={600} fontSize={22}>
              Promo Codes
            </Typography>

            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{
                backgroundColor: "#00A8B9",
                ":hover": { backgroundColor: "#008C9E" },
              }}
            >
              + Create Promo Code
            </Button>
          </Box>

          {/* Table */}
          <HTable columns={columns} rows={promoRows} defaultRowsPerPage={5} />

        </Box>
      </Box>

      {/* Create Promo Code Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ padding: "32px" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#00A8B9" }}
          >
            Create Promo Codes
          </Typography>

          {/* Code Field */}
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter promo code"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                padding: "6px",
                display: "flex",
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&:hover fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00A8B9 !important",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                textAlign: "left",
              },
              "& .MuiInputLabel-root": {
                color: "#00A8B9 !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00A8B9 !important",
              },
            }}
          />

          {/* Discount Type Field */}
          <TextField
            fullWidth
            label="Discount Type"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            placeholder="e.g., Percentage, Fixed"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                padding: "6px",
                display: "flex",
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&:hover fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00A8B9 !important",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                textAlign: "left",
              },
              "& .MuiInputLabel-root": {
                color: "#00A8B9 !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00A8B9 !important",
              },
            }}
          />

          {/* Discount Value Field */}
          <TextField
            fullWidth
            label="Discount Value"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            placeholder="Enter discount value"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                padding: "6px",
                display: "flex",
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&:hover fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00A8B9 !important",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                textAlign: "left",
              },
              "& .MuiInputLabel-root": {
                color: "#00A8B9 !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00A8B9 !important",
              },
            }}
          />

          {/* Min Order Value Field */}
          <TextField
            fullWidth
            label="Min Order Value"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            placeholder="Enter minimum order value"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                padding: "6px",
                display: "flex",
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&:hover fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00A8B9 !important",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                opacity: 1,
              },
              "& .MuiInputBase-input": {
                textAlign: "left",
              },
              "& .MuiInputLabel-root": {
                color: "#00A8B9 !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00A8B9 !important",
              },
            }}
          />

          {/* Max Users Field */}
          <TextField
            fullWidth
            label="Max Users"
            name="maxUsers"
            value={formData.maxUsers}
            onChange={handleChange}
            placeholder="Enter maximum users"
            variant="outlined"
            size="small"
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                padding: "8px 12px",
                "& fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&:hover fieldset": {
                  borderColor: "#00A8B9 !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00A8B9 !important",
                },
              },
              "& .MuiOutlinedInput-input": {
                textAlign: "center !important",
              },
              "& .MuiOutlinedInput-input::placeholder": {
                textAlign: "center",
                opacity: 1,
              },
            }}
            inputProps={{
              style: { textAlign: "center" },
            }}
          />

          {/* Select Users for Promo (optional) */}
          <PromoCodeAutocomplete
            selectedUsers={selectedUsers}
            onChange={(users) => setSelectedUsers(users)}
          />

          {/* Date Fields */}
          <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "8px 12px",
                  "& fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  textAlign: "center !important",
                },
              }}
              inputProps={{
                style: { textAlign: "center" },
              }}
            />

            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "8px 12px",
                  "& fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00A8B9 !important",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  textAlign: "center !important",
                },
              }}
              inputProps={{
                style: { textAlign: "center" },
              }}
            />
          </Box>

          {/* Active Toggle */}
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#00A8B9",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#00A8B9",
                  },
                }}
              />
            }
            label="Active"
            sx={{ mb: 3 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "#00A8B9",
                "&:hover": { backgroundColor: "#008C9E" },
                flex: 1,
                padding: "10px 16px",
              }}
            >
              Save & Continue
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ 
                flex: 1,
                padding: "10px 16px",
                borderColor: "#00A8B9",
                color: "#00A8B9",
                "&:hover": {
                  borderColor: "#008C9E",
                  backgroundColor: "rgba(0, 168, 185, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PromoCodes;