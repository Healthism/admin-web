import { useState } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  Checkbox,
  TextField,
} from '@mui/material';
 
type User = { id: number; name: string };

interface PromoCodeAutocompleteProps {
  selectedUsers?: User[];
  onChange: (users: User[]) => void;
}

// User list
const usersList = [
  { id: 1, name: 'Amit Sharma' },
  { id: 2, name: 'Priya Verma' },
  { id: 3, name: 'Rajesh Kumar' },
  { id: 4, name: 'Neha Patel' },
  { id: 5, name: 'Vikram Singh' },
  { id: 6, name: 'Anjali Gupta' },
  { id: 7, name: 'Arun Mishra' },
  { id: 8, name: 'Divya Nair' },
  { id: 9, name: 'Sanjay Reddy' },
  { id: 10, name: 'Kavya Iyer' },
];

const PromoCodeAutocomplete = ({ selectedUsers = [], onChange }: PromoCodeAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');



  return (
    <Box sx={{ mb: 2.5 }}>
      <Autocomplete<User, true, false, false>
        multiple
        options={usersList}
        getOptionLabel={(option) => option.name}
        value={selectedUsers}
        onChange={(_, newValue) => onChange(newValue)}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value ?? '')}
        noOptionsText="No users found"
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Users"
            placeholder="Search and Select users"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "6px 0px",
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
              "& .MuiInputLabel-root": {
                color: "#00A8B9 !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00A8B9 !important",
              },
            }}
          />
        )}
        renderOption={(props: any, option: User, { selected }) => (
          <Box
            {...props}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1,
              px: 2,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <Checkbox
              checked={selected}
              sx={{
                mr: 1,
                color: "#00A8B9",
                "&.Mui-checked": {
                  color: "#00A8B9",
                },
              }}
            />
            <Typography>{option.name}</Typography>
          </Box>
        )}
      />
    </Box>
  );
};

export default PromoCodeAutocomplete;