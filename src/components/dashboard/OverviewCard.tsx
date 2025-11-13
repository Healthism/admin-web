import React from 'react';

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
    <div style={{
      display: 'flex',
      gap: '24px',
      margin: '32px 0',
      width: '100%',
      justifyContent: 'space-between',
    }}>
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 8px 0 rgba(16, 30, 54, 0.04)',
            padding: '28px 24px',
            minWidth: 220,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            border: '1px solid #f3f3f3',
            maxWidth: 320,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#64748b', fontWeight: 500, fontSize: 15 }}>{item.title}</span>
            {item.icon && <span style={{ fontSize: 22, color: '#64748b' }}>{item.icon}</span>}
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#18181b', marginBottom: 4 }}>{item.value}</span>
          {item.subtitle && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{item.subtitle}</span>}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;

