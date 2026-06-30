import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  InputBase,
  CircularProgress,
} from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  StarOutline as StarIcon,
  PeopleOutline as PeopleIcon,
  FileDownloadOutlined as ExportIcon,
  Star as StarFilled,
  StarHalf as StarHalfIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon,
  SentimentSatisfiedAlt as SentimentIcon,
  MailOutline as MailIcon,
  PhoneOutlined as PhoneIcon,
  ChatBubbleOutline as ReplyIcon,
  PushPin as PinIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/Topbar';
import HTable from '../../components/common/HTable';
import { getFeedback, getWaitlist, exportFeedback, exportWaitlist } from '../../redux/sagas/feedback/feedbackSagaAction';

const SOURCE_OPTIONS = ['All Sources', 'Patient', 'Doctor', 'Lab', 'Pharmacy'];
const RATING_OPTIONS = ['Rating', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];
const DATE_OPTIONS = ['All time', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
const WAITLIST_ROLE_OPTIONS = ['All Roles', 'doctor', 'user'];

const SOURCE_COLOR_MAP: Record<string, string> = {
  Patient: '#E0F4F7',
  Doctor: '#E8EEFD',
  Lab: '#efe0f7',
  Pharmacy: '#E3F5EE',
};

const getSourceColor = (source: string) => {
  for (const key of Object.keys(SOURCE_COLOR_MAP)) {
    if (source?.toLowerCase().includes(key.toLowerCase())) return SOURCE_COLOR_MAP[key];
  }
  return '#6b7280';
};

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<StarFilled key={i} sx={{ fontSize: 16, color: '#f59e0b' }} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalfIcon key={i} sx={{ fontSize: 16, color: '#f59e0b' }} />);
    } else {
      stars.push(<StarIcon key={i} sx={{ fontSize: 16, color: '#d1d5db' }} />);
    }
  }
  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>{stars}</Box>;
};

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, { bg: string; color: string }> = {
    New: { bg: '#DBEAFE', color: '#1D4ED8' },
    Reviewed: { bg: '#E0E7FF', color: '#4338CA' },
    Pinned: { bg: '#FEF3C7', color: '#B45309' },
  };
  const c = colorMap[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.color,
        fontWeight: 600,
        fontSize: 12,
        height: 26,
        borderRadius: '6px',
      }}
    />
  );
};

const FilterChip: React.FC<{
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ icon, value, options, onChange }) => {
  return (
    <FormControl size="small">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        IconComponent={ArrowDownIcon}
        sx={{
          bgcolor: '#fff',
          borderRadius: '20px',
          fontSize: 13,
          fontWeight: 500,
          height: 34,
          border: '1px solid #e5e7eb',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            py: 0,
            pl: 1.5,
            pr: 3,
          },
        }}
        renderValue={(val) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {icon}
            <span>{val as string}</span>
          </Box>
        )}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const FeedbackAndWaitlist: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const [source, setSource] = React.useState('All Sources');
  const [rating, setRating] = React.useState('Rating');
  const [dateRange, setDateRange] = React.useState('All time');
  const [selectedReview, setSelectedReview] = React.useState<any>(null);
  const [waitlistRole, setWaitlistRole] = React.useState('All Roles');
  const [waitlistSearch, setWaitlistSearch] = React.useState('');

  const dispatch = useDispatch();
  const { feedback, feedbackSummary, waitlist, waitlistTotal, feedbackLoading, waitlistLoading } = useSelector((state: any) => state.feedback);

  const feedbackList: any[] = Array.isArray(feedback) ? feedback : [];
  const waitlistList: any[] = Array.isArray(waitlist) ? waitlist : [];

  useEffect(() => {
    const payload: any = {};
    if (rating !== 'Rating') {
      payload.rating = parseInt(rating.replace(' Stars', '').replace(' Star', ''));
    }
    if (source !== 'All Sources') {
      payload.source = source;
    }
    if (dateRange !== 'All time') {
      const daysMap: Record<string, number> = { 'Last 7 days': 7, 'Last 30 days': 30, 'Last 90 days': 90 };
      payload.days = daysMap[dateRange];
    }
    dispatch(getFeedback(payload));
  }, [dispatch, source, rating, dateRange]);

  useEffect(() => {
    const payload: any = {};
    if (waitlistRole !== 'All Roles') {
      payload.role = waitlistRole;
    }
    if (waitlistSearch.trim()) {
      payload.search = waitlistSearch.trim();
    }
    dispatch(getWaitlist(payload));
  }, [dispatch, waitlistRole, waitlistSearch]);

  const totalReviewCount = feedbackSummary?.totalReviews || feedbackList.length;
  const avgRating = feedbackSummary?.averageRating
    ? Number(feedbackSummary.averageRating).toFixed(1)
    : feedbackList.length > 0
      ? (feedbackList.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedbackList.length).toFixed(1)
      : '0.0';

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', margin: 0 }}>
        <TopBar />
        <Box sx={{ flexGrow: 1, padding: 2, paddingTop: '105px', bgcolor: '#e0e0e0', overflowY: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ mb: 0.5 }}>
            <Typography fontWeight={700} fontSize={24}>Feedback & Waitlist</Typography>
            <Typography fontSize={14} color="text.secondary">
              Reviews, ratings and website waitlist across every Healthizm platform
            </Typography>
          </Box>

          {/* Stat Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, my: 3 }}>
            {/* Total Reviews */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: '0 1px 4px 0 rgba(16,30,54,0.06)', border: '1px solid #f0f0f0' }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChatIcon sx={{ fontSize: 28, color: '#00a6bb' }} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize={32} lineHeight={1.1}>{totalReviewCount.toLocaleString()}</Typography>
                <Typography fontSize={13} color="text.secondary" fontWeight={500} mt={0.25}>Total Reviews</Typography>
              </Box>
            </Box>
            {/* Average Rating */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: '0 1px 4px 0 rgba(16,30,54,0.06)', border: '1px solid #f0f0f0' }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarFilled sx={{ fontSize: 28, color: '#f59e0b' }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography fontWeight={700} fontSize={32} lineHeight={1.1}>{avgRating}</Typography>
                  <Typography fontSize={14} color="text.secondary" fontWeight={500}>/ 5.0</Typography>
                </Box>
                <Typography fontSize={13} color="text.secondary" fontWeight={500} mt={0.25}>Average Rating</Typography>
                <Box sx={{ mt: 0.5 }}><RatingStars rating={parseFloat(avgRating)} /></Box>
              </Box>
            </Box>
            {/* Waitlist Requests */}
            <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: '0 1px 4px 0 rgba(16,30,54,0.06)', border: '1px solid #f0f0f0' }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon sx={{ fontSize: 28, color: '#00a6bb' }} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize={32} lineHeight={1.1}>{(waitlistTotal || waitlistList.length).toLocaleString()}</Typography>
                <Typography fontSize={13} color="text.secondary" fontWeight={500} mt={0.25}>Waitlist Requests</Typography>
              </Box>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: '2px solid #e5e7eb', mb: 2 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                minHeight: 40,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  minHeight: 40,
                  px: 2,
                },
                '& .Mui-selected': { color: '#00a6bb' },
                '& .MuiTabs-indicator': { bgcolor: '#00a6bb', height: 3 },
              }}
            >
              <Tab label="Reviews & Feedback" />
              <Tab label="Waitlist Requests" />
            </Tabs>
          </Box>

          {/* Filters Row */}
          {tab === 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <FilterChip
                    label="All Sources"
                    icon={<ChatIcon sx={{ fontSize: 14 }} />}
                    value={source}
                    options={SOURCE_OPTIONS}
                    onChange={setSource}
                  />
                  <FilterChip
                    label="Rating"
                    icon={<StarFilled sx={{ fontSize: 14, color: '#f59e0b' }} />}
                    value={rating}
                    options={RATING_OPTIONS}
                    onChange={setRating}
                  />
                  <FilterChip
                    label="All time"
                    value={dateRange}
                    options={DATE_OPTIONS}
                    onChange={setDateRange}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  onClick={() => dispatch(exportFeedback({}))}
                  sx={{
                    bgcolor: '#00a6bb',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    '&:hover': { bgcolor: '#008a9a' },
                  }}
                >
                  Export
                </Button>
              </Box>

              {/* Reviews Table */}
              {feedbackLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress sx={{ color: '#00a6bb' }} />
                </Box>
              ) : (
                <HTable
                  columns={[
                    { id: 'reviewId', label: 'Review ID', minWidth: 110, align: 'center' },
                    {
                      id: 'customer', label: 'Customer', minWidth: 160, align: 'center',
                      render: (value: string) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                          <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#00a6bb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography fontSize={11} fontWeight={700} color="#fff">{getInitials(value || '')}</Typography>
                          </Box>
                          <Typography fontSize={13} fontWeight={500} noWrap>{value || 'Unknown'}</Typography>
                        </Box>
                      ),
                    },
                    {
                      id: 'source', label: 'Source', minWidth: 130, align: 'center',
                      render: (value: string) => (
                        <Chip
                          label={value || '—'}
                          size="small"
                          sx={{ bgcolor: getSourceColor(value || ''), color: '#\text.secondary', fontWeight: 500, fontSize: 11, height: 24, borderRadius: '6px', '& .MuiChip-label': { px: 1 } }}
                          // icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff', ml: 1 }} />}
                        />
                      ),
                    },
                    {
                      id: 'rating', label: 'Rating', minWidth: 100, align: 'center',
                      render: (value: number) => <Box sx={{ display: 'flex', justifyContent: 'center' }}><RatingStars rating={value || 0} /></Box>,
                    },
                    {
                      id: 'feedback', label: 'Feedback', minWidth: 150, align: 'center',
                      render: (value: string) => (
                        <Typography fontSize={13} color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{value || '—'}</Typography>
                      ),
                    },
                    {
                      id: 'date', label: 'Date', minWidth: 130, align: 'center',
                      render: (value: string) => (
                        <Box>
                          <Typography fontSize={13} fontWeight={500}>{formatDate(value || '')}</Typography>
                          <Typography fontSize={11} color="text.secondary">{formatTime(value || '')}</Typography>
                        </Box>
                      ),
                    },
                    {
                      id: 'status', label: 'Status', minWidth: 90, align: 'center',
                      render: (value: string) => <StatusChip status={value || 'New'} />,
                    },
                    {
                      id: 'actions', label: '', minWidth: 60, align: 'center',
                      render: (_: any, row: any) => (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setSelectedReview(row)}
                          sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600, borderRadius: '8px', borderColor: '#e5e7eb', color: '#374151', minWidth: 50, py: 0.25, '&:hover': { borderColor: '#00a6bb', color: '#00a6bb' } }}
                        >
                          View
                        </Button>
                      ),
                    },
                  ]}
                  rows={feedbackList}
                  rowKey="_id"
                  defaultRowsPerPage={7}
                  emptyText="No reviews found"
                />
              )}
            </>
          )}

          {/* Waitlist Requests Tab */}
          {tab === 1 && (
            <>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FilterChip
                    label="All Roles"
                    icon={<PeopleIcon sx={{ fontSize: 14 }} />}
                    value={waitlistRole}
                    options={WAITLIST_ROLE_OPTIONS}
                    onChange={setWaitlistRole}
                  />
                  <InputBase
                    placeholder="Search by name, email, phone..."
                    value={waitlistSearch}
                    onChange={e => setWaitlistSearch(e.target.value)}
                    sx={{ px: 2, py: 0.5, bgcolor: '#fff', borderRadius: 2, fontSize: 14, border: '1px solid #e5e7eb', width: 350 }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  onClick={() => dispatch(exportWaitlist(waitlistRole !== 'All Roles' ? { role: waitlistRole } : {}))}
                  sx={{
                    bgcolor: '#00a6bb',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    '&:hover': { bgcolor: '#008a9a' },
                  }}
                >
                  Export
                </Button>
              </Box>

              {waitlistLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress sx={{ color: '#00a6bb' }} />
                </Box>
              ) : (
                <HTable
                  columns={[
                    {
                      id: 'fullName', label: 'Name', minWidth: 160, align: 'center',
                      render: (value: string) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                          <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#00a6bb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography fontSize={11} fontWeight={700} color="#fff">{getInitials(value || '')}</Typography>
                          </Box>
                          <Typography fontSize={13} fontWeight={500} noWrap>{value || '—'}</Typography>
                        </Box>
                      ),
                    },
                    { id: 'email', label: 'Email', minWidth: 180, align: 'center' },
                    {
                      id: 'phoneNumber', label: 'Phone', minWidth: 150, align: 'center',
                      render: (value: string) => <Typography fontSize={13} color="text.secondary">{value || '—'}</Typography>,
                    },
                    {
                      id: 'role', label: 'Role', minWidth: 120, align: 'center',
                      render: (value: string) => (
                        <Chip
                          label={value || '—'}
                          size="small"
                          sx={{ bgcolor: value === 'doctor' ? '#E8EEFD' : value === 'admin' ? '#E3F5EE' : '#E0F4F7', color: 'text.secondary', fontWeight: 500, fontSize: 11, height: 24, borderRadius: '6px', textTransform: 'capitalize' }}
                        />
                      ),
                    },
                    {
                      id: 'registeredAt', label: 'Joined', minWidth: 120, align: 'center',
                      render: (value: string) => <Typography fontSize={13} color="text.secondary">{formatDate(value || '')}</Typography>,
                    },
                  ]}
                  rows={waitlistList}
                  rowKey="_id"
                  defaultRowsPerPage={7}
                  emptyText="No waitlist requests found"
                />
              )}
            </>
          )}

          {/* Review Details Modal */}
          <Dialog
            open={!!selectedReview}
            onClose={() => setSelectedReview(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
          >
            {selectedReview && (() => {
              const rSource = selectedReview.source || '';
              const rName = selectedReview.customer || selectedReview.userName || 'Unknown';
              const rDate = selectedReview.date || selectedReview.createdAt || '';
              const rFeedback = selectedReview.feedback || '—';
              const rRating = selectedReview.rating || 0;
              const rSentiment = selectedReview.sentiment || (rRating >= 4 ? 'Positive' : rRating >= 3 ? 'Neutral' : 'Negative');
              const rConfidence = selectedReview.sentimentConfidence || (rRating >= 4 ? 90 : rRating >= 3 ? 65 : 40);

              return (
                <>
                  <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 0, pt: 2.5, px: 3 }}>
                    <Box>
                      <Typography fontWeight={700} fontSize={18}>Review details</Typography>
                      <Typography fontSize={13} color="text.secondary">{selectedReview.reviewId || selectedReview._id || selectedReview.id}</Typography>
                    </Box>
                    <IconButton onClick={() => setSelectedReview(null)} size="small" sx={{ mt: -0.5 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </DialogTitle>

                  <DialogContent sx={{ px: 3, pt: 2, pb: 3 }}>
                    <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, p: 2, mb: 2.5, mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#00a6bb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Typography fontSize={16} fontWeight={700} color="#fff">{getInitials(rName)}</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography fontWeight={600} fontSize={15}>{rName}</Typography>
                          <Chip label={rSource} size="small" sx={{ bgcolor: getSourceColor(rSource), color: '#000000', fontWeight: 500, fontSize: 11, height: 24, borderRadius: '6px' }} />
                        </Box>
                        {(selectedReview.email || selectedReview.userEmail) && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <MailIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                            <Typography fontSize={12} color="text.secondary">{selectedReview.email || selectedReview.userEmail}</Typography>
                          </Box>
                        )}
                        {(selectedReview.phone || selectedReview.userPhone) && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                            <Typography fontSize={12} color="text.secondary">{selectedReview.phone || selectedReview.userPhone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
                      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, p: 2 }}>
                        <Typography fontSize={11} fontWeight={700} color="text.secondary" textTransform="uppercase" mb={1}>Rating</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RatingStars rating={rRating} />
                          <Typography fontWeight={700} fontSize={18}>{rRating}.0</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, p: 2 }}>
                        <Typography fontSize={11} fontWeight={700} color="text.secondary" textTransform="uppercase" mb={1}>Sentiment</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <SentimentIcon sx={{ fontSize: 20, color: rSentiment === 'Positive' ? '#16a34a' : rSentiment === 'Negative' ? '#dc2626' : '#f59e0b' }} />
                          <Box>
                            <Typography fontWeight={700} fontSize={15} color={rSentiment === 'Positive' ? '#16a34a' : rSentiment === 'Negative' ? '#dc2626' : '#f59e0b'}>{rSentiment}</Typography>
                            <Typography fontSize={11} color="text.secondary">{rConfidence}% confidence</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Typography fontSize={11} fontWeight={700} color="text.secondary" textTransform="uppercase" mb={1}>Details</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
                      <Box>
                        <Typography fontSize={11} color="text.secondary">Platform</Typography>
                        <Typography fontSize={14} fontWeight={600}>{selectedReview.platform || (rSource.includes('App') ? 'App' : 'Web')}</Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={11} color="text.secondary">Source</Typography>
                        <Typography fontSize={14} fontWeight={600}>{rSource}</Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={11} color="text.secondary">App Version</Typography>
                        <Typography fontSize={14} fontWeight={600}>{selectedReview.appVersion || '—'}</Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={11} color="text.secondary">Submitted</Typography>
                        <Typography fontSize={14} fontWeight={600}>{formatDate(rDate)}, {formatTime(rDate)}</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography fontSize={11} fontWeight={700} color="text.secondary" textTransform="uppercase" mb={1}>Feedback</Typography>
                    <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 2, mb: 3, border: '1px solid #f0f0f0' }}>
                      <Typography fontSize={13} lineHeight={1.7} color="text.primary">{rFeedback}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Button variant="contained" startIcon={<ReplyIcon sx={{ fontSize: 18 }} />} sx={{ flex: 1, bgcolor: '#00a6bb', textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.2, fontSize: 14, '&:hover': { bgcolor: '#008a9a' } }}>
                        Send reply
                      </Button>
                      {/* <IconButton sx={{ border: '1px solid #e5e7eb', borderRadius: 2, width: 44, height: 44 }}>
                        <PinIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                      </IconButton> */}
                    </Box>
                  </DialogContent>
                </>
              );
            })()}
          </Dialog>

        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackAndWaitlist;
