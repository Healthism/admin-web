import React from 'react';
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

const userRows = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Patient',
    registeredOn: '15/01/2024',
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Wilson',
    role: 'Patient',
    registeredOn: '12/01/2024',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Mike Smith',
    role: 'Patient',
    registeredOn: '10/01/2024',
    status: 'suspended',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    role: 'Patient',
    registeredOn: '08/01/2024',
    status: 'suspended',
  },
  {
    id: 5,
    name: 'Tom Brown',
    role: 'Patient',
    registeredOn: '05/01/2024',
    status: 'active',
  },
  {
    id: 6,
    name: 'Emma Davis',
    role: 'Patient',
    registeredOn: '03/01/2024',
    status: 'pending',
  },
];

const columns: any = [
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
        color={value === 'active' ? 'success' : value === 'suspended' ? 'error' : value === 'pending' ? 'warning' : 'default'}
        variant="filled"
        size="small"
        style={{ textTransform: 'capitalize' }}
      />
    ),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 100,
    render: (_: any, row: any) => (
      row.status === 'active' ? (
        <Button variant="contained" color="error" size="small">Suspend</Button>
      ) : row.status === 'pending' ? (
        <Button variant="contained" color="success" size="small">Approve</Button>
      ) : null
    ),
  },
];

const Users: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

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
            <Box sx={{ display: 'flex', gap: 2 }}>
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

          {/* User Table */}
          <HTable columns={columns} rows={userRows} defaultRowsPerPage={5} />

        </Box>
      </Box>
    </Box>
  );
};

export default Users;