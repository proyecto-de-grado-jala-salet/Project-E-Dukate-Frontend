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
import { TbCalendarX, TbCalendarTime, TbCalendarCheck } from "react-icons/tb";
import dayjs from "dayjs";
import "dayjs/locale/es";

interface TableProps<T extends GenericItem> {
  items?: T[];
  columns: ColumnConfig<T>[];
  error: string | null;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onReschedule?: (item: T) => void;
  onMedicalHistory?: (item: T) => void;
  onCancel?: (item: T) => void;
  onConfirm?: (item: T) => void;
  enableCancel?: boolean;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  sx?: SxProps;
  enableEdit?: boolean;
  enableDelete?: boolean;
  enableReschedule?: boolean;
  enableMedicalHistory?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string | number;
  selectedDate?: Date | null;
}

export const Table = <T extends GenericItem>({
  items = [],
  columns,
  error,
  onEdit,
  onDelete,
  onReschedule,
  onMedicalHistory,
  onCancel,
  onConfirm,
  enableCancel = true,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  loading = false,
  sx,
  enableEdit = true,
  enableDelete = true,
  enableReschedule = true,
  enableMedicalHistory = true,
  emptyMessage,
  keyExtractor = (item) => item.id,
  selectedDate,
}: TableProps<T>) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const isPastDate = (date: Date | null | undefined): boolean => {
    if (!date) return false;
    return dayjs(date).isBefore(dayjs().startOf("day"));
  };

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

  const handleReschedule = (item: T) => {
    if (onReschedule) {
      onReschedule(item);
    }
  };

  const handleMedicalHistory = (item: T) => {
    if (onMedicalHistory) {
      onMedicalHistory(item);
    }
  };

  const handleConfirm = (item: T) => {
    if (onConfirm) {
      onConfirm(item);
    }
  };

  const toReactNode = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    return String(value);
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!items || items.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', padding: 2 }}>
        {emptyMessage || "No se encontraron elementos"}
      </Typography>
    );
  }

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
              <TableRow key={keyExtractor(item)}>
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
                  {item.status === "Cancelled" ? (
                    <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {enableEdit && onEdit && (
                        <Tooltip title="Editar" placement="bottom">
                          <IconButton onClick={() => handleEdit(item)}>
                            <FaRegEdit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {enableReschedule && onReschedule && (
                        <Tooltip
                          title={isPastDate(selectedDate) ? "No puedes Reprogramar la Sesión pasada" : "Reprogramar sesión"}
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              onClick={() => handleReschedule(item)}
                              disabled={item.status === "Confirmed" || isPastDate(selectedDate)}
                              sx={{
                                opacity: item.status === "Confirmed" || isPastDate(selectedDate) ? 0.5 : 1,
                                color: '#454545',
                                '&:hover': {
                                  color: item.status === "Confirmed" || isPastDate(selectedDate) ? '#9F9F9F' : '#1B74B4',
                                },
                              }}
                            >
                              <TbCalendarTime />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      {enableCancel && onCancel && (
                        <Tooltip
                          title={isPastDate(selectedDate) ? "No puedes Cancelar la Sesión pasada" : "Cancelar sesión"}
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              onClick={() => onCancel(item)}
                              disabled={item.status === "Confirmed" || isPastDate(selectedDate)}
                              sx={{
                                opacity: item.status === "Confirmed" || isPastDate(selectedDate) ? 0.5 : 1,
                                color: '#454545',
                                '&:hover': {
                                  color: item.status === "Confirmed" || isPastDate(selectedDate) ? '#9F9F9F' : 'red',
                                },
                              }}
                            >
                              <TbCalendarX />
                            </IconButton>
                          </span>
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
                      {onConfirm && (
                        <Tooltip
                          title={isPastDate(selectedDate) ? "No puedes Confirmar la Sesión pasada" : "Confirmar sesión"}
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              onClick={() => handleConfirm(item)}
                              disabled={item.status === "Confirmed" || isPastDate(selectedDate)}
                              sx={{
                                opacity: item.status === "Confirmed" || isPastDate(selectedDate) ? 0.5 : 1,
                                color: '#454545',
                                '&:hover': {
                                  color: item.status === "Confirmed" || isPastDate(selectedDate) ? '#9F9F9F' : '#178F0C',
                                },
                              }}
                            >
                              <TbCalendarCheck />
                            </IconButton>
                          </span>
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
                        (!enableReschedule || !onReschedule) &&
                        (!onConfirm) &&
                        (!enableMedicalHistory || !onMedicalHistory) && (
                          <Typography variant="body2" color="textSecondary">
                            -
                          </Typography>
                        )}
                    </Box>
                  )}
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
        title="🗑️ Confirmar Eliminación"
        message={`¿Estás segura de eliminar "${(itemToDelete as any)?.typeOfSpecialty || (itemToDelete as any)?.names || 'este elemento'}"?`}
      />
    </Box>
  );
};

export default Table;