import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  FormHelperText,
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
import { useDispatch, useSelector } from 'react-redux';
import { deletePromoCode, getPromoCodeById, getPromoCodes, updatePromoCode } from '../../redux/sagas/promoCodes/promoCodesSagaAction';
import { createPromoCode } from '../../redux/sagas/promoCodes/promoCodesSagaAction';
import { getUsers } from '../../redux/sagas/users/userSagaAction';

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

interface FormErrors {
  code?: string;
  discountType?: string;
  discountValue?: string;
  minOrderValue?: string;
  maxUsers?: string;
  startDate?: string;
  endDate?: string;
  selectedUsers?: string;
}

type UserType = { id: number; name: string };

const PromoCodes: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const dispatch = useDispatch();
  const {promoCodes, promoCode} = useSelector((state: any) => state.promoCodes);
  const users = useSelector((state: any) => state.users.users);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  
  useEffect(() => {
    dispatch(getPromoCodes());
    dispatch(getUsers({ type: `lab,pharmacy` }));
  }, [dispatch]);

  // Populate form when promoCode data is loaded for editing
  useEffect(() => {
    if (promoCode && isEditMode && users) {
      setFormData({
        code: promoCode.code || "",
        discountType: promoCode.discountType || "",
        discountValue: String(promoCode.discountValue || ""),
        minOrderValue: String(promoCode.minOrderValue || ""),
        maxUsers: String(promoCode.maxUsers || ""),
        startDate: promoCode.startDate ? promoCode.startDate.split('T')[0] : "",
        endDate: promoCode.endDate ? promoCode.endDate.split('T')[0] : "",
        isActive: promoCode.active ?? true,
      });
      
      // Filter and map user_ids to actual user objects
      if (promoCode.user_ids && Array.isArray(promoCode.user_ids) && Array.isArray(users)) {
        const selectedUserObjects = users.filter((user: any) => 
          promoCode.user_ids.includes(user._id )
        ).map((user: any) => ({
          _id: user._id,
          name: user.name || 'Unknown User'
        }));
        
        setSelectedUsers(selectedUserObjects);
      }
      setOpenModal(true);
    }
  }, [promoCode, isEditMode, users]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'code':
        if (!value || value.trim() === '') {
          return 'Promo code is required';
        }
        if (value.length < 3) {
          return 'Promo code must be at least 3 characters';
        }
        return '';
      
      case 'discountType':
        if (!value || value === '') {
          return 'Discount type is required';
        }
        return '';
      
      case 'discountValue':
        if (!value || value.trim() === '') {
          return 'Discount value is required';
        }
        const discountNum = Number(value);
        if (isNaN(discountNum) || discountNum <= 0) {
          return 'Discount value must be greater than 0';
        }
        if (formData.discountType === 'percentage' && discountNum > 100) {
          return 'Percentage discount cannot exceed 100';
        }
        return '';
      
      case 'minOrderValue':
        if (!value || value.trim() === '') {
          return 'Minimum order value is required';
        }
        const minOrderNum = Number(value);
        if (isNaN(minOrderNum) || minOrderNum < 0) {
          return 'Minimum order value must be 0 or greater';
        }
        return '';
      
      case 'maxUsers':
        if (!value || value.trim() === '') {
          return 'Maximum users is required';
        }
        const maxUsersNum = Number(value);
        if (isNaN(maxUsersNum) || maxUsersNum <= 0) {
          return 'Maximum users must be greater than 0';
        }
        return '';
      
      case 'startDate':
        if (!value || value.trim() === '') {
          return 'Start date is required';
        }
        return '';
      
      case 'endDate':
        if (!value || value.trim() === '') {
          return 'End date is required';
        }
        if (formData.startDate && value < formData.startDate) {
          return 'End date must be after start date';
        }
        return '';
      
      case 'selectedUsers':
        if (!selectedUsers || selectedUsers.length === 0) {
          return 'At least one user must be selected';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.code = validateField('code', formData.code);
    newErrors.discountType = validateField('discountType', formData.discountType);
    newErrors.discountValue = validateField('discountValue', formData.discountValue);
    newErrors.minOrderValue = validateField('minOrderValue', formData.minOrderValue);
    newErrors.maxUsers = validateField('maxUsers', formData.maxUsers);
    newErrors.startDate = validateField('startDate', formData.startDate);
    newErrors.endDate = validateField('endDate', formData.endDate);
    newErrors.selectedUsers = validateField('selectedUsers', selectedUsers);
    
    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors];
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditMode(false);
    setEditingId(null);
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
    setSelectedUsers([]);
    setErrors({});
    setTouched({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof FormData]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({ ...prev, discountType: e.target.value }));
    
    if (touched.discountType) {
      const error = validateField('discountType', e.target.value);
      setErrors(prev => ({
        ...prev,
        discountType: error
      }));
    }
    
    // Re-validate discount value if discount type changes
    if (formData.discountValue && touched.discountValue) {
      const discountError = validateField('discountValue', formData.discountValue);
      setErrors(prev => ({
        ...prev,
        discountValue: discountError
      }));
    }
  };

  const handleUsersChange = (users: any[]) => {
    setSelectedUsers(users);
    
    if (touched.selectedUsers) {
      const error = validateField('selectedUsers', users);
      setErrors(prev => ({
        ...prev,
        selectedUsers: error
      }));
    }
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      code: true,
      discountType: true,
      discountValue: true,
      minOrderValue: true,
      maxUsers: true,
      startDate: true,
      endDate: true,
      selectedUsers: true,
    });

    // Validate entire form
    if (!validateForm()) {
      return;
    }

    const payload: any = {
      code: formData.code,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue) || 0,
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxUsers: Number(formData.maxUsers) || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      active: !!formData.isActive,
      user_ids: selectedUsers.map((u) => String(u._id)),
    };

    if (isEditMode && editingId) {
      dispatch(updatePromoCode({ _id: editingId, ...payload }));
    } else {
      dispatch(createPromoCode(payload));
    }
    
    handleCloseModal();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePromoCode({ _id: deleteTarget._id }));
    setOpenDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleOpenDeleteModal = (row: any) => {
    setDeleteTarget(row);
    setOpenDeleteModal(true);
  };

  const handleEdit = (row: any) => {
    setIsEditMode(true);
    setEditingId(row._id);
    dispatch(getPromoCodeById({ _id: row._id }));
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    } catch {
      return '';
    }
  };

  const tableRows = Array.isArray(promoCodes)
    ? promoCodes.map((p: any) => ({
        ...p,
        endDate: p.endDate ? formatDate(p.endDate) : '',
      }))
    : [];

  const columns: any = [
    { id: "code", label: "Code", minWidth: 120 },
    { id: "discountValue", label: "Discount", minWidth: 120 },
    { id: "usedCount", label: "Usage Count", minWidth: 150 },
    { id: "endDate", label: "Expiry", minWidth: 150 },
    {
      id: "active",
      label: "Status",
      minWidth: 100,
      render: (value: boolean) => (
        <CustomChip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "warning"}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      render: (_: any, row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => handleEdit(row)}
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
            onClick={() => handleOpenDeleteModal(row)}
          >
            <DeleteIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
      ),
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
            paddingTop: "110px",
            bgcolor: "#f5f5f5",
          }}
        >
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

          <HTable columns={columns} rows={tableRows} defaultRowsPerPage={10} />
        </Box>
      </Box>

      {/* Create/Edit Promo Code Modal */}
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
            {isEditMode ? 'Edit Promo Code' : 'Create Promo Code'}
          </Typography>

          <TextField
            fullWidth
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={() => handleBlur('code')}
            placeholder="Enter promo code"
            variant="outlined"
            size="small"
            sx={{ mb: 2.5 }}
            error={touched.code && !!errors.code}
            helperText={touched.code && errors.code}
            required
          />

          <FormControl 
            fullWidth 
            size="small" 
            sx={{ mb: 2.5 }}
            error={touched.discountType && !!errors.discountType}
            required
          >
            <InputLabel id="discount-type-label">Discount Type</InputLabel>
            <Select
              labelId="discount-type-label"
              id="discount-type"
              label="Discount Type"
              name="discountType"
              value={formData.discountType}
              onChange={handleSelectChange}
              onBlur={() => handleBlur('discountType')}
              size="small"
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="flat">Flat</MenuItem>
            </Select>
            {touched.discountType && errors.discountType && (
              <FormHelperText>{errors.discountType}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Discount Value"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            onBlur={() => handleBlur('discountValue')}
            placeholder="Enter discount value"
            variant="outlined"
            size="small"
            sx={{ mb: 2.5 }}
            error={touched.discountValue && !!errors.discountValue}
            helperText={touched.discountValue && errors.discountValue}
            required
          />

          <TextField
            fullWidth
            label="Min Order Value"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            onBlur={() => handleBlur('minOrderValue')}
            placeholder="Enter minimum order value"
            variant="outlined"
            size="small"
            sx={{ mb: 2.5 }}
            error={touched.minOrderValue && !!errors.minOrderValue}
            helperText={touched.minOrderValue && errors.minOrderValue}
            required
          />

          <TextField
            fullWidth
            label="Max Users"
            name="maxUsers"
            value={formData.maxUsers}
            onChange={handleChange}
            onBlur={() => handleBlur('maxUsers')}
            placeholder="Enter maximum users"
            variant="outlined"
            size="small"
            sx={{ mb: 2.5 }}
            error={touched.maxUsers && !!errors.maxUsers}
            helperText={touched.maxUsers && errors.maxUsers}
            required
          />

          <Box sx={{ mb: 2.5 }}>
            <PromoCodeAutocomplete
              selectedUsers={selectedUsers}
              onChange={handleUsersChange}
            />
            {touched.selectedUsers && errors.selectedUsers && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.selectedUsers}
              </FormHelperText>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={() => handleBlur('startDate')}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                style: { textAlign: "center" },
              }}
              error={touched.startDate && !!errors.startDate}
              helperText={touched.startDate && errors.startDate}
              required
            />

            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={() => handleBlur('endDate')}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                style: { textAlign: "center" },
              }}
              error={touched.endDate && !!errors.endDate}
              helperText={touched.endDate && errors.endDate}
              required
            />
          </Box>

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
              {isEditMode ? 'Update' : 'Save & Continue'}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogContent sx={{ padding: "32px", textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#d32f2f" }}>
            Confirm Delete
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete promo code <b>{deleteTarget?.code}</b>?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={handleCloseDeleteModal}
              sx={{ flex: 1, padding: "10px 16px", borderColor: "#d32f2f", color: "#d32f2f" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              sx={{ flex: 1, padding: "10px 16px" }}
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PromoCodes;