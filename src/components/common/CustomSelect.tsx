import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  styled,
} from "@mui/material";

interface OptionType {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  placeholder?: string;
  width?: number | string;
}

// Select box styling
const StyledSelect = styled(Select)(() => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  height: 45,
  fontSize: 15,
  border: "1px solid #e5e7eb",
  minWidth: "160px",

  "& .MuiSelect-select": {
    padding: "10px 14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "&:hover": {
    borderColor: "#00A5A5",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00A5A5",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

// Menu item styling
const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: 15,
  borderRadius: 6,

  "&:hover": {
    backgroundColor: "#00A5A5 !important",
    color: "#fff",
  },

  "&.Mui-selected": {
    backgroundColor: "#00A5A5ad !important",
    color: "#fff",
  },

  "&.Mui-selected:hover": {
    backgroundColor: "#00A5A5 !important",
    color: "#fff",
  },
}));

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}) => {
  // Find the label for the current value
  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <FormControl>
      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        displayEmpty
        renderValue={(val) => (val === "" ? placeholder : selectedLabel || placeholder)}
        sx={{ width: 'auto', textAlign: 'left' }}
      >
        {/* Placeholder */}
        <StyledMenuItem disabled value="">
          {placeholder}
        </StyledMenuItem>

        {/* Options */}
        {options.map((item) => (
          <StyledMenuItem key={item.value} value={item.value}>
            {item.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

export default CustomSelect;
