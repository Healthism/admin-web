import React, { useEffect } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import OverviewCards from '../../components/dashboard/OverviewCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';
import { FaUsers, FaCreditCard, FaTags, FaRupeeSign } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../../redux/sagas/dashboard/dashboardSagaAction';
import TransactionGraph from '../../components/dashboard/TransactionGraph';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, overview, recent_activity } = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
      }}>
        <TopBar />

        <Box sx={{
          flexGrow: 1,
          padding: 2,
          paddingTop: '105px',
          bgcolor: '#e0e0e0'
        }}>

          <Typography fontWeight={'600'} fontSize={'22px'}>
            Dashboard Overview
          </Typography>

          {/* Overview Cards */}
          {(() => {
            const overviewData = [
              { title: 'Total Users', value: overview.total_users || '', subtitle: '+12% from last month', icon: <FaUsers /> },
              { title: 'Transactions', value: overview.transactions || '', subtitle: '+8% from last month', icon: <FaCreditCard /> },
              { title: 'Active Promo Codes', value: overview.active_promo_codes || '', subtitle: '3 expiring soon', icon: <FaTags /> },
              { title: 'Revenue', value: `₹${overview.revenue || ''}`, subtitle: '+15% from last month', icon: <FaRupeeSign /> },
            ];
            return <OverviewCards data={overviewData} />;
          })()}


          <Box sx={{ display: 'flex', width: '100%', gap: 2.5 }}>
            <RecentActivity activities={recent_activity} />
 <TransactionGraph/>
            {/* <QuickActions actions={[
              { label: 'Approve Pending Users', description: '3 users waiting for approvals' },
              { label: 'Review Transactions', description: '5 transactions need review' },
              { label: 'Update Promo Codes', description: '2 codes expiring this week' },
            ]} /> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;