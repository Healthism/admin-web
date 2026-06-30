import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  InputBase,
} from '@mui/material';
import CustomSelect from '../../components/common/CustomSelect';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import CustomChip from '../../components/common/CustomChip';
import HTable from '../../components/common/HTable';
import SuspendAccountModal from '../../components/common/SuspendAccountModal';
import RestoreAccountModal from '../../components/common/RestoreAccountModal';
import { useDispatch, useSelector } from 'react-redux';
import { getExportUsers, getUsers, toggleUserStatus } from '../../redux/sagas/users/userSagaAction';

const getColumns = (users: any, onSuspendClick: (row: any) => void, onUnsuspendClick: (row: any) => void) => {
  const baseColumns: any = [
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'role', label: 'Role', minWidth: 80 },
    { id: 'registeredOn', label: 'Registered On', minWidth: 100 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 80,
      render: (value: string) => (
        <CustomChip
          label={value}
          color={value === 'Active' ? 'success' : value === 'Suspended' ? 'error' : value === 'Inactive' ? 'warning' : 'default'}
          variant="filled"
          size="small"
          style={{ textTransform: 'capitalize' }}
        />
      ),
    },
  ];

  const hasActionableUsers = users.some((row: any) => row.role !== 'Patient' && row.role !== 'Doctor');

  if (hasActionableUsers) {
    baseColumns.push({
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      render: (_: any, row: any) => {
        if (row.role === 'Patient' || row.role === 'Doctor') {
          return null;
        }

        if (row.status === 'Active') {
          return (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => onSuspendClick(row)}
            >
              Suspend
            </Button>
          );
        }

        if (row.status === 'Suspended') {
          return (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onUnsuspendClick(row)}
            >
              Unsuspend
            </Button>
          );
        }

        return null;
      },
    });
  }

  return baseColumns;
};

const Users: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users.users);

  const tabNames: Record<number, string> = {
    0: 'patient',
    1: 'doctor',
    2: 'lab',
    3: 'pharmacy',
  };

  const [suspendModalOpen, setSuspendModalOpen] = React.useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  const DURATION_DAYS_MAP: Record<string, number> = {
    '7_days': 7,
    '14_days': 14,
    '30_days': 30,
    '60_days': 60,
    '90_days': 90,
    'permanent': 0,
  };

  const handleSuspendClick = (row: any) => {
    setSelectedUser(row);
    setSuspendModalOpen(true);
  };

  const handleUnsuspendClick = (row: any) => {
    setSelectedUser(row);
    setRestoreModalOpen(true);
  };

  const handleSuspendConfirm = (data: { reasons: string[]; duration: string }) => {
    if (selectedUser) {
      dispatch(toggleUserStatus({
        userId: selectedUser._id,
        type: selectedUser.role,
        action: 'suspend',
        reason: data.reasons.join(', '),
        duration_days: DURATION_DAYS_MAP[data.duration] ?? 30,
      }));
    }
    setSuspendModalOpen(false);
    setSelectedUser(null);
  };

  const handleRestoreConfirm = (data: { reasons: string[]; duration: string }) => {
    if (selectedUser) {
      dispatch(toggleUserStatus({
        userId: selectedUser._id,
        type: selectedUser.role,
        action: 'activate',
        reason: data.reasons.length > 0 ? data.reasons.join(', ') : 'Issue Resolved',
      }));
    }
    setRestoreModalOpen(false);
    setSelectedUser(null);
  };


  useEffect(() => {
    const typeName = tabNames[tab] ?? '';

    // Build payload object with type and optional search/status
    const payload: any = { type: typeName };

    // Add search if it's not empty
    if (search.trim()) {
      payload.search = search.trim();
    }

    // Add status if it's selected and not "All Status"
    if (status && status !== 'All Status') {
      payload.status = status;
    }

    dispatch(getUsers(payload));
  }, [dispatch, tab, search, status]);

  const handleExport = () => {
    dispatch(getExportUsers({ type: tabNames[tab] ?? '' }));
  }


  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', margin: 0 }}>
        <TopBar />
        <Box sx={{ flexGrow: 1, padding: 2, paddingTop: '105px', bgcolor: '#e0e0e0' }}>
          <Typography fontWeight={600} fontSize={22}>Users</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 1 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36 }}>
              <Tab label="Patients" sx={{ minHeight: 36, fontWeight: 600 }} />
              <Tab label="Doctors" sx={{ minHeight: 36, fontWeight: 600 }} />
              <Tab label="Labs" sx={{ minHeight: 36, fontWeight: 600 }} />
              <Tab label="Pharmacies" sx={{ minHeight: 36, fontWeight: 600 }} />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box>
                <Button variant='contained' color="primary" onClick={handleExport} >Export</Button>
              </Box>
              <InputBase
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ px: 2, py: 0.5, bgcolor: '#fff', borderRadius: 2, fontSize: 15, border: '1px solid #e5e7eb', width: 500 }}
              />
              <CustomSelect
                value={status}
                onChange={setStatus}
                placeholder="Select Status"
                width={150}
                options={[
                  { label: "All Status", value: "All Status" },
                  { label: "Active", value: "active" },
                  { label: "Suspended", value: "suspended" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </Box>
          </Box>

          <HTable columns={getColumns(users, handleSuspendClick, handleUnsuspendClick)} rows={users} defaultRowsPerPage={10} />

          <SuspendAccountModal
            open={suspendModalOpen}
            onClose={() => { setSuspendModalOpen(false); setSelectedUser(null); }}
            onConfirm={handleSuspendConfirm}
            user={selectedUser ? {
              name: selectedUser.name,
              role: selectedUser.role,
              registeredOn: selectedUser.registeredOn,
              subscription: selectedUser.subscription,
              activeOrders: selectedUser.activeOrders,
              pendingOrders: selectedUser.pendingOrders,
            } : null}
          />

          <RestoreAccountModal
            open={restoreModalOpen}
            onClose={() => { setRestoreModalOpen(false); setSelectedUser(null); }}
            onConfirm={handleRestoreConfirm}
            user={selectedUser ? {
              name: selectedUser.name,
              role: selectedUser.role,
              suspension: selectedUser.suspension || null,
            } : null}
          />

        </Box>
      </Box>
    </Box>
  );
};

export default Users;