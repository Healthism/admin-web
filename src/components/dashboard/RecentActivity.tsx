import React from 'react';
import { Typography } from '@mui/material';

interface ActivityItem {
  title: string;
  time: string;
  // either the prior 'color' field or a 'type' (promo|patient|doctor|lab|pharmacy)
  color?: string;
  type?: 'promo' | 'patient' | 'doctor' | 'lab' | 'pharmacy' | string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px 0 rgba(16,30,54,0.04)',
      border: '1px solid #f3f3f3',
      padding: '28px 28px 18px 28px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }}>
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={2}>
        Recent Activity
      </Typography>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        {activities.map((item, idx) => (
          <div key={idx} style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
            {(() => {
              const typeColors: Record<string, string> = {
                promo: '#1976d2',     
                patient: '#2e7d32',   
                doctor: '#6a1b9a',   
                lab: '#f57c00',        
                pharmacy: '#c62828',   
              };

              const bg = item.type ? (typeColors[item.type] || '#90a4ae') : (item.color || '#90a4ae');
              return (
                <span style={{height: 12, width: 12, borderRadius: '50%', marginTop: 6, background: bg, display: 'inline-block'}} />
              );
            })()}
            <div>
              <Typography variant="body1" fontWeight={500} color="text.primary" mb={0.5}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.time}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
