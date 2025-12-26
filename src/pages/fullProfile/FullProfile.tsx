import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/stores/store';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../redux/sagas/profile/profileSagaAction';

const FullProfile: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [openLogout, setOpenLogout] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const adminProfile = useSelector((state: any) => state.profile.adminProfile);




    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getProfile());
    }, []);



    const handleMenuItemClick = (itemId: string) => {
        setSelectedItem(itemId);

        if (itemId === 'logout') {
            setOpenLogout(true);
        }
    };

    const handleCloseLogout = () => setOpenLogout(false);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleEdit = () => {
    }
    const confirmLogout = () => {
        setOpenLogout(false);
        window.localStorage.clear();
        navigate('/');
        window.location.reload();
    };



    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#e0e0e0' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <TopBar notifications={[]} />

                {/* Body */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 2, paddingTop: '105px', bgcolor: '#e0e0e0' }}>
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', height: 'calc(100vh - 137px)' }}>

                        {/* Left Menu */}

                        <Paper sx={{ flex: 1, borderRadius: '8px', overflow: 'hidden', height: '100%', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', }} >
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e0e0e0', flexShrink: 0, }} >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>


                                        {/* Text container */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1976d2',
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {'Personal Information'}
                                            </Typography>


                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Profile Details */}
                            <Box sx={{ padding: '20px', flexGrow: 1, overflow: 'auto', }} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Full Name </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.personal_info?.full_name} </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}> <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Phone number </Typography> </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.personal_info?.phone_number || 'Not available'} </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Email </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.personal_info?.email || 'Not available'} </Typography>
                                    </Box>  </Box> </Box> </Paper>

                        {/* Right Profile (unchanged for now) */}
                        <Paper sx={{ flex: 1, borderRadius: '8px', overflow: 'hidden', height: '100%', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', }} >
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e0e0e0', flexShrink: 0, }} >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>


                                        {/* Text container */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1976d2',
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {'Organization Information'}
                                            </Typography>


                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Profile Details */}
                            <Box sx={{ padding: '20px', flexGrow: 1, overflow: 'auto', }} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Organization Name </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.organization_name} </Typography>
                                    </Box> <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Address </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.address} </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}> <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Phone number </Typography> </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.phone_number || 'Not available'} </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Website </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.website} </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > Email </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.email || 'Not available'} </Typography>
                                    </Box>  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }} >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, marginBottom: '4px', }} > GST </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#333', fontSize: '14px', fontWeight: 400, textAlign: 'right', minWidth: '100px', }} > {adminProfile?.organization_info?.gst || 'Not available'} </Typography>
                                    </Box> </Box> </Box> </Paper>
                    </Box>
                </Box>
            </Box>

            {/* Logout Modal */}
            <Dialog open={openLogout} onClose={handleCloseLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to log out?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLogout}>Cancel</Button>
                    <Button onClick={confirmLogout} color="primary" variant="contained">Logout</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>This action cannot be undone. Are you sure you want to delete your account?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FullProfile;
