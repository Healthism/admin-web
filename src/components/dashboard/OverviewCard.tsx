import { Typography } from '@mui/material';
import React from 'react';
import './overview-cards-responsive.css';

export interface OverviewCardData {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface OverviewCardsProps {
  data: OverviewCardData[];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 24,
        margin: '24px 0',
        width: '100%',
      }}
      className="overview-cards-responsive"
    >
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 8px 0 rgba(16, 30, 54, 0.04)',
            padding: '16px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            border: '1px solid #f3f3f3',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={500} fontSize={14} lineHeight={1.2}>{item.title}</Typography>
            {item.icon && <span style={{ fontSize: 22, color: '#64748b' }}>{item.icon}</span>}
          </div>
          <Typography variant="h4" color="text.primary" fontWeight={700} fontSize={28} lineHeight={1.2} mb={0.5}>{item.value}</Typography>
          {item.subtitle && <Typography variant="caption" color="text.secondary" fontWeight={500} fontSize={13}>{item.subtitle}</Typography>}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;

