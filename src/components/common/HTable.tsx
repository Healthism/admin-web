import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableFooter,
  TablePagination,
  Paper,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  render?: (value: any, row: any) => React.ReactNode;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface CustomTableProps {
  columns: Column[];
  rows: any[];
  rowKey?: string;
  emptyText?: string;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: (number | { label: string; value: number })[];
}

const HTable: React.FC<CustomTableProps> = ({ 
  columns, 
  rows, 
  rowKey = 'id', 
  emptyText = 'No data',
  defaultRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 25, { label: 'All', value: -1 }]
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);

  // Reset page when rows change or when page is out of bounds
  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [rows.length, rowsPerPage, page]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the rows to display
  const displayRows = rowsPerPage > 0
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  // Show pagination only if rows are more than 5
  const showPagination = rows.length > 5;

  return (
    <TableContainer 
      component={Paper} 
      style={{ 
        borderRadius: 16, 
        boxShadow: '0 2px 8px 0 rgba(16,30,54,0.04)', 
        border: '1px solid #f3f3f3' 
      }}
    >
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                style={{ 
                  minWidth: column.minWidth || 80, 
                  fontWeight: 700, 
                  background: '#f9fafb', 
                  fontSize: 15 
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            displayRows.map((row, idx) => {
              const rowIndex = page * rowsPerPage + idx;
              return (
                <TableRow key={row[rowKey] || rowIndex} hover>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render ? column.render(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
        {showPagination && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={columns.length}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default HTable;