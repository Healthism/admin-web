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
import { useDispatch, useSelector } from 'react-redux';
import { getExportUsers, getUsers, suspendUsers } from '../../redux/sagas/users/userSagaAction';
import { getExport } from '../../redux/sagas/transactions/transactionsSagaAction';

const getColumns = (users: any, handleSuspend: (userId: string) => void) => {
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


  // Only add actions column if there are non-Patient/Doctor users
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

        return row.status === 'Active' ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleSuspend(row._id)}
          >
            Suspend
          </Button>
        ) : row.status === 'Inactive' ? (
          ""
        ) : null;
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

  const handleSuspend = (userId: string) => {
    dispatch(suspendUsers({ userId }));
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
                  { label: "Pending", value: "pending" },
                ]}
              />
            </Box>
          </Box>

          <HTable columns={getColumns(users,handleSuspend)} rows={users} defaultRowsPerPage={10} />

        </Box>
      </Box>
    </Box>
  );
};

export default Users;