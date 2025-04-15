/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, Typography, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, SxProps } from '@mui/material';
import { FaRegEdit } from "react-icons/fa";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Pagination } from '../Pagination';
import { GenericItem, ColumnConfig } from '../../types/table';

interface TableProps<T extends GenericItem> {
  items?: T[];
  columns: ColumnConfig<T>[];
  error: string | null;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  sx?: SxProps;
}

export const Table = <T extends GenericItem>({
  items = [],
  columns,
  error,
  onEdit,
  onDelete,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  loading = false,
  sx,
}: TableProps<T>) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const handleConfirmDelete = () => {
    if (itemToDelete) onDelete(itemToDelete);
    setItemToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleEdit = (item: T) => {
    onEdit(item);
  };

  const toReactNode = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    return String(value);
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!items || items.length === 0) return <Typography variant="h6">No se encontraron elementos</Typography>;

  return (
    <Box sx={sx}>
      <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0", borderRadius: '12px', overflow: 'hidden' }}>
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key as string}
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    padding: "16px 24px",
                    width: col.width || `${100 / columns.length}%`,
                    textAlign: "center",
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
              <TableCell sx={{ color: "black", fontWeight: "bold", padding: "16px 24px", width: '15%', textAlign: "center" }}>
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, rowIndex) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                  >
                    {col.render
                      ? col.render(item, rowIndex, { currentPage, pageSize })
                      : toReactNode((item as any)[col.key as string])}
                  </TableCell>
                ))}
                <TableCell sx={{ padding: "16px 24px", textAlign: "center" }}>
                  <IconButton onClick={() => handleEdit(item)}>
                    <FaRegEdit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setItemToDelete(item);
                    setOpenDeleteDialog(true);
                  }}>
                    <DeleteOutlineIcon sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás segura de eliminar "${(itemToDelete as any)?.typeOfSpecialty || (itemToDelete as any)?.names || 'este elemento'}"?`}
      />
    </Box>
  );
};

export default Table;