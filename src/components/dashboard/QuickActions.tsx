import React from 'react';
import { Typography } from '@mui/material';

interface QuickActionItem {
  label: string;
  description: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px 0 rgba(16,30,54,0.04)',
      border: '1px solid #f3f3f3',
      padding: '18px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      width: '50%'
    }}>
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={1} lineHeight={1.2}>
        Quick Actions
      </Typography>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            style={{
              width: '100%',
              textAlign: 'left',
              border: '1.5px solid #e5e7eb',
              borderRadius: 10,
              padding: '12px 14px',
              background: '#f9fafb',
              marginBottom: 0,
              transition: 'background 0.15s',
              marginTop: 0,
              marginRight: 0,
              marginLeft: 0,
              marginBlock: 0,
              marginInline: 0,
              cursor: 'pointer',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseOut={e => e.currentTarget.style.background = '#f9fafb'}
          >
            <Typography variant="body1" fontWeight={600} lineHeight={1.2} color="text.primary">
              {action.label}
            </Typography>
            <Typography variant="body2" lineHeight={1.3} color="text.secondary">
              {action.description}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
