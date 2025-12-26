import React from 'react';
import { Chip } from '@mui/material';

export interface CustomChipProps {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}

const CustomChip: React.FC<CustomChipProps> = ({ label, color = 'default', variant = 'filled', size = 'small', style }) => {
  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: 13,
        ...(color === 'error' && { backgroundColor: '#FCE1E0', color: '#b71c1c' }),
        ...style
      }}
    />
  );
};

export default CustomChip;