/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Box, Typography, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, SxProps } from '@mui/material';
import { FaRegEdit } from "react-icons/fa";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Pagination } from '../Pagination';
import { GenericItem, ColumnConfig } from '../../types/table';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import { Tooltip } from '@mui/material';

interface TableProps<T extends GenericItem> {
  items?: T[];
  columns: ColumnConfig<T>[];
  error: string | null;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onMedicalHistory?: (item: T) => void;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  sx?: SxProps;
  enableEdit?: boolean;
  enableDelete?: boolean;
  enableMedicalHistory?: boolean;
}

export const Table = <T extends GenericItem>({
  items = [],
  columns,
  error,
  onEdit,
  onDelete,
  onMedicalHistory,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  loading = false,
  sx,
  enableEdit = true,
  enableDelete = true,
  enableMedicalHistory = true,
}: TableProps<T>) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const handleConfirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
    }
    setItemToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleEdit = (item: T) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleMedicalHistory = (item: T) => {
    if (onMedicalHistory) {
      onMedicalHistory(item);
    }
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
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {enableEdit && onEdit && (
                      <Tooltip title="Editar" placement="bottom">
                        <IconButton onClick={() => handleEdit(item)}>
                          <FaRegEdit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {enableDelete && onDelete && (
                      <Tooltip title="Eliminar" placement="bottom">
                        <IconButton
                          onClick={() => {
                            setItemToDelete(item);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <DeleteOutlineIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {enableMedicalHistory && onMedicalHistory && (
                      <Tooltip title="Historial Médico" placement="bottom">
                        <IconButton onClick={() => handleMedicalHistory(item)}>
                          <FolderCopyOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(!enableEdit || !onEdit) &&
                      (!enableDelete || !onDelete) &&
                      (!enableMedicalHistory || !onMedicalHistory) && (
                        <Typography variant="body2" color="textSecondary">
                          -
                        </Typography>
                      )}
                  </Box>
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