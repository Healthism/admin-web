import React from 'react';
import { Typography } from '@mui/material';

interface ActivityItem {
  icon: React.ReactNode;
  description: string;
  time: string;
  color: string;
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
      marginRight: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      width: '50%'
    }}>
      <Typography variant="h6" fontWeight={700} color="text.primary" mb={2}>
        Recent Activity
      </Typography>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        {activities.map((item, idx) => (
          <div key={idx} style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
            <span style={{height: 12, width: 12, borderRadius: '50%', marginTop: 6, background: item.color, display: 'inline-block'}}></span>
            <div>
              <Typography variant="body1" fontWeight={500} color="text.primary" mb={0.5}>
                {item.description}
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
