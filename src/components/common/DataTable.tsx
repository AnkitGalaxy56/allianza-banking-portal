import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;
  width?: number | string;
  maxWidth?: number;
  nowrap?: boolean;
  /** Truncate long cell content and expose the full value in the browser title. */
  truncate?: boolean;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  /** Compact is the default to keep tables information-dense across the portal. */
  cellPadding?: 'compact' | 'comfortable';
  /** Extra-dense rows for request queues that should fit more records in the viewport. */
  dense?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  tableLayout?: 'auto' | 'fixed';
  hover?: boolean;
}

export default function DataTable<T>({
  rows,
  columns,
  getRowId,
  onRowClick,
  emptyMessage = 'No records found.',
  cellPadding = 'compact',
  dense = false,
  stickyHeader = false,
  maxHeight,
  tableLayout = 'auto',
  hover = true,
}: DataTableProps<T>) {
  const compact = cellPadding === 'compact';
  const cellSx = {
    px: compact ? 1.25 : 2,
    py: dense ? 0.35 : compact ? 0.75 : 1.5,
    fontSize: dense ? 11.75 : compact ? 12.5 : 13,
    lineHeight: dense ? 1.2 : 1.4,
    borderColor: 'divider',
  } as const;

  return (
    <TableContainer
      sx={{
        width: '100%',
        maxHeight,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: 6, width: 6 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'action.disabled',
          borderRadius: 8,
        },
      }}
    >
      <Table
        size="small"
        stickyHeader={stickyHeader}
        sx={{
          width: '100%',
          tableLayout,
          '& .MuiTableCell-root': { boxSizing: 'border-box' },
          ...(dense ? {
            '& .MuiButton-root': { minHeight: 24, py: 0.15, px: 0.75, fontSize: 11 },
            '& .MuiChip-root': { height: 20, fontSize: 10.5 },
            '& .MuiChip-label': { px: 0.75 },
          } : {}),
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align ?? 'left'}
                sx={{
                  ...cellSx,
                  minWidth: column.minWidth,
                  width: column.width,
                  maxWidth: column.maxWidth,
                  whiteSpace: 'nowrap',
                  color: 'text.secondary',
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.035em',
                  bgcolor: 'action.hover',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowId(row)}
              hover={hover}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-child td': { borderBottom: 0 },
              }}
            >
              {columns.map((column) => {
                const rawValue = (row as unknown as Record<string, unknown>)[column.key];
                const content = column.render ? column.render(row) : String(rawValue ?? '—');
                return (
                  <TableCell
                    key={column.key}
                    align={column.align ?? 'left'}
                    title={column.truncate && typeof content === 'string' ? content : undefined}
                    sx={{
                      ...cellSx,
                      minWidth: column.minWidth,
                      width: column.width,
                      maxWidth: column.maxWidth,
                      whiteSpace: column.nowrap || column.truncate ? 'nowrap' : 'normal',
                      overflow: column.truncate ? 'hidden' : undefined,
                      textOverflow: column.truncate ? 'ellipsis' : undefined,
                    }}
                  >
                    {content}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={Math.max(columns.length, 1)}
                align="center"
                sx={{ py: 4, px: 1.5, color: 'text.secondary', fontSize: 13 }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

