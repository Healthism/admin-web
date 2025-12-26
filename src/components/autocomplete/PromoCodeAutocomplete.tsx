import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  Checkbox,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/sagas/users/userSagaAction';
 
type User = { id: number; name: string };

interface PromoCodeAutocompleteProps {
  selectedUsers?: User[];
  onChange: (users: User[]) => void;
}

const PromoCodeAutocomplete = ({ selectedUsers = [], onChange }: PromoCodeAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');
  const users = useSelector((state: any) => state.users.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers({ type: `lab,pharmacy` }));
  }, [dispatch]);

  return (
    <Box sx={{ mb: 2.5 }}>
      <Autocomplete<User, true, false, false>
        multiple
        options={users}
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
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props} style={{ padding: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "0px",
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
          </li>
        )}
      />
    </Box>
  );
};

export default PromoCodeAutocomplete;