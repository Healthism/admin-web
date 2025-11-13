import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import OverviewCards from '../../components/dashboard/OverviewCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';
import { FaUsers, FaCreditCard, FaTags, FaDollarSign } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  console.log('Dashboard rendered');
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#e0e0e0' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        overflow: 'hidden'
      }}>
        <TopBar />

        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          padding: 2,
          paddingTop: '105px',
          bgcolor: '#e0e0e0'
        }}>

          <Typography mb={2} fontWeight={'600'} fontSize={'22'}>
            Dashboard Overview
          </Typography>

          {/* Overview Cards */}
          {(() => {
            const overviewData = [
              { title: 'Total Users', value: '12,543', subtitle: '+12% from last month', icon: <FaUsers /> },
              { title: 'Transactions', value: '3,247', subtitle: '+8% from last month', icon: <FaCreditCard /> },
              { title: 'Active Promo Codes', value: '24', subtitle: '3 expiring soon', icon: <FaTags /> },
              { title: 'Revenue', value: '$45,231', subtitle: '+15% from last month', icon: <FaDollarSign /> },
            ];
            return <OverviewCards data={overviewData} />;
          })()}


          <Box sx={{display: 'flex', width: '100%', gap: 2}}>
            <RecentActivity activities={[
              { icon: null, description: 'New user regisregistration: Dr.Sarah Johson', time: '2 minutes ago', color: '#22c55e' },
              { icon: null, description: 'Transaction completed: $150 consultation', time: '5 minutes ago', color: '#3b82f6' },
              { icon: null, description: 'Promo code created :NEWPATIENT 15', time: '1 hour ago', color: '#a855f7' },
              { icon: null, description: 'Promo code created :NEWPATIENT 20', time: '2 hour ago', color: '#a855f7' },
            ]} />

            <QuickActions actions={[
              { label: 'Approve Pending Users', description: '3 users waiting for approvals' },
              { label: 'Review Transactions', description: '5 transactions need review' },
              { label: 'Update Promo Codes', description: '2 codes expiring this week' },
            ]} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;