import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;
  nowrap?: boolean;
}
interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}
export default function DataTable<T>({
  rows, columns, getRowId, onRowClick, emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align ?? 'left'} sx={{
                minWidth: column.minWidth, whiteSpace: 'nowrap', color: 'text.secondary',
                fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em',
              }}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)} hover onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default', '& td': { borderColor: 'divider' } }}>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align ?? 'left'}
                  sx={{ minWidth: column.minWidth, whiteSpace: column.nowrap ? 'nowrap' : 'normal' }}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 5, color: 'text.secondary' }}>
              {emptyMessage}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
